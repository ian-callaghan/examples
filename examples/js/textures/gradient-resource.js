"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol") { _typeof = function (_typeof2) { function _typeof(_x) { return _typeof2.apply(this, arguments); } _typeof.toString = function () { return _typeof2.toString(); }; return _typeof; }(function (obj) { return _typeof(obj); }); } else { _typeof = function (_typeof3) { function _typeof(_x2) { return _typeof3.apply(this, arguments); } _typeof.toString = function () { return _typeof3.toString(); }; return _typeof; }(function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof(obj); }); } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// PixiJS V5 Texture-Resource API + canvas2d gradient API + WebGL texImage2D
// Look here for advanced upload function:
// https://github.com/pixijs/pixi.js/blob/dev/packages/core/src/textures/resources/BaseImageResource.js#L54
var GradientResource = function (_PIXI$resources$Resou) {
  _inherits(GradientResource, _PIXI$resources$Resou);

  function GradientResource() {
    _classCallCheck(this, GradientResource);

    // pass width and height. (0,0) if we dont know yet
    // gradient needs only 1 pixel height
    return _possibleConstructorReturn(this, (GradientResource.__proto__ || Object.getPrototypeOf(GradientResource)).call(this, 256, 1));
  }

  _createClass(GradientResource, [{
    key: "upload",
    value: function upload(renderer, baseTexture, glTexture) {
      var width = this.width; // default size or from baseTexture?

      var height = this.height; // your choice.
      // temporary canvas, we dont need it after texture is uploaded to GPU

      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext('2d');
      var grd = ctx.createLinearGradient(0, 0, width, 0);
      grd.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
      grd.addColorStop(0.3, 'cyan');
      grd.addColorStop(0.7, 'red');
      grd.addColorStop(1, 'green');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height); // This info ios usseful if upload happens second time
      // Some people use that to track used memory

      glTexture.width = width;
      glTexture.height = height; // PURE WEBGL CALLS - that's what its all about.
      // PixiJS cant wrap all that API, we give you acceess to it!

      var gl = renderer.gl;
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.premultiplyAlpha);
      gl.texImage2D(baseTexture.target, 0, baseTexture.format, baseTexture.format, baseTexture.type, canvas);
      return true;
    }
  }]);

  return GradientResource;
}(PIXI.resources.Resource);

var app = new PIXI.Application({
  antialias: true
});
document.body.appendChild(app.view);
var gradBaseTexture = new PIXI.BaseTexture(new GradientResource()); // Here you can fake baseTexture size to avoid resizing all sprites
// There can be multiple baseTextures per gradient, but be careful:
// resource will spawn more glTextures!

gradBaseTexture.setSize(500, 50);
var gradTexture = new PIXI.Texture(gradBaseTexture);
var sprite = new PIXI.Sprite(gradTexture);
sprite.position.set(100, 100);
sprite.rotation = Math.PI / 8;
app.stage.addChild(sprite);