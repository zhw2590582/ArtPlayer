onmessage = (event) => {
    const { data } = event;

    self.postMessage({
        id: data.id,
        test: 'fuck',
    });
};
