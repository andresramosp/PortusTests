import { MapResources } from '@/common/mapResourceManager';
import ApiService from "@/services/api.service";
import MapService from "@/services/map.service";
import RadarsService from "@/services/radars.service";
import DataPanelsService from "@/services/dataPanels.service";
import { BASE_URL_PORTUS } from '@/common/config';
import UserPrefs from '@/services/userPrefs.service'
import Vue from 'vue';

const MapState = {

    map: null,
    mapOptionsGroups: [],
    mapOptions: [],
    subMenusTracker: {},
    markersSelected: null,
    ubicacionSelected: null,
    predictionScaleImg: null,
    preloadedTimeLineLayers: [],
    preloadedMarkers: [],
    currentTimeLineLayer: null,
    playerDateRangeFromValue: null,
    playerDateRangeToValue: null,
    playerDateRangeVisibility: true,
    playerMinimized: false,
    playerDateManualMode: false,
    maxPredictionDate: null,
    showingVectors: false,
    showingRadars: false,
    currentPlayerTime: null,
    staticMapResourceSelected: null,
    loadingThings: [],
    heapedPopup: null,
    mapLogos: [],
    radarPointsLayer: null,
    currentRadar: null,
    dataObjectsList: [],
    bancosDatos: PC.user_preferences.banco_datos  != undefined ? PC.user_preferences.banco_datos : {},
    bancosDatosHist: {},
    puertosInfoSourceId: null,
    notifyMessages: [],

    init(map) {
        this.map = map;
        this.cacheLayers();
        DataPanelsService.createDataListFromUserPrefs();
        this.showStaffNotifyMessages();
    },

    cacheLayers() {
        MapResources.forEach(async mr => {
            if (mr.type == "MarkerLayer" && mr.cached) {
                mr.cachedData = await ApiService.get(mr.resourceApi, (mr.locale ? { locale: Vue.$getLocale() } : null ));
            }
        })
    },

    getMap() {
        return this.map;
    },

    setBaseLayer(baseLayer) {
        baseLayer.addTo(this.map);
    },

    getMapResource(mapResourceId) {
        return MapResources.find(mr => {
            return mr.id == mapResourceId;
        });
    },

    async addMarkerLayer(mapResource, mapOption) 
    {
        var source = null;
        if (mapOption) {
            var source = ApiService.getCancelationToken();
            mapOption.sources.push(source);
        }

        this.addLoading(mapResource.id);
        var result = mapResource.cachedData || await ApiService.get(mapResource.resourceApi, (mapResource.locale ? { locale: Vue.$getLocale() } : null ), source);
        result.data.forEach(m => {
            var iconUrl = typeof mapResource.icon === "function" ? mapResource.icon(m) : mapResource.icon;
            var customIcon = L.icon({ iconUrl: require('@/assets/markers/' + iconUrl), iconSize: mapResource.iconSize ? mapResource.iconSize : [17, 17] });
            var marker = L.marker([m.latitud, m.longitud], { icon: customIcon });
            var ms = this;
            marker.on('click', function (e) {
                if (!this.heaped) {
                    MapService.markerMouseClick(ms.map, this);
                }
                else {
                    ms.popupFixed = true;
                }
            });
            marker.on('mouseover', function (e) {
                MapService.markerMouseOver(ms.map, this);
            });
            marker.on('mouseout', function (e) {
                MapService.markerMouseOut(ms.map, this);
            });
            marker.mapResource = mapResource;
            marker.mapOption = mapOption;
            Object.assign(marker, m);
            marker.visible = this.initialVisibilityValue(marker);
            this.preloadedMarkers.push(marker);
        });

        this.setVisibleMarkerLayers();
        this.removeLoading(mapResource.id);
    },

    async addTimeLineLayer(mapResource, mapOption) {
        var source = null;
        if (mapOption) {
            var source = ApiService.getCancelationToken();
            mapOption.sources.push(source);
        }
        this.addLoading(mapResource.id);
        var vectorial = mapResource.defaultVectors ? true : false;
        var result = await ApiService.get(mapResource.resourceApi, null, source);
        result.data.forEach(res => {
            var tileLayer = L.tileLayer(BASE_URL_PORTUS + res.url + '{d}{h}/' + (vectorial ? res.urlVec : res.urlIso) + '//{z}/{x}/{y}.png', {
                tms: true,
                minZoom: res.zoomMin,
                maxZoom: res.zoomMax,
                bounds: L.latLngBounds(L.latLng(res.limN, res.limW), L.latLng(res.limS, res.limE)),
                numDays: res.numGap,
                strLastate: res.strLastate,
                hoursStep: res.numStep,
                predictionScaleImg: res.urlPaleta,
                logosImgs: res.urlLogos ? res.urlLogos.split(';') : []
            });
            var portusTimeLayer = L.timeDimension.layer.tileLayer.timeLine(
                tileLayer,
                {}
            );
            Object.assign(portusTimeLayer, res);
            tileLayer.mapResource = mapResource;
            portusTimeLayer.mapResource = mapResource;
            portusTimeLayer.mapOption = mapOption;
            portusTimeLayer.visible = this.initialVisibilityValue(portusTimeLayer);
            //portusTimeLayer.hasVectors = res.urlVec == 'vec';
            portusTimeLayer.id = res.url;
            this.preloadedTimeLineLayers.push(portusTimeLayer);
            if (mapResource.paintBounds) {
                MapService.createBounds(this.map, portusTimeLayer)
            }
        })
        if (mapResource.onAdded) {
            mapResource.onAdded();
        }
        this.setVisibleTimeLineLayers();
        this.showingVectors = vectorial;
        this.removeLoading(mapResource.id);
    },

    // Función para determinar la visibilidad inicial de un layer recién añadido, a nivel de
    // subOption (checkboxes del subMenu). Si forma parte de un combo, estará visible si es
    // el defaultValue establecido; si forma parte de una opción que agrupa varios mapResources
    // (subOption), estará visible si también lo están los layers que forman esa opción, o bien
    // si todavía no hay ninguno en el mapa. Si está unchecked por defecto, estará invisible.

    initialVisibilityValue(layer) {

        if (layer.mapResource.unchecked)
            return false;
        if (layer.mapResource.comboSelect) {
            return (layer.mapResource.groupLayersBy && layer[layer.mapResource.groupLayersBy.field] == layer.mapResource.comboSelect.defaultOption)
            || (layer.mapResource.name ==  layer.mapResource.comboSelect.defaultOption)
        }
        if (layer.mapResource.subOption) {
            if (this.subMenusTracker[layer.mapOption.group]){
                var existingSubOption = this.subMenusTracker[layer.mapOption.group].find(opt => opt.type == "subOption" && opt.name == layer.mapResource.subOption);
                if (existingSubOption) {
                    return existingSubOption.active;
                }
            }
        }
        return true;
    },

    setVectorial(mapResource, vectorial) {
        var layers = this.preloadedTimeLineLayers.filter(layer => layer.mapResource.id == mapResource.id);
        layers.forEach(l => {
            if (vectorial)
                l._baseLayer._url = l._baseLayer._url.replace('map', (vectorial ? l.urlVec : l.urlIso));
            else
                l._baseLayer._url = l._baseLayer._url.replace('vec', 'map');
        });
        this.showingVectors = vectorial;
        this.setVisibleTimeLineLayers();

    },


    // La visibilidad de un marker viene dada por:
    // 1. El campo visible, establecido por el usuario mediante el checkbox del submenu de recursos (salvo unchecked por defecto)
    // 2. La función filter establecida por el programador en mapResourceManager (p.e. las estaciones radar de las corrientes)
    // 3. La visibilidad dentro de las coordenadas / zoom del mapa (salvo caso de showAll establecido en mapResourceManager)
    setVisibleMarkerLayers() {
        var ms = this;
        this.preloadedMarkers.forEach(function (marker) {
            if (marker.visible 
            && (!marker.mapResource.filter || marker.mapResource.filter(marker))
            && (marker.mapResource.showAll || (MapService.markerVisible(ms.map, marker)))) {
                marker.addTo(ms.map);
            }
            else {
                marker.remove();
            }
        });
    },

    setVisibleTimeLineLayers() {
        
        var ms = this;
        if (ms.map.timeDimensionControl) {
            ms.map.timeDimensionControl._player.stop();
            ms.map.removeControl(ms.map.timeDimensionControl);
            ms.map.timeDimensionControl = null;
        }

        ms.currentTimeLineLayer = null;
        this.preloadedTimeLineLayers.forEach(function (preLayer) {
            if (ms.map.hasLayer(preLayer)) {
                preLayer.remove();
                preLayer._layers = {};
                preLayer._defaultTime = 0;
                preLayer._availableTimes = [];
                if (preLayer._baseLayer.options.predictionScaleImg)
                    //ms.predictionScaleImg = '';
                    preLayer._baseLayer.options.logosImgs.forEach(url => {
                    ms.removeMapLogo(url);
                })
            }
            if (MapService.tileLayerVisible(ms.map, preLayer._baseLayer) && preLayer.visible) {
                ms.currentTimeLineLayer = preLayer;
                ms.map.options.timeDimensionOptions.period = "PT" + preLayer._baseLayer.options.hoursStep + "H";
                if (ms.playerDateManualMode) {
                    ms.maxPredictionDate = MapService.convertYMDHToDate(preLayer._baseLayer.options.strLastate);
                    if (ms.playerDateRangeToValue > ms.maxPredictionDate) {
                        ms.playerDateRangeToValue = ms.maxPredictionDate;
                        var notifyMsg = { 
                            id: 'errorFechasPlayer', 
                            message: "No hay mapas en el intervalo de fechas seleccionado. Mostrando predicción: " + MapService.getGMTDateString(ms.playerDateRangeFromValue) + " - " + MapService.getGMTDateString(ms.playerDateRangeToValue) + ' (GMT)',
                            title: "Aviso",
                            duration: 10000
                        };
                        ms.addNotifyMessage(notifyMsg);
                        ms.playerDateManualMode = false;
                    }
                    var hourPeriod = MapService.convertYMDHToDate(preLayer._baseLayer.options.strLastate).getHours();
                    ms.playerDateRangeFromValue.setUTCHours(hourPeriod);
                    ms.playerDateRangeToValue.setUTCHours(hourPeriod);
                    ms.map.options.timeDimensionOptions.timeInterval = ms.playerDateRangeFromValue.toISOString() + '/' + ms.playerDateRangeToValue.toISOString();
                }
                else {
                    var predHours = (preLayer._baseLayer.options.numDays) * 24; 
                    ms.maxPredictionDate = MapService.convertYMDHToDateStr(preLayer._baseLayer.options.strLastate);
                    ms.map.options.timeDimensionOptions.timeInterval = 'PT' + predHours + 'H/' + ms.maxPredictionDate;
                }
                ms.map.timeDimension.initialize(ms.map.options.timeDimensionOptions);
                ms.map.timeDimension.setCurrentTimeIndex(0);
                if (!ms.map.timeDimensionControl) {
                    ms.map.timeDimensionControl = L.control.timeDimension({ position: "bottomleft", playerOptions: { transitionTime: 500, loopButton: true,  loop: true }, autoPlay: true, minimized: ms.playerMinimized })
                    ms.map.addControl(ms.map.timeDimensionControl);
                }
                preLayer.addTo(ms.map);

                if (preLayer._baseLayer.options.predictionScaleImg) {
                    ms.predictionScaleImg = preLayer._baseLayer.options.predictionScaleImg;
                }
                preLayer._baseLayer.options.logosImgs.forEach(url => {
                    ms.addMapLogo(url);
                })
                if (preLayer.mapResource.isRadar)
                    RadarsService.getRadarPoints(preLayer);

                if (preLayer.boundRectangle)
                    preLayer.boundRectangle.remove();
            }
            else {
                if (preLayer.mapResource.isRadar && (ms.currentRadar && ms.currentRadar.dominio == preLayer.idDominio)) {
                    RadarsService.removeRadarPoints()
                }
                if (preLayer.boundRectangle)
                    preLayer.boundRectangle.addTo(ms.map);
            }
        })
    },

    // Este setter es para ser usado por el player de Leaflet, de forma
    // que mantenga siempre coherente su valor con el state.
    setPlayerDateRangeValue(from, to) {
        this.playerDateRangeFromValue = from;
        this.playerDateRangeToValue = to;
        if ((!this.playerDateRangeFromValueOld || from.toJSON() != this.playerDateRangeFromValueOld.toJSON()) 
         || (!this.playerDateRangeToValueOld || to.toJSON() != this.playerDateRangeToValueOld.toJSON())) {
            var showingError = this.notifyMessages.find(msg => msg.id == 'errorFechasPlayer') != null;
            if (!showingError) {
                var notifyMsg = { 
                    id: 'fechasPlayer', 
                    message: "Mostrando predicción: " + MapService.getGMTDateString(this.playerDateRangeFromValue) + " - " + MapService.getGMTDateString(this.playerDateRangeToValue) + ' (GMT)',
                    title: this.currentTimeLineLayer.mapOption ? Vue.$t(this.currentTimeLineLayer.mapOption.name) : '',
                    duration: 7000
                };
                this.addNotifyMessage(notifyMsg);
            }
        }
        this.playerDateRangeFromValueOld = from;
        this.playerDateRangeToValueOld = to;
    },

    // Este setter es para ser usado exclusivamente por el control manual de fechas
    // Una vez cambiadas las fechas por esta vía se establece a true el playerDateManualMode
    // de forma que, si las fechas de un tile no coinciden con las estableidas, podamos 
    // avisar del cambio
    changePlayerDateRangeValue(from, to) {
        this.map.timeDimensionControl._player.stop();
        this.map.removeControl(this.map.timeDimensionControl);
        if (this.currentTimeLineLayer) {
            this.currentTimeLineLayer.remove();
            this.currentTimeLineLayer._layers = {};
            this.currentTimeLineLayer._defaultTime = 0;
            this.currentTimeLineLayer._availableTimes = [];
        }
        this.playerDateRangeFromValue = from || this.playerDateRangeFromValue;
        this.playerDateRangeToValue = to || this.playerDateRangeToValue;
        this.map.options.timeDimensionOptions.timeInterval = this.playerDateRangeFromValue.toISOString() + '/' + this.playerDateRangeToValue.toISOString();
        this.map.timeDimension.initialize(this.map.options.timeDimensionOptions);
        this.map.timeDimension.setCurrentTimeIndex(0);
        this.map.addControl(this.map.timeDimensionControl);
        this.currentTimeLineLayer.addTo(this.map);
        this.playerDateManualMode = true;

    },

    setPlayerMinimized(value) {
        this.playerMinimized = value;
        this.map.timeDimensionControl.options.minimized = value;
        this.map.timeDimensionControl.options.autoPlay = this.map.timeDimensionControl._player.isPlaying();
        this.map.removeControl(this.map.timeDimensionControl);
        this.map.addControl(this.map.timeDimensionControl);
    },

    setCurrentPlayerTime(date) {
        this.currentPlayerTime = date;
    },

    setStaticMapResourceSelected(mapResource) {
        this.staticMapResourceSelected = mapResource;
    },

    addTileLayer(mapResource) {
        var tileLayer = L.tileLayer(mapResource.resourceUrl, {
            tms: mapResource.tms,
        });
        tileLayer.mapResource = mapResource;
        tileLayer.addTo(this.map);
    },

    removeMapResource(mapResourceId) {
        var ms = this;
        var mapResource = this.getMapResource(mapResourceId);
        this.map.eachLayer(function (layer) {
            if (layer.mapResource && layer.mapResource.id == mapResourceId) {
                layer.remove();
                if (layer.mapResource.type == "TimeLineLayer" && layer._baseLayer) {
                    layer._baseLayer.options.logosImgs.forEach(url => {
                        ms.removeMapLogo(url);
                    })
                }
                if (layer.mapResource.isRadar && (ms.currentRadar && ms.currentRadar.dominio == layer.idDominio)) {
                    RadarsService.removeRadarPoints();
                }
            }
        });

        this.preloadedTimeLineLayers = this.preloadedTimeLineLayers.filter((plt) => { return plt.mapResource.id != mapResourceId });
        this.preloadedMarkers = this.preloadedMarkers.filter((plm) => { return plm.mapResource.id != mapResourceId });

        if (this.preloadedMarkers.length == 0)
            this.closeHeapedPopup();
        
        if (this.currentTimeLineLayer && this.currentTimeLineLayer.mapResource.id == mapResourceId && this.map.timeDimensionControl) 
            this.removePlayerControl();

         if (mapResource.onRemoved)
            mapResource.onRemoved();
    },

    removePlayerControl() {
        this.map.timeDimensionControl._player.stop();
        this.map.removeControl(this.map.timeDimensionControl);
        this.predictionScaleImg = '';
        this.currentTimeLineLayer = null;
        this.removeNotifyMessage('fechasPlayer');
        this.removeNotifyMessage('errorFechasPlayer');
        this.playerDateRangeFromValueOld = null;
        this.playerDateRangeToValueOld = null;
        this.playerDateManualMode = false;
    },
    
    getActiveLayers() {
        var result = [];
        result = result.concat(this.preloadedTimeLineLayers);
        result = result.concat(this.preloadedMarkers);
        return result;
    },

    getActiveMapOptions() {
        return this.mapOptions.filter(opt => opt.active);
    },

    setMapOption(mapOptionId, active) {
        var mapOption = this.mapOptions.find(m => m.id == mapOptionId);
        if (active) {
            mapOption.sources = mapOption.sources || [];
            this.checkMultipleAllowed(mapOption);
            this.checkAgregationAllowed(mapOption);
            this.checkJustOneAnimation(mapOption);
            mapOption.mapResources.forEach(resId => {
                var mapResource = this.getMapResource(resId);
                if (mapResource.type == "MarkerLayer")
                    this.addMarkerLayer(mapResource, mapOption);
                if (mapResource.type == "TimeLineLayer")
                    this.addTimeLineLayer(mapResource, mapOption);
            });
        }
        else {
            // Checkbox desclicado durante carga: cancelamos requests a la Api
            // OJO: cancela las que ya han llegado. Ver si quitar en response.
            if (mapOption.sources.length > 0) {
                mapOption.sources.forEach(s => {
                    s.cancel('canceled');
                });
                mapOption.sources = [];
                this.loadingThings = this.loadingThings.filter(l => mapOption.mapResources.indexOf(l) == -1);
            }
            mapOption.mapResources.forEach(resId => {
              this.removeMapResource(resId);
            });

            // Esto es solo preventivo, cada recurso debe apagar su loading
            if (this.getActiveMapOptions().length == 0)
                this.loadingThings = [];
        }

        // Si activamos el mapOption de manera programática, 
        // debemos también marcar/desmarcar el checkbox
        if (mapOption.active != active)
            Vue.set(mapOption, 'active', active);
       
    },

    checkMultipleAllowed(checkedMapOption) {
        var optionGroup = this.mapOptionsGroups.groups.find(optGrp => optGrp.id == checkedMapOption.group);
          if (!optionGroup.multiple) {
              var otherCheckedOption = this.mapOptions.find(opt => opt.id != checkedMapOption.id && opt.group == optionGroup.id && opt.active);
              if (otherCheckedOption) {
                 otherCheckedOption.active = false;
                 this.setMapOption(otherCheckedOption.id, false);
              }
          }
    },

    checkAgregationAllowed(checkedMapOption) {
        // Sacamos el grupo de esta opción y los grupos hermanos permitidos
        var optionGroup = this.mapOptionsGroups.groups.find(optGrp => optGrp.id == checkedMapOption.group);
        var allowedSiblingGroups = [checkedMapOption.group];
        this.mapOptionsGroups.agregations.forEach(ag => {
            if (ag.indexOf(optionGroup.id) != -1) {
                allowedSiblingGroups = allowedSiblingGroups.concat(ag.filter(g => g != checkedMapOption.group));
            }
        })
        // Recorremos todos los mapOptions activos y si alguno no está entre
        // los grupos permitidos, los desactivamos
        var otherActiveOptions = this.getActiveMapOptions().filter(opt => opt.id != checkedMapOption.id);
        otherActiveOptions.forEach(opt => {
            if (allowedSiblingGroups.indexOf(opt.group) == -1){
                opt.active = false;
                this.setMapOption(opt.id, false);
            }
        })
    },

    isAnimationOption(mapOption) {
        return mapOption.mapResources.map(res => this.getMapResource(res))
                                     .filter(mr => mr.type == 'TimeLineLayer').length > 0;
    },

    checkJustOneAnimation(checkedMapOption) {
        if (this.isAnimationOption(checkedMapOption)) {
            var otherActiveOptions = this.getActiveMapOptions().filter(opt => opt.id != checkedMapOption.id);
            var otherActiveAnimationOptions = otherActiveOptions.filter(opt => this.isAnimationOption(opt));
            otherActiveAnimationOptions.forEach(opt => {
                opt.active = false;
                this.setMapOption(opt.id, false);
            })
        }
    },

    addLoading(thing) {
        if (this.loadingThings.indexOf(thing) == -1)
            this.loadingThings.push(thing);
    },

    removeLoading(thing) {
        this.loadingThings = this.loadingThings.filter(t => { return t != thing });
    },

    isLoading(thing) {
        return this.loadingThings.find(t => t == thing) != null;
    },

    setHeapedPopup(popup) {
        this.heapedPopup = popup;
        popup.openOn(this.map);
    },

    closeHeapedPopup() {
        this.map.closePopup();
    },

    addMapLogo(logo, emptyAll) {
        if (emptyAll)
            this.mapLogos = [];
        if (this.mapLogos.indexOf(logo) == -1)
            this.mapLogos.push(logo)
    },

    removeMapLogo(logo) {
        this.mapLogos = this.mapLogos.filter(l => l != logo);
    },

    getBancoDatos(markerId, historical) {
        var bancoDatos = historical ? this.bancosDatosHist : this.bancosDatos;
        if (!bancoDatos[markerId]) {
            bancoDatos[markerId] = []
        }
        return bancoDatos[markerId];
    },

    // Cuando actualizamos el banco de datos de un marker, solo
    // añadimos los parámetros nuevos, para conservar el estado
    // (marcado/desmarcado), de los ya existentes.
    // El banco de datos histórico se refiere a los productos.
    addBancoDatos(markerId, bancoDatosNew, historical) {
        var bancoDatos = historical ? this.bancosDatosHist : this.bancosDatos;
        if (!bancoDatos[markerId]) {
            bancoDatos[markerId] = []
        }
        var oldParamsIds = bancoDatos[markerId].map(p => p.id);
        var newParams = bancoDatosNew.filter(p => oldParamsIds.indexOf(p.id) == -1);
        bancoDatos[markerId] = bancoDatos[markerId].concat(newParams);
    },

    setPortusInfoPanel(sourceId) {
        this.puertosInfoSourceId = sourceId;
    },

    addNotifyMessage(message) {
        if (PC.user_preferences.messages_ignore_list.find(msgId => msgId == message.id) == null) {
            this.removeNotifyMessage(message.id);
            this.notifyMessages.push(message);
        }
    },

    removeNotifyMessage(messageId) {
        var message = this.notifyMessages.find(msg => msg.id == messageId);
        if (message) {
            clearTimeout(message.timeout);
            this.notifyMessages = this.notifyMessages.filter(msg => msg.id != message.id);
            if (message.dontShowMore) {
                UserPrefs.addMessageToIgnore(message);
                // Lo queremos desde ya en PC, no al reiniciar
                UserPrefs.refresh(); 
            }
        }
    },

    showStaffNotifyMessages() {
        if (PC.notify_messages) {
            PC.notify_messages.filter(msg => msg.id).forEach(msg => {
                msg.type = "alert";
                msg.title = "Aviso!"
                msg.duration = 0;
                msg.ignorable = true;
                this.addNotifyMessage(msg);
            });
        }

    },
    
};

export default MapState


