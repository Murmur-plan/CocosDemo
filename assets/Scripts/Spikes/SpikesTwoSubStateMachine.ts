import { StateMachine } from 'db://assets/Base/StateMachine'
import {
  DIRECTION_ENUM,
  DIRECTION_NUMBER_ENUM,
  PARAMS_NAME_ENUM,
  SPIKES_COUNT_ENUM,
  SPIKES_COUNT_MAP_NUMBER_ENUM,
} from 'db://assets/Enums'
import State from 'db://assets/Base/State'
import DirectionSubStateMachine from 'db://assets/Base/DirectionSubStateMachine'
import { SubStateMachine } from 'db://assets/Base/SubStateMachine'

const BASE_URL = 'texture/spikes/spikestwo'

export default class SpikesTwoSubStateMachine extends SubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)
    this.stateMachines.set(SPIKES_COUNT_ENUM.ZERO, new State(this.fsm, `${BASE_URL}/zero`))
    this.stateMachines.set(SPIKES_COUNT_ENUM.ONE, new State(this.fsm, `${BASE_URL}/one`))
    this.stateMachines.set(SPIKES_COUNT_ENUM.TWO, new State(this.fsm, `${BASE_URL}/two`))
    this.stateMachines.set(SPIKES_COUNT_ENUM.THREE, new State(this.fsm, `${BASE_URL}/three`))
  }

  run() {
    const value = this.fsm.getParams(PARAMS_NAME_ENUM.SPIKES_CUR_COUNT)
    this.currentState = this.stateMachines.get(SPIKES_COUNT_MAP_NUMBER_ENUM[value as number])
  }
}
