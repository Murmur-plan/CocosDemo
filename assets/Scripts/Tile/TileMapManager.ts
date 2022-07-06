import { _decorator, Component, resources, SpriteFrame } from 'cc'
import { createUINode, randomByRange } from 'db://assets/Scripts/Utils'
import { TileManager } from 'db://assets/Scripts/Tile/TileManager'
import { DataManager } from 'db://assets/RunTime/DataManager'
import { ResourceManager } from 'db://assets/RunTime/ResourceManager'

const { ccclass, property } = _decorator

@ccclass('TileMapManager')
export class TileMapManager extends Component {
  async init() {
    const { mapInfo } = DataManager.Instance
    //加载资源
    const spriteFrames = await ResourceManager.Instance.loadDir('texture/tile/tile')
    const dataMap = new Map<string, SpriteFrame>()
    for (const key in spriteFrames) {
      dataMap.set(spriteFrames[key].name, spriteFrames[key])
    }
    DataManager.Instance.tileInfo = []
    const len = mapInfo.length
    for (let i = 0; i < len; i++) {
      const column = mapInfo[i]
      DataManager.Instance.tileInfo[i] = []
      for (let j = 0; j < column.length; j++) {
        const curItem = column[j]
        if (curItem.src == null || curItem.type == null) {
          continue
        }
        //开始渲染地图
        //随机地图元素
        let number = curItem.src
        if ((number === 1 || number === 5 || number === 9) && i % 2 === 0 && j % 2 === 0) {
          number += randomByRange(0, 4)
        }
        const imgSrc = `tile (${number})`
        const node = createUINode()
        const spriteFrame = dataMap.get(imgSrc) || spriteFrames[0]
        //增加单地图渲染组件
        const tileManager = node.addComponent(TileManager)
        tileManager.init(spriteFrame, i, j, curItem.type)
        node.setParent(this.node)
        DataManager.Instance.tileInfo[i][j] = tileManager
      }
    }
  }
}
