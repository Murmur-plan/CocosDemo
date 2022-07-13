import { StateMachine } from 'db://assets/Base/StateMachine'
import { DIRECTION_ENUM } from 'db://assets/Enums'
import State from 'db://assets/Base/State'
import { AnimationClip } from 'cc'
import DirectionSubStateMachine from 'db://assets/Base/DirectionSubStateMachine'

const BASE_URL = 'texture/smoke/idle'
const ANIMATION_SPEED = 1 / 8 / 3
export default class IdleSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)
    this.stateMachines.set(
      DIRECTION_ENUM.TOP,
      new State(this.fsm, `${BASE_URL}/top`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED),
    )
    this.stateMachines.set(
      DIRECTION_ENUM.BOTTOM,
      new State(this.fsm, `${BASE_URL}/bottom`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED),
    )
    this.stateMachines.set(
      DIRECTION_ENUM.RIGHT,
      new State(this.fsm, `${BASE_URL}/right`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED),
    )
    this.stateMachines.set(
      DIRECTION_ENUM.LEFT,
      new State(this.fsm, `${BASE_URL}/left`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED),
    )
  }
}
