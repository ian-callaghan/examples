"use strict";

var app = new PIXI.Application();
document.body.appendChild(app.view);
var sprites = new PIXI.ParticleContainer(10000, {
  scale: true,
  position: true,
  rotation: true,
  uvs: true,
  alpha: true
});
app.stage.addChild(sprites); // create an array to store all the sprites

var maggots = [];
var totalSprites = app.renderer instanceof PIXI.Renderer ? 10000 : 100;

for (var i = 0; i < totalSprites; i++) {
  // create a new Sprite
  var dude = PIXI.Sprite.from('examples/assets/maggot_tiny.png');
  dude.tint = Math.random() * 0xE8D4CD; // set the anchor point so the texture is centerd on the sprite

  dude.anchor.set(0.5); // different maggots, different sizes

  dude.scale.set(0.8 + Math.random() * 0.3); // scatter them all

  dude.x = Math.random() * app.screen.width;
  dude.y = Math.random() * app.screen.height;
  dude.tint = Math.random() * 0x808080; // create a random direction in radians

  dude.direction = Math.random() * Math.PI * 2; // this number will be used to modify the direction of the sprite over time

  dude.turningSpeed = Math.random() - 0.8; // create a random speed between 0 - 2, and these maggots are slooww

  dude.speed = (2 + Math.random() * 2) * 0.2;
  dude.offset = Math.random() * 100; // finally we push the dude into the maggots array so it it can be easily accessed later

  maggots.push(dude);
  sprites.addChild(dude);
} // create a bounding box box for the little maggots


var dudeBoundsPadding = 100;
var dudeBounds = new PIXI.Rectangle(-dudeBoundsPadding, -dudeBoundsPadding, app.screen.width + dudeBoundsPadding * 2, app.screen.height + dudeBoundsPadding * 2);
var tick = 0;
app.ticker.add(function () {
  // iterate through the sprites and update their position
  for (var _i = 0; _i < maggots.length; _i++) {
    var _dude = maggots[_i];
    _dude.scale.y = 0.95 + Math.sin(tick + _dude.offset) * 0.05;
    _dude.direction += _dude.turningSpeed * 0.01;
    _dude.x += Math.sin(_dude.direction) * (_dude.speed * _dude.scale.y);
    _dude.y += Math.cos(_dude.direction) * (_dude.speed * _dude.scale.y);
    _dude.rotation = -_dude.direction + Math.PI; // wrap the maggots

    if (_dude.x < dudeBounds.x) {
      _dude.x += dudeBounds.width;
    } else if (_dude.x > dudeBounds.x + dudeBounds.width) {
      _dude.x -= dudeBounds.width;
    }

    if (_dude.y < dudeBounds.y) {
      _dude.y += dudeBounds.height;
    } else if (_dude.y > dudeBounds.y + dudeBounds.height) {
      _dude.y -= dudeBounds.height;
    }
  } // increment the ticker


  tick += 0.1;
});