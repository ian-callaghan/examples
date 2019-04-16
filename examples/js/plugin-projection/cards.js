"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol") { _typeof = function (_typeof2) { function _typeof(_x) { return _typeof2.apply(this, arguments); } _typeof.toString = function () { return _typeof2.toString(); }; return _typeof; }(function (obj) { return _typeof(obj); }); } else { _typeof = function (_typeof3) { function _typeof(_x2) { return _typeof3.apply(this, arguments); } _typeof.toString = function () { return _typeof3.toString(); }; return _typeof; }(function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof(obj); }); } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// This examples is hard
// To understand it, you have to carefully read all readme`s and other examples of respective plugins
// Be ready to study the plugins code. Please use latest version of those libs
// Used plugins: pixi-projection, pixi-display
var app = new PIXI.Application({
  autoStart: false,
  antialias: true
});
document.body.appendChild(app.view);
app.stage = new PIXI.display.Stage();
var loader = app.loader;
var camera = new PIXI.projection.Camera3d();
camera.position.set(app.screen.width / 2, app.screen.height / 2);
camera.setPlanes(350, 30, 10000);
camera.euler.x = Math.PI / 5.5;
app.stage.addChild(camera);
var cards = new PIXI.projection.Container3d();
cards.position3d.y = -50; // MAKE CARDS LARGER:

cards.scale3d.set(1.5);
camera.addChild(cards);
var shadowGroup = new PIXI.display.Group(1);
var cardsGroup = new PIXI.display.Group(2, function (item) {
  item.zOrder = item.getDepth();
  item.parent.checkFace();
}); // Layers are 2d elements but we use them only to show stuff, not to transform items, so its fine :)

camera.addChild(new PIXI.display.Layer(shadowGroup));
camera.addChild(new PIXI.display.Layer(cardsGroup)); // we could also add layers in the stage, but then we'll need extra layer for the text
// load assets

loader.add('cards', 'examples/assets/pixi-projection/cards.json');
loader.add('table', 'examples/assets/pixi-projection/table.png');
loader.load(onAssetsLoaded); // blur for shadow. Do not use it in production, bake shadow into the texture!

var blurFilter = new PIXI.filters.BlurFilter();
blurFilter.blur = 0.2;

