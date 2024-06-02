import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the plugin name from command line arguments
const args = process.argv.slice(2);
const pluginName = args[0];

if (!pluginName) {
    console.error('Please provide a plugin name, e.g., npm run create:plugin somePluginName');
    process.exit(1);
}

// Validate plugin name
const pluginNameRegex = /^[a-z-]+$/;
if (!pluginNameRegex.test(pluginName)) {
    console.error('Invalid plugin name. Only lowercase letters and hyphens are allowed.');
    process.exit(1);
}

// Convert plugin name to export name (PascalCase)
const exportName = pluginName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
const exportNameFull = `artplayerPlugin${exportName}`;

// Define paths
const templateDir = path.join(__dirname, 'template');
const destDir = path.join(__dirname, '../../packages', `artplayer-plugin-${pluginName}`);
const exampleDir = path.join(__dirname, '../../docs/assets/example');
const exampleFileName = `${pluginName.replace(/-/g, '.')}.js`;
const exampleFile = path.join(exampleDir, exampleFileName);

// Check if a plugin with the same name already exists
if (fs.existsSync(destDir)) {
    console.error(`Plugin ${pluginName} already exists. Please choose another name.`);
    process.exit(1);
}

// Create the destination directory
fs.mkdirSync(destDir, { recursive: true });

// Read files from the template directory and copy them to the destination directory
function copyTemplateFiles(templateDir, destDir) {
    const files = fs.readdirSync(templateDir);

    files.forEach((file) => {
        const templateFilePath = path.join(templateDir, file);
        let destFilePath = path.join(destDir, file);

        const stats = fs.statSync(templateFilePath);

        if (stats.isDirectory()) {
            fs.mkdirSync(destFilePath, { recursive: true });
            copyTemplateFiles(templateFilePath, destFilePath);
        } else {
            // Replace placeholders in the file name
            destFilePath = destFilePath.replace(/{{name}}/g, pluginName);

            let content = fs.readFileSync(templateFilePath, 'utf8');

            // Replace placeholders in the file content
            content = content.replace(/{{name}}/g, pluginName);
            content = content.replace(/{{export}}/g, exportNameFull);

            fs.writeFileSync(destFilePath, content);
        }
    });
}

// Create the example file
function createExampleFile() {
    const exampleContent = `
// npm i artplayer-plugin-${pluginName}
// import ${exportNameFull} from 'artplayer-plugin-${pluginName}';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        ${exportNameFull}({
            //
        }),
    ],
});
    `.trim();

    if (!fs.existsSync(exampleDir)) {
        fs.mkdirSync(exampleDir, { recursive: true });
    }

    fs.writeFileSync(exampleFile, exampleContent);
    console.log(`Example file created at ${exampleFile}`);
}

// Start copying template files and creating example file
copyTemplateFiles(templateDir, destDir);
createExampleFile();

console.log(`Plugin ${pluginName} has been successfully created at ${destDir}`);
