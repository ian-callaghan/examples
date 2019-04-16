"use strict";

var app = new PIXI.Application(800, 600);
document.body.appendChild(app.view); // Inner radius of the circle

var radius = 100; // The blur amount

var blurSize = 32;
app.loader.add('grass', 'examples/assets/bg_grass.jpg');
app.loader.load(setup);

function setup(loader, resources) {
  var background = new PIXI.Sprite(resources.grass.texture);
  app.stage.addChild(background);
  background.width = app.screen.width;
  background.height = app.screen.height;
  var circle = new PIXI.Graphics().beginFill(0xFF0000).drawCircle(radius + blurSize, radius + blurSize, radius).endFill();
  circle.filters = [new PIXI.filters.BlurFilter(blurSize)];
  var bounds = new PIXI.Rectangle(0, 0, (radius + blurSize) * 2, (radius + blurSize) * 2);
  var texture = app.renderer.generateTexture(circle, PIXI.SCALE_MODES.NEAREST, 1, bounds);
  var focus = new PIXI.Sprite(texture);
  app.stage.addChild(focus);
  background.mask = focus;
  app.stage.interactive = true;
  app.stage.on('mousemove', pointerMove);

  function pointerMove(event) {
    focus.position.x = event.data.global.x - focus.width / 2;
    focus.position.y = event.data.global.y - focus.height / 2;
  }
}