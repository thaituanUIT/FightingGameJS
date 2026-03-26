/**
 * Character registry. Each entry: id, name, visuals, attackHitFrame (sprite sheet),
 * attackBox, sprites, optional stats (see DEFAULT_CHARACTER_STATS), and face_right.
 *
 * face_right: true if the raw sprite sheet faces right when drawn without mirror;
 * false if it faces left. Omit to default to true. Used so each side faces the opponent:
 *   — Left slot (P1) should face right (+X).
 *   — Right slot (P2) should face left (−X).
 */
function flipSpriteXForSide(def, isLeftSide) {
  const originalFacesRight = def.face_right !== false
  return originalFacesRight !== isLeftSide
}

const DEFAULT_CHARACTER_STATS = {
  /** Maximum HP (health bar is scaled to this). */
  maxHealth: 100,
  /** Damage dealt to the opponent on a successful hit. */
  attackDamage: 20,
  /** Horizontal speed while moving (pixels per frame). */
  moveSpeed: 5,
  /** Jump impulse strength (applied as upward velocity). */
  jumpStrength: 20,
  /** Total jumps before needing to land again (2 = double jump). */
  maxJumps: 2,
  /** Frames between animation steps for idle, run, jump, hit, death, etc. Lower = snappier. */
  animFramesHold: 5,
  /** Frames between steps during the attack animation only. Lower = faster attack wind-up/recovery. */
  attackFramesHold: 5
}

function resolveCharacterStats(def) {
  return { ...DEFAULT_CHARACTER_STATS, ...def.stats }
}

