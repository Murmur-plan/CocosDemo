import { _decorator, Component, Node } from 'cc'
import { TileMapManager } from 'db://assets/Scripts/Tile/TileMapManager'
import { createUINode } from 'db://assets/Scripts/Utils'
import Levels, { ILevel } from 'db://assets/Levels'
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Scripts/Tile/TileManager'
import { DataManager } from 'db://assets/RunTime/DataManager'
import { EventManager } from 'db://assets/RunTime/EventManager'
import { EVENT_ENUM } from 'db://assets/Enums'
import { PlayerManager } from 'db://assets/Scripts/Player/PlayerManager'

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
  initLevel() {
    const level = Levels[`Level${DataManager.Instance.levelIndex}`]
    if (level) {
      DataManager.Instance.reset()
      this.level = level
      //存到数据中心
      DataManager.Instance.mapInfo = this.level.mapInfo
      DataManager.Instance.mapRowCount = this.level.mapInfo.length || 0
      DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length || 0

      this.generateTileMap()
      this.generatePlayer()
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
  generateTileMap() {
    //创建瓦片地图
    const tileMap = createUINode()
    //瓦片地图在舞台上生成
    tileMap.setParent(this.stage)
    //添加组件-具体执行脚本
    const tileMapManager = tileMap.addComponent(TileMapManager)
    tileMapManager.init()

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
  private generatePlayer() {
    const player = createUINode()
    player.setParent(this.stage)
    const playManager = player.addComponent(PlayerManager)
    playManager.init()
  }
}
