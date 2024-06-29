//“铱”方块API
//@name     Iridium Voxels
//@class    Voxels API
//@parent   Core
//@version  v1.1.2
//@author   L.W.Kevin0wvf
//@license  MIT
//Copyright (c) 2024, L.W.Kevin0wvf
//用途：便捷的方块/地形控制工具。
/*
更新日志：
v0.0.1 - 完成基础方法并通过测试。
v1.0.0 - 添加bounds方法和paste方法的background选项。
v1.1.0 - 添加柏林噪声扩展。
v1.1.1 - 对version稍作修改。
v1.1.2 - 修复版本判断问题。
*/

"use strict";
console.clear();

class IridiumVoxels {
    static version = "1.1.2";
    /**
     * @description 复制建筑
     * @param {number} sx 起点x坐标
     * @param {number} sy 起点y坐标
     * @param {number} sz 起点z坐标
     * @param {number} ex 终点x坐标
     * @param {number} ey 终点y坐标
     * @param {number} ez 终点z坐标
     * @param options 复制选项
     * @returns {any} 建筑的方块数据
     */
    copy(sx, sy, sz, ex, ey, ez, options = { containAir: false, containRotation: true, skipNormalRotation: true }) {
        if (sx > ex) {
            ex += sx;
            sx = ex - sx;
            ex -= sx;
        }
        if (sy > ey) {
            ey += sy;
            sy = ey - sy;
            ey -= sy;
        }
        if (sz > ez) {
            ez += sz;
            sz = ez - sz;
            ez -= sz;
        }
        var res = options;
        if (options.containAir) {
            res.sx = 0,
                res.sy = 0,
                res.sz = 0,
                res.ex = ex - sx,
                res.ey = ey - sy,
                res.ez = ez - ey;
        }
        res.voxels = [];
        for (var x = sx; x <= ex; x++) {
            for (var y = sy; y <= ey; y++) {
                for (var z = sz; z <= ez; z++) {
                    if (voxels.getVoxelId(x, y, z)) res.voxels.push((
                        (
                            !options.containRotation ||
                            (options.skipNormalRotation && !voxels.getVoxelRotation(x, y, z))
                        ) ? {
                            x: x - sx,
                            y: y - sy,
                            z: z - sz,
                            voxel: voxels.getVoxelId(x, y, z)
                        } : {
                            x: x - sx,
                            y: y - sy,
                            z: z - sz,
                            voxel: voxels.getVoxelId(x, y, z),
                            rotation: voxels.getVoxelRotation(x, y, z)
                        }
                    ));
                }
            }
        }
        return res;
    }
    /**
     * @description 粘贴建筑
     * @param {number} sx 起点x坐标
     * @param {number} sy 起点y坐标
     * @param {number} sz 起点z坐标
     * @param data 建筑的方块数据
     * @param options 粘贴选项
     */
    paste(sx, sy, sz, data, options = { reverse: false, background: null }) {
        var reversed = (options.reverse ? options.reverse : false);
        if (reversed && ["x", "y", "z"].includes(options.rotation)) data = this.reverse(data, options.rotation);
        if (data.containAir) {
            for (var x = data.sx; x <= data.ex; x++) {
                for (var y = data.sy; y <= data.ey; y++) {
                    for (var z = data.sz; z <= data.ez; z++) {
                        voxels.setVoxelId(sx + x, sy + y, sz + z, ((![undefined, null].includes(options.background)) ? options.background : 0));
                    }
                }
            }
        } else if (![undefined, null].includes(options.background)) {
            var bounds = this.bounds(data);
            for (var x = bounds.lo.x; x <= bounds.hi.x; x++) {
                for (var y = bounds.lo.y; y <= bounds.hi.y; y++) {
                    for (var z = bounds.lo.z; z <= bounds.hi.z; z++) {
                        voxels.setVoxelId(sx + x, sy + y, sz + z, options.background);
                    }
                }
            }
        }
        for (var voxel of data.voxels) voxels.setVoxel(sx + voxel.x, sy + voxel.y, sz + voxel.z, voxel.voxel, (voxel.rotation ? voxel.rotation : 0));
    }
    /**
     * @description 轴翻转（以方向轴为0的地方为对称轴）
     * @param data 建筑的方块数据
     * @param {"x"|"y"|"z"} rotation 方向轴
     * @returns {any} 建筑的方块数据
     */
    reverse(data, rotation) {
        if (!["x", "y", "z"].includes(rotation)) return data;
        if (data.containAir) data[`e${rotation}`] *= -1;
        for (var i = 0; i < data.voxels.length; i++) data.voxels[i][rotation] *= -1;
        return data;
    }
    /**
     * @description 统计方块数据
     * @param {number} sx 起点x坐标
     * @param {number} sy 起点y坐标
     * @param {number} sz 起点z坐标
     * @param {number} ex 终点x坐标
     * @param {number} ey 终点y坐标
     * @param {number} ez 终点z坐标
     * @param {string} params 属性
     * @param {string} infoClass 要统计的信息类型
     */
    statistic(sx, sy, sz, ex, ey, ez, params, infoClass) {
        if (sx > ex) {
            ex += sx;
            sx = ex - sx;
            ex -= sx;
        }
        if (sy > ey) {
            ey += sy;
            sy = ey - sy;
            ey -= sy;
        }
        if (sz > ez) {
            ez += sz;
            sz = ez - sz;
            ez -= sz;
        }
        var res = {};
        for (var x = sx; x <= ex; x++) {
            for (var y = sy; y <= ey; y++) {
                for (var z = sz; z <= ez; z++) {
                    if (Object.keys(res).includes(String(voxels[`get${params}`](x, y, z))))
                        if (infoClass === "position") res[voxels[`get${params}`](x, y, z)].push({ x, y, z });
                        else res[voxels[`get${params}`](x, y, z)]++;
                    else
                        if (infoClass === "position") res[voxels[`get${params}`](x, y, z)] = [{ x, y, z }];
                        else res[voxels[`get${params}`](x, y, z)] = 1;
                }
            }
        }
        return res;
    }
    /**
     * @description 获取方块id
     * @param {string|string[]} name 方块name
     * @returns {number[]}
     */
    id(...name) {
        for (var i = 0; i < name.length; i++) name[i] = voxels.id(name[i]);
        return name;
    }
    /**
     * @description 获取方块name
     * @param {string|string[]} id 方块id
     * @returns {number[]}
     */
    name(...id) {
        for (var i = 0; i < id.length; i++) id[i] = voxels.name(id[i]);
        return id;
    }
    /**
     * @description 获取方块数据的最小区域
     * @param data 建筑的方块数据
     * @returns {GameBounds}
     */
    bounds(data) {
        var res = new GameBounds3(new GameVector3(Infinity, Infinity, Infinity), new GameVector3(-Infinity, -Infinity, -Infinity));
        for (var voxel of data.voxels) {
            if (voxel.x < res.lo.x) res.lo.x = voxel.x;
            if (voxel.y < res.lo.y) res.lo.y = voxel.y;
            if (voxel.z < res.lo.z) res.lo.z = voxel.z;
            if (voxel.x > res.hi.x) res.hi.x = voxel.x;
            if (voxel.y > res.hi.y) res.hi.y = voxel.y;
            if (voxel.z > res.hi.z) res.hi.z = voxel.z;
        }
        return res;
    }
    /**
     * @description 速建
     */
    rapidBuild = {
        /**
         * @description 填充区域
         * @param {Partial<IridiumVoxelsFillConfig>} config
         * @example 填充从{x:0,y:0,z:0}到{x:10,y:10,z:10}的区域为朝向为0的stone方块:
         * fill({ sx: 0, sy: 0, sz: 0, ex: 10, ey: 10, ez: 10, voxel: "stone" })
         */
        fill(config) {
            if (!((typeof config.sx === "number") && (typeof config.sy === "number") && (typeof config.sz === "number") && (typeof config.ex === "number") && (typeof config.ey === "number") && (typeof config.ez === "number") && ["number", "string"].includes(typeof config.voxel))) return null;
            if (!config.rotation) config.rotation = 0;
            if (!config.type) config.type = "normal";
            if (config.type === "replace" && config.replaceVoxel === undefined) config.replaceVoxel = 0;
            var sx = config.sx,
                sy = config.sy,
                sz = config.sz,
                ex = config.ex,
                ey = config.ey,
                ez = config.ez,
                voxel = config.voxel,
                rotation = config.rotation,
                type = config.type,
                replaceVoxel = ((typeof config.replaceVoxel === "number") ? config.replaceVoxel : voxels.id(config.replaceVoxel));
            if (ex < sx) {
                ex += sx;
                sx = ex - sx;
                ex -= sx;
            }
            if (ey < sy) {
                ey += sy;
                sy = ey - sy;
                ey -= sy;
            }
            if (ez < sz) {
                ez += sz;
                sz = ez - sz;
                ez -= sz;
            }
            for (var x = sx; x <= ex; x++) {
                for (var y = sy; y <= ey; y++) {
                    for (var z = sz; z <= ez; z++) {
                        if (
                            type === "normal" ||
                            (type === "replace" && voxels.getVoxelId(x, y, z) === replaceVoxel)
                        )
                            voxels.setVoxel(x, y, z, voxel, rotation);
                    }
                }
            }
        },
        /**
         * @description 生成一棵树
         */
        tree(x, y, z, wood = "acacia", leaf = "green_leaf") {
            if (voxels.getVoxel(x, y, z) != voxels.id("water")) {
                var rand = 1;
                for (let i = y + rand; i < y + 4 + rand; i++) { voxels.setVoxel(x, i, z, wood); }
                for (let i = 3 + rand; i < 5 + rand; i++) { for (let j = -2; j < 3; j++) { for (let k = -2; k < 3; k++) { voxels.setVoxel(x + j, y + i, z + k, leaf) } } }
                for (let j = -1; j < 2; j++) { for (let k = -1; k < 2; k++) { voxels.setVoxel(x + j, y + 5 + rand, z + k, leaf); } }
                voxels.setVoxel(x - 1, y + 6 + rand, z, leaf); voxels.setVoxel(x, y + 6 + rand, z, leaf); voxels.setVoxel(x + 1, y + 6 + rand, z, leaf); voxels.setVoxel(x, y + 6 + rand, z - 1, leaf); voxels.setVoxel(x, y + 6 + rand, z + 1, leaf);
            }
        },
        /**
         * @description 在某范围内生成一棵树
         * @param {number} sx 起点x坐标
         * @param {number} sy 起点y坐标
         * @param {number} sz 起点z坐标
         * @param {number} ex 终点x坐标
         * @param {number} ey 终点y坐标
         * @param {number} ez 终点z坐标
         * @param {number} probability 可能性
         */
        spawnTree(sx, sy, sz, ex, ey, ez, probability = 0.006666666666666667) {
            for (var x = sx; x <= ex; x++)
                for (let z = sz; z <= ez; z++)
                    for (let y = sy; y <= ey; y++)
                        if (voxels.getVoxel(x, y, z) === voxels.id("grass") && !voxels.getVoxel(x, y + 1, z) && Math.random() <= probability) this.tree(x, y, z);
        },
        /**
         * @description 柏林噪声
         * @param {number} sx 起点x坐标
         * @param {number} sz 起点z坐标
         * @param {number} ex 终点x坐标
         * @param {number} ez 终点z坐标
         * @param {any} options 选项
         * 默认为
         * ```javascript
         * { minHeight: 2, smooth: 2.5, waterLevel: 12, tree: false, quality: 1, k: 5, grass: "grass", dirt: "dirt", sand: "sand", water: "water" }
         * ```
         * @param {number} minHeight 最小高度(如果要保留最底层的stone方块，那么minHeight≥2)
         * @param {number} smooth 平滑度(平滑度越小高度越大)
         * ```javascript
         * Math.round(dat[index] / smooth + minHeight)
         * ```
         * @param {number} waterLevel 水平面高度
         * @param {boolean} tree 是否生成树
         * @param {number} quality 高度生成系数
         * ```javascript
         * data[i] += Math.abs(this.noise((i % width) / quality, (~ ~(i / width)) / quality, Math.random() * 100) * quality * 1.75);
         * ```
         * @param {number} k 高度生成系数
         * ```javascript
         * quality *= k;
         * ```
         */
        perlinNoiseGenerateTerrain(sx, sz, ex, ez, options = { minHeight: 2, smooth: 2.5, waterLevel: 12, tree: false, quality: 1, k: 5, grass: "grass", dirt: "dirt", sand: "sand", water: "water" }) {
            if (!CarbonCoreBase) throw new Error("IridiumVoxels Error:Please add CarbonCoreBase before calling the perlinNoiseGenerateTerrain method");
            else if (!carbonCoreBase) throw new Error("IridiumVoxels Error:Please create the carbonCoreBase object before calling the perlinNoiseGenerateTerrain method");
            else if (!PlutoniumFunctions) throw new Error("IridiumVoxels Error:Please add PlutoniumFunctions-API before calling the perlinNoiseGenerateTerrain method");
            else if (carbonCoreBase.versions.compare(PlutoniumFunctions.version, "1.0.1") < 0) throw new Error("IridiumVoxels Error:The version of PlutoniumFunctions-API is not high enough");
            else if (!plutoniumFunctions) throw new Error("IridiumVoxels Error:Please create the plutoniumFunctions object before calling the perlinNoiseGenerateTerrain method");
            var minHeight = options.minHeight ? options.minHeight : 2,
                smooth = options.smooth ? options.smooth : 2.5,
                waterLevel = options.waterLevel ? options.waterLevel : 12,
                tree = options.tree ? options.tree : false,
                quality = options.quality ? options.quality : 1,
                k = options.k ? options.k : 5,
                grass = options.grass ? options.grass : "grass",
                dirt = options.dirt ? options.dirt : "dirt",
                sand = options.sand ? options.sand : "sand",
                water = options.water ? options.water : "water";
            var sizeX = ex - sx + 1, sizeZ = ez - sz + 1, dat = plutoniumFunctions.improved2DPerlinNoise.generateHeight(sizeX, sizeZ, quality, k);
            for (let x = 0; x < sizeX; x++) {
                for (let z = 0; z <= sizeZ; z++) {
                    const index = x + z * sizeX;
                    var y = Math.round(dat[index] / smooth + minHeight);
                    if (y > waterLevel) voxels.setVoxel(sx + x, y, sz + z, grass);
                    else if (y == waterLevel) voxels.setVoxel(sx + x, y, sz + z, sand);
                    else {
                        voxels.setVoxel(sx + x, y, sz + z, dirt);
                        for (let s = y + 1; s <= waterLevel; s++) {
                            voxels.setVoxel(sx + x, s, sz + z, water);
                        }
                    }
                    for (let s = minHeight - 1; s < y; s++) voxels.setVoxel(sx + x, s, sz + z, dirt);
                }
            }
            if (tree) this.spawnTree();
        }
    }
}

/**
 * @description 便捷的方块/地形控制工具。
 */
const iridiumVoxels = new IridiumVoxels();
globalThis.IridiumVoxels = IridiumVoxels;
globalThis.iridiumVoxels = iridiumVoxels;
//在这行注释后面可以调用iridiumVoxels...
