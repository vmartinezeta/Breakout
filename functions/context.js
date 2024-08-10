export let context = null

export default function createContext() {
    context = new AudioContext()
}