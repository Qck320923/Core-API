//“钨”云端存储管理API
//@name     Tungsten Storage
//@class    Storage API
//@parent   Core
//@version  v0.1.0
//@author   L.W.Kevin0wvf
//@license  MIT
//Copyright (c) 2024, L.W.Kevin0wvf
//用途：便捷云端存储管理。
/*
更新日志：
v0.0.1 - 把GameStorage和GameDataStorage的属性和JsDoc搬进TungstenStorage和TungstenDataStorage，添加更多简便方法。
v0.1.0 - 修改listT方法名为array，添加storage模板(template)初始化功能，添加USER数据库模板，以及一些代码细节修改。
*/

"use strict";
console.clear();

/**
 * @typedef {object} TungstenDataStorageConfigs
 * @property {string} template 模板
 * 
 * @typedef {object} TungstenUserDataStorageSaveCatchFuncParams
 * @property {GameEntity} entity 玩家实体
 * @property {JSONValue} data 用户数据
 * @property {Error} error 错误/异常
 * 
 * @typedef {object} TungstenUserDataStorageSaveOptions
 * @property {GameEntity} entity 玩家实体
 * @property {JSONValue} data 用户数据
 * @property {(entity: GameEntity) => void} guestFunc 玩家为游客时执行的操作
 * @property {(params: TungstenUserDataStorageSaveCatchFuncParams) => void} catchFunc 报错时执行的操作
 * @property {number} interval 重试间隔
 * @property {number} timeout 超时限制
 * 
 * @typedef {object} TungstenUserDataStorageLoadCatchFuncParams
 * @property {GameEntity} entity 玩家实体
 * @property {Error} error 错误/异常
 * 
 * @typedef {object} TungstenUserDataStorageLoadOptions
 * @property {GameEntity} entity 玩家实体
 * @property {(entity: GameEntity) => void} guestFunc 玩家为游客时执行的操作
 * @property {(entity: GameEntity) => void} noDataFunc 没有数据时执行的操作
 * @property {(params: TungstenUserDataStorageLoadCatchFuncParams) => void} catchFunc 报错时执行的操作
 * @property {number} interval 重试间隔
 * @property {number} timeout 超时限制
 * 
 * @typedef {object} TungstenUserDataStorageDeleteOptions
 * @property {GameEntity} entity 玩家实体
 * @property {(entity: GameEntity) => void} guestFunc 玩家为游客时执行的操作
 * @property {(params: TungstenUserDataStorageLoadCatchFuncParams) => void} catchFunc 报错时执行的操作
 * @property {number} interval 重试间隔
 * @property {number} timeout 超时限制
 * 
 * @typedef {object} TungstenDataStorageConfigOptions
 * @property {TungstenDataStorageConfigs} configs 配置
 * @property {number} timeout 超时限制
 * @property {boolean} reset 重置
 */

const TungstenDataStorageTemplate = {
    NONE: "none",/* 无 */
    USER: "user",/* 用户 */
    // RECORD: "record",/* 记录 */
    // LEADERBOARD: "leaderboard"/* 排行榜 */
}

class TungstenStorage {
    /**
     * @param {string} key
     * @returns {TungstenDataStorage}
     */
    getDataStorage(key) { return new TungstenDataStorage(storage.getDataStorage(key)); }
    /**
     * @param {string} key
     * @returns {TungstenDataStorage}
     */
    getGroupStorage(key) { return new TungstenDataStorage(storage.getGroupStorage(key)); }
}

