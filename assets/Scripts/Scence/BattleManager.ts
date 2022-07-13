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
import { SpikesManager } from 'db://assets/Scripts/Spikes/SpikesManager'
import { SmokeManager } from 'db://assets/Scripts/Smoke/SmokeManager'
import FaderManager from 'db://assets/RunTime/FaderManager'
import { ShakeManager } from 'db://assets/Scripts/UI/ShakeManager'

const { ccclass, property } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  level: ILevel
  stage: Node
  smokeLayer: Node

  start() {
    this.generateStage()
    this.initLevel()
  }

  onLoad() {
    DataManager.Instance.levelIndex = 8
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
    EventManager.Instance.on(EVENT_ENUM.PLAY_MOVE_END, this.checkIsNextLevel, this)
    EventManager.Instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this)
  }

  onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
    EventManager.Instance.off(EVENT_ENUM.PLAY_MOVE_END, this.checkIsNextLevel, this)
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
    this.stage.addComponent(ShakeManager)
  }

  //初始化关卡
  async initLevel() {
    const level = Levels[`Level${DataManager.Instance.levelIndex}`]
    if (level) {
      await FaderManager.Instance.fadeIn()
      DataManager.Instance.reset()
      this.level = level
      //存到数据中心
      DataManager.Instance.mapInfo = this.level.mapInfo
      DataManager.Instance.mapRowCount = this.level.mapInfo.length || 0
      DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length || 0
      await this.generateTileMap()
      await Promise.all([
        this.generateBurst(),
        this.generateSpikes(),
        this.generateSmokeLayer(),
        this.generateDoor(),
        this.generateEnemies(),
      ])
      await this.generatePlayer()
      await FaderManager.Instance.fadeOut()
    }
  }
  //下一关
  async nextLevel() {
    DataManager.Instance.levelIndex++
    this.clearLevel()
    await this.initLevel()
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
  async generatePlayer() {
    const player = createUINode()
    player.setParent(this.stage)
    const playManager = player.addComponent(PlayerManager)
    DataManager.Instance.palyer = playManager
    await playManager.init(this.level.player)
    EventManager.Instance.emit(EVENT_ENUM.PLAY_BIRTH, true)
  }

  async generateEnemies() {
    DataManager.Instance.enemies = []
    const promises = []
    for (let i = 0; i < this.level.enemies.length; i++) {
      const enemy = this.level.enemies[i]
      const node = createUINode()
      node.setParent(this.stage)
      const Manager = enemy.type === ENTITY_TYPE_ENUM.SKELETON_WOODEN ? WoodenSkeletonManager : IronSkeletonManager
      const manager = node.addComponent(Manager)
      promises.push(manager.init(enemy))
      DataManager.Instance.enemies.push(manager)
    }
    await Promise.all(promises)
  }

  async generateDoor() {
    const door = createUINode()
    door.setParent(this.stage)
    const manager = door.addComponent(DoorManager)
    await manager.init(this.level.door)
    DataManager.Instance.door = manager
  }

  async generateBurst() {
    DataManager.Instance.bursts = []
    const promises = []
    for (let i = 0; i < this.level.bursts.length; i++) {
      const bursts = this.level.bursts[i]
      const node = createUINode()
      node.setParent(this.stage)
      const manager = node.addComponent(BurstManager)
      promises.push(manager.init(bursts))
      DataManager.Instance.bursts.push(manager)
    }
    await Promise.all(promises)
  }

  async generateSpikes() {
    DataManager.Instance.spikes = []
    const promises = []
    for (let i = 0; i < this.level.spikes.length; i++) {
      const spike = this.level.spikes[i]
      const node = createUINode()
      node.setParent(this.stage)
      const manager = node.addComponent(SpikesManager)
      promises.push(manager.init(spike))
      DataManager.Instance.spikes.push(manager)
    }
    await Promise.all(promises)
  }

  async checkIsNextLevel() {
    //拿到门
    const { x: doorX, y: doorY } = DataManager.Instance.door
    //拿到玩家
    const { x: playerX, y: playerY } = DataManager.Instance.palyer

    if (playerX === doorX && playerY === doorY) {
      await this.nextLevel()
    }
  }

  async generateSmoke(x: number, y: number, direction: DIRECTION_ENUM) {
    const smoke = DataManager.Instance.smokes.find(a => a.state == ENTITY_STATE_ENUM.DEATH)
    if (smoke) {
      smoke.x = x
      smoke.y = y
      smoke.direction = direction
      smoke.state = ENTITY_STATE_ENUM.IDLE
    } else {
      const node = createUINode()
      node.setParent(this.smokeLayer)
      const manager = node.addComponent(SmokeManager)
      await manager.init({
        x: x,
        y: y,
        direction: direction,
        type: ENTITY_TYPE_ENUM.SMOKE,
        state: ENTITY_STATE_ENUM.IDLE,
      })
      DataManager.Instance.smokes.push(manager)
    }
  }

  async generateSmokeLayer() {
    this.smokeLayer = createUINode()
    this.smokeLayer.setParent(this.stage)
  }
}
