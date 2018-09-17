import * as glm from 'lib/gl-matrix'

export default class TransformComponent {
    constructor() {
        this.name = 'transform'
        this.position = glm.vec3.create()
        this.rotation = glm.vec3.create()
        this.scale = glm.vec3.fromValues(1, 1, 1)
    }

    setPosition(pos) {
        this.position = new Float32Array(pos)
    }

    setRotation(rot) {
        this.rotation = new Float32Array(rot)
    }

    setScale(scale) {
        this.scale = new Float32Array(scale)
    }

    move(displacement) {
        this.position[0] += displacement[0]
        this.position[1] += displacement[1]
    }
}