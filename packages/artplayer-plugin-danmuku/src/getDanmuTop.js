import { getRect } from './utils';

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
    const [marginTop, marginBottom] = ins.option.margin;
    const playerData = getRect(ins.art.template.$player);
    const danmus = ins.queue
        .filter(
            item =>
                item.mode === danmu.mode &&
                item.$state === 'emit' &&
                item.$ref &&
                item.$ref.style.fontSize === danmu.$ref.style.fontSize &&
                parseFloat(item.$ref.style.top) <= playerData.height - marginBottom,
        )
        .map(item => {
            const danmuData = getRect(item.$ref);
            const { width, height } = danmuData;
            const top = danmuData.top - playerData.top;
            const left = danmuData.left - playerData.left;
            const right = playerData.width - left - width;
            return { top, left, height, width, right };
        })
        .sort((prev, next) => {
            return prev.top - next.top;
        });

    if (danmus.length === 0) {
        return marginTop;
    }

    danmus.unshift({
        top: 0,
        left: 0,
        right: 0,
        height: marginTop,
        width: playerData.width,
    });

    danmus.push({
        top: playerData.height - marginBottom,
        left: 0,
        right: 0,
        height: marginBottom,
        width: playerData.width,
    });

    return calculatedTop(danmus);
}
