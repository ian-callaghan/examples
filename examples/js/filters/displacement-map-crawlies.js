"use strict";

var app = new PIXI.Application();
document.body.appendChild(app.view);
app.stage.interactive = true;
var container = new PIXI.Container();
app.stage.addChild(container);
var padding = 100;
var bounds = new PIXI.Rectangle(-padding, -padding, app.screen.width + padding * 2, app.screen.height + padding * 2);
var maggots = [];

for (var i = 0; i < 20; i++) {
  var maggot = PIXI.Sprite.from('examples/assets/maggot.png');
  maggot.anchor.set(0.5);
  container.addChild(maggot);
  maggot.direction = Math.random() * Math.PI * 2;
  maggot.speed = 1;
  maggot.turnSpeed = Math.random() - 0.8;
  maggot.x = Math.random() * bounds.width;
  maggot.y = Math.random() * bounds.height;
  maggot.scale.set(1 + Math.random() * 0.3);
  maggot.original = new PIXI.Point();
  maggot.original.copy(maggot.scale);
  maggots.push(maggot);
}

var displacementSprite = PIXI.Sprite.from('examples/assets/pixi-filters/displace.png');
var displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
app.stage.addChild(displacementSprite);
container.filters = [displacementFilter];
displacementFilter.scale.x = 110;
displacementFilter.scale.y = 110;
displacementSprite.anchor.set(0.5);
var ring = PIXI.Sprite.from('examples/assets/pixi-filters/ring.png');
ring.anchor.set(0.5);
ring.visible = false;
app.stage.addChild(ring);
var bg = PIXI.Sprite.from('examples/assets/bg_grass.jpg');
bg.width = app.screen.width;
bg.height = app.screen.height;
bg.alpha = 0.4;
container.addChild(bg);
app.stage.on('mousemove', onPointerMove).on('touchmove', onPointerMove);

function onPointerMove(eventData) {
  ring.visible = true;
  displacementSprite.position.set(eventData.data.global.x - 25, eventData.data.global.y);
  ring.position.copyFrom(displacementSprite.position);
}

var count = 0;
app.ticker.add(function () {
  count += 0.05;

  for (var _i = 0; _i < maggots.length; _i++) {
    var _maggot = maggots[_i];
    _maggot.direction += _maggot.turnSpeed * 0.01;
    _maggot.x += Math.sin(_maggot.direction) * _maggot.speed;
    _maggot.y += Math.cos(_maggot.direction) * _maggot.speed;
    _maggot.rotation = -_maggot.direction - Math.PI / 2;
    _maggot.scale.x = _maggot.original.x + Math.sin(count) * 0.2; // wrap the maggots around as the crawl

    if (_maggot.x < bounds.x) {
      _maggot.x += bounds.width;
    } else if (_maggot.x > bounds.x + bounds.width) {
      _maggot.x -= bounds.width;
    }

    if (_maggot.y < bounds.y) {
      _maggot.y += bounds.height;
    } else if (_maggot.y > bounds.y + bounds.height) {
      _maggot.y -= bounds.height;
    }
  }
});