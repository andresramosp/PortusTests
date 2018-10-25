export default {}

export const MapResources = [
    { 
      id: 1, 
      type: 'TimeLineLayer', 
      name: 'Nivel del Mar', 
      resourceApi: 'mapTileResources/RES', 
      tms: true 
    },
    // { 
    //   id: 2, 
    //   type: 'FeatureLayer', 
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
    //   iconRenderer: function (ubicacion) {
    //     if (ubicacion.tipoUbicacion == 1)
    //       return 'nivmar-puerto.png';
    //     if (ubicacion.tipoUbicacion == 2)
    //       return 'nivmar-localidad.png';
    //     if (ubicacion.tipoUbicacion == 3)
    //       return 'nivmar-playa.png';
    //   }
    // },
    { 
      id: 2, 
      type: 'FeatureLayer', 
      name: 'Nivmar Ubic. Puertos', 
      resourceApi: 'ubicacionesNivmar/1', 
      minZoom: 0, 
      icon: 'nivmar-puerto.png' 
    },
    { 
      id: 3, 
      type: 'FeatureLayer', 
      name: 'Nivmar Ubic. Localidades', 
      resourceApi: 'ubicacionesNivmar/2', 
      minZoom: 7, 
      icon: 'nivmar-localidad.png' 
    },
    { 
      id: 4, 
      type: 'FeatureLayer', 
      name: 'Nivmar Ubic. Playas', 
      resourceApi: 'ubicacionesNivmar/3', 
      minZoom: 8, 
      icon: 'nivmar-playa.png' 
    },
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
      type: 'FeatureLayer', 
      name: 'Puntos Cirana', 
      resourceApi: 'puntosMallaCirana', // {zoom}
      minZoom: 0, 
      serverMode: true,
      icon: 'nivmar-puerto.png' 
    },
    { 
      id: 13, 
      type: 'FeatureLayer', 
      name: 'Estaciones Real Time', 
      resourceApi: 'estaciones/RT', 
      minZoom: 0, 
      icon: function(estacion) {
          if (estacion.propagacion) {
            return (estacion.estado > 0) ? 'estacion-oleaje-prop-na.png' : 'estacion-oleaje-prop.png'
          }
          else {
            return (1 <= estacion.estado && estacion.estado  <= 2) ? 'estacion-oleaje-na.png' : 'estacion-oleaje.png'
          }
      },
      locale: true
    }
  ];

  
export const MapOptions = [
  { id: 'pred_nivmar', group: 'Predicciones', name: 'Nivel del Mar', mapResources: [1, 2, 3, 4] },
  { id: 'pred_corrientes', group: 'Predicciones', name: 'Corrientes', mapResources: [8, 12] }, 
  { id: 'pred_temperatura', group: 'Predicciones', name: 'Temperatura', mapResources: [9] },
  { id: 'pred_oleaje_atl', group: 'Predicciones', name: 'Oleaje Atl', mapResources: [5, 7] },
  { id: 'pred_oleaje_med', group: 'Predicciones', name: 'Oleaje Med', mapResources: [6] },
  { id: 'pred_viento', group: 'Predicciones', name: 'Viento', mapResources: [10] },
  { id: 'pred_salinidad', group: 'Predicciones', name: 'Salinidad', mapResources: [11] },
  { id: 'tr_oleaje', group: 'Tiempo Real', name: 'Oleaje', mapResources: [13] }
]
