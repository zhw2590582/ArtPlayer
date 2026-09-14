# Codicons
 
[![NPM Version](https://img.shields.io/npm/v/@vscode/codicons)](https://www.npmjs.com/package/@vscode/codicons)
[![NPM Downloads](https://img.shields.io/npm/dw/@vscode/codicons)](https://www.npmjs.com/package/@vscode/codicons)
[![Build Status](https://github.com/microsoft/vscode-codicons/actions/workflows/build.yml/badge.svg)](https://github.com/microsoft/vscode-codicons/actions/workflows/build.yml)
[![CodeQL Status](https://github.com/microsoft/vscode-codicons/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/microsoft/vscode-codicons/actions/workflows/build.yml)

![codicons preview of the icons](https://raw.githubusercontent.com/microsoft/vscode-codicons/main/preview.png)

This tool takes the Visual Studio Code icons and converts them into an icon font using [fantasticon](https://github.com/tancredi/fantasticon).

## Install
You can use the [npm package](https://www.npmjs.com/package/@vscode/codicons) and install into your project via:

```
npm i @vscode/codicons
```

_Note: We've deprecated `vscode-codicons` in favor of `@vscode/codicons`_

If you're building a VS Code extension, see this [webview extension sample](https://github.com/microsoft/vscode-extension-samples/tree/master/webview-codicons-sample) on how to integrate.

# Building Locally

All icons are stored under `src > icons`. The mappings of the class names and unicode characters are stored in `src/template/mapping.json` as well as the default styles under `src/template/styles.hbs`.

## Install dependencies
After cloning this repo, install dependencies by running:

```
npm install
```

## Build

```
npm run build
```

Output will be exported to a `dist` folder. We track this folder so that we can see the updated changes to the unicode characters.

## Update packages

You can run `npm outdated` to see if there are any package updates. To update packages, run:

```
npm update
```

## Add icons

Export your icons (svg) to the `src/icons` folder and add an entry into `src/template/mapping.json` with a new codepoint key (this gets converted into a unicode key) and run the the build command. The build command will also remove any subfolders in the `icons` folder to keep the folder structure consistent.

Next, update the [codicons file](https://github.com/microsoft/vscode/blob/master/src/vs/base/common/codicons.ts) on the vscode repository, ensuring that the unicode characters are the same (you can reference the [css file](https://github.com/microsoft/vscode-codicons/blob/master/dist/codicon.css)).


## Using CSS Classes

If you're building a VS Code extension, see this [webview extension sample](https://github.com/microsoft/vscode-extension-samples/tree/master/webview-codicons-sample) on how to integrate.

When needing to reference an icon in the [Visual Studio Code source code](https://github.com/microsoft/vscode) via CSS classes, simply create a dom element/container that contains `codicon` and the [icon name](https://microsoft.github.io/vscode-codicons/dist/codicon.html) like:

```html
<div class='codicon codicon-add'></div>
```

It's recommended to use a single dom element for each icon and not to add children elements to it.

## Using SVG Sprites

When needing to use the `codicon.svg` sprite file, you can reference icons using the following method:

```html
<svg>
    <use xlink:href="codicon.svg#add" />
</svg>
```

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

# Legal Notices

Microsoft and any contributors grant you a license to the Microsoft documentation and other content
in this repository under the [Creative Commons Attribution 4.0 International Public License](https://creativecommons.org/licenses/by/4.0/legalcode),
see the [LICENSE](LICENSE) file, and grant you a license to any code in the repository under the [MIT License](https://opensource.org/licenses/MIT), see the
[LICENSE-CODE](LICENSE-CODE) file.

Microsoft, Windows, Microsoft Azure and/or other Microsoft products and services referenced in the documentation
may be either trademarks or registered trademarks of Microsoft in the United States and/or other countries.
The licenses for this project do not grant you rights to use any Microsoft names, logos, or trademarks.
Microsoft's general trademark guidelines can be found at http://go.microsoft.com/fwlink/?LinkID=254653.

Privacy information can be found at https://privacy.microsoft.com/en-us/

Microsoft and any contributors reserve all other rights, whether under their respective copyrights, patents,
or trademarks, whether by implication, estoppel or otherwise.
