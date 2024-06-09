//“先驱”系列关键帧动画API
//@name     PioneerKeyframesAnimate
//@class    UIAnimation API
//@parent   Core
//@version  v1.0.0
//@author   L.W.Kevin0wvf
//@license  BSD-3-Clause
//Copyright (c) 2024, L.W.Kevin0wvf
//用途：按关键帧播放UI动画。
/*
更新日志：
v1.0.0 - 与ChunkUI API独立，暂停更新。
*/

class PioneerKeyframesAnimate {
    #keyframes
    #playbackInfo
    #progress
    #beginFrame
    #beginFuncs
    #finishFuncs
    #finished
    #animation
    constructor(keyframes, playbackInfo) {
        this.#keyframes = keyframes;
        this.#playbackInfo = playbackInfo;
        this.fps = 16;
        this.#progress = 0;
        this.#beginFrame = [0];
        for (var keyframe of this.#keyframes.slice(1)) {
            this.#beginFrame.push((this.#beginFrame.length ? this.#beginFrame[this.#beginFrame.length - 1] : 0) + (keyframe.duration ? keyframe.duration : this.#playbackInfo.duration / (this.#keyframes.length - 1)))
        }
        this.#beginFuncs = [];
        this.#finishFuncs = [];
        this.#finished = true;
        this.#animation = { animate: Function(), finish: Function() };
    }
    /**
     * @description 播放动画
     */
    play() {
        if (!this.#keyframes) return;
        var interval = 1000 / this.fps,
            frames = this.#playbackInfo.duration * this.#playbackInfo.iterations * interval,
            keyframeN = 0;
        for (var f of this.#beginFuncs) f();
        //初始化到第1帧
        for (var info of this.#keyframes[0].keyframe) for (var [key, value] of Object.entries(info.frame)) {
            var param = info.node;
            for (var i = 0; i < key.split(".").length - 1; i++) param = param[key.split(".")[i]];
            param[key.split(".")[key.split(".").length - 1]] = value;
        }
        //开始播放
        this.#finished = false;
        this.#animation.animate = setInterval(() => {
            if (keyframeN < (this.#keyframes.length - 1) && this.#progress >= this.#beginFrame[keyframeN + 1] * interval) keyframeN++;
            if (this.#progress > frames || keyframeN >= this.#keyframes.length || !this.#keyframes[keyframeN + 1]) return;
            if (this.#progress >= this.#playbackInfo.duration * interval) {
                //重新初始化
                for (var info of this.#keyframes[0].keyframe) for (var [key, value] of Object.entries(info.frame)) {
                    var param = info.node;
                    for (var i = 0; i < key.split(".").length - 1; i++) param = param[key.split(".")[i]];
                    param[key.split(".")[key.split(".").length - 1]] = value;
                }
                keyframeN = 0;
            }
            for (var info of this.#keyframes[keyframeN].keyframe) {
                for (var [key, value] of Object.entries(info.frame)) {
                    if (!this.#keyframes[keyframeN + 1].keyframe.filter((val) => { return val.node === info.node }).length || this.#keyframes[keyframeN + 1].keyframe.filter((val) => { return val.node === info.node })[0].frame[key] === undefined) return;
                    var param = info.node;
                    for (var i = 0; i < key.split(".").length - 1; i++) param = param[key.split(".")[i]];
                    param[key.split(".")[key.split(".").length - 1]] +=
                        (this.#keyframes[keyframeN + 1].keyframe.filter((val) => { return val.node === info.node })[0].frame[key]
                            - value) /
                        (((this.#beginFrame[keyframeN + 1] - this.#beginFrame[keyframeN])));
                }
            }
            this.#progress += interval;
        }, interval);
        //结束动画延迟
        this.#animation.finish = setTimeout(() => {
            clearInterval(this.#animation.animate);
            //动画结束时设置到结束后的关键帧数据（因为浮点数会有计算误差）
            for (var info of this.#keyframes[this.#keyframes.length - 1].keyframe) for (var [key, value] of Object.entries(info.frame)) {
                var param = info.node;
                for (var i = 0; i < key.split(".").length - 1; i++) param = param[key.split(".")[i]];
                param[key.split(".")[key.split(".").length - 1]] = value;
            }
            this.#finished = true;
            for (var f of this.#finishFuncs) f();
        }, frames + interval);
    }
    /**
     * @description 动画开始播放时执行
     * @param {function} func 执行的回调函数
     */
    onReady(func) {
        this.#beginFuncs.push(func);
    }
    /**
     * @description 动画结束播放时执行
     * @param {function} func 执行的回调函数
     */
    onFinish(func) {
        this.#finishFuncs.push(func);
    }
    /**
     * @description 动画的关键帧
     */
    get keyframes() {
        return this.#keyframes;
    }
    /**
     * @description 结束动画
     */
    finish() {
        clearInterval(this.#animation.animate);
        clearTimeout(this.#animation.finish);
    }
    /**
     * @description 动画是否结束
     */
    get finished() {
        return this.#finished;
    }
}
