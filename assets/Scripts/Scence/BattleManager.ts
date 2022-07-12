import { _decorator, Component, Node } from 'cc'
import { TileMapManager } from 'db://assets/Scripts/Tile/TileMapManager'
import { createUINode } from 'db://assets/Scripts/Utils'
import Levels, { ILevel } from 'db://assets/Levels'
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Scripts/Tile/TileManager'
import { DataManager } from 'db://assets/RunTime/DataManager'
import { EventManager } from 'db://assets/RunTime/EventManager'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from 'db://assets/Enums'
import { PlayerManager } from 'db://assets/Scripts/Player/PlayerManager'
import { WoodenSkeletonManager } from 'db://assets/Scripts/WoodenSkeleton/WoodenSkeletonManager'
import { DoorManager } from 'db://assets/Scripts/Door/DoorManager'
import { IronSkeletonManager } from 'db://assets/Scripts/IronSkeleton/IronSkeletonManager'
import { BurstManager } from 'db://assets/Scripts/Burst/BurstManager'

const { ccclass, property } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  level: ILevel
  stage: Node

  start() {
    this.generateStage()
    this.initLevel()
  }

  onLoad() {
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
  }

  // update(deltaTime: number) {
  //
  // }

  //生成舞台
  generateStage() {
    //创建舞台
    this.stage = createUINode()
    //舞台在当前节点下
    this.stage.setParent(this.node)
  }

  //初始化关卡
  async initLevel() {
    const level = Levels[`Level${DataManager.Instance.levelIndex}`]
    if (level) {
      DataManager.Instance.reset()
      this.level = level
      //存到数据中心
      DataManager.Instance.mapInfo = this.level.mapInfo
      DataManager.Instance.mapRowCount = this.level.mapInfo.length || 0
      DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length || 0
      //初始化地图
      await this.generateTileMap()
      //初始化角色
      await this.generatePlayer(2, 8)
      //初始化敌人
      await this.generateWoodenSkeleton(2, 4)
      await this.generateIronSkeleton(7, 7)
      //初始化门
      await this.generateDoor(7, 8)
      await this.generateBurst(2, 7)
    }
  }
  //下一关
  nextLevel() {
    DataManager.Instance.levelIndex++
    this.clearLevel()
    this.initLevel()
  }
  //清空当前关卡
  clearLevel() {
    this.stage.destroyAllChildren()
  }

  //生成地图
  async generateTileMap() {
    //创建瓦片地图
    const tileMap = createUINode()
    //瓦片地图在舞台上生成
    tileMap.setParent(this.stage)
    //添加组件-具体执行脚本
    const tileMapManager = tileMap.addComponent(TileMapManager)
    await tileMapManager.init()

    this.adaptPos()
  }

  //适配屏幕
  private adaptPos() {
    const { mapRowCount, mapColumnCount } = DataManager.Instance
    const disX = (TILE_WIDTH * mapRowCount) / 2
    const disY = (TILE_HEIGHT * mapColumnCount) / 2 + 80

    this.stage.setPosition(-disX, disY)
  }
  //生成主角
  async generatePlayer(x: number, y: number) {
    const player = createUINode()
    player.setParent(this.stage)
    const playManager = player.addComponent(PlayerManager)
    DataManager.Instance.palyer = playManager
    await playManager.init({
      x: x,
      y: y,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.PLAYER,
    })
    EventManager.Instance.emit(EVENT_ENUM.PLAY_BIRTH, true)
  }

  async generateWoodenSkeleton(x: number, y: number) {
    const woodenSkeleton = createUINode()
    woodenSkeleton.setParent(this.stage)
    const manager = woodenSkeleton.addComponent(WoodenSkeletonManager)
    DataManager.Instance.enemies.push(manager)
    await manager.init({
      x: x,
      y: y,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.WOODEN_SKELETON,
    })
  }

  async generateIronSkeleton(x: number, y: number) {
    const ironSkeleton = createUINode()
    ironSkeleton.setParent(this.stage)
    const manager = ironSkeleton.addComponent(IronSkeletonManager)
    DataManager.Instance.enemies.push(manager)
    await manager.init({
      x: x,
      y: y,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.IRON_SKELETON,
    })
  }

  async generateDoor(x: number, y: number) {
    const door = createUINode()
    door.setParent(this.stage)
    const manager = door.addComponent(DoorManager)
    await manager.init({ x, y })
    DataManager.Instance.door = manager
  }

  async generateBurst(x: number, y: number) {
    const burst = createUINode()
    burst.setParent(this.stage)
    const manager = burst.addComponent(BurstManager)
    await manager.init({
      x: x,
      y: y,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.BURST,
    })
  }
}
