import * as glm from 'lib/gl-matrix'
import log from 'node_modules/loglevel'

export default class OBB {
    constructor(transform) {
        // OBB center point
        this.c = transform.position

        // Local x-, y-, z-axes
        let origin = glm.vec3.fromValues(0, 0, 0)
        this.u = [glm.vec3.fromValues(1, 0, 0), glm.vec3.fromValues(0, 1, 0), glm.vec3.fromValues(0, 0, 1)]
        
        glm.vec3.rotateX(this.u[1], this.u[1], origin, transform.rotation[0])
        glm.vec3.rotateX(this.u[2], this.u[2], origin, transform.rotation[0])
        
        glm.vec3.rotateY(this.u[0], this.u[0], origin, transform.rotation[1])
        glm.vec3.rotateY(this.u[2], this.u[2], origin, transform.rotation[1])
        
        glm.vec3.rotateZ(this.u[0], this.u[0], origin, transform.rotation[2])
        glm.vec3.rotateZ(this.u[1], this.u[1], origin, transform.rotation[2])

        // Positive halfwidth extents of OBB along each axis
        this.e = glm.vec3.create()
        glm.vec3.scale(this.e, transform.scale, 0.5)
    }
}