const CHARACTERS = [
  {
    id: 'samuraiMack',
    name: 'Samurai Mack',
    face_right: true,
    scale: 2.5,
    drawOffset: { x: 235, y: 157 },
    attackHitFrame: 4,
    attackBox: {
      offset: { x: 100, y: 50 },
      width: 160,
      height: 50
    },
    stats: {
      maxHealth: 110,
      attackDamage: 22,
      moveSpeed: 4.5,
      jumpStrength: 18,
      maxJumps: 2,
      animFramesHold: 5,
      attackFramesHold: 6
    },
    sprites: {
      idle: {
        imageSrc: './img/characters/samuraiMack/Idle.png',
        framesMax: 8
      },
      run: {
        imageSrc: './img/characters/samuraiMack/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc: './img/characters/samuraiMack/Jump.png',
        framesMax: 2
      },
      fall: {
        imageSrc: './img/characters/samuraiMack/Fall.png',
        framesMax: 2
      },
      attack1: {
        imageSrc: './img/characters/samuraiMack/Attack1.png',
        framesMax: 6
      },
      attack2: {
        imageSrc: './img/characters/samuraiMack/Attack2.png',
        framesMax: 6
      },
      takeHit: {
        imageSrc: './img/characters/samuraiMack/Take Hit - white silhouette.png',
        framesMax: 4
      },
      death: {
        imageSrc: './img/characters/samuraiMack/Death.png',
        framesMax: 6
      }
    }
  },
  {
    id: 'kenji',
    name: 'Master Kenji',
    face_right: false,
    scale: 2.5,
    drawOffset: { x: 235, y: 167 },
    attackHitFrame: 2,
    attackBox: {
      offset: { x: -170, y: 50 },
      width: 170,
      height: 50
    },
    stats: {
      maxHealth: 95,
      attackDamage: 18,
      moveSpeed: 6,
      jumpStrength: 22,
      maxJumps: 2,
      animFramesHold: 4,
      attackFramesHold: 4
    },
    sprites: {
      idle: {
        imageSrc: './img/characters/kenji/Idle.png',
        framesMax: 4
      },
      run: {
        imageSrc: './img/characters/kenji/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc: './img/characters/kenji/Jump.png',
        framesMax: 2
      },
      fall: {
        imageSrc: './img/characters/kenji/Fall.png',
        framesMax: 2
      },
      attack1: {
        imageSrc: './img/characters/kenji/Attack1.png',
        framesMax: 4
      },
      attack2: {
        imageSrc: './img/characters/kenji/Attack2.png',
        framesMax: 4
      },
      takeHit: {
        imageSrc: './img/characters/kenji/Take hit.png',
        framesMax: 3
      },
      death: {
        imageSrc: './img/characters/kenji/Death.png',
        framesMax: 7
      }
    }
  },
  {
    id: 'king',
    name: 'The King',
    face_right: true,
    scale: 2.5,
    drawOffset: { x: 165, y: 110 },
    attackHitFrame: 2,
    attackBox: {
      offset: { x: 100, y: 50 },
      width: 160,
      height: 50
    },
    stats: {
      maxHealth: 120,
      attackDamage: 25,
      moveSpeed: 4,
      jumpStrength: 18,
      maxJumps: 2,
      animFramesHold: 5,
      attackFramesHold: 5
    },
    sprites: {
      idle: {
        imageSrc: './img/characters/king/Idle.png',
        framesMax: 8
      },
      run: {
        imageSrc: './img/characters/king/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc: './img/characters/king/Jump.png',
        framesMax: 2
      },
      fall: {
        imageSrc: './img/characters/king/Fall.png',
        framesMax: 2
      },
      attack1: {
        imageSrc: './img/characters/king/Attack1.png',
        framesMax: 4
      },
      attack2: {
        imageSrc: './img/characters/king/Attack2.png',
        framesMax: 4
      },
      takeHit: {
        imageSrc: './img/characters/king/Take Hit.png',
        framesMax: 4
      },
      death: {
        imageSrc: './img/characters/king/Death.png',
        framesMax: 6
      }
    }
  },
  {
    id: 'darkWitch',
    name: 'Dark Witch Ascartha',
    face_right: true,
    scale: 2.5,
    drawOffset: { x: 170, y: 95 },
    attackHitFrame: 2,
    attackBox: {
      offset: { x: 100, y: 50 },
      width: 160,
      height: 50
    },
    stats: {
      maxHealth: 120,
      attackDamage: 25,
      moveSpeed: 4,
      jumpStrength: 18,
      maxJumps: 2,
      animFramesHold: 5,
      attackFramesHold: 5
    },
    sprites: {
      idle: {
        imageSrc: './img/characters/darkWitch/Idle.png',
        framesMax: 10
      },
      run: {
        imageSrc: './img/characters/darkWitch/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc: './img/characters/darkWitch/Jump.png',
        framesMax: 3
      },
      fall: {
        imageSrc: './img/characters/darkWitch/Fall.png',
        framesMax: 3
      },
      attack1: {
        imageSrc: './img/characters/darkWitch/Attack.png',
        framesMax: 13
      },
      attack2: {
        imageSrc: './img/characters/darkWitch/Attack.png',
        framesMax: 13
      },
      takeHit: {
        imageSrc: './img/characters/darkWitch/Get hit.png',
        framesMax: 3
      },
      death: {
        imageSrc: './img/characters/darkWitch/Death.png',
        framesMax: 18
      }
    }
  },
  {
    id: 'wizard',
    name: 'Wizard Chronos',
    face_right: true,
    scale: 2.5,
    drawOffset: { x: 270, y: 270 },
    attackHitFrame: 2,
    attackBox: {
      offset: { x: 100, y: 50 },
      width: 160,
      height: 50
    },
    stats: {
      maxHealth: 120,
      attackDamage: 25,
      moveSpeed: 4,
      jumpStrength: 18,
      maxJumps: 2,
      animFramesHold: 5,
      attackFramesHold: 5
    },
    sprites: {
      idle: {
        imageSrc: './img/characters/wizard/Idle.png',
        framesMax: 8
      },
      run: {
        imageSrc: './img/characters/wizard/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc: './img/characters/wizard/Jump.png',
        framesMax: 2
      },
      fall: {
        imageSrc: './img/characters/wizard/Fall.png',
        framesMax: 2
      },
      attack1: {
        imageSrc: './img/characters/wizard/Attack1.png',
        framesMax: 8
      },
      attack2: {
        imageSrc: './img/characters/wizard/Attack2.png',
        framesMax: 8
      },
      takeHit: {
        imageSrc: './img/characters/wizard/Take hit.png',
        framesMax: 3
      },
      death: {
        imageSrc: './img/characters/wizard/Death.png',
        framesMax: 7
      }
    } 
  },
  {
    id: 'knight',
    name: 'Heroine Reginald',
    face_right: true,
    scale: 2.5,
    drawOffset: { x: 230, y: 139 },
    attackHitFrame: 2,
    attackBox: {
      offset: { x: 100, y: 50 },
      width: 160,
      height: 50
    },
    stats: {
      maxHealth: 120,
      attackDamage: 25,
      moveSpeed: 4,
      jumpStrength: 18,
      maxJumps: 2,
      animFramesHold: 5,
      attackFramesHold: 5
    },
    sprites: {
      idle: {
        imageSrc: './img/characters/knight/Idle.png',
        framesMax: 11
      },
      run: {
        imageSrc: './img/characters/knight/Run.png',
        framesMax: 8
      },
      jump: {
        imageSrc: './img/characters/knight/Jump.png',
        framesMax: 3
      },
      fall: {
        imageSrc: './img/characters/knight/Fall.png',
        framesMax: 3
      },
      attack1: { imageSrc: './img/characters/knight/Attack1.png', framesMax: 7 },
      attack2: { imageSrc: './img/characters/knight/Attack2.png', framesMax: 7 },
      takeHit: { imageSrc: './img/characters/knight/Take Hit.png', framesMax: 4 },
      death: { imageSrc: './img/characters/knight/Death.png', framesMax: 11 }
    } 
  },
  {
    id: 'archer',
    name: 'Woodland Ranger',
    face_right: true,
    scale: 2.5,
    drawOffset: { x: 130, y: 12 },
    isMelee: false,
    projectile: {
      imageSrc: './img/characters/archer/projectile/Arrow move.png',
      framesMax: 2,
      scale: 2.5,
      spawnOffset: { x: 100, y: 75 },
      range: 800
    },
    attackHitFrame: 2,
    attackBox: { offset: { x: 100, y: 50 }, width: 160, height: 50 },
    stats: {
      maxHealth: 90,
      attackDamage: 15,
      moveSpeed: 5,
      jumpStrength: 18,
      maxJumps: 2,
      animFramesHold: 5,
      attackFramesHold: 5
    },
    sprites: {
      idle: { imageSrc: './img/characters/archer/character/Idle.png', framesMax: 10 },
      run: { imageSrc: './img/characters/archer/character/Run.png', framesMax: 8 },
      jump: { imageSrc: './img/characters/archer/character/Jump.png', framesMax: 2 },
      fall: { imageSrc: './img/characters/archer/character/Fall.png', framesMax: 2 },
      attack1: { imageSrc: './img/characters/archer/character/Attack.png', framesMax: 6 },
      attack2: { imageSrc: './img/characters/archer/character/Attack.png', framesMax: 6 },
      takeHit: { imageSrc: './img/characters/archer/character/Get Hit.png', framesMax: 3 },
      death: { imageSrc: './img/characters/archer/character/Death.png', framesMax: 10 }
    }
  },
  {
    id: 'huntress',
    name: 'Shadow Stalker',
    face_right: true,
    scale: 2.5,
    drawOffset: { x: 175, y: 95 },
    isMelee: true,
    projectile: {
      imageSrc: './img/characters/huntress/projectile/Spear move.png',
      framesMax: 4,
      scale: 2.5,
      attackState: 'attack2',
      spawnOffset: { x: 100, y: 18 },
      range: 400
    },
    attackHitFrame: 2,
    attackBox: { offset: { x: 100, y: 50 }, width: 160, height: 50 },
    stats: {
      maxHealth: 105,
      attackDamage: 22,
      moveSpeed: 6,
      jumpStrength: 19,
      maxJumps: 2,
      animFramesHold: 5,
      attackFramesHold: 5
    },
    sprites: {
      idle: { imageSrc: './img/characters/huntress/character/Idle.png', framesMax: 8 },
      run: { imageSrc: './img/characters/huntress/character/Run.png', framesMax: 8 },
      jump: { imageSrc: './img/characters/huntress/character/Jump.png', framesMax: 2 },
      fall: { imageSrc: './img/characters/huntress/character/Fall.png', framesMax: 2 },
      attack1: { imageSrc: './img/characters/huntress/character/Attack1.png', framesMax: 5 },
      attack2: { imageSrc: './img/characters/huntress/character/Attack3.png', framesMax: 7 },
      takeHit: { imageSrc: './img/characters/huntress/character/Take hit.png', framesMax: 3 },
      death: { imageSrc: './img/characters/huntress/character/Death.png', framesMax: 8 }
    }
  },
  {
    id: 'fantasyKnight',
    name: 'Arthur Pendragon',
    face_right: true,
    scale: 2.5,
    drawOffset: { x: 175, y: 100 },
    isMelee: true,
    attackHitFrame: 2,
    attackBox: { offset: { x: 100, y: 50 }, width: 160, height: 50 },
    stats: {
      maxHealth: 105,
      attackDamage: 22,
      moveSpeed: 6,
      jumpStrength: 19,
      maxJumps: 2,
      animFramesHold: 5,
      attackFramesHold: 5
    },
    sprites: {
      idle: { imageSrc: './img/characters/fantasyKnight/Idle.png', framesMax: 10 },
      run: { imageSrc: './img/characters/fantasyKnight/Run.png', framesMax: 8 },
      jump: { imageSrc: './img/characters/fantasyKnight/Jump.png', framesMax: 3 },
      fall: { imageSrc: './img/characters/fantasyKnight/Fall.png', framesMax: 3 },
      attack1: { imageSrc: './img/characters/fantasyKnight/Attack1.png', framesMax: 7 },
      attack2: { imageSrc: './img/characters/fantasyKnight/Attack3.png', framesMax: 8 },
      takeHit: { imageSrc: './img/characters/fantasyKnight/Take hit.png', framesMax: 3 },
      death: { imageSrc: './img/characters/fantasyKnight/Death.png', framesMax: 7 }
    }
  },
  {
    id: 'medievalKnight1',
    name: 'The Great Bob',
    face_right: true,
    scale: 1.8,
    drawOffset: { x: 175, y: 72 },
    isMelee: true,
    attackHitFrame: 2,
    attackBox: { offset: { x: 100, y: 50 }, width: 160, height: 50 },
    stats: {
      maxHealth: 105,
      attackDamage: 22,
      moveSpeed: 6,
      jumpStrength: 19,
      maxJumps: 2,
      animFramesHold: 5,
      attackFramesHold: 5
    },
    sprites: {
      idle: { imageSrc: './img/characters/medievalKnight1/Idle.png', framesMax: 6 },
      run: { imageSrc: './img/characters/medievalKnight1/Run.png', framesMax: 8 },
      jump: { imageSrc: './img/characters/medievalKnight1/Jump.png', framesMax: 2 },
      fall: { imageSrc: './img/characters/medievalKnight1/Fall.png', framesMax: 2 },
      attack1: { imageSrc: './img/characters/medievalKnight1/Attack1.png', framesMax: 4 },
      attack2: { imageSrc: './img/characters/medievalKnight1/Attack2.png', framesMax: 4 },
      takeHit: { imageSrc: './img/characters/medievalKnight1/Hit.png', framesMax: 3 },
      death: { imageSrc: './img/characters/medievalKnight1/Death.png', framesMax: 9 }
    }
  }
]

