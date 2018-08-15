import * as glm from 'lib/gl-matrix.js'

const TransformComponent = function TransformComponent() {
    this.position = glm.vec3.create()
    this.rotation = glm.vec3.create()
    this.scale = glm.vec3.fromValues(1, 1, 1)
}

TransformComponent.prototype.name = 'transform'

export default TransformComponent