var CardSprite = function (_PIXI$projection$Cont) {
  _inherits(CardSprite, _PIXI$projection$Cont);

  function CardSprite() {
    var _this;

    _classCallCheck(this, CardSprite);

    _this = _possibleConstructorReturn(this, (CardSprite.__proto__ || Object.getPrototypeOf(CardSprite)).call(this));
    var tex = loader.resources.cards.textures; // shadow will be under card

    _this.shadow = new PIXI.projection.Sprite3d(tex['black.png']);

    _this.shadow.anchor.set(0.5);

    _this.shadow.scale3d.set(0.98);

    _this.shadow.alpha = 0.7; // TRY IT WITH FILTER:

    _this.shadow.filters = [blurFilter]; // all shadows are UNDER all cards

    _this.shadow.parentGroup = shadowGroup;
    _this.inner = new PIXI.projection.Container3d(); // cards are above the shadows
    // either they have back, either face

    _this.inner.parentGroup = cardsGroup;

    _this.addChild(_this.shadow);

    _this.addChild(_this.inner); // construct "inner" from back and face


    _this.back = new PIXI.projection.Sprite3d(tex['cover1.png']);

    _this.back.anchor.set(0.5);

    _this.face = new PIXI.projection.Container3d();

    _this.inner.addChild(_this.back);

    _this.inner.addChild(_this.face);

    _this.code = 0;
    _this.showCode = -1;
    _this.inner.euler.y = Math.PI;

    _this.scale3d.set(0.2); // construct "face" from four sprites


    _this.createFace();

    return _this;
  }

  _createClass(CardSprite, [{
    key: "createFace",
    value: function createFace() {
      var face = this.face;
      face.removeChildren();
      var tex = loader.resources.cards.textures;
      var sprite = new PIXI.projection.Sprite3d(tex['white1.png']);
      var sprite2 = new PIXI.projection.Sprite3d(PIXI.Texture.EMPTY);
      var sprite3 = new PIXI.projection.Sprite3d(PIXI.Texture.EMPTY);
      var sprite4 = new PIXI.projection.Sprite3d(PIXI.Texture.EMPTY);
      sprite2.y = -120;
      sprite2.x = -80;
      sprite3.y = 70;
      sprite3.x = 40;
      sprite4.y = -70;
      sprite4.x = -100;
      sprite.anchor.set(0.5);
      sprite2.anchor.set(0.5);
      sprite3.anchor.set(0.5);
      face.addChild(sprite);
      face.addChild(sprite2);
      face.addChild(sprite3);
      face.addChild(sprite4);
      this.updateFace();
    }
  }, {
    key: "updateFace",
    value: function updateFace() {
      var tex = loader.resources.cards.textures;
      var code = this.showCode === -1 ? 0 : this.showCode;
      var num = code & 0xf;
      var suit = code >> 4;
      var face = this.face;
      face.children[1].texture = num > 0 ? tex["".concat(suit % 2, "_").concat(num, ".png")] : PIXI.Texture.EMPTY;

      if (!face.children[1].texture) {
        console.log('FAIL 1 ', "".concat(suit % 2, "_").concat(num, ".png"));
      }

      face.children[2].texture = suit !== 0 ? tex["".concat(suit, "_big.png")] : PIXI.Texture.EMPTY;

      if (!face.children[2].texture) {
        console.log('FAIL 2', "".concat(suit, "_big.png"));
      }

      face.children[3].texture = suit !== 0 ? tex["".concat(suit, "_small.png")] : PIXI.Texture.EMPTY;

      if (!face.children[3].texture) {
        console.log('FAIL 3', "".concat(suit, "_small.png"));
      }
    }
  }, {
    key: "update",
    value: function update(dt) {
      var inner = this.inner;

      if (this.code > 0 && inner.euler.y > 0) {
        inner.euler.y = Math.max(0, inner.euler.y - dt * 5);
      }

      if (this.code === 0 && inner.euler.y < Math.PI) {
        inner.euler.y = Math.min(Math.PI, inner.euler.y + dt * 5);
      }

      inner.position3d.z = -Math.sin(inner.euler.y) * this.back.width; // assignment is overriden, so its actually calling euler.copy(this.euler)

      this.shadow.euler = inner.euler;
    }
  }, {
    key: "checkFace",
    value: function checkFace() {
      var inner = this.inner;
      var cc = void 0;

      if (!inner.isFrontFace()) {
        // user sees the back
        cc = 0;
      } else {
        // user sees the face
        cc = this.showCode || this.code;
      }

      if (cc === 0) {
        this.back.renderable = true;
        this.face.renderable = false;
      } else {
        this.back.renderable = false;
        this.face.renderable = true;
      }

      if (cc !== this.showCode) {
        this.showCode = cc;
        this.updateFace();
      }
    }
  }]);

  return CardSprite;
}(PIXI.projection.Container3d);

function dealHand() {
  cards.removeChildren();

  for (var i = 0; i < 5; i++) {
    var card = new CardSprite();
    card.position3d.x = 56 * (i - 2);

    if ((Math.random() * 3 | 0) === 0) {
      onClick({
        target: card
      });
    }

    card.update(0);
    card.interactive = true;
    card.on('mouseup', onClick);
    card.on('touchend', onClick);
    cards.addChild(card);
  }
}

function onClick(event) {
  var target = event.target;

  if (target.code === 0) {
    var num = (Math.random() * 13 | 0) + 2;
    var suit = (Math.random() * 4 | 0) + 1;
    target.code = suit * 16 + num;
  } else {
    target.code = 0;
  }
}

function addText(txt) {
  var style = {
    font: 'normal 80px Arial',
    fill: '#f5ffe3',
    dropShadow: true,
    dropShadowColor: 'rgba(1, 1, 1, 0.4)',
    dropShadowDistance: 6,
    wordWrap: false
  };
  var basicText = new PIXI.projection.Text3d(txt, style);
  basicText.position3d.x = -240;
  basicText.position3d.y = 20;
  camera.addChild(basicText);
}

function onAssetsLoaded() {
  // background must be UNDER camera, it doesnt have z-index or any other bullshit for camera
  app.stage.addChildAt(new PIXI.Sprite(loader.resources.table.texture), 0);
  dealHand();
  addText('Tap on cards'); // start animating

  app.start();
}

app.ticker.add(function (deltaTime) {
  for (var i = 0; i < cards.children.length; i++) {
    cards.children[i].update(deltaTime / 60.0);
  } // We are gonna sort and show correct side of card,
  // so we need updateTransform BEFORE the sorting will be called.
  // otherwise this part will be tardy by one frame


  camera.updateTransform();
});