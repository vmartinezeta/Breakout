// Autor: midudev
// Refactorizado por Víctor Martínez
import { Aplicador } from "./classes/Aplicador.js"
import PhysicsBody from "./classes/PhysicsBody.js"
import { Potenciador } from "./classes/Potenciador.js"
import { $, crearBoton, crearTitulo } from "./functions/components.js"
import { togglePlay, toggleTextPlaybackRate } from "./functions/controls.js"


const canvas = $("canvas")
const ctx = canvas.getContext('2d')

const message = crearTitulo()
const boton = crearBoton("#buttonX2", toggleTextPlaybackRate, this)
crearBoton("#togglePlay", togglePlay, this, boton)


const $sprite = createHtmlImg("sprite.png")
const $bricks = createHtmlImg("bricks.png")

canvas.width = 600
canvas.height = 500

const velocidad = {
  dx: -3,
  dy: -3
}

const paddle = {
  sensitivity: 6,
  height: 10,
  width: 50,
  leftPressed: false,
  rightPressed: false
}


const ballRadius = 10
let stateDefault = {
  ballRadius,
  x: canvas.width / 2,
  y: canvas.height - 2 * paddle.height - ballRadius,
  paddleX: (canvas.width - paddle.width) / 2,
  paddleY: canvas.height - 2 * paddle.height,
  started: false,
  running: false,
  gameOver: false
}

let state = { ...stateDefault }

const ballCollision = new PhysicsBody(state.x, state.y, state.ballRadius, state.ballRadius)
const paddleCollision = new PhysicsBody(state.paddleX, state.paddleY, 50, 10)


const brickRowCount = 6
const brickColumnCount = 13
let bricks = []


const brick = {
  width: 32,
  height: 16,
  padding: 8,
  offsetTop: 80,
  offsetLeft: 52
}

const ClasePotenciador = {
  BLOQUE: "BLOQUE",
  PELOTA: "PELOTA",
  BATE: "BATE"
}

const AccionPotenciador = {
  AUMENTAR: "AUMENTAR",
  REDUCIR: "REDUCIR",
  CLONAR: "CLONAR",
  OPRIMIR: "OPRIMIR"
}

const PuntoAplicacion = {
  ASIMISMO: "ASIMISMO",
  RADIO: "RADIO",
  HEIGHT: "HEIGHT",
  WIDTH: "WIDTH"
}


const potenciadores = []
potenciadores.push(
  new Potenciador(Math.random() * 600, 0,
    56, 40, ClasePotenciador.BATE, new Aplicador(
      AccionPotenciador.AUMENTAR,
      PuntoAplicacion.WIDTH,
      3
    ))
)

potenciadores.push(
  new Potenciador(Math.random() * 600, 0,
    56, 40, ClasePotenciador.PELOTA, new Aplicador(
      AccionPotenciador.CLONAR,
      PuntoAplicacion.ASIMISMO,
      3
    ))
)

potenciadores.push(
  new Potenciador(Math.random() * 600, 0,
    56, 40, ClasePotenciador.BLOQUE, new Aplicador(
      AccionPotenciador.OPRIMIR,
      PuntoAplicacion.ASIMISMO
    ))
)

const potenciadoresEnJuego = []
let timer = null
function suministrarPotenciador() {
  const potenciador = potenciadores.pop()
  potenciadores.unshift(potenciador)
  potenciadoresEnJuego.push(potenciador.newInstance())
}


const BRICK_STATUS = {
  ACTIVE: 1,
  DESTROYED: 0
}

createBrick()

function createBrick() {
  bricks = []
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = []
    for (let r = 0; r < brickRowCount; r++) {
      const brickX = c * (brick.width + brick.padding) + brick.offsetLeft
      const brickY = r * (brick.height + brick.padding) + brick.offsetTop
      const random = Math.floor(Math.random() * 8)
      bricks[c][r] = {
        x: brickX,
        y: brickY,
        status: BRICK_STATUS.ACTIVE,
        color: random,
        body: new PhysicsBody(brickX, brickY, brick.width, brick.height)
      }
    }
  }
}

function createHtmlImg(url) {
  const img = new Image()
  img.src = url
  return img
}

function drawBall() {
  ctx.beginPath()
  ctx.arc(state.x, state.y, state.ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = state.started && state.gameOver ? '#ff0000' : '#fff'
  ctx.fill()
  ctx.closePath()
}

function drawPotenciador(x, y, texture) {
  ctx.fillStyle = "#000"
  ctx.beginPath()
  if (texture === ClasePotenciador.PELOTA) {
    ctx.arc(x, y, 20, 0, 2 * Math.PI)
  } else {
    ctx.rect(x, y, 46, 30)
  }
  ctx.fill()
  ctx.closePath()
}

function drawPaddle() {
  ctx.drawImage(
    $sprite,
    29,
    174,
    paddle.width,
    paddle.height,
    state.paddleX,
    state.paddleY,
    paddle.width,
    paddle.height
  )

}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r]
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

      const clipX = currentBrick.color * 32

      ctx.drawImage(
        $bricks,
        clipX,
        0,
        brick.width, // 31
        brick.height, // 14
        currentBrick.x,
        currentBrick.y,
        brick.width,
        brick.height
      )
    }
  }
}

function drawUI() {
  ctx.fillText(`FPS: ${framesPerSec}`, 5, 10)
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r]
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

      if (ballCollision.touching(currentBrick.body)) {
        velocidad.dy = -velocidad.dy
        currentBrick.status = BRICK_STATUS.DESTROYED
      }
    }
  }

  if (total === 0) {
    state.gameOver = true
  }
}

