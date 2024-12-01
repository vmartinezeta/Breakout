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
  maxHeight: 10,
  width: 50,
  leftPressed: false,
  rightPressed: false
}


const ballRadius = 10
let state = {
  ballRadius,
  x: canvas.width / 2,
  y: canvas.height - 2 * paddle.height - ballRadius,
  paddleX: (canvas.width - paddle.width) / 2,
  paddleY: canvas.height - 2 * paddle.height,
  started: false,
  running: false,
  gameOver: false
}


const ballCollision = new PhysicsBody(state.x, state.y, state.ballRadius, state.ballRadius)
const paddleCollision = new PhysicsBody(state.paddleX, state.paddleY, 50, 10)

let clones = []
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
  BATE: "BATE",
  INDETERMINADO: "INDETERMINADO",
  fromInt: function (index) {
    const clase = this.toArray().find((_, key) => key === index)
    return clase ? clase : ClasePotenciador.INDETERMINADO
  },
  toArray: function () {
    return Object.values(this).filter(val => typeof val !== "function")
  }
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
  WIDTH: "WIDTH",
  RAPIDEZ: "RAPIDEZ"
}


const potenciadores = []
potenciadores.push(
  new Potenciador(Math.random() * 600, 0,
    56, 40, ClasePotenciador.BATE, new Aplicador(
      AccionPotenciador.AUMENTAR,
      PuntoAplicacion.HEIGHT,
      3
    ))
)

potenciadores.push(
  new Potenciador(Math.random() * 600, 0,
    56, 40, ClasePotenciador.PELOTA, new Aplicador(
      AccionPotenciador.AUMENTAR,
      PuntoAplicacion.RAPIDEZ,
      5
    ))
)

potenciadores.push(
  new Potenciador(Math.random() * 600, 0,
    56, 40, ClasePotenciador.BATE, new Aplicador(
      AccionPotenciador.OPRIMIR,
      PuntoAplicacion.ASIMISMO
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
        clasePotenciador: ClasePotenciador.fromInt(random),
        body: new PhysicsBody(brickX, brickY, brick.width, brick.height)
      }
    }
  }
}

function crearClones(cantidad = 2) {
  if (cantidad % 2 !== 0) {
    throw new TypeError("crearClones(cantidad), se permite un numero par.")
  }
  const par = cantidad / 2
  for (let i = 0; i < cantidad + 1; i++) {
    clones.push(ballCollision.newInstance())
    if (i === par) continue
    const SEPARACION = 25
    const lado = i < par ? -1 * SEPARACION * (par - i) : SEPARACION * (i - par)
    clones[i].x = ballCollision.x + lado
    clones[i].y = ballCollision.y - 10
  }
}

function createHtmlImg(url) {
  const img = new Image()
  img.src = url
  return img
}

function drawBall(ballCollision) {
  ctx.beginPath()
  ctx.arc(ballCollision.x, ballCollision.y, ballCollision.width, 0, Math.PI * 2)
  ctx.fillStyle = state.started && state.gameOver ? '#ff0000' : '#fff'
  ctx.fill()
  ctx.closePath()
}

function drawPotenciador(x, y, texture) {
  ctx.fillStyle = "#000"
  ctx.beginPath()
  ctx.rect(x, y, 46, 30)
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
    paddleCollision.x,
    paddleCollision.y,
    paddle.width,
    paddle.maxHeight
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
  const normalizar = new Set(potenciadoresEnJuego.filter(({ cogido }) => cogido).map(({ texture }) => texture))
  const texto = [...normalizar].join(",")
  ctx.fillText(`Potenciador: ${texto !== "" ? texto : "N/D"}`, 5, 25)
}

function collisionDetection(ballCollision) {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r]
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

      if (ballCollision.touching(currentBrick.body)) {
        velocidad.dy = -velocidad.dy
        currentBrick.status = BRICK_STATUS.DESTROYED
        if (ballCollision.original && currentBrick.clasePotenciador !== ClasePotenciador.INDETERMINADO) {
          
          const candidatos = potenciadores.filter(p => p.texture === currentBrick.clasePotenciador)
          const random = Math.floor(Math.random() * candidatos.length)
          const potenciador = candidatos[random]
          potenciadoresEnJuego.push(potenciador.newInstance())
        }
      } 
    }
  }
}

