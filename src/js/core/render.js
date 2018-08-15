import * as glm from 'lib/gl-matrix.js'

const RenderSystem = (entities) => {
    let gl = window.gl

    let camera = glm.mat4.create()
    glm.mat4.ortho(camera, -5, 5, -5, 5, 0, 10)

    // Clear background
    gl.clearColor(0.75, 0.85, 0.8, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    for (var entityId in entities) {

        let entity = entities[entityId]
        let transform = entity.components.transform
        let sprite = entity.components.sprite

        if (sprite && sprite.isLoaded) {
            gl.useProgram(sprite.program)

            let camera_model = gl.getUniformLocation(sprite.program, 'camera_model')
            gl.uniformMatrix4fv(camera_model, false, camera);

            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, sprite.gl_tex)
            gl.uniform1i(sprite.uImageLoc, 0)

            gl.bindBuffer(gl.ARRAY_BUFFER, sprite.tex_buff)
            gl.enableVertexAttribArray(sprite.aTexcoordLoc)
            gl.vertexAttribPointer(sprite.aTexcoordLoc, 2, gl.FLOAT, gl.FALSE, 0, 0)

            gl.bindBuffer(gl.ARRAY_BUFFER, sprite.geo_buff)
            gl.enableVertexAttribArray(sprite.aPositionLoc)
            gl.vertexAttribPointer(sprite.aPositionLoc, 2, gl.FLOAT, gl.FALSE, 0, 0)

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6)
            gl.useProgram(null)
        }
    }

    gl.flush()
}

export default RenderSystem