//“钛”端信息传递API-客户端
//@name     Titanium RemoteChannel
//@class    RemoteChannel API
//@parent   Core
//@version  v0.0.2
//@author   L.W.Kevin0wvf
//@license  BSD-3-Clause
//Copyright (c) 2024, L.W.Kevin0wvf
//用途：端信息传递API。
/*
更新日志：
v0.0.1 - 完成基础方法。
v1.0.0 - 对代码细节进行部分修改，修复报错信息问题，把getChannelData方法改为(getter)channelData。
*/

"use strict";
console.clear();

class ClientTitaniumRemoteChannel {
    #channelData
    constructor(datas = {}) {
        this.#channelData = {};
        this.datas = datas;
        this.channelLog = true;
        this.requestInterval = 500;
        this.listened = false;
    }
    /**
     * @description 调试信息输出
     * @param {any[]} args 信息
     */
    titaniumLog(...args) {
        if (this.channelLog) console.log(...args);
    }
    /**
     * @description 判断是否接收到服务端回答
     * @param {any[]} args 传递的数据
     */
    received(...args) {
        for (var arg of args) {
            if (!this.#channelData[arg.data]) return false;
        }
        return true;
    }
    /**
     * @description 向服务端请求并等待回答
     * @param {any[]} args 传递的数据
     */
    async get(...args) {
        for (var arg of args) delete this.#channelData[arg.data];
        while (!this.received(...args)) {
            for (var arg of args) if (!this.#channelData[arg.data]) {
                arg.type = "get";
                remoteChannel.sendServerEvent(arg);
            }
            await sleep(this.requestInterval);
        }
    }
    /**
     * @description 向服务端请求并等待回答
     * @param {any[]} args 传递的数据
     */
    async specialGet(...args) {
        for (var arg of args) delete this.#channelData[arg.data];
        while (!this.received(...args)) {
            for (var arg of args) if (!this.#channelData[arg.data]) {
                arg.type = "specialGet";
                remoteChannel.sendServerEvent(arg);
            }
            await sleep(this.requestInterval);
        }
    }
    /**
     * @description 向服务端发送事件
     * @param {any[]} args 传递的数据
     */
    async event(...args) {
        for (var arg of args) delete this.#channelData[arg.data];
        while (!this.received(...args)) {
            for (var arg of args) if (!this.#channelData[arg.data]) {
                arg.type = "event";
                remoteChannel.sendServerEvent(arg);
            }
            await sleep(this.requestInterval);
        }
    }
    /**
     * @description 向服务端发送更新
     * @param {any[]} args 传递的数据
     */
    async update(...args) {
        for (var arg of args) delete this.#channelData[arg.data];
        while (!this.received(...args)) {
            for (var arg of args) if (!this.#channelData[arg.data]) {
                arg.type = "update";
                remoteChannel.sendServerEvent(arg);
            }
            await sleep(this.requestInterval);
        }
    }
    /**
     * @description 监听端传递信息
     */
    listen() {
        this.listened = true;
        remoteChannel.events.on("client", (args) => {
            titaniumRemoteChannel.titaniumLog(`客户端收到服务端${args.type}：${JSON.stringify(args)}`);
            switch (args.type) {
                case "get":
                    try {
                        var data = this.datas[args.data.split(".")[0]];
                        for (var param of args.data.split(".").slice(1)) data = data[param];
                        remoteChannel.sendServerEvent({
                            "type": "answer",
                            "problem": args.data,
                            "data": data
                        });
                    } catch (e) {
                        throw new Error(`Unknown requests ${JSON.stringify(args)}, error:${e.stack}`);
                    }
                    break;
                case "specialGet":
                    remoteChannel.sendServerEvent({
                        "type": "answer",
                        "problem": args.data,
                        "data": this.datas[args.data]
                    });
                    if (this.datas[args.data] === undefined) throw new Error(`Unknown requests ${JSON.stringify(args)}, error:${e.stack}`);
                    break;
                case "answer":
                    this.#channelData[args.problem] = args.data;
                    break;
                case "event":
                    if (this.datas[args.data]) this.datas[args.data]();
                    else throw new Error(`Unknown requests ${JSON.stringify(args)}, error:${e.stack}`);
                    remoteChannel.sendServerEvent({
                        "type": "answer",
                        "problem": args.data,
                        "data": true
                    });
                    break;
                case "update":
                    for (var [key, value] of Object.entries(args.data)) this.#channelData[key] = value;
                    break;
                default:
                    throw new Error(`Unknown requests ${JSON.stringify(args)}`);
            }
        });
    }
    /**
     * @description 获取接收到的信息
     */
    get channelData() {
        return this.#channelData;
    }
}
/**
 * @description 客户端Titanium端信息传递工具
 */
const titaniumRemoteChannel = new ClientTitaniumRemoteChannel();
//开始监听服务端信息
titaniumRemoteChannel.listen();
//在这行注释后面可以调用titaniumRemoteChannel...
