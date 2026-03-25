const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const gameRoot = document.querySelector('#gameRoot')
const gravity = 0.7

let gamePhase = 'selectCharacter'
let p1CharIndex = 0
let p2CharIndex = 1
let mapIndex = 0
let previewP1 = null
let previewP2 = null
let lastPreviewP1 = -1
let lastPreviewP2 = -1

const characterMenuBackground = new Sprite({
  position: { x: 0, y: -390 },
  imageSrc: './img/arena.jpg',
  scale: 1.5
})

let player = null
let enemy = null
let activeMapDef = getMapByIndex(mapIndex)
let activeMap = null

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

const projectiles = []

function updateSelectUi() {
  const title = document.querySelector('#selectTitle')
  const line1 = document.querySelector('#selectLine1')
  const line2 = document.querySelector('#selectLine2')
  const line3 = document.querySelector('#selectLine3')
  if (gamePhase === 'selectCharacter') {
    title.textContent = 'CHOOSE YOUR FIGHTER'
    line1.textContent = 'PLAYER 1 A / D'
    line2.textContent = 'PLAYER 2 left arrow / right arrow'
    line3.textContent = 'ENTER : confirm characters'
  } else {
    title.textContent = `CHOOSE MAP: ${activeMapDef.name}`
    line1.textContent = 'A / D or left / right : change map'
    line2.textContent = 'ENTER : start fight'
    line3.textContent = 'BACKSPACE : back to character select'
  }
}

function syncIdlePreviews() {
  if (p1CharIndex !== lastPreviewP1) {
    const d = getCharacterByIndex(p1CharIndex)
    previewP1 = createIdlePreviewSprite(
      d,
      { x: canvas.width * 0.25, y: canvas.height * 0.62 },
      flipSpriteXForSide(d, true)
    )
    lastPreviewP1 = p1CharIndex
  }
  if (p2CharIndex !== lastPreviewP2) {
    const d = getCharacterByIndex(p2CharIndex)
    previewP2 = createIdlePreviewSprite(
      d,
      { x: canvas.width * 0.75, y: canvas.height * 0.62 },
      flipSpriteXForSide(d, false)
    )
    lastPreviewP2 = p2CharIndex
  }
}

function showFightHud() {
  const hud = document.querySelector('#gameHud')
  hud.style.display = 'flex'
  hud.style.alignItems = 'center'
}

function returnToCharacterSelect() {
  stopMatchForCharacterSelect()
  document.querySelector('#displayText').style.display = 'none'
  document.querySelector('#postMatchButtons').style.display = 'none'
  document.querySelector('#gameHud').style.display = 'none'
  document.querySelector('#charSelectUi').style.display = 'block'
  gamePhase = 'selectCharacter'
  player = null
  enemy = null
  lastPreviewP1 = -1
  lastPreviewP2 = -1
  gsap.set('#playerHealth', { width: '100%' })
  gsap.set('#enemyHealth', { width: '100%' })
  keys.a.pressed = false
  keys.d.pressed = false
  keys.ArrowLeft.pressed = false
  keys.ArrowRight.pressed = false
}

function resizeCanvas() {
  const oldWidth = canvas.width || 1
  const oldHeight = canvas.height || 1

  canvas.width = gameRoot.clientWidth || window.innerWidth
  canvas.height = gameRoot.clientHeight || window.innerHeight
  activeMap = buildMapRuntime(activeMapDef, canvas)
  lastPreviewP1 = -1
  lastPreviewP2 = -1

  if (player && enemy) {
    const p1xRatio = player.position.x / oldWidth
    const p1yRatio = player.position.y / oldHeight
    const p2xRatio = enemy.position.x / oldWidth
    const p2yRatio = enemy.position.y / oldHeight
    player.position.x = p1xRatio * canvas.width
    player.position.y = p1yRatio * canvas.height
    enemy.position.x = p2xRatio * canvas.width
    enemy.position.y = p2yRatio * canvas.height
  }
}

function setActiveMapByIndex(nextIndex) {
  const mapCount = getMapCount()
  mapIndex = ((nextIndex % mapCount) + mapCount) % mapCount
  activeMapDef = getMapByIndex(mapIndex)
  resizeCanvas()
  updateSelectUi()
}

function clampFighterToMapX(fighter) {
  const maxX = canvas.width - fighter.width
  if (fighter.position.x < 0) fighter.position.x = 0
  if (fighter.position.x > maxX) fighter.position.x = maxX
}

function resolveVerticalMapCollision(fighter, previousBottom) {
  const currentBottom = fighter.position.y + fighter.height
  let landedSurface = null
  fighter.onGround = false
  fighter.currentSurfaceType = null
  const now = performance.now()

  for (const surface of activeMap.walkableSurfaces) {
    if (surface.type === 'platform' && now < fighter.dropThroughUntil) continue
    const overlapX =
      fighter.position.x + fighter.width > surface.x &&
      fighter.position.x < surface.x + surface.width
    const crossedSurfaceTop =
      previousBottom <= surface.y && currentBottom >= surface.y
    if (fighter.velocity.y >= 0 && overlapX && crossedSurfaceTop) {
      if (!landedSurface || surface.y < landedSurface.y) landedSurface = surface
    }
  }

  if (landedSurface) {
    fighter.position.y = landedSurface.y - fighter.height
    fighter.velocity.y = 0
    fighter.onGround = true
    fighter.currentSurfaceType = landedSurface.type
    fighter.jumpsRemaining = fighter.maxJumps
  }
}

