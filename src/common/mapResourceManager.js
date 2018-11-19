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
    cached: false
  },
  {
    id: 'pred-markers-nivmar-localidad',
    type: 'MarkerLayer',
    name: '{nivmarLocalidadesRes}',
    resourceApi: 'ubicacionesNivmar/Localidad',
    markerClass: MarkerClass.UBICACION,
    minZoom: 7,
    icon: 'nivmar-localidad.png',
    cached: false
  },
  {
    id: 'pred-markers-nivmar-playa',
    type: 'MarkerLayer',
    name: 'Nivmar Playas',
    resourceApi: 'ubicacionesNivmar/Playa',
    markerClass: MarkerClass.UBICACION,
    minZoom: 8,
    icon: 'nivmar-playa.png',
    cached: false
  },
  {
    id: 'pred-tiles-oleaje-atl',
    type: 'TimeLineLayer',
    name: 'Pred. Oleaje Atlántico',
    resourceApi: 'mapTileResources/VHM0Atl',
    tms: true,
    vectors: true
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
    resourceApi: 'puntosMalla/pred/Cirana',
    markerClass: MarkerClass.PUNTO_MALLA,
    minZoom: 0,
    icon: 'punto-malla-cirana.png'
  },
  {
    id: 'pred-markers-wana-atl',
    type: 'MarkerLayer',
    name: 'Puntos Modelo',
    resourceApi: 'puntosMalla/pred/Wana/atl',
    markerClass: MarkerClass.PUNTO_MALLA,
    minZoom: 0,
    icon: 'punto-malla-wana.png'
  },
  {
    id: 'pred-markers-wana-atl-verif',
    type: 'MarkerLayer',
    name: 'Verificación',
    resourceApi: 'puntosMalla/pred/Wana/atl?verif=true',
    markerClass: MarkerClass.PUNTO_MALLA_VERIF,
    unchecked: true,
    minZoom: 0,
    icon: 'punto-malla-verif.png' 
  },
  {
    id: 'pred-markers-wana-med',
    type: 'MarkerLayer',
    name: 'Puntos Modelo',
    resourceApi: 'puntosMalla/pred/Wana/med',
    markerClass: MarkerClass.PUNTO_MALLA,
    minZoom: 0,
    icon: 'punto-malla-wana.png'
  },
  {
    id: 'pred-markers-wana-med-verif',
    type: 'MarkerLayer',
    name: 'Verificación',
    resourceApi: 'puntosMalla/pred/Wana/med?verif=true',
    markerClass: MarkerClass.PUNTO_MALLA_VERIF,
    unchecked: true,
    minZoom: 0,
    icon: 'punto-malla-verif.png'
  },
  {
    id: 'pred-markers-atmosfera',
    type: 'MarkerLayer',
    name: 'Puntos Modelo',
    resourceApi: 'puntosMalla/pred/Atmosfera',
    markerClass: MarkerClass.PUNTO_MALLA,
    minZoom: 0,
    icon: 'punto-malla-atmosfera.png',
  },
  {
    id: 'pred-markers-atmosfera-verif',
    type: 'MarkerLayer',
    name: 'Verificación',
    resourceApi: 'puntosMalla/pred/Atmosfera?verif=true',
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
    resourceApi: 'estaciones/rt/WAVE',
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
    cached: true,
    preventHeaping: true
  },
  {
    id: 'rt-markers-nivmar',
    type: 'MarkerLayer',
    name: 'RT - Nivel del Mar',
    resourceApi: 'estaciones/rt/SEA_LEVEL',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-nivmar-na.png' : 'estacion-nivmar.png'
    },
    showAll: true,
    locale: true,
    cached: true,
    preventHeaping: true
  },
  {
    id: 'rt-markers-agitacion',
    type: 'MarkerLayer',
    name: 'RT - Agitacion',
    resourceApi: 'estaciones/rt/AGITATION',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
       return (1 <= m.estado && m.estado <= 2) ? 'estacion-agitacion-na.png' : 'estacion-agitacion.png'
    },
    showAll: true,
    locale: true,
    cached: true,
    preventHeaping: true
  },
  {
    id: 'rt-markers-viento',
    type: 'MarkerLayer',
    name: 'RT - Viento',
    resourceApi: 'estaciones/rt/WIND',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-viento-na.png' : 'estacion-viento.png'
    },
    showAll: true,
    locale: true,
    cached: true,
    preventHeaping: true
  },
  {
    id: 'rt-markers-salinidad',
    type: 'MarkerLayer',
    name: 'RT - Salinidad',
    resourceApi: 'estaciones/rt/SALINITY',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-salinidad-na.png' : 'estacion-salinidad.png'
    },
    iconSize: [25, 25],
    showAll: true,
    locale: true,
    cached: true,
    preventHeaping: true
  },
  {
    id: 'rt-markers-presion-aire',
    type: 'MarkerLayer',
    name: 'RT - Presión Aire',
    resourceApi: 'estaciones/rt/AIR_PRESURE',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-presionAtm-na.png' : 'estacion-presionAtm.png'
    },
    iconSize: [25, 25],
    showAll: true,
    locale: true,
    cached: true,
    preventHeaping: true
  },
  {
    id: 'rt-markers-temperatura-agua',
    type: 'MarkerLayer',
    name: 'RT - Temp. Agua',
    resourceApi: 'estaciones/rt/WATER_TEMP',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-tempAgua-na.png' : 'estacion-tempAgua.png'
    },
    showAll: true,
    locale: true,
    cached: true,
    preventHeaping: true
  },
  {
    id: 'rt-markers-temperatura-aire',
    type: 'MarkerLayer',
    name: 'RT - Temp. Aire',
    resourceApi: 'estaciones/rt/AIR_TEMP',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-tempAire-na.png' : 'estacion-tempAire.png'
    },
    showAll: true,
    locale: true,
    cached: true,
    preventHeaping: true
  },
  {
    id: 'rt-markers-corrientes',
    type: 'MarkerLayer',
    name: 'Estaciones',
    resourceApi: 'estaciones/rt/CURRENTS',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-corriente-na.png' : 'estacion-corriente.png'
    },
    showAll: true,
    locale: true,
    cached: true,
    preventHeaping: true
  },
  {
    id: 'rt-markers-onda-larga',
    type: 'MarkerLayer',
    name: 'RT - Onda Larga',
    resourceApi: 'estaciones/rt/SEICHE',
    markerClass: MarkerClass.ESTACION,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-ondaLarga-na.png' : 'estacion-ondaLarga.png'
    },
    showAll: true,
    locale: true,
    cached: true,
    preventHeaping: true
  },
  {
    id: 'hist-markers-estaciones-oleaje',
    type: 'MarkerLayer',
    name: 'Historico - Oleaje',
    resourceApi: 'estaciones/hist/WAVE',
    markerClass: MarkerClass.ESTACION_HISTORICO,
    minZoom: 0,
    icon: 'estacion-hist-oleaje.png',
    iconSize: [25, 25],
    showAll: true,
    locale: true,
    cached: true,
    preventHeaping: true
  },
  {
    id: 'hist-markers-estaciones-salinidad',
    type: 'MarkerLayer',
    name: 'Historico - Salinidad',
    resourceApi: 'estaciones/hist/SALINITY',
    markerClass: MarkerClass.ESTACION_HISTORICO,
    minZoom: 0,
    icon: 'estacion-hist-salinidad.png',
    iconSize: [25, 25],
    showAll: true,
    locale: true,
    cached: true,
    preventHeaping: true
  },
  {
    id: 'hist-markers-modelos-oleaje',
    type: 'MarkerLayer',
    name: 'Puntos modelo',
    resourceApi: 'puntosMalla/hist/WAVE',
    markerClass: MarkerClass.PUNTO_MALLA, // PUNTO_MALLA_HIST
    minZoom: 0,
    iconSize: [25, 25],
    icon: 'punto-malla-hist-oleaje.png', 
  },
];

