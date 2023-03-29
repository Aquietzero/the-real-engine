import * as uuid from 'short-uuid'

export class Node {
  id: string
  children: Node[]

  constructor() {
    this.id = uuid.generate()
    this.children = []
  }
}