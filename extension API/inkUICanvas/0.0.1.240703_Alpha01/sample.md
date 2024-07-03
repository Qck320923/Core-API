![image](https://github.com/Qck320923/Core-API/assets/152294811/799c29e5-8926-42e2-a86e-ec19005cc652)
```javascript
var canvas = new InkUICanvas({
    position: Vec2.create({ x: screenWidth * 0.1, y: screenHeight * 0.1 }),
    width: 300,
    height: 200,
    lineWidth: 32
}, Vec2.create({ x: 2, y: 2 }))
    .addEventListener("mousedown", function ({ pressBounds }) {
        console.log(pressBounds.toString());
        console.log("mousedown");
    })
    .addEventListener("mouseup", function () {
        console.log("mouseup");
    });
canvas.fillStyle = new RGBHexColor("#0000ff");
canvas.strokeRect(128, 0, 128, 128);
canvas.fillStyle = new RGBHexColor("#ff0000");
canvas.fillRect(0, 0, 128, 128);
```
