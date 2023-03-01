import {
  ArcStyle,
  ArrowEnd,
  markVolatile,
  mercatorProjection,
  VectorLayer,
} from '@vcmap/core'
import type { Feature } from 'ol'
import type { RennesApp } from '@/services/RennesApp'
import type { TravelTimeModel } from '@/model/travel-time.model'
import type { FeatureLike } from 'ol/Feature'
import { arcFactor } from '@/helpers/arcHelpers'

export function getScratchLayer(
  app: RennesApp,
  layerName: string
): VectorLayer {
  if (app.layers.hasKey(layerName)) {
    return app.layers.getByKey(layerName) as VectorLayer
  }

  const layer = new VectorLayer({
    name: layerName,
    projection: mercatorProjection.toJSON(),
    zIndex: 3,
    vectorProperties: {
      altitudeMode: 'absolute',
    },
  })

  markVolatile(layer)
  app.layers.add(layer)
  layer.activate()
  return layer
}

export function updateArrowFeatures(
  travelTimeFeatures: Feature[],
  arrowLayer: VectorLayer
) {
  arrowLayer.removeAllFeatures()
  arrowLayer.addFeatures(travelTimeFeatures)
}

function arrowStyleFunction(
  feature: FeatureLike,
  selected: TravelTimeModel,
  arrowColor: string,
  end: ArrowEnd
) {
  return new ArcStyle({
    width: selected?.id === feature.get('id') ? 3 : 1.5,
    arcFactor: arcFactor,
    color: arrowColor,
    end: end,
  })
}

export function updateArrowLayerStyle(
  arrowLayer: VectorLayer,
  is3D: boolean,
  selected: TravelTimeModel,
  // False negative: Property 'END' does not exist on type 'typeof ArrowEnd'
  // @ts-ignore
  end: ArrowEnd = ArrowEnd.END
) {
  // Update arrow's style
  let arrowColor = '#000000'
  if (is3D) {
    arrowColor = '#FFFFFF'
  }

  arrowLayer.setStyle((f) => arrowStyleFunction(f, selected, arrowColor, end))
}
