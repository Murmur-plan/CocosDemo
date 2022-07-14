import { _decorator, Component, Sprite, UITransform } from 'cc'
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Scripts/Tile/TileManager'
import {
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
  PARAMS_NAME_ENUM,
  SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM,
} from 'db://assets/Enums'
import { ISpikes } from 'db://assets/Levels'
import { StateMachine } from 'db://assets/Base/StateMachine'
import { generateId } from 'db://assets/Scripts/Utils'
import { SpikesStateMachine } from 'db://assets/Scripts/Spikes/SpikesStateMachine'
import { EventManager } from 'db://assets/RunTime/EventManager'
import { DataManager } from 'db://assets/RunTime/DataManager'

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

  async init(params: ISpikes) {
    const sprite = this.addComponent(Sprite)
    //自定义宽高
    sprite.sizeMode = Sprite.SizeMode.CUSTOM
    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.fsm = this.addComponent(SpikesStateMachine)
    await this.fsm.init()
    this.x = params.x
    this.y = params.y
    this.type = params.type
    this.totalCount = SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[this.type]
    this.curCount = params.count

    EventManager.Instance.on(EVENT_ENUM.PLAY_MOVE_END, this.onLoop, this)
  }

  update() {
    //转换为实际坐标
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }

  onDisable() {
    EventManager.Instance.off(EVENT_ENUM.PLAY_MOVE_END, this.onLoop, this)
  }

  onLoop() {
    if (this.curCount === this.totalCount) {
      this.curCount = 1
    } else {
      this.curCount = this.curCount + 1
    }
    //拿到玩家
    const { x: playerX, y: playerY } = DataManager.Instance.player
    if (this.x === playerX && this.y === playerY && (this.curCount === 0 || this.curCount === this.totalCount)) {
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
    }
  }
}
