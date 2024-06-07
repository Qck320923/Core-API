//“𫓧”对话框API
//@name     Flerovium Dialog
//@class    Dialog API
//@parent   Core
//@version  v0.0.1
//@author   L.W.Kevin0wvf
//@license  BSD-3-Clause
//Copyright (c) 2024, L.W.Kevin0wvf
//用途：便捷的对话框功能增强API。
/*
更新日志：
v0.0.1 - 便捷的选择对话框分支结构。
*/

GamePlayer.prototype.fleroviumSelectDialog = async function (params) {
    var result = await this.dialog(params.params);
    if (!result || result === null) return result;
    params.optionCallbacks[result.value](this);
    return result;
}
