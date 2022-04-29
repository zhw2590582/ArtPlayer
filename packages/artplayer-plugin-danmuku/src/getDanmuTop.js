function calculatedTop(danmus) {
    let top = 0;
    const topMap = {};
    for (let index = 0; index < danmus.length; index += 1) {
        const item = danmus[index];
        if (topMap[item.top]) {
            topMap[item.top].push(item);
        } else {
            topMap[item.top] = [item];
        }
    }
    const topMapKeys = Object.keys(topMap);

    let maxDiff = 0;
    for (let index = 1; index < danmus.length; index += 1) {
        const item = danmus[index];
        const prev = danmus[index - 1];
        const prevTop = prev.top + prev.height;
        const diff = item.top - prevTop;
        if (diff > maxDiff) {
            top = prevTop;
            maxDiff = diff;
        }
    }

    if (top === 0) {
        let maxRight = 0;
        for (let index = 0; index < topMapKeys.length; index += 1) {
            let minRight = danmus[0].width;
            const topKey = topMapKeys[index];
            const danmuArr = topMap[topKey];
            for (let index = 0; index < danmuArr.length; index += 1) {
                const danmu = danmuArr[index];
                if (danmu.right < minRight) {
                    minRight = danmu.right;
                }
            }

            if (minRight > maxRight) {
                maxRight = minRight;
                [{ top }] = danmuArr;
            }
        }
    }

    if (top === 0) {
        [top] = topMapKeys
            .filter((item, index) => {
                return index !== 0 && index !== topMapKeys.length - 1;
            })
            .sort((prev, next) => {
                return topMap[prev].length - topMap[next].length;
            });
    }

    return top;
}

export default function getDanmuTop(ins, danmu) {
    const { $player } = ins.art.template;

    const danmus = ins.queue
        .filter((item) => {
            return (
                item.mode === danmu.mode &&
                item.$state === 'emit' &&
                item.$ref &&
                item.$ref.style.fontSize === danmu.$ref.style.fontSize &&
                item.$ref.offsetTop <= $player.clientHeight - ins.marginBottom
            );
        })
        .map((item) => {
            return {
                top: item.$ref.offsetTop,
                left: item.$ref.offsetLeft,
                height: item.$ref.clientHeight,
                width: item.$ref.clientWidth,
                right: $player.clientWidth - item.$ref.offsetLeft - item.$ref.clientWidth,
            };
        })
        .sort((prev, next) => prev.top - next.top);

    if (danmus.length === 0) {
        return ins.marginTop;
    }

    danmus.unshift({
        top: 0,
        left: 0,
        right: 0,
        height: ins.marginTop,
        width: $player.clientWidth,
    });

    danmus.push({
        top: $player.clientHeight - ins.marginBottom,
        left: 0,
        right: 0,
        height: ins.marginBottom,
        width: $player.clientWidth,
    });

    return calculatedTop(danmus);
}
