function fighterHealthPercent(fighter) {
  if (!fighter || !fighter.maxHealth) return 100
  return (fighter.health / fighter.maxHealth) * 100
}

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

let gameEnded = false

function stopMatchForCharacterSelect() {
  clearTimeout(timerId)
  gameEnded = false
}

function determineWinner({ player, enemy, timerId }) {
  if (gameEnded) return
  gameEnded = true
  clearTimeout(timerId)
  document.querySelector('#displayText').style.display = 'flex'
  document.querySelector('#postMatchButtons').style.display = 'flex'
  const msg = document.querySelector('#resultMessage')
  if (player.health === enemy.health) {
    msg.textContent = 'Tie'
  } else if (player.health > enemy.health) {
    msg.textContent = 'Player 1 Wins'
  } else if (player.health < enemy.health) {
    msg.textContent = 'Player 2 Wins'
  }
}

function startMatchTimer() {
  gameEnded = false
  clearTimeout(timerId)
  timer = 60
  document.querySelector('#timer').innerHTML = timer
  decreaseTimer()
}

function resetGame(keysState, spawnPoints) {
  startMatchTimer()

  document.querySelector('#displayText').style.display = 'none'
  document.querySelector('#postMatchButtons').style.display = 'none'

  player.health = player.maxHealth
  enemy.health = enemy.maxHealth
  gsap.set('#playerHealth', { width: `${fighterHealthPercent(player)}%` })
  gsap.set('#enemyHealth', { width: `${fighterHealthPercent(enemy)}%` })
  player.dead = false
  enemy.dead = false
  player.isAttacking = false
  enemy.isAttacking = false
  player.jumpsRemaining = player.maxJumps
  enemy.jumpsRemaining = enemy.maxJumps
  player.onGround = false
  enemy.onGround = false
  player.velocity.x = 0
  player.velocity.y = 0
  enemy.velocity.x = 0
  enemy.velocity.y = 0
  player.position.x = spawnPoints.left.x
  player.position.y = spawnPoints.left.y
  enemy.position.x = spawnPoints.right.x
  enemy.position.y = spawnPoints.right.y
  player.image = player.sprites.idle.image
  player.framesMax = player.sprites.idle.framesMax
  player.framesCurrent = 0
  player.framesElapsed = 0
  enemy.image = enemy.sprites.idle.image
  enemy.framesMax = enemy.sprites.idle.framesMax
  enemy.framesCurrent = 0
  enemy.framesElapsed = 0

  if (keysState) {
    keysState.a.pressed = false
    keysState.d.pressed = false
    keysState.ArrowLeft.pressed = false
    keysState.ArrowRight.pressed = false
  }
}

let timer = 60
let timerId
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId })
  }
}
