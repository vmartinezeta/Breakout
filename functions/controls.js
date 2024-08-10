import { getMp3Sound, playSound, stopSound, togglePlaybackRate } from "../functions/audio.js"
import createContext, { context } from "./context.js"

export async function togglePlay(botonPrincipal, botonSecundario) { 
  if (context !== null && context.state === "running") {
    stopSound()
    botonPrincipal.setText("Play")
    botonSecundario.setText("x1")
  } else {
    createContext()
    botonPrincipal.desactivar()
    playSound(await getMp3Sound("./audio/stranger-things.mp3"))
    botonPrincipal.setText("Playing")
    botonPrincipal.activar()
  }
}


export function toggleTextPlaybackRate(boton) {
    if (context !== null && context.state === "running") {
        boton.setText(togglePlaybackRate())    
    }
}