
const LocalePlugin = {

    locale : null,

    dictionary: {
        // variables
        WAVE: {
            es: "Oleaje",
            en: "Wave"
        },
        SEA_LEVEL: {
            es: "Nivel del Mar",
            en: "Sea Level"
        },
        SEICHE: {
            es: "Onda Larga",
            en: "Seiche"
        },
        AGITATION: {
            es: "Agitación",
            en: "Agitation"
        },
        WIND: {
            es: "Viento",
            en: "Wind"
        },
        AIR_PRESURE: {
            es: "Presión Atm.",
            en: "Aire Presure"
        },
        WATER_TEMP: {
            es: "Temp. Agua",
            en: "Water Temp."
        },
        AIR_TEMP: {
            es: "Temp. Aire",
            en: "Air Temp."
        },
        CURRENTS: {
            es: "Corrientes",
            en: "Currents"
        },
        SALINITY: {
            es: "Salinidad",
            en: "Salinity"
        },
        // resources
        nivmarLocalidadesRes: {
            es: "Nivmar Localidades",
            en: "Nivmar Places"
        },
        // checkboxes
        oleajeAtlanticoOption: {
            es: "Oleaje Atlántico",
            en: "Waves Atlantic"
        },
        oleajeMeditOption: {
            es: "Oleaje Med.",
            en: "Waves Med."
        },
        vientoOption: {
            es: "Viento",
            en: "Wind"
        },
        oleajeMeditOption: {
            es: "Oleaje Med.",
            en: "Waves Med."
        },
        nivelDelMarOption: {
            es: "Nivel del Mar",
            en: "Sea Level"
        },
        corrientesOption: {
            es: "Corrientes",
            en: "Currents"
        },
        temperaturaOption: {
            es: "Temp. Agua",
            en: "Water Temp"
        },
        salinidadOption: {
            es: "Salinidad",
            en: "Salinity"
        },
        temperaturaAireOption: {
            es: "Temp. Aire",
            en: "Air Temp."
        },
        agitacionOption: {
            es: "Agitación",
            en: "Port Agitation"
        },
        ondaLargaOption: {
            es: "Onda Larga",
            en: "Seiche"
        },
        oleajeOption: {
            es: "Oleaje",
            en: "Waves"
        },
        presionAtmOption: {
            es: "Presión Atm.",
            en: "Air Pressure"
        },
        // unidades de escala
        unitWAVE: {
            es: "Altura de ola (m)",
            en: "Wave height (m)"
        },
        unitSEA_LEVEL: {
            es: "Nivel - Marea = Residuo (m) (HAMSOM)",
            en: "Level - Tide=Residual (m) (HAMSOM)"
        },
        unitWIND: {
            es: "Vv (m/s) - Beaufort",
            en: "Vv (m/s) - Beaufort"
        },
        unitWATER_TEMP: {
            es: "Temperatura del agua C°",
            en: "Water temperature C°n"
        },
        unitCURRENTS: {
            es: "Media diaria (m/s)",
            en: "Daily average (m/s)"
        },
        unitSALINITY: {
            es: "Salinidad (psu)",
            en: "Salinity (psu)"
        },
        // checkboxes groups
        prediccionesGroup: {
            es: "Predicciones",
            en: "Forecast Data"
        },
        tiempoRealGroup: {
            es: "Tiempo Real",
            en: "Real Time Data"
        },
        historicoGroup: {
            es: "Datos Históricos",
            en: "Historical Data"
        },
        prediccionesGroupMin: {
            es: "Pred.",
            en: "FC"
        },
        tiempoRealGroupMin: {
            es: "TR",
            en: "RT"
        },
        historicoGroupMin: {
            es: "Hist.",
            en: "Hist."
        },
        // Info Panel
        cerrarButton: {
            es: "Cerrar",
            en: "Close"
        },
        bancoDatosGraficos: {
            es: "Gráficos",
            en: "Graphics"
        },
        bancoDatosTablas: {
            es: "Tablas",
            en: "Tables"
        },
        accesoADatosTab: {
            es: "Acceso a datos",
            en: "Access to data"
        },
        informacionTab: {
            es: "Información",
            en: "Information"
        },
        tipoUbicacionPuerto: {
            es: "Puerto",
            en: "Port"
        },
        tipoUbicacionPlaya: {
            es: "Playa",
            en: "Beach"
        },
        tipoUbicacionLocalidad: {
            es: "Localidad",
            en: "Place"
        },
        longitudInfo: {
            es: "Longitud",
            en: "Longitude"
        },
        latitudInfo: {
            es: "Latitud",
            en: "Latitude"
        },
        codigoModeloInfo: {
            es: "Código modelo",
            en: "Model code"
        },
        verificacionInfo: {
            es: "Verificación",
            en: "Verification"
        },
        cadencyInfo: {
            es: "Cadencia",
            en: "Cadency"
        },
        mallaInfo: {
            es: "Malla",
            en: "Grid"
        },
        codigoEstacionInfo: {
            es: "Código",
            en: "Code"
        },
        profundidadEstacionInfo: {
            es: "Profundidad",
            en: "Mooring Depth"
        },
        fechaInicialFondeoInfo: {
            es: "Fecha inicial de fondeo",
            en: "First record date"
        },
        fechaFinFondeoInfo: {
            es: "Fin de medidas",
            en: "Last record date"
        },
        tipoSensorInfo: {
            es: "Tipo de sensor",
            en: "Type of sensor"
        },
        modeloEstacionInfo: {
            es: "Modelo",
            en: "Model"
        },
        ubicacionEstacionInfo: {
            es: "Ubicación",
            en: "Location"
        },
        comentariosEstacionInfo: {
            es: "Comentarios",
            en: "Comments"
        },
        conjuntoDatosInfo: {
            es: "Conjunto de datos",
            en: "Data set"
        },
        ultimaPosicionFecha: {
            es: "Fecha (GMT)",
            en: "Date (GMT)"
        },
        tablaMareasLabel: {
            es: "Tabla de mareas",
            en: "Tidal table"
        },
        tablaMareasButton: {
            es: "Acceso",
            en: "Enter"
        },
        // Banco datos histórico
        puntoSimarLabel: {
            es: "Punto SIMAR",
            en: "SIMAR Point"
        },
        informesClimaticosLabel: {
            es: "Informes Climáticos",
            en: "Global Reports"
        },
        analisisInteractivosLabel: {
            es: "Análisis Interactivos",
            en: "Interactive Analysis"
        },
        estacionHistInactivaLabel: {
            es: "Estación inactiva en la actualidad",
            en: "Dismantled station"
        },
        descargarButton: {
            es: "Descargar",
            en: "Download"
        },
        // markers heaped tooltip
        markersProximosTitulo: {
            es: "Estaciones muy próximas",
            en: "Stations too close"
        },
        markersProximosText: {
            es: "Haga zoom para verlos o seleccione para acceso a datos",
            en: "Zoom to inspect or click to access to data"
        },
        // real time data tooltip
        fechaTiempoReal: {
            es: "Hora del último dato",
            en: "Last data time"
        },
        posicionBoyaTiempoReal: {
            es: "Última posición",
            en: "Last position"
        },
        sinDatosRecientes: {
            es: "No hay datos recientes",
            en: "No recent data"
        },
        mensajeMasInformacion: {
            es: "click en icono para acceso a datos",
            en: "click the icon to access data"
        },
        // Markers tooltips
        estacionHistTooltip: {
            es: "Información Histórica",
            en: "Historical Data"
        },
        // Static Maps Widget
        mapasPrediccionTitulo: {
            es: "Mapas de predicción",
            en: "Forecast maps"
        },
        listaDominiosTexto: {
            es: "Dominios",
            en: "Domains"
        },
        botonImprimirMapas: {
            es: "Imprimir",
            en: "Print"
        },
        botonBorrarMapas: {
            es: "Borrar",
            en: "Delete"
        },
        mapasImprimirTodos: {
            es: "Marcar todos",
            en: "Print all"
        },
        // Ubicaciones Toolbar
        ubicacionesPlaceHolder: {
            es: "Búsqueda de localidades, puertos y playas...",
            en: "Search by town, port or beach..."
        },
        // Widget Ubicaciones
        variableOleaje: {
            es: "oleaje",
            en: "waves"
        },
        variableNivMar: {
            es: "nivel mar",
            en: "sea level"
        },
        variableViento: {
            es: "viento",
            en: "wind"
        },
        variableTempAgua: {
            es: "Temperatura agua",
            en: "Water temperature"
        },
        variablePeriodoMedOleaje: {
            es: "Periodo med. oleaje",
            en: "Average wave period"
        },
        variablePresionAtm: {
            es: "Presión atmosférica",
            en: "Atmospheric pressure"
        },
        headerTiempoReal: {
            es: "Tiempo real",
            en: "Real time"
        },
        headerPredicciones: {
            es: "Predicciones: extremos diarios",
            en: "Forecasts: daily extremes"
        },
        headerGraficos: {
            es: "Gráficos",
            en: "Graphics"
        },
        locationsWidgetTitle1: {
            es: "Previsiones y estado actual del mar en",
            en: "Forecasts and current state of the sea in"
        },
        locationsWidgetTitle2: {
            es: "Todas las horas son GMT",
            en: "All times are GMT"
        },
        // Tablas Pred
        tablePredTitle_CURRENTS: {
            es: "Predicción de corriente, temp. y salinidad para",
            en: "Currents, temp. and salinity forecast for"
        },
        tablePredTitle_WATER_TEMP: {
            es: "Predicción de corriente, temp. y salinidad para",
            en: "Currents, temp. and salinity forecast for"
        },
        tablePredTitle_SALINITY: {
            es: "Predicción de corriente, temp. y salinidad para",
            en: "Currents, temp. and salinity forecast for"
        },
        tablePredTitle_WAVE: {
            es: "Predicción de viento y oleaje para",
            en: "Wind and wave forecast for"
        },
        tablePredTitle_WIND: {
            es: "Predicción de viento para",
            en: "Wind forecast for"
        },
        tablePredTitle_SEA_LEVEL: {
            es: "Nivel del mar para",
            en: "Sea level for"
        },
        linkToMareaAstro: {
            es: "Ver predicción de marea astronómica para",
            en: "Go to Astronomical Tide Forecast at"
        },
        nivelMedio: {
            es: "Nivel medio",
            en: "Mean level"
        },
        ceroRedmar: {
            es: "Cero REDMAR",
            en: "REDMAR Datum"
        },
        // Tooltip iconos player
        shareIconPred: {
            es: "Inserte esta animación en su web",
            en: "Embed this animation into your web page"
        },
        staticMapsIconPred: {
            es: "Acceso a mapas e imprimir",
            en: "Access to forecast maps and print"
        },
        vectorsIconPred: {
            es: "Ver dirección",
            en: "Show direction"
        },
        radarsIconPred: {
            es: "Ver puntos de radar",
            en: "Show radar points"
        }
    },
   
    setLocale(locale) {
      this.locale = locale;
    },

    getLocale() {
        return this.locale;
    },
  
    t(id, capitalize) {
        var key = this.getKey(id);
        if (key) {
            var tag = this.dictionary[key];
            if (!tag)
                return key;
            var text = tag[this.locale];
            if (!text)
                return key;
            return text;
        }
        else {
            return id;
        }
        
    },

    getKey(text) {
        if (text[0] == '{' && text[text.length - 1] == '}') {
            return text.replace('{', '').replace('}', '');
        }
        else {
            return null;
        }
    },

    install(Vue, options) {
      // For components
      Vue.prototype.$setLocale = (locale) => this.setLocale(locale);
      Vue.prototype.$getLocale = (locale) => this.getLocale(locale);
      Vue.prototype.$t = (id) => this.t(id);
      // For services
      Vue.$setLocale = (locale) => this.setLocale(locale);
      Vue.$getLocale = (locale) => this.getLocale(locale);
      Vue.$t = (id) => this.t(id);
    }
  };
  
export default LocalePlugin;

