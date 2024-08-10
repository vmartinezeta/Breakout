import PhysicsBody from "./PhysicsBody.js"

export class Potenciador extends PhysicsBody{
    constructor(x, y, width, height, texture, aplicador, aplicado=false, fuera=false) {
        super(x, y, width, height)
        this.texture = texture
        this.aplicador = aplicador
        this.aplicado = aplicado
        this.fuera = fuera
    }

    setEstaFuera(fuera) {
        this.fuera = fuera
    }

    estaFuera() {
        return this.fuera
    }

    setAplicado(aplicado) {
        this.aplicado = aplicado
    }

    isAplicado() {
        return this.aplicado
    }

    newInstance() {
        return new Potenciador(this.x, this.y, this.width, this.height, this.texture, this.aplicador, this.aplicado, this.fuera)
    }
}