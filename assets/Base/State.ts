import { Sprite, AnimationClip, animation, SpriteFrame } from 'cc'
/**
 * 1.需要知道自己的动画轨道
 * 2、有动画播放的能力
 */
import { ResourceManager } from 'db://assets/RunTime/ResourceManager'
import { StateMachine } from 'db://assets/Base/StateMachine'
import { sortSpriteFrame } from 'db://assets/Scripts/Utils'

export const ANIMATION_SPEED = 1 / 8

export default class State {
  animationClip: AnimationClip
  constructor(
    private fms: StateMachine,
    private path: string,
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
    private speed = ANIMATION_SPEED,
    private events: Array<AnimationClip.IEvent> = [],
  ) {
    this.init()
  }

  async init() {
    const pormise = ResourceManager.Instance.loadDir(this.path)
    this.fms.waitingList.push(pormise)
    let spriteFrames = await pormise
    this.animationClip = new AnimationClip()
    // spriteFrames = spriteFrames.filter(a => a.name.indexOf('(') > -1)
    const track = new animation.ObjectTrack() // 创建一个向量轨道
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame') // 指定轨道路径，即指定目标对象为 "Foo" 子节点的 "position" 属性
    const frames: Array<[number, SpriteFrame]> = sortSpriteFrame(spriteFrames).map((item, index) => [
      this.speed * index,
      item,
    ])
    track.channel.curve.assignSorted(frames)

    // 最后将轨道添加到动画剪辑以应用
    this.animationClip.addTrack(track)
    this.animationClip.name = this.path
    this.animationClip.duration = frames.length * this.speed //整个动画持续事件
    //设置事件 在动画播放过程中触发
    for (let event of this.events) {
      this.animationClip.events.push(event)
    }

    //设置循环播放
    this.animationClip.wrapMode = this.wrapMode
    this.animationClip.updateEventDatas()
  }
  run() {
    if (this.fms.animationComponent?.defaultClip?.name === this.animationClip.name) {
      return
    }
    this.fms.animationComponent.defaultClip = this.animationClip
    this.fms.animationComponent.play()
  }
}
