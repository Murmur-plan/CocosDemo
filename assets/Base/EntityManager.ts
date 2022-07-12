import { _decorator, Component, Sprite, UITransform } from 'cc'
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Scripts/Tile/TileManager'
import {
  CONTROLER_ENUM,
  DIRECTION_ENUM,
  DIRECTION_NUMBER_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
  PARAMS_NAME_ENUM,
} from 'db://assets/Enums'
import { IEntity } from 'db://assets/Levels'
import { StateMachine } from 'db://assets/Base/StateMachine'
import { generateId } from 'db://assets/Scripts/Utils'

const { ccclass, property } = _decorator

@ccclass('EntityManager')
export class EntityManager extends Component {
  id: string = generateId(8)
  //位置信息
  x: number = 0
  y: number = 0
  //状态机
  fsm: StateMachine
  //角色方向
  private _direction: DIRECTION_ENUM
  //角色状态
  private _state: ENTITY_STATE_ENUM
  //角色类型
  type: ENTITY_TYPE_ENUM

  get direction() {
    return this._direction
  }

  set direction(newDirection: DIRECTION_ENUM) {
    this._direction = newDirection
    this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_NUMBER_ENUM[newDirection])
  }

  get state() {
    return this._state
  }

  set state(newState: ENTITY_STATE_ENUM) {
    this._state = newState
    this.fsm.setParams(newState, true)
  }

  init(params: IEntity) {
    const sprite = this.addComponent(Sprite)
    //自定义宽高
    sprite.sizeMode = Sprite.SizeMode.CUSTOM
    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.x = params.x
    this.y = params.y
    this.direction = params.direction
    this.state = params.state
    this.type = params.type
  }

  update() {
    //转换为实际坐标
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }

  onDisable() {}
}
