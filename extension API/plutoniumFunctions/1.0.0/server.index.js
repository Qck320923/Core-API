//“钚”函数库
//@name     Plutonium Functions
//@class    Functions API
//@parent   Core
//@version  v1.0.0
//@author   L.W.Kevin0wvf
//@license  MIT
//Copyright (c) 2024, L.W.Kevin0wvf
//用途：便捷函数。
/*
更新日志：
v1.0.0 - 加入基础函数。
*/

"use strict";
console.clear();

class PlutoniumFunctions {
    version = "1.0.0"
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
    improved2DPerlinNoise = {
        p: [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180, 151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180],
        fade(t) { return t * t * t * (t * (t * 6 - 15) + 10) },
        lerp(t, a, b) { return a + t * (b - a) },
        grad(hash, x, y, z) {
            var h = hash & 15;
            var u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
            return ((h & 1) == 0 ? u : - u) + ((h & 2) == 0 ? v : - v);
        },
        noise(x, y, z) {
            var floorX = Math.floor(x), floorY = Math.floor(y), floorZ = Math.floor(z);
            var X = floorX & 255, Y = floorY & 255, Z = floorZ & 255;
            x -= floorX;
            y -= floorY;
            z -= floorZ;
            var xMinus1 = x - 1, yMinus1 = y - 1, zMinus1 = z - 1;
            var u = this.fade(x), v = this.fade(y), w = this.fade(z);
            var A = this.p[X] + Y, AA = this.p[A] + Z, AB = this.p[A + 1] + Z, B = this.p[X + 1] + Y, BA = this.p[B] + Z, BB = this.p[B + 1] + Z;
            return this.lerp(w, this.lerp(v, this.lerp(u, this.grad(this.p[AA], x, y, z),
                this.grad(this.p[BA], xMinus1, y, z)),
                this.lerp(u, this.grad(this.p[AB], x, yMinus1, z),
                    this.grad(this.p[BB], xMinus1, yMinus1, z))),
                this.lerp(v, this.lerp(u, this.grad(this.p[AA + 1], x, y, zMinus1),
                    this.grad(this.p[BA + 1], xMinus1, y, zMinus1)),
                    this.lerp(u, this.grad(this.p[AB + 1], x, yMinus1, zMinus1),
                        this.grad(this.p[BB + 1], xMinus1, yMinus1, zMinus1))));
        },
        generateHeight(width, height, quality = 1, k = 5) {
            const size = width * height, data = new Uint8Array(size), z = Math.random() * 100;
            for (let j = 0; j < 4; j++) {
                for (let i = 0; i < size; i++) {
                    const x = i % width, y = Math.floor(i / width);
                    data[i] += Math.abs(this.noise(x / quality, y / quality, z) * quality * 1.75);
                }
                quality *= k;
            }
            return data;
        }
    }
}
/**
 * @description 便捷函数。
 */
const plutoniumFunctions = new PlutoniumFunctions();
globalThis.plutoniumFunctions = plutoniumFunctions;
//在这行注释后面可以调用plutoniumFunctions...
