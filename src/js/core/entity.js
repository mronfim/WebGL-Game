const Entity = function Entity() {
    this.id = (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16) + Entity.prototype._count++
    this.components = {}
    return this
}

Entity.prototype._count = 0

Entity.prototype.addComponent = function addComponent(component) {
    this.components[component.name] = component
    return this
}

Entity.prototype.removeComponent = function removeComponent(componentName) {
    let name = componentName
    if (typeof componentName === 'function') {
        name = componentName.prototype.name
    }

    delete this.components[name]
    return this
}

Entity.prototype.print = function print() {
    console.log(this)
    return this
}

export default Entity