function startFight() {
  if (gamePhase !== 'selectMap') return

  gamePhase = 'fight'
  document.querySelector('#charSelectUi').style.display = 'none'
  showFightHud()

  const d1 = getCharacterByIndex(p1CharIndex)
  const d2 = getCharacterByIndex(p2CharIndex)
  player = createFighterFromDefinition(d1, {
    position: { ...activeMap.spawn.left },
    velocity: { x: 0, y: 0 },
    color: 'red',
    flipX: flipSpriteXForSide(d1, true)
  })
  enemy = createFighterFromDefinition(d2, {
    position: { ...activeMap.spawn.right },
    velocity: { x: 0, y: 0 },
    color: 'blue',
    flipX: flipSpriteXForSide(d2, false)
  })
  player.onGround = false
  enemy.onGround = false
  player.jumpsRemaining = player.maxJumps
  enemy.jumpsRemaining = enemy.maxJumps
  projectiles.length = 0

  gsap.set('#playerHealth', { width: `${fighterHealthPercent(player)}%` })
  gsap.set('#enemyHealth', { width: `${fighterHealthPercent(enemy)}%` })

  startMatchTimer()
}

function drawCharacterNameLabels() {
  const d1 = getCharacterByIndex(p1CharIndex)
  const d2 = getCharacterByIndex(p2CharIndex)
  const fontSize = Math.max(10, Math.floor(canvas.width * 0.012))
  c.save()
  c.fillStyle = 'white'
  c.font = `${fontSize}px "Press Start 2P"`
  c.textAlign = 'center'
  c.fillText(d1.name, canvas.width * 0.25, canvas.height * 0.2)
  c.fillText(d2.name, canvas.width * 0.75, canvas.height * 0.2)
  c.restore()
}

function animateSelect() {
  if (gamePhase === 'selectCharacter') {
    if (
      characterMenuBackground &&
      characterMenuBackground.image.complete &&
      characterMenuBackground.image.naturalWidth
    ) {
      characterMenuBackground.draw()
    } else {
      c.fillStyle = 'black'
      c.fillRect(0, 0, canvas.width, canvas.height)
    }
  } else {
    activeMap.draw()
  }

  c.fillStyle = 'rgba(0, 0, 0, 0.55)'
  c.fillRect(0, 0, canvas.width, canvas.height)

  if (gamePhase === 'selectCharacter') {
    syncIdlePreviews()
    if (previewP1) previewP1.update()
    if (previewP2) previewP2.update()
    drawCharacterNameLabels()
  }
}

function spawnProjectile(fighter) {
  if (!fighter.projectileDef) return

  const spawnOffX = fighter.projectileDef.spawnOffset?.x ?? 50
  const spawnOffY = fighter.projectileDef.spawnOffset?.y ?? (fighter.height / 2.5)

  projectiles.push(
    new Projectile({
      position: {
        x: fighter.position.x + (fighter.flipX ? fighter.width - spawnOffX : spawnOffX),
        y: fighter.position.y + spawnOffY
      },
      velocity: {
        x: fighter.flipX ? -15 : 15,
        y: 0
      },
      imageSrc: fighter.projectileDef.imageSrc,
      scale: fighter.projectileDef.scale || 1,
      framesMax: fighter.projectileDef.framesMax || 1,
      flipX: fighter.flipX,
      damage: fighter.attackDamage,
      owner: fighter,
      range: fighter.projectileDef.range || 1000
    })
  )
}

function getCurrentAttackIsMelee(fighter) {
  const currentAction =
    fighter.sprites.attack2 && fighter.image === fighter.sprites.attack2.image
      ? 'attack2'
      : 'attack1'
  if (fighter.projectileDef?.attackState === currentAction) return false
  if (
    fighter.projectileDef?.attackState &&
    fighter.projectileDef.attackState !== currentAction
  )
    return true
  return fighter.isMelee
}

