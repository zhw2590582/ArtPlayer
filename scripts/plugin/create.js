const fs = require('fs');
const path = require('path');

// 获取插件名称
const pluginName = process.argv[2];
if (!pluginName) {
    console.error('请提供插件名称，例如：node ./scripts/plugin/create.js somePluginName');
    process.exit(1);
}

// 定义路径
const templateDir = path.join(__dirname, 'template');
const destDir = path.join(__dirname, '../../packages', `artplayer-plugin-${pluginName}`);

// 创建目标目录
fs.mkdirSync(destDir, { recursive: true });

// 读取模板目录中的文件并复制到目标目录
function copyTemplateFiles(templateDir, destDir) {
    const files = fs.readdirSync(templateDir);

    files.forEach((file) => {
        const templateFilePath = path.join(templateDir, file);
        const destFilePath = path.join(destDir, file);

        const stats = fs.statSync(templateFilePath);

        if (stats.isDirectory()) {
            fs.mkdirSync(destFilePath, { recursive: true });
            copyTemplateFiles(templateFilePath, destFilePath);
        } else {
            let content = fs.readFileSync(templateFilePath, 'utf8');

            // 替换占位符
            content = content.replace(/{{name}}/g, pluginName);
            content = content.replace(
                /{{export}}/g,
                `artplayerPlugin${pluginName.charAt(0).toUpperCase() + pluginName.slice(1)}`,
            );

            fs.writeFileSync(destFilePath, content);
        }
    });
}

// 开始复制模板文件
copyTemplateFiles(templateDir, destDir);

console.log(`插件 ${pluginName} 已成功创建在 ${destDir}`);
