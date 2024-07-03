//“墨水”UI画布API
//@name     InkUICanvas
//@class    UICanvas API
//@parent   Core
//@version  v0.0.1.240703_Alpha01
//@author   L.W.Kevin0wvf
//@license  MIT
//Copyright (c) 2024, L.W.Kevin0wvf
//用途：类似HTML5中canvas功能的UI画布。
/*
更新日志：
v0.0.1.240627_Alpha - 完成部分基础代码。
v0.0.1.240628_Alpha - 修复部分bug，添加部分代码，优化像素查找、调用。
v0.0.1.240702_Alpha01 - 修复了像素长或宽不是长方形长或宽因数时大小比传入参数大的问题，改进显示像素的机制，pxSize重新定义为“最大像素大小”，如果图形还有空缺部分无法用最大像素大小的像素填充，则使用比最大像素大小小的像素填充。
v0.0.1.240702_Alpha02 - 加入了添加画布事件监听器的功能，mousedown、mouseup事件，和点击区域(pressBounds)参数。
v0.0.1.240703_Alpha01 - 加入了描边长方形(strokeRect)函数。
*/
const EPSILON$2 = Number.EPSILON;/*容差*/
/*
相较原版GameRGBColor和GameRGBAColor新增功能：
RGBHex转RGB（去掉#，r、g、b分别转十进制0~255整数）√
RGBHex转RGBA（去掉#，r、g、b分别转十进制0~255整数，a为255）√
RGBHex转ARGBHex（#ff+去掉#）√
ARGBHex转RGBA（去掉#，a、r、g、b分别转十进制0~255整数，排列为r、g、b、a）√
RGB转RGBHex（#+r、g、b分别转十六进制"00"~"ff"字符串）√
RGB转ARGBHex（#ff+r、g、b分别转十六进制"00"~"ff"字符串）√
RGBA转ARGBHex（#+r、g、b、a分别转十六进制"00"~"ff"字符串，排列为a、r、g、b）√
*/
class Color { }
/**
 * @description GameRGBColor稍作修改后的类，R、G、B范围从0-1改为0-255
 */
class RGBColor extends Color {
    static random() { return new RGBColor(Math.random(), Math.random(), Math.random()); }
    set(r, g, b) {
        this.r = Math.max(0, Math.min(r, 255));
        this.g = Math.max(0, Math.min(g, 255));
        this.b = Math.max(0, Math.min(b, 255));
        return this;
    }
    copy(c) {
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;
        return this;
    }
    add(rgb) { return new RGBColor(Math.max(0, Math.min(this.r + rgb.r, 255)), Math.max(0, Math.min(this.g + rgb.g, 255)), Math.max(0, Math.min(this.b + rgb.b, 255))); }
    sub(rgb) { return new RGBColor(Math.max(0, Math.min(this.r - rgb.r, 255)), Math.max(0, Math.min(this.g - rgb.g, 255)), Math.max(0, Math.min(this.b - rgb.b, 255))); }
    mul(rgb) { return new RGBColor(Math.max(0, Math.min(this.r * rgb.r, 255)), Math.max(0, Math.min(this.g * rgb.g, 255)), Math.max(0, Math.min(this.b * rgb.b, 255))); }
    div(rgb) { return new RGBColor(rgb.r === 0 ? 0 : Math.max(0, Math.min(this.r / rgb.r, 255)), rgb.g === 0 ? 0 : Math.max(0, Math.min(this.g / rgb.g, 255)), rgb.b === 0 ? 0 : Math.max(0, Math.min(this.b / rgb.b, 255))); }
    addEq(rgb) {
        this.r = Math.max(0, Math.min(this.r + rgb.r, 255));
        this.g = Math.max(0, Math.min(this.g + rgb.g, 255));
        this.b = Math.max(0, Math.min(this.b + rgb.b, 255));
        return this;
    }
    subEq(rgb) {
        this.r = Math.max(0, Math.min(this.r - rgb.r, 255));
        this.g = Math.max(0, Math.min(this.g - rgb.g, 255));
        this.b = Math.max(0, Math.min(this.b - rgb.b, 255));
        return this;
    }
    mulEq(rgb) {
        this.r = Math.max(0, Math.min(this.r * rgb.r, 255));
        this.g = Math.max(0, Math.min(this.g * rgb.g, 255));
        this.b = Math.max(0, Math.min(this.b * rgb.b, 255));
        return this;
    }
    divEq(rgb) {
        this.r = rgb.r === 0 ? 0 : Math.max(0, Math.min(this.r / rgb.r, 255));
        this.g = rgb.g === 0 ? 0 : Math.max(0, Math.min(this.g / rgb.g, 255));
        this.b = rgb.b === 0 ? 0 : Math.max(0, Math.min(this.b / rgb.b, 255));
        return this;
    }
    lerp(rgb, n) { return new RGBColor(Math.max(0, Math.min(this.r + (rgb.r - this.r) * n, 255)), Math.max(0, Math.min(this.g + (rgb.g - this.g) * n, 255)), Math.max(0, Math.min(this.b + (rgb.b - this.b) * n, 255))); }
    equals(rgb) { return Math.abs(this.r - rgb.r) < EPSILON$2 && Math.abs(this.g - rgb.g) < EPSILON$2 && Math.abs(this.b - rgb.b) < EPSILON$2; }
    clone() { return new RGBColor(this.r, this.g, this.b); }
    toRGBA() { return new RGBAColor(this.r, this.g, this.b, 255); }
    toString() { return `rgb(${this.r},${this.g},${this.b})`; }
    toRGBHexColor() { return new RGBHexColor("#" + this.r.toString(16).padStart(2, '0') + this.g.toString(16).padStart(2, '0') + this.b.toString(16).padStart(2, '0')); }
    toARGBHexColor() { return new ARGBHexColor("#ff" + this.r.toString(16).padStart(2, '0') + this.g.toString(16).padStart(2, '0') + this.b.toString(16).padStart(2, '0')); }
    constructor(r, g, b) {
        super();
        this.r = Math.max(0, Math.min(r, 255));
        this.g = Math.max(0, Math.min(g, 255));
        this.b = Math.max(0, Math.min(b, 255));
    }
}
/**
 * @description GameRGBAColor稍作修改后的类，R、G、B、A范围从0~1改为0~255
 */
