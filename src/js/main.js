import { 
    createShaderProgram,
} from 'lib/gl-utils.js'

import * as glm from 'lib/gl-matrix.js'

import Entity from 'core/entity.js'
import SpriteComponent from 'core/sprite.js'
import CameraComponent from 'core/camera.js'
import RenderSystem from 'core/render.js'

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

    window.gl = gl

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.frontFace(gl.CCW)
    gl.cullFace(gl.BACK)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    // =============================================
    // Initialize Game Objects

    let entities = {}

    let player = new Entity()
    player.addComponent(new SpriteComponent('/assets/Sprite-0002.png', spriteVert, spriteFrag))
    player.components.transform.setPosition([-2, 0, 0])
    player.components.transform.setRotation([0, 0, 0])
    player.components.transform.setScale([5, 5, 1])

    let camera = new Entity()
    camera.addComponent(new CameraComponent(10, 10, [0, 0, -1], [0, 1, 0]))
    camera.components.transform.setPosition([0, 0, 5])

    entities[player.id] = player
    entities['camera'] = camera

    // =============================================
    // Main loop

    console.log(player)

    function loop() {

        RenderSystem(entities)

        requestAnimationFrame(loop)
    }
    
    requestAnimationFrame(loop)
})