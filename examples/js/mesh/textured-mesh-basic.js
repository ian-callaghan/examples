"use strict";

var app = new PIXI.Application();
document.body.appendChild(app.view);
var count = 0; // build a rope!

var ropeLength = 918 / 20;
var points = [];

for (var i = 0; i < 20; i++) {
  points.push(new PIXI.Point(i * ropeLength, 0));
}

var strip = new PIXI.SimpleRope(PIXI.Texture.from('examples/assets/snake.png'), points);
strip.x = -459;
var snakeContainer = new PIXI.Container();
snakeContainer.x = 400;
snakeContainer.y = 300;
snakeContainer.scale.set(800 / 1100);
app.stage.addChild(snakeContainer);
snakeContainer.addChild(strip);
app.ticker.add(function () {
  count += 0.1; // make the snake

  for (var _i = 0; _i < points.length; _i++) {
    points[_i].y = Math.sin(_i * 0.5 + count) * 30;
    points[_i].x = _i * ropeLength + Math.cos(_i * 0.3 + count) * 20;
  }
});