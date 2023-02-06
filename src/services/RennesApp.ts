import {
  VcsApp,
  Context,
  CesiumMap,
  EventType,
  GeoJSONLayer,
  OpenlayersMap,
} from '@vcmap/core'
import mapClickAndMoveInteraction from '@/interactions/clickAndMoveInteraction'
import type { RennesLayer } from '@/stores/layers'

export class RennesApp extends VcsApp {
  readonly mapConfig
  constructor(mapConfig: object) {
    super()
    this.mapConfig = mapConfig
  }

  async initializeMap() {
    const context = new Context(this.mapConfig)
    await this.addContext(context)

    const cesiumMap = this.get3DMap()
    await cesiumMap?.initialize()
    if (cesiumMap && cesiumMap instanceof CesiumMap) {
      cesiumMap.getScene().globe.maximumScreenSpaceError = 1
    }

    this.maps.eventHandler.featureInteraction.setActive(EventType.CLICKMOVE)
    this.maps.eventHandler.addPersistentInteraction(
      new mapClickAndMoveInteraction(this)
    )
  }

  async getLayerByKey(key: RennesLayer) {
    const layer: GeoJSONLayer = this.layers.getByKey(key) as GeoJSONLayer
    await layer.fetchData()
    return layer
  }

  async getFeaturesFromLayer(key: RennesLayer) {
    const layer = await this.getLayerByKey(key)
    return layer.getFeatures()
  }

  async filterFeaturesByAttribute(
    attribute: string,
    value: string,
    layer: GeoJSONLayer
  ) {
    const selected = layer
      .getFeatures()
      .filter((feature) => feature.getProperty(attribute) === value)
    return selected
  }

  async getFeaturesByAttributeFromLayer(
    layer_key: RennesLayer,
    attribute: string,
    value: string
  ) {
    const layer = await this.getLayerByKey(layer_key)
    const features = await this.filterFeaturesByAttribute(
      attribute,
      value,
      layer
    )
    return features
  }

  async getFeatureByAttributeFromLayer(
    layer_key: RennesLayer,
    attribute: string,
    value: string
  ) {
    const features = await this.getFeaturesByAttributeFromLayer(
      layer_key,
      attribute,
      value
    )
    return features[0]
  }

  async filterFeaturesThatContainAttribute(
    attribute: string,
    value: string,
    layer: GeoJSONLayer
  ) {
    const selected = layer
      .getFeatures()
      .filter((feature) => feature.getProperty(attribute).includes(value))
    return selected
  }

  async getFeaturesThatContainAttributeFromLayer(
    layer_key: RennesLayer,
    attribute: string,
    value: string
  ) {
    const layer = await this.getLayerByKey(layer_key)
    const features = await this.filterFeaturesThatContainAttribute(
      attribute,
      value,
      layer
    )
    return features
  }

  get3DMap(): CesiumMap {
    return this.maps.getByKey('cesium') as CesiumMap
  }

  get2DMap(): OpenlayersMap {
    return this.maps.getByKey('ol') as OpenlayersMap
  }
}
