import { _decorator, Component, Node, director } from 'cc'
import { SCENE_ENUM } from 'db://assets/Enums'
import FaderManager from 'db://assets/RunTime/FaderManager'
const { ccclass } = _decorator

@ccclass('StartManager')
export class StartManager extends Component {
  onLoad() {
    director.preloadScene(SCENE_ENUM.Battle)
    FaderManager.Instance.fadeOut(1000)
    //点击后触发
    this.node.once(Node.EventType.TOUCH_START, this.handleStart, this)
  }

  async handleStart() {
    await FaderManager.Instance.fadeIn(300)
    director.loadScene(SCENE_ENUM.Battle)
  }
}
