export function createShaderProgram(gl, vertShaderSource, fragShaderSource, validate=false) {
    let vertShader = gl.createShader(gl.VERTEX_SHADER)
    let fragShader = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(vertShader, vertShaderSource)
    gl.shaderSource(fragShader, fragShaderSource)

    gl.compileShader(vertShader)
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertShader))
    }

    gl.compileShader(fragShader)
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragShader))
    }

    let program = gl.createProgram()
    gl.attachShader(program, vertShader)
    gl.attachShader(program, fragShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program))
        return null;
    }

    if (validate) {
        gl.validateProgram(program)
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            console.error('ERROR validating program!', gl.getProgramInfoLog(program))
        } else {
            console.log('SUCCESS validating program!')
        }
    }

    gl.detachShader(program, vertShader)
    gl.detachShader(program, fragShader)
    gl.deleteShader(vertShader)
    gl.deleteShader(fragShader)

    return program
}