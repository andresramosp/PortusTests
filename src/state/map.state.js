import { MapResources } from '@/common/mapResourceManager';
import ApiService from "@/services/api.service";
import MapUtils from "@/services/map.utils";
import { BASE_URL_PORTUS } from '@/common/config';
import Vue from 'vue';

import LastDataPopup from "@/components/lastDataPopup.vue";

const MapState = {

    map: null,
    mapOptionsGroups: [],
    mapOptions: [],
    markersSelected: null,
    ubicacionSelected: null,
    predictionScaleImg: null,
    preloadedTimeLineLayers: [],
    preloadedMarkers: [],
    currentTimeLineLayer: null,
    currentPlayerTime: null,
    staticMapResourceSelected: null,
    loadingThings: [],
    heapedPopup: null,
    mapLogos: [],
    RTDataTableStation: null,
    RTDataTableParameters: [],
    predDataTableLocation: null,
    predDataTableVariable: null,
    radarPointsLayer: null,
    currentRadar: null,

    init(map) {
        this.map = map;
        this.cacheLayers();
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

    async addMarkerLayer(mapResource, mapOption) {
        this.addLoading('markers');
        var result = mapResource.cachedData || await ApiService.get(mapResource.resourceApi, (mapResource.locale ? { locale: Vue.$getLocale() } : null )); // {data: [{latitud: 80, longitud: 80, id:'1', icon: 'estacion-agitacion.png', nombre:'hola' }, {latitud: 80, longitud: 82, id:'2', icon: 'estacion-agitacion.png', nombre: 'adios' }]};/
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
            marker.visible = !marker.mapResource.unchecked &&
                            (!marker.mapResource.groupLayersBy 
                         || !marker.mapResource.groupLayersBy.defaultVisibles 
                         || marker.mapResource.groupLayersBy.defaultVisibles.indexOf(marker[marker.mapResource.groupLayersBy.field]) != -1);
            
            this.preloadedMarkers.push(marker);
        });

        this.setVisibleMarkerLayers();
        this.removeLoading('markers');
    },

    async addTimeLineLayer(mapResource, vectorial) {
        this.addLoading('timelines');
        var result = await ApiService.get(mapResource.resourceApi);
        result.data.forEach(res => {
            if (this.preloadedTimeLineLayers.find(p => p.url == res.url) == null) {
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
                tileLayer.mapResource = mapResource;
                portusTimeLayer.mapResource = mapResource;
                portusTimeLayer.visible = true; 
                portusTimeLayer.id = res.url;
                Object.assign(portusTimeLayer, res);
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
                    // rect.visible = true;
                    // rect.minZoom = 0;
                    // rect.maxZoom = 7;
                    // this.preloadedMarkers.push(rect);
                   
                    //this.setVisibleMarkerLayers();
                }
            }

        })
        this.setVisibleTimeLineLayers();
        this.removeLoading('timelines');
    },

    setVisibleMarkerLayers() {
        var ms = this;
        this.preloadedMarkers.forEach(function (marker) {
            if (marker.visible && (marker.mapResource.showAll || (MapUtils.markerVisible(ms.map, marker)))) {
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
                date = date.addDays(-3);
                date.setUTCHours(0, 0, 0, 0);
                var predHours = (preLayer._baseLayer.options.numDays) * 24; //preLayer.mapResource.predictionTime ? preLayer.mapResource.predictionTime : 72;
                ms.map.options.timeDimensionOptions.timeInterval = date.toISOString() + '/PT' + predHours + 'H'; // 'PT192H/' + sv.convertYMDHToDate(preLayer._baseLayer.options.strLastate).toISOString();
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
                        autoPlay: true
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
                        ms.map.removeLayer(ms.radarPointsLayer);
                        ms.currentRadar = null;
                        console.log('Removed Radar: ' + preLayer.dominio)
                }
                if (preLayer.boundRectangle)
                    preLayer.boundRectangle.addTo(ms.map);
            }
        })
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
                if (layer.mapResource.isRadar)
                    ms.currentRadar = null;
            }
        });

        this.preloadedTimeLineLayers = this.preloadedTimeLineLayers.filter((plt) => { return plt.mapResource.id != mapResourceId });
        this.preloadedMarkers = this.preloadedMarkers.filter((plm) => { return plm.mapResource.id != mapResourceId });
        this.currentTimeLineLayer = null;

        if (this.preloadedTimeLineLayers.length == 0 && this.map.timeDimensionControl) {
            this.map.timeDimensionControl._player.stop();
            this.map.removeControl(this.map.timeDimensionControl);
            ms.predictionScaleImg = '';
            ms.currentTimeLineLayer = null;
        }

        
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
          this.checkMultipleAllowed(mapOption)
          mapOption.mapResources.forEach(resId => {
              var mapResource = this.getMapResource(resId);
              if (mapResource.type == "MarkerLayer")
                this.addMarkerLayer(mapResource, mapOption);
              if (mapResource.type == "TimeLineLayer")
                this.addTimeLineLayer(mapResource, mapResource.defaultVectors);
          });
        }
        else {
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
        var optionGroup = this.mapOptionsGroups.find(optGrp => optGrp.id == checkedMapOption.group);
          if (!optionGroup.multiple) {
              var otherCheckedOption = this.mapOptions.find(opt => opt.id != checkedMapOption.id && opt.group == optionGroup.id && opt.active);
              if (otherCheckedOption) {
                 otherCheckedOption.active = false;
                 this.setMapOption(otherCheckedOption.id, false);
              }
          }
    },

    addLoading(thing) {
        if (this.loadingThings.indexOf(thing) == -1)
            this.loadingThings.push(thing);
    },

    removeLoading(thing) {
        this.loadingThings = this.loadingThings.filter(t => { return t != thing });
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

    setRTDataTable(station, parameters) {
        this.RTDataTableStation = station;
        this.RTDataTableParameters = parameters;
    },

    setPredDataTable(location, variable) {
        this.predDataTableLocation = location;
        this.predDataTableVariable = variable;
    },

    async getRadarPoints(layer) {

        var mode = "MousePoints"; // "MousePoints", "AllPoints", "NoPoints"

        if (!this.currentRadar || this.currentRadar.dominio != layer.idDominio) {

            if (this.radarPointsLayer)
                this.map.removeLayer(this.radarPointsLayer);

            var requestRadar = await ApiService.get('radares/' + layer.idDominio, { locale: Vue.$getLocale() });
            this.currentRadar = requestRadar.data;
    
            var requestPoints = await ApiService.get('puntosRadar/' + layer.idDominio);
            this.radarPoints = requestPoints.data;
    
            var ms = this;
            this.radarPointsLayer = L.layerGroup();
            this.radarPointsLayer.mapResource = layer.mapResource;

            this.radarPoints.forEach(rp => {
                var lat = this.currentRadar.latitudMalla + (rp.latitud * this.currentRadar.stepLat);
                var lon = this.currentRadar.longitudMalla + (rp.longitud * this.currentRadar.stepLon);
                var circleMarker = L.circleMarker([lat, lon], {
                    radius: 5,
                    stroke: false,
                    fillOpacity: mode == "AllPoints" ? 0.15 : 0,
                    opacity: 0,
                    color: '#3388ff'
                });
                circleMarker.nombre = ms.currentRadar.nombre;
                circleMarker.on('click', async function (e) {
                    
                });
                circleMarker.on('mouseover', function (e) {
                    circleMarker.hovered = true;
                    circleMarker.setStyle({ fillOpacity: 1 });
                    circleMarker.setRadius(7);
                    circleMarker.timeOut = setTimeout(() => {
                        ms.getRadarLastData(ms.currentRadar, rp.latitud, rp.longitud, new Date(ms.currentPlayerTime), circleMarker);
                    }, 250)
                    if (ms.circleMarkerOld) {
                        ms.circleMarkerOld.setStyle({ fillOpacity: mode == "NoPoints" ? 0 : 0.15 })
                        ms.circleMarkerOld.setRadius(5);
                    }
                    ms.circleMarkerOld = circleMarker;
                });
                circleMarker.on('mouseout', function (e) {
                    circleMarker.hovered = false;
                    clearTimeout(circleMarker.timeOut);
                    setTimeout(() => {
                        circleMarker.setStyle({ fillOpacity: mode == "NoPoints" ? 0 : 0.15 })
                        circleMarker.setRadius(5);
                    }, 3000);
                });
                ms.radarPointsLayer.addLayer(circleMarker);
            })
            this.radarPointsLayer.addTo(this.map);
            console.log('Added Radar: ' + layer.dominio)

            if (mode == "MousePoints") {
                this.map.on("mousemove", function(ev) {
                    var mouseLatLng = L.latLng(ev.latlng.lat, ev.latlng.lng);
                    ms.radarPointsLayer.eachLayer(function (circle) {
                        if (!circle.hovered) {
                            if (MapUtils.distanceInMeters(mouseLatLng, circle.getLatLng()) < 15000) {
                                circle.setStyle({ fillOpacity: 0.5, opacity: 0 });
                            }
                            else {
                                circle.setStyle({ fillOpacity: 0, opacity: 0 })
                            }
                        }
                        
                    });
                });
            }
            
        }
    },

    async getRadarLastData(radar, lat, lon, date, marker) {
        var lastData = await ApiService
                            .get('lastData/radar/' 
                            + radar.id
                            + '/' + lat 
                            + '/' + lon + '/' 
                            + date + '?locale=' + Vue.$getLocale());
        lastData.data.datos.push({ nombreParametro: "Longitud", valor: marker.getLatLng().lng, factor: 1, unidad: 'º'  });
        lastData.data.datos.push({ nombreParametro: "Latitud", valor: marker.getLatLng().lat, factor: 1, unidad: 'º'  });
        marker.lastDataComponent  = new Vue({ ...LastDataPopup, propsData: { marker: marker, data: lastData.data, radar: true } }).$mount()
        marker.bindPopup(marker.lastDataComponent.$el, { maxWidth: 560 });
        marker.openPopup();
    }

};

