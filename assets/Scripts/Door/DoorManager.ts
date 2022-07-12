import { _decorator } from 'cc'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from 'db://assets/Enums'
import { EventManager } from 'db://assets/RunTime/EventManager'
import { EntityManager } from 'db://assets/Base/EntityManager'
import { DoorStateMachine } from 'db://assets/Scripts/Door/DoorStateMachine'
import { DataManager } from 'db://assets/RunTime/DataManager'

const { ccclass, property } = _decorator

@ccclass('DoorManager')
export class DoorManager extends EntityManager {
  onDisable() {
    super.onDisable()
    EventManager.Instance.off(EVENT_ENUM.DOOR_OPEN, this.onOpen, this)
    //设置当前瓦片地图可走
    const map = DataManager.Instance.tileInfo[this.x][this.y]
    map.moveable = true
    map.turnable = true
  }
  async init({ x, y }) {
    this.fsm = this.addComponent(DoorStateMachine)
    await this.fsm.init()
    super.init({
      x: x,
      y: y,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.DOOR,
    })
    EventManager.Instance.on(EVENT_ENUM.DOOR_OPEN, this.onOpen, this)
    //设置当前瓦片地图不可走
    const tile = DataManager.Instance.tileInfo[x][y]
    tile.moveable = false
    tile.turnable = false
  }

  private onOpen() {
    const enemies = DataManager.Instance.enemies
    if (this.state !== ENTITY_STATE_ENUM.DEATH && enemies.length == 0) {
      this.state = ENTITY_STATE_ENUM.DEATH
    }
  }
}
