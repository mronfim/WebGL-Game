import * as glm from 'lib/gl-matrix'
import log from 'node_modules/loglevel'

import { createShaderProgram } from 'lib/gl-utils'
import vert from 'shaders/vertex.glsl'
import frag from 'shaders/fragment.glsl'
import selectableFrag from 'shaders/selectableFrag.glsl'

export default class Render {
    constructor() {
        this.worldMatrix = glm.mat4.create()
        this.viewMatrix = glm.mat4.create()
        this.projMatrix = glm.mat4.create()
    }

    init(gl) {
        this.gl = gl
        this.outlineProgram = createShaderProgram(gl, vert, frag)
        this.outline_aPositionLoc = gl.getAttribLocation(this.outlineProgram, 'a_position')
        this.lineColorLocation = gl.getUniformLocation(this.outlineProgram, 'color')

        this.selectableProgram = createShaderProgram(gl, vert, selectableFrag)
        this.selectable_aPositionLoc = gl.getAttribLocation(this.selectableProgram, 'a_position')
        this.selectableColorLoc = gl.getUniformLocation(this.selectableProgram, 'color')
    }

    setupViewport(camera) {
        if (!camera) {
            log.warn('WARNING no camera found!')

            // Set the world/view/proj matrices as the identity matrix when no camera present
            glm.mat4.identity(this.viewMatrix)
            glm.mat4.identity(this.projMatrix)
        } else {
            let transform = camera.transform
            let cameraComponent = camera.components.camera
            let target = glm.vec3.create()
            
            glm.vec3.add(target, transform.position, cameraComponent.direction)
            glm.mat4.lookAt(this.viewMatrix, transform.position, target, cameraComponent.up)
            glm.mat4.ortho(this.projMatrix,
                -1 * cameraComponent.halfWidth,
                cameraComponent.halfWidth,
                -1 * cameraComponent.halfHeight,
                cameraComponent.halfHeight,
                0, 10)
        }
    }

