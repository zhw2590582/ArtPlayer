function getData(clientWidth, item) {
    const top = item.$ref.offsetTop;
    const left = item.$ref.offsetLeft;
    const height = item.$ref.clientHeight;
    const width = item.$ref.clientWidth;
    const distance = left + width;
    const right = clientWidth - distance;
    const speed = distance / item.$restTime;
    const mode = item.mode;

    return {
        mode,
        top,
        left,
        height,
        width,
        right,
        speed,
        distance,
    };
}

export default function getDanmuTop(ins, danmu) {
    const { clientWidth, clientHeight } = ins.$player;
    const { antiOverlap } = ins.option;
    const { marginBottom, marginTop } = ins;
    const target = getData(clientWidth, danmu);

    const danmus = ins.queue
        .filter((item) => {
            return (
                item.$ref &&
                item.$state === 'emit' &&
                item.mode === target.mode &&
                item.$ref.offsetTop <= clientHeight - marginBottom
            );
        })
        .map((item) => getData(clientWidth, item))
        .sort((prev, next) => prev.top - next.top);

    if (danmus.length === 0) {
        return marginTop;
    }

    danmus.unshift({
        top: 0,
        left: 0,
        right: 0,
        height: marginTop,
        width: clientWidth,
        speed: 0,
        distance: clientWidth,
    });

    danmus.push({
        top: clientHeight - marginBottom,
        left: 0,
        right: 0,
        height: marginBottom,
        width: clientWidth,
        speed: 0,
        distance: clientWidth,
    });

    for (let index = 1; index < danmus.length; index += 1) {
        const item = danmus[index];
        const prev = danmus[index - 1];
        const prevBottom = prev.top + prev.height;
        const diff = item.top - prevBottom;
        if (diff >= target.height) {
            return prevBottom;
        }
    }

    const topMap = [];
    for (let index = 1; index < danmus.length - 1; index += 1) {
        const item = danmus[index];
        if (topMap.length) {
            const last = topMap[topMap.length - 1];
            if (last[0].top === item.top) {
                last.push(item);
            } else {
                topMap.push([item]);
            }
        } else {
            topMap.push([item]);
        }
    }

    if (antiOverlap) {
        switch (target.mode) {
            case 0:
                break;
            case 1:
                return undefined;
            default:
                break;
        }
    } else {
        switch (target.mode) {
            case 0:
                topMap.sort((prev, next) => {
                    const nextMinRight = Math.min(...next.map((item) => item.right));
                    const prevMinRight = Math.min(...prev.map((item) => item.right));
                    return nextMinRight * next.length - prevMinRight * prev.length;
                });
                break;
            case 1:
                topMap.sort((prev, next) => {
                    const nextMaxWidth = Math.max(...next.map((item) => item.width));
                    const prevMaxWidth = Math.max(...prev.map((item) => item.width));
                    return prevMaxWidth * prev.length - nextMaxWidth * next.length;
                });
                break;
            default:
                break;
        }

        return topMap[0][0].top;
    }
}
