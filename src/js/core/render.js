const RenderSystem = (entities) => {
    let gl = window.gl

    // Clear background
    gl.clearColor(0.75, 0.85, 0.8, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    var currEntity
    var currSprite

    for (var entityId in entities) {
        currEntity = entities[entityId]
        currSprite = currEntity.components.sprite
        if (currSprite && currSprite.isLoaded) {
            let gl = window.gl

            gl.useProgram(currSprite.program)

            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D, currSprite.gl_tex)
            gl.uniform1i(currSprite.uImageLoc, 0)

            gl.bindBuffer(gl.ARRAY_BUFFER, currSprite.tex_buff)
            gl.enableVertexAttribArray(currSprite.aTexcoordLoc)
            gl.vertexAttribPointer(currSprite.aTexcoordLoc, 2, gl.FLOAT, gl.FALSE, 0, 0)

            gl.bindBuffer(gl.ARRAY_BUFFER, currSprite.geo_buff)
            gl.enableVertexAttribArray(currSprite.aPositionLoc)
            gl.vertexAttribPointer(currSprite.aPositionLoc, 2, gl.FLOAT, gl.FALSE, 0, 0)

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6)
            gl.useProgram(null)
        }
    }

    gl.flush()
}

export default RenderSystem