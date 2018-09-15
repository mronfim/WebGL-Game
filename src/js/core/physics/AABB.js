import * as glm from 'lib/gl-matrix'
import log from 'node_modules/loglevel'

export default class AABB {
    constructor(transform) {
        this.c = transform.position
        this.r = glm.vec3.create()
        glm.vec3.scale(this.r, transform.scale, 0.5)
    }
}