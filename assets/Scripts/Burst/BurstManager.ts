import { _decorator, UITransform, Sprite } from 'cc'
import { IEntity } from 'db://assets/Levels'
import { EntityManager } from 'db://assets/Base/EntityManager'
import { BurstStateMachine } from 'db://assets/Scripts/Burst/BurstStateMachine'
import { TILE_HEIGHT, TILE_WIDTH, TileManager } from 'db://assets/Scripts/Tile/TileManager'
import { EventManager } from 'db://assets/RunTime/EventManager'
import { CONTROLER_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from 'db://assets/Enums'
import { DataManager } from 'db://assets/RunTime/DataManager'

const { ccclass, property } = _decorator

@ccclass('BurstManager')
export class BurstManager extends EntityManager {
  onDisable() {
    super.onDisable()
    const bursts = DataManager.Instance.bursts
    for (let i = 0; i < bursts.length; i++) {
      const burst = bursts[i]
      if (burst.id === this.id) {
        bursts.splice(i, 1)
        break
      }
    }
    EventManager.Instance.off(EVENT_ENUM.PLAY_MOVE_END, this.onBurst, this)
    const tile = DataManager.Instance.tileInfo[this.x][this.y]
    tile.moveable = false
    tile.turnable = true
  }

  async init(params: IEntity) {
    this.fsm = this.addComponent(BurstStateMachine)
    await this.fsm.init()
    super.init(params)
    //自定义宽高
    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH, TILE_HEIGHT)
    EventManager.Instance.on(EVENT_ENUM.PLAY_MOVE_END, this.onBurst, this)
    //设置当前瓦片地图为空
    let tile = DataManager.Instance.tileInfo[this.x][this.y]
    if (!tile) {
      tile = new TileManager()
      DataManager.Instance.tileInfo[this.x][this.y] = tile
    } else {
      const sprite = tile.getComponent(Sprite)
      sprite.spriteFrame = null
    }
    tile.moveable = true
    tile.turnable = true
  }

  update() {
    //转换为实际坐标
    this.node.setPosition(this.x * TILE_WIDTH, -this.y * TILE_HEIGHT)
  }

  private onBurst() {
    if (this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.palyer) {
      return
    }
    const { x: playerX, y: playerY } = DataManager.Instance.palyer
    if (playerX === this.x && playerY === this.y && this.state === ENTITY_STATE_ENUM.IDLE) {
      this.state = ENTITY_STATE_ENUM.ATTACK
    } else if (this.state === ENTITY_STATE_ENUM.ATTACK) {
      this.state = ENTITY_STATE_ENUM.DEATH
      EventManager.Instance.emit(EVENT_ENUM.SCREEN_SHAKE, CONTROLER_ENUM.BOTTOM)
      if (playerX === this.x && playerY === this.y) {
        EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.AIR_DEATH)
      }
    }
  }
}
