import { _decorator, Component, Sprite, SpriteFrame, UITransform } from 'cc'
import { TILE_TYPE_ENUM } from 'db://assets/Enums'

const { ccclass, property } = _decorator

export const TILE_WIDTH = 55
export const TILE_HEIGHT = 55

@ccclass('TileManager')
export class TileManager extends Component {
  type: TILE_TYPE_ENUM
  moveable: boolean
  turnable: boolean
  async init(spriteFrame: SpriteFrame, i: number, j: number, type: TILE_TYPE_ENUM) {
    this.type = type
    switch (type) {
      case TILE_TYPE_ENUM.WALL_ROW:
      case TILE_TYPE_ENUM.WALL_COLUMN:
      case TILE_TYPE_ENUM.WALL_LEFT_TOP:
      case TILE_TYPE_ENUM.WALL_LEFT_BOTTOM:
      case TILE_TYPE_ENUM.WALL_RIGHT_TOP:
      case TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM:
        this.moveable = false
        this.turnable = false
        break
      case TILE_TYPE_ENUM.CLIFF_RIGHT:
      case TILE_TYPE_ENUM.CLIFF_CENTER:
      case TILE_TYPE_ENUM.CLIFF_LEFT:
        this.moveable = false
        this.turnable = true
        break
      case TILE_TYPE_ENUM.FLOOR:
        this.moveable = true
        this.turnable = true
        break
    }
    //开始渲染地图
    const sprite = this.addComponent(Sprite)
    sprite.spriteFrame = spriteFrame
    //获取 UI 变换组件
    const transform = this.getComponent(UITransform)
    //设置瓦片的宽高
    transform.setContentSize(TILE_WIDTH, TILE_HEIGHT)
    //设置每个瓦片的位置
    this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT)
  }
}