class RGBAColor extends Color {
    set(r, g, b, a) {
        this.r = Math.max(0, Math.min(r, 255));
        this.g = Math.max(0, Math.min(g, 255));
        this.b = Math.max(0, Math.min(b, 255));
        this.a = Math.max(0, Math.min(a, 255));
        return this;
    }
    copy(c) {
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;
        this.a = c.a;
        return this;
    }
    add(rgba) { return new RGBAColor(Math.max(0, Math.min(this.r + rgba.r, 255)), Math.max(0, Math.min(this.g + rgba.g, 255)), Math.max(0, Math.min(this.b + rgba.b, 255)), Math.max(0, Math.min(this.a + rgba.a, 255))); }
    sub(rgba) { return new RGBAColor(Math.max(0, Math.min(this.r - rgba.r, 255)), Math.max(0, Math.min(this.g - rgba.g, 255)), Math.max(0, Math.min(this.b - rgba.b, 255)), Math.max(0, Math.min(this.a - rgba.a, 255))); }
    mul(rgba) { return new RGBAColor(Math.max(0, Math.min(this.r * rgba.r, 255)), Math.max(0, Math.min(this.g * rgba.g, 255)), Math.max(0, Math.min(this.b * rgba.b, 255)), Math.max(0, Math.min(this.a * rgba.a, 255))); }
    div(rgba) { return new RGBAColor(rgba.r === 0 ? 0 : Math.max(0, Math.min(this.r / rgba.r, 255)), rgba.g === 0 ? 0 : Math.max(0, Math.min(this.g / rgba.g, 255)), rgba.b === 0 ? 0 : Math.max(0, Math.min(this.b / rgba.b, 255)), rgba.a === 0 ? 0 : Math.max(0, Math.min(this.a / rgba.a, 255))); }
    addEq(rgba) {
        this.r = Math.max(0, Math.min(this.r + rgba.r, 255));
        this.g = Math.max(0, Math.min(this.g + rgba.g, 255));
        this.b = Math.max(0, Math.min(this.b + rgba.b, 255));
        this.a = Math.max(0, Math.min(this.a + rgba.a, 255));
        return this;
    }
    subEq(rgba) {
        this.r = Math.max(0, Math.min(this.r - rgba.r, 255));
        this.g = Math.max(0, Math.min(this.g - rgba.g, 255));
        this.b = Math.max(0, Math.min(this.b - rgba.b, 255));
        this.a = Math.max(0, Math.min(this.a - rgba.a, 255));
        return this;
    }
    mulEq(rgba) {
        this.r = Math.max(0, Math.min(this.r * rgba.r, 255));
        this.g = Math.max(0, Math.min(this.g * rgba.g, 255));
        this.b = Math.max(0, Math.min(this.b * rgba.b, 255));
        this.a = Math.max(0, Math.min(this.a * rgba.a, 255));
        return this;
    }
    divEq(rgba) {
        this.r = rgba.r === 0 ? 0 : Math.max(0, Math.min(this.r / rgba.r, 255));
        this.g = rgba.g === 0 ? 0 : Math.max(0, Math.min(this.g / rgba.g, 255));
        this.b = rgba.b === 0 ? 0 : Math.max(0, Math.min(this.b / rgba.b, 255));
        this.a = rgba.a === 0 ? 0 : Math.max(0, Math.min(this.a / rgba.a, 255));
        return this;
    }
    lerp(rgba, n) { return new RGBAColor(Math.max(0, Math.min(this.r + (rgba.r - this.r) * n, 255)), Math.max(0, Math.min(this.g + (rgba.g - this.g) * n, 255)), Math.max(0, Math.min(this.b + (rgba.b - this.b) * n, 255)), Math.max(0, Math.min(this.a + (rgba.a - this.a) * n, 255))); }/*这里的0~255范围限制是冗余的，可以去掉，因为constructor函数中已经有了范围限制*/
    blendEq(rgb) {
        const a = this.a;
        const c = 225 - a;
        return new RGBColor(c * rgb.r + a * this.r, c * rgb.g + a * this.g, c * rgb.b + a * this.b);
    }
    equals(rgba) { return Math.abs(this.r - rgba.r) < EPSILON$2 && Math.abs(this.g - rgba.g) < EPSILON$2 && Math.abs(this.b - rgba.b) < EPSILON$2 && Math.abs(this.a - rgba.a) < EPSILON$2; }
    clone() { return new RGBAColor(this.r, this.g, this.b, this.a); }
    toString() { return `rgba(${this.r},${this.g},${this.b},${this.a})`; }
    toARGBHexColor() { return new RGBHexColor("#" + this.a.toString(16).padStart(2, '0') + this.r.toString(16).padStart(2, '0') + this.g.toString(16).padStart(2, '0') + this.b.toString(16).padStart(2, '0')); }
    constructor(r, g, b, a) {
        super();
        this.r = Math.max(0, Math.min(r, 255));
        this.g = Math.max(0, Math.min(g, 255));
        this.b = Math.max(0, Math.min(b, 255));
        this.a = Math.max(0, Math.min(a, 255));
    }
}
class RGBHexColor extends Color {
    constructor(hex) {
        super();
        this.hex = hex.toLowerCase();
    }
    toRGBColor() { return new RGBColor(parseInt(this.hex.slice(1, 3), 16), parseInt(this.hex.slice(3, 5), 16), parseInt(this.hex.slice(5), 16)); }
    toRGBAColor() { return new RGBAColor(parseInt(this.hex.slice(1, 3), 16), parseInt(this.hex.slice(3, 5), 16), parseInt(this.hex.slice(5), 16), 255); }
    toARGBHexColor() { return new ARGBHexColor("#ff" + this.hex.slice(1)); }
    toString() { return this.hex; }
}
class ARGBHexColor extends Color {
    constructor(hex) {
        super();
        this.hex = hex.toLowerCase();
    }
    toRGBAColor() { return new RGBAColor(parseInt(this.hex.slice(3, 5), 16), parseInt(this.hex.slice(5, 7), 16), parseInt(this.hex.slice(7, 9), 16), parseInt(this.hex.slice(1, 3), 16)); }
    toString() { return this.hex; }
}
const ColorCode = {
    "lightpink": new RGBColor(255, 182, 193),
    "pink": new RGBColor(255, 192, 203),
    "crimson": new RGBColor(220, 20, 60),
    "lavenderblush": new RGBColor(255, 240, 245),
    "palevioletred": new RGBColor(219, 112, 147),
    "hotpink": new RGBColor(255, 105, 180),
    "deeppink": new RGBColor(255, 20, 147),
    "mediumvioletred": new RGBColor(199, 21, 133),
    "orchid": new RGBColor(218, 112, 214),
    "thistle": new RGBColor(216, 191, 216),
    "plum": new RGBColor(221, 160, 221),
    "violet": new RGBColor(238, 130, 238),
    "magenta": new RGBColor(255, 0, 255),
    "fuchsia": new RGBColor(255, 0, 255),
    "darkmagenta": new RGBColor(139, 0, 139),
    "purple": new RGBColor(128, 0, 128),
    "mediumorchid": new RGBColor(186, 85, 211),
    "darkviolet": new RGBColor(148, 0, 211),
    "darkorchid": new RGBColor(153, 50, 204),
    "indigo": new RGBColor(75, 0, 130),
    "blueviolet": new RGBColor(138, 43, 226),
    "mediumpurple": new RGBColor(147, 112, 219),
    "mediumslateblue": new RGBColor(123, 104, 238),
    "slateblue": new RGBColor(106, 90, 205),
    "darkslateblue": new RGBColor(72, 61, 139),
    "lavender": new RGBColor(230, 230, 250),
    "ghostwhite": new RGBColor(248, 248, 255),
    "blue": new RGBColor(0, 0, 255),
    "mediumblue": new RGBColor(0, 0, 205),
    "midnightblue": new RGBColor(25, 25, 112),
    "darkblue": new RGBColor(0, 0, 139),
    "navy": new RGBColor(0, 0, 128),
    "royalblue": new RGBColor(65, 105, 225),
    "cornflowerblue": new RGBColor(100, 149, 237),
    "lightsteelblue": new RGBColor(176, 196, 222),
    "lightslategray": new RGBColor(119, 136, 153),
    "slategray": new RGBColor(112, 128, 144),
    "dodgerblue": new RGBColor(30, 144, 255),
    "aliceblue": new RGBColor(240, 248, 255),
    "steelblue": new RGBColor(70, 130, 180),
    "lightskyblue": new RGBColor(135, 206, 250),
    "skyblue": new RGBColor(135, 206, 235),
    "deepskyblue": new RGBColor(0, 191, 255),
    "lightblue": new RGBColor(173, 216, 230),
    "powder": new RGBColor(176, 224, 230),
    "cadetblue": new RGBColor(95, 158, 160),
    "azure": new RGBColor(240, 255, 255),
    "lightcyan": new RGBColor(225, 255, 255),
    "paleturquoise": new RGBColor(175, 238, 238),
    "cyan": new RGBColor(0, 255, 255),
    "aqua": new RGBColor(0, 255, 255),
    "darkturquoise": new RGBColor(0, 206, 209),
    "darkslategray": new RGBColor(47, 79, 79),
    "darkcyan": new RGBColor(0, 139, 139),
    "teal": new RGBColor(0, 128, 128),
    "mediumturquoise": new RGBColor(72, 209, 204),
    "lightseagreen": new RGBColor(32, 178, 170),
    "turquoise": new RGBColor(64, 224, 208),
    "aquamarine": new RGBColor(127, 255, 170),
    "mediumaquamarine": new RGBColor(102, 205, 170),
    "mediumspringgreen": new RGBColor(0, 250, 154),
    "mintcream": new RGBColor(245, 255, 250),
    "springgreen": new RGBColor(0, 255, 127),
    "mediumseagreen": new RGBColor(46, 139, 87),
    "seagreen": new RGBColor(46, 139, 87),
    "honeydew": new RGBColor(240, 255, 240),
    "lightgreen": new RGBColor(144, 238, 144),
    "palegreen": new RGBColor(152, 251, 152),
    "darkseagreen": new RGBColor(143, 188, 143),
    "limegreen": new RGBColor(50, 205, 50),
    "lime": new RGBColor(0, 255, 0),
    "forestgreen": new RGBColor(34, 139, 34),
    "green": new RGBColor(0, 128, 0),
    "darkgreen": new RGBColor(0, 100, 0),
    "chartreuse": new RGBColor(127, 255, 0),
    "lawngreen": new RGBColor(124, 252, 0),
    "greenyellow": new RGBColor(173, 255, 47),
    "darkolivegreen": new RGBColor(85, 107, 47),
    "yellowgreen": new RGBColor(154, 205, 50),
    "olivedrab": new RGBColor(85, 107, 47),
    "beige": new RGBColor(107, 142, 35),
    "lightgoldenrodyellow": new RGBColor(250, 250, 210),
    "ivory": new RGBColor(255, 255, 240),
    "lightyellow": new RGBColor(255, 255, 224),
    "yellow": new RGBColor(255, 255, 0),
    "olive": new RGBColor(128, 128, 0),
    "darkkhaki": new RGBColor(189, 183, 107),
    "lemonchiffon": new RGBColor(255, 250, 205),
    "palegoldenrod": new RGBColor(238, 232, 170),
    "khaki": new RGBColor(240, 230, 140),
    "gold": new RGBColor(255, 215, 0),
    "cornsilk": new RGBColor(255, 248, 220),
    "goldenrod": new RGBColor(218, 165, 32),
    "darkgoldenrod": new RGBColor(184, 134, 11),
    "floralwhite": new RGBColor(255, 250, 240),
    "oldlace": new RGBColor(253, 245, 230),
    "wheat": new RGBColor(245, 222, 179),
    "moccasin": new RGBColor(255, 228, 181),
    "orange": new RGBColor(255, 165, 0),
    "papayawhip": new RGBColor(255, 239, 213),
    "blanchedalmond": new RGBColor(255, 235, 205),
    "navajowhite": new RGBColor(255, 222, 173),
    "antiquewhite": new RGBColor(250, 235, 215),
    "tan": new RGBColor(210, 180, 140),
    "burlywood": new RGBColor(222, 184, 135),
    "bisque": new RGBColor(255, 228, 196),
    "darkorange": new RGBColor(255, 140, 0),
    "linen": new RGBColor(250, 240, 230),
    "peru": new RGBColor(205, 133, 63),
    "peachpuff": new RGBColor(255, 218, 185),
    "sandybrown": new RGBColor(244, 164, 96),
    "chocolate": new RGBColor(210, 105, 30),
    "saddlebrown": new RGBColor(139, 69, 19),
    "seashell": new RGBColor(255, 245, 238),
    "sienna": new RGBColor(160, 82, 45),
    "lightsalmon": new RGBColor(255, 160, 122),
    "coral": new RGBColor(255, 127, 80),
    "orangered": new RGBColor(255, 69, 0),
    "darksalmon": new RGBColor(233, 150, 122),
    "tomato": new RGBColor(255, 99, 71),
    "mistyrose": new RGBColor(255, 228, 225),
    "salmon": new RGBColor(250, 128, 114),
    "snow": new RGBColor(255, 250, 250),
    "lightcoral": new RGBColor(240, 128, 128),
    "rosybrown": new RGBColor(188, 143, 143),
    "indianred": new RGBColor(205, 92, 92),
    "red": new RGBColor(255, 0, 0),
    "brown": new RGBColor(165, 42, 42),
    "firebrick": new RGBColor(178, 34, 34),
    "darkred": new RGBColor(139, 0, 0),
    "maroon": new RGBColor(128, 0, 0),
    "white": new RGBColor(255, 255, 255),
    "whitesmoke": new RGBColor(245, 245, 245),
    "gainsboro": new RGBColor(220, 220, 220),
    "lightgrey": new RGBColor(211, 211, 211),
    "silver": new RGBColor(192, 192, 192),
    "darkdray": new RGBColor(169, 169, 169),
    "gray": new RGBColor(128, 128, 128),
    "dimgray": new RGBColor(105, 105, 105),
    "black": new RGBColor(0, 0, 0)
}
class Bounds2 {
    constructor(lo, hi) {
        this.lo = lo;
        this.hi = hi;
    }
    toString() { return `{ lo: { x: ${this.lo.x}, y: ${this.lo.y} }, hi: { x: ${this.hi.x}, y: ${this.hi.y} } }` }
}
const InkUICanvasEventsListenerParams = { "pressBounds": new Bounds2 };
/**
 * @description “墨水”UI画布，参考HTML5中canvas的语法编写，降低入门难度。
 * ##### position为偏移量(offset)。
 */
