import { 
    createShaderProgram,
} from 'lib/gl-utils.js'

import * as glm from 'lib/gl-matrix'

import Entity from 'core/entity'
import Components from 'core/components'
import Systems from 'core/systems'

import AABB from 'core/physics/AABB'

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
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)

    // =============================================
    // Initialize Game Systems

    Systems.Render.init(gl)

    // =============================================
    // Initialize Game Entities

    let entities = {}
    let components = {}

    let player = new Entity(entities)
    player.transform.setPosition([-2, 0, 0])
    player.transform.setScale([3, 3, 1])
    player.transform.setRotation([0, 0, 0])
    player.addComponent(components, new Components.Sprite('/assets/Sprite-0002.png', spriteVert, spriteFrag))
    player.addComponent(components, new Components.Collidable( new AABB(player.transform) ))

    let block = new Entity(entities)
    block.transform.setPosition([-0.5, 0, 0])
    block.transform.setScale([1, 1, 1])
    block.addComponent(components, new Components.Sprite('/assets/Sprite-0002.png', spriteVert, spriteFrag))
    block.addComponent(components, new Components.Collidable(new AABB(block.transform)))
    
    let block2 = new Entity(entities)
    block2.transform.setPosition([2, 2, 0])
    block2.transform.setScale([2, 2, 1])
    block2.addComponent(components, new Components.Sprite('/assets/Sprite-0002.png', spriteVert, spriteFrag))
    block2.addComponent(components, new Components.Collidable(new AABB(block2.transform)))

    let camera = new Entity(entities)
    camera.transform.setPosition([0, 0, 5])
    camera.addComponent(components, new Components.Camera(10, 10, [0, 0, -1], [0, 1, 0]))
    
    // =============================================
    // Main loop

    function loop() {

        Systems.Physics.update(components)
        Systems.Render.update(components)

        requestAnimationFrame(loop)
    }
    
    requestAnimationFrame(loop)
})