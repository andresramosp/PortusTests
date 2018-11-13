export default {}

import { MarkerClass } from "@/common/enums";

// Recursos de Tiles y Markers
export const MapResources = [
  {
    id: 'pred-tiles-nivmar',
    type: 'TimeLineLayer',
    name: 'Pred. Nivel del Mar',
    resourceApi: 'mapTileResources/RES',
    tms: true
  },
  {
    id: 'pred-markers-nivmar-puerto',
    type: 'MarkerLayer',
    name: 'Nivmar Puertos',
    resourceApi: 'ubicacionesNivmar/Puerto',
    markerClass: MarkerClass.UBICACION,
    minZoom: 0,
    icon: 'nivmar-puerto.png',
    cached: true
  },
  {
    id: 'pred-markers-nivmar-localidad',
    type: 'MarkerLayer',
    name: 'Nivmar Localidades',
    resourceApi: 'ubicacionesNivmar/Localidad',
    markerClass: MarkerClass.UBICACION,
    minZoom: 7,
    icon: 'nivmar-localidad.png',
    cached: true
  },
  {
    id: 'pred-markers-nivmar-playa',
    type: 'MarkerLayer',
    name: 'Nivmar Playas',
    resourceApi: 'ubicacionesNivmar/Playa',
    markerClass: MarkerClass.UBICACION,
    minZoom: 8,
    icon: 'nivmar-playa.png',
    cached: true
  },
  {
    id: 'pred-tiles-oleaje-atl',
    type: 'TimeLineLayer',
    name: 'Pred. Oleaje Atlántico',
    resourceApi: 'mapTileResources/VHM0Atl',
    tms: true,
    vectors: true,
    predictionTime: 72
  },
  {
    id: 'pred-tiles-oleaje-med',
    type: 'TimeLineLayer',
    name: 'Pred. Oleaje Mediterráneo',
    resourceApi: 'mapTileResources/VHM0Med',
    tms: true,
    vectors: true
  },
  {
    id: 'pred-tiles-oleaje',
    type: 'TimeLineLayer',
    name: 'Pred. Oleaje',
    resourceApi: 'mapTileResources/VHM0',
    tms: true,
    vectors: true
  },
  {
    id: 'pred-tiles-corriente',
    type: 'TimeLineLayer',
    name: 'Pred. Corriente',
    resourceApi: 'mapTileResources/CURR/circulation',
    tms: true,
    vectors: true
  },
  {
    id: 'pred-tiles-corriente-radar',
    type: 'TimeLineLayer',
    name: 'Pred. Corriente Radar',
    resourceApi: 'mapTileResources/CURR/radar',
    tms: true,
    vectors: true,
    defaultVectors: true,
    paintBounds: true
  },
  {
    id: 'pred-tiles-temperatura',
    type: 'TimeLineLayer',
    name: 'Pred. Temperatura',
    resourceApi: 'mapTileResources/SST',
    tms: true
  },
  {
    id: 'pred-tiles-viento',
    type: 'TimeLineLayer',
    name: 'Pred. Viento',
    resourceApi: 'mapTileResources/WSPD',
    tms: true,
    vectors: true,
    defaultVectors: true
  },
  {
    id: 'pred-tiles-salinidad',
    type: 'TimeLineLayer',
    name: 'Pred. Salinidad',
    resourceApi: 'mapTileResources/SAL',
    tms: true
  },
  {
    id: 'pred-markers-cirana',
    type: 'MarkerLayer',
    name: 'Puntos Modelo',
    resourceApi: 'puntosMalla/Cirana',
    markerClass: MarkerClass.PUNTO_MALLA,
    minZoom: 0,
    icon: 'punto-malla-cirana.png'
  },
  {
    id: 'pred-markers-wana-atl',
    type: 'MarkerLayer',
    name: 'Puntos Modelo',
    resourceApi: 'puntosMalla/Wana/atl',
    markerClass: MarkerClass.PUNTO_MALLA,
    minZoom: 0,
    icon: 'punto-malla-wana.png'
  },
  {
    id: 'pred-markers-wana-atl-verif',
    type: 'MarkerLayer',
    name: 'Verificación',
    resourceApi: 'puntosMalla/Wana/atl?verif=true',
    markerClass: MarkerClass.PUNTO_MALLA_VERIF,
    unchecked: true,
    minZoom: 0,
    icon: 'punto-malla-verif.png' 
  },
  {
    id: 'pred-markers-wana-med',
    type: 'MarkerLayer',
    name: 'Puntos Modelo',
    resourceApi: 'puntosMalla/Wana/med',
    markerClass: MarkerClass.PUNTO_MALLA,
    minZoom: 0,
    icon: 'punto-malla-wana.png'
  },
  {
    id: 'pred-markers-wana-med-verif',
    type: 'MarkerLayer',
    name: 'Verificación',
    resourceApi: 'puntosMalla/Wana/med?verif=true',
    markerClass: MarkerClass.PUNTO_MALLA_VERIF,
    unchecked: true,
    minZoom: 0,
    icon: 'punto-malla-verif.png'
  },
  {
    id: 'pred-markers-atmosfera',
    type: 'MarkerLayer',
    name: 'Puntos Modelo',
    resourceApi: 'puntosMalla/Atmosfera',
    markerClass: MarkerClass.PUNTO_MALLA,
    minZoom: 0,
    icon: 'punto-malla-atmosfera.png',
  },
  {
    id: 'pred-markers-atmosfera-verif',
    type: 'MarkerLayer',
    name: 'Verificación',
    resourceApi: 'puntosMalla/Atmosfera?verif=true',
    markerClass: MarkerClass.PUNTO_MALLA_VERIF,
    unchecked: true,
    minZoom: 0,
    icon: 'punto-malla-verif.png', 
  },
  {
    id: 'tile-layer-prueba',
    type: 'TileLayer',
    name: 'Prueba TileLayer',
    resourceUrl: 'https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png'
  },
  {
    id: 'rt-markers-ojeale',
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
    cached: false,
    preventHeaping: true
  },
  {
    id: 'rt-markers-nivmar',
    type: 'MarkerLayer',
    name: 'RT - Nivel del Mar',
    resourceApi: 'estaciones/RT_SEA_LEVEL',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-nivmar-na.png' : 'estacion-nivmar.png'
    },
    showAll: true,
    locale: true,
    cached: true
  },
  {
    id: 'rt-markers-agitacion',
    type: 'MarkerLayer',
    name: 'RT - Agitacion',
    resourceApi: 'estaciones/RT_AGITATION',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
       return (1 <= m.estado && m.estado <= 2) ? 'estacion-agitacion-na.png' : 'estacion-agitacion.png'
    },
    showAll: true,
    locale: true,
    cached: true
  },
  {
    id: 'rt-markers-viento',
    type: 'MarkerLayer',
    name: 'RT - Viento',
    resourceApi: 'estaciones/RT_WIND',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-viento-na.png' : 'estacion-viento.png'
    },
    showAll: true,
    locale: true,
    cached: true
  },
  {
    id: 'rt-markers-salinidad',
    type: 'MarkerLayer',
    name: 'RT - Salinidad',
    resourceApi: 'estaciones/RT_SALINITY',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-salinidad-na.png' : 'estacion-salinidad.png'
    },
    showAll: true,
    locale: true,
    cached: true
  },
  {
    id: 'rt-markers-presion-aire',
    type: 'MarkerLayer',
    name: 'RT - Presión Aire',
    resourceApi: 'estaciones/RT_AIR_PRESURE',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-presionAtm-na.png' : 'estacion-presionAtm.png'
    },
    showAll: true,
    locale: true,
    cached: true
  },
  {
    id: 'rt-markers-temperatura-agua',
    type: 'MarkerLayer',
    name: 'RT - Temp. Agua',
    resourceApi: 'estaciones/RT_WATER_TEMP',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-tempAgua-na.png' : 'estacion-tempAgua.png'
    },
    showAll: true,
    locale: true,
    cached: true
  },
  {
    id: 'rt-markers-temperatura-aire',
    type: 'MarkerLayer',
    name: 'RT - Temp. Aire',
    resourceApi: 'estaciones/RT_AIR_TEMP',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-tempAire-na.png' : 'estacion-tempAire.png'
    },
    showAll: true,
    locale: true,
    cached: true
  },
  {
    id: 'rt-markers-corrientes',
    type: 'MarkerLayer',
    name: 'Estaciones',
    resourceApi: 'estaciones/RT_CURRENTS',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-corriente-na.png' : 'estacion-corriente.png'
    },
    showAll: true,
    locale: true,
    cached: true
  },
  {
    id: 'rt-markers-onda-larga',
    type: 'MarkerLayer',
    name: 'RT - Onda Larga',
    resourceApi: 'estaciones/RT_SEICHE',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-ondaLarga-na.png' : 'estacion-ondaLarga.png'
    },
    showAll: true,
    locale: true,
    cached: true
  }
];

