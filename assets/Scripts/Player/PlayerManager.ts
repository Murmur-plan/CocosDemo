import { _decorator } from 'cc'
import { CONTROLER_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from 'db://assets/Enums'
import { EventManager } from 'db://assets/RunTime/EventManager'
import { PlayerStateMachine } from 'db://assets/Scripts/Player/PlayerStateMachine'
import { EntityManager } from 'db://assets/Base/EntityManager'
import { DataManager } from 'db://assets/RunTime/DataManager'
import { TileManager } from 'db://assets/Scripts/Tile/TileManager'

const { ccclass, property } = _decorator

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
  targetX: number = 0
  targetY: number = 0
  private isMove = false
  private readonly speed = 1 / 10

  async init() {
    this.fsm = this.addComponent(PlayerStateMachine)
    await this.fsm.init()
    super.init({
      x: 2,
      y: 8,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.PLAYER,
    })
    this.targetY = this.y
    this.targetX = this.x
    this.direction = DIRECTION_ENUM.TOP
    this.state = ENTITY_STATE_ENUM.IDLE
    EventManager.Instance.on(EVENT_ENUM.PLAY_CONTROLER, this.inputHandle, this)
    EventManager.Instance.on(EVENT_ENUM.ATTACK_PLAYER, this.attacked, this)
  }

  update() {
    this.updateXY()
    super.update()
  }

  updateXY() {
    if (this.targetX < this.x) {
      this.x -= this.speed
    } else if (this.targetX > this.x) {
      this.x += this.speed
    }

    if (this.targetY < this.y) {
      this.y -= this.speed
    } else if (this.targetY > this.y) {
      this.y += this.speed
    }

    if (Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y) <= 0.1 && this.isMove) {
      this.isMove = false
      this.x = this.targetX
      this.y = this.targetY
      EventManager.Instance.emit(EVENT_ENUM.PLAY_MOVE_END)
    }
  }

  inputHandle(inputDirection: CONTROLER_ENUM) {
    if (this.isMove || this.state === ENTITY_STATE_ENUM.ATTACK) {
      return
    }
    if (this.state === ENTITY_STATE_ENUM.DEATH) {
      return
    }
    //是否可以攻击敌人
    if (this.willAttack(inputDirection)) {
      return
    }
    if (this.willBlock(inputDirection)) {
      return
    }
    this.move(inputDirection)
  }

  private willAttack(inputDirection: CONTROLER_ENUM) {
    //面向和要走的方向相同才能攻击
    if (inputDirection.toString() != this.direction.toString()) {
      return false
    }
    let isAttack = false
    //拿到所有敌人
    const enemies = DataManager.Instance.enemies
    for (let i = 0; i < enemies.length; i++) {
      const { x: enemyX, y: enemyY, state: enemyState, id: enemyId } = enemies[i]
      if (enemyState == ENTITY_STATE_ENUM.DEATH) {
        continue
      }
      switch (inputDirection) {
        case CONTROLER_ENUM.TOP:
          if (this.x === enemyX && this.targetY === enemyY + 2) {
            isAttack = true
          }
          break
        case CONTROLER_ENUM.BOTTOM:
          if (this.x === enemyX && this.targetY === enemyY - 2) {
            isAttack = true
          }
          break
        case CONTROLER_ENUM.LEFT:
          if (this.targetX === enemyX + 2 && this.y === enemyY) {
            isAttack = true
          }
          break
        case CONTROLER_ENUM.RIGHT:
          if (this.targetX === enemyX - 2 && this.y === enemyY) {
            isAttack = true
          }
      }
      if (isAttack) {
        this.state = ENTITY_STATE_ENUM.ATTACK
        EventManager.Instance.emit(EVENT_ENUM.ATTACK_ENEMY, enemyId)
        break
      }
    }
    return isAttack
  }

  move(inputDirection: CONTROLER_ENUM) {
    this.isMove = true
    switch (inputDirection) {
      case CONTROLER_ENUM.TOP:
        this.targetY -= 1
        break
      case CONTROLER_ENUM.BOTTOM:
        this.targetY += 1
        break
      case CONTROLER_ENUM.LEFT:
        this.targetX -= 1
        break
      case CONTROLER_ENUM.RIGHT:
        this.targetX += 1
        break
      case CONTROLER_ENUM.TURN_LEFT:
        if (this.direction === DIRECTION_ENUM.TOP) {
          this.direction = DIRECTION_ENUM.LEFT
        } else if (this.direction === DIRECTION_ENUM.LEFT) {
          this.direction = DIRECTION_ENUM.BOTTOM
        } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
          this.direction = DIRECTION_ENUM.RIGHT
        } else if (this.direction === DIRECTION_ENUM.RIGHT) {
          this.direction = DIRECTION_ENUM.TOP
        }
        this.state = ENTITY_STATE_ENUM.TURN_LEFT
        EventManager.Instance.emit(EVENT_ENUM.PLAY_MOVE_END)
        break
      case CONTROLER_ENUM.TURN_RIGHT:
        if (this.direction === DIRECTION_ENUM.TOP) {
          this.direction = DIRECTION_ENUM.RIGHT
        } else if (this.direction === DIRECTION_ENUM.RIGHT) {
          this.direction = DIRECTION_ENUM.BOTTOM
        } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
          this.direction = DIRECTION_ENUM.LEFT
        } else if (this.direction === DIRECTION_ENUM.LEFT) {
          this.direction = DIRECTION_ENUM.TOP
        }
        this.state = ENTITY_STATE_ENUM.TURN_RIGHT
        EventManager.Instance.emit(EVENT_ENUM.PLAY_MOVE_END)
        break
      default:
        break
    }
  }

  //检测碰撞 true 有碰撞 false 无碰撞
  private willBlock(inputDirection: CONTROLER_ENUM) {
    //拿到角色信息
    const { targetX: x, targetY: y, direction } = this
    //拿到当前地图信息
    const { tileInfo } = DataManager.Instance

    switch (direction) {
      //方向向上
      case DIRECTION_ENUM.TOP:
        //判断按键
        switch (inputDirection) {
          case CONTROLER_ENUM.BOTTOM:
            return this.checkMoveBlock(tileInfo[x][y], tileInfo[x][y + 1], ENTITY_STATE_ENUM.BLOCK_FRONT)
          case CONTROLER_ENUM.LEFT:
            return this.checkMoveBlock(tileInfo[x - 1][y - 1], tileInfo[x - 1][y], ENTITY_STATE_ENUM.BLOCK_FRONT)
          case CONTROLER_ENUM.RIGHT:
            return this.checkMoveBlock(tileInfo[x + 1][y - 1], tileInfo[x + 1][y], ENTITY_STATE_ENUM.BLOCK_FRONT)
          case CONTROLER_ENUM.TOP:
            return this.checkMoveBlock(tileInfo[x][y - 2], tileInfo[x][y - 1], ENTITY_STATE_ENUM.BLOCK_FRONT)
          case CONTROLER_ENUM.TURN_LEFT:
            return this.checkTurnBlock(tileInfo[x - 1][y - 1], tileInfo[x - 1][y], ENTITY_STATE_ENUM.BLOCK_TURN_LEFT)
          case CONTROLER_ENUM.TURN_RIGHT:
            return this.checkTurnBlock(tileInfo[x + 1][y - 1], tileInfo[x + 1][y], ENTITY_STATE_ENUM.BLOCK_TURN_RIGHT)
        }
        break
      case DIRECTION_ENUM.BOTTOM:
        //判断按键
        switch (inputDirection) {
          case CONTROLER_ENUM.BOTTOM:
            return this.checkMoveBlock(tileInfo[x][y + 2], tileInfo[x][y + 1], ENTITY_STATE_ENUM.BLOCK_FRONT)
          case CONTROLER_ENUM.LEFT:
            return this.checkMoveBlock(tileInfo[x - 1][y + 1], tileInfo[x - 1][y], ENTITY_STATE_ENUM.BLOCK_FRONT)
          case CONTROLER_ENUM.RIGHT:
            return this.checkMoveBlock(tileInfo[x + 1][y + 1], tileInfo[x + 1][y], ENTITY_STATE_ENUM.BLOCK_FRONT)
          case CONTROLER_ENUM.TOP:
            return this.checkMoveBlock(tileInfo[x][y], tileInfo[x][y - 1], ENTITY_STATE_ENUM.BLOCK_FRONT)
          case CONTROLER_ENUM.TURN_LEFT:
            return this.checkTurnBlock(tileInfo[x + 1][y + 1], tileInfo[x + 1][y], ENTITY_STATE_ENUM.BLOCK_TURN_LEFT)
          case CONTROLER_ENUM.TURN_RIGHT:
            return this.checkTurnBlock(tileInfo[x - 1][y + 1], tileInfo[x - 1][y], ENTITY_STATE_ENUM.BLOCK_TURN_RIGHT)
        }
        break
      case DIRECTION_ENUM.LEFT:
        //判断按键
        switch (inputDirection) {
          case CONTROLER_ENUM.BOTTOM:
            return this.checkMoveBlock(tileInfo[x - 1][y + 1], tileInfo[x][y + 1], ENTITY_STATE_ENUM.BLOCK_FRONT)
          case CONTROLER_ENUM.LEFT:
            return this.checkMoveBlock(tileInfo[x - 2][y], tileInfo[x - 1][y], ENTITY_STATE_ENUM.BLOCK_FRONT)
          case CONTROLER_ENUM.RIGHT:
            return this.checkMoveBlock(tileInfo[x][y], tileInfo[x + 1][y], ENTITY_STATE_ENUM.BLOCK_FRONT)
          case CONTROLER_ENUM.TOP:
            return this.checkMoveBlock(tileInfo[x - 1][y - 1], tileInfo[x][y - 1], ENTITY_STATE_ENUM.BLOCK_FRONT)
          case CONTROLER_ENUM.TURN_LEFT:
            return this.checkTurnBlock(tileInfo[x - 1][y + 1], tileInfo[x][y + 1], ENTITY_STATE_ENUM.BLOCK_TURN_LEFT)
          case CONTROLER_ENUM.TURN_RIGHT:
            return this.checkTurnBlock(tileInfo[x - 1][y - 1], tileInfo[x][y - 1], ENTITY_STATE_ENUM.BLOCK_TURN_RIGHT)
        }
        break
      case DIRECTION_ENUM.RIGHT:
        //判断按键
        switch (inputDirection) {
          case CONTROLER_ENUM.BOTTOM:
            return this.checkMoveBlock(tileInfo[x + 1][y + 1], tileInfo[x][y + 1], ENTITY_STATE_ENUM.BLOCK_FRONT)
          case CONTROLER_ENUM.LEFT:
            return this.checkMoveBlock(tileInfo[x][y], tileInfo[x - 1][y], ENTITY_STATE_ENUM.BLOCK_FRONT)
          case CONTROLER_ENUM.RIGHT:
            return this.checkMoveBlock(tileInfo[x + 2][y], tileInfo[x + 1][y], ENTITY_STATE_ENUM.BLOCK_FRONT)
          case CONTROLER_ENUM.TOP:
            return this.checkMoveBlock(tileInfo[x + 1][y - 1], tileInfo[x][y - 1], ENTITY_STATE_ENUM.BLOCK_FRONT)
          case CONTROLER_ENUM.TURN_LEFT:
            return this.checkTurnBlock(tileInfo[x + 1][y - 1], tileInfo[x][y - 1], ENTITY_STATE_ENUM.BLOCK_TURN_LEFT)
          case CONTROLER_ENUM.TURN_RIGHT:
            return this.checkTurnBlock(tileInfo[x + 1][y + 1], tileInfo[x][y + 1], ENTITY_STATE_ENUM.BLOCK_TURN_RIGHT)
        }
        break
    }
    return false
  }

  checkMoveBlock(armsTarget: TileManager, playerTarget: TileManager, state: ENTITY_STATE_ENUM): boolean {
    if (!armsTarget || !armsTarget.turnable || !playerTarget || !playerTarget.moveable) {
      this.state = state
      return true
    }
    return false
  }

  checkTurnBlock(armsTarget: TileManager, armsPassTarget: TileManager, state: ENTITY_STATE_ENUM): boolean {
    if (!armsTarget || !armsTarget.turnable || !armsPassTarget || !armsPassTarget.turnable) {
      this.state = state
      return true
    }
    return false
  }

  //主角死亡
  attacked(type: ENTITY_STATE_ENUM) {
    if (type === ENTITY_STATE_ENUM.DEATH) {
      this.state = ENTITY_STATE_ENUM.DEATH
    }
  }
}
