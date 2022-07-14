import { _decorator } from 'cc'
import { ENTITY_STATE_ENUM, EVENT_ENUM } from 'db://assets/Enums'
import { EventManager } from 'db://assets/RunTime/EventManager'
import { WoondenSkeletonStateMachine } from 'db://assets/Scripts/WoodenSkeleton/WoodenSkeletonStateMachine'
import { DataManager } from 'db://assets/RunTime/DataManager'
import { EnemyManager } from 'db://assets/Base/EnemyManager'
import { IEntity } from 'db://assets/Levels'

const { ccclass, property } = _decorator

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EnemyManager {
  onDisable() {
    super.onDisable()
    EventManager.Instance.off(EVENT_ENUM.PLAY_MOVE_END, this.onAttack, this)
  }
  async init(params: IEntity) {
    this.fsm = this.addComponent(WoondenSkeletonStateMachine)
    await this.fsm.init()
    super.init(params)
    EventManager.Instance.on(EVENT_ENUM.PLAY_MOVE_END, this.onAttack, this)
  }

  onAttack() {
    if (!DataManager.Instance.player || this.state === ENTITY_STATE_ENUM.DEATH) {
      return
    }
    const { x: playerX, y: playerY, state: playState } = DataManager.Instance.player

    if (
      (this.x === playerX && Math.abs(this.y - playerY) <= 1) ||
      (this.y === playerY && Math.abs(this.x - playerX) <= 1 && playState != ENTITY_STATE_ENUM.DEATH)
    ) {
      this.state = ENTITY_STATE_ENUM.ATTACK
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
    } else {
      this.state = ENTITY_STATE_ENUM.IDLE
    }
  }
}