class TungstenDataStorage {
    #user = {
        /**
         * @description 存储用户数据
         * @param {TungstenUserDataStorageSaveOptions} options 选项
         */
        save: async (options) => {
            if (!options.entity.isPlayer) return;
            if (options.entity.isPlayer && ["0", 0, ""].includes(options.entity.player.userId)) {
                options.guestFunc(options.entity);
                return { code: -2, msg: "guest" };
            }
            let startTime = Date.now();
            while (true) {
                try {
                    return await this.update(options.entity.player.userId, () => options.data);
                } catch (error) {
                    options.catchFunc({ entity: options.entity, data: options.data, error });
                    if (Date.now() - startTime >= (options.timeout ? options.timeout : 10000)) throw new Error(`TungstenStorage Error:The save operation of the user database timed out. Error:${e}`);
                }
                await sleep(options.interval ? options.interval : 1000);
            }
        },
        /**
         * @description 加载用户数据
         * @param {TungstenUserDataStorageLoadOptions} options 选项
         */
        load: async (options) => {
            if (!options.entity.isPlayer) return;
            if (options.entity.isPlayer && ["0", 0, ""].includes(options.entity.player.userId)) {
                options.guestFunc(options.entity);
                return { code: -2, msg: "guest" };
            }
            let startTime = Date.now();
            while (true) {
                try {
                    let data = await this.get(options.entity.player.userId);
                    if (data && data.value) return { code: 0, msg: "success", data };
                    else {
                        options.noDataFunc(options.entity);
                        return { code: -1, msg: "noData" };
                    }
                } catch (error) {
                    options.catchFunc({ entity: options.entity, error });
                    if (Date.now() - startTime >= (options.timeout ? options.timeout : 10000)) throw new Error(`TungstenStorage Error:The load operation of the user database timed out. Error:${e}`);
                }
                await sleep(options.interval ? options.interval : 1000);
            }
        },
        /**
         * @description 删除用户数据
         * @param {TungstenUserDataStorageDeleteOptions} options 选项
         */
        delete: async (options) => {
            if (!options.entity.isPlayer) return;
            if (options.entity.isPlayer && ["0", 0, ""].includes(options.entity.player.userId)) {
                options.guestFunc(options.entity);
                return { code: -2, msg: "guest" };
            }
            let startTime = Date.now();
            while (true) {
                try {
                    return await this.remove(options.entity.player.userId);
                } catch (error) {
                    options.catchFunc({ entity: options.entity, error });
                    if (Date.now() - startTime >= (options.timeout ? options.timeout : 10000)) throw new Error(`TungstenStorage Error:The load operation of the user database timed out. Error:${e}`);
                }
                await sleep(options.interval ? options.interval : 1000);
            }
        }
    };
    #record = {};
    #leaderboard = {};
    user = {
        /**
         * @description 存储用户数据
         * @param {TungstenUserDataStorageSaveOptions} options 选项
         */
        save: async (options) => { },
        /**
         * @description 加载用户数据
         * @param {TungstenUserDataStorageLoadOptions} options 选项
         */
        load: async (options) => { },
        /**
         * @description 删除用户数据
         * @param {TungstenUserDataStorageDeleteOptions} options 选项
         */
        delete: async (options) => { }
    };
    record = {};
    leaderboard = {};
    constructor(dataStorage) {
        this.key = String();
        Object.assign(this, dataStorage);
    }
    /**
     * @returns {Promise<void>}
     */
    destroy() { }
    /**
     * @param {string} key
     * @returns {Promise<I.ReturnValue>}
     */
    get(key) { }
    /**
     * @param {I.ListPageOptions} options
     * @returns {Promise<QueryList>}
     */
    list(options) { }
    /**
     * @param {string} key
     * @returns {Promise<I.ReturnValue>}
     */
    remove(key) { }
    /**
     * @param {string} key
     * @param {JSONValue} value
     * @returns {Promise<void>}
     */
    set(key, value) { }
    /**
     * @param {string} key
     * @param {(prevValue:I.ReturnValue)=>JSONValue} handler
     * @returns {Promise<void>}
     */
    update(key, handler) { }
    /**
     * @description 获取字典格式数据库数据
     * @param {I.ListPageOptions} options
     */
    async dictionary(options) {
        let queryList = await this.list(options), dictionary = {};
        while (true) {
            for (let data of queryList.getCurrentPage()) dictionary[data.key] = data;
            if (queryList.isLastPage) return dictionary;
            await queryList.nextPage();
        }
    }
    /**
     * @description 获取列表格式数据库数据
     * @param {I.ListPageOptions} options
     * @returns {string[]}
     */
    async array(options) {
        let queryList = await this.list(options), list = [];
        while (true) {
            list = list.concat(queryList.getCurrentPage());
            if (queryList.isLastPage) return list;
            await queryList.nextPage();
        }
    }
    /**
     * @description 初始配置数据库
     * @param {TungstenDataStorageConfigOptions} options
     */
    async config(options) {
        let startTime = Date.now();
        while (true) {
            try {
                let info = await this.get("info");
                if (info && info.value && !options.reset) {
                    return { code: -1, msg: "already", data: JSON.parse(info.value) };
                } else {
                    if (info && info.value && options.reset && JSON.parse(info.value).template != TungstenDataStorageTemplate.NONE) delete this[JSON.parse(info.value).template];
                    let conf = {
                        template: (options.configs.template ? options.configs.template : TungstenDataStorageTemplate.NONE)
                    };
                    await this.set("info", JSON.stringify(conf));
                    if (options.configs.template && options.configs.template != TungstenDataStorageTemplate.NONE) this[options.configs.template] = this[`#${options.configs.template}`];
                    return { code: 0, msg: "success", data: conf };
                }
            } catch (e) {
                if ((Date.now() - startTime) >= (options.timeout ? options.timeout : 10000)) {
                    console.error(`TungstenDataStorage "${this.key}" failed to configure. Error:${e}`);
                    return { code: -2, msg: "failed" };
                }
            }
        }
    }
}
/**
 * @description 云端存储管理工具
 */
const tungstenStorage = new TungstenStorage();
globalThis.tungstenStorage = tungstenStorage;
//在这行注释后面可以调用tungstenStorage...