// Checkboxes 
export const MapOptions = [
  // Predicciones
  {
    id: 'pred_oleaje_atl',
    group: '{prediccionesGroup}',
    name: '{oleajeAtlanticoOption}',
    mapResources: ['pred-tiles-oleaje-atl', 'pred-markers-wana-atl', 'pred-markers-wana-atl-verif'] // 'pred-tiles-oleaje'
  },
  {
    id: 'pred_oleaje_med',
    group:  '{prediccionesGroup}',
    name: '{oleajeMeditOption}',
    mapResources: ['pred-tiles-oleaje-med', 'pred-markers-wana-med', 'pred-markers-wana-med-verif'] // 'pred-tiles-oleaje'
  },
  {
    id: 'pred_viento',
    group:  '{prediccionesGroup}',
    name: '{vientoOption}',
    mapResources: ['pred-tiles-viento', 'pred-markers-atmosfera', 'pred-markers-atmosfera-verif']
  },
  {
    id: 'pred_nivmar',
    group:  '{prediccionesGroup}',
    name: '{nivelDelMarOption}',
    mapResources: ['pred-tiles-nivmar', 'pred-markers-nivmar-puerto', 'pred-markers-nivmar-localidad', 'pred-markers-nivmar-playa']
  },
  {
    id: 'pred_corrientes',
    group:  '{prediccionesGroup}',
    name: '{corrientesOption}',
    mapResources: ['pred-tiles-corriente', 'pred-markers-cirana']
  },
  {
    id: 'pred_temperatura',
    group:  '{prediccionesGroup}',
    name: '{temperaturaOption}',
    mapResources: ['pred-tiles-temperatura', 'pred-markers-cirana']
  },
  {
    id: 'pred_salinidad',
    group:  '{prediccionesGroup}',
    name: '{salinidadOption}',
    mapResources: ['pred-tiles-salinidad', 'pred-markers-cirana']
  },
  // Tiempo Real
  {
    id: 'tr_oleaje',
    group: '{tiempoRealGroup}',
    name: '{oleajeOption}',
    mapResources: ['rt-markers-ojeale']
  },
  {
    id: 'tr_nivmar',
    group: '{tiempoRealGroup}',
    name: '{nivelDelMarOption}',
    mapResources: ['rt-markers-nivmar']
  },
  {
    id: 'tr_onda_larga',
    group: '{tiempoRealGroup}',
    name: '{ondaLargaOption}',
    mapResources: ['rt-markers-onda-larga']
  },
  {
    id: 'tr_agitacion',
    group: '{tiempoRealGroup}',
    name: '{agitacionOption}',
    mapResources: ['rt-markers-agitacion']
  },
  {
    id: 'tr_viento',
    group: '{tiempoRealGroup}',
    name: '{vientoOption}',
    mapResources: ['rt-markers-viento']
  },
  {
    id: 'tr_pres_aire',
    group: '{tiempoRealGroup}',
    name: '{presionAtmOption}',
    mapResources: ['rt-markers-presion-aire']
  },
  {
    id: 'tr_temp_agua',
    group: '{tiempoRealGroup}',
    name: '{temperaturaOption}',
    mapResources: ['rt-markers-temperatura-agua']
  },
  {
    id: 'tr_temp_aire',
    group: '{tiempoRealGroup}',
    name: '{temperaturaAireOption}',
    mapResources: ['rt-markers-temperatura-aire']
  },
  {
    id: 'tr_corrientes',
    group: '{tiempoRealGroup}',
    name: '{corrientesOption}',
    mapResources: ['rt-markers-corrientes', 'pred-tiles-corriente-radar']
  },
  {
    id: 'tr_salinidad',
    group: '{tiempoRealGroup}',
    name: '{salinidadOption}',
    mapResources: ['rt-markers-salinidad']
  },
  //Histórico
  // {
  //   id: 'hist_oleaje',
  //   group: '{historicoGroup}',
  //   name: '{oleajeOption}',
  //   mapResources: ['hist-markers-estaciones-oleaje', 'hist-markers-modelos-oleaje']
  // },
  // {
  //   id: 'hist_salinidad',
  //   group: '{historicoGroup}',
  //   name: '{salinidadOption}',
  //   mapResources: ['hist-markers-estaciones-salinidad']
  // }

]
