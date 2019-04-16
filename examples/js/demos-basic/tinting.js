"use strict";

var app = new PIXI.Application();
document.body.appendChild(app.view); // holder to store the aliens

var aliens = [];
var totalDudes = 20;

for (var i = 0; i < totalDudes; i++) {
  // create a new Sprite that uses the image name that we just generated as its source
  var dude = PIXI.Sprite.from('examples/assets/eggHead.png'); // set the anchor point so the texture is centerd on the sprite

  dude.anchor.set(0.5); // set a random scale for the dude - no point them all being the same size!

  dude.scale.set(0.8 + Math.random() * 0.3); // finally lets set the dude to be at a random position..

  dude.x = Math.random() * app.screen.width;
  dude.y = Math.random() * app.screen.height;
  dude.tint = Math.random() * 0xFFFFFF; // create some extra properties that will control movement :
  // create a random direction in radians. This is a number between 0 and PI*2 which is the equivalent of 0 - 360 degrees

  dude.direction = Math.random() * Math.PI * 2; // this number will be used to modify the direction of the dude over time

  dude.turningSpeed = Math.random() - 0.8; // create a random speed for the dude between 0 - 2

  dude.speed = 2 + Math.random() * 2; // finally we push the dude into the aliens array so it it can be easily accessed later

  aliens.push(dude);
  app.stage.addChild(dude);
} // create a bounding box for the little dudes


var dudeBoundsPadding = 100;
var dudeBounds = new PIXI.Rectangle(-dudeBoundsPadding, -dudeBoundsPadding, app.screen.width + dudeBoundsPadding * 2, app.screen.height + dudeBoundsPadding * 2);
app.ticker.add(function () {
  // iterate through the dudes and update their position
  for (var _i = 0; _i < aliens.length; _i++) {
    var _dude = aliens[_i];
    _dude.direction += _dude.turningSpeed * 0.01;
    _dude.x += Math.sin(_dude.direction) * _dude.speed;
    _dude.y += Math.cos(_dude.direction) * _dude.speed;
    _dude.rotation = -_dude.direction - Math.PI / 2; // wrap the dudes by testing their bounds...

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
  }
});