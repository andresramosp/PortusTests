
const LocalePlugin = {

    locale : null,

    dictionary: {
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
        // marker info tags
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
        tipoSensorInfo: {
            es: "Tipo de sensor",
            en: "Type of sensor"
        },
        modeloEstacionInfo: {
            es: "Modelo",
            en: "Model"
        },
        conjuntoDatosInfo: {
            es: "Conjunto de datos",
            en: "Data set"
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
        estacionNoDisponible: {
            es: "Estación temporalmente fuera de servicio",
            en: "Station out of service"
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

