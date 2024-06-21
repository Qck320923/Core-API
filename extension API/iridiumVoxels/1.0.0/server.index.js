//“铱”方块API
//@name     Iridium Voxels
//@class    Voxels API
//@parent   Core
//@version  v1.0.0
//@author   L.W.Kevin0wvf
//@license  MIT
//Copyright (c) 2024, L.W.Kevin0wvf
//用途：便捷的方块/地形控制工具。
/*
更新日志：
v0.0.1 - 完成基础方法并通过测试。
v1.0.0 - 添加bounds方法和paste方法的background选项。
*/

"use strict";
console.clear();

class IridiumVoxels {
    /**
     * @description 填充区域
     * @param {Partial<IridiumVoxelsFillConfig>} config
     * @example 填充从{x:0,y:0,z:0}到{x:10,y:10,z:10}的区域为朝向为0的stone方块:
     * fill({ sx: 0, sy: 0, sz: 0, dx: 10, dy: 10, dz: 10, voxel: "stone" })
     */
    fill(config) {
        if (!((typeof config.sx === "number") && (typeof config.sy === "number") && (typeof config.sz === "number") && (typeof config.dx === "number") && (typeof config.dy === "number") && (typeof config.dz === "number") && ["number", "string"].includes(typeof config.voxel))) return null;
        if (!config.rotation) config.rotation = 0;
        if (!config.type) config.type = "normal";
        if (config.type === "replace" && config.replaceVoxel === undefined) config.replaceVoxel = 0;
        var sx = config.sx,
            sy = config.sy,
            sz = config.sz,
            dx = config.dx,
            dy = config.dy,
            dz = config.dz,
            voxel = config.voxel,
            rotation = config.rotation,
            type = config.type,
            replaceVoxel = ((typeof config.replaceVoxel === "number") ? config.replaceVoxel : voxels.id(config.replaceVoxel));
        if (dx < sx) {
            dx += sx;
            sx = dx - sx;
            dx -= sx;
        }
        if (dy < sy) {
            dy += sy;
            sy = dy - sy;
            dy -= sy;
        }
        if (dz < sz) {
            dz += sz;
            sz = dz - sz;
            dz -= sz;
        }
        for (var x = sx; x <= dx; x++) {
            for (var y = sy; y <= dy; y++) {
                for (var z = sz; z <= dz; z++) {
                    if (
                        type === "normal" ||
                        (type === "replace" && voxels.getVoxelId(x, y, z) === replaceVoxel)
                    )
                        voxels.setVoxel(x, y, z, voxel, rotation);
                }
            }
        }
    }
    /**
     * @description 复制建筑
     * @param {number} sx 起点x坐标
     * @param {number} sy 起点y坐标
     * @param {number} sz 起点z坐标
     * @param {number} sx 终点x坐标
     * @param {number} sy 终点y坐标
     * @param {number} sz 终点z坐标
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
        var ans = options;
        if (options.containAir) {
            ans.sx = 0,
                ans.sy = 0,
                ans.sz = 0,
                ans.ex = ex - sx,
                ans.ey = ey - sy,
                ans.ez = ez - ey;
        }
        ans.voxels = [];
        for (var x = sx; x <= ex; x++) {
            for (var y = sy; y <= ey; y++) {
                for (var z = sz; z <= ez; z++) {
                    if (voxels.getVoxelId(x, y, z)) ans.voxels.push((
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
        return ans;
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
     * @param {number} sx 终点x坐标
     * @param {number} sy 终点y坐标
     * @param {number} sz 终点z坐标
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
        var ans = {};
        for (var x = sx; x <= ex; x++) {
            for (var y = sy; y <= ey; y++) {
                for (var z = sz; z <= ez; z++) {
                    if (Object.keys(ans).includes(String(voxels[`get${params}`](x, y, z))))
                        if (infoClass === "position") ans[voxels[`get${params}`](x, y, z)].push({ x, y, z });
                        else ans[voxels[`get${params}`](x, y, z)]++;
                    else
                        if (infoClass === "position") ans[voxels[`get${params}`](x, y, z)] = [{ x, y, z }];
                        else ans[voxels[`get${params}`](x, y, z)] = 1;
                }
            }
        }
        return ans;
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
        var ans = new GameBounds3(new GameVector3(Infinity, Infinity, Infinity), new GameVector3(-Infinity, -Infinity, -Infinity));
        for (var voxel of data.voxels) {
            if (voxel.x < ans.lo.x) ans.lo.x = voxel.x;
            if (voxel.y < ans.lo.y) ans.lo.y = voxel.y;
            if (voxel.z < ans.lo.z) ans.lo.z = voxel.z;
            if (voxel.x > ans.hi.x) ans.hi.x = voxel.x;
            if (voxel.y > ans.hi.y) ans.hi.y = voxel.y;
            if (voxel.z > ans.hi.z) ans.hi.z = voxel.z;
        }
        return ans;
    }
}
/**
 * @description 便捷的方块/地形控制工具。
 */
const iridiumVoxels = new IridiumVoxels();
//在这行注释后面可以调用iridiumVoxels...
