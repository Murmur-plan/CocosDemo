import { SubStateMachine } from 'db://assets/Base/SubStateMachine'
import { StateMachine } from 'db://assets/Base/StateMachine'
import { DIRECTION_ENUM, DIRECTION_NUMBER_ENUM, PARAMS_NAME_ENUM } from 'db://assets/Enums'
import State from 'db://assets/Base/State'
import DirectionSubStateMachine from 'db://assets/Base/DirectionSubStateMachine'

const BASE_URL = 'texture/player/turnright'

export default class TurnRightSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(this.fsm, `${BASE_URL}/top`))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(this.fsm, `${BASE_URL}/bottom`))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(this.fsm, `${BASE_URL}/right`))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(this.fsm, `${BASE_URL}/left`))
  }
}
