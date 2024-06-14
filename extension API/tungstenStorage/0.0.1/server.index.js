//“钨”云端存储管理API
//@name     Tungsten Storage
//@class    Storage API
//@parent   Core
//@version  v0.0.1
//@author   L.W.Kevin0wvf
//@license  MIT
//Copyright (c) 2024, L.W.Kevin0wvf
//用途：便捷云端存储管理。
/*
更新日志：
v0.0.1 - 把GameStorage和GameDataStorage的属性和JsDoc搬进TungstenStorage和TungstenDataStorage，添加更多简便方法。
*/

"use strict";
console.clear();

class TungstenStorage {
    constructor() {
        ;
    }
    /**
     * @param {string} key
     * @returns {TungstenDataStorage}
     */
    getDataStorage(key) { return new TungstenDataStorage(storage.getDataStorage(key)) }
    /**
     * @param {string} key
     * @returns {TungstenDataStorage}
     */
    getGroupStorage(key) { return new TungstenDataStorage(storage.getGroupStorage(key)) }
}

class TungstenDataStorage {
    constructor(dataStorage) {
        this.key = "";
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
     * @param {I.ListPageOptions} options
     */
    async dictionary(options) {
        var queryList = await this.list(options), dictionary = {};
        while (true) {
            for (var data of queryList.getCurrentPage()) dictionary[data.key] = data;
            if (queryList.isLastPage) return dictionary;
            await queryList.nextPage();
        }
    }
    /**
     * @param {I.ListPageOptions} options
     */
    async listT(options) {
        var queryList = await this.list(options), list = [];
        while (true) {
            list = list.concat(queryList.getCurrentPage());
            if (queryList.isLastPage) return list;
            await queryList.nextPage();
        }
    }
}
/**
 * @description 云端存储管理工具
 */
const tungstenStorage = new TungstenStorage();
//在这行注释后面可以调用tungstenStorage...
