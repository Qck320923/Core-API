//“钛”端信息传递API-服务端
//@name     Titanium RemoteChannel
//@class    RemoteChannel API
//@parent   Core
//@version  v1.0.1
//@author   L.W.Kevin0wvf
//@license  MIT
//Copyright (c) 2024, L.W.Kevin0wvf
//用途：端信息传递API。

"use strict";
console.clear();

class ServerTitaniumRemoteChannel {
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
     * @description 判断是否接收到客户端回答
     * @param {GamePlayerEntity|string} entity 玩家实体或所有玩家"*"
     * @param {any[]} args 传递的数据
     */
    received(entity, ...args) {
        for (var arg of args) {
            if (!this.#channelData[args.data]) return false;
            if (entity === "*") {
                for (var entity of world.querySelectorAll("player")) {
                    if (!this.#channelData[args.data][entity.player.name]) return false;
                }
            }
            else if (!this.#channelData[arg.data][entity.player.name]) return false;
        }
        return true;
    }
    /**
     * @description 向客户端请求并等待回答
     * @param {GamePlayerEntity|string} entity 玩家实体或所有玩家"*"
     * @param {any[]} args 传递的数据
     */
    async get(entity, ...args) {
        for (var arg of args) delete this.#channelData[arg.data];
        while (!this.received(entity, ...args)) {
            for (var arg of args) if (!this.#channelData[arg.data]) {
                arg.type = "get";
                if (entity === "*") remoteChannel.broadcastClientEvent(arg);
                else remoteChannel.sendClientEvent(entity, arg);
            }
            await sleep(this.requestInterval);
        }
    }
    /**
     * @description 向客户端请求并等待回答
     * @param {GamePlayerEntity|string} entity 玩家实体或所有玩家"*"
     * @param {any[]} args 传递的数据
     */
    async specialGet(entity, ...args) {
        for (var arg of args) delete this.#channelData[arg.data];
        while (!this.received(entity, ...args)) {
            for (var arg of args) if (!this.#channelData[arg.data]) {
                arg.type = "specialGet";
                if (entity === "*") remoteChannel.broadcastClientEvent(arg);
                else remoteChannel.sendClientEvent(entity, arg);
            }
            await sleep(this.requestInterval);
        }
    }
    /**
     * @description 向客户端发送事件
     * @param {GamePlayerEntity|string} entity 玩家实体或所有玩家"*"
     * @param {any[]} args 传递的数据
     */
    async event(entity, ...args) {
        for (var arg of args) delete this.#channelData[arg.data];
        while (!this.received(entity, ...args)) {
            for (var arg of args) if (!this.#channelData[arg.data]) {
                arg.type = "event";
                if (entity === "*") remoteChannel.broadcastClientEvent(arg);
                else remoteChannel.sendClientEvent(entity, arg);
            }
            await sleep(this.requestInterval);
        }
    }
    /**
     * @description 向客户端发送更新
     * @param {GamePlayerEntity|string} entity 玩家实体或所有玩家"*"
     * @param {any[]} args 传递的数据
     */
    update(entity, ...args) {
        for (var arg of args) if (!this.#channelData[arg.data]) {
            arg.type = "update";
            if (entity === "*") remoteChannel.broadcastClientEvent(arg);
            else remoteChannel.sendClientEvent(entity, arg);
        }
    }
    /**
     * @description 监听端传递信息
     */
    listen() {
        if (this.listened) return;
        this.listened = true;
        remoteChannel.onServerEvent(({ entity, args }) => {
            this.titaniumLog(`服务端收到${entity.player.name}客户端${args.type}：${JSON.stringify(args)}`);
            switch (args.type) {
                case "get":
                    try {
                        if (this.datas[args.data]) remoteChannel.sendClientEvent(entity, this.datas[args.data]);
                        else {
                            var data = eval(args.data);
                            remoteChannel.sendClientEvent(entity, {
                                "type": "answer",
                                "problem": args.data,
                                "data": data
                            });
                        }
                    } catch (e) {
                        throw new Error(`Unknown requests ${JSON.stringify(args)}, error:${e.stack}`);
                    }
                    break;
                case "specialGet":
                    remoteChannel.sendClientEvent(entity, {
                        "type": "answer",
                        "problem": args.data,
                        "data": this.datas[args.data]
                    });
                    if (this.datas[args.data] === undefined) throw new Error(`Unknown requests ${JSON.stringify(args)}`);
                    break;
                case "answer":
                    if (!this.#channelData[args.problem]) this.#channelData[args.problem] = {};
                    this.#channelData[args.problem][entity.player.name] = args.data;
                    break;
                case "event":
                    if (this.datas[args.data]) this.datas[args.data]();
                    else throw new Error(`Unknown requests ${JSON.stringify(args)}, error:${e.stack}`);
                    remoteChannel.sendClientEvent(entity, {
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
 * @description 服务端Titanium端信息传递工具
 */
const titaniumRemoteChannel = new ServerTitaniumRemoteChannel();
//开始监听客户端信息
titaniumRemoteChannel.listen();
//在这行注释后面可以调用titaniumRemoteChannel...
