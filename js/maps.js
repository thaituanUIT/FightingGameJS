const MAPS = [
  {
    id: 'oakwoods',
    name: 'Oak Woods',
    background: {
      imageSrc: './img/maps/background.png'
    },
    spawn: {
      left: { x: '14%', y: '44%' },
      right: { x: '82%', y: '44%' }
    },
    layout: {
      groundTop: '87%',
      platforms: []
    },
    sprites: [
      // use this sprite definition format to add more sprites to the map
      // {
      //   imageSrc: './img/torch.png',
      //   position: { x: '30%', y: '70%' },
      //   scale: 1.5,
      //   framesMax: 6,
      //   framesHold: 8,
      //   animated: true
      // },
      {
        type: 'platform',
        imageSrc: './img/maps/oak_woods_tileset.png',
        position: { x: '16%', y: '64%' },
        width: '18%',
        height: '3%',
        crop: { x: 24, y: 0, width: 24, height: 24 }
      },
      {
        type: 'platform',
        imageSrc: './img/maps/oak_woods_tileset.png',
        position: { x: '42%', y: '55%' },
        width: '16%',
        height: '3%',
        crop: { x: 24, y: 0, width: 24, height: 24 }
      },
      {
        type: 'platform',
        imageSrc: './img/maps/oak_woods_tileset.png',
        position: { x: '68%', y: '64%' },
        width: '16%',
        height: '3%',
        crop: { x: 24, y: 0, width: 24, height: 24 }
      }
    ]
  },
  {
    id: 'snowyMountain',
    name: 'Snowy Mountain',
    background: {
      imageSrc: './img/maps/background_glacial_mountains.png'
    },
    spawn: {
      left: { x: '14%', y: '44%' },
      right: { x: '82%', y: '44%' }
    },
    layout: {
      groundTop: '87%',
      platforms: []
    },
    sprites: [
      // use this sprite definition format to add more sprites to the map
      // {
      //   imageSrc: './img/torch.png',
      //   position: { x: '30%', y: '70%' },
      //   scale: 1.5,
      //   framesMax: 6,
      //   framesHold: 8,
      //   animated: true
      // },
    ]
  },
  {
    id: 'vastMeadow',
    name: 'Vast Meadow',
    background: {
      imageSrc: './img/maps/Meadow 1.png'
    },
    spawn: {
      left: { x: '14%', y: '44%' },
      right: { x: '82%', y: '44%' }
    },
    layout: {
      groundTop: '87%',
      platforms: []
    },
    sprites: [
      // use this sprite definition format to add more sprites to the map
      // {
      //   imageSrc: './img/torch.png',
      //   position: { x: '30%', y: '70%' },
      //   scale: 1.5,
      //   framesMax: 6,
      //   framesHold: 8,
      //   animated: true
      // },
    ] 
  }
]

function getAllMaps() {
  return MAPS
}

function getMapCount() {
  return getAllMaps().length
}

function getMapById(id) {
  const allMaps = getAllMaps()
  const match = allMaps.find((map) => map.id === id)
  return match || allMaps[0]
}

function getMapByIndex(index) {
  const allMaps = getAllMaps()
  const i = ((index % allMaps.length) + allMaps.length) % allMaps.length
  return allMaps[i]
}

function resolveLength(value, axisSize, viewportWidth, viewportHeight) {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const trimmed = value.trim().toLowerCase()
    const parsed = parseFloat(trimmed)
    if (Number.isNaN(parsed)) return 0
    if (trimmed.endsWith('px')) return parsed
    if (trimmed.endsWith('%')) return (parsed / 100) * axisSize
    if (trimmed.endsWith('vw')) return (parsed / 100) * viewportWidth
    if (trimmed.endsWith('vh')) return (parsed / 100) * viewportHeight
    return parsed
  }
  if (value && typeof value === 'object') {
    const raw = Number(value.value ?? 0)
    const unit = String(value.unit || 'px').toLowerCase()
    if (unit === 'px') return raw
    if (unit === '%') return (raw / 100) * axisSize
    if (unit === 'vw') return (raw / 100) * viewportWidth
    if (unit === 'vh') return (raw / 100) * viewportHeight
    return raw
  }
  return 0
}

function scaleRect(rect, canvas) {
  return {
    x: resolveLength(rect.x ?? 0, canvas.width, canvas.width, canvas.height),
    y: resolveLength(rect.y ?? 0, canvas.height, canvas.width, canvas.height),
    width: resolveLength(
      rect.width ?? 0,
      canvas.width,
      canvas.width,
      canvas.height
    ),
    height: resolveLength(
      rect.height ?? 0,
      canvas.height,
      canvas.width,
      canvas.height
    )
  }
}

