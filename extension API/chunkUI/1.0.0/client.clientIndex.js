//“区块”UI API
//@name     Chunk UI
//@class    UI API
//@parent   Core
//@version  v1.0.0
//@author   L.W.Kevin0wvf
//@license  MIT
//Copyright (c) 2024, L.W.Kevin0wvf
//用途：简化UI代码，使用更方便。（简便）
/*
更新日志：
v0.0.1 - 完成基础方法。
v0.0.2 - 优化动画方法，修改部分注释和代码。
v0.0.3 - 动画功能更新。
v1.0.0 - 与动画API独立。
*/

"use strict";
console.clear();

class ChunkUI {
    constructor() {
        /**
         * @description 便捷xml文本操作工具
         */
        this.xml = {
            /**
             * @description 连接两个xml字符串
             * @param {string} xmlA 第一个xml字符串
             * @param {string} xmlB 第二个xml字符串
             * @param {string} separator 间隔符，默认为换行符
             */
            connectXml(xmlA, xmlB, separator = "\n") {
                return `${xmlA}${separator}${xmlB}`;
            },
            /**
             * @description 添加xml字符串到另一个xml字符串中（添加到第一层第一个位置），返回一个新的字符串
             * @param {string} xmlA 要添加到的xml字符串
             * @param {string} xmlB 被添加的xml字符串
             */
            addXml(xmlA, xmlB) {
                return `${xmlA.slice(0, xmlA.indexOf(">") + 1)}${xmlB}${xmlA.slice(xmlA.indexOf(">") + 1)}`;
            },
            /**
             * @description 添加xml字符串到另一个xml字符串中（添加到第一层最后一个位置），返回一个新的字符串
             * @param {string} xmlA 要添加到的xml字符串
             * @param {string} xmlB 被添加的xml字符串
             */
            lastAddXml(xmlA, xmlB) {
                return `${xmlA.slice(0, xmlA.lastIndexOf("<"))}${xmlB}${xmlA.slice(xmlA.lastIndexOf("<"))}`;
            },
            /**
             * @description 将map类型属性转换为字符串类型属性
             * @param {object} params map类型的的参数
             */
            mapParamsToString(params) {
                var stringParams = "";
                if (params) Object.entries(params).forEach(([key, value]) => {
                    stringParams += ` ${key}="${value}"`
                });
                return stringParams;
            },
            /**
             * @description 将字符串类型属性转换为map类型属性
             * @param {string} params 字符串类型的参数
             */
            stringParamsToMap(params) {
                var mapParams = {};
                if (params) for (var p of params.split(" ")) {
                    mapParams[p.split("=")[0]] = p.slice(p.indexOf("\"") + 1, p.lastIndexOf("\""));
                };
                return mapParams;
            },
            /**
             * @description 生成一个任意元素的xml字符串
             * @param {string} element xml元素
             * @param {ChunkUIElementParam} params 元素的属性
             */
            generateElementXml(element, params) {
                return `<${element}${this.mapParamsToString(params)}></${element}>`;
            }
        }
        /**
         * @description 便捷UI工具
         */
        this.uiTools = {
            /**
             * @description 创建一个新的UiNode
             * @param {class} type UiNode的类型
             * @param {object} params UiNode的属性
             * @returns {UiBox|UiImage|UiInput|UiScale|UiText} UiNode
             */
            createUiNode(type, params) {
                if (!(type && type.create)) throw new Error("ChunkUIError:Invalid UiNode type.");
                var node = type.create();
                Object.assign(node, params);
                return node;
            },
            /**
             * @description 取消挂载UiNode
             * @param {UiBox|UiImage|UiInput|UiScale|UiText} node UiNode
             */
            unmountUiNode(...node) {
                for (var n of node) n.parent = undefined;
            },
            /**
             * @description UiNode是否被渲染
             * @param {UiBox|UiImage|UiInput|UiScale|UiText} node UiNode
             * @returns {boolean}
             */
            rendered(node) {
                while (node !== ui && node.parent) node = node.parent;
                return node === ui;
            },
            /**
             * @description 设置UiNode的属性
             * @param {UiBox|UiImage|UiInput|UiScale|UiText} node UiNode
             * @param {object} params UiNode的属性
             * @returns {UiBox|UiImage|UiInput|UiScale|UiText} UiNode
             */
            config(node, params) {
                return Object.assign(node, params);
            },
            /**
             * @description 设置UiNode的Coord2属性
             * @param {UiBox|UiImage|UiInput|UiScale|UiText} node UiNode
             * @param {object} params UiNode的Coord2属性
             * @returns {UiBox|UiImage|UiInput|UiScale|UiText} UiNode
             */
            configCoord2(node, params) {
                for (var [key, value] of Object.entries(params)) {
                    var nodeParam = node;
                    for (var k of key.split(".")) {
                        nodeParam = nodeParam[k];
                    }
                    nodeParam.copy(value);
                }
                return node;
            },
            /**
             * @description 创建子UiNode
             * @param {class} type 子UiNode的类型
             * @param {object} params 子UiNode的属性
             * @param {UiBox|UiImage|UiInput|UiScale|UiText} parent 父UiNode
             * @returns {UiBox|UiImage|UiInput|UiScale|UiText} 子UiNode
             */
            createChildUiNode(type, params, parent) {
                return this.config(this.createUiNode(type, params), { "parent": parent });
            },
            /**
             * @description 添加子UiNode
             * @param {UiBox|UiImage|UiInput|UiScale|UiText} parent 父UiNode
             * @param {UiBox|UiImage|UiInput|UiScale|UiText} child 子UiNode
             * @returns {UiBox|UiImage|UiInput|UiScale|UiText} 父UiNode
             */
            addChildUiNode(parent, ...child) {
                for (var c of child) c.parent = parent;
                return parent;
            },
            /**
             * @description 删除子UiNode
             * @param {UiBox|UiImage|UiInput|UiScale|UiText} parent 父UiNode
             * @returns {UiBox|UiImage|UiInput|UiScale|UiText} 父UiNode
             */
            removeAllChildUiNode(parent) {
                for (var c of parent.children) c.parent = undefined;
                return parent;
            },
            /**
             * @description 查找子UiNode
             * @param {UiBox|UiImage|UiInput|UiScale|UiText} parent 父UiNode
             * @param {UiBox|UiImage|UiInput|UiScale|UiText|string} child 子UiNode或子UiNode的名字
             */
            findChild(parent, child) {
                for (var c of parent.children) {
                    if (c === child || c.name === child) return c;
                    var res = this.findChild(c, child);
                    if (res) return res;
                }
                return -1;
            },
            /**
             * @description 节点树
             */
            tree: {
                /**
                 * @description 获取UiNode的子节点树
                 * @param {UiBox|UiImage|UiInput|UiScale|UiText} parent 父UiNode
                 */
                getUiNodeTree(parent) {
                    var childrenTree = [];
                    for (var c of parent.children) {
                        childrenTree.push({
                            "node": c,
                            "children": this.getUiNodeTree(c)
                        });
                    }
                    return {
                        "node": parent,
                        "children": childrenTree
                    }
                },
                /**
                 * @description 获取UiNode的子节点名称树
                 * @param {UiBox|UiImage|UiInput|UiScale|UiText} parent 父UiNode
                 */
                getUiNodeNameTree(parent) {
                    var childrenTree = [];
                    for (var c of parent.children) {
                        childrenTree.push({
                            "nodeName": c.name,
                            "children": this.getUiNodeNameTree(c)
                        });
                    }
                    return {
                        "nodeName": parent.name,
                        "children": childrenTree
                    }
                }
            }
        }
    }
}

//创建chunkUI
/**
 * @description 客户端UI工具
 */
const chunkUI = new ChunkUI();
//在这行注释后面可以调用chunkUI...
