export default {}

import { MarkerClass, VariableType, RedType } from "@/common/enums";
import MapState from "@/state/map.state";

// Recursos de Tiles y Markers
export const MapResources = [
  {
    id: 'pred-tiles-nivmar',
    type: 'TimeLineLayer',
    name: 'Pred. Nivel del Mar',
    resourceApi: 'mapTileResources/portus/RES',
    mapsResourceApi: 'mapStaticResources/RES',
    tms: true,
    nonToggleable: true
  },
  {
    id: 'pred-markers-nivmar-puerto',
    type: 'MarkerLayer',
    name: '{tipoUbicacionPuertoPlr}',
    resourceApi: 'ubicaciones/nivmar/Puerto',
    markerClass: MarkerClass.Ubicacion,
    minZoom: 0,
    icon: 'nivmar-puerto.png',
    //comboSelect: { id: 'nivmar',  defaultOption: 'Playas'  },
    cached: false
  },
  {
    id: 'pred-markers-nivmar-localidad',
    type: 'MarkerLayer',
    name: '{tipoUbicacionLocalidadPlr}',
    resourceApi: 'ubicaciones/nivmar/Localidad',
    markerClass: MarkerClass.Ubicacion,
    minZoom: 7,
    icon: 'nivmar-localidad.png',
    //comboSelect: { id: 'nivmar',  defaultOption: 'Playas'  },
    cached: false
  },
  {
    id: 'pred-markers-nivmar-playa',
    type: 'MarkerLayer',
    name: '{tipoUbicacionPlayaPlr}',
    resourceApi: 'ubicaciones/nivmar/Playa',
    markerClass: MarkerClass.Ubicacion,
    minZoom: 8,
    icon: 'nivmar-playa.png',
    //comboSelect: { id: 'nivmar',  defaultOption: 'Playas'  },
    cached: false
  },
  {
    id: 'pred-tiles-oleaje-atl',
    type: 'TimeLineLayer',
    name: 'Pred. Oleaje Atl Portus',
    resourceApi: 'mapTileResources/portus/VHM0Atl',
    mapsResourceApi: 'mapStaticResources/VHM0Atl',
    tms: true,
    vectors: true,
    nonToggleable: true
    //groupLayersBy: { field: 'modelo' },
    //comboSelect: { id: 'modelo_oleaje',  defaultOption: 'PORTUS'  }
  },
  {
    id: 'pred-tiles-oleaje-ocaso-atl',
    type: 'TimeLineLayer',
    name: 'Pred. Oleaje Atl Ocaso',
    resourceApi: 'mapTileResources/ocaso/VHM0Atl',
    mapsResourceApi: 'mapStaticResources/VHM0Atl',
    tms: true,
    vectors: true,
    //groupLayersBy: { field: 'modelo' },
    //comboSelect: { id: 'modelo_oleaje',  defaultOption: 'PORTUS'  }
  },
  {
    id: 'pred-tiles-oleaje-med',
    type: 'TimeLineLayer',
    name: 'Pred. Oleaje Mediterráneo',
    resourceApi: 'mapTileResources/portus/VHM0Med',
    mapsResourceApi: 'mapStaticResources/VHM0Med',
    tms: true,
    vectors: true,
    nonToggleable: true
  },
  {
    id: 'pred-tiles-oleaje',
    type: 'TimeLineLayer',
    name: 'Pred. Oleaje',
    resourceApi: 'mapTileResources/portus/VHM0',
    tms: true,
    vectors: true,
    nonToggleable: true
  },
  {
    id: 'pred-tiles-corriente',
    type: 'TimeLineLayer',
    name: 'Pred. Corriente',
    resourceApi: 'mapTileResources/portus?idOperativa=circulation&idVariable=CURR',
    tms: true,
    vectors: true,
    paintBounds: false,
    nonToggleable: true,
    onAdded: function () {
      var zoom = MapState.getMap().getZoom();
      if (zoom < 6) {
        var message = { 
          id: 'msgCurrents', 
          message: "{msgCurrentsDir}",
          ignorable: true
        }
        MapState.addNotifyMessage(message);
      }
    },
    onRemoved: function() {
      MapState.removeNotifyMessage('msgCurrents');
    }
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
    isRadar: true,
    nonToggleable: true
  },
  {
    id: 'pred-tiles-temperatura',
    type: 'TimeLineLayer',
    name: 'Pred. Temperatura',
    resourceApi: 'mapTileResources/portus/SST',
    //groupLayersBy: { comboSelectId: '123', field: 'idDominio', defaultOption: 'IBI' },
    //groupLayersBy: { comboSelectId: 'Dominios', field: 'idDominio', label: 'Dominio' },
    tms: true,
    nonToggleable: true
  },
  {
    id: 'pred-tiles-viento',
    type: 'TimeLineLayer',
    name: 'Pred. Viento',
    resourceApi: 'mapTileResources/portus/WSPD',
    mapsResourceApi: 'mapStaticResources/WSPD',
    tms: true,
    vectors: true,
    defaultVectors: true,
    nonToggleable: true
  },
  {
    id: 'pred-tiles-salinidad',
    type: 'TimeLineLayer',
    name: 'Pred. Salinidad',
    resourceApi: 'mapTileResources/portus/SAL',
    //groupLayersBy: { field: 'idDominio', label: 'Dominio' },
    tms: true,
    nonToggleable: true
  },
  {
    id: 'pred-markers-cirana',
    type: 'MarkerLayer',
    name: '{markersPredSubOption}',
    resourceApi: 'puntosMalla/pred/Cirana',
    markerClass: MarkerClass.PuntoMalla,
    minZoom: 0,
    //groupLayersBy: { field: 'malla', label: 'Malla' },
    icon: 'punto-malla-cirana.png',
    palette: "cirana"
  },
  {
    id: 'pred-markers-wana-atl',
    type: 'MarkerLayer',
    name: '{markersPredSubOption}',
    resourceApi: 'puntosMalla/pred/Wana/atl',
    markerClass: MarkerClass.PuntoMalla,
    minZoom: 0,
    icon: 'punto-malla-wana.png',
    // Para el caso de los markers oleaje convertimos la paleta en función
    // ya que la tabla incluye filas de los datos de viento y debemos discriminarlas
    palette:  function(data) {
      if (data.variableParametro == "WIND" || data.variableParametro == "VIENTO") {
        return "atmosfera";
      }
      else {
        return "wave_atl";
      }
    }
  },
  {
    id: 'pred-markers-wana-atl-verif',
    type: 'MarkerLayer',
    name: '{verifPredSubOption}',
    resourceApi: 'puntosMalla/pred/Wana/atl?verif=true',
    markerClass: MarkerClass.PuntoMallaVerif,
    unchecked: true,
    minZoom: 0,
    icon: 'punto-malla-verif.png',
    palette:  function(data) {
      if (data.variableParametro == "WIND" || data.variableParametro == "VIENTO") {
        return "atmosfera";
      }
      else {
        return "wave_atl";
      }
    }
  },
  {
    id: 'pred-markers-wana-med',
    type: 'MarkerLayer',
    name: '{markersPredSubOption}',
    resourceApi: 'puntosMalla/pred/Wana/med',
    markerClass: MarkerClass.PuntoMalla,
    //groupLayersBy: { field: 'malla', label: 'Malla' },
    minZoom: 0,
    icon: 'punto-malla-wana.png',
    palette:  function(data) {
      if (data.variableParametro == "WIND" || data.variableParametro == "VIENTO") {
        return "atmosfera";
      }
      else {
        return "wave_med";
      }
    }
  },
  {
    id: 'pred-markers-wana-med-verif',
    type: 'MarkerLayer',
    name: '{verifPredSubOption}',
    resourceApi: 'puntosMalla/pred/Wana/med?verif=true',
    markerClass: MarkerClass.PuntoMallaVerif,
    unchecked: true,
    minZoom: 0,
    icon: 'punto-malla-verif.png',
    palette:  function(data) {
      if (data.variableParametro == "WIND" || data.variableParametro == "VIENTO") {
        return "atmosfera";
      }
      else {
        return "wave_med";
      }
    }
  },
  {
    id: 'pred-markers-atmosfera',
    type: 'MarkerLayer',
    name: '{markersPredSubOption}',
    resourceApi: 'puntosMalla/pred/Atmosfera',
    markerClass: MarkerClass.PuntoMalla,
    minZoom: 0,
    icon: 'punto-malla-atmosfera.png',
    palette: "atmosfera"
  },
  {
    id: 'pred-markers-atmosfera-verif',
    type: 'MarkerLayer',
    name: '{verifPredSubOption}',
    resourceApi: 'puntosMalla/pred/Atmosfera?verif=true',
    markerClass: MarkerClass.PuntoMallaVerif,
    unchecked: true,
    minZoom: 0,
    icon: 'punto-malla-verif.png',
    palette: "atmosfera"
  },
  {
    id: 'rt-markers-ojeale',
    type: 'MarkerLayer',
    name: 'RT - Oleaje',
    resourceApi: 'estaciones/rt/WAVE',
    markerClass: MarkerClass.EstacionRT,
    minZoom: 0,
    icon: function (m) {
      if (m.red.tipoRed == RedType.PROPAGACION) {
        return (m.estado > 0) ? 'estacion-oleaje-prop-na.png' : 'estacion-oleaje-prop.png'
      }
      else {
        return (1 <= m.estado && m.estado <= 2) ? 'estacion-oleaje-na.png' : 'estacion-oleaje.png'
      }
    },
    showAll: true,
    locale: true,
    //cached: true,
    preventHeaping: true
  },
  {
    id: 'rt-markers-nivmar',
    type: 'MarkerLayer',
    name: 'RT - Nivel del Mar',
    resourceApi: 'estaciones/rt/SEA_LEVEL',
    markerClass: MarkerClass.EstacionRT,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-nivmar-na.png' : 'estacion-nivmar.png'
    },
    showAll: true,
    locale: true,
    cached: false,
    //groupLayersBy: { field: 'red', label: 'Red' },
    preventHeaping: true
  },
  {
    id: 'rt-markers-agitacion',
    type: 'MarkerLayer',
    name: 'RT - Agitacion',
    resourceApi: 'estaciones/rt/AGITATION',
    markerClass: MarkerClass.EstacionRT,
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
    markerClass: MarkerClass.EstacionRT,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-viento-na.png' : 'estacion-viento.png'
    },
    showAll: true,
    locale: true,
    //cached: true,
    preventHeaping: true
  },
  {
    id: 'rt-markers-salinidad',
    type: 'MarkerLayer',
    name: 'RT - Salinidad',
    resourceApi: 'estaciones/rt/SALINITY',
    markerClass: MarkerClass.EstacionRT,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-salinidad-na.png' : 'estacion-salinidad.png'
    },
    iconSize: [27, 27],
    showAll: true,
    locale: true,
    //cached: true,
    preventHeaping: true
  },
  {
    id: 'rt-markers-presion-aire',
    type: 'MarkerLayer',
    name: 'RT - Presión Aire',
    resourceApi: 'estaciones/rt/AIR_PRESURE',
    markerClass: MarkerClass.EstacionRT,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-presionAtm-na.png' : 'estacion-presionAtm.png'
    },
    iconSize: [27, 27],
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
    markerClass: MarkerClass.EstacionRT,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-tempAgua-na.png' : 'estacion-tempAgua.png'
    },
    showAll: true,
    locale: true,
    //cached: true,
    preventHeaping: true,
  },
  {
    id: 'rt-markers-temperatura-aire',
    type: 'MarkerLayer',
    name: 'RT - Temp. Aire',
    resourceApi: 'estaciones/rt/AIR_TEMP',
    markerClass: MarkerClass.EstacionRT,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-tempAire-na.png' : 'estacion-tempAire.png'
    },
    showAll: true,
    locale: true,
    //cached: true,
    preventHeaping: true
  },
  {
    id: 'rt-markers-corrientes',
    type: 'MarkerLayer',
    name: 'Estaciones',
    resourceApi: 'estaciones/rt/CURRENTS',
    markerClass: MarkerClass.EstacionRT,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-corriente-na.png' : 'estacion-corriente.png'
    },
    filter: function (m) {
      return !m.radar;
    },
    showAll: true,
    locale: true,
    cached: false,
    preventHeaping: true,
    nonToggleable: true
    //groupLayersBy: { field: 'tipoSensor', label: 'Sensor' },
    //groupLayersBy: { field: 'red.descripcion', label: 'Red' },
  },
  {
    id: 'rt-markers-antenas-corrientes',
    type: 'MarkerLayer',
    name: 'Antenas',
    resourceApi: 'antenas',
    markerClass: MarkerClass.AntenaRadar,
    //minZoom: 7, 
    icon: 'antena-corrientes.png',
    showAll: false,
    locale: true,
    cached: false,
    iconSize: [18, 18],
    preventHeaping: false,
    nonToggleable: true
  },
  {
    id: 'rt-markers-onda-larga',
    type: 'MarkerLayer',
    name: 'RT - Onda Larga',
    resourceApi: 'estaciones/rt/SEICHE',
    markerClass: MarkerClass.EstacionRT,
    minZoom: 0,
    icon: function (m) {
      return (1 <= m.estado && m.estado <= 2) ? 'estacion-ondaLarga-na.png' : 'estacion-ondaLarga.png'
    },
    showAll: true,
    locale: true,
    //cached: true,
    preventHeaping: true
  },
];

