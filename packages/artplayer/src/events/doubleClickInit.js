export default function doubleClickInit(art, events) {
    const {
        template: { $video },
    } = art;
    events.proxy($video, 'dblclick', () => {
        art.emit('dblclick');
    });
}
