var canvas = new InkUICanvas({
    position: Vec2.create({ x: screenWidth * 0.25, y: screenHeight * 0.25 }),
    width: 128,
    height: 128
});
canvas.fillStyle = new RGBHexColor("#ff0000");
canvas.fillRect(0, 0, 128, 128);
canvas.fillStyle = new ARGBHexColor("#c0ff00ff");
canvas.fillRect(64, 64, 128, 128);
canvas.setSize({
    width: 192,
    height: 192
});
