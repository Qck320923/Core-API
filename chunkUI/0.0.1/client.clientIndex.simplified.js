//@name     Chunk UI
//@class    UI API
//@parent   Core
//@version  v0.0.1
//@author   L.W.Kevin0wvf
//@license  BSD-3-Clause
//Copyright (c) 2024, L.W.Kevin0wvf
//用途：简化UI代码，使用更方便。（简便）

"use strict";
console.clear();

class ChunkUI {
    constructor() {
        this.xml = {
            connectXml(xmlA, xmlB, separator = "\n") {return `${xmlA}${separator}${xmlB}`;},
            addXml(xmlA, xmlB) {return `${xmlA.slice(0, xmlA.indexOf(">") + 1)}${xmlB}${xmlA.slice(xmlA.indexOf(">") + 1)}`;},
            lastAddXml(xmlA, xmlB) {return `${xmlA.slice(0, xmlA.lastIndexOf("<"))}${xmlB}${xmlA.slice(xmlA.lastIndexOf("<"))}`;},
            mapParamsToString(params) {
                var stringParams = "";
                if (params) Object.entries(params).forEach(([key, value]) => {
                    stringParams += ` ${key}="${value}"`
                });
                return stringParams;
            },
            stringParamsToMap(params) {
                var mapParams = {};
                if (params) for (var p of params.split(" ")) {
                    mapParams[p.split("=")[0]] = p.slice(p.indexOf("\"") + 1, p.lastIndexOf("\""));
                };
                return mapParams;
            },
            generateElementXml(element, params) {return `<${element}${this.mapParamsToString(params)}></${element}>`;}
        }
        this.uiTools = {
            createUiNode(type, params) {
                if (!(type && type.create)) throw new Error("ChunkUIError:Invalid UiNode type.");
                var node = type.create();
                Object.assign(node, params);
                return node;
            },
            unmountUiNode(...node) {for (var n of node) n.parent = undefined;},
            rendered(node) {while (node !== ui && node.parent) node = node.parent;return node === ui;},
            config(node, params) {return Object.assign(node, params);},
            createChildUiNode(type, params, parent) {return this.config(this.createUiNode(type, params), { parent: parent });},
            addChildUiNode(parent, ...child) {for (var c of child) c.parent = parent;return parent;},
            removeAllChildUiNode(parent) {for (var c of parent.children) c.parent = undefined;return parent;},
            findChild(parent, child) {
                for (var c of parent.children) {
                    if (c === child || c.name === child) return c;
                    var res = this.findChild(c, child);
                    if (res) return res;
                }
                return -1;
            },
            tree: {
                getUiNodeTree(parent) {
                    var childrenTree = [];
                    for (var c of parent.children) childrenTree.push({node: c, children: this.getUiNodeTree(c)});
                    return {node: parent, children: childrenTree}
                },
                getUiNodeNameTree(parent) {
                    var childrenTree = [];
                    for (var c of parent.children) childrenTree.push({node: c, children: this.getUiNodeNameTree(c)});
                    return {nodeName: parent.name,children: childrenTree}
                }
            },
            animation: {keyframesAnimate(keyframes, playbackInfo) {return new keyframesAnimate(keyframes, playbackInfo);}}
        }
    }
}
class keyframesAnimate {
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
    play() {
        if (!this.#keyframes) return;
        var interval = 1000 / this.fps, frames = this.#playbackInfo.duration * this.#playbackInfo.iterations * interval, keyframeN = 0;
        for (var f of this.#beginFuncs) f();
        //初始化到第1帧
        for (var info of this.#keyframes[0].keyframe) Object.assign(info.node, info.frame);
        //开始播放
        this.#finished = false;
        this.#animation.animate = setInterval(() => {
            if (keyframeN < (this.#keyframes.length - 1) && this.#progress >= this.#beginFrame[keyframeN + 1] * interval) keyframeN++;
            if (this.#progress > frames || keyframeN >= this.#keyframes.length || !this.#keyframes[keyframeN + 1]) return;
            if (this.#progress >= this.#playbackInfo.duration * interval) {
                //重新初始化
                for (var info of this.#keyframes[0].keyframe) Object.assign(info.node, info.frame);
                keyframeN = 0;
            }
            for (var info of this.#keyframes[keyframeN].keyframe) for (var [key, value] of Object.entries(info.frame)) if (this.#keyframes[keyframeN + 1].keyframe.filter((val) => { return val.node === info.node }).length && this.#keyframes[keyframeN + 1].keyframe.filter((val) => { return val.node === info.node })[0].frame[key]) info.node[key] += (this.#keyframes[keyframeN + 1].keyframe.filter((val) => { return val.node === info.node })[0].frame[key] - value) / (((this.#beginFrame[keyframeN + 1] - this.#beginFrame[keyframeN])));
            this.#progress += interval;
        }, interval);
        //结束动画延迟
        this.#animation.finish = setTimeout(() => {
            clearInterval(this.#animation.animate);
            //动画结束时设置到结束后的关键帧数据（因为浮点数会有计算误差）
            for (var info of this.#keyframes[this.#keyframes.length - 1].keyframe) Object.assign(info.node, info.frame);
            this.#finished = true;
            for (var f of this.#finishFuncs) f();
        }, frames + interval);
    }
    onReady(func) {this.#beginFuncs.push(func);}
    onFinish(func) {this.#finishFuncs.push(func);}
    getKeyframes() {return this.#keyframes;}
}

const chunkUI = new ChunkUI();
