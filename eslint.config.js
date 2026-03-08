import antfu from "@antfu/eslint-config";

export default antfu({
    ignores: [
        "**/hint.less",
    ],
    formatters: {
        css: true,
        html: true,
        markdown: 'prettier',
    },
    rules: {
        "eslint-comments/no-unlimited-disable": "off",
    },
});
