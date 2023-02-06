//@ts-nocheck
//To ignore type of poi and trambusStops data
import { describe, it, expect } from 'vitest'
import { RennesAppTest } from '../../tests/RennesAppTest'
import poi from '../../tests/dataLayers/poi.json'
import trambusStops from '../../tests/dataLayers/trambusStops.json'
import { RENNES_LAYER } from '@/stores/layers'
import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'
import type { RennesLayer } from '@/stores/layers'

const app = new RennesAppTest()
await app._initializeMapWithAllLayers()

function getRandomFeature(features: Feature<Geometry>[]) {
  return features[Math.floor(Math.random() * features.length)]
}

function getDataFromIdFeature(id_feature: string | number, layer: RennesLayer) {
  let layer_data = trambusStops
  if (layer == RENNES_LAYER.poi) {
    layer_data = poi
  }
  const poi_filtered = layer_data.filter(
    (item) => item['properties']['id'] == id_feature
  )
  if (poi_filtered.length > 0) {
    return poi_filtered[0]
  } else {
    return []
  }
}

describe('RennesApp', () => {
  describe('getFeaturesFromLayer', () => {
    it('good features for poi', async () => {
      const features = await app.getFeaturesFromLayer(RENNES_LAYER.poi)
      for (let i = 0; i < 5; i++) {
        const feature = getRandomFeature(features)
        const data = getDataFromIdFeature(feature.get('id'), RENNES_LAYER.poi)
        expect(data['properties'] !== undefined).toBe(true)
        expect(
          feature.get('id') === data['properties']['id'] &&
            feature.get('site_x') === data['properties']['site_x'] &&
            feature.get('site_y') === data['properties']['site_y'] &&
            feature.get('site_nom') === data['properties']['site_nom']
        ).toBe(true)
      }
    })

    it('good features for trambusStops', async () => {
      const features = await app.getFeaturesFromLayer(RENNES_LAYER.trambusStops)
      for (let i = 0; i < 5; i++) {
        const feature = getRandomFeature(features)
        const data = getDataFromIdFeature(
          feature.get('id'),
          RENNES_LAYER.trambusStops
        )
        expect(data['properties'] !== undefined).toBe(true)
        expect(
          feature.get('id') === data['properties']['id'] &&
            feature.get('nom') === data['properties']['nom'] &&
            feature.get('desserte') === data['properties']['desserte']
        ).toBe(true)
      }
    })
  })
})
