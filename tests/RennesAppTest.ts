import { RennesApp } from '../src/services/RennesApp'
import type { VcsObjectOptions } from '@vcmap/core'
import { OpenlayersMap, GeoJSONLayer, Context } from '@vcmap/core'
import trambusStops from '../tests/dataLayers/trambusStops.json'
import parking from '../tests/dataLayers/parking.json'
import poi from '../tests/dataLayers/poi.json'
import trambusLines from '../tests/dataLayers/trambusLines.json'
import { RENNES_LAYER } from '@/stores/layers'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import type { Geometry } from 'ol/geom'
import type { RennesLayer } from '@/stores/layers'
import { LineString, MultiLineString } from 'ol/geom'
import type { Coordinate } from 'ol/coordinate'

export class RennesAppTest extends RennesApp {
  test_viewpoints: VcsObjectOptions[]
  test_maps: VcsObjectOptions[]
  test_layers: VcsObjectOptions[]
  test_context: Context | null

  constructor() {
    super({})
    this.test_viewpoints = []
    this.test_maps = []
    this.test_layers = []
    this.test_context = null
  }

  _addOpenLayerMap() {
    this.test_maps.push(new OpenlayersMap({ name: 'ol' }).toJSON())
  }

  _addLayer(name: string) {
    const layer = new GeoJSONLayer({
      name: name,
      activeOnStartup: true,
    })
    this.test_layers.push(layer.toJSON())
  }

  _createContext() {
    this.test_context = new Context({
      layers: this.test_layers,
      viewpoints: this.test_viewpoints,
      maps: this.test_maps,
      startingViewpointName: 'rennes',
      startingMapName: 'ol',
    })
  }

  _createFeature(
    feature_id: string,
    geometry: Geometry,
    properties: Record<string, string | number | null>
  ) {
    const feature = new Feature(geometry)
    feature.setId(feature_id)
    feature.setProperties(properties)
    return feature
  }

  _getGeometryFromKey(
    key: RennesLayer,
    coordinates: number[] | number[][] | (LineString | Coordinate[])[]
  ) {
    if ([RENNES_LAYER.trambusStops, RENNES_LAYER.parking].includes(key)) {
      return new Point(coordinates as number[])
    } else if ([RENNES_LAYER.poi].includes(key)) {
      return new LineString(coordinates as number[] | Coordinate[])
    } else if ([RENNES_LAYER.trambusLines].includes(key)) {
      return new MultiLineString(
        coordinates as number[] | (LineString | Coordinate[])[]
      )
    }
  }

  _getDataFeatureFromKey(key: RennesLayer) {
    switch (key) {
      case RENNES_LAYER.trambusStops:
        return trambusStops
      case RENNES_LAYER.parking:
        return parking
      case RENNES_LAYER.poi:
        return poi
      case RENNES_LAYER.trambusLines:
        return trambusLines
    }
    return []
  }

  async _linkedFeaturesToLayer(key: RennesLayer) {
    const layer = await this.getLayerByKey(key)
    const features: Feature[] = []
    this._getDataFeatureFromKey(key).forEach((data) => {
      const geometry: Geometry = this._getGeometryFromKey(
        key,
        data.geometry.coordinates
      ) as Geometry
      const feature = this._createFeature(data.id, geometry, data.properties)
      features.push(feature)
    })
    layer.addFeatures(features)
  }

  async _initializeMapToThermometerTest() {
    this._addOpenLayerMap()
    this._addLayer(RENNES_LAYER.trambusStops)
    this._addLayer(RENNES_LAYER.parking)
    this._createContext()
    if (this.test_context === null) return
    await this.addContext(this.test_context)
    await this._linkedFeaturesToLayer(RENNES_LAYER.trambusStops)
    await this._linkedFeaturesToLayer(RENNES_LAYER.parking)
  }

  async _initializeMapWithAllLayers() {
    this._addOpenLayerMap()
    const layers = [
      RENNES_LAYER.trambusStops,
      RENNES_LAYER.parking,
      RENNES_LAYER.poi,
      RENNES_LAYER.trambusLines,
    ]
    layers.forEach((layer) => {
      this._addLayer(layer)
    })
    this._createContext()
    if (this.test_context === null) return
    await this.addContext(this.test_context)
    for (let i = 0; i < layers.length; i++) {
      await this._linkedFeaturesToLayer(layers[i])
    }
  }
}
