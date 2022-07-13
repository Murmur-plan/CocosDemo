import { _decorator, Component, Event } from 'cc'
import { EventManager } from 'db://assets/RunTime/EventManager'
import { CONTROLER_ENUM, EVENT_ENUM } from 'db://assets/Enums'
const { ccclass, property } = _decorator
//按钮控制器
@ccclass('ControllerManager')
export class ControllerManager extends Component {
  handleCtrl(evt: Event, type: string) {
    EventManager.Instance.emit(EVENT_ENUM.PLAY_CONTROLER, type as CONTROLER_ENUM)
  }
}
