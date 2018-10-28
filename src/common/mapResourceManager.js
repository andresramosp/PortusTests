export default {}

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
      name: 'Nivmar Ubic. Puertos', 
      resourceApi: 'ubicacionesNivmar/1', 
      minZoom: 0, 
      icon: 'nivmar-puerto.png' 
    },
    { 
      id: 3, 
      type: 'MarkerLayer', 
      name: 'Nivmar Ubic. Localidades', 
      resourceApi: 'ubicacionesNivmar/2', 
      minZoom: 7, 
      icon: 'nivmar-localidad.png' 
    },
    { 
      id: 4, 
      type: 'MarkerLayer', 
      name: 'Nivmar Ubic. Playas', 
      resourceApi: 'ubicacionesNivmar/3', 
      minZoom: 8, 
      icon: 'nivmar-playa.png' 
    },
    // { 
    //   id: 2, 
    //   type: 'MarkerLayer', 
    //   name: 'Nivmar Ubic. Puertos', 
    //   resourceApi: 'ubicacionesNivmar', 
    //   minZoom: function (ubicacion) {
    //     if (ubicacion.tipoUbicacion == 1)
    //       return 0;
    //     if (ubicacion.tipoUbicacion == 2)
    //       return 7;
    //     if (ubicacion.tipoUbicacion == 3)
    //       return 8;
    //   }, 
    //   icon: function (ubicacion) {
    //     if (ubicacion.tipoUbicacion == 1)
    //       return 'nivmar-puerto.png';
    //     if (ubicacion.tipoUbicacion == 2)
    //       return 'nivmar-localidad.png';
    //     if (ubicacion.tipoUbicacion == 3)
    //       return 'nivmar-playa.png';
    //   }
    // },
    { 
      id: 5, 
      type: 'TimeLineLayer', 
      name: 'Oleaje Atlántico', 
      resourceApi: 'mapTileResources/VHM0Atl', 
      tms: true,
      vectors: true
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
      tms: true ,
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
      vectors: true
    },
    { 
      id: 11, 
      type: 'TimeLineLayer', 
      name: 'Salinidad', 
      resourceApi: 'mapTileResources/SAL', 
      tms: true 
    },
    { 
      id: 12, 
      type: 'MarkerLayer', 
      name: 'Puntos Cirana', 
      resourceApi: 'puntosMallaCirana', 
      minZoom: 0, 
      icon: 'nivmar-puerto.png' 
    },
    { 
      id: 13, 
      type: 'MarkerLayer', 
      name: 'RT - Oleaje', 
      resourceApi: 'estaciones/RT_WAVE', 
      minZoom: 0, 
      icon: function (m) {
          if (m.propagacion) {
            return (m.estado > 0) ? 'estacion-oleaje-prop-na.png' : 'estacion-oleaje-prop.png'
          }
          else {
            return (1 <= m.estado && m.estado  <= 2) ? 'estacion-oleaje-na.png' : 'estacion-oleaje.png'
          }
      },
      showAll: true,
      locale: true
    },
    { 
      id: 14, 
      type: 'MarkerLayer', 
      name: 'RT - Nivel del Mar', 
      resourceApi: 'estaciones/RT_SEA_LEVEL', 
      minZoom: 0, 
      icon: function (m) {
          if (m.propagacion) {
            return (m.estado > 0) ? 'estacion-oleaje-prop-na.png' : 'estacion-oleaje-prop.png'
          }
          else {
            return (1 <= m.estado && m.estado  <= 2) ? 'estacion-oleaje-na.png' : 'estacion-oleaje.png'
          }
      },
      showAll: true,
      locale: true
    },
    { 
      id: 15, 
      type: 'MarkerLayer', 
      name: 'RT - Agitacion', 
      resourceApi: 'estaciones/RT_AGITATION', 
      minZoom: 0, 
      icon: function (m) {
          if (m.propagacion) {
            return (m.estado > 0) ? 'estacion-oleaje-prop-na.png' : 'estacion-oleaje-prop.png'
          }
          else {
            return (1 <= m.estado && m.estado  <= 2) ? 'estacion-oleaje-na.png' : 'estacion-oleaje.png'
          }
      },
      showAll: true,
      locale: true
    }
  ];

  
export const MapOptions = [
  { id: 'pred_nivmar', group: 'predicciones', name: 'Nivel del Mar', mapResources: [1, 2, 3, 4] },
  { id: 'pred_corrientes', group: 'predicciones', name: 'Corrientes', mapResources: [8, 12] },  
  { id: 'pred_temperatura', group: 'predicciones', name: 'Temperatura', mapResources: [9] },
  { id: 'pred_oleaje_atl', group: 'predicciones', name: 'Oleaje Atl', mapResources: [5, 7] },
  { id: 'pred_oleaje_med', group: 'predicciones', name: 'Oleaje Med', mapResources: [6] },
  { id: 'pred_viento', group: 'predicciones', name: 'Viento', mapResources: [10] },
  { id: 'pred_salinidad', group: 'predicciones', name: 'Salinidad', mapResources: [11] },
  { id: 'tr_oleaje', group: 'tiempo_real', name: 'Oleaje', mapResources: [13] },
  { id: 'tr_nivmar', group: 'tiempo_real', name: 'Nivel del Mar', mapResources: [14] },
  // { id: 'tr_onda_larga', group: 'tiempo_real', name: 'Onda Larga', mapResources: [13] },
   { id: 'tr_agitacion', group: 'tiempo_real', name: 'Agitación', mapResources: [15] },
  // { id: 'tr_viento', group: 'tiempo_real', name: 'Viento', mapResources: [13] },
  // { id: 'tr_presion_atm', group: 'tiempo_real', name: 'Presión Atm.', mapResources: [13] },
  // { id: 'tr_temp_agua', group: 'tiempo_real', name: 'Temp. del Agua', mapResources: [13] },
  // { id: 'tr_temp_aire', group: 'tiempo_real', name: 'Temp. del Aire', mapResources: [13] },
  // { id: 'tr_corrientes', group: 'tiempo_real', name: 'Corrientes', mapResources: [13] },
  // { id: 'tr_salinidad', group: 'tiempo_real', name: 'Salinidad', mapResources: [13] }
]
