export default function quality(option) {
    return (art) => {
        const qualityOption = art.option.quality;
        const qualityDefault = qualityOption.find((item) => item.default) || qualityOption[0];
        return {
            ...option,
            style: {
                marginRight: '10px',
            },
            html: qualityDefault ? qualityDefault.html : '',
            selector: qualityOption,
            onSelect(item) {
                art.switchQuality(item.url, item.html);
            },
        };
    };
}
