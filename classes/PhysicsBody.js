import Rectangle from "./Rectangle.js"

class PhysicsBody extends Rectangle{
    constructor(x, y, width, height, original) {
        super(x, y, width, height)
        this.gapX = 0
        this.gapY = 0
        this.enabled = true
        this.original = original || true
    }

    touching(body) {
        if (!(body instanceof PhysicsBody)) {
            throw new TypeError("deberia usarse con otro cuerpo de fisica")
        }

        if (this.x > body.x) {
            this.calculateGapX(body, this)
        } else {
            this.calculateGapX(this, body)
        }

        if (this.y > body.y) {
            this.calculateGapY(body, this)
        } else {
            this.calculateGapY(this, body)
        }
        return this.enabled && this.gapX < 0 && this.gapY < 0
    }

    calculateGapX(from, to) {
        this.gapX = to.x - (from.x + from.width)
    }

    calculateGapY(from, to) {
        this.gapY = to.y - (from.y + from.height)
    }

    setPosition(x, y) {
        this.x = x
        this.y = y
    }

    newInstance() {
        return new PhysicsBody(this.x, this.y,this.width, this.height, this.original)
    }
}

export default PhysicsBody