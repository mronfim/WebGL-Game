import { 
    createShaderProgram,
} from 'lib/gl-utils.js'

import { Sprite } from 'gfx/material.js'

import VertShaderSource from 'shaders/vertex.glsl'
import FragShaderSource from 'shaders/fragment.glsl'

import spriteVert from 'shaders/spriteVert.glsl'
import spriteFrag from 'shaders/spriteFrag.glsl'

window.addEventListener('load', () => {
    
    // =============================================
    // Initialize WebGL

    var canvas = document.getElementById('canvas')
    var gl = canvas.getContext('webgl')

    if (!gl) {
        console.log('WebGL not supported, falling back on experimental-webgl')
        gl = canvas.getContext('experimental-webgl')
    }

    if (!gl) {
        alert('Your browser does not support WebGL')
    }

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    // =============================================

    let program = createShaderProgram(gl, VertShaderSource, FragShaderSource)

    //
    // create buffer
    //
    let triangleVerts = [
        0.0, 0.5, 1.0, 1.0, 0.0,
        -0.5, -0.5, 0.7, 0.0, 1.0,
        0.5, -0.5, 0.1, 1.0, 0.6
    ]

    let triangleVBO = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVBO)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVerts), gl.STATIC_DRAW)

    let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition')
    let colorAttribLocation = gl.getAttribLocation(program, 'vertColor')

    gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 0)
    gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT)

    gl.enableVertexAttribArray(positionAttribLocation)
    gl.enableVertexAttribArray(colorAttribLocation)

    let sprite = new Sprite(gl, '/assets/Sprite-0002.png', spriteVert, spriteFrag)

    //
    // Main render loop
    //

    function loop() {
        gl.clearColor(0.75, 0.85, 0.8, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        // gl.useProgram(program)
        // gl.drawArrays(gl.TRIANGLES, 0, 3)

        sprite.render()

        gl.flush()

        requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)
})