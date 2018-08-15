import { createShaderProgram } from 'lib/gl-utils.js'

const createGeoArray = (x = 0, y = 0, w = 1, h = 1) => {
    return new Float32Array([
        // x, y,
        // x + w, y,
        // x, y + h,
        // x, y + h,
        // x + w, y,
        // x + w, y + h
        -0.5, -0.5,
        0.5, -0.5,
        -0.5, 0.5,
        -0.5, 0.5,
        0.5, -0.5,
        0.5, 0.5,
    ])
}

const createTexArray = (x = 0, y = 0, w = 1, h = 1) => {
    return new Float32Array([
        x, y,
        x + w, y,
        x, y + h,
        x, y + h,
        x + w, y,
        x + w, y + h,
    ])
}

const SpriteComponent = function SpriteComponent(url, vs, fs) {
    this.url = url
    this.isLoaded = false
    this.program = createShaderProgram(window.gl, vs, fs)
    
    this.image = new Image()
    this.image.src = url
    this.image.onload = () => this.setup()
}

SpriteComponent.prototype.setup = function setup() {
    let gl = window.gl

    gl.useProgram(this.program)

    this.gl_tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, this.gl_tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image)
    gl.bindTexture(gl.TEXTURE_2D, null)

    this.tex_buff = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_buff)
    gl.bufferData(gl.ARRAY_BUFFER, createTexArray(), gl.STATIC_DRAW)

    this.geo_buff = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.geo_buff)
    gl.bufferData(gl.ARRAY_BUFFER, createGeoArray(), gl.STATIC_DRAW)

    this.aPositionLoc = gl.getAttribLocation(this.program, 'a_position')
    this.aTexcoordLoc = gl.getAttribLocation(this.program, 'a_texCoord')
    this.uImageLoc = gl.getUniformLocation(this.program, 'u_image')

    gl.useProgram(null)
    this.isLoaded = true
    return this
}

SpriteComponent.prototype.name = 'sprite'

export default SpriteComponent