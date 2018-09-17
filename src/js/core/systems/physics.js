import * as glm from 'lib/gl-matrix'
import log from 'node_modules/loglevel'

const EPSILON = 0.01

export default class Physics {
    constructor() {

    }

    update(components) {
        // ========================================
        // Collidables

        let collidables = components.collidable || []
        collidables = collidables.map(entity => entity.components.collidable)

        collidables.forEach(collidable => collidable.colliding = false)

        for (var i = 0; i < collidables.length - 1; i++) {
            for (var j = i + 1; j < collidables.length; j++) {
                let a = collidables[i]
                let b = collidables[j]

                if (this.testOBBOBB(a.box, b.box)) {
                    a.colliding = true
                    b.colliding = true

                    // console.log(`[DEBUG] ${i} is colliding with ${j}`)
                }
            }
        }
    }

    testOBBOBB(a, b) {
        let ra = 0, rb = 0
        let R = glm.mat3.create()
        let AbsR = glm.mat3.create()

        // Compute rotation matrix expressing b in a's coordinate frame
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                R[i*3 + j] = glm.vec3.dot(a.u[i], b.u[j])
            }
        }

        // Compute translation vector t
        let t = glm.vec3.create()
        glm.vec3.sub(t, b.c, a.c)
        // Bring translation into a's coordinate frame
        t = glm.vec3.fromValues(glm.vec3.dot(t, a.u[0]), glm.vec3.dot(t, a.u[1]), glm.vec3.dot(t, a.u[2]))

        // Compute common subexpressions. Add in an epsilon term to conteract
        // arithmetic errors when two edges are parallel and their cross product
        // is (near) null
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                AbsR[i * 3 + j] = Math.abs(R[i * 3 + j]) + EPSILON
            }
        }

        // Test axes L = A0, L = A1, L = A2
        for (var i = 0; i < 3; i++) {
            ra = a.e[i]
            rb = b.e[0] * AbsR[i*3 + 0] + b.e[1] * AbsR[i*3 + 1] + b.e[2] * AbsR[i*3 + 2]
            if (Math.abs(t[i]) > ra + rb) return false
        }

        // Test axes L = B0, L = B1, L = B2
        for (var i = 0; i < 3; i++) {
            ra = a.e[0] * AbsR[0*3 + i] + a.e[1] * AbsR[1*3 + i] + a.e[2] * AbsR[2*3 + i]
            rb = b.e[i]
            if (Math.abs(t[0] * R[0*3 + i] + t[1] * R[1*3 + i] + t[2] * R[2*3 + i]) > ra + rb) return false
        }

        // Test axis L = A0 x B0
        ra = a.e[1] * AbsR[2*3 + 0] + a.e[2] * AbsR[1*3 + 0]
        rb = b.e[1] * AbsR[0*3 + 2] + b.e[2] * AbsR[0*3 + 1]
        if (Math.abs(t[2] * R[1*3 + 0] - t[1] * R[2*3 + 0]) > ra + rb) return false

        // Test axis L = A0 x B1
        ra = a.e[1] * AbsR[2*3 + 1] + a.e[2] * AbsR[1*3 + 1]
        rb = b.e[0] * AbsR[0*3 + 2] + b.e[2] * AbsR[0*3 + 0]
        if (Math.abs(t[2] * R[1*3 + 1] - t[1] * R[2*3 + 1]) > ra + rb) return false

        // Test axis L = A0 x B2
        ra = a.e[1] * AbsR[2*3 + 2] + a.e[2] * AbsR[1*3 + 2]
        rb = b.e[0] * AbsR[0*3 + 1] + b.e[1] * AbsR[0*3 + 0]
        if (Math.abs(t[2] * R[1*3 + 2] - t[1] * R[2*3 + 2]) > ra + rb) return false

        // Test axis L = A1 x B0
        ra = a.e[0] * AbsR[2*3 + 0] + a.e[2] * AbsR[0*3 + 0]
        rb = b.e[1] * AbsR[1*3 + 2] + b.e[2] * AbsR[1*3 + 1]
        if (Math.abs(t[0] * R[2*3 + 0] - t[2] * R[0*3 + 0]) > ra + rb) return false

        // Test axis L = A1 x B1
        ra = a.e[0] * AbsR[2*3 + 1] + a.e[2] * AbsR[0*3 + 1]
        rb = b.e[0] * AbsR[1*3 + 2] + b.e[2] * AbsR[1*3 + 0]
        if (Math.abs(t[0] * R[2*3 + 1] - t[2] * R[0*3 + 1]) > ra + rb) return false

        // Test axis L = A1 x B2
        ra = a.e[0] * AbsR[2*3 + 2] + a.e[2] * AbsR[0*3 + 2]
        rb = b.e[0] * AbsR[1*3 + 1] + b.e[1] * AbsR[1*3 + 0]
        if (Math.abs(t[0] * R[2*3 + 2] - t[2] * R[0*3 + 2]) > ra + rb) return false

        // Test axis L = A2 x B0
        ra = a.e[0] * AbsR[1*3 + 0] + a.e[1] * AbsR[0*3 + 0]
        rb = b.e[1] * AbsR[2*3 + 2] + b.e[2] * AbsR[2*3 + 1]
        if (Math.abs(t[1] * R[0*3 + 0] - t[0] * R[1*3 + 0]) > ra + rb) return false

        // Test axis L = A2 x B1
        ra = a.e[0] * AbsR[1*3 + 1] + a.e[1] * AbsR[0*3 + 1]
        rb = b.e[0] * AbsR[2*3 + 2] + b.e[2] * AbsR[2*3 + 0]
        if (Math.abs(t[1] * R[0*3 + 1] - t[0] * R[1*3 + 1]) > ra + rb) return false

        // Test axis L = A2 x B2
        ra = a.e[0] * AbsR[1*3 + 2] + a.e[1] * AbsR[0*3 + 2]
        rb = b.e[0] * AbsR[2*3 + 1] + b.e[1] * AbsR[2*3 + 0]
        if (Math.abs(t[1] * R[0*3 + 2] - t[0] * R[1*3 + 2]) > ra + rb) return false

        return true
    }
}