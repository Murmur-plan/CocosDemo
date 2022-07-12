import { _decorator, Animation, AnimationClip, Component, SpriteFrame } from 'cc'
import { ENTITY_STATE_ENUM, FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from 'db://assets/Enums'
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from 'db://assets/Base/StateMachine'
import IdleSubStateMachine from 'db://assets/Scripts/Player/IdleSubStateMachine'
import TurnLeftSubStateMachine from 'db://assets/Scripts/Player/TurnLeftSubStateMachine'
import BlockFrountSubStateMachine from 'db://assets/Scripts/Player/BlockFrountSubStateMachine'
import BlockTurnLeftSubStateMachine from 'db://assets/Scripts/Player/BlockTurnLeftSubStateMachine'
import { EntityManager } from 'db://assets/Base/EntityManager'
import TurnRightSubStateMachine from 'db://assets/Scripts/Player/TurnRightSubStateMachine'
import BlockTurnRightSubStateMachine from 'db://assets/Scripts/Player/BlockTurnRightSubStateMachine'
import DeathSubStateMachine from 'db://assets/Scripts/Player/DeathSubStateMachine'
import AttackSubStateMachine from 'db://assets/Scripts/Player/AttackSubStateMachine'

const { ccclass, property } = _decorator

type ParamsValueType = boolean | number

export interface IParamValue {
  type: FSM_PARAMS_TYPE_ENUM
  value: ParamsValueType
}

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {
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
    this.params.set(PARAMS_NAME_ENUM.TURN_LEFT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.TURN_RIGHT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCK_FRONT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DEATH, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber())
  }

  //初始化状态机
  private initStateMachines() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURN_LEFT, new TurnLeftSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURN_RIGHT, new TurnRightSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_FRONT, new BlockFrountSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT, new BlockTurnLeftSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT, new BlockTurnRightSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.DEATH, new DeathSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new AttackSubStateMachine(this))
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
    // switch (this.currentState) {
    //   case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
    //   case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_FRONT):
    //   case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT):
    //   case this.stateMachines.get(PARAMS_NAME_ENUM.TURN_LEFT):
    //   case this.stateMachines.get(PARAMS_NAME_ENUM.TURN_RIGHT):
    //     if (this.params.get(PARAMS_NAME_ENUM.TURN_LEFT).value) {
    //       this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURN_LEFT)
    //     } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
    //       this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    //     } else if (this.params.get(PARAMS_NAME_ENUM.TURN_RIGHT).value) {
    //       this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURN_RIGHT)
    //     } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT).value) {
    //       this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_TURN_LEFT)
    //     } else if (this.params.get(PARAMS_NAME_ENUM.BLOCK_FRONT).value) {
    //       this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCK_FRONT)
    //     } else {
    //       //没有匹配到
    //       this.currentState = this.currentState
    //     }
    //     break
    //   default:
    //     this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    // }
  }

  private initAnimationEvent() {
    //监听动画播放完毕事件
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      const whiteList = ['block', 'turn', 'attack']
      if (whiteList.some(v => name.includes(v))) {
        this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
      }
    })
  }
}