class InkUICanvas {
    #pxSize;
    #node;
    #events = {
        "mousedown": [],
        "mouseup": []
    };
    globalAlpha = 1.0;
    fillStyle = new ARGBHexColor("#ff000000");
    strokeStyle = new ARGBHexColor("#ff000000");
    lineWidth = 1.0;
    constructor(configs, pxSize = Vec2.create({ x: 2, y: 2 })) {
        this.#node = UiBox.create();
        this.#node.position.offset.copy(Vec2.create({ x: 0, y: 0 }));
        this.#node.size.offset.copy(Vec2.create({ x: 300, y: 150 }));
        this.#node.parent = ui;
        this.#node.name = "canvas";
        this.#node.backgroundOpacity = 0;
        Object.assign(this, configs);
        this.#pxSize = pxSize;
    }
    get pxSize() { return this.#pxSize; }
    get position() { return this.#node.position.offset; }
    set position(x) { this.#node.position.offset.copy(x); }
    get width() { return this.#node.size.offset.x; }
    set width(x) {
        this.#node.size.offset.x = x;
        this.refresh();
    }
    get height() { return this.#node.size.offset.y; }
    set height(x) {
        this.#node.size.offset.y = x;
        this.refresh();
    }
    get pixels() { return this.#node.children; }
    /**
     * @description 设置画布大小
     * @param {any} size 大小（{ width: 宽度, height: 高度 }，可以单独设置一个）
     */
    setSize(size) {
        if (size.width) this.#node.size.offset.x = size.width;
        if (size.height) this.#node.size.offset.y = size.height;
        this.refresh();
    }
    /**
     * @description 遍历像素点
     * @param {any} callback 对每个像素点运行的回调函数
     */
    #traversePixels(callback) {
        if (!this.#node.children.length) return;
        function traverse(node, parent) {
            callback(node, parent);
            for (var child of node.children) traverse(child, parent);
        };
        for (var child of this.#node.children) traverse(child, this);
    }
    /**
     * @description 创建像素点
     * @param {number} x 图形相对于画布左上角的offset.x
     * @param {number} y 图形相对于画布左上角的offset.y
     * @param {any} style 填充造型/描边造型(fillStyle/strokeStyle)
     * @param {Vec2} size 像素点大小
     * @param {UiBox|UiImage|UiInput|UiScale|UiText} parent 图形父节点
     */
    #createPixel(x, y, style, size = this.#pxSize, parent = this.#node) {
        var pixel = UiBox.create();
        pixel.parent = parent;
        pixel.name = "pixel";
        pixel.size.offset.copy(size);
        pixel.position.offset.copy(Vec2.create({ x, y }));
        if ((parent.position.offset.x + x) >= this.width || (parent.position.offset.y + y) >= this.height) pixel.visible = false;
        if (style instanceof Color || typeof style === "string") {
            if (typeof style === "string") style = ColorCode[style].toRGBAColor();
            else if (!(style instanceof RGBAColor)) style = style.toRGBAColor();
            pixel.backgroundColor.copy(Vec3.create({ r: style.r, g: style.g, b: style.b }));
            pixel.backgroundOpacity = style.a / 255 * this.globalAlpha;
        }
        pixel.events.on("pointerdown", () => {
            for (var listener of this.#events.mousedown) listener({
                pressBounds: new Bounds2(
                    Vec2.create({
                        x: pixel.position.offset.x + pixel.parent.position.offset.x,
                        y: pixel.position.offset.y + pixel.parent.position.offset.y
                    }), Vec2.create({
                        x: pixel.position.offset.x + pixel.parent.position.offset.x + pixel.size.offset.x,
                        y: pixel.position.offset.y + pixel.parent.position.offset.y + pixel.size.offset.y
                    })
                )
            });
        });
        pixel.events.on("pointerup", () => {
            for (var listener of this.#events.mouseup) listener({
                pressBounds: new Bounds2(
                    Vec2.create({
                        x: pixel.position.offset.x + pixel.parent.position.offset.x,
                        y: pixel.position.offset.y + pixel.parent.position.offset.y
                    }), Vec2.create({
                        x: pixel.position.offset.x + pixel.parent.position.offset.x + pixel.size.offset.x,
                        y: pixel.position.offset.y + pixel.parent.position.offset.y + pixel.size.offset.y
                    })
                )
            });
        });
        return pixel;
    }
    /**
     * @description 刷新显示
     */
    refresh() {
        this.#traversePixels(function (pixel, parent) {
            if (pixel.name !== "pixel") return;
            if ((pixel.parent.position.offset.x + pixel.position.offset.x) >= parent.width || (pixel.parent.position.offset.y + pixel.position.offset.y) >= parent.height) pixel.visible = false;
            else pixel.visible = true;
        });
    }
    /**
     * @description 添加画布事件监听器
     * @param {keyof #events} type 画布事件类型
     * @param {(event: InkUICanvasEventsListenerParams)=>void} listener 函数
     */
    addEventListener(type, listener) {
        if (!this.#events[type]) throw new Error(`InkUICanvas Error:Unknown event "${type}"`);
        this.#events[type].push(listener);
        return this;
    }
    /**
     * @description 填充长方形
     * @param {number} x 图形相对于画布左上角的offset.x
     * @param {number} y 图形相对于画布左上角的offset.y
     * @param {number} width 宽度
     * @param {number} height 高度
     */
    fillRect(x, y, width, height) {
        var parent = UiBox.create();
        parent.parent = this.#node;
        parent.name = "rectangle";
        parent.backgroundOpacity = 0;
        parent.position.offset.copy(Vec2.create({ x, y }));
        for (var i = 0; i < width; i += this.#pxSize.x)
            for (var j = 0; j < height; j += this.#pxSize.y)
                this.#createPixel(i, j, this.fillStyle, Vec2.create({
                    x: (((width - i) >= this.#pxSize.x) ? this.#pxSize.x : width - i),
                    y: (((height - j) >= this.#pxSize.y) ? this.#pxSize.y : height - j)
                }), parent);
    }
    /**
     * @description 描边长方形
     * @param {number} x 图形相对于画布左上角的offset.x
     * @param {number} y 图形相对于画布左上角的offset.y
     * @param {number} width 宽度
     * @param {number} height 高度
     */
    strokeRect(x, y, width, height) {
        var parent = UiBox.create();
        parent.parent = this.#node;
        parent.name = "rectangle";
        parent.backgroundOpacity = 0;
        parent.position.offset.copy(Vec2.create({ x: x, y: y }));
        for (var i = -this.lineWidth / 2; i < width + this.lineWidth / 2; i += this.#pxSize.x)
            for (var j = -this.lineWidth / 2; j < this.lineWidth / 2; j += this.#pxSize.y)
                this.#createPixel(i, j, this.fillStyle, Vec2.create({
                    x: ((((width + this.lineWidth / 2) - i) >= this.#pxSize.x) ? this.#pxSize.x : (width + this.lineWidth / 2) - i),
                    y: (((this.lineWidth / 2 - j) >= this.#pxSize.y) ? this.#pxSize.y : this.lineWidth / 2 - j)
                }), parent);
        for (var i = -this.lineWidth / 2; i < width + this.lineWidth / 2; i += this.#pxSize.x)
            for (var j = height - this.lineWidth / 2; j < height + this.lineWidth / 2; j += this.#pxSize.y)
                this.#createPixel(i, j, this.fillStyle, Vec2.create({
                    x: ((((width + this.lineWidth / 2) - i) >= this.#pxSize.x) ? this.#pxSize.x : (width + this.lineWidth / 2) - i),
                    y: ((((height + this.lineWidth / 2) - j) >= this.#pxSize.y) ? this.#pxSize.y : (height + this.lineWidth / 2) - j)
                }), parent);
        for (var i = -this.lineWidth / 2; i < this.lineWidth / 2; i += this.#pxSize.x)
            for (var j = this.lineWidth / 2; j < height - this.lineWidth / 2; j += this.#pxSize.y)
                this.#createPixel(i, j, this.fillStyle, Vec2.create({
                    x: (((this.lineWidth / 2 - i) >= this.#pxSize.x) ? this.#pxSize.x : this.lineWidth / 2 - i),
                    y: ((((height - this.lineWidth / 2) - j) >= this.#pxSize.y) ? this.#pxSize.y : (height - this.lineWidth / 2) - j)
                }), parent);
        for (var i = width - this.lineWidth / 2; i < width + this.lineWidth / 2; i += this.#pxSize.x)
            for (var j = this.lineWidth / 2; j < height - this.lineWidth / 2; j += this.#pxSize.y)
                this.#createPixel(i, j, this.fillStyle, Vec2.create({
                    x: ((((width + this.lineWidth / 2) - i) >= this.#pxSize.x) ? this.#pxSize.x : (width + this.lineWidth / 2) - i),
                    y: ((((height - this.lineWidth / 2) - j) >= this.#pxSize.y) ? this.#pxSize.y : (height - this.lineWidth / 2) - j)
                }), parent);
    }
}
