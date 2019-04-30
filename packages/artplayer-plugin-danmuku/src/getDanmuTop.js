function getDanmuTopByDiff(danmus) {
    let top = 0;
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
    return top;
}

function getDanmuTopBySparse(danmus) {
    const topMap = {};
    for (let index = 0; index < danmus.length; index += 1) {
        const item = danmus[index];
        if (topMap[item.top]) {
            topMap[item.top].push(item);
        } else {
            topMap[item.top] = [item];
        }
    }

    let maxRight = 0;
    let top = 0;
    const topMapKeys = Object.keys(topMap);
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

    if (top === 0) {
        const randomKey = Math.floor(Math.random() * (2 - topMapKeys.length) + topMapKeys.length - 1);
        top = topMapKeys[randomKey];
    }

    return top;
}

export default function getDanmuTop(danmus) {
    let top = getDanmuTopByDiff(danmus);
    if (top === 0) {
        top = getDanmuTopBySparse(danmus);
    }
    return top;
}
