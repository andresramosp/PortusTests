
import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";
import RTDataPopup from "@/components/markerPopups/RTDataPopup.vue";
import Vue from 'vue';

const RadarsService = {

    async getRadarPoints(layer) {

        if (!MapState.currentRadar || MapState.currentRadar.dominio != layer.idDominio) {

            var requestRadar = await ApiService.get('radares/' + layer.idDominio, { locale: Vue.$getLocale() });
            MapState.currentRadar = requestRadar.data;

            // En principio no haría falta traerse todos los puntos-radar desde BD, pues
            // podríamos crear un marker usando las lat/lon calculadas. Lo mantengo porque igualmente
            // hemos de traer esos puntos por si queremos mostrar la malla auxiliar, y porque así se
            // garantiza que el cálculo coincide con un punto-radar existente en BD.
            MapState.addLoading('puntosRadar');
            var requestPoints = await ApiService.get('puntosRadar/' + layer.idDominio);
            MapState.radarPoints = requestPoints.data;

            var rs = this;
            MapState.map.on("mousemove", function(ev) {
                var mouseLatLng = L.latLng(ev.latlng.lat, ev.latlng.lng);
                var closestRP = rs.calculateClosestRadarPoint(mouseLatLng, MapState.currentRadar)
                if (closestRP) {
                    rs.addRadarPointMarker(closestRP, layer);
                }
            });
            
            this.addRadarPointsLayer(MapState.radarPoints, layer);
            MapState.removeLoading('puntosRadar');
        }
    },

    removeRadarPoints() {
        if (MapState.radarPointsLayer)
            MapState.map.removeLayer(MapState.radarPointsLayer);
        if (MapState.radarPointMarker) 
            MapState.radarPointMarker.remove();
        MapState.map.off("mousemove");
        MapState.currentRadar = null;
        MapState.showingRadars = false;
        MapState.preventMoveend = false;
    },

    async getRadarLastData(radar, lat, lon, date, marker) {
        MapState.addLoading('radarData');
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
        MapState.removeLoading('radarData');
    },

    calculateClosestRadarPoint(mouseLatLng, radar) {
        var latId = (mouseLatLng.lat - radar.latitudMalla) / radar.stepLat;
        var lonId = (mouseLatLng.lng - radar.longitudMalla) / radar.stepLon;
        return MapState.radarPoints.find(rp => rp.latitud == Math.round(latId) && rp.longitud == Math.round(lonId));
    },

    addRadarPointMarker(rp, layer) {
        if (!MapState.radarPointMarker || (MapState.radarPointMarker.latId != rp.latitud || MapState.radarPointMarker.lonId != rp.longitud)) {
            var lat = MapState.currentRadar.latitudMalla + (rp.latitud * MapState.currentRadar.stepLat);
            var lon = MapState.currentRadar.longitudMalla + (rp.longitud * MapState.currentRadar.stepLon);
            var circleMarker = L.circleMarker([lat, lon], {
                radius: 7,
                stroke: false,
                fillOpacity: 1,
                opacity: 0,
                color: '#bfd0ef' //'#3388ff'
            });
            circleMarker.latId = rp.latitud;
            circleMarker.lonId = rp.longitud;
            circleMarker.nombre = MapState.currentRadar.nombre;
            circleMarker.mapResource = layer.mapResource;

            // El panel de información lo abrimos como si hiciéramos click en la estación 
            // radar (que está invisible en el mapa), pero a dicho marker le asociamos
            // el latlon del puntoRadar, de forma que, para el banco de datos, se añada
            // dicha información en la llamada a la Api
            circleMarker.on('click', async function (e) {
                var markerRadar = MapState.preloadedMarkers.find(m => m.id == MapState.currentRadar.id);
                markerRadar.latId = rp.latitud;
                markerRadar.lonId = rp.longitud;
                markerRadar.lat = lat;
                markerRadar.lon = lon;
                MapState.markersSelected = [markerRadar];
            });
            var rs = this;
            circleMarker.on('mouseover', function (e) {
                circleMarker.timeOut = setTimeout(() => {
                    MapState.preventMoveend = true;
                    rs.getRadarLastData(MapState.currentRadar, rp.latitud, rp.longitud, new Date(MapState.currentPlayerTime), circleMarker);
                }, 250)
            });
            circleMarker.on('mouseout', function (e) {
                clearTimeout(circleMarker.timeOut);
                setTimeout(() => {
                    MapState.preventMoveend = false;
                }, 500);
            });

            if (MapState.radarPointMarker) 
                MapState.radarPointMarker.remove();

            circleMarker.addTo(MapState.map);
            MapState.radarPointMarker = circleMarker;
        }
        
    },

    // De entrada se añaden invisibles
    addRadarPointsLayer(radarPoints, layer) {
        if (MapState.radarPointsLayer)
            MapState.map.removeLayer(MapState.radarPointsLayer);

        MapState.radarPointsLayer = L.layerGroup();
        MapState.radarPointsLayer.mapResource = layer.mapResource;

        radarPoints.forEach(rp => {
            var lat = MapState.currentRadar.latitudMalla + (rp.latitud * MapState.currentRadar.stepLat);
            var lon = MapState.currentRadar.longitudMalla + (rp.longitud * MapState.currentRadar.stepLon);
            var circleMarker = L.circleMarker([lat, lon], {
                radius: 5,
                stroke: false,
                fillOpacity: 0,
                opacity: 0,
                color: '#3388ff'
            });
        
            MapState.radarPointsLayer.addLayer(circleMarker);
        })

        MapState.radarPointsLayer.addTo(MapState.map);
    },

    setRadarPointsLayerVisibility(visible) {
        MapState.radarPointsLayer.eachLayer(l => {
            l.setStyle({ fillOpacity: visible ? 0.25 : 0 });
        })
        MapState.showingRadars = visible;
    }

}

export default RadarsService;