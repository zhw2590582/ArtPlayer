export default function quality(option) {
    return (art) => {
        const qualityOption = art.option.quality;
        const qualityDefault = qualityOption.find((item) => item.default) || qualityOption[0];
        return {
            ...option,
            html: qualityDefault ? qualityDefault.name : '',
            selector: qualityOption,
            onSelect(item) {
                art.player.switchQuality(item.url, item.name);
            },
        };
    };
}
