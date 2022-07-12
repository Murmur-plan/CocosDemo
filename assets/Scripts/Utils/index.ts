import { Layers, Node, SpriteFrame, UITransform } from 'cc'

export const createUINode = (name: string = '') => {
  const node = new Node(name)
  //给node增加 UI 变换组件
  const transform = node.addComponent(UITransform)
  //设置原点是左上角
  transform.setAnchorPoint(0, 1)
  //cocos渲染出来需要设置layer属性
  node.layer = 1 << Layers.nameToLayer('UI_2D')
  return node
}

export const randomByRange = (start: number, end: number) => {
  return Math.floor(start + (end - start) * Math.random())
}

const rge = /\((\d+)\)/

const getNumberWithinString = (str: string) => parseInt(str.match(rge)[1] || '0')

export const sortSpriteFrame = (spriteFrames: SpriteFrame[]) =>
  spriteFrames.sort((a, b) => getNumberWithinString(a.name) - getNumberWithinString(b.name))

export const generateId = (len: number) => {
  return Array.from({ length: len }).reduce<string>((total: string, item) => total + Math.floor(Math.random() * 10), '')
}
