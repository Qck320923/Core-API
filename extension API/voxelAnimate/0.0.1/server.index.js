//方块动画API
//@name     Voxels Animate
//@class    Voxels Animate API
//@parent   Core
//@version  v0.0.1
//@author   L.W.Kevin0wvf
//@license  BSD-3-Clause
//Copyright (c) 2024, L.W.Kevin0wvf
//用途：便捷的方块/地形控制工具。
/*
更新日志：
v0.0.1 - 完成基础方法并通过测试。
*/

"use strict";
console.clear();
//方块动画：1.frames: [帧数据（getVoxelId三维数组（id带方向））, ...]2.播放方式：指定最小点坐标播放
class VoxelsAnimate {
    #fps
    #finished = true
    #animation
    #progress = 0
    #frames
    #sx
    #sy
    #sz
    #beginFuncs = []
    #finishFuncs = []
    constructor(sx, sy, sz, frames, playbackInfo, fps = 16) {
        this.#frames = frames;
        this.#fps = fps;
        this.#sx = sx;
        this.#sy = sy;
        this.#sz = sz;
        this.playbackInfo = playbackInfo;
    }
    /**
     * @description 播放动画
     */
    play() {
        if (!this.#finished) clearInterval(this.#animation); //重播
        this.#finished = false;
        //如果没有指定继续播放就重置播放进度
        if (!this.playbackInfo.continuePlay) this.#progress = (this.playbackInfo.startProgress ? this.playbackInfo.startProgress : 0);
        for (var f of this.#beginFuncs) f();
        this.#animation = setInterval(() => {
            var data = this.#frames[this.#progress % this.#frames.length];
            if (data.ex < data.sx) {
                data.ex += data.sx;
                data.sx = data.ex - data.sx;
                data.ex -= data.sx;
            }
            if (data.ey < data.sy) {
                data.ey += data.sy;
                data.sy = data.ey - data.sy;
                data.ey -= data.sy;
            }
            if (data.ez < data.sz) {
                data.ez += data.sz;
                data.sz = data.ez - data.sz;
                data.ez -= data.sz;
            }
            if (data.containAir) {
                for (var x = data.sx; x <= data.ex; x++) {
                    for (var y = data.sy; y <= data.ey; y++) {
                        for (var z = data.sz; z <= data.ez; z++) {
                            voxels.setVoxelId(this.#sx + x, this.#sy + y, this.#sz + z, 0);//扩展：0可以改为其他方块id实现背景效果
                        }
                    }
                }
            }
            for (var voxel of data.voxels) voxels.setVoxel(this.#sx + voxel.x, this.#sy + voxel.y, this.#sz + voxel.z, voxel.voxel, (voxel.rotation ? voxel.rotation : 0));
            if (this.#progress >= (this.#frames.length * this.playbackInfo.iterations - 1)) this.finish();
            this.#progress++;
        }, 1000 / this.#fps);
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
     * @description 动画的播放进度
     */
    set progress(progress) {
        this.#progress = progress;
        if (this.#finished) {
            var data = this.#frames[this.#progress % this.#frames.length];
            if (data.ex < data.sx) {
                data.ex += data.sx;
                data.sx = data.ex - data.sx;
                data.ex -= data.sx;
            }
            if (data.ey < data.sy) {
                data.ey += data.sy;
                data.sy = data.ey - data.sy;
                data.ey -= data.sy;
            }
            if (data.ez < data.sz) {
                data.ez += data.sz;
                data.sz = data.ez - data.sz;
                data.ez -= data.sz;
            }
            if (data.containAir) {
                for (var x = data.sx; x <= data.ex; x++) {
                    for (var y = data.sy; y <= data.ey; y++) {
                        for (var z = data.sz; z <= data.ez; z++) {
                            voxels.setVoxelId(this.#sx + x, this.#sy + y, this.#sz + z, 0);
                        }
                    }
                }
            }
            for (var voxel of data.voxels) voxels.setVoxel(this.#sx + voxel.x, this.#sy + voxel.y, this.#sz + voxel.z, voxel.voxel, (voxel.rotation ? voxel.rotation : 0));
        }
    }
    /**
     * @description 动画的播放进度
     */
    get progress() {
        return this.#progress;
    }
}