// Checkboxes 
export const MapOptions = [
  {
    id: 'pred_oleaje_atl',
    group: 'Predicciones',
    name: 'Oleaje Atlántico',
    mapResources: ['pred-tiles-oleaje-atl', 'pred-markers-wana-atl', 'pred-markers-wana-atl-verif'] // 'pred-tiles-oleaje'
  },
  {
    id: 'pred_oleaje_med',
    group: 'Predicciones',
    name: 'Oleaje Medit.',
    mapResources: ['pred-tiles-oleaje-med', 'pred-markers-wana-med', 'pred-markers-wana-med-verif'] // 'pred-tiles-oleaje'
  },
  {
    id: 'pred_viento',
    group: 'Predicciones',
    name: 'Viento',
    mapResources: ['pred-tiles-viento', 'pred-markers-atmosfera', 'pred-markers-atmosfera-verif']
  },
  {
    id: 'pred_nivmar',
    group: 'Predicciones',
    name: 'Nivel del Mar',
    mapResources: ['pred-tiles-nivmar', 'pred-markers-nivmar-puerto', 'pred-markers-nivmar-localidad', 'pred-markers-nivmar-playa']
  },
  {
    id: 'pred_corrientes',
    group: 'Predicciones',
    name: 'Corrientes',
    mapResources: ['pred-tiles-corriente', 'pred-markers-cirana']
  },
  {
    id: 'pred_temperatura',
    group: 'Predicciones',
    name: 'Temperatura',
    mapResources: ['pred-tiles-temperatura', 'pred-markers-cirana']
  },
  {
    id: 'pred_salinidad',
    group: 'Predicciones',
    name: 'Salinidad',
    mapResources: ['pred-tiles-salinidad', 'pred-markers-cirana']
  },
  {
    id: 'tr_oleaje',
    group: 'Tiempo Real',
    name: 'Oleaje',
    mapResources: ['rt-markers-ojeale']
  },
  {
    id: 'tr_nivmar',
    group: 'Tiempo Real',
    name: 'Nivel del Mar',
    mapResources: ['rt-markers-nivmar']
  },
  {
    id: 'tr_onda_larga',
    group: 'Tiempo Real',
    name: 'Onda Larga',
    mapResources: ['rt-markers-onda-larga']
  },
  {
    id: 'tr_agitacion',
    group: 'Tiempo Real',
    name: 'Agitación',
    mapResources: ['rt-markers-agitacion']
  },
  {
    id: 'tr_viento',
    group: 'Tiempo Real',
    name: 'Viento',
    mapResources: ['rt-markers-viento']
  },
  {
    id: 'tr_pres_aire',
    group: 'Tiempo Real',
    name: 'Presión Atm.',
    mapResources: ['rt-markers-presion-aire']
  },
  {
    id: 'tr_temp_agua',
    group: 'Tiempo Real',
    name: 'Temp. Agua',
    mapResources: ['rt-markers-temperatura-agua']
  },
  {
    id: 'tr_temp_aire',
    group: 'Tiempo Real',
    name: 'Temp. Aire',
    mapResources: ['rt-markers-temperatura-aire']
  },
  {
    id: 'tr_corrientes',
    group: 'Tiempo Real',
    name: 'Corrientes',
    mapResources: ['rt-markers-corrientes', 'pred-tiles-corriente-radar']
  },
  {
    id: 'tr_salinidad',
    group: 'Tiempo Real',
    name: 'Salinidad',
    mapResources: ['rt-markers-salinidad']
  }

]
