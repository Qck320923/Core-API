# 示例
![image](https://github.com/Qck320923/Core-API/assets/152294811/fae1db1d-cab9-4391-bf0a-beafe207be15)

```javascript
var canvas = new InkUICanvas({
    position: Vec2.create({ x: screenWidth * 0.1, y: screenHeight * 0.1 }),
    width: 300,
    height: 200,
    lineWidth: 32
}, Vec2.create({ x: 2, y: 2 }))
    .addEventListener("mousedown", function ({ pressBounds, pressPixel, pressGraphic }) {
        console.log(pressBounds.toString());
        console.log(JSON.stringify(pressPixel));
        console.log(pressGraphic);
        console.log("mousedown");
    })
    .addEventListener("mouseup", function () {
        console.log("mouseup");
    });
canvas.fillStyle = new RGBHexColor("#0000ff");
canvas.strokeRect(128, 16, 128, 128);
canvas.fillStyle = new RGBHexColor("#ff0000");
canvas.fillRect(0, 16, 128, 128);
```
