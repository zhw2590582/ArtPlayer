export default function thumbnails(options) {
    return (art) => ({
        ...options,
        mounted: () => {
            art.thumbnails = art.options.thumbnails;
        },
    });
}
