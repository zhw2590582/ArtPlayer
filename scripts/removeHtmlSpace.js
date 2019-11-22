module.exports = () => ({
    name: 'removeHtmlSpace',
    transform(code) {
        return {
            code: code.replace(/\\n*\s*</g, '<').replace(/>\\n*\s*/g, '>'),
        };
    },
});
