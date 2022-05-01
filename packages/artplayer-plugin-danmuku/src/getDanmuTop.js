function getData(ins, clientLeft, clientWidth, item) {
    const top = item.$ref.offsetTop;
    const left = ins.getLeft(item.$ref) - clientLeft;
    const height = item.$ref.clientHeight;
    const width = item.$ref.clientWidth;
    const distance = left + width;
    const right = clientWidth - distance;
    const speed = distance / item.$restTime;
    const mode = item.mode;
    const time = item.$restTime;
    const $ref = item.$ref;

    return {
        $ref,
        mode,
        time,
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
    const clientLeft = ins.getLeft(ins.$player);
    const { clientWidth, clientHeight } = ins.$player;
    const { antiOverlap } = ins.option;
    const { marginBottom, marginTop } = ins;
    const target = getData(ins, clientLeft, clientWidth, danmu);

    const danmus = ins.queue
        .filter((item) => {
            return (
                item.$ref &&
                item.$state === 'emit' &&
                item.mode === target.mode &&
                item.$ref.offsetTop <= clientHeight - marginBottom
            );
        })
        .map((item) => getData(ins, clientLeft, clientWidth, item))
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

    const test = topMap.map((list) => {
        return list.map((item) => {
            return target.speed * item.time;
        });
    });

    console.log(test);

    // topMap.sort((prev, next) => {
    //     const nextMinRight = Math.min(...next.map((item) => target.speed * item.time));
    //     const prevMinRight = Math.min(...prev.map((item) => target.speed * item.time));
    //     return prevMinRight - nextMinRight;
    // });

    // console.log(JSON.parse(JSON.stringify(topMap)));

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
