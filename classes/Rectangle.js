class Rectangle {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.cache = structuredClone(this)
    }

    reset() {
        this.x = this.cache.x
        this.y = this.cache.y
        this.width = this.cache.width
        this.height = this.cache.height
    }
}

export default Rectangle