function resolvePoint(point, canvas) {
  return {
    x: resolveLength(point?.x ?? 0, canvas.width, canvas.width, canvas.height),
    y: resolveLength(point?.y ?? 0, canvas.height, canvas.width, canvas.height)
  }
}

function normalizeMapDef(mapDef) {
  const spawn = mapDef.spawn || {
    left: { x: '14%', y: '45%' },
    right: { x: '82%', y: '45%' }
  }

  return {
    ...mapDef,
    spawn,
    background: mapDef.background || null,
    layout: {
      groundTop: mapDef.layout?.groundTop ?? '84%',
      platforms: mapDef.layout?.platforms || []
    },
    sprites: mapDef.sprites || []
  }
}

function buildMapRuntime(mapDef, canvas) {
  const normalizedMap = normalizeMapDef(mapDef)
  const groundTop = resolveLength(
    normalizedMap.layout.groundTop,
    canvas.height,
    canvas.width,
    canvas.height
  )
  const groundSurface = {
    type: 'ground',
    x: 0,
    y: groundTop,
    width: canvas.width,
    height: canvas.height - groundTop
  }
  const platforms = normalizedMap.layout.platforms.map((p) => ({
    type: 'platform',
    ...scaleRect(p, canvas)
  }))
  const spritePlatforms = normalizedMap.sprites
    .filter((def) => def.type === 'platform')
    .map((def) => ({
      type: 'platform',
      ...scaleRect({
        x: def.position?.x ?? 0,
        y: def.position?.y ?? 0,
        width: def.width ?? 0,
        height: def.height ?? 0
      }, canvas)
    }))
  const backgroundSprite = normalizedMap.background
    ? new Sprite({
      position: { x: 0, y: 0 },
      imageSrc: normalizedMap.background.imageSrc
    })
    : null
  const mapSprites = normalizedMap.sprites
    .filter((spriteDef) => spriteDef && spriteDef.imageSrc)
    .map((spriteDef) => {
      const sprite = new Sprite({
        position: { x: 0, y: 0 },
        imageSrc: spriteDef.imageSrc,
        scale: spriteDef.scale ?? 1,
        framesMax: spriteDef.framesMax ?? 1,
        offset: spriteDef.offset || { x: 0, y: 0 },
        flipX: spriteDef.flipX ?? false,
        framesHold: spriteDef.framesHold ?? 5,
        crop: spriteDef.crop || null
      })
      return {
        def: spriteDef,
        sprite
      }
    })

  return {
    def: normalizedMap,
    spawn: {
      left: resolvePoint(normalizedMap.spawn.left, canvas),
      right: resolvePoint(normalizedMap.spawn.right, canvas)
    },
    walkableSurfaces: [groundSurface, ...platforms, ...spritePlatforms],
    draw() {
      if (
        backgroundSprite &&
        backgroundSprite.image.complete &&
        backgroundSprite.image.naturalWidth
      ) {
        const imageWidth = backgroundSprite.image.naturalWidth
        const imageHeight = backgroundSprite.image.naturalHeight
        const coverScale = Math.max(
          canvas.width / imageWidth,
          canvas.height / imageHeight
        )
        const drawWidth = imageWidth * coverScale
        const drawHeight = imageHeight * coverScale
        backgroundSprite.scale = coverScale
        backgroundSprite.position.x = (canvas.width - drawWidth) / 2
        backgroundSprite.position.y = (canvas.height - drawHeight) / 2
        backgroundSprite.draw()
      } else {
        c.fillStyle = 'black'
        c.fillRect(0, 0, canvas.width, canvas.height)
      }

      mapSprites.forEach(({ def, sprite }) => {
        sprite.position = resolvePoint(def.position || { x: 0, y: 0 }, canvas)
        if (def.width !== undefined) {
          sprite.drawWidth = resolveLength(def.width, canvas.width, canvas.width, canvas.height)
        }
        if (def.height !== undefined) {
          sprite.drawHeight = resolveLength(def.height, canvas.height, canvas.width, canvas.height)
        }
        sprite.draw()
        if (sprite.framesMax > 1 && def.animated !== false) {
          sprite.animateFrames()
        }
      })

      // Keep stage collisions active without rendering helper geometry.
    }
  }
}
