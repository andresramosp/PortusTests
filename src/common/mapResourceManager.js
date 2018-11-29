export default {}

import { MarkerClass, VariableType } from "@/common/enums";

// Recursos de Tiles y Markers
export const MapResources = [
  {
    id: 'pred-tiles-nivmar',
    type: 'TimeLineLayer',
    name: 'Pred. Nivel del Mar',
    resourceApi: 'mapTileResources/portus/RES',
    mapsResourceApi: 'mapStaticResources/RES',
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
    id: 'pred-tiles-oleaje-atl-portus',
    type: 'TimeLineLayer',
    name: 'Pred. Oleaje Atl Portus',
    resourceApi: 'mapTileResources/portus/VHM0Atl',
    mapsResourceApi: 'mapStaticResources/VHM0Atl',
    tms: true,
    vectors: true,
    groupLayersBy: { field: 'modelo', label: 'Modelo' },
  },
  {
    id: 'pred-tiles-oleaje-atl-ocaso',
    type: 'TimeLineLayer',
    name: 'Pred. Oleaje Atl Ocaso',
    resourceApi: 'mapTileResources/ocaso/VHM0Atl',
    mapsResourceApi: 'mapStaticResources/VHM0Atl',
    tms: true,
    vectors: true,
    groupLayersBy: { field: 'modelo', label: 'Modelo' }
  },
  {
    id: 'pred-tiles-oleaje-med',
    type: 'TimeLineLayer',
    name: 'Pred. Oleaje Mediterráneo',
    resourceApi: 'mapTileResources/portus/VHM0Med',
    mapsResourceApi: 'mapStaticResources/VHM0Med',
    tms: true,
    vectors: true
  },
  {
    id: 'pred-tiles-oleaje',
    type: 'TimeLineLayer',
    name: 'Pred. Oleaje',
    resourceApi: 'mapTileResources/portus/VHM0',
    tms: true,
    vectors: true
  },
  {
    id: 'pred-tiles-corriente',
    type: 'TimeLineLayer',
    name: 'Pred. Corriente',
    resourceApi: 'mapTileResources/portus?idOperativa=circulation&idVariable=CURR',
    tms: true,
    vectors: true,
    paintBounds: false,
    groupLayersBy: { field: 'idOperativa', label: 'Operativa' },
  },
  {
    id: 'pred-tiles-corriente-radar',
    type: 'TimeLineLayer',
    name: 'Pred. Corriente Radar',
    resourceApi: 'mapTileResources/portus?idOperativa=radar&idVariable=CURR',
    tms: true,
    vectors: true,
    defaultVectors: true,
    paintBounds: true,
    groupLayersBy: { field: 'idOperativa', label: 'Operativa' }
  },
  {
    id: 'pred-tiles-temperatura',
    type: 'TimeLineLayer',
    name: 'Pred. Temperatura',
    resourceApi: 'mapTileResources/portus/SST',
    //groupLayersBy: { field: 'idDominio', label: 'Dominio' },
    tms: true
  },
  {
    id: 'pred-tiles-viento',
    type: 'TimeLineLayer',
    name: 'Pred. Viento',
    resourceApi: 'mapTileResources/portus/WSPD',
    mapsResourceApi: 'mapStaticResources/WSPD',
    tms: true,
    vectors: true,
    defaultVectors: true
  },
  {
    id: 'pred-tiles-salinidad',
    type: 'TimeLineLayer',
    name: 'Pred. Salinidad',
    resourceApi: 'mapTileResources/portus/SAL',
    //groupLayersBy: { field: 'idDominio', label: 'Dominio' },
    tms: true
  },
  {
    id: 'pred-markers-cirana',
    type: 'MarkerLayer',
    name: 'Puntos Modelo',
    resourceApi: 'puntosMalla/pred/Cirana',
    markerClass: MarkerClass.PUNTO_MALLA,
    minZoom: 0,
    groupLayersBy: { field: 'malla', label: 'Malla' },
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
    groupLayersBy: { field: 'malla', label: 'Malla' },
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
    groupLayersBy: { field: 'tipoSensor', label: 'Sensor', defaultVisibles: ['Direccional', 'Direccional Met-Oce'] },
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
    //groupLayersBy: { field: 'tipoSensor', label: 'Sensor' },
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
    cached: false,
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
    cached: false,
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
    cached: false,
    preventHeaping: true,
    groupLayersBy: { field: 'redId', label: 'red'}
  },
  {
    id: 'rt-markers-antenas-corrientes',
    type: 'MarkerLayer',
    name: 'Antenas Radares',
    resourceApi: 'antenas',
    markerClass: MarkerClass.ANTENA_RADAR,
    //minZoom: 7, 
    icon: 'antena-corrientes.png',
    showAll: false,
    locale: true,
    cached: false,
    iconSize: [25, 25],
    preventHeaping: false
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
    markerClass: MarkerClass.PUNTO_MALLA_HISTORICO, 
    minZoom: 0,
    iconSize: [25, 25],
    icon: 'punto-malla-hist-oleaje.png', 
  },
  {
    id: 'hist-markers-estaciones-viento',
    type: 'MarkerLayer',
    name: 'Historico - Viento',
    resourceApi: 'estaciones/hist/WIND',
    markerClass: MarkerClass.ESTACION_HISTORICO,
    minZoom: 0,
    icon: 'estacion-hist-viento.png',
    iconSize: [25, 25],
    showAll: true,
    locale: true,
    cached: true,
    preventHeaping: true
  },
  {
    id: 'hist-markers-estaciones-corrientes',
    type: 'MarkerLayer',
    name: 'Historico - Corrientes',
    resourceApi: 'estaciones/hist/CURRENTS',
    markerClass: MarkerClass.ESTACION_HISTORICO,
    minZoom: 0,
    icon: 'estacion-hist-corrientes.png',
    iconSize: [25, 25],
    showAll: true,
    locale: true,
    cached: true,
    preventHeaping: true
  }
];

