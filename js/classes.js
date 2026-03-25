class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    flipX = false,
    framesHold = 5,
    crop = null
  }) {
    this.position = position
    this.width = 50
    this.height = 150
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.framesMax = framesMax
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = framesHold
    this.offset = offset
    this.flipX = flipX
    this.crop = crop
    this.drawWidth = 0
    this.drawHeight = 0
  }

  draw() {
    let sx, sy, sw, sh, dw, dh

    if (this.crop) {
      sx = this.crop.x
      sy = this.crop.y
      sw = this.crop.width
      sh = this.crop.height
    } else {
      sw = this.image.width / this.framesMax
      sh = this.image.height
      sx = this.framesCurrent * sw
      sy = 0
    }

    dw = this.drawWidth || (sw * this.scale)
    dh = this.drawHeight || (sh * this.scale)

    const drawX = this.position.x - this.offset.x
    const drawY = this.position.y - this.offset.y

    if (this.flipX) {
      c.save()
      c.translate(drawX + dw, drawY)
      c.scale(-1, 1)
      c.drawImage(this.image, sx, sy, sw, sh, 0, 0, dw, dh)
      c.restore()
    } else {
      c.drawImage(this.image, sx, sy, sw, sh, drawX, drawY, dw, dh)
    }
  }

  animateFrames() {
    this.framesElapsed++

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++
      } else {
        this.framesCurrent = 0
      }
    }
  }

  update() {
    this.draw()
    this.animateFrames()
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = 'red',
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
    attackHitFrame = 4,
    flipX = false,
    isMelee = true,
    projectileDef = null,
    maxHealth = 100,
    attackDamage = 20,
    moveSpeed = 5,
    jumpStrength = 20,
    maxJumps = 2,
    animFramesHold = 5,
    attackFramesHold = 5
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
      flipX,
      framesHold: animFramesHold
    })

    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.lastKey
    this.baseOffset = offset
    this.isMelee = isMelee
    this.projectileDef = projectileDef
    this.maxHealth = maxHealth
    this.health = maxHealth
    this.attackDamage = attackDamage
    this.moveSpeed = moveSpeed
    this.jumpStrength = jumpStrength
    this.maxJumps = maxJumps
    this.jumpsRemaining = maxJumps
    this.animFramesHold = animFramesHold
    this.attackFramesHold = attackFramesHold
    this.attackBoxBaseOffsetX = attackBox.offset.x
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height
    }
    this.color = color
    this.isAttacking
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.sprites = sprites
    this.dead = false
    this.attackHitFrame = attackHitFrame
    this.onGround = false
    this.dropThroughUntil = 0
    this.currentSurfaceType = null

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }
  }

  update() {
    this.draw()
    if (!this.dead) {
      if (
        this.image === this.sprites.attack1.image ||
        (this.sprites.attack2 && this.image === this.sprites.attack2.image)
      ) {
        this.framesHold = this.attackFramesHold
      } else {
        this.framesHold = this.animFramesHold
      }
      this.animateFrames()
    }

    // attack boxes (mirror horizontally when sprite is flipped)
    const attackOffX = this.flipX
      ? this.width - this.attackBoxBaseOffsetX - this.attackBox.width
      : this.attackBoxBaseOffsetX
    this.attackBox.position.x = this.position.x + attackOffX
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y

    // draw the attack box
    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // )

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    this.velocity.y += gravity
  }

  attack() {
    this.switchSprite('attack1')
    this.isAttacking = true
  }

  attack2() {
    if (this.sprites.attack2) {
      this.switchSprite('attack2')
      this.isAttacking = true
    }
  }

  takeHit(damage) {
    this.health = Math.max(0, this.health - damage)

    if (this.health <= 0) {
      this.switchSprite('death')
    } else this.switchSprite('takeHit')
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.dead = true
      return
    }

    // overriding all other animations with the attack animation
    if (
      (this.sprites.attack1 &&
        this.image === this.sprites.attack1.image &&
        this.framesCurrent < this.sprites.attack1.framesMax - 1) ||
      (this.sprites.attack2 &&
        this.image === this.sprites.attack2.image &&
        this.framesCurrent < this.sprites.attack2.framesMax - 1)
    )
      return

    // override when fighter gets hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return

    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image
          this.framesMax = this.sprites.idle.framesMax
          this.framesCurrent = 0
          this.offset = this.sprites.idle.offset || this.baseOffset
        }
        break
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image
          this.framesMax = this.sprites.run.framesMax
          this.framesCurrent = 0
          this.offset = this.sprites.run.offset || this.baseOffset
        }
        break
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image
          this.framesMax = this.sprites.jump.framesMax
          this.framesCurrent = 0
          this.offset = this.sprites.jump.offset || this.baseOffset
        }
        break

      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image
          this.framesMax = this.sprites.fall.framesMax
          this.framesCurrent = 0
          this.offset = this.sprites.fall.offset || this.baseOffset
        }
        break

      case 'attack1':
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image
          this.framesMax = this.sprites.attack1.framesMax
          this.framesCurrent = 0
          this.offset = this.sprites.attack1.offset || this.baseOffset
        }
        break

      case 'attack2':
        if (this.sprites.attack2 && this.image !== this.sprites.attack2.image) {
          this.image = this.sprites.attack2.image
          this.framesMax = this.sprites.attack2.framesMax
          this.framesCurrent = 0
          this.offset = this.sprites.attack2.offset || this.baseOffset
        }
        break

      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image
          this.framesMax = this.sprites.takeHit.framesMax
          this.framesCurrent = 0
          this.offset = this.sprites.takeHit.offset || this.baseOffset
        }
        break

      case 'death':
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image
          this.framesMax = this.sprites.death.framesMax
          this.framesCurrent = 0
          this.offset = this.sprites.death.offset || this.baseOffset
        }
        break
    }
  }
}

class Projectile extends Sprite {
  constructor({
    position,
    velocity,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    flipX = false,
    framesHold = 5,
    damage = 10,
    owner,
    width = 40,
    height = 20,
    range = 1000
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
      flipX,
      framesHold
    })
    this.velocity = velocity
    this.damage = damage
    this.owner = owner
    this.width = width
    this.height = height
    this.dead = false
    this.range = range
    this.distanceTraveled = 0
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      width: this.width,
      height: this.height
    }
  }

  update() {
    this.draw()
    this.animateFrames()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    this.distanceTraveled += Math.abs(this.velocity.x)
    this.attackBox.position.x = this.position.x
    this.attackBox.position.y = this.position.y
  }
}

class Items extends Sprite {
  pass
}

class Enemies extends Sprite {
  pass
}