import PhysicsBody from "./PhysicsBody.js"

export class Potenciador extends PhysicsBody{
    constructor(x, y, width, height, texture, aplicador, cogido=false, fuera=false) {
        super(x, y, width, height)
        this.texture = texture
        this.aplicador = aplicador
        this.cogido = cogido
        this.fuera = fuera
        this.starttime = null
        this.duration = 2000
        this.timeFraction = 0
    }

    reset() {
        this.starttime = null
        this.timeFraction = 0
        this.cogido = false
    }

    run() {
        this.starttime = Date.now()
    }
    
    isAtEnd() {
        return this.timeFraction>=1
    }

    update() {
        this.timeFraction = (Date.now() - this.starttime) / this.duration
    }

    newInstance() {
        return new Potenciador(this.x, this.y, this.width, this.height, this.texture, this.aplicador, this.cogido, this.fuera)
    }
}