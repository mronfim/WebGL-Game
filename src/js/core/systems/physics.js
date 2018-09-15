import * as glm from 'lib/gl-matrix'
import log from 'node_modules/loglevel'

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

                if (a.collides(b)) {
                    a.colliding = true
                    b.colliding = true

                    // console.log(`[DEBUG] ${i} is colliding with ${j}`)
                }
            }
        }
    }
}