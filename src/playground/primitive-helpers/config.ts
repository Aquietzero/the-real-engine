export interface HelperConfig {
  color?: number
}

export interface RayHelperConfig extends HelperConfig {
  showArrow?: boolean
}

export interface PlaneHelperConfig extends HelperConfig {
  showNormal?: boolean
}

export interface BoxHelperConfig extends HelperConfig {
  showCentroid?: boolean
}