function getCharacterByIndex(index) {
  const i = ((index % CHARACTERS.length) + CHARACTERS.length) % CHARACTERS.length
  return CHARACTERS[i]
}

function buildSpritesForFighter(def) {
  const sprites = {}
  for (const key of Object.keys(def.sprites)) {
    sprites[key] = { ...def.sprites[key] }
  }
  return sprites
}

function createFighterFromDefinition(
  def,
  { position, velocity, color = 'red', flipX = false }
) {
  const idle = def.sprites.idle
  const stats = resolveCharacterStats(def)
  return new Fighter({
    position: { ...position },
    velocity: { ...velocity },
    color,
    imageSrc: idle.imageSrc,
    framesMax: idle.framesMax,
    scale: def.scale,
    offset: { ...def.drawOffset },
    sprites: buildSpritesForFighter(def),
    attackBox: {
      offset: { ...def.attackBox.offset },
      width: def.attackBox.width,
      height: def.attackBox.height
    },
    attackHitFrame: def.attackHitFrame,
    flipX,
    isMelee: def.isMelee !== false,
    projectileDef: def.projectile,
    maxHealth: stats.maxHealth,
    attackDamage: stats.attackDamage,
    moveSpeed: stats.moveSpeed,
    jumpStrength: stats.jumpStrength,
    maxJumps: stats.maxJumps,
    animFramesHold: stats.animFramesHold,
    attackFramesHold: stats.attackFramesHold
  })
}

/** Preview-only sprite (idle loop) for the character select screen. */
function createIdlePreviewSprite(def, position, flipX = false) {
  const idle = def.sprites.idle
  const stats = resolveCharacterStats(def)
  return new Sprite({
    position: { ...position },
    imageSrc: idle.imageSrc,
    scale: def.scale,
    framesMax: idle.framesMax,
    offset: { ...def.drawOffset },
    flipX,
    framesHold: stats.animFramesHold
  })
}
