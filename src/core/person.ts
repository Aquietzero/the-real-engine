import {
  Group,
  BoxGeometry,
  MeshPhongMaterial,
  Mesh,
} from 'three'

export class Person {
  obj: Group = new Group()
  static height: number = 50
  static centroid: number = Person.height/2

  constructor() {
    const g = new BoxGeometry(0, Person.height, 0)
    const m = new MeshPhongMaterial({ color: 0x303030 })
    const person = new Mesh(g, m)
    this.obj.add(person)
  }
}