function ballMovement() {
  if (state.x + velocidad.dx > canvas.width - state.ballRadius
    || state.x + velocidad.dx < state.ballRadius) {
    velocidad.dx = -velocidad.dx
  }

  if (state.y + velocidad.dy < state.ballRadius) {
    velocidad.dy = -velocidad.dy
  }

  if (paddleCollision.touching(ballCollision)) {
    velocidad.dy = -velocidad.dy
    state.y = state.paddleY - state.ballRadius
  } else if (state.y + velocidad.dy > canvas.height - state.ballRadius
    || state.y + velocidad.dy > state.paddleY + paddle.height) {
    state.running = false
    state.gameOver = true
  }

  if (state.gameOver) return
  if (!state.started) {
    state.x = state.paddleX + paddle.width / 2
  } else if (state.running) {
    state.x += velocidad.dx
    state.y += velocidad.dy
  }
}

function paddleMovement() {
  if (state.gameOver || state.started && !state.running) return

  if (paddle.rightPressed && state.paddleX < canvas.width - paddle.width) {
    state.paddleX += paddle.sensitivity
  } else if (paddle.leftPressed && state.paddleX > 0) {
    state.paddleX -= paddle.sensitivity
  }
}

function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function initEvents() {
  document.addEventListener('keydown', keyDownHandler)
  document.addEventListener('keyup', keyUpHandler)

  function keyDownHandler(event) {
    const { key } = event
    if (key === 'Right' || key === 'ArrowRight' || key.toLowerCase() === 'd') {
      paddle.rightPressed = true
    } else if (key === 'Left' || key === 'ArrowLeft' || key.toLowerCase() === 'a') {
      paddle.leftPressed = true
    }
  }

  function keyUpHandler(event) {
    const { key } = event
    if (key === 'Right' || key === 'ArrowRight' || key.toLowerCase() === 'd') {
      paddle.rightPressed = false
    } else if (key === 'Left' || key === 'ArrowLeft' || key.toLowerCase() === 'a') {
      paddle.leftPressed = false
    } else if (key === ' ' && state.started) {
      state.running = !state.running
    } else if (key === "Enter") {
      if (!state.started || state.gameOver) {
        timer = setInterval(suministrarPotenciador, 4000)
        reset()
      }
    }

  }
}

function reset() {
  const x = state.x
  state = {
    ...stateDefault,
    x,
    paddleX: x - paddle.width / 2,
    running: true,
    started: true,
    gameOver: false
  }

  if (bricks.some(array => array.some(b => b.status === BRICK_STATUS.DESTROYED))) {
    createBrick()
  }
}

function showMessage() {
  if (!state.started) {
    message.setText("Press ENTER key to start")
  } else if (state.gameOver) {
    message.setText("GAME OVER")
  } else if (!state.running) {
    message.setText("PAUSED")
  }
  $(".app__canvas").appendChild(message)
}

function removeMessage() {
  if (document.getElementsByClassName("message").length > 0) {
    $(".app__canvas").removeChild(message)
  }
}


const fps = 60
let msPrev = window.performance.now()
let msFPSPrev = window.performance.now() + 1000
const msPerFrame = 1000 / fps
let frames = 0
let framesPerSec = fps
const vaiven = 10


function draw() {
  window.requestAnimationFrame(draw)

  const msNow = window.performance.now()
  const msPassed = msNow - msPrev

  if (msPassed < msPerFrame) return

  const excessTime = msPassed % msPerFrame
  msPrev = msNow - excessTime

  frames++

  if (msFPSPrev < msNow) {
    msFPSPrev = window.performance.now() + 1000
    framesPerSec = frames;
    frames = 0;
  }

  cleanCanvas()


  ballCollision.setPosition(state.x, state.y)
  paddleCollision.setPosition(state.paddleX, state.paddleY)

  drawBall()
  drawPaddle()
  drawBricks()
  drawUI()

  potenciadoresEnJuego.map(potenciador => {
    potenciador.x = potenciador.x + Math.random() * vaiven - vaiven / 2
    potenciador.y += 1
    return potenciador
  }).forEach(potenciador => {
    if (potenciador.touching(paddleCollision)) {
      if (!potenciador.isAtEnd()) {
        potenciador.cogido = true
        potenciador.run()
        if (potenciador.texture === ClasePotenciador.BLOQUE) {
          const {aplicador} = potenciador
          if (aplicador.accion === AccionPotenciador.OPRIMIR && aplicador.puntoAplicacion === PuntoAplicacion.ASIMISMO) {
            ballCollision.enabled = false
          }
        }
      }
    }
    drawPotenciador(potenciador.x, potenciador.y, potenciador.texture)
  })

  potenciadoresEnJuego.map(p => {
    if (p.y > 500 && !p.cogido) {
      p.fuera = true
    }
    return p
  }).filter(p => p.fuera).forEach(_ => {
    const index = potenciadoresEnJuego.findIndex(p => p.fuera)
    potenciadoresEnJuego.splice(index, 1)
  })

  const potenciador = potenciadoresEnJuego.find(p=>p.cogido || p.isAtEnd())
  if(potenciador) {
    if (potenciador.isAtEnd()) {
      potenciador.reset()    
      if (potenciador.texture === ClasePotenciador.BLOQUE) {
        const {aplicador} = potenciador
        if (aplicador.accion === AccionPotenciador.OPRIMIR && aplicador.puntoAplicacion === PuntoAplicacion.ASIMISMO) {
          ballCollision.enabled = true
        }
      } 
    } else {
      potenciador.update()
    }
  }

  paddleMovement()
  ballMovement()


  if (!state.started || state.gameOver || !state.running) {
    showMessage()
    clearInterval(timer)
    return
  }

  removeMessage()

  collisionDetection()
}


draw()
initEvents()