import * as glm from 'lib/gl-matrix.js'
import log from 'node_modules/loglevel'

/*

TODO: Have systems have an init method and an update method

*/

const RenderSystem = (entities) => {
    let gl = window.gl

    // =======================================
    // Setup viewport

    let worldMatrix = glm.mat4.create()
    let viewMatrix = glm.mat4.create()
    let projMatrix = glm.mat4.create()

    let camera = entities.camera
    if (!camera) {
        log.warn('WARNING no camera found!')

        // Set the world/view/proj matrices as the identity matrix when no camera present
        glm.mat4.identity(worldMatrix)
        glm.mat4.identity(viewMatrix)
        glm.mat4.identity(projMatrix)
    } else {
        let transform = camera.components.transform
        let cameraComponent = camera.components.camera
        let target = glm.vec3.create()
        glm.vec3.add(target, transform.position, cameraComponent.direction)
        glm.mat4.identity(worldMatrix)
        glm.mat4.lookAt(viewMatrix, transform.position, target, cameraComponent.up)
        glm.mat4.ortho(projMatrix, -1 * cameraComponent.halfWidth, cameraComponent.halfWidth, -1 * cameraComponent.halfHeight, cameraComponent.halfHeight, 0, 10)
    }

    // =======================================
    // Clear background and render

    gl.clearColor(0.75, 0.85, 0.8, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    for (var entityId in entities) {

        let entity = entities[entityId]
        let transform = entity.components.transform
        let sprite = entity.components.sprite

        // calculate world matrix
        glm.mat4.translate(worldMatrix, worldMatrix, transform.position)
        glm.mat4.rotateZ(worldMatrix, worldMatrix, transform.rotation[2] * Math.PI / 180)
        glm.mat4.scale(worldMatrix, worldMatrix, transform.scale)

        if (sprite && sprite.isLoaded) {
            gl.useProgram(sprite.program)

            // Get proj/view/world matrix locations
            let matWorldUniformLocation = gl.getUniformLocation(sprite.program, 'mWorld')
            let matViewUniformLocation = gl.getUniformLocation(sprite.program, 'mView')
            let matProjUniformLocation = gl.getUniformLocation(sprite.program, 'mProj')

            // Set proj/view/world matrix data
            gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix)
            gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix)
            gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix)

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
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.useProgram(null)
    gl.flush()
}

export default RenderSystem