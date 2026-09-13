import $check_off from './img/check_off.svg?raw'
import $check_on from './img/check_on.svg?raw'
import $config from './img/config.svg?raw'
import $mode_0_off from './img/mode_0_off.svg?raw'
import $mode_0_on from './img/mode_0_on.svg?raw'
import $mode_1_off from './img/mode_1_off.svg?raw'
import $mode_1_on from './img/mode_1_on.svg?raw'
import $mode_2_off from './img/mode_2_off.svg?raw'
import $mode_2_on from './img/mode_2_on.svg?raw'
import $off from './img/off.svg?raw'
import $on from './img/on.svg?raw'
import $style from './img/style.svg?raw'

export function settingIcons() {
  return {
    $on,
    $off,
    $config,
    $style,
    $mode_0_off,
    $mode_0_on,
    $mode_1_off,
    $mode_1_on,
    $mode_2_off,
    $mode_2_on,
    $check_on,
    $check_off,
  }
}

export function settingTemplate() {
  const { option } = this
  return `
            <div class="apd-toggle">
                ${$on}${$off}
            </div>
            <div class="apd-config">
                ${$config}
                <div class="apd-config-panel">
                    <div class="apd-config-panel-inner">
                        <div class="apd-config-mode">
                            按类型屏蔽
                            <div class="apd-modes">
                                <div data-mode="0" class="apd-mode">
                                    ${$mode_0_off}${$mode_0_on}
                                    <div>滚动</div>
                                </div>
                                <div data-mode="1" class="apd-mode">
                                    ${$mode_1_off}${$mode_1_on}
                                    <div>顶部</div>
                                </div>
                                <div data-mode="2" class="apd-mode">
                                    ${$mode_2_off}${$mode_2_on}
                                    <div>底部</div>
                                </div>
                            </div>
                        </div>
                        <div class="apd-config-other">
                            <div class="apd-other apd-anti-overlap">
                                ${$check_on}${$check_off}
                                防止弹幕重叠
                            </div>
                            <div class="apd-other apd-sync-video">
                                ${$check_on}${$check_off}
                                同步视频速度
                            </div>
                        </div>
                        <div class="apd-config-slider apd-config-opacity">
                            不透明度
                            <div class="apd-slider"></div>
                            <div class="apd-value">未知</div>
                        </div>
                        <div class="apd-config-slider apd-config-margin">
                            显示区域
                            <div class="apd-slider"></div>
                            <div class="apd-value">未知</div>
                        </div>
                        <div class="apd-config-slider apd-config-fontSize">
                            弹幕字号
                            <div class="apd-slider"></div>
                            <div class="apd-value">未知</div>
                        </div>
                        <div class="apd-config-slider apd-config-speed">
                            弹幕速度
                            <div class="apd-slider"></div>
                            <div class="apd-value">未知</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="apd-emitter">
                <div class="apd-style">
                    ${$style}
                    <div class="apd-style-panel">
                        <div class="apd-style-panel-inner">
                            <div class="apd-style-mode">
                                模式
                                <div class="apd-modes">
                                    <div data-mode="0" class="apd-mode">
                                        ${$mode_0_on}
                                        <div>滚动</div>
                                    </div>
                                    <div data-mode="1" class="apd-mode">
                                        ${$mode_1_on}
                                        <div>顶部</div>
                                    </div>
                                    <div data-mode="2" class="apd-mode">
                                        ${$mode_2_on}
                                        <div>底部</div>
                                    </div>
                                </div>
                            </div>
                            <div class="apd-style-color">
                                颜色
                                <div class="apd-colors">
                                    ${this.COLOR.map(color => `<div data-color="${color}" class="apd-color" style="background-color: ${color}"></div>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <input class="apd-input" placeholder="发个友善的弹幕见证当下" autocomplete="off" maxLength="${option.maxLength}" />
                <div class="apd-send">发送</div>
            </div>
        `
}
