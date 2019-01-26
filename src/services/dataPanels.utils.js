import MapState from "@/state/map.state";
import { MarkerClass, VariableType } from "@/common/enums";
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

    removeDataPanel(dataPanel) {
        var paramActiveField = dataPanel.type == "Graphic" ? 'graphicActive' : 'tableActive';
        MapState.bancosDatos[dataPanel.marker.id].forEach(param => {
            // DataPanel editable por parámetros (RT y Graphs)
            if (dataPanel.parameters) {
                if (dataPanel.parameters.find(p => p.paramEseoo == param.paramEseoo))
                    param[paramActiveField] = false;
            }
            // DataPanel editable por variable (Pred)
            else {
                if (dataPanel.variable == param.variable)
                    param[paramActiveField] = false;
            }
            
        })
        MapState.dataObjectsList = MapState.dataObjectsList.filter(o => o.id != dataPanel.id);
    },

    createDataListFromUserPrefs() {
        var markersIds = Object.keys(MapState.bancosDatos);
        markersIds.forEach(id => {
            // Usamos try/catch para prevenir que una posible alteración del localStorage por
            // medios externos pueda causar errores que impedirían arrancar la app.
            try {
                var marker = JSON.parse(localStorage.getItem('marker-' + id));
                if (marker) {
                    var activeTableParams = MapState.getBancoDatos(id).filter(param => param.tableActive);
                    var activeGraphicParams = MapState.getBancoDatos(id).filter(param => param.graphicActive);
                    if (marker.mapResource.markerClass == MarkerClass.EstacionRT) {
                        if (activeTableParams.length > 0) 
                            this.addRTDataTable(marker, activeTableParams);
                        activeGraphicParams.forEach(p => {
                            this.setRTGraphParam(marker, p);
                        })
                    }
                    if (marker.mapResource.markerClass == MarkerClass.PuntoMalla
                     || marker.mapResource.markerClass == MarkerClass.PuntoMallaVerif) {
                        if (activeTableParams.length > 0) 
                            this.setPredDataTable(marker, marker.mapOption.variableType, true);
                        if (activeGraphicParams.length > 0)
                            this.setPredGraphParam(marker, activeGraphicParams, null, false);
                    }
                    if (marker.mapResource.markerClass == MarkerClass.Ubicacion) {
                           if (activeTableParams.length > 0) 
                               this.setPredDataTable(marker, marker.mapOption.variableType, true);
                           if (activeGraphicParams.length > 0)
                               this.setPredGraphParam(marker, activeGraphicParams, null, true);
                       }
                }
            }
            catch(ex) {
                console.log("localStorage error");
            }
        })
    },


    // TODO: mover a userPrefs.service.js
    
    saveDataUserPrefs(marker) {
        var cachedBancoDatos = JSON.parse(localStorage.getItem('banco_datos'));
        if (!cachedBancoDatos)
            cachedBancoDatos = {};
        var bancoDatosMarker = MapState.getBancoDatos(marker.id).filter(param => param.tableActive || param.graphicActive);
        if (bancoDatosMarker.length > 0) {
            cachedBancoDatos[marker.id] = bancoDatosMarker;
            localStorage.setItem('banco_datos', JSON.stringify(cachedBancoDatos));
            if(!localStorage.getItem('marker-' + marker.id)) {
                var markerProperties = ['id', 'latId', 'lonId', 'lat', 'lon', 'latitud', 'longitud', 'radar', 'nombre', 'mapResource', 'mapOption', 'markerClass', 'variableType'];
                localStorage.setItem('marker-' + marker.id, JSON.stringify(marker, markerProperties));
            }
        }
        else {
            delete cachedBancoDatos[marker.id];
            localStorage.setItem('banco_datos', JSON.stringify(cachedBancoDatos));
            localStorage.removeItem('marker-' + marker.id);
        }
    }

}

export default DataPanelsUtils;