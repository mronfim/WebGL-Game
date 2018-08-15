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

/*

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

*/