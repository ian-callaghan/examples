"use strict";

var app = new PIXI.Application();
document.body.appendChild(app.view);
var geometry = new PIXI.Geometry().addAttribute('aVertexPosition', // the attribute name
[-100, -100, // x, y
100, -100, // x, y
100, 100]) // x, y
.addAttribute('aUvs', // the attribute name
[0, 0, // u, v
1, 0, // u, v
1, 1]); // u, v

var shader = PIXI.Shader.from("\n\n    precision mediump float;\n\n    attribute vec2 aVertexPosition;\n    attribute vec2 aUvs;\n\n    uniform mat3 translationMatrix;\n    uniform mat3 projectionMatrix;\n\n    varying vec2 vUvs;\n\n    void main() {\n\n        vUvs = aUvs;\n        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    }", "precision mediump float;\n\n    varying vec2 vUvs;\n\n    uniform sampler2D uSampler2;\n\n    void main() {\n\n        gl_FragColor = texture2D(uSampler2, vUvs);\n    }\n\n", {
  uSampler2: PIXI.Texture.from('examples/assets/bg_scene_rotate.jpg')
});
var shader2 = PIXI.Shader.from("\n\n    precision mediump float;\n\n    attribute vec2 aVertexPosition;\n    attribute vec2 aUvs;\n\n    uniform mat3 translationMatrix;\n    uniform mat3 projectionMatrix;\n\n    varying vec2 vUvs;\n\n    void main() {\n\n        vUvs = aUvs;\n        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    }", "precision mediump float;\n\n    varying vec2 vUvs;\n\n    uniform sampler2D uSampler2;\n\n    void main() {\n\n        gl_FragColor = texture2D(uSampler2, vUvs);\n        gl_FragColor.r += (abs(sin(gl_FragCoord.x * 0.06)) * 0.5) * 2.;\n        gl_FragColor.g += (abs(cos(gl_FragCoord.y * 0.06)) * 0.5) * 2.;\n    }\n\n", {
  uSampler2: PIXI.Texture.from('examples/assets/bg_scene_rotate.jpg')
});
var triangle = new PIXI.Mesh(geometry, shader);
var triangle2 = new PIXI.Mesh(geometry, shader2);
triangle.position.set(400, 300);
triangle.scale.set(2);
triangle2.position.set(500, 400);
triangle2.scale.set(3);
app.stage.addChild(triangle2, triangle);
app.ticker.add(function (delta) {
  triangle.rotation += 0.01;
  triangle2.rotation -= 0.005;
});