export const MapOptionsGroups = {
  groups: [
    { id: 'predicciones', name: '{prediccionesGroup}', nameMin: '{prediccionesGroupMin}', multiple: false },
    { id: 'tiempo_real', name: '{tiempoRealGroup}', nameMin: '{tiempoRealGroupMin}', multiple: true }
  ],
  agregations: [
    ['predicciones', 'tiempo_real']
  ]
}

export const MapOptions = [
  // Predicciones
  {
    id: 'pred_oleaje_atl',
    group: 'predicciones',
    name: '{oleajeAtlanticoOption}',
    variableType: VariableType.WAVE,
    iconClass: 'wave_atl',
    mapResources: ['pred-tiles-oleaje-atl', 'pred-tiles-oleaje', 'pred-markers-wana-atl', 'pred-markers-wana-atl-verif'] // 'pred-tiles-ocaso-oleaje'
  },
  {
    id: 'pred_oleaje_med',
    group: 'predicciones',
    name: '{oleajeMeditOption}',
    variableType: VariableType.WAVE,
    iconClass: 'wave_med',
    mapResources: ['pred-tiles-oleaje-med', 'pred-tiles-oleaje', 'pred-markers-wana-med', 'pred-markers-wana-med-verif'] 
  },
  {
    id: 'pred_viento',
    group: 'predicciones',
    name: '{vientoOption}',
    variableType: VariableType.WIND,
    iconClass: 'wind',
    mapResources: ['pred-tiles-viento', 'pred-markers-atmosfera', 'pred-markers-atmosfera-verif']
  },
  {
    id: 'pred_nivmar',
    group: 'predicciones',
    name: '{nivelDelMarOption}',
    variableType: VariableType.SEA_LEVEL,
    iconClass: 'sea_level',
    mapResources: ['pred-tiles-nivmar', 'pred-markers-nivmar-puerto', 'pred-markers-nivmar-localidad', 'pred-markers-nivmar-playa']
  },
  {
    id: 'pred_corrientes',
    group: 'predicciones',
    name: '{corrientesOption}',
    variableType: VariableType.CURRENTS,
    iconClass: 'currents',
    mapResources: ['pred-tiles-corriente', 'pred-markers-cirana']
  },
  {
    id: 'pred_temperatura',
    group: 'predicciones',
    name: '{temperaturaOption}',
    variableType: VariableType.WATER_TEMP,
    iconClass: 'water_temp',
    mapResources: ['pred-tiles-temperatura', 'pred-markers-cirana']
  },
  {
    id: 'pred_salinidad',
    group: 'predicciones',
    name: '{salinidadOption}',
    variableType: VariableType.SALINITY,
    iconClass: 'salinity',
    mapResources: ['pred-tiles-salinidad', 'pred-markers-cirana']
  },
  // Tiempo Real
  {
    id: 'tr_oleaje',
    group: 'tiempo_real',
    name: '{oleajeOption}',
    variableType: VariableType.WAVE,
    iconClass: 'wave',
    mapResources: ['rt-markers-ojeale']
  },
  {
    id: 'tr_nivmar',
    group: 'tiempo_real',
    name: '{nivelDelMarOption}',
    variableType: VariableType.SEA_LEVEL,
    iconClass: 'sea_level',
    mapResources: ['rt-markers-nivmar']
  },
  {
    id: 'tr_onda_larga',
    group: 'tiempo_real',
    name: '{ondaLargaOption}',
    variableType: VariableType.SEICHE,
    iconClass: 'seiche',
    mapResources: ['rt-markers-onda-larga']
  },
  {
    id: 'tr_agitacion',
    group: 'tiempo_real',
    name: '{agitacionOption}',
    variableType: VariableType.AGITATION,
    iconClass: 'agitation',
    mapResources: ['rt-markers-agitacion']
  },
  {
    id: 'tr_viento',
    group: 'tiempo_real',
    name: '{vientoOption}',
    variableType: VariableType.WIND,
    iconClass: 'wind',
    mapResources: ['rt-markers-viento']
  },
  {
    id: 'tr_pres_aire',
    group: 'tiempo_real',
    name: '{presionAtmOption}',
    variableType: VariableType.AIR_PRESURE,
    iconClass: 'air_presure',
    mapResources: ['rt-markers-presion-aire']
  },
  {
    id: 'tr_temp_agua',
    group: 'tiempo_real',
    name: '{temperaturaOption}',
    variableType: VariableType.WATER_TEMP,
    iconClass: 'water_temp',
    mapResources: ['rt-markers-temperatura-agua']
  },
  {
    id: 'tr_temp_aire',
    group: 'tiempo_real',
    name: '{temperaturaAireOption}',
    variableType: VariableType.AIR_TEMP,
    iconClass: 'air_temp',
    mapResources: ['rt-markers-temperatura-aire']
  },
  {
    id: 'tr_corrientes',
    group: 'tiempo_real',
    name: '{corrientesOption}',
    variableType: VariableType.CURRENTS,
    iconClass: 'currents',
    mapResources: ['rt-markers-corrientes', 'pred-tiles-corriente-radar', 'rt-markers-antenas-corrientes']
  },
  {
    id: 'tr_salinidad',
    group: 'tiempo_real',
    name: '{salinidadOption}',
    variableType: VariableType.SALINITY,
    iconClass: 'salinity',
    mapResources: ['rt-markers-salinidad']
  }
  
]