function animateFight() {
  activeMap.draw()
  const playerPrevBottom = player.position.y + player.height
  const enemyPrevBottom = enemy.position.y + enemy.height
  player.update()
  enemy.update()
  resolveVerticalMapCollision(player, playerPrevBottom)
  resolveVerticalMapCollision(enemy, enemyPrevBottom)
  clampFighterToMapX(player)
  clampFighterToMapX(enemy)

  player.velocity.x = 0
  enemy.velocity.x = 0

  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -player.moveSpeed
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = player.moveSpeed
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -enemy.moveSpeed
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = enemy.moveSpeed
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  if (player.isAttacking && player.framesCurrent === player.attackHitFrame) {
    if (getCurrentAttackIsMelee(player)) {
      if (rectangularCollision({ rectangle1: player, rectangle2: enemy })) {
        enemy.takeHit(player.attackDamage)
        gsap.to('#enemyHealth', {
          width: `${fighterHealthPercent(enemy)}%`
        })
      }
    } else {
      spawnProjectile(player)
    }
    player.isAttacking = false
  }

  if (enemy.isAttacking && enemy.framesCurrent === enemy.attackHitFrame) {
    if (getCurrentAttackIsMelee(enemy)) {
      if (rectangularCollision({ rectangle1: enemy, rectangle2: player })) {
        player.takeHit(enemy.attackDamage)
        gsap.to('#playerHealth', {
          width: `${fighterHealthPercent(player)}%`
        })
      }
    } else {
      spawnProjectile(enemy)
    }
    enemy.isAttacking = false
  }

  projectiles.forEach((p, i) => {
    p.update()
    const target = p.owner === player ? enemy : player
    if (
      rectangularCollision({ rectangle1: p, rectangle2: target }) &&
      !p.dead &&
      !target.dead
    ) {
      target.takeHit(p.damage)
      p.dead = true
      gsap.to(target === enemy ? '#enemyHealth' : '#playerHealth', {
        width: `${fighterHealthPercent(target)}%`
      })
    }
    if (p.position.x < -200 || p.position.x > canvas.width + 200 || p.dead || p.distanceTraveled >= p.range) {
      projectiles.splice(i, 1)
    }
  })

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

function animate() {
  window.requestAnimationFrame(animate)
  if (gamePhase === 'selectCharacter' || gamePhase === 'selectMap') {
    animateSelect()
  } else {
    animateFight()
  }
}

resizeCanvas()
animate()

window.addEventListener('keydown', (event) => {
  if (gamePhase === 'selectCharacter') {
    if (event.key === 'a' || event.key === 'A') {
      p1CharIndex--
    } else if (event.key === 'd' || event.key === 'D') {
      p1CharIndex++
    } else if (event.key === 'ArrowLeft') {
      p2CharIndex--
    } else if (event.key === 'ArrowRight') {
      p2CharIndex++
    } else if (event.key === 'Enter') {
      gamePhase = 'selectMap'
      updateSelectUi()
    }
    return
  }

  if (gamePhase === 'selectMap') {
    if (
      event.key === 'a' ||
      event.key === 'A' ||
      event.key === 'ArrowLeft'
    ) {
      setActiveMapByIndex(mapIndex - 1)
    } else if (
      event.key === 'd' ||
      event.key === 'D' ||
      event.key === 'ArrowRight'
    ) {
      setActiveMapByIndex(mapIndex + 1)
    } else if (event.key === 'Enter') {
      startFight()
    } else if (event.key === 'Backspace') {
      event.preventDefault()
      gamePhase = 'selectCharacter'
      updateSelectUi()
    }
    return
  }

  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        if (!event.repeat && player.jumpsRemaining > 0) {
          const jumpToCeiling = Math.sqrt(
            2 * gravity * Math.max(0, player.position.y - player.offset.y)
          )
          player.velocity.y = -Math.max(player.jumpStrength, jumpToCeiling)
          player.onGround = false
          player.currentSurfaceType = null
          player.jumpsRemaining--
        }
        break
      case 's':
      case 'S':
        if (player.onGround && player.currentSurfaceType === 'platform') {
          player.dropThroughUntil = performance.now() + 220
          player.onGround = false
          player.velocity.y = Math.max(player.velocity.y, 6)
        }
        break
      case 'q':
      case 'Q':
        player.attack()
        break
      case 'e':
      case 'E':
        player.attack2()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        if (!event.repeat && enemy.jumpsRemaining > 0) {
          const jumpToCeiling = Math.sqrt(
            2 * gravity * Math.max(0, enemy.position.y - enemy.offset.y)
          )
          enemy.velocity.y = -Math.max(enemy.jumpStrength, jumpToCeiling)
          enemy.onGround = false
          enemy.currentSurfaceType = null
          enemy.jumpsRemaining--
        }
        break
      case 'ArrowDown':
        if (enemy.onGround && enemy.currentSurfaceType === 'platform') {
          enemy.dropThroughUntil = performance.now() + 220
          enemy.onGround = false
          enemy.velocity.y = Math.max(enemy.velocity.y, 6)
        }
        break
      case 'l':
      case 'L':
        enemy.attack()
        break
      case 'k':
      case 'K':
        enemy.attack2()
        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  if (gamePhase !== 'fight') return

  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})

document.querySelector('#resetButton').addEventListener('click', () => {
  resetGame(keys, activeMap.spawn)
})

document.querySelector('#chooseCharButton').addEventListener('click', () => {
  returnToCharacterSelect()
})

window.addEventListener('resize', () => {
  resizeCanvas()
})

updateSelectUi()
