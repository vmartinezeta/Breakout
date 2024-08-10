export function $(selector) {
    return document.querySelector(selector)
}


export function crearBoton(name, callback, ctx, ...args) {
    const boton = $(name)

    boton.addEventListener("click", ()=>callback.call(ctx, boton, ...args))

    boton.setText = function (text){
        this.textContent = text
    }

    boton.activar = function () {
        this.disabled = false
    }

    boton.isActivo = function() {
        return this.disabled
    }

    boton.desactivar = function () {
        this.disabled = true
    }

    return boton
}


export function crearTitulo() {
    const titulo = document.createElement("h1")
    titulo.setAttribute("class", "message")
    titulo.setText = function (text) {
        titulo.textContent = text
    }
    return titulo
}