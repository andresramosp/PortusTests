import { MapResources } from '@/common/mapResourceManager';
import ApiService from "@/services/api.service";
import MapUtils from "@/services/map.utils";
import DataPanelsUtils from "@/services/dataPanels.utils";
import { BASE_URL_PORTUS } from '@/common/config';
import Vue from 'vue';

import RTDataPopup from "@/components/markerPopups/RTDataPopup.vue";

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

    init(map) {
        this.map = map;
        this.cacheLayers();
        DataPanelsUtils.createDataListFromUserPrefs();
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
                    MapUtils.markerMouseClick(ms.map, this);
                }
                else {
                    ms.popupFixed = true;
                }
            });
            marker.on('mouseover', function (e) {
                MapUtils.markerMouseOver(ms.map, this);
            });
            marker.on('mouseout', function (e) {
                MapUtils.markerMouseOut(ms.map, this);
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
            if (true) { //(this.preloadedTimeLineLayers.find(p => p.url == res.url) == null) {
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
                portusTimeLayer.id = res.url;
                this.preloadedTimeLineLayers.push(portusTimeLayer);
    
                if (mapResource.paintBounds) {
                    var ms = this;
                    var rect = L.rectangle([[res.limN, res.limW], [res.limS, res.limE]], { color: 'red', fillOpacity: 0.1, weight: 1 })
                    .on('click', function (e) {
                        ms.map.flyToBounds(e.target.getBounds().pad(0.25));
                    })
                    rect.mapResource = mapResource;
                    rect.addTo(this.map);
                    portusTimeLayer.boundRectangle = rect;
                }
            }

        })
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
            && (marker.mapResource.showAll || (MapUtils.markerVisible(ms.map, marker)))) {
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
                    ms.predictionScaleImg = '';
                    preLayer._baseLayer.options.logosImgs.forEach(url => {
                    ms.removeMapLogo(url);
                })
    
                console.log('Removed: ' + preLayer._baseLayer._url);
            }
            if (MapUtils.tileLayerVisible(ms.map, preLayer._baseLayer) && preLayer.visible) {
                ms.map.options.timeDimensionOptions.period = "PT" + preLayer._baseLayer.options.hoursStep + "H";
                var date = new Date();
                date.setUTCHours(0, 0, 0, 0);
                var predHours = (preLayer._baseLayer.options.numDays) * 24; 
                ms.maxPredictionDate = MapUtils.convertYMDHToDateStr(preLayer._baseLayer.options.strLastate);
                ms.map.options.timeDimensionOptions.timeInterval = 'PT' + predHours + 'H/' + ms.maxPredictionDate;
                //ms.map.options.timeDimensionOptions.timeInterval = 'PT' + predHours + 'H/' + ms.maxPredictionDate.toLocalTime().toISOString();
                ms.map.timeDimension.initialize(ms.map.options.timeDimensionOptions);
                ms.map.timeDimension.setCurrentTimeIndex(0);
                if (!ms.map.timeDimensionControl) {
                    ms.map.timeDimensionControl = L.control.timeDimension({
                        position: "bottomleft",
                        playerOptions: {
                            transitionTime: 500,
                            loopButton: true,
                            loop: true
                        },
                        autoPlay: true,
                        minimized: ms.playerMinimized
                    })
                    ms.map.addControl(ms.map.timeDimensionControl);
                }
                preLayer.addTo(ms.map);
                ms.currentTimeLineLayer = preLayer;

                if (preLayer._baseLayer.options.predictionScaleImg) 
                    ms.predictionScaleImg = preLayer._baseLayer.options.predictionScaleImg;

                preLayer._baseLayer.options.logosImgs.forEach(url => {
                    ms.addMapLogo(url);
                })

                if (preLayer.mapResource.isRadar)
                    ms.getRadarPoints(preLayer);

                if (preLayer.boundRectangle)
                    preLayer.boundRectangle.remove();

                console.log('Added: ' + preLayer._baseLayer._url)
            }
            else {
                if (preLayer.mapResource.isRadar && (ms.currentRadar && ms.currentRadar.dominio == preLayer.idDominio)) {
                    ms.removeRadarPoints()
                    console.log('Removed Radar: ' + preLayer.idDominio)
                }
                if (preLayer.boundRectangle)
                    preLayer.boundRectangle.addTo(ms.map);
            }
        })
    },

    setPlayerDateRangeValue(from, to) {
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
    },

    setPlayerMinimized(value) {
        this.playerMinimized = value;
        this.map.timeDimensionControl.options.minimized = value;
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
        this.map.eachLayer(function (layer) {
            if (layer.mapResource && layer.mapResource.id == mapResourceId) {
                layer.remove();
                if (layer.mapResource.type == "TimeLineLayer" && layer._baseLayer) {
                    layer._baseLayer.options.logosImgs.forEach(url => {
                        ms.removeMapLogo(url);
                    })
                }
                if (layer.mapResource.isRadar && (ms.currentRadar && ms.currentRadar.dominio == layer.idDominio)) {
                    ms.removeRadarPoints();
                }
            }
        });

        this.preloadedTimeLineLayers = this.preloadedTimeLineLayers.filter((plt) => { return plt.mapResource.id != mapResourceId });
        this.preloadedMarkers = this.preloadedMarkers.filter((plm) => { return plm.mapResource.id != mapResourceId });

        if (this.preloadedMarkers.length == 0)
            this.closeHeapedPopup();
        
        if (this.currentTimeLineLayer && this.currentTimeLineLayer.mapResource.id == mapResourceId && this.map.timeDimensionControl) 
            this.removePlayerControl();
    },

    removePlayerControl() {
        this.map.timeDimensionControl._player.stop();
        this.map.removeControl(this.map.timeDimensionControl);
        this.predictionScaleImg = '';
        this.currentTimeLineLayer = null;
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
    

    // TODO: llevarse funcionalidad a radar.service.js

    async getRadarPoints(layer) {

        if (!this.currentRadar || this.currentRadar.dominio != layer.idDominio) {

            var requestRadar = await ApiService.get('radares/' + layer.idDominio, { locale: Vue.$getLocale() });
            this.currentRadar = requestRadar.data;

            // En principio no haría falta traerse todos los puntos-radar desde BD, pues
            // podríamos crear un marker usando las lat/lon calculadas. Lo mantengo porque igualmente
            // hemos de traer esos puntos por si queremos mostrar la malla auxiliar, y porque así se
            // garantiza que el cálculo coincide con un punto-radar existente en BD.
            this.addLoading('puntosRadar');
            var requestPoints = await ApiService.get('puntosRadar/' + layer.idDominio);
            this.radarPoints = requestPoints.data;

            var ms = this;
    
            this.map.on("mousemove", function(ev) {
                var mouseLatLng = L.latLng(ev.latlng.lat, ev.latlng.lng);
                var closestRP = ms.calculateClosestRadarPoint(mouseLatLng, ms.currentRadar)
                if (closestRP) {
                    ms.addRadarPointMarker(closestRP, layer);
                }
            });
            
            this.addRadarPointsLayer(this.radarPoints, layer);
            this.removeLoading('puntosRadar');
        }
    },

    removeRadarPoints() {
        if (this.radarPointsLayer)
            this.map.removeLayer(this.radarPointsLayer);
        if (this.radarPointMarker) 
            this.radarPointMarker.remove();
        this.map.off("mousemove");
        this.currentRadar = null;
        this.showingRadars = false;
    },

    async getRadarLastData(radar, lat, lon, date, marker) {
        this.addLoading('radarData');
        var lastData = await ApiService
                            .get('lastData/radar/' 
                            + radar.id
                            + '/' + lat 
                            + '/' + lon + '/' 
                            + date + '?locale=' + Vue.$getLocale());
        lastData.data.datos.push({ nombreParametro: "Longitud", valor: marker.getLatLng().lng, factor: 1, unidad: 'º'  });
        lastData.data.datos.push({ nombreParametro: "Latitud", valor: marker.getLatLng().lat, factor: 1, unidad: 'º'  });
        marker.lastDataComponent  = new Vue({ ...RTDataPopup, propsData: { marker: marker, data: lastData.data, radarPoint: true } }).$mount()
        marker.bindPopup(marker.lastDataComponent.$el, { maxWidth: 560 });
        marker.openPopup();
        this.removeLoading('radarData');
    },

    calculateClosestRadarPoint(mouseLatLng, radar) {
        var latId = (mouseLatLng.lat - radar.latitudMalla) / radar.stepLat;
        var lonId = (mouseLatLng.lng - radar.longitudMalla) / radar.stepLon;
        return this.radarPoints.find(rp => rp.latitud == Math.round(latId) && rp.longitud == Math.round(lonId));
    },

    addRadarPointMarker(rp, layer) {
        if (!this.radarPointMarker || (this.radarPointMarker.latId != rp.latitud || this.radarPointMarker.lonId != rp.longitud)) {
            var lat = this.currentRadar.latitudMalla + (rp.latitud * this.currentRadar.stepLat);
            var lon = this.currentRadar.longitudMalla + (rp.longitud * this.currentRadar.stepLon);
            var circleMarker = L.circleMarker([lat, lon], {
                radius: 7,
                stroke: false,
                fillOpacity: 1,
                opacity: 0,
                color: '#bfd0ef' //'#3388ff'
            });
            circleMarker.latId = rp.latitud;
            circleMarker.lonId = rp.longitud;
            circleMarker.nombre = this.currentRadar.nombre;
            circleMarker.mapResource = layer.mapResource;
    
            // El panel de información lo abrimos como si hiciéramos click en la estación 
            // radar (que está invisible en el mapa), pero a dicho marker le asociamos
            // el latlon del puntoRadar, de forma que, para el banco de datos, se añada
            // dicha información en la llamada a la Api
            var ms = this;
            circleMarker.on('click', async function (e) {
                var markerRadar = ms.preloadedMarkers.find(m => m.id == ms.currentRadar.id);
                markerRadar.latId = rp.latitud;
                markerRadar.lonId = rp.longitud;
                markerRadar.lat = lat;
                markerRadar.lon = lon;
                ms.markersSelected = [markerRadar];
            });
            circleMarker.on('mouseover', function (e) {
                circleMarker.timeOut = setTimeout(() => {
                    ms.getRadarLastData(ms.currentRadar, rp.latitud, rp.longitud, new Date(ms.currentPlayerTime), circleMarker);
                }, 250)
            });
            circleMarker.on('mouseout', function (e) {
                clearTimeout(circleMarker.timeOut);
            });
    
            if (this.radarPointMarker) 
                this.radarPointMarker.remove();

            circleMarker.addTo(this.map);
            this.radarPointMarker = circleMarker;
        }
        
    },

    // De entrada se añaden invisibles
    addRadarPointsLayer(radarPoints, layer) {
        if (this.radarPointsLayer)
            this.map.removeLayer(this.radarPointsLayer);

        this.radarPointsLayer = L.layerGroup();
        this.radarPointsLayer.mapResource = layer.mapResource;

        radarPoints.forEach(rp => {
            var lat = this.currentRadar.latitudMalla + (rp.latitud * this.currentRadar.stepLat);
            var lon = this.currentRadar.longitudMalla + (rp.longitud * this.currentRadar.stepLon);
            var circleMarker = L.circleMarker([lat, lon], {
                radius: 5,
                stroke: false,
                fillOpacity: 0,
                opacity: 0,
                color: '#3388ff'
            });
           
            this.radarPointsLayer.addLayer(circleMarker);
        })

        this.radarPointsLayer.addTo(this.map);
    },

    setRadarPointsLayerVisibility(visible) {
        this.radarPointsLayer.eachLayer(l => {
            l.setStyle({ fillOpacity: visible ? 0.25 : 0 });
        })
        this.showingRadars = visible;
    },
    
};

export default MapState