export default MapState


// setVisibleTimeLineLayers() {
    //     var ms = this;
    //     this.preloadedTimeLineLayers.forEach(function (preLayer) {
    //         if (MapUtils.tileLayerVisible(ms.map, preLayer._baseLayer)) {
    //             if (!ms.map.hasLayer(preLayer)) {
    //                 ms.map.options.timeDimensionOptions.period = "PT" + preLayer._baseLayer.options.hoursStep + "H";
    //                 var date = new Date();
    //                 date.setUTCHours(0, 0, 0, 0);
    //                 var predHours = (preLayer._baseLayer.options.numDays) * 24; //preLayer.mapResource.predictionTime ? preLayer.mapResource.predictionTime : 72;
    //                 ms.map.options.timeDimensionOptions.timeInterval = date.toISOString() + '/PT' + predHours + 'H'; // 'PT192H/' + sv.convertYMDHToDate(preLayer._baseLayer.options.strLastate).toISOString();
    //                 ms.map.timeDimension.initialize(ms.map.options.timeDimensionOptions);
    //                 ms.map.timeDimension.setCurrentTimeIndex(0);
    //                 if (ms.map.timeDimensionControl) {
    //                     ms.map.timeDimensionControl._player.stop();
    //                     ms.map.removeControl(ms.map.timeDimensionControl);
    //                 }
    //                 ms.map.timeDimensionControl = L.control.timeDimension({
    //                     position: "bottomleft",
    //                     playerOptions: {
    //                         transitionTime: 500,
    //                         loopButton: true,
    //                         loop: true
    //                     },
    //                     autoPlay: true
    //                 })
    //                 ms.map.addControl(ms.map.timeDimensionControl);
    //                 preLayer.addTo(ms.map);
    //                 ms.currentTimeLineLayer = preLayer;

    //                 if (preLayer._baseLayer.options.predictionScaleImg) {
    //                     ms.predictionScaleImg = preLayer._baseLayer.options.predictionScaleImg;
    //                 }

    //                 console.log('Added: ' + preLayer._baseLayer._url)
    //             }
    //         }
    //         else {
    //             if (ms.map.hasLayer(preLayer)) {
    //                 preLayer.remove();
    //                 ms.currentTimeLineLayer = null;
    //                 if (ms.map.timeDimensionControl) {
    //                     ms.map.timeDimensionControl._player.stop();
    //                     ms.map.removeControl(ms.map.timeDimensionControl);
    //                 }

    //                 if (preLayer._baseLayer.options.predictionScaleImg)
    //                     ms.predictionScaleImg = '';

    //                 console.log('Removed: ' + preLayer._baseLayer._url);
    //             }
    //         }
    //     })
    // },