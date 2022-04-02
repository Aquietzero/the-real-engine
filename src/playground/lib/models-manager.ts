import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'

class ModelsManager {
  public objLoader = new OBJLoader()
  public mtlLoader = new MTLLoader()

  public models: { [key: string]: THREE.Object3D } = {}

  public load(name: string, cb: any, hooks: any = {}) {
    const cache = this.models[name]
    // Return a clone of the cache is really important.
    // Since the object will be changed or modified by the user.
    if (cache) return cb(cache.clone())

    const mtlPath = `assets/${name}/${name}.mtl`
    const objPath = `assets/${name}/${name}.obj`

    this.mtlLoader.load(mtlPath, (materials) => {
      materials.preload()

      this.objLoader.setMaterials(materials)
      this.objLoader.load(objPath, (obj: any) => {
        if (hooks.beforeCache) {
          obj = hooks.beforeCache(obj)
        }
        this.models[name] = obj
        cb(obj)
      })
    })
  }
}

export default new ModelsManager()
