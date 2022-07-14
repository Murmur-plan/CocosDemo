import { _decorator, Component, Node, director } from 'cc'
import { EventManager } from 'db://assets/RunTime/EventManager'
import { EVENT_ENUM } from 'db://assets/Enums'
const { ccclass } = _decorator

@ccclass('MenuManager')
export class MenuManager extends Component {
  handleRevoke() {
    EventManager.Instance.emit(EVENT_ENUM.REVOKE_STEP)
  }

  handleRestart() {
    EventManager.Instance.emit(EVENT_ENUM.RESTART_LEVEL)
  }

  handleOut() {
    EventManager.Instance.emit(EVENT_ENUM.QUIT_BATTLE)
  }
}
