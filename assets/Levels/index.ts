import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from 'db://assets/Enums'
import Level1 from 'db://assets/Levels/level1'
import Level2 from 'db://assets/Levels/level2'

export interface IEntity {
  x: number
  y: number
  state: ENTITY_STATE_ENUM
  direction: DIRECTION_ENUM
  type: ENTITY_TYPE_ENUM
}

export interface ITile {
  src: number | null
  type: TILE_TYPE_ENUM | null
}

export interface ILevel {
  mapInfo: Array<Array<ITile>>
}

const Levels: Record<string, ILevel> = {
  Level1,
  Level2,
}

export default Levels
