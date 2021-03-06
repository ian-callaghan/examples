"use strict";

var app = new PIXI.Application();
document.body.appendChild(app.view);
var geometry = new PIXI.Geometry().addAttribute('aVertexPosition', // the attribute name
[-100, -100, // x, y
100, -100, // x, y
100, 100], // x, y
2) // the size of the attribute
.addAttribute('aUvs', // the attribute name
[0, 0, // u, v
1, 0, // u, v
1, 1], // u, v
2); // the size of the attribute

var program = PIXI.Program.from("\n\n    precision mediump float;\n\n    attribute vec2 aVertexPosition;\n    attribute vec2 aUvs;\n\n    uniform mat3 translationMatrix;\n    uniform mat3 projectionMatrix;\n\n    varying vec2 vUvs;\n\n    void main() {\n\n        vUvs = aUvs;\n        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    }", "precision mediump float;\n\n    varying vec2 vUvs;\n\n    uniform sampler2D uSamplerTexture;\n\n    void main() {\n\n        gl_FragColor = texture2D(uSamplerTexture, vUvs);\n    }\n\n");
var triangle = new PIXI.Mesh(geometry, new PIXI.Shader(program, {
  uSamplerTexture: PIXI.Texture.from('examples/assets/bg_scene_rotate.jpg')
}));
var triangle2 = new PIXI.Mesh(geometry, new PIXI.Shader(program, {
  uSamplerTexture: PIXI.Texture.from('examples/assets/bg_rotate.jpg')
}));
var triangle3 = new PIXI.Mesh(geometry, new PIXI.Shader(program, {
  uSamplerTexture: PIXI.Texture.from('examples/assets/bg_displacement.jpg')
}));
triangle.position.set(400, 300);
triangle.scale.set(2);
triangle2.position.set(200, 100);
triangle3.position.set(500, 400);
triangle3.scale.set(3);
app.stage.addChild(triangle3, triangle2, triangle);
app.ticker.add(function (delta) {
  triangle.rotation += 0.01;
  triangle2.rotation -= 0.01;
  triangle3.rotation -= 0.005;
});