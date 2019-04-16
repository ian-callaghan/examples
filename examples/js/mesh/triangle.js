"use strict";

var app = new PIXI.Application();
document.body.appendChild(app.view);
var geometry = new PIXI.Geometry().addAttribute('aVertexPosition', [-100, -50, 100, -50, 0, 100]);
var shader = PIXI.Shader.from("\n\n    precision mediump float;\n    attribute vec2 aVertexPosition;\n\n    uniform mat3 translationMatrix;\n    uniform mat3 projectionMatrix;\n\n    void main() {\n        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    }", "precision mediump float;\n\n    void main() {\n        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n    }\n\n");
var triangle = new PIXI.Mesh(geometry, shader);
triangle.position.set(400, 300);
app.stage.addChild(triangle);
app.ticker.add(function (delta) {
  triangle.rotation += 0.01;
});