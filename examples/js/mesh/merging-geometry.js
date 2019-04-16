"use strict";

var app = new PIXI.Application();
document.body.appendChild(app.view);
var geometry = new PIXI.Geometry().addAttribute('aVertexPosition', // the attribute name
[-100, -100, // x, y
100, -100, // x, y
100, 100, -100, 100], // x, y
2) // the size of the attribute
.addAttribute('aUvs', // the attribute name
[0, 0, // u, v
1, 0, // u, v
1, 1, 0, 1], // u, v
2) // the size of the attribute
.addIndex([0, 1, 2, 0, 2, 3]);
var geometry2 = new PIXI.Geometry().addAttribute('aVertexPosition', // the attribute name
[-100 + 100, -100, // x, y
100 + 100, -100, // x, y
100 + 100, 100], // x, y
2) // the size of the attribute
.addAttribute('aUvs', // the attribute name
[0, 0, // u, v
1, 0, // u, v
1, 1], // u, v
2) // the size of the attribute
.addIndex([0, 1, 2]);
var geometry3 = PIXI.Geometry.merge([geometry, geometry2]);
var shader = PIXI.Shader.from("\n\n    precision mediump float;\n\n    attribute vec2 aVertexPosition;\n    attribute vec2 aUvs;\n\n    uniform mat3 translationMatrix;\n    uniform mat3 projectionMatrix;\n\n    varying vec2 vUvs;\n\n    void main() {\n\n        vUvs = aUvs;\n        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    }", "precision mediump float;\n\n    varying vec2 vUvs;\n\n    uniform sampler2D uSampler2;\n\n    void main() {\n\n        gl_FragColor = texture2D(uSampler2, vUvs );\n    }\n\n", {
  uSampler2: PIXI.Texture.from('examples/assets/bg_scene_rotate.jpg')
});
var quad = new PIXI.Mesh(geometry3, shader);
quad.position.set(400, 300);
quad.scale.set(2);
app.stage.addChild(quad);
app.ticker.add(function (delta) {
  quad.rotation += 0.01;
});