    update(components) {
        let gl = this.gl

        // =======================================
        // Setup viewport

        let camera = components.camera && components.camera[0]
        this.setupViewport(camera)

        // =======================================
        // Clear background and render

        gl.clearColor(0.75, 0.85, 0.8, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        let transform = null
        let sprite = null

        components.sprite.forEach(entity => {
            transform = entity.transform
            sprite = entity.components.sprite

            // calculate world matrix
            glm.mat4.identity(this.worldMatrix)
            glm.mat4.translate(this.worldMatrix, this.worldMatrix, transform.position)
            glm.mat4.rotateZ(this.worldMatrix, this.worldMatrix, transform.rotation[2] * Math.PI / 180)
            glm.mat4.scale(this.worldMatrix, this.worldMatrix, transform.scale)

            if (sprite && sprite.isLoaded) {
                gl.useProgram(sprite.program)

                // Get proj/view/world matrix locations
                let matWorldUniformLocation = gl.getUniformLocation(sprite.program, 'mWorld')
                let matViewUniformLocation = gl.getUniformLocation(sprite.program, 'mView')
                let matProjUniformLocation = gl.getUniformLocation(sprite.program, 'mProj')

                // Set proj/view/world matrix data
                gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, this.worldMatrix)
                gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, this.viewMatrix)
                gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, this.projMatrix)

                gl.activeTexture(gl.TEXTURE0)
                gl.bindTexture(gl.TEXTURE_2D, sprite.gl_tex)
                gl.uniform1i(sprite.uImageLoc, 0)

                gl.bindBuffer(gl.ARRAY_BUFFER, sprite.tex_buff)
                gl.enableVertexAttribArray(sprite.aTexcoordLoc)
                gl.vertexAttribPointer(sprite.aTexcoordLoc, 2, gl.FLOAT, gl.FALSE, 0, 0)

                gl.bindBuffer(gl.ARRAY_BUFFER, sprite.geo_buff)
                gl.enableVertexAttribArray(sprite.aPositionLoc)
                gl.vertexAttribPointer(sprite.aPositionLoc, 2, gl.FLOAT, gl.FALSE, 0, 0)

                gl.drawElements(gl.TRIANGLES, sprite.Indices.length, gl.UNSIGNED_SHORT, 0)

                // Render the bounding box ==========================================
                if (entity.components.collidable) {
                    this.drawCollidable(entity)
                }
            }
        })

        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.bindTexture(gl.TEXTURE_2D, null)
        gl.useProgram(null)
        gl.flush()
    }

    drawCollidable(entity) {
        let gl = this.gl
        let collidable = entity.components.collidable

        gl.useProgram(this.outlineProgram)

        if (collidable.colliding) {
            gl.uniform4f(this.lineColorLocation, 1.0, 0.0, 0.0, 1.0)
        } else {
            gl.uniform4f(this.lineColorLocation, 0.0, 0.6, 0.0, 1.0)
        }

        let matWorldUniformLocation = gl.getUniformLocation(this.outlineProgram, 'mWorld')
        let matViewUniformLocation = gl.getUniformLocation(this.outlineProgram, 'mView')
        let matProjUniformLocation = gl.getUniformLocation(this.outlineProgram, 'mProj')

        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, this.worldMatrix)
        gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, this.viewMatrix)
        gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, this.projMatrix)

        gl.bindBuffer(gl.ARRAY_BUFFER, collidable.geo_buff)
        gl.enableVertexAttribArray(this.outline_aPositionLoc)
        gl.vertexAttribPointer(this.outline_aPositionLoc, 2, gl.FLOAT, gl.FALSE, 0, 0)

        gl.drawArrays(gl.LINE_LOOP, 0, 4)
    }
    
    drawToTexture(components) {
        let gl = this.gl

        // =======================================
        // Setup viewport

        let camera = components.camera && components.camera[0]
        this.setupViewport(camera)

        // =======================================
        // Clear background and render

        gl.clearColor(0.75, 0.85, 0.8, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        let transform = null
        let sprite = null
        let selectable = null

        components.selectable.forEach(entity => {
            transform = entity.transform
            sprite = entity.components.sprite
            selectable = entity.components.selectable

            // calculate world matrix
            glm.mat4.identity(this.worldMatrix)
            glm.mat4.translate(this.worldMatrix, this.worldMatrix, transform.position)
            glm.mat4.rotateZ(this.worldMatrix, this.worldMatrix, transform.rotation[2] * Math.PI / 180)
            glm.mat4.scale(this.worldMatrix, this.worldMatrix, transform.scale)

            if (selectable) {
                gl.useProgram(this.selectableProgram)

                // Get proj/view/world matrix locations
                let matWorldUniformLocation = gl.getUniformLocation(this.selectableProgram, 'mWorld')
                let matViewUniformLocation = gl.getUniformLocation(this.selectableProgram, 'mView')
                let matProjUniformLocation = gl.getUniformLocation(this.selectableProgram, 'mProj')

                // Set proj/view/world matrix data
                gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, this.worldMatrix)
                gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, this.viewMatrix)
                gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, this.projMatrix)

                // Set color
                let color = entity.components.selectable.color
                gl.uniform4f(this.selectableColorLoc, color[0], color[1], color[2], color[3])

                gl.bindBuffer(gl.ARRAY_BUFFER, entity.components.sprite.geo_buff)
                gl.enableVertexAttribArray(this.selectable_aPositionLoc)
                gl.vertexAttribPointer(this.selectable_aPositionLoc, 2, gl.FLOAT, gl.FALSE, 0, 0)

                gl.drawElements(gl.TRIANGLES, sprite.Indices.length, gl.UNSIGNED_SHORT, 0)
            }
        })

        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.bindTexture(gl.TEXTURE_2D, null)
        gl.useProgram(null)
    }
}