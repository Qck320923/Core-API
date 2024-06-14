//“超新星”系列帧动画API
//@name     FramesAnimate
//@class    UIAnimation API
//@parent   Core - SupernovaAnimations
//@version  v1.0.2
//@author   L.W.Kevin0wvf
//@license  MIT
//Copyright (c) 2024, L.W.Kevin0wvf
//用途：按帧播放UI动画。
/*
更新日志：
v1.0.0 - 完成基础功能。
v1.0.1 - 紧急修复所有已知问题。
v1.0.2 - 改善progress属性赋值原则。
*/

/**
 * @description 帧动画
 * ##### 如果帧数据不变：fps越小duration越短，播放速度越快；fps越大duration越长，播放速度越慢。
 * ##### 不同于其他动画类型，playbackInfo中不包含duration属性。
 */
class FramesAnimate {
    #frames
    #finished = true
    #animation
    #fps
    #playbackInfo
    #beginFuncs = []
    #finishFuncs = []
    #progress = 0
    constructor(frames, fps = 16) {
        this.#frames = frames;
        this.#fps = fps;
    }
    /**
     * @description 播放动画
     */
    play() {
        if (!this.#finished) clearInterval(this.#animation); //重播
        this.#finished = false;
        //如果没有指定继续播放就重置播放进度
        if (!this.#playbackInfo.continuePlay) this.#progress = (this.#playbackInfo.startProgress ? this.#playbackInfo.startProgress : 0);
        for (var f of this.#beginFuncs) f();
        this.#animation = setInterval(() => {
            //frames: [[{ node: node, frame: { param: value, ... } }, ...], ...]
            for (var info of this.#frames[this.#progress % this.#frames.length])
                for (var [key, value] of Object.entries(info.frame)) {
                    var param = info.node;
                    for (var i = 0; i < key.split(".").length - 1; i++) param = param[key.split(".")[i]];
                    param[key.split(".")[key.split(".").length - 1]] = value;
                }
            if (this.#progress >= (this.#frames.length * this.#playbackInfo.iterations - 1)) this.finish();
            this.#progress++;
        }, this.#fps);
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
     * @description 结束动画
     */
    finish() {
        clearInterval(this.#animation);
        this.#finished = true;
        for (var f of this.#finishFuncs) f();
    }
    /**
     * @description 动画帧数据
     */
    set frames(frames) {
        if (this.finished) this.#frames = frames;
        else console.warn("(Client)FramesAnimateWarn: Cannot set property frames of [object Object] while it's playing.");
    }
    /**
     * @description 动画帧数据
     */
    get frames() {
        return this.#frames;
    }
    /**
     * @description 动画是否结束
     */
    get finished() {
        return this.#finished;
    }
    /**
     * @description 动画的帧率
     */
    set fps(fps) {
        if (this.#finished) this.#fps = fps;
        else {
            clearInterval(this.#animation);
            this.#fps = fps;
            this.play({
                continuePlay: true
            });
        }
    }
    /**
     * @description 动画的帧率
     */
    get fps() {
        return this.#fps;
    }
    /**
     * @description 动画的播放信息
     */
    set playbackInfo(playbackInfo) {
        this.#playbackInfo = playbackInfo;
    }
    /**
     * @description 动画的播放信息
     */
    get playbackInfo() {
        return this.#playbackInfo;
    }
    /**
     * @description 动画的播放进度
     */
    set progress(progress) {
        this.#progress = progress;
        if (this.#finished) for (var info of this.#frames[this.#progress % this.#frames.length])
            for (var [key, value] of Object.entries(info.frame)) {
                var param = info.node;
                for (var i = 0; i < key.split(".").length - 1; i++) param = param[key.split(".")[i]];
                param[key.split(".")[key.split(".").length - 1]] = value;
            }
    }
    /**
     * @description 动画的播放进度
     */
    get progress() {
        return this.#progress;
    }
}
