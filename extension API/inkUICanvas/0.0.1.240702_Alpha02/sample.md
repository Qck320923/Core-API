![image](https://github.com/Qck320923/Core-API/assets/152294811/bcfabb8d-bcae-4d2b-9f78-e1fe52aa5f00)
测试代码第一版
```javascript
var canvas = new InkUICanvas({
    position: Vec2.create({ x: screenWidth * 0.25, y: screenHeight * 0.25 }),
    width: 128,
    height: 128
}, Vec2.create({ x: 100, y: 100 }));
canvas.fillStyle = new RGBHexColor("#ff0000");
canvas.fillRect(0, 0, 128, 128);
canvas.fillStyle = new ARGBHexColor("#c0ff00ff");
canvas.fillRect(64, 64, 128, 128);
canvas.setSize({
    width: 192,
    height: 192
});
canvas.addEventListener("mousedown", function ({ pressBounds }) {
    console.log(pressBounds.toString());
    console.log("mousedown");
});
canvas.addEventListener("mouseup", function () {
    console.log("mouseup");
});
```
测试代码第二版（链式调用事件监听函数）
```javascript
var canvas = new InkUICanvas({
    position: Vec2.create({ x: screenWidth * 0.25, y: screenHeight * 0.25 }),
    width: 128,
    height: 128
}, Vec2.create({ x: 2, y: 2 }));
canvas.fillStyle = new RGBHexColor("#ff0000");
canvas.fillRect(0, 0, 128, 128);
canvas.fillStyle = new ARGBHexColor("#c0ff00ff");
canvas.fillRect(64, 64, 128, 128);
canvas.setSize({
    width: 192,
    height: 192
});
canvas
    .addEventListener("mousedown", function ({ pressBounds }) {
        console.log(pressBounds.toString());
        console.log("mousedown");
    })
    .addEventListener("mouseup", function () {
        console.log("mouseup");
    });
```
测试代码第三版（再次简化）
```javascript
var canvas = new InkUICanvas({
    position: Vec2.create({ x: screenWidth * 0.25, y: screenHeight * 0.25 }),
    width: 128,
    height: 128
}, Vec2.create({ x: 2, y: 2 }))
    .addEventListener("mousedown", function ({ pressBounds }) {
        console.log(pressBounds.toString());
        console.log("mousedown");
    })
    .addEventListener("mouseup", function () {
        console.log("mouseup");
    });
canvas.fillStyle = new RGBHexColor("#ff0000");
canvas.fillRect(0, 0, 128, 128);
canvas.fillStyle = new ARGBHexColor("#c0ff00ff");
canvas.fillRect(64, 64, 128, 128);
canvas.setSize({
    width: 192,
    height: 192
});
```
