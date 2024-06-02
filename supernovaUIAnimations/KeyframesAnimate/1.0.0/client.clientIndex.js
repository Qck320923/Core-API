//“超新星”系列帧动画API
//@name     FramesAnimate
//@class    UIAnimation API
//@parent   Core - SupernovaAnimations
//@version  v1.0.1
//@author   L.W.Kevin0wvf
//@license  BSD-3-Clause
//Copyright (c) 2024, L.W.Kevin0wvf
//用途：按帧播放UI动画。
/*
更新日志：
v1.0.0 - 完成基础功能。
v1.0.1 - 紧急修复所有已知问题。
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
    constructor(frames, fps = 16) {
        this.#frames = frames;
        this.#fps = fps;
        this.progress = 0;
    }
    /**
     * @description 播放动画
     */
    play() {
        if (!this.#finished) clearInterval(this.#animation); //重播
        this.#finished = false;
        //如果没有指定继续播放就重置播放进度
        if (!this.#playbackInfo.continuePlay) this.progress = (this.#playbackInfo.startProgress ? this.#playbackInfo.startProgress : 0);
        for (var f of this.#beginFuncs) f();
        this.#animation = setInterval(() => {
            //frames: [[{ node: node, frame: { param: value, ... } }, ...], ...]
            for (var info of this.#frames[this.progress % this.#frames.length])
                for (var [key, value] of Object.entries(info.frame)) {
                    var param = info.node;
                    for (var i = 0; i < key.split(".").length - 1; i++) param = param[key.split(".")[i]];
                    param[key.split(".")[key.split(".").length - 1]] = value;
                }
            if (this.progress >= (this.#frames.length * this.#playbackInfo.iterations - 1)) this.finish();
            this.progress++;
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
     * @description 结束动画
     */
    finish() {
        clearInterval(this.#animation);
        this.#finished = true;
        for (var f of this.#finishFuncs) f();
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
}

//“超新星”系列关键帧动画API
//@name     KeyframesAnimate
//@class    UIAnimation API
//@parent   Core - SupernovaAnimations
//@version  v1.0.0
//@author   L.W.Kevin0wvf
//@license  BSD-3-Clause
//Copyright (c) 2024, L.W.Kevin0wvf
//用途：按帧播放UI动画。
/*
更新日志：
v1.0.0 - 完成基础功能。
*/
class KeyframesAnimate extends FramesAnimate {
    #keyframes
    #beginFrames
    constructor(keyframes, playbackInfo, fps = 16) {
        super([], fps);
        this.#keyframes = keyframes;
        super.playbackInfo = playbackInfo;
    }
    //重载play方法
    play() {
        super.frames = this.frames;
        super.play();
    }
    //重载frames方法
    get frames() {
        this.#beginFrames = [0];
        for (var keyframe of this.#keyframes.slice(1)) {
            this.#beginFrames.push(this.#beginFrames[this.#beginFrames.length - 1] + (keyframe.duration ? keyframe.duration : super.playbackInfo.duration / (this.#keyframes.length - 1)))
        }
        var frames = [this.#keyframes[0].keyframe];
        for (var i = 0; i < this.#keyframes.length - 1; i++) {
            for (var j = 1; j <= this.#beginFrames[i + 1] - this.#beginFrames[i]; j++) {
                frames.push(this.#keyframes[i].keyframe.map((x) => { return { node: x.node, frame: { ...x.frame } }; }));
                for (var info of this.#keyframes[i].keyframe) {
                    for (var [key, value] of Object.entries(info.frame)) {
                        if (!this.#keyframes[i + 1].keyframe.filter((val) => { return val.node === info.node }).length || this.#keyframes[i + 1].keyframe.filter((val) => { return val.node === info.node })[0].frame[key] === undefined) continue;
                        frames[frames.length - 1].filter((val) => { return val.node === info.node })[0].frame[key] =
                            value + (this.#keyframes[i + 1].keyframe.filter((val) => { return val.node === info.node })[0].frame[key]
                                - value) /
                            (((this.#beginFrames[i + 1] - this.#beginFrames[i]))) * j;
                    }
                }
            }
        }
        return frames;
    }
    /**
     * @description 动画的关键帧
     */
    set keyframes(keyframes) {
        if (this.finished) this.#keyframes = keyframes;
        else console.warn("(Client)KeyframesAnimateWarn: Cannot set property keyframes of [object Object] while it's playing.");
    }
    /**
     * @description 动画的关键帧
     */
    get keyframes() {
        return this.#keyframes;
    }
}
