"use strict";

var app = new PIXI.Application();
document.body.appendChild(app.view);
var geometry = new PIXI.Geometry().addAttribute('aVertexPosition', // the attribute name
[-100, -100, // x, y
100, -100, // x, y
100, 100], // x, y
2) // the size of the attribute
.addAttribute('aColor', // the attribute name
[1, 0, 0, // r, g, b
0, 1, 0, // r, g, b
0, 0, 1], // r, g, b
3) // the size of the attribute
.addAttribute('aUvs', // the attribute name
[0, 0, // u, v
1, 0, // u, v
1, 1], // u, v
2); // the size of the attribute

var vertexSrc = "\n\n    precision mediump float;\n\n    attribute vec2 aVertexPosition;\n    attribute vec3 aColor;\n    attribute vec2 aUvs;\n\n    uniform mat3 translationMatrix;\n    uniform mat3 projectionMatrix;\n\n    varying vec2 vUvs;\n    varying vec3 vColor;\n\n    void main() {\n\n        vUvs = aUvs;\n        vColor = aColor;\n        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    }";
var fragmentSrc = "\n\n    precision mediump float;\n\n    varying vec3 vColor;\n    varying vec2 vUvs;\n\n    uniform sampler2D uSampler2;\n\n    void main() {\n\n        gl_FragColor = texture2D(uSampler2, vUvs) * vec4(vColor, 1.0);\n    }";
var uniforms = {
  uSampler2: PIXI.Texture.from('examples/assets/bg_scene_rotate.jpg')
};
var shader = PIXI.Shader.from(vertexSrc, fragmentSrc, uniforms);
var triangle = new PIXI.Mesh(geometry, shader);
triangle.position.set(400, 300);
triangle.scale.set(2);
app.stage.addChild(triangle);
app.ticker.add(function (delta) {
  triangle.rotation += 0.01;
});