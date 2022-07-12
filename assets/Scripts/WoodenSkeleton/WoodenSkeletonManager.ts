import { _decorator } from 'cc'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from 'db://assets/Enums'
import { EventManager } from 'db://assets/RunTime/EventManager'
import { EntityManager } from 'db://assets/Base/EntityManager'
import { WoondenSkeletonStateMachine } from 'db://assets/Scripts/WoodenSkeleton/WoodenSkeletonStateMachine'
import { DataManager } from 'db://assets/RunTime/DataManager'

const { ccclass, property } = _decorator

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EntityManager {
  onDisable() {
    super.onDisable()
    const enemies = DataManager.Instance.enemies
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i]
      if (enemy.id === this.id) {
        enemies.splice(i, 1)
        break
      }
    }
    EventManager.Instance.off(EVENT_ENUM.PLAY_BIRTH, this.onChangeDirection, this)
    EventManager.Instance.off(EVENT_ENUM.PLAY_MOVE_END, this.onChangeDirection, this)
    EventManager.Instance.off(EVENT_ENUM.PLAY_MOVE_END, this.onAttack, this)
    EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDeath, this)
    //设置当前瓦片地图可走
    const map = DataManager.Instance.tileInfo[this.x][this.y]
    map.moveable = true
    map.turnable = true
  }
  async init({ x, y }) {
    this.fsm = this.addComponent(WoondenSkeletonStateMachine)
    await this.fsm.init()
    super.init({
      x: x,
      y: y,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.ENEMY,
    })
    this.direction = DIRECTION_ENUM.TOP
    this.state = ENTITY_STATE_ENUM.IDLE
    EventManager.Instance.on(EVENT_ENUM.PLAY_BIRTH, this.onChangeDirection, this)
    EventManager.Instance.on(EVENT_ENUM.PLAY_MOVE_END, this.onChangeDirection, this)
    EventManager.Instance.on(EVENT_ENUM.PLAY_MOVE_END, this.onAttack, this)
    EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDeath, this)
    this.onChangeDirection(true)
    //设置当前瓦片地图不可走
    const map = DataManager.Instance.tileInfo[x][y]
    map.moveable = false
    map.turnable = false
  }

  private onChangeDirection(isInit: boolean = false) {
    if (!DataManager.Instance.palyer || this.state === ENTITY_STATE_ENUM.DEATH) {
      return
    }
    const { x: playerX, y: playerY } = DataManager.Instance.palyer
    //x轴距离
    const disX = Math.abs(this.x - playerX)
    //y轴距离
    const disY = Math.abs(this.y - playerY)

    if (!isInit && disY === disX) {
      return
    }

    //判断玩家在怪物的第几象限
    //第一象限
    if (playerX >= this.x && playerY <= this.y) {
      this.direction = disX > disY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.TOP
      //第二象限
    } else if (playerX <= this.x && playerY <= this.y) {
      this.direction = disX > disY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.TOP
      //第三象限
    } else if (playerX <= this.x && playerY >= this.y) {
      this.direction = disX > disY ? DIRECTION_ENUM.LEFT : DIRECTION_ENUM.BOTTOM
      //第四象限
    } else if (playerX >= this.x && playerY >= this.y) {
      this.direction = disX > disY ? DIRECTION_ENUM.RIGHT : DIRECTION_ENUM.BOTTOM
    } else {
      this.direction = DIRECTION_ENUM.TOP
    }
  }

  onAttack() {
    if (!DataManager.Instance.palyer || this.state === ENTITY_STATE_ENUM.DEATH) {
      return
    }
    const { x: playerX, y: playerY, state: playState } = DataManager.Instance.palyer

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

  private onDeath(id: string) {
    if (id === this.id && this.state != ENTITY_STATE_ENUM.DEATH) {
      this.state = ENTITY_STATE_ENUM.DEATH
    }
  }
}
