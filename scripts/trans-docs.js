import fs from 'fs';
import cpy from 'cpy';
import path from 'path';
import axios from 'axios';
import { glob } from 'glob';
import { removeDir } from './utils.js';
import dotenv from 'dotenv';

dotenv.config();

function splitMarkdown(text, maxChars) {
    const parts = [];
    let currentPart = '';
    let inCodeBlock = false;
    let inSpecialBlock = false;

    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // 检测代码块
        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock;
        }

        // 检测特殊块
        if (line.trim().startsWith(':::')) {
            inSpecialBlock = !inSpecialBlock;
        }

        // 添加当前行到当前部分
        currentPart += line + '\n';

        // 检测是否达到字符限制
        if (!inCodeBlock && !inSpecialBlock && currentPart.length > maxChars && i < lines.length - 1) {
            parts.push(currentPart);
            currentPart = '';
        }
    }

    // 添加最后一部分
    if (currentPart !== '') {
        parts.push(currentPart);
    }

    return parts;
}

const translateContent = async (content, targetLanguage) => {
    try {
        const TRANSLATE_URL = process.env.TRANSLATE_URL;
        const response = await axios.post(
            TRANSLATE_URL,
            {
                content: `The following text is written in VitePress's extended Markdown syntax, Please translate it into ${targetLanguage}, and keep the Markdown format and don't add your explanation:\n\n${content}`,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 60000,
            },
        );
        return response.data.data;
    } catch (error) {
        console.error(error.message);
        return content;
    }
};

const translateMarkdownFiles = async (filePaths, targetLanguage, maxCharsPerRequest) => {
    let totalParts = 0;
    let translatedPartsCount = 0;

    for (const filePath of filePaths) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const parts = splitMarkdown(content, maxCharsPerRequest);
        totalParts += parts.length;
    }

    console.log(`开始翻译 ${filePaths.length} 个文件，总共 ${totalParts} 部分。`);

    for (const filePath of filePaths) {
        console.log(`翻译开始: ${filePath}`);

        const content = fs.readFileSync(filePath, 'utf-8');
        const parts = splitMarkdown(content, maxCharsPerRequest);
        const translatedParts = [];

        for (const part of parts) {
            const translatedPart = await translateContent(part, targetLanguage);
            translatedParts.push(translatedPart);
            translatedPartsCount++;
            const progressPercentage = ((translatedPartsCount / totalParts) * 100).toFixed(2);
            console.log(`总体翻译进度: ${progressPercentage}%`);
        }

        const translatedContent = translatedParts.join('\n');
        fs.writeFileSync(filePath, translatedContent);
        console.log(`翻译结束: ${filePath}`);
    }
};

(async () => {
    const basePath = 'packages/artplayer-vitepress/docs';
    const enPath = 'packages/artplayer-vitepress/docs/en';
    removeDir(enPath);
    cpy(path.resolve(basePath, 'index.md'), path.resolve(enPath));
    const dirs = ['advanced', 'component', 'library', 'plugin', 'start'];
    for (let index = 0; index < dirs.length; index++) {
        const dir = dirs[index];
        await cpy(path.resolve(basePath, dir), path.resolve(enPath, dir), { flat: true });
    }
    const mdsPaths = glob.sync(path.resolve(enPath, '**/*.md'));
    const maxCharsPerRequest = 512;
    await translateMarkdownFiles(mdsPaths, 'English', maxCharsPerRequest);
})();
