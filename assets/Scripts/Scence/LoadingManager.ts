import { _decorator, Component, director, resources, ProgressBar } from 'cc'
import { SCENE_ENUM } from 'db://assets/Enums'
const { ccclass, property } = _decorator

@ccclass('LoadingManager')
export class LoadingManager extends Component {
  @property(ProgressBar)
  bar: ProgressBar = null

  onLoad() {
    this.bar.progress = 0
    resources.preloadDir(
      'texture',
      (cur, total) => {
        this.bar.progress = cur / total
      },
      () => {
        director.loadScene(SCENE_ENUM.Start)
      },
    )
  }
}
