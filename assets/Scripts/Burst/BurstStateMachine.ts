import { _decorator, Animation, AnimationClip } from 'cc'
import { EVENT_ENUM, PARAMS_NAME_ENUM } from 'db://assets/Enums'
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from 'db://assets/Base/StateMachine'
import { EventManager } from 'db://assets/RunTime/EventManager'
import State from 'db://assets/Base/State'

const { ccclass, property } = _decorator

const BASE_URL = 'texture/burst'

@ccclass('BurstStateMachine')
export class BurstStateMachine extends StateMachine {
  async init() {
    //添加动画组件
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    //内部有异步加载资源
    this.initStateMachines()
    //动画事件 用于动画流转
    this.initAnimationEvent()
    //等待资源加载完毕后再退出方法
    await Promise.all(this.waitingList)
  }

  //初始化参数列表
  private initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
  }

  //初始化状态机
  private initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new State(this, `${BASE_URL}/idle`))
    this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new State(this, `${BASE_URL}/attack`))
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new State(this, `${BASE_URL}/death`))
  }

  run() {
    if (this.currentState) {
      let paramsName: PARAMS_NAME_ENUM = null
      for (const [key, value] of this.params) {
        if (value.value) {
          paramsName = PARAMS_NAME_ENUM[key]
          break
        }
      }
      if (paramsName && this.stateMachines.has(paramsName)) {
        this.currentState = this.stateMachines.get(paramsName)
      } else {
        this.currentState = this.currentState
      }
    } else {
      this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }

  private initAnimationEvent() {
    //监听动画播放完毕事件
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      const deathList = ['death']
      if (deathList.some(v => name.includes(v))) {
        this.node.destroy()
        EventManager.Instance.emit(EVENT_ENUM.DOOR_OPEN)
      }
    })
  }
}
