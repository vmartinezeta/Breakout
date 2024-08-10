import { context } from "../functions/context.js";

let source = null


export function playSound(audioBuffer) {
  source = context.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = true
  source.playbackRate.value = 1
  source.connect(context.destination);
  source.start();
}

export function togglePlaybackRate() {
  if (source === null) return "x1"
  if (source.playbackRate.value === 1) {
    source.playbackRate.value = 2
    return "x2"
  } else {
    source.playbackRate.value = 1
    return "x1"
  }
}

export function stopSound() {
  if (source === null) return
  context.close()
  source.stop()
}

export async function getMp3Sound(url) {
  try {
    const res = await fetch(url)
    const arrayBuffer = await res.arrayBuffer()
    return context.decodeAudioData(arrayBuffer)
  } catch (error) {
    console.log(error.message())
  }
}