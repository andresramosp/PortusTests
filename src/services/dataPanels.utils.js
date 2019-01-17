import MapState from "@/state/map.state";
import Vue from 'vue';
import { BASE_URL_PORTUS_DATA } from '@/common/config';

const DataPanelsUtils = {

    addRTDataTable(marker, parameters) {
        var markerTable = MapState.dataObjectsList.find(d => d.type == "RTDataTable" && d.marker.id == marker.id);
        if (markerTable){
            markerTable.parameters = parameters;
            if (parameters.length == 0) {
                MapState.dataObjectsList = MapState.dataObjectsList.filter(d => d.id != markerTable.id);
            }
        }
        else {
            var nombre = marker.nombre;
            if (marker.radar) {
                nombre += ". " + "Posición del punto: " +  " Lat " + parseFloat(marker.lat).toFixed(2) + " N" + ": Lon " + parseFloat(marker.lon).toFixed(2) + " O";
            }
            MapState.dataObjectsList.unshift(
                { 
                    name: 'Tiempo Real para ' + nombre,
                    type: 'RTDataTable', 
                    marker: marker, 
                    parameters: parameters, 
                    id: this.generateDataPanelId()
                })
        }
        
    },
 
    setPredDataTable(location, variable, active) {
        var predTable = MapState.dataObjectsList.find(d => d.type == "PredDataTable" && d.marker.id == location.id && d.variable == variable);
        if (!predTable) {
            MapState.dataObjectsList.unshift(
                { 
                    name: 'Predicción ' + Vue.$t('{' + variable + '}'),
                    type: 'PredDataTable', 
                    marker: location, 
                    variable: variable,
                    id: this.generateDataPanelId()
                })
        }
        else if (!active) {
            MapState.dataObjectsList = MapState.dataObjectsList.filter(d => d.id != predTable.id);
        }
    },

    setRTGraphParam(station, param, interfazMode) {
        var graphPanel = MapState.dataObjectsList.find(d => 
            d.type == "Graphic" 
            && d.marker.id == station.id 
            && d.parameters[0].variable == param.variable);
            //&& d.marker.mapOption.variableType == station.mapOption.variableType);
        if (graphPanel){
            if (param.graphicActive) {
                graphPanel.parameters.push(param);
            }
            else {
                graphPanel.parameters = graphPanel.parameters.filter(p => p.paramEseoo != param.paramEseoo);
            }
            
            if (graphPanel.parameters.length > 0) {
                graphPanel.url =  BASE_URL_PORTUS_DATA 
                + "rtChart?station=" + station.id 
                + "&params=" + graphPanel.parameters.map(p => p.paramEseoo).join() 
                + "&dirParams=" + graphPanel.parameters.filter(p => p.unidad == 'º').map(p => p.paramEseoo).join() 
                + "&int=" + (interfazMode ? interfazMode : 'default')
                + "&isRadar=" + (station.radar ? 'true' : 'false')
                + (station.radar ? ("&lat=" + station.latId + "&lon=" + station.lonId) : '')
                + "&locale=" + Vue.$getLocale();
            }
            else {
                MapState.dataObjectsList = MapState.dataObjectsList.filter(d => d.id != graphPanel.id);
            }
        }
        else {
            var url = BASE_URL_PORTUS_DATA 
                + "rtChart?station=" + station.id 
                + "&params=" + param.paramEseoo
                // + "&dirParams=" + (param.unidad == 'º' ? param.paramEseoo : "")
                + "&int=" + (interfazMode ? interfazMode : 'default')
                + "&isRadar=" + (station.radar ? 'true' : 'false')
                + (station.radar ? ("&lat=" + station.latId + "&lon=" + station.lonId) : '')
                + "&locale=" + Vue.$getLocale();
            MapState.dataObjectsList.unshift(
                { 
                    name: 'Gráfica Tiempo Real ' + station.nombre,
                    type: 'Graphic', 
                    parameters: [param],
                    marker: station,
                    url: url, 
                    id: this.generateDataPanelId()
                })
        }
        
    },

    setPredGraphParam(modelPoint, parameters, interfazMode, isNivmar) {
        var endPoint = isNivmar ? 'nivmarChart' : 'predChart';
        var stationField = isNivmar ? 'mareografo' : 'codigoEstacion';
        var graphPanel = MapState.dataObjectsList.find(d => 
            d.type == "Graphic" 
            && d.marker.id == modelPoint.id 
            && d.marker.mapOption.variableType == modelPoint.mapOption.variableType);
        if (graphPanel){
            parameters.forEach(param => {
                if (param.graphicActive) {
                    graphPanel.parameters.push(param);
                }
                else {
                    graphPanel.parameters = graphPanel.parameters.filter(p => p.paramEseoo != param.paramEseoo);
                }
            })
            if (graphPanel.parameters.length > 0) {
                graphPanel.url =  BASE_URL_PORTUS_DATA 
                + endPoint + "?code=" + modelPoint.id 
                + (modelPoint[stationField] && modelPoint[stationField] != -1 ? "&station=" + modelPoint[stationField] : '')
                + "&var=" + graphPanel.parameters.map(p => p.paramEseoo).join() 
                + (graphPanel.parameters.filter(p => p.unidad == 'º').length > 0 ? '&dirVar=' + graphPanel.parameters.filter(p => p.unidad == 'º').map(p => p.paramEseoo).join()  : "")
                + "&int=" + (interfazMode ? interfazMode : 'default')
                + "&locale=" + Vue.$getLocale();
            }
            else {
                MapState.dataObjectsList = MapState.dataObjectsList.filter(d => d.id != graphPanel.id);
            }
        }
        else {  
            var url = BASE_URL_PORTUS_DATA 
                + endPoint + "?code=" + modelPoint.id 
                + (modelPoint[stationField] && modelPoint[stationField] != -1 ? "&station=" + modelPoint[stationField] : '')
                + "&var=" + parameters.map(p => p.paramEseoo).join() 
                + (parameters.filter(p => p.unidad == 'º').length > 0 ? '&dirVar=' + parameters.filter(p => p.unidad == 'º').map(p => p.paramEseoo).join()  : "")
                + "&int=" + (interfazMode ? interfazMode : 'default')
                + "&locale=" + Vue.$getLocale();
            MapState.dataObjectsList.unshift(
                { 
                    name: 'Gráfica Predicción ' + (modelPoint.nombre ? modelPoint.nombre : " Lat " + modelPoint.latitud.toFixed(2) + " N" + ": Lon " + modelPoint.longitud.toFixed(2) + " O"),
                    type: 'Graphic', 
                    parameters: parameters,
                    marker: modelPoint,
                    url: url, 
                    id: this.generateDataPanelId()
                })
        }
        
    },

    generateDataPanelId() {
        var id = MapState.dataObjectsList.length > 0 ? (Math.max.apply(null, MapState.dataObjectsList.map(d => d.id)) + 1) : 0;
        console.log(id);
        return  id;
    },

    removeDataPanel(id) {
        MapState.dataObjectsList = MapState.dataObjectsList.filter(o => o.id != id);
    },

}

export default DataPanelsUtils;