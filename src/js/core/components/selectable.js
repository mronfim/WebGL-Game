import * as glm from 'lib/gl-matrix'
import { randomInt } from 'lib/math'

class Selectable {
    
    constructor(entityId) {
        this.name = 'selectable'
        this.entityId = entityId
        this.color = [randomInt(256), randomInt(256), randomInt(256), 255]
        Selectable.instances[this.color.join('')] = this
    }
}

Selectable.instances = {}

Selectable.getEntityId = (color) => {
    let selectable = Selectable.instances[color.join('')]
    return selectable && selectable.entityId
}

export default Selectable