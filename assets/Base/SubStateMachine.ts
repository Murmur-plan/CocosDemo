import State from 'db://assets/Base/State'
import { StateMachine } from 'db://assets/Base/StateMachine'
import { PARAMS_NAME_ENUM } from 'db://assets/Enums'

export abstract class SubStateMachine {
  constructor(public fsm: StateMachine) {}

  //参数名称
  public paramName: PARAMS_NAME_ENUM

  //当前状态
  private _currentState: State = null

  //状态机列表
  stateMachines: Map<string, State> = new Map()

  get currentState() {
    return this._currentState
  }

  set currentState(newState: State) {
    this._currentState = newState
    this._currentState.run()
  }

  abstract run(): void
}