function ballMovement(ballCollision) {
  if (ballCollision.x + velocidad.dx > canvas.width - ballCollision.width
    || ballCollision.x + velocidad.dx < ballCollision.width) {
    velocidad.dx = -velocidad.dx
  }

  if (ballCollision.y + velocidad.dy < ballCollision.width) {
    velocidad.dy = -velocidad.dy
  }

  if (paddleCollision.touching(ballCollision)) {
    velocidad.dy = -velocidad.dy
    ballCollision.y = state.paddleY - ballCollision.width
  } else if (ballCollision.y + velocidad.dy > canvas.height - ballCollision.width
    || ballCollision.y + velocidad.dy > state.paddleY + paddle.height) {
    state.running = false
    state.gameOver = true
  }

  if (state.gameOver) return
  if (!state.started) {
    ballCollision.x = state.paddleX + paddle.width / 2
  } else if (state.running) {
    ballCollision.x += velocidad.dx
    ballCollision.y += velocidad.dy
  }
}

function paddleMovement() {
  if (state.gameOver || state.started && !state.running) return

  if (paddle.rightPressed && paddleCollision.x < canvas.width - paddle.width) {
    paddleCollision.x += paddle.sensitivity
  } else if (paddle.leftPressed && paddleCollision.x > 0) {
    paddleCollision.x -= paddle.sensitivity
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
        reset()
      }
    }

  }
}

function reset() {
  ballCollision.reset()
  paddleCollision.reset()
  clones = []
  state = {
    ...state,
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
    framesPerSec = frames
    frames = 0
  }

  cleanCanvas()

  drawBall(ballCollision)
  clones.forEach(ball => {
    drawBall(ball)
  })
  drawPaddle()
  drawBricks()
  drawUI()

  potenciadoresEnJuego.map(potenciador => {
    potenciador.x = potenciador.x + Math.random() * vaiven - vaiven / 2
    potenciador.y += 1 / 2
    return potenciador
  }).forEach(potenciador => {
    if (potenciador.touching(paddleCollision) && potenciador.isAtHome()) {
      potenciador.cogido = true
      const { aplicador } = potenciador
      potenciador.run()
      if (potenciador.texture === ClasePotenciador.BLOQUE) {
        const { aplicador } = potenciador
        if (aplicador.accion === AccionPotenciador.OPRIMIR && aplicador.puntoAplicacion === PuntoAplicacion.ASIMISMO) {
          ballCollision.enabled = false
        }
      } else if (aplicador.puntoAplicacion === PuntoAplicacion.HEIGHT) {
        const { aplicador } = potenciador
        paddle.maxHeight = aplicador.cantidad * paddle.height
      } else if (aplicador.puntoAplicacion === PuntoAplicacion.RAPIDEZ && velocidad.dx % 3 === 0) {
        velocidad.dx = (velocidad.dx / 3) * 5
        velocidad.dy = (velocidad.dy / 3) * 5
      } else if (aplicador.puntoAplicacion === PuntoAplicacion.ASIMISMO) {
        crearClones()
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

  const potenciador = potenciadoresEnJuego.find(p => p.cogido)
  if (potenciador) {
    if (potenciador.isAtEnd()) {
      const { aplicador } = potenciador
      potenciador.fuera = true
      if (potenciador.texture === ClasePotenciador.BLOQUE) {
        const { aplicador } = potenciador
        if (aplicador.accion === AccionPotenciador.OPRIMIR && aplicador.puntoAplicacion === PuntoAplicacion.ASIMISMO) {
          ballCollision.enabled = true
        }
      } else if (aplicador.puntoAplicacion === PuntoAplicacion.HEIGHT) {
        paddle.maxHeight = paddle.height
      } else if (aplicador.puntoAplicacion === PuntoAplicacion.RAPIDEZ && velocidad.dx % 5 === 0) {
        velocidad.dx = (velocidad.dx / 5) * 3
        velocidad.dy = (velocidad.dy / 5) * 3
      } else if (aplicador.puntoAplicacion === PuntoAplicacion.ASIMISMO) {
        clones = []
      }
    } else {
      potenciador.update()
    }
  }

  paddleMovement()

  ballMovement(ballCollision)
  clones.forEach(ball => {
    ballMovement(ball)
  })


  if (!state.started || state.gameOver || !state.running) {
    showMessage()
    return
  }

  removeMessage()

  collisionDetection(ballCollision)
  clones.forEach(ball => {
    collisionDetection(ball)
  })
}


draw()
initEvents()