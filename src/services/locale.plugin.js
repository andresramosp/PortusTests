
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
            es: "Oleaje Medit",
            en: "Waves Med."
        },
        vientoOption: {
            es: "Viento",
            en: "Wind"
        },
        oleajeMeditOption: {
            es: "Oleaje Medit",
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
        // Info Panel
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
        // markers heaped tooltip
        markersProximosTitulo: {
            es: "Markers muy próximos",
            en: "Markers too close"
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
        // Ubicaciones Panel
        ubicacionesPlaceHolder: {
            es: "Búsqueda de localidades, puertos y playas...",
            en: "Search by town, port or beach..."
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

