import {
  Camera,
} from 'three'
import * as _ from 'lodash'
import * as Key from 'keymaster'
import { Person } from './person'
import { Events } from './events'

export class FollowingCamera {
  person: Person
  camera: Camera
  curr: any
  strategies: any
  scenes: any
  app: any

  constructor(camera: Camera, scenes: any) {
    this.camera = camera
    this.scenes = scenes
    this.person = new Person()

    this.strategies = _.map(scenes, s => s.moveStrategy())
    this.curr = 0
    this.strategies[this.curr].start(this.person)

    Key('up', () => this.forward())
    Key('down', () => this.backward())
    Key('left', () => this.lookLeft())
    Key('right', () => this.lookRight())
  }

  jumpToScene(scene: any) {
    const index = _.findIndex(this.scenes, { id: scene.id })
    this.curr = index
    const s = this.strategies[this.curr]
    s.start(this.person)
    this.moveCamera()
  }

  forward() {
    if (this.curr < 0) return

    if (this.curr > this.scenes.length - 1) {
      Events.emit('path', { isFinal: true })
      return
    }

    const currStrategy = this.strategies[this.curr]
    if (currStrategy.isInside(this.person)) {
      currStrategy.forward(this.person, this.camera)
      this.moveCamera()
    } else {
      this.curr++
      const nextStrategy = this.strategies[this.curr]
      nextStrategy.start(this.person)
    }
  }

  backward() {
    if (this.curr < 0) return

    const currStrategy = this.strategies[this.curr]
    if (currStrategy.isInside(this.person)) {
      currStrategy.backward(this.person, this.camera)
      this.moveCamera()
    } else {
      this.curr--
    }
  }

  lookLeft() {
    const currStrategy = this.strategies[this.curr]
    currStrategy.lookLeft(this.person, this.camera)
    this.moveCamera()
  }

  lookRight() {
    const currStrategy = this.strategies[this.curr]
    currStrategy.lookRight(this.person, this.camera)
    this.moveCamera()
  }

  moveCamera() {
    const currStrategy = this.strategies[this.curr]
    currStrategy.moveCamera(this.person, this.camera)
  }
}
