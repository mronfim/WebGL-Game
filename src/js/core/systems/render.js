import * as glm from 'lib/gl-matrix'
import log from 'node_modules/loglevel'

const Render = function Render() {
    this.worldMatrix = glm.mat4.create()
    this.viewMatrix = glm.mat4.create()
    this.projMatrix = glm.mat4.create()
}

Render.prototype.init = function init(gl){
    this.gl = gl
}

Render.prototype.update = function update(components) {
    let gl = this.gl

    // =======================================
    // Setup viewport

    let camera = components.camera && components.camera[0]
    if (!camera) {
        log.warn('WARNING no camera found!')

        // Set the world/view/proj matrices as the identity matrix when no camera present
        glm.mat4.identity(this.worldMatrix)
        glm.mat4.identity(this.viewMatrix)
        glm.mat4.identity(this.projMatrix)
    } else {
        let transform = camera.transform
        let cameraComponent = camera.components.camera
        let target = glm.vec3.create()
        glm.vec3.add(target, transform.position, cameraComponent.direction)
        glm.mat4.identity(this.worldMatrix)
        glm.mat4.lookAt(this.viewMatrix, transform.position, target, cameraComponent.up)
        glm.mat4.ortho(this.projMatrix,
            -1 * cameraComponent.halfWidth,
            cameraComponent.halfWidth,
            -1 * cameraComponent.halfHeight,
            cameraComponent.halfHeight,
            0, 10)
    }

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
        }
    })

    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.useProgram(null)
    gl.flush()
}

export default Render