// Checkboxes 
export const MapOptions = [
  // Predicciones
  {
    id: 'pred_oleaje_atl',
    group: '{prediccionesGroup}',
    name: '{oleajeAtlanticoOption}',
    variableType: VariableType.WAVE,
    mapResources: ['pred-tiles-oleaje-atl-portus', 'pred-tiles-oleaje-atl-ocaso', 'pred-markers-wana-atl', 'pred-markers-wana-atl-verif'] // 'pred-tiles-oleaje'
  },
  {
    id: 'pred_oleaje_med',
    group:  '{prediccionesGroup}',
    name: '{oleajeMeditOption}',
    variableType: VariableType.WAVE,
    mapResources: ['pred-tiles-oleaje-med', 'pred-markers-wana-med', 'pred-markers-wana-med-verif'] // 'pred-tiles-oleaje'
  },
  {
    id: 'pred_viento',
    group:  '{prediccionesGroup}',
    name: '{vientoOption}',
    variableType: VariableType.WIND,
    mapResources: ['pred-tiles-viento', 'pred-markers-atmosfera', 'pred-markers-atmosfera-verif']
  },
  {
    id: 'pred_nivmar',
    group:  '{prediccionesGroup}',
    name: '{nivelDelMarOption}',
    variableType: VariableType.SEA_LEVEL,
    mapResources: ['pred-tiles-nivmar', 'pred-markers-nivmar-puerto', 'pred-markers-nivmar-localidad', 'pred-markers-nivmar-playa']
  },
  {
    id: 'pred_corrientes',
    group:  '{prediccionesGroup}',
    name: '{corrientesOption}',
    variableType: VariableType.CURRENTS,
    mapResources: ['pred-tiles-corriente', 'pred-markers-cirana']
  },
  {
    id: 'pred_temperatura',
    group:  '{prediccionesGroup}',
    name: '{temperaturaOption}',
    variableType: VariableType.WATER_TEMP,
    mapResources: ['pred-tiles-temperatura', 'pred-markers-cirana']
  },
  {
    id: 'pred_salinidad',
    group:  '{prediccionesGroup}',
    name: '{salinidadOption}',
    variableType: VariableType.SALINITY,
    mapResources: ['pred-tiles-salinidad', 'pred-markers-cirana']
  },
  // Tiempo Real
  {
    id: 'tr_oleaje',
    group: '{tiempoRealGroup}',
    name: '{oleajeOption}',
    variableType: VariableType.WAVE,
    mapResources: ['rt-markers-ojeale']
  },
  {
    id: 'tr_nivmar',
    group: '{tiempoRealGroup}',
    name: '{nivelDelMarOption}',
    variableType: VariableType.SEA_LEVEL,
    mapResources: ['rt-markers-nivmar']
  },
  {
    id: 'tr_onda_larga',
    group: '{tiempoRealGroup}',
    name: '{ondaLargaOption}',
    variableType: VariableType.SEICHE,
    mapResources: ['rt-markers-onda-larga']
  },
  {
    id: 'tr_agitacion',
    group: '{tiempoRealGroup}',
    name: '{agitacionOption}',
    variableType: VariableType.AGITATION,
    mapResources: ['rt-markers-agitacion']
  },
  {
    id: 'tr_viento',
    group: '{tiempoRealGroup}',
    name: '{vientoOption}',
    variableType: VariableType.WIND,
    mapResources: ['rt-markers-viento']
  },
  {
    id: 'tr_pres_aire',
    group: '{tiempoRealGroup}',
    name: '{presionAtmOption}',
    variableType: VariableType.AIR_PRESURE,
    mapResources: ['rt-markers-presion-aire']
  },
  {
    id: 'tr_temp_agua',
    group: '{tiempoRealGroup}',
    name: '{temperaturaOption}',
    variableType: VariableType.WATER_TEMP,
    mapResources: ['rt-markers-temperatura-agua']
  },
  {
    id: 'tr_temp_aire',
    group: '{tiempoRealGroup}',
    name: '{temperaturaAireOption}',
    variableType: VariableType.AIR_TEMP,
    mapResources: ['rt-markers-temperatura-aire']
  },
  {
    id: 'tr_corrientes',
    group: '{tiempoRealGroup}',
    name: '{corrientesOption}',
    variableType: VariableType.CURRENTS,
    mapResources: ['rt-markers-corrientes', 'pred-tiles-corriente-radar', 'rt-markers-antenas-corrientes']
  },
  {
    id: 'tr_salinidad',
    group: '{tiempoRealGroup}',
    name: '{salinidadOption}',
    variableType: VariableType.SALINITY,
    mapResources: ['rt-markers-salinidad']
  },
  // Histórico
  {
    id: 'hist_oleaje',
    group: '{historicoGroup}',
    name: '{oleajeOption}',
    variableType: VariableType.WAVE,
    mapResources: ['hist-markers-estaciones-oleaje', 'hist-markers-modelos-oleaje']
  },
  {
    id: 'hist_salinidad',
    group: '{historicoGroup}',
    name: '{salinidadOption}',
    variableType: VariableType.SALINITY,
    mapResources: ['hist-markers-estaciones-salinidad']
  },
  {
    id: 'hist_viento',
    group: '{historicoGroup}',
    name: '{vientoOption}',
    variableType: VariableType.WIND,
    mapResources: ['hist-markers-estaciones-viento']
  },
  {
    id: 'hist_corrientes',
    group: '{historicoGroup}',
    name: '{corrientesOption}',
    variableType: VariableType.CURRENTS,
    mapResources: ['hist-markers-estaciones-corrientes']
  }

]
