//@ts-nocheck
import {
  AbstractInteraction,
  EventType,
  ModificationKeyType,
  PointerKeyType,
  vcsLayerName,
  type InteractionEvent,
} from '@vcmap/core'
import type { Feature } from 'ol'
import type { Point } from 'ol/geom'
import { useStationsStore } from '@/stores/stations'
import { useLineViewsStore, useViewsStore } from '@/stores/views'
import { useLineInteractionStore } from '@/stores/interactionMap'
import router from '@/router'
import { viewList } from '@/model/views.model'
import type { RennesApp } from '@/services/RennesApp'
import { RENNES_LAYER } from '@/stores/layers'
import { Feature } from 'ol'
import { Point } from 'ol/geom'

class mapClickAndMoveInteraction extends AbstractInteraction {
  private _rennesApp: RennesApp

  constructor(rennesApp: RennesApp) {
    super(EventType.CLICKMOVE, ModificationKeyType.NONE, PointerKeyType.ALL)
    this._rennesApp = rennesApp
  }

  _interactionStation(event: InteractionEvent) {
    const stationsStore = useStationsStore()
    document.body.style.cursor = 'pointer'
    const feature: Feature<Point> = event.feature as Feature<Point>
    const stationName = feature?.get('nom')
    if (event.type & EventType.CLICK) {
      const viewStore = useViewsStore()
      if (viewStore.currentView == viewList.line) {
        const lineViewStore = useLineViewsStore()
        const lineNumber = lineViewStore.selectedLine
        const stationId = feature?.get('id')
        router.push(`/line/${lineNumber}/station/${stationId}`)
      }
    } else if (event.type & EventType.MOVE) {
      stationsStore.addStationToDisplay(stationName)
      stationsStore.flagClearStationsExceptPermanently = true
    }
  }

  getAllLines(event: InteractionEvent) {
    const lines: string[] = []
    if (event.map.className === 'OpenlayersMap') {
      event.map.olMap.forEachFeatureAtPixel(
        [event.windowPosition.x, event.windowPosition.y],
        (feat, layer) => {
          RENNES_LAYER
          console.log(layer)
          const li_nom = feat.get('li_nom')
          if (!lines.includes(li_nom)) {
            lines.push(li_nom)
          }
        },
        { hitTolerance: 10 }
      )
    } else if (event.map.className === 'CesiumMap') {
      const cesiumMap = event.map
      const scene = cesiumMap.getScene()
      const pickedObjects = scene.drillPick(event.windowPosition)
      pickedObjects.forEach((object) => {
        if (object.primitive && object.primitive.olFeature) {
          const feature = object.primitive.olFeature
          const li_nom = feature.get('li_nom')
          if (!lines.includes(li_nom)) {
            lines.push(li_nom)
          }
        }
      })
    }
    return lines
  }

  async _interactionLine(event: InteractionEvent) {
    document.body.style.cursor = 'pointer'
    if (event.type & EventType.CLICK) {
      const lines = this.getAllLines(event)
      const lineInteractionStore = useLineInteractionStore()
      lineInteractionStore.selectLines(lines)
      lineInteractionStore.selectClickPosition(event.windowPosition)

      if (this._rennesApp.layers.hasKey('customLayer')) {
        const customLayer: GeoJSONLayer = this._rennesApp.layers.getByKey(
          'customLayer'
        ) as GeoJSONLayer
        await customLayer.fetchData()

        const new_feature = new Feature()
        const point = new Point(event.position)
        new_feature.setGeometry(point.transform('EPSG:3857', 'EPSG:4326'))
        customLayer.removeAllFeatures()
        customLayer.addFeatures([new_feature])
        lineInteractionStore.selectFeatureLabel(new_feature)
      }
    }
  }

  async pipe(event: InteractionEvent): Promise<InteractionEvent> {
    const isFeatureTrambusStpos =
      event.feature?.[vcsLayerName] === RENNES_LAYER.trambusStops
    const isFeatureLine =
      event.feature?.[vcsLayerName] === RENNES_LAYER.trambusLines

    if (isFeatureTrambusStpos) {
      this._interactionStation(event)
    } else if (isFeatureLine) {
      await this._interactionLine(event)
    } else {
      const stationsStore = useStationsStore()
      if (stationsStore.flagClearStationsExceptPermanently) {
        stationsStore.clearStationsExceptPermanently()
        stationsStore.flagClearStationsExceptPermanently = false
      }

      document.body.style.cursor = 'auto'
    }
    return event
  }
}

export default mapClickAndMoveInteraction
