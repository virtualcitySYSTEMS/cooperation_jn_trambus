import {
  VcsApp,
  Context,
  CesiumMap,
  EventType,
  GeoJSONLayer,
} from '@vcmap/core'
import mapConfig from '../map.config.json'
import SelectStationInteraction from '@/interactions/selectStation'
import { RENNES_LAYER } from '@/stores/layers'
import type { RennesLayer } from '@/stores/layers'

export class RennesApp extends VcsApp {
  constructor() {
    super()
  }

  async initializeMap() {
    const context = new Context(mapConfig)
    await this.addContext(context)

    const cesiumMap = this.maps.getByKey('cesium')
    await cesiumMap?.initialize()
    if (cesiumMap && cesiumMap instanceof CesiumMap) {
      cesiumMap.getScene().globe.maximumScreenSpaceError = 1
    }

    this.maps.eventHandler.featureInteraction.setActive(EventType.CLICKMOVE)
    this.maps.eventHandler.addPersistentInteraction(
      new SelectStationInteraction(this, RENNES_LAYER.trambusStops)
    )
  }

  async getLayerByKey(key: RennesLayer) {
    const layer: GeoJSONLayer = this.layers.getByKey(key) as GeoJSONLayer
    await layer.fetchData()
    return layer
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
}
