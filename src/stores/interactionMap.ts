// import { ref } from 'vue'
// import type { Ref } from 'vue'
// import { defineStore } from 'pinia'
// import { Cartesian2 } from '@vcmap/cesium'
// import type { GeoJSONLayer } from '@vcmap/core'
// import { VcsApp } from '@vcmap/core'
// import { RENNES_LAYERS } from '@/stores/layers'
// import type { Feature, Geometry, Coordinate } from 'ol'
// import { getBalloonPosition } from '@/helpers/balloonHelper'
// import {
//   getFeatureByIdFromLayer,
//   getFeatureByName,
//   getCartesianPositionFromFeature,
// } from '@/helpers/featureHelper'

// export const useComponentAboveMapStore = defineStore(
//   'component-above-map',
//   () => {
//     const vcsApp: Ref<VcsApp | null> = ref(null)
//     const cartesian: Ref<Cartesian2 | null> = ref(null)
//     const labelsStationsList: Ref<
//       {
//         stationName: string
//         feature: Feature<Geometry>
//         cartesian: Cartesian2
//       }[]
//     > = ref([])

//     function setVcsApp(app: VcsApp) {
//       vcsApp.value = app
//     }

//     function addLabelStation(stationName: string) {
//       if (vcsApp.value === null) {
//         return
//       }
//       const labelsFilter = labelsStationsList.value.filter(
//         (label) => label.stationName == stationName
//       )
//       if (labelsFilter.length == 0) {
//         const feature: Feature<Geometry> = getFeatureByName(
//           vcsApp.value,
//           RENNES_LAYERS[6],
//           stationName
//         )
//         labelsStationsList.value.push({
//           stationName: stationName,
//           feature: feature,
//           cartesian: getCartesianPositionFromFeature(vcsApp.value, feature),
//         })
//       }

//       // labelsStationsList.value.forEach(label => console.log(label))
//     }

//     async function addFeatureLinkedToComponent(feature_id: string) {
//       if (vcsApp.value !== null) {
//         const feature: Feature<Geometry> = await getFeatureByIdFromLayer(
//           vcsApp.value,
//           RENNES_LAYERS[6],
//           feature_id
//         )
//       }
//     }

//     function setCartesian(new_cartesian: Cartesian2 | null) {
//       cartesian.value = new_cartesian
//     }

//     function updatePositionsComponents(vcsApp: VcsApp) {
//       const layer: GeoJSONLayer = vcsApp.layers.getByKey(
//         RENNES_LAYERS[6]
//       ) as GeoJSONLayer
//       const feature: Feature<Geometry> = layer.getFeatureById(
//         'trambus_arrets.1548'
//       )
//       const geometry: Geometry = feature.getGeometry()
//       const coordinates: Coordinate = geometry.getCoordinates()
//       const cartesian = getBalloonPosition(vcsApp, coordinates)
//       setCartesian(cartesian)
//     }

//     return {
//       cartesian,
//       setCartesian,
//       setVcsApp,
//       updatePositionsComponents,
//       addFeatureLinkedToComponent,
//       addLabelStation,
//     }
//   }
// )
