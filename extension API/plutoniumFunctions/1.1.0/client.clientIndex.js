//“钚”函数库
//@name     Plutonium Functions
//@class    Functions API
//@parent   Core
//@version  v1.1.0
//@author   L.W.Kevin0wvf
//@license  MIT
//Copyright (c) 2024, L.W.Kevin0wvf
//用途：便捷函数。
/*
更新日志：
v1.0.0 - 加入基础函数。
v1.0.1 - 对version稍作修改。
v1.1.0 - 加入霍夫曼压缩/解压算法。
*/

"use strict";
console.clear();

class PlutoniumFunctions {
    static version = "1.1.0";
    number = {
        /**
         * @description 随机小数
         * @param {number} low 最低值
         * @param {number} high 最高值
         * @param {number} size 相邻可能返回值之间的间隔
         * @example randfloat(0, 1)的返回值在0到1之间(0≤returnValue≤1)
         * @example randfloat(0, 1, 0.1)的返回值在[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1]之中
         * @example randfloat(0, 0.1, 0.2)的返回值为0
         * @example randfloat(0, 10, 1)的返回值在[0,1,2,3,4,5,6,7,8,9,10]之中
         * @returns {number} 随机结果
         */
        randfloat(low, high, size = null) {
            if (size) return this.floor(low + Math.round(Math.random() * Math.floor((high - low) / size)) * size, this.fractionalPartLength(size));
            else return this.floor(low + Math.random() * (high - low));
        },
        /**
         * @description 随机整数
         * @param {number} low 最低值
         * @param {number} high 最高值
         * @param {number} size 相邻可能返回值之间的间隔（最小为1）
         * @example randint(0, 100)的返回值在0到100之间(0≤returnValue≤1)
         * @example randint(0, 100, 20)的返回值在[0,20,40,60,80,100]之中
         * @example randint(0, 10, 0.1)的返回值在[0,1,2,3,4,5,6,7,8,9,10]之中
         * @example randint(0, 100, 200)的返回值为0
         * @returns {number} 随机结果
         */
        randint(low, high, size = null) {
            if (size) return Math.round(low + Math.floor(Math.random() * (high - low) / size) * size);
            else return Math.round(low + Math.random() * (high - low));
        },
        /**
         * @description 四舍五入
         * @param {number} x 数
         * @param {number} n 要保留的位数，默认为0
         * @returns {number} 四舍五入后的数
         */
        round(x, n) {
            return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
        },
        /**
         * @description 向下取整
         * @param {number} x 数
         * @param {number} n 要保留的位数，默认为0
         * @returns {number} 向下取整后的数
         */
        floor(x, n) {
            return Math.floor(x * Math.pow(10, n)) / Math.pow(10, n);
        },
        /**
         * @description 向上取整
         * @param {number} x 数
         * @param {number} n 要保留的位数，默认为0
         * @returns {number} 向上取整后的数
         */
        ceil(x, n = 0) {
            return Math.ceil(x * Math.pow(10, n)) / Math.pow(10, n);
        },
        /**
         * @description 小数部分长度
         * @param {number} x 数
         * @returns {number} 返回小数部分的长度
         */
        fractionalPartLength(x) {
            var parts = String(x).split(".");
            if (!parts[1]) return 0;
            return parts[1].length;
        },
        /**
         * @description 取总和
         * @param {number[]} x 数
         * @returns {number} 总和
         */
        sum(...x) {
            return x.reduce(function (sum, val) { return sum + val }, 0);
        },
        /**
         * @description 取平均数
         * @param {number[]} x 数
         * @returns {number} 平均数
         */
        average(...x) {
            return x.reduce(function (sum, val) { return sum + val }, 0) / x.length;
        }
    }
    list = {
        /**
         * @description 数组遍历进行操作
         * @param {any[]} list 数组
         * @param func 函数
         * @returns {any[]}
         */
        listChange(list, func) {
            for (var i = 0; i < list.length; i++) list[i] = func(list[i]);
            return list;
        },
        /**
         * @description 重复数组
         * @param {any[]} list 数组
         * @param {number} count 次数
         * @param {boolean} increaseDimension 是否增加维度，默认为false
         * @returns {any[]}
         */
        repeat(list, count, increaseDimension = false) {
            if (increaseDimension) return Array.from({ length: count }, () => [...list]);
            else {
                if (!list.length || count <= 0) return [];
                var res = [];
                for (let i = 1; i < count; i++) {
                    res = res.concat(list);
                }
                return res;
            }
        }
    }
    string = {
        /**
         * @description 统计字符串中出现某字符串的次数
         * @param {string} str1 字符串1
         * @param {string} str2 字符串2
         * @param {number} start 开始下标
         * @param {number} end 结束下标
         * @returns {number}
         */
        count(str1, str2, start = 0, end = -1) {
            var cnt = 0;
            for (var i = start; i <= ((end >= 0) ? (end) : (str1.length + end)) - str2.length + 1; i++) {
                if (str1.slice(i, i + str2.length) === str2) cnt++;
            }
            return cnt;
        }
    }
}
/**
 * @description 便捷函数。
 */
const plutoniumFunctions = new PlutoniumFunctions();
globalThis.PlutoniumFunctions = PlutoniumFunctions;
globalThis.plutoniumFunctions = plutoniumFunctions;
//在这行注释后面可以调用plutoniumFunctions...
