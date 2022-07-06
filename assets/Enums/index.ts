export enum TILE_TYPE_ENUM {
  WALL_ROW = 'WALL_ROW',
  WALL_COLUMN = 'WALL_COLUMN',
  WALL_LEFT_TOP = 'WALL_LEFT_TOP',
  WALL_LEFT_BOTTOM = 'WALL_LEFT_BOTTOM',
  WALL_RIGHT_TOP = 'WALL_RIGHT_TOP',
  WALL_RIGHT_BOTTOM = 'WALL_RIGHT_BOTTOM',
  CLIFF_CENTER = 'CLIFF_CENTER',
  CLIFF_RIGHT = 'CLIFF_RIGHT',
  CLIFF_LEFT = 'CLIFF_LEFT',
  FLOOR = 'FLOOR',
}

export enum EVENT_ENUM {
  NEXT_LEVEL = 'NEXT_LEVEL',
  PLAY_CONTROLER = 'PLAY_CONTROLER',
}

export enum CONTROLER_ENUM {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT',
}

export enum FSM_PARAMS_TYPE_ENUM {
  NUMBER = 'NUMBER',
  TRIGGER = 'TRIGGER',
}

export enum PARAMS_NAME_ENUM {
  IDLE = 'IDLE',
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT',
  DIRECTION = 'DIRECTION',
  BLOCK_FRONT = 'BLOCK_FRONT',
  BLOCK_TURN_LEFT = 'BLOCK_TURN_LEFT',
  BLOCK_TURN_RIGHT = 'BLOCK_TURN_RIGHT',
}

export enum DIRECTION_ENUM {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum ENTITY_STATE_ENUM {
  IDLE = 'IDLE',
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT',
  BLOCK_FRONT = 'BLOCK_FRONT',
  BLOCK_TURN_LEFT = 'BLOCK_TURN_LEFT',
  BLOCK_TURN_RIGHT = 'BLOCK_TURN_RIGHT',
}

export enum DIRECTION_NUMBER_ENUM {
  TOP = 0,
  BOTTOM = 1,
  LEFT = 2,
  RIGHT = 3,
}

export enum ENTITY_TYPE_ENUM {
  PLAYER = 'PLAYER',
}
