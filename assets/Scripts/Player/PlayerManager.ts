import { _decorator, Component, Sprite, UITransform, Animation, AnimationClip, animation, SpriteFrame } from 'cc'
import { TILE_HEIGHT, TILE_WIDTH } from 'db://assets/Scripts/Tile/TileManager'
import { ResourceManager } from 'db://assets/RunTime/ResourceManager'
import { CONTROLER_ENUM, EVENT_ENUM } from 'db://assets/Enums'
import { EventManager } from 'db://assets/RunTime/EventManager'

const { ccclass, property } = _decorator

const ANIMATION_SPEED = 1 / 8

@ccclass('PlayerManager')
export class PlayerManager extends Component {
  x: number = 0
  y: number = 0
  targetX: number = 0
  targetY: number = 0
  private readonly speed = 1 / 10

  async init() {
    await this.render()
    EventManager.Instance.on(EVENT_ENUM.PLAY_CONTROLER, this.move, this)
  }

  update() {
    this.updateXY()
    //转换为实际坐标
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
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

    if (Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y) <= 0.1) {
      this.x = this.targetX
      this.y = this.targetY
    }
  }

  move(inputDirection: CONTROLER_ENUM) {
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
      default:
        break
    }
  }

  //渲染主角
  async render() {
    const sprite = this.addComponent(Sprite)
    //自定义宽高
    sprite.sizeMode = Sprite.SizeMode.CUSTOM
    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    const spriteFrames = await ResourceManager.Instance.loadDir('texture/player/idle/top')

    const animationClip = new AnimationClip()
    animationClip.duration = 1.0 // 整个动画剪辑的周期

    const track = new animation.ObjectTrack() // 创建一个向量轨道
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame') // 指定轨道路径，即指定目标对象为 "Foo" 子节点的 "position" 属性
    const frames: Array<[number, SpriteFrame]> = spriteFrames.map((item, index) => [ANIMATION_SPEED * index, item])
    track.channel.curve.assignSorted(frames)

    // 最后将轨道添加到动画剪辑以应用
    animationClip.addTrack(track)
    animationClip.duration = frames.length * ANIMATION_SPEED //整个动画持续事件
    //设置循环播放
    animationClip.wrapMode = AnimationClip.WrapMode.Loop
    const animationComponent = this.addComponent(Animation)
    animationComponent.defaultClip = animationClip
    animationComponent.play()
  }
}
