import * as glm from 'lib/gl-matrix'

export default class Collidable {
    constructor(boundingBox) {
        this.box = boundingBox
        this.name = 'collidable'
        this.colliding = false
    }

    collides(other) {
        if (!(other instanceof Collidable)) {
            throw "variable 'other' is not an instance of class Collidable"
        }

        let a = this.box
        let b = other.box

        if (Math.abs(a.c[0] - b.c[0]) > (a.r[0] + b.r[0])) return false
        if (Math.abs(a.c[1] - b.c[1]) > (a.r[1] + b.r[1])) return false
        return true
    }
}