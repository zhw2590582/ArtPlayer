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
}, {
    name: 'artplayer/frozen-vast-public-declaration',
    files: ['packages/artplayer-plugin-vast/types/artplayer-plugin-vast.d.ts'],
    // Keep actual npm 1.0.0 declaration bytes; strict consumers verify its contracts.
    rules: {
        'style/semi': 'off',
        'style/indent': 'off',
        'style/member-delimiter-style': 'off',
        'ts/no-use-before-define': 'off',
        'ts/consistent-type-definitions': 'off',
    },
});
