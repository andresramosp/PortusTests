export default {}

import { MarkerClass } from "@/common/enums"; 

// Recursos de Tiles y Markers
export const MapResources = [
  {
    id: 1,
    type: 'TimeLineLayer',
    name: 'Nivel del Mar',
    resourceApi: 'mapTileResources/RES',
    tms: true
  },
  {
    id: 2,
    type: 'MarkerLayer',
    name: 'Nivmar Puertos',
    resourceApi: 'ubicacionesNivmar/Puerto',
    markerClass: MarkerClass.UBICACION,
    minZoom: 0,
    icon: 'nivmar-puerto.png'
  },
  {
    id: 3,
    type: 'MarkerLayer',
    name: 'Nivmar Localidades',
    resourceApi: 'ubicacionesNivmar/Localidad',
    markerClass: MarkerClass.UBICACION,
    minZoom: 7,
    icon: 'nivmar-localidad.png'
  },
  {
    id: 4,
    type: 'MarkerLayer',
    name: 'Nivmar Playas',
    resourceApi: 'ubicacionesNivmar/Playa',
    markerClass: MarkerClass.UBICACION,
    minZoom: 8,
    icon: 'nivmar-playa.png'
  },
  {
    id: 5,
    type: 'TimeLineLayer',
    name: 'Oleaje Atlántico',
    resourceApi: 'mapTileResources/VHM0Atl',
    tms: true,
    vectors: true,
    predictionTime: 72
  },
  {
    id: 6,
    type: 'TimeLineLayer',
    name: 'Oleaje Mediterráneo',
    resourceApi: 'mapTileResources/VHM0Med',
    tms: true,
    vectors: true
  },
  {
    id: 7,
    type: 'TimeLineLayer',
    name: 'Oleaje',
    resourceApi: 'mapTileResources/VHM0',
    tms: true,
    vectors: true
  },
  {
    id: 8,
    type: 'TimeLineLayer',
    name: 'Corriente',
    resourceApi: 'mapTileResources/CURR/circulation',
    tms: true,
    vectors: true
  },
  {
    id: 9,
    type: 'TimeLineLayer',
    name: 'Temperatura',
    resourceApi: 'mapTileResources/SST',
    tms: true
  },
  {
    id: 10,
    type: 'TimeLineLayer',
    name: 'Viento',
    resourceApi: 'mapTileResources/WSPD',
    tms: true,
    vectors: true,
    defaultVectors: true
  },
  {
    id: 11,
    type: 'TimeLineLayer',
    name: 'Salinidad',
    resourceApi: 'mapTileResources/SAL',
    tms: true,
    predictionTime: 120 // Está en BD?
  },
  {
    id: 12,
    type: 'MarkerLayer',
    name: 'Puntos Cirana',
    resourceApi: 'puntosMalla/Cirana',
    markerClass: MarkerClass.PUNTO_MALLA,
    minZoom: 0,
    icon: 'punto-malla-cirana.png'
  },
  {
    id: 16,
    type: 'MarkerLayer',
    name: 'Puntos Wana Atl.',
    resourceApi: 'puntosMalla/Wana/atl',
    markerClass: MarkerClass.PUNTO_MALLA,
    minZoom: 0,
    icon: 'punto-malla-wana.png'
  },
  {
    id: 17,
    type: 'MarkerLayer',
    name: 'Puntos Wana Med.',
    resourceApi: 'puntosMalla/Wana/med',
    markerClass: MarkerClass.PUNTO_MALLA,
    minZoom: 0,
    icon: 'punto-malla-wana.png'
  },
  {
    id: 18,
    type: 'MarkerLayer',
    name: 'Puntos Atmósfera',
    resourceApi: 'puntosMalla/Atmosfera',
    markerClass: MarkerClass.PUNTO_MALLA,
    minZoom: 0,
    icon: 'punto-malla-atmosfera.png'
  },
  {
    id: 19,
    type: 'TileLayer',
    name: 'Prueba TileLayer',
    resourceUrl: 'https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png'
  },
  // {
  //   id: 19,
  //   type: 'MarkerLayer',
  //   name: 'Verificación Atmósfera',
  //   resourceApi: 'puntosMalla/atmosfera',
  //   markerClass: MarkerClass.PUNTO_MALLA,
  //   minZoom: 0,
  //   icon: 'nivmar-puerto.png'
  // },
  {
    id: 13,
    type: 'MarkerLayer',
    name: 'RT - Oleaje',
    resourceApi: 'estaciones/RT_WAVE',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
      if (m.propagacion) {
        return (m.estado > 0) ? 'estacion-oleaje-prop-na.png' : 'estacion-oleaje-prop.png'
      }
      else {
        return (1 <= m.estado && m.estado <= 2) ? 'estacion-oleaje-na.png' : 'estacion-oleaje.png'
      }
    },
    showAll: true,
    locale: true,
    cached: true
  },
  {
    id: 14,
    type: 'MarkerLayer',
    name: 'RT - Nivel del Mar',
    resourceApi: 'estaciones/RT_SEA_LEVEL',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
      if (m.propagacion) {
        return (m.estado > 0) ? 'estacion-oleaje-prop-na.png' : 'estacion-oleaje-prop.png'
      }
      else {
        return (1 <= m.estado && m.estado <= 2) ? 'estacion-oleaje-na.png' : 'estacion-oleaje.png'
      }
    },
    showAll: true,
    locale: true,
    cached: true
  },
  {
    id: 15,
    type: 'MarkerLayer',
    name: 'RT - Agitacion',
    resourceApi: 'estaciones/RT_AGITATION',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
      if (m.propagacion) {
        return (m.estado > 0) ? 'estacion-oleaje-prop-na.png' : 'estacion-oleaje-prop.png'
      }
      else {
        return (1 <= m.estado && m.estado <= 2) ? 'estacion-oleaje-na.png' : 'estacion-oleaje.png'
      }
    },
    showAll: true,
    locale: true,
    cached: true
  }
];

// Checkboxes 
export const MapOptions = [
  { id: 'pred_nivmar', group: 'predicciones', name: 'Nivel del Mar', mapResources: [1, 2, 3, 4] },
  { id: 'pred_corrientes', group: 'predicciones', name: 'Corrientes', mapResources: [8, 12] },
  { id: 'pred_temperatura', group: 'predicciones', name: 'Temperatura', mapResources: [9, 12] },
  { id: 'pred_oleaje_atl', group: 'predicciones', name: 'Oleaje Atl', mapResources: [5, 16] }, // 7
  { id: 'pred_oleaje_med', group: 'predicciones', name: 'Oleaje Med', mapResources: [6, 17] }, // 7
  { id: 'pred_viento', group: 'predicciones', name: 'Viento', mapResources: [10, 18] },
  { id: 'pred_salinidad', group: 'predicciones', name: 'Salinidad', mapResources: [11, 12] },
  { id: 'tr_oleaje', group: 'tiempo_real', name: 'Oleaje', mapResources: [13] },
  { id: 'tr_nivmar', group: 'tiempo_real', name: 'Nivel del Mar', mapResources: [14] },
  { id: 'tr_agitacion', group: 'tiempo_real', name: 'Agitación', mapResources: [15] }
]
