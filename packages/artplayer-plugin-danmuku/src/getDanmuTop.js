function calculatedTop(danmus, danmu) {
    // 方法1：两两对比，只要找到间隔能塞进一条弹幕的高度的，则马上插入
    for (let index = 1; index < danmus.length; index += 1) {
        const item = danmus[index];
        const prev = danmus[index - 1];
        const prevBottom = prev.top + prev.height;
        const diff = item.top - prevBottom;
        if (diff >= danmu.$ref.clientHeight) {
            return prevBottom;
        }
    }

    // 方法2：找出所有弹幕的右侧最多空白的的位置插入
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

    topMap.sort((prev, next) => {
        const nextMinRight = Math.min(...next.map((item) => item.right));
        const prevMinRight = Math.min(...prev.map((item) => item.right));
        return nextMinRight * next.length - prevMinRight * prev.length;
    });

    return topMap[0][0].top;
}

export default function getDanmuTop(ins, danmu) {
    const { $player } = ins.art.template;

    const danmus = ins.queue
        .filter((item) => {
            return (
                item.$ref &&
                item.$state === 'emit' &&
                item.mode === danmu.mode &&
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

    return calculatedTop(danmus, danmu);
}
