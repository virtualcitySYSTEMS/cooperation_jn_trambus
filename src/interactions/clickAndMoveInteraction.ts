import {
  AbstractInteraction,
  EventType,
  ModificationKeyType,
  PointerKeyType,
  vcsLayerName,
  GeoJSONLayer,
  type OpenlayersMap,
  type CesiumMap,
  type InteractionEvent,
} from '@vcmap/core'
import { useStationsStore } from '@/stores/stations'
import { useLineViewsStore, useViewsStore } from '@/stores/views'
import { useLineInteractionStore } from '@/stores/interactionMap'
import router from '@/router'
import { viewList } from '@/model/views.model'
import type { RennesApp } from '@/services/RennesApp'
import { RENNES_LAYER } from '@/stores/layers'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import { Style } from 'ol/style'

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
      if ([viewList.line, viewList.station].includes(viewStore.currentView)) {
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

  isFeatureLine(feature: Feature, lines: string[]) {
    const id = feature.getId()
    if (id === undefined) {
      return false
    }
    if (!id.toString().includes('trambus_lignes')) {
      return false
    }
    const li_nom = feature.get('li_nom')
    if (li_nom === undefined || li_nom === null || li_nom === '') {
      return false
    }
    if (lines.includes(li_nom)) {
      return false
    }
    return true
  }

  getAllLines(event: InteractionEvent) {
    const lines: string[] = []
    if (event.map.className === 'OpenlayersMap') {
      const map = event.map as OpenlayersMap
      map.olMap.forEachFeatureAtPixel(
        [event.windowPosition.x, event.windowPosition.y],
        (feat: Feature) => {
          if (this.isFeatureLine(feat, lines)) {
            lines.push(feat.get('li_nom'))
          }
        },
        { hitTolerance: 10 }
      )
    } else if (event.map.className === 'CesiumMap') {
      const cesiumMap = event.map as CesiumMap
      const scene = cesiumMap.getScene()
      const pickedObjects = scene.drillPick(event.windowPosition)
      pickedObjects.forEach((object) => {
        if (object.primitive && object.primitive.olFeature) {
          const feature = object.primitive.olFeature
          if (this.isFeatureLine(feature, lines)) {
            lines.push(feature.get('li_nom'))
          }
        }
      })
    }
    return lines
  }

  async _interactionLine(event: InteractionEvent) {
    document.body.style.cursor = 'pointer'
    if (event.type & EventType.CLICK) {
      if (event.position === undefined) {
        return
      }
      const lines = this.getAllLines(event)
      const lineInteractionStore = useLineInteractionStore()
      lineInteractionStore.selectLines(lines)
      lineInteractionStore.selectClickPosition(event.windowPosition)

      const customLayer: GeoJSONLayer = this._rennesApp.layers.getByKey(
        RENNES_LAYER.customLayerLabelLine
      ) as GeoJSONLayer
      await customLayer.fetchData()

      const new_feature = new Feature()
      const point = new Point(event.position)
      new_feature.setGeometry(point.transform('EPSG:3857', 'EPSG:4326'))
      new_feature.setStyle(new Style({}))
      customLayer.removeAllFeatures()
      customLayer.addFeatures([new_feature])
      lineInteractionStore.selectFeatureLabel(new_feature)
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
