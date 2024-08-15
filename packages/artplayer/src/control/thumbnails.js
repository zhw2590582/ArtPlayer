export default function thumbnails(options) {
    return (art) => ({
        ...options,
        mounted: () => {
            this.art.thumbnails = art.options.thumbnails;
        },
    });
}
