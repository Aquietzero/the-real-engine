import {
  Color,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  AmbientLight,
  PCFSoftShadowMap,

  BoxGeometry,
  Mesh,
  MeshPhongMaterial,
  PointLight,
  DoubleSide,
} from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from 'three/examples/jsm/libs/stats.module.js';

export class App {
  private readonly scene = new Scene()
  private readonly camera = new PerspectiveCamera(50, innerWidth / innerHeight, 1, 1800)
  private readonly renderer = new WebGLRenderer({
    antialias: true,
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
    powerPreference: "high-performance",
  })
  private readonly light = new AmbientLight(0x404040)

  private readonly hasControl
  private readonly controls
  private readonly hasStats
  private readonly stats

  cube

  constructor() {
    this.hasControl = true
    this.hasStats = true

    this.scene.add(this.light)

    // this.camera.up = new Vector3(0, 1, 0)
    this.camera.position.set(0, 1, 5)

    this.renderer.setSize(innerWidth, innerHeight)
    this.renderer.setClearColor(new Color('rgb(0,0,0)'))

    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap // default THREE.PCFShadowMap

    if (this.hasControl) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    }

    if (this.hasStats) {
      this.stats = Stats()
      this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(this.stats.dom)
    }

    const geometry = new BoxGeometry(1, 1, 1)
    const material = new MeshPhongMaterial({
      color: 0x00ff00,
      side: DoubleSide,
      flatShading: true,
    })
    this.cube = new Mesh(geometry, material)

    this.scene.add(this.cube)

    const pointLight = new PointLight(0xff0000, 10, 100)
    pointLight.position.set(0, 0, 3)
    this.scene.add(pointLight)

    this.render()
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

    this.cube.rotation.y += 0.01

    this.renderer.render(this.scene, this.camera)
    this.hasStats && this.stats.end()

    requestAnimationFrame(() => this.render())
    this.adjustCanvasSize()
  }
}
