import { _decorator, Animation, AnimationClip, Component, SpriteFrame } from 'cc'
import {
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
  FSM_PARAMS_TYPE_ENUM,
  PARAMS_NAME_ENUM,
  SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM,
} from 'db://assets/Enums'
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from 'db://assets/Base/StateMachine'
import SpikesOneSubStateMachine from 'db://assets/Scripts/Spikes/SpikesOneSubStateMachine'
import SpikesTwoSubStateMachine from 'db://assets/Scripts/Spikes/SpikesTwoSubStateMachine'
import SpikesThreeSubStateMachine from 'db://assets/Scripts/Spikes/SpikesThreeSubStateMachine'
import SpikesFourSubStateMachine from 'db://assets/Scripts/Spikes/SpikesFourSubStateMachine'
import { SpikesManager } from 'db://assets/Scripts/Spikes/SpikesManager'
import { DataManager } from 'db://assets/RunTime/DataManager'
import { EventManager } from 'db://assets/RunTime/EventManager'

const { ccclass, property } = _decorator

@ccclass('SpikesStateMachine')
export class SpikesStateMachine extends StateMachine {
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
    this.params.set(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, getInitParamsNumber())
    this.params.set(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, getInitParamsNumber())
  }

  //初始化状态机
  private initStateMachines() {
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_ONE, new SpikesOneSubStateMachine(this))
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_TWO, new SpikesTwoSubStateMachine(this))
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_THREE, new SpikesThreeSubStateMachine(this))
    this.stateMachines.set(ENTITY_TYPE_ENUM.SPIKES_FOUR, new SpikesFourSubStateMachine(this))
  }

  run() {
    const value = this.getParams(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT)
    const spikesEnum = SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM[value as number]
    if (spikesEnum) {
      this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM[spikesEnum])
    } else {
      this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
    }
    // switch (this.currentState) {
    //   case this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE):
    //     if (value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE) {
    //       this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
    //     } else {
    //       this.currentState = this.currentState
    //     }
    //     break
    //   default:
    //     this.currentState = this.stateMachines.get(ENTITY_TYPE_ENUM.SPIKES_ONE)
    // }
  }

  private initAnimationEvent() {
    //监听动画播放完毕事件
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      const { value } = this.params.get(PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT)
      //例如1个刺的地裂，在播放完1刺之后，回到0的状态
      if (
        (value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_ONE && name.includes('spikesone/two')) ||
        (value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_TWO && name.includes('spikestwo/three')) ||
        (value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_THREE && name.includes('spikesthree/four')) ||
        (value === SPIKES_TYPE_MAP_TOTAL_COUNT_ENUM.SPIKES_FOUR && name.includes('spikesfour/five'))
      ) {
        this.node.getComponent(SpikesManager).curCount = 0
      }
    })
  }
}
