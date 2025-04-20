import fs from 'fs';
import cpy from 'cpy';
import path from 'path';
import { glob } from 'glob';
import { removeDir } from './utils.js';
import dotenv from 'dotenv';

dotenv.config();

// 配置常量
const MAX_CHARS_PER_REQUEST = 512;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒
const BASE_PATH = 'packages/artplayer-vitepress/docs';
const EN_PATH = 'packages/artplayer-vitepress/docs/en';
const COPY_DIRS = ['advanced', 'component', 'library', 'plugin', 'start'];

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

async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (retries > 0) {
            console.log(`Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
    }
}

const translateContent = async (content, targetLanguage) => {
    try {
        const TRANSLATE_URL = process.env.TRANSLATE_URL;
        if (!TRANSLATE_URL) {
            throw new Error('TRANSLATE_URL is not defined in environment variables');
        }

        const response = await fetchWithRetry(TRANSLATE_URL, {
            method: 'POST',
            body: JSON.stringify({
                content: `The following text is written in VitePress's extended Markdown syntax, Please translate it into ${targetLanguage}, and keep the Markdown format and don't add your explanation:\n\n${content}`,
            }),
        });

        return response.data;
    } catch (error) {
        console.error(`Translation failed: ${error.message}`);
        return content; // 返回原文作为回退
    }
};

class ProgressTracker {
    constructor(totalParts) {
        this.totalParts = totalParts;
        this.translatedPartsCount = 0;
    }

    update() {
        this.translatedPartsCount++;
        const progressPercentage = ((this.translatedPartsCount / this.totalParts) * 100).toFixed(2);
        console.log(`Overall progress: ${progressPercentage}% (${this.translatedPartsCount}/${this.totalParts})`);
    }
}

const translateMarkdownFiles = async (filePaths, targetLanguage, maxCharsPerRequest) => {
    // 先计算总共有多少部分需要翻译
    let totalParts = 0;
    for (const filePath of filePaths) {
        const content = fs.readFileSync(filePath, 'utf-8');
        totalParts += splitMarkdown(content, maxCharsPerRequest).length;
    }

    console.log(`Starting translation of ${filePaths.length} files, total ${totalParts} parts.`);
    const progressTracker = new ProgressTracker(totalParts);

    for (const filePath of filePaths) {
        console.log(`Translating: ${path.relative(EN_PATH, filePath)}`);

        const content = fs.readFileSync(filePath, 'utf-8');
        const parts = splitMarkdown(content, maxCharsPerRequest);
        const translatedParts = [];

        for (const part of parts) {
            const translatedPart = await translateContent(part, targetLanguage);
            translatedParts.push(translatedPart);
            progressTracker.update();
        }

        const translatedContent = translatedParts.join('\n');
        fs.writeFileSync(filePath, translatedContent);
    }
};

async function setupDirectoryStructure() {
    // 清理并创建目录结构
    removeDir(EN_PATH);
    await cpy(path.resolve(BASE_PATH, 'index.md'), path.resolve(EN_PATH));

    // 并行复制所有目录
    await Promise.all(
        COPY_DIRS.map((dir) => cpy(path.resolve(BASE_PATH, dir), path.resolve(EN_PATH, dir), { flat: true })),
    );
}

(async () => {
    try {
        await setupDirectoryStructure();
        const mdsPaths = glob.sync(path.resolve(EN_PATH, '**/*.md'));
        await translateMarkdownFiles(mdsPaths, 'English', MAX_CHARS_PER_REQUEST);
        console.log('Translation completed successfully!');
    } catch (error) {
        console.error('Translation failed:', error);
        process.exit(1);
    }
})();
