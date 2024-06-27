/**
 * @description “墨水”UI画布，参考HTML5中canvas的方法编写，降低入门难度。
 * ##### position为固定位置(offset)。
 */
class InkUICanvas {
    position = Vec2.create({ x: 0, y: 0 });
    width = 300;
    height = 150;
    globalAlpha = 1.0;
    fillStyle = new ARGBHexColor("#ff000000");
    strokeStyle = new ARGBHexColor("#ff000000");
    #pxSize;
    constructor(configs, pxSize = Vec2.create({ x: 2, y: 2 })) {
        Object.assign(this, configs);
        this.#pxSize = pxSize;
    }
    get pxSize() { return this.#pxSize; }
    /**
     * @description 创建像素点
     * @param {number} x 图形相对于画布左上角的offset.x
     * @param {number} y 图形相对于画布左上角的offset.y
     * @param {any} style 填充造型/描边造型(fillStyle/strokeStyle)
     */
    #createPixel(x, y, style) {
        var pixel = UiBox.create();
        pixel.size.offset.copy(this.#pxSize);
        pixel.position.offset.x = this.position.x + x;
        pixel.position.offset.y = this.position.y + y;
        if ((this.position.x + x) >= this.width || (this.position.y + y) >= this.height) pixel.visible = false;
        if (style instanceof Color) {
            var color = style;
            if (color instanceof RGBColor) color = color.toRGBAColor();
            else if (color instanceof RGBHexColor) color = color.toRGBAColor();
            else if (color instanceof ARGBHexColor) color = color.toRGBAColor();
            else if (typeof color === "string") color = ColorCode[color];
            pixel.backgroundColor = Vec3.create({ r: color.r, g: color.g, b: color.b });
            pixel.backgroundOpacity = color.a / 255 * this.globalAlpha;
        }
        return pixel;
    }
    /**
     * @description 填充长方形
     * @param {number} x 图形相对于画布左上角的offset.x
     * @param {number} y 图形相对于画布左上角的offset.y
     * @param {number} width 宽度
     * @param {number} height 高度
     */
    fillRect(x, y, width, height) {
        for (var i = x; i <= x + width; i += this.#pxSize.x)
            for (var j = y; j <= y + height; j += this.#pxSize.y)
                this.#createPixel(i, j, this.fillStyle);
    }
}
