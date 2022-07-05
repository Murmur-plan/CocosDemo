import { ITile } from 'db://assets/Levels'
import Singleton from 'db://assets/Base/Singleton'

export class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>()
  }

  //地图信息
  mapInfo: Array<Array<ITile>>
  //地图行的数量
  mapRowCount: number = 0
  //地图列的数量
  mapColumnCount: number = 0
  //关卡数
  levelIndex: number = 1

  reset() {
    //地图信息
    this.mapInfo = []
    //地图行的数量
    this.mapRowCount = 0
    //地图列的数量
    this.mapColumnCount = 0
  }
}
