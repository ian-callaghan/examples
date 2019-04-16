"use strict";

var app = new PIXI.Application();
document.body.appendChild(app.view);
var count = 0; // build a rope!

var ropeLength = 45;
var points = [];

for (var i = 0; i < 25; i++) {
  points.push(new PIXI.Point(i * ropeLength, 0));
}

var strip = new PIXI.SimpleRope(PIXI.Texture.from('examples/assets/snake.png'), points);
strip.x = -40;
strip.y = 300;
app.stage.addChild(strip);
var g = new PIXI.Graphics();
g.x = strip.x;
g.y = strip.y;
app.stage.addChild(g); // start animating

app.ticker.add(function () {
  count += 0.1; // make the snake

  for (var _i = 0; _i < points.length; _i++) {
    points[_i].y = Math.sin(_i * 0.5 + count) * 30;
    points[_i].x = _i * ropeLength + Math.cos(_i * 0.3 + count) * 20;
  }

  renderPoints();
});

function renderPoints() {
  g.clear();
  g.lineStyle(2, 0xffc2c2);
  g.moveTo(points[0].x, points[0].y);

  for (var _i2 = 1; _i2 < points.length; _i2++) {
    g.lineTo(points[_i2].x, points[_i2].y);
  }

  for (var _i3 = 1; _i3 < points.length; _i3++) {
    g.beginFill(0xff0022);
    g.drawCircle(points[_i3].x, points[_i3].y, 10);
    g.endFill();
  }
}