import { TILE_TYPE_ENUM } from 'db://assets/Enums'
import Level1 from 'db://assets/Levels/level1'
import Level2 from 'db://assets/Levels/level2'

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
