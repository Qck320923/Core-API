//Core-API基础语法
//@name     Carbon Core Base
//@class    Core-API Base
//@parent   Core
//@version  v1.0.0
//@author   L.W.Kevin0wvf
//@license  MIT
//Copyright (c) 2024, L.W.Kevin0wvf
//用途：使用Core-API中需要CarbonCoreBase支持的API。
/*
更新日志：
v1.0.0 - 完成基础语法。
*/

"use strict";
console.clear();

class CarbonCoreBase {
    version = "1.0.0"
    versions = {
        /**
         * @description 比较版本号
         * @param {string} v1 版本号1
         * @param {string} v2 版本号2
         * @returns {boolean}
         */
        compare(v1, v2, cmp) {
            var vA = v1.split("."), vB = v2.split("."), len = Math.min(vA.length, vB.length);
            for (var i = 0; i < len; i++) if (cmp(Number(vA[i]), Number(vB[i]))) return true;
            return false;
        }
    }
}
/**
 * @description Core-API基础语法
 */
const carbonCoreBase = new CarbonCoreBase();
globalThis.carbonCoreBase = carbonCoreBase;
//在这行注释后面可以调用carbonCoreBase...



