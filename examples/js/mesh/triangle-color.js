"use strict";

var app = new PIXI.Application();
document.body.appendChild(app.view);
var geometry = new PIXI.Geometry().addAttribute('aVertexPosition', // the attribute name
[-100, -50, // x, y
100, -50, // x, y
0.0, 100.0], // x, y
2) // the size of the attribute
.addAttribute('aColor', // the attribute name
[1, 0, 0, // r, g, b
0, 1, 0, // r, g, b
0, 0, 1], // r, g, b
3); // the size of the attribute

var shader = PIXI.Shader.from("\n\n    precision mediump float;\n    attribute vec2 aVertexPosition;\n    attribute vec3 aColor;\n\n    uniform mat3 translationMatrix;\n    uniform mat3 projectionMatrix;\n\n    varying vec3 vColor;\n\n    void main() {\n\n        vColor = aColor;\n        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    }", "precision mediump float;\n\n    varying vec3 vColor;\n\n    void main() {\n        gl_FragColor = vec4(vColor, 1.0);\n    }\n\n");
var triangle = new PIXI.Mesh(geometry, shader);
triangle.position.set(400, 300);
triangle.scale.set(2);
app.stage.addChild(triangle);
app.ticker.add(function (delta) {
  triangle.rotation += 0.01;
});