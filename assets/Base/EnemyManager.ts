import { _decorator } from 'cc'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from 'db://assets/Enums'
import { EventManager } from 'db://assets/RunTime/EventManager'
import { EntityManager } from 'db://assets/Base/EntityManager'
import { DataManager } from 'db://assets/RunTime/DataManager'
import { IEntity } from 'db://assets/Levels'

const { ccclass, property } = _decorator

@ccclass('EnemyManager')
export class EnemyManager extends EntityManager {
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
    EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDeath, this)
    //设置当前瓦片地图可走
    const map = DataManager.Instance.tileInfo[this.x][this.y]
    map.moveable = true
    map.turnable = true
  }
  async init(params: IEntity) {
    super.init(params)
    this.direction = DIRECTION_ENUM.TOP
    this.state = ENTITY_STATE_ENUM.IDLE
    EventManager.Instance.on(EVENT_ENUM.PLAY_BIRTH, this.onChangeDirection, this)
    EventManager.Instance.on(EVENT_ENUM.PLAY_MOVE_END, this.onChangeDirection, this)
    EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDeath, this)
    this.onChangeDirection(true)
    //设置当前瓦片地图不可走
    const map = DataManager.Instance.tileInfo[this.x][this.y]
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

  private onDeath(id: string) {
    if (id === this.id && this.state != ENTITY_STATE_ENUM.DEATH) {
      this.state = ENTITY_STATE_ENUM.DEATH
    }
  }
}
