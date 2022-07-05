import { _decorator, Component, Sprite, SpriteFrame, UITransform } from 'cc'

const { ccclass, property } = _decorator

export const TILE_WIDTH = 55
export const TILE_HEIGHT = 55

@ccclass('TileManager')
export class TileManager extends Component {
  async init(spriteFrame: SpriteFrame, i: number, j: number) {
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
