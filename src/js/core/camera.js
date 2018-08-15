import * as glm from 'lib/gl-matrix.js'

const CameraComponent = function CameraComponent(width, height, direction, up) {
    this.halfWidth = (width / 2) || 5
    this.halfHeight = (height / 2) || 5
    this.direction = direction || glm.vec3.fromValues(0, 0, -1)
    this.up = up || glm.vec3.fromValues(0, 1, 0)

    return this
}

// TODO:
//      - Add camera functions to rotate, etc...

CameraComponent.prototype.name = 'camera'

export default CameraComponent