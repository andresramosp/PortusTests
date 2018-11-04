import { MapResources } from '@/common/mapResourceManager';
import ApiService from "@/services/api.service";
import MapUtils from "@/services/map.utils";
import { BASE_URL_PORTUS } from '@/common/config';

const MapState = {

    map: null,
    markerSelected: null,
    predictionScaleImg: null,
    preloadedTimeLineLayers: [],
    preloadedMarkers: [],
    activeMapOptions: [],
    loadingThings: [],

    init(map) {
        this.map = map;
        this.cacheLayers();
    },

    cacheLayers() {
        MapResources.forEach(async mr => {
            if (mr.type == "MarkerLayer" && mr.cached) {
                mr.cachedData = await ApiService.get(mr.resourceApi + (mr.locale ? ('?locale=' + 'es') : ''));
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
        var result = mapResource.cachedData || await ApiService.get(mapResource.resourceApi + (mapResource.locale ? ('?locale=' + 'es') : ''));
        result.data.forEach(m => {
            var iconUrl = typeof mapResource.icon === "function" ? mapResource.icon(m) : mapResource.icon;
            var customIcon = L.icon({ iconUrl: require('@/assets/markers/' + iconUrl), iconSize: [17, 17] });
            var marker = L.marker([m.latitud, m.longitud], { icon: customIcon });
            var ms = this;
            marker.on('click', function (e) {
                ms.markerSelected = this;
            });
            marker.on('mouseover', function (e) {
                MapUtils.openMarkerPopup(this);
            });
            marker.on('mouseout', function (e) {
                this.closePopup();
            });
            marker.mapResource = mapResource;
            marker.mapOption = mapOption;
            Object.assign(marker, m);
            if (mapResource.showAll) {
                marker.addTo(this.map);
            }
            else {
                this.preloadedMarkers.push(marker);
            }
        });

        this.setVisibleMarkerLayers();
        this.removeLoading('markers');
    },

    async addTimeLineLayer(mapResource, vectorial) {
        this.addLoading('timelines');
        var result = await ApiService.get(mapResource.resourceApi);
        result.data.forEach(res => {
            var tileLayer = L.tileLayer(BASE_URL_PORTUS + res.url + '{d}{h}/' + (vectorial ? 'vec' : 'map') + '//{z}/{x}/{y}.png', {
                tms: true,
                minZoom: res.zoomMin,
                maxZoom: res.zoomMax,
                bounds: L.latLngBounds(L.latLng(res.limN, res.limW), L.latLng(res.limS, res.limE)),
                period: res.numStep,
                strLastate: res.strLastate,
                gaps: res.numGap,
                predictionScaleImg: res.urlPaleta
            });
            var portusTimeLayer = L.timeDimension.layer.tileLayer.timeLine(
                tileLayer,
                {}
            );
            tileLayer.mapResource = mapResource;
            portusTimeLayer.mapResource = mapResource;
            this.preloadedTimeLineLayers.push(portusTimeLayer);

            // var rect = L.rectangle([[res.limN, res.limW], [res.limS, res.limE]], { color: 'white', fillOpacity: 0.0, weight: 1 }).on('click', function (e) {
            //   console.info(e);
            // }).addTo(this.map);

            // rect.mapResource = mapResource;
        })
        this.setVisibleTimeLineLayers();
        this.removeLoading('timelines');
    },

    setVisibleMarkerLayers() {
        var ms = this;
        this.preloadedMarkers.forEach(function (marker) {
            if (MapUtils.markerVisible(ms.map, marker)) {
                marker.addTo(ms.map);
            }
            else {
                marker.remove();
            }
        });
    },

    setVisibleTimeLineLayers() {
        var ms = this;
        this.preloadedTimeLineLayers.forEach(function (preLayer) {
            if (MapUtils.tileLayerVisible(ms.map, preLayer._baseLayer)) {
                if (!ms.map.hasLayer(preLayer)) {
                    ms.map.options.timeDimensionOptions.period = "PT" + preLayer._baseLayer.options.period + "H";
                    var date = new Date();
                    date.setUTCHours(0, 0, 0, 0);
                    var predHours = (preLayer._baseLayer.options.gaps - 1) * 24; //preLayer.mapResource.predictionTime ? preLayer.mapResource.predictionTime : 72;
                    ms.map.options.timeDimensionOptions.timeInterval = date.toISOString() + '/PT' + predHours + 'H'; // 'PT192H/' + sv.convertYMDHToDate(preLayer._baseLayer.options.strLastate).toISOString();
                    ms.map.timeDimension.initialize(ms.map.options.timeDimensionOptions);
                    ms.map.timeDimension.setCurrentTimeIndex(0);
                    if (ms.map.timeDimensionControl) {
                        ms.map.timeDimensionControl._player.stop();
                        ms.map.removeControl(ms.map.timeDimensionControl);
                    }
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
                    preLayer.addTo(ms.map);

                    if (preLayer._baseLayer.options.predictionScaleImg) {
                        ms.predictionScaleImg = preLayer._baseLayer.options.predictionScaleImg;
                    }

                    console.log('Added: ' + preLayer._baseLayer._url)
                }
            }
            else {
                if (ms.map.hasLayer(preLayer)) {
                    preLayer.remove();
                    if (ms.map.timeDimensionControl) {
                        ms.map.timeDimensionControl._player.stop();
                        ms.map.removeControl(ms.map.timeDimensionControl);
                    }

                    if (preLayer._baseLayer.options.predictionScaleImg)
                        ms.predictionScaleImg = '';

                    console.log('Removed: ' + preLayer._baseLayer._url);
                }
            }
        })
    },

    addTileLayer(mapResource) {
        var tileLayer = L.tileLayer(mapResource.resourceUrl, {
            tms: mapResource.tms,
        });
        tileLayer.mapResource = mapResource;
        tileLayer.addTo(this.map);
    },

    removeLayer(mapResourceId) {
        var ms = this;
        this.map.eachLayer(function (layer) {
            if (layer.mapResource && layer.mapResource.id == mapResourceId)
                layer.remove();
        });
        this.preloadedTimeLineLayers = this.preloadedTimeLineLayers.filter((plt) => { return plt.mapResource.id != mapResourceId });
        this.preloadedMarkers = this.preloadedMarkers.filter((plm) => { return plm.mapResource.id != mapResourceId });

        if (this.preloadedTimeLineLayers.length == 0 && this.map.timeDimensionControl) {
            this.map.removeControl(this.map.timeDimensionControl);
            ms.predictionScaleImg = '';
        }
    },

    addLoading(thing) {
        if (this.loadingThings.indexOf(thing) == -1)
            this.loadingThings.push(thing);
    },

    removeLoading(thing) {
        //this.loadingThings.splice(this.loadingThings.indexOf(thing), 1);
        this.loadingThings = this.loadingThings.filter(t => { return t != thing });
    }
};

export default MapState