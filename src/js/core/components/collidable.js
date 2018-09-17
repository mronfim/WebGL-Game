import * as glm from 'lib/gl-matrix'

class Collidable {
    constructor(boundingBox) {
        this.box = boundingBox
        this.name = 'collidable'
        this.colliding = false

        this.geo_buff = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.geo_buff)
        gl.bufferData(gl.ARRAY_BUFFER, Collidable.vertices, gl.STATIC_DRAW)
    }

    // collides(other) {
    //     if (!(other instanceof Collidable)) {
    //         throw "variable 'other' is not an instance of class Collidable"
    //     }

    //     let a = this.box
    //     let b = other.box

    //     if (Math.abs(a.c[0] - b.c[0]) > (a.r[0] + b.r[0])) return false
    //     if (Math.abs(a.c[1] - b.c[1]) > (a.r[1] + b.r[1])) return false
    //     return true
    // }
}

Collidable.vertices = new Float32Array([
    -0.5, -0.5,
    0.5, -0.5,
    0.5, 0.5,
    -0.5, 0.5,
])

export default Collidable