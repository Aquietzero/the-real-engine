import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from 'three/examples/jsm/libs/stats.module.js';

export class App {
  private readonly scene = new THREE.Scene()
  private readonly camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 1, 1800)
  private readonly renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
    powerPreference: "high-performance",
  })
  private readonly ambientLight = new THREE.AmbientLight(0xffffff)

  private readonly hasControl
  private readonly controls
  private readonly hasStats
  private readonly stats

  currentExample: THREE.Group

  constructor() {
    this.hasControl = true
    this.hasStats = true

    this.scene.background = new THREE.Color(0xffffff)
    this.scene.add(this.ambientLight)

    // this.camera.up = new Vector3(0, 1, 0)
    this.camera.position.set(15, 15, 15)

    this.renderer.setSize(innerWidth, innerHeight)
    this.renderer.setClearColor(new THREE.Color('rgb(0,0,0)'))

    if (this.hasControl) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    }

    if (this.hasStats) {
      this.stats = Stats()
      this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(this.stats.dom)
    }

    this.render()
  }

  public runExample(example: any) {
    if (this.currentExample) {
      this.scene.remove(this.currentExample)
    }
    this.currentExample = example.run(this)
  }

  private adjustCanvasSize() {
    this.renderer.setSize(innerWidth, innerHeight)
    this.camera.aspect = innerWidth / innerHeight
    this.camera.updateProjectionMatrix()
  }

  public render() {
    this.hasStats && this.stats.begin()
    if (this.hasControl) {
      this.controls?.update()
      this.renderer.render(this.scene, this.camera)
    }

    this.renderer.render(this.scene, this.camera)
    this.hasStats && this.stats.end()

    requestAnimationFrame(() => this.render())
    this.adjustCanvasSize()
  }
}
