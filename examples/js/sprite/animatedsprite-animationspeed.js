"use strict";

var app = new PIXI.Application();
document.body.appendChild(app.view);
app.stop();
PIXI.Loader.shared.add('spritesheet', 'examples/assets/spritesheet/0123456789.json').load(onAssetsLoaded);

function onAssetsLoaded(loader, resources) {
  // create an array to store the textures
  var textures = [];
  var i = void 0;

  for (i = 0; i < 10; i++) {
    var framekey = "0123456789 ".concat(i, ".ase");
    var texture = PIXI.Texture.from(framekey);
    var time = resources.spritesheet.data.frames[framekey].duration;
    textures.push({
      texture: texture,
      time: time
    });
  }

  var scaling = 4; // create a slow AnimatedSprite

  var slow = new PIXI.AnimatedSprite(textures);
  slow.anchor.set(0.5);
  slow.scale.set(scaling);
  slow.animationSpeed = 0.5;
  slow.x = (app.screen.width - slow.width) / 2;
  slow.y = app.screen.height / 2;
  slow.play();
  app.stage.addChild(slow); // create a fast AnimatedSprite

  var fast = new PIXI.AnimatedSprite(textures);
  fast.anchor.set(0.5);
  fast.scale.set(scaling);
  fast.x = (app.screen.width + fast.width) / 2;
  fast.y = app.screen.height / 2;
  fast.play();
  app.stage.addChild(fast); // start animating

  app.start();
}