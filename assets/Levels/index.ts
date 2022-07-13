import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from 'db://assets/Enums'
import Level1 from 'db://assets/Levels/level1'
import Level2 from 'db://assets/Levels/level2'
import Level3 from 'db://assets/Levels/level3'
import Level4 from 'db://assets/Levels/level4'
import Level5 from 'db://assets/Levels/level5'
import Level6 from 'db://assets/Levels/level6'
import Level7 from 'db://assets/Levels/level7'
import Level8 from 'db://assets/Levels/level8'
import Level9 from 'db://assets/Levels/level9'
import Level10 from 'db://assets/Levels/level10'
import Level11 from 'db://assets/Levels/level11'
import Level12 from 'db://assets/Levels/level12'
import Level13 from 'db://assets/Levels/level13'
import Level14 from 'db://assets/Levels/level14'
import Level15 from 'db://assets/Levels/level15'
import Level16 from 'db://assets/Levels/level16'
import Level17 from 'db://assets/Levels/level17'
import Level18 from 'db://assets/Levels/level18'
import Level19 from 'db://assets/Levels/level19'
import Level20 from 'db://assets/Levels/level20'
import Level21 from 'db://assets/Levels/level21'

export interface IEntity {
  x: number
  y: number
  state: ENTITY_STATE_ENUM
  direction: DIRECTION_ENUM
  type: ENTITY_TYPE_ENUM
}

export interface ISpikes {
  x: number
  y: number
  count: number
  type: ENTITY_TYPE_ENUM
}

export interface ITile {
  src: number | null
  type: TILE_TYPE_ENUM | null
}

export interface ILevel {
  mapInfo: Array<Array<ITile>>
  player: IEntity
  enemies: IEntity[]
  spikes: ISpikes[]
  bursts: IEntity[]
  door: IEntity
}

const Levels: Record<string, ILevel> = {
  Level1,
  Level2,
  Level3,
  Level4,
  Level5,
  Level6,
  Level7,
  Level8,
  Level9,
  Level10,
  Level11,
  Level12,
  Level13,
  Level14,
  Level15,
  Level16,
  Level17,
  Level18,
  Level19,
  Level20,
  Level21,
}

export default Levels
