import { 
    createShaderProgram,
} from 'lib/gl-utils.js'

import * as glm from 'lib/gl-matrix'

import Entity from 'core/entity'
// import SpriteComponent from 'core/components/sprite.js'
// import CameraComponent from 'core/components/camera.js'
import Components from 'core/components'
import Systems from 'core/systems'

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
    // Initialize Game Systems

    Systems.Render.init(gl)

    // =============================================
    // Initialize Game Entities

    let entities = {}
    let components = {}

    let player = new Entity(entities)
    player.addComponent(components, new Components.Sprite('/assets/Sprite-0002.png', spriteVert, spriteFrag))
    player.transform.setPosition([-2, 0, 0])
    player.transform.setRotation([0, 0, 0])
    player.transform.setScale([5, 5, 1])

    let camera = new Entity(entities)
    camera.addComponent(components, new Components.Camera(10, 10, [0, 0, -1], [0, 1, 0]))
    camera.transform.setPosition([0, 0, 5])

    // =============================================
    // Main loop

    function loop() {

        Systems.Render.update(components)

        requestAnimationFrame(loop)
    }
    
    requestAnimationFrame(loop)
})