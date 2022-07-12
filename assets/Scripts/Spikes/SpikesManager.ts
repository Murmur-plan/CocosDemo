import { _decorator, Component, Sprite, UITransform } from 'cc'
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Scripts/Tile/TileManager'
import {
  DIRECTION_ENUM,
  DIRECTION_NUMBER_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  PARAMS_NAME_ENUM,
} from 'db://assets/Enums'
import { IEntity } from 'db://assets/Levels'
import { StateMachine } from 'db://assets/Base/StateMachine'
import { generateId } from 'db://assets/Scripts/Utils'

const { ccclass, property } = _decorator

@ccclass('SpikesManager')
export class SpikesManager extends Component {
  id: string = generateId(8)
  //位置信息
  x: number = 0
  y: number = 0
  //状态机
  fsm: StateMachine
  //当前点数
  private _curCount: number
  //总
  private _totalCount: number
  //角色类型
  type: ENTITY_TYPE_ENUM

  get curCount() {
    return this._curCount
  }

  set curCount(newCount: number) {
    this._curCount = newCount
    this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, newCount)
  }

  get totalCount() {
    return this._totalCount
  }

  set totalCount(newCount: number) {
    this._totalCount = newCount
    this.fsm.setParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, newCount)
  }

  init(params: IEntity) {
    const sprite = this.addComponent(Sprite)
    //自定义宽高
    sprite.sizeMode = Sprite.SizeMode.CUSTOM
    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.x = params.x
    this.y = params.y
    this.type = params.type
  }

  update() {
    //转换为实际坐标
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }

  onDisable() {}
}
