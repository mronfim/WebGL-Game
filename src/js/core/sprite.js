import { createShaderProgram } from 'lib/gl-utils.js'

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
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.bindTexture(gl.TEXTURE_2D, null)

    this.geo_buff = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.geo_buff)
    gl.bufferData(gl.ARRAY_BUFFER, this.Vertices, gl.STATIC_DRAW)

    this.index_buff = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buff)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.Indices, gl.STATIC_DRAW)

    this.tex_buff = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_buff)
    gl.bufferData(gl.ARRAY_BUFFER, this.TextureUV,gl.STATIC_DRAW)

    this.aPositionLoc = gl.getAttribLocation(this.program, 'a_position')
    this.aTexcoordLoc = gl.getAttribLocation(this.program, 'a_texCoord')
    this.uImageLoc = gl.getUniformLocation(this.program, 'u_image')

    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.useProgram(null)
    this.isLoaded = true
    return this
}

SpriteComponent.prototype.Vertices = new Float32Array([
    -0.5, -0.5,
    0.5, -0.5,
    -0.5, 0.5,
    0.5, 0.5,
])

SpriteComponent.prototype.TextureUV = new Float32Array([
    0, 0,
    1, 0,
    0, 1,
    1, 1,
    1, 0,
    0, 1,
])

SpriteComponent.prototype.Indices = new Uint16Array([
    0, 1, 2,
    2, 1, 3,
])

SpriteComponent.prototype.name = 'sprite'

export default SpriteComponent