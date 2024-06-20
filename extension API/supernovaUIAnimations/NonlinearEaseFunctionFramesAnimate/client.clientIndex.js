//“超新星”系列非线性缓动函数帧动画API
//@name     NonlinearEaseFunctionFramesAnimate
//@class    UIAnimation API
//@parent   Core - SupernovaAnimations
//@version  v1.0.0
//@author   L.W.Kevin0wvf
//@license  MIT
//Copyright (c) 2024, L.W.Kevin0wvf
//用途：按帧播放缓动UI动画。
/*
更新日志：
v1.0.0 - 完成基础功能。
*/

const EaseType = {
    EASEIN: "easein",//缓入（x逐渐逼近0）
    EASEOUT: "easeout",//缓出（x逐渐逼近1）
    EASEINOUT: "easeinout"//当x≤0.5时，x逐渐逼近0；当x>0.5时，x逐渐逼近1
}

//非线性缓动函数帧动画类
class NonlinearEaseFunctionFramesAnimate extends FramesAnimate {
    #startFrame
    #callback
    constructor(startFrame, playbackInfo, callback, x, fps = 16) {
        super([], fps);
        this.#startFrame = startFrame;
        super.playbackInfo = playbackInfo;
        this.#callback = callback;
        this.x = x;
    }
    //重载play方法
    play() {
        super.frames = this.frames;
        super.play();
    }
    //重载frames方法
    get frames() {
        //frames:[[{ node: node, frame: { param: value, ... } }, ...], ...]
        var frames = [this.#startFrame], x = this.x;
        for (var i = 0; i < super.playbackInfo.duration; i++) {
            frames.push(frames[frames.length - 1].map((x) => { return { node: x.node, frame: { ...x.frame } } }));
            for (var info of frames[frames.length - 1]) {
                for (var [key, value] of Object.entries(info.frame)) {
                    x = this.#callback(x);
                    info.frame[key] = value * x;
                }
            }
        }
        return frames;
    }
    /**
     * @description 动画帧数据
     */
    set startFrames(startFrame) {
        if (super.finished) this.#startFrame = startFrame;
        else console.warn("(Client)NonlinearFramesAnimateWarn: Cannot set property startFrames of [object Object] while it's playing.");
    }
    /**
     * @description 动画帧数据
     */
    get startFrames() {
        return this.#startFrame;
    }
}
