function getDanmuTop({ target, visibles, clientWidth, clientHeight, marginBottom, marginTop, antiOverlap }) {
    // 弹幕最大高度
    const maxTop = clientHeight - marginBottom;

    // 过滤同模式的弹幕，即每种模式各不影响
    const danmus = visibles
        .filter((item) => item.mode === target.mode && item.top <= maxTop)
        .sort((prev, next) => prev.top - next.top);

    // 如果没有同模式的弹幕，直接返回
    if (danmus.length === 0) {
        if (target.mode === 2) {
            return maxTop - target.height;
        } else {
            return marginTop;
        }
    }

    // 上下各加一个虚拟弹幕，方便计算
    danmus.unshift({
        type: 'top',
        top: 0,
        left: 0,
        right: 0,
        height: marginTop,
        width: clientWidth,
        speed: 0,
        distance: clientWidth,
    });

    danmus.push({
        type: 'bottom',
        top: maxTop,
        left: 0,
        right: 0,
        height: marginBottom,
        width: clientWidth,
        speed: 0,
        distance: clientWidth,
    });

    // 查找是否有多余的缝隙足以容纳当前弹幕
    if (target.mode === 2) {
        // 倒序查找
        for (let index = danmus.length - 2; index >= 0; index -= 1) {
            const item = danmus[index];
            const prev = danmus[index + 1];
            const itemBottom = item.top + item.height;
            const diff = prev.top - itemBottom;
            if (diff >= target.height) {
                return prev.top - target.height;
            }
        }
    } else {
        // 顺序查找
        for (let index = 1; index < danmus.length; index += 1) {
            const item = danmus[index];
            const prev = danmus[index - 1];
            const prevBottom = prev.top + prev.height;
            const diff = item.top - prevBottom;
            if (diff >= target.height) {
                return prevBottom;
            }
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
            case 0: {
                const result = topMap.find((list) => {
                    return list.every((danmu) => {
                        if (clientWidth < danmu.distance) return false;
                        if (target.speed < danmu.speed) return true;
                        const overlapTime = danmu.right / (target.speed - danmu.speed);
                        if (overlapTime > danmu.time) return true;
                        return false;
                    });
                });

                return result && result[0] ? result[0].top : undefined;
            }

            // 静止弹幕没有重叠问题
            case 1:
            case 2:
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
            case 2:
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

onmessage = (event) => {
    const { data } = event;
    if (!data.id || !data.type) return;

    const fns = { getDanmuTop };
    const fn = fns[data.type];
    const result = fn(data);

    self.postMessage({
        result,
        id: data.id,
    });
};
