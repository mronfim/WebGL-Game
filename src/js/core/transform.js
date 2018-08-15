import * as glm from 'lib/gl-matrix.js'

const TransformComponent = function TransformComponent() {
    this.position = glm.vec3.create()
    this.rotation = glm.vec3.create()
    this.scale = glm.vec3.fromValues(1, 1, 1)
}

TransformComponent.prototype.setPosition = function setPosition(pos) {
    this.position = new Float32Array(pos)
    return this
}

TransformComponent.prototype.setRotation = function setRotation(rot) {
    this.rotation = new Float32Array(rot)
    return this
}

TransformComponent.prototype.setScale = function setScale(scale) {
    this.scale = new Float32Array(scale)
    return this
}

TransformComponent.prototype.name = 'transform'

export default TransformComponent