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
        this.r = Math.max(0, Math.min(r, 255));
        this.g = Math.max(0, Math.min(g, 255));
        this.b = Math.max(0, Math.min(b, 255));
        this.a = Math.max(0, Math.min(a, 255));
    }
}
class RGBHexColor extends Color {
    constructor(hex) {
        this.hex = hex.toLowerCase();
    }
    toRGBColor() { return new RGBColor(parseInt(this.hex.slice(1, 3), 16), parseInt(this.hex.slice(3, 5), 16), parseInt(this.hex.slice(5), 16)); }
    toRGBAColor() { return new RGBAColor(parseInt(this.hex.slice(1, 3), 16), parseInt(this.hex.slice(3, 5), 16), parseInt(this.hex.slice(5), 16), 255); }
    toARGBHexColor() { return new ARGBHexColor("#ff" + this.hex.slice(1)); }
    toString() { return this.hex; }
}
class ARGBHexColor extends Color {
    constructor(hex) {
        this.hex = hex.toLowerCase();
    }
    toRGBAColor() { return new RGBAColor(parseInt(this.hex.slice(3, 5), 16), parseInt(this.hex.slice(5, 7), 16), parseInt(this.hex.slice(7, 9), 16), parseInt(this.hex.slice(1, 3), 16)); }
    toString() { return this.hex; }
}
