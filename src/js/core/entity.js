import log from 'node_modules/loglevel'
import Transform from 'core/components/transform'

const Entity = function Entity(entities) {
    this.id = (+new Date()).toString(16) + (Math.random() * 100000000 | 0).toString(16) + Entity.prototype._count++
    this.components = {}
    this.transform = new Transform()
    entities[this.id] = this
    return this
}

Entity.prototype._count = 0

Entity.prototype.addComponent = function addComponent(components, component) {
    this.components[component.name] = component
    if (components[component.name]) {
        components[component.name].push(this)
    } else {
        components[component.name] = [this]
    }
    return this
}

Entity.prototype.removeComponent = function removeComponent(components, name) {
    if (name === 'transform') {
        log.warn('WARNING cannot remove transform component from entity!')
    } else {
        delete this.components[name]
        delete components[name][this.id]
    }

    return this
}

Entity.prototype.print = function print() {
    console.log(this)
    return this
}

export default Entity