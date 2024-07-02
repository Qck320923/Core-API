![image](https://github.com/Qck320923/Core-API/assets/152294811/70b532e2-7ca0-4bc8-bf68-bdaebe3a4538)
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
```
