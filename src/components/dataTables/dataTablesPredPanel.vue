
 <template>
  <div style="min-height: 200px" id="tablePred" class="printable">
    <div class="allCenter">
      <img 
        style="margin-top: 80px"
        :src="require('@/assets/gifs/loadingBars.gif')"
        v-show="loading"
        width="100"
      >
    </div>

    <div >
      <span v-if="errorMsg" >{{errorMsg}}</span>
      <b-row v-if="!loading && !errorMsg" class="fadeIn">
       <b-col  cols="3" style="display: flex;">
          <img v-if="isCirana()" src="http://portus.puertos.es/Portus/img/logo_copernicusMFC.png" style="float:left" width="36" height="36">
          <img :src="defaultLogo" style="margin-left: 5px; margin-bottom: 15px; float:left">
        </b-col>
        <b-col cols="7" style="text-align: left">
          {{titulo}}
         </b-col>
         <b-col cols="2">
      
            <ShareInfoPanel
              v-if="routeData && !isWidget"
              :routeData="routeData"
              :iFrameWidth="1040"
              :iFrameHeight="570"
              class="sharePanel"
              position="bottomLeft"
              :imgWidth="23"
              @opening="showingShareInfo = true"
              @closing="showingShareInfo = false"
            />
             <img
              :src='require("@/assets/icons/pdfReport.png")'
              class="shareIcon"
              v-if="hasReport()"
              @click="openReport"
              :title="$t('{pdfReport}')"
            >
            <img
              :src='require("@/assets/icons/imprimir.png")'
              class="shareIcon"
              @click="printTable"
              :title="$t('{printButton}')"
            >
        </b-col>
      </b-row>
      <b-row :class="[showingShareInfo ? '' : '']">
        <b-col v-if="!loading" class="fadeIn">

          <NivmarPleaBajaPredPanel 
              ref="pleaBajaContainer" 
              :marker="marker" 
              :dataAux="days"
              v-if="variable == variableType.SEA_LEVEL" 
              style="margin-bottom: 10px" />

          <b-tabs v-if="marker && days.length > 0" v-model="tabIndex" @input="onShowTab">
            <b-tab
              v-for="(dataSource, index) in days"
              :key="dataSource.id"
              :title="$t('{'+ dataSource.id +'}')"
              :title-link-class="linkClass(index)"
              :ref="'tableContainer' + index"
            >
            <div >

              <dx-data-grid
                 :ref="'dataGrid' + index"
                :data-source="dataSource.data"
                :allow-column-reordering="false"
                :allow-sorting="false"
                :allow-column-resizing="false"
                :row-alternation-enabled="true"
                :show-borders="false"
                :showColumnLines="false"
                :showRowLines="false"
                :customize-columns="customizeColumns"
                @cellPrepared="renderCell"
              >

              </dx-data-grid>
            </div>
           
            </b-tab>
          </b-tabs>
          <div style="margin-top: 5px; font-size: 13px" >
              <a v-if="mareaAstronomicaUrl" 
                :href="mareaAstronomicaUrl" target='_blank'>
                {{this.$t('{linkToMareaAstro}')}} {{this.mapUtils.getMarkerName(this.marker)}}
              </a>
          </div>
        
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import MapState from "@/state/map.state";
import MapService from "@/services/map.service";
import ApiService from "@/services/api.service";
import PaletteService from "@/services/palette.service"
import { VariableType, UbicacionType, MarkerClass } from "@/common/enums";
import { DxPopup, DxToolbarItem } from "devextreme-vue/popup";
import { DxDataGrid, DxColumn, DxPager, DxPaging, DxGrouping, DxGroupPanel } from "devextreme-vue/data-grid";
import ShareInfoPanel from "@/components/shareInfoPanel.vue";
import NivmarPleaBajaPredPanel from "@/components/dataTables/nivmarPleaBajaPredPanel.vue";
import { BANCO_DATOS_URL, BASE_URL_PORTUS_REPORTS } from '@/common/config';

export default {
  name: "DataTablesPredPanel",
  components: {
    DxPopup,
    DxToolbarItem,
    ShareInfoPanel,
    DxDataGrid,
    DxColumn,
    DxPager,
    DxPaging,
    DxGrouping,
    DxGroupPanel,
    NivmarPleaBajaPredPanel
  },
  data() {
    return {
      defaultLogo: PC.default_map_logo,
      align: PC.options_panel_align,
      theme: "", // PC.color_theme,
      mapState: MapState,
      mapUtils: MapService,
      //titulo: '',
      nivelMarRef: null,
      displayShareInfo: false,
      columnsNames: {},
      days: [],
      tabIndex: 0,
      repeatedVarGroup: null,
      variableType: VariableType,
      minDataDay: 5,
      mareaAstronomicaUrl: null,
      routeData: null,
      showingShareInfo: false,
      errorMsg: null
    };
  },
  props: {
    marker: { type: Object, default: null },
    variable: { type: String, default: null },
    isWidget: { type: Boolean, default: false },
    preselectedTabIndex: { type: Number, default: 0 }
  },
  computed: {
    loading() {
      return this.days.length == 0 && !this.errorMsg;
    },
    titulo() {
      if (this.variable == VariableType.SEA_LEVEL) {
          return this.$t('{tablePredTitle_' + this.variable + '}') 
          + " " + MapService.getMarkerName(this.marker)
          + ' (Ref: ' +  (this.nivelMarRef == 0 ? this.$t('{nivelMedio}') : this.$t('{ceroRedmar}')) + ')'
      }
      else {
        return this.$t('{tablePredTitle_' + this.variable + '}') + " " + MapService.getMarkerName(this.marker);
      }
        
    }
  },
  watch: {
    loading: function() {
      if (!this.loading)
        this.$emit('loaded');
    },
    marker: function () {
      if (this.marker && this.variable)
        this.init();
    },
    preselectedTabIndex: function() {
      this.tabIndex = this.preselectedTabIndex;
    }
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      if (this.marker != null) {
        if (this.variable) {
           this.tabIndex = 0;
           this.days = [];
           this.getTableData();

           this.routeData = this.getRouteData();

          if (this.marker.mareaAstronomica) {
            this.mareaAstronomicaUrl = BANCO_DATOS_URL + "Mareas/Principal1.php?Estacion=" + this.marker.mareaAstronomica.id + "&Lenguaje=es"
          }
          else {
            this.mareaAstronomicaUrl = null;
          }

        }
      }
    },
    async getTableData() {
      try {
         var result = await ApiService.get("predData/" 
                                      + this.variable
                                      + "/" + this.marker.id 
                                      + "?locale=" + this.$getLocale())
      
        if (result.data.length > 0) {
            var groupDays = result.data.map(d => d.fecha
                .split(' ')[0])
                .filter(function (elem, index, self) { return index == self.indexOf(elem); });
            groupDays.forEach(day => {
              var dayData = { 
                _date: day,
                id: new Date(day).toLocaleDateString(this.$getLocale() == 'es' ? 'es-ES' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                data: this.formatData(result.data.filter(d => d.fecha.split(' ')[0] == day), day)
              }
              if (Object.keys(dayData.data[0]).length > this.minDataDay)
                this.days.push(dayData);
            })
            if (this.variable == VariableType.SEA_LEVEL)
              this.nivelMarRef = result.data[0].nivelRef;
        }
        else {
          this.errorMsg = "Error. No hay datos que mostrar.";
        }
      }
      catch(error) {
        this.errorMsg = error.message;
      }
     
    },
    formatData(data, day) {
      var result = [];
      data.forEach(fechaData => {
          fechaData.datos.forEach(paramData => {
            var reg = result.find(r => r.id == paramData.variableParametro + '-' + paramData.nombreParametro);
            if (!reg) {
              reg = { 
                id: paramData.variableParametro + '-' + paramData.nombreParametro, 
                variableParametro: paramData.variableParametro ? paramData.variableParametro.toUpperCase() : null, 
                nombreParametro: paramData.nombreParametro,
                _day: day
              }
              result.push(reg);
            }
            var hora = fechaData.fecha.split(' ')[1].substr(0,5)
            reg[hora] = paramData.valor ? parseFloat(paramData.valor) : null; 
          })
        }
      )
      return result;
    },
    customizeColumns(columns) {
      columns.forEach(col => {
        col.cssClass = "colHeader";
        col.allowSorting = false;
        if (col.dataField == 'nombreParametro') {
          col.caption = " ";
          col.width = this.variable == VariableType.SEA_LEVEL ? 80 : 60;
          col.visibleIndex = 1;
        }
        else if (col.dataField == "variableParametro") {
          col.caption = " ";
          col.width = this.variable == VariableType.SEA_LEVEL ? 0 : 115;
          col.visibleIndex = 0;
        }
       else if (col.dataField == "id" || col.dataField == "_day") {
          col.visible = false;
        }
        else {
           col.width = this.variable == VariableType.SEA_LEVEL ? 45 : 34;;
        }
      });
      return columns;
    },
    renderCell(ev) {
      if (ev.column.dataField == "variableParametro") {
        ev.cellElement.style.background = "rgba(127, 183, 231, 0.96)";
        ev.cellElement.style.color = "white";
        //ev.cellElement.style.fontWeight = 'bold';
        if (this.repeatedVarGroup && ev.value == this.repeatedVarGroup.value && ev.data._day == this.repeatedVarGroup.data._day) {
          ev.cellElement.innerHTML = "";
        }
        this.repeatedVarGroup = ev;
      }
      else if (ev.column.dataField == "nombreParametro") {
        ev.cellElement.style.background = "rgb(232, 232, 232)";
        ev.cellElement.style.color = "black";
      }
      else if (ev.rowType == "data") { 
        ev.cellElement.style.textAlign = "center";
        if (ev.data.nombreParametro == "Dir") {
          var dayData = this.days.find(d => d._date == ev.data._day);
          var rowSpeed = dayData.data.find(d => d.variableParametro == ev.data.variableParametro 
                                            && (d.nombreParametro == "Vc(m/s)" || d.nombreParametro == "Vv(m/s)" || d.nombreParametro == "Hs(m)"));
          var speedValue = rowSpeed[ev.column.dataField];
          ev.cellElement.innerHTML = ev.value != null ? this.getDirArrow(parseFloat(ev.value), parseFloat(speedValue), ev.data) : '';
        }
        else {
          var decimals = ev.value < 999 ? (this.variable == VariableType.SEA_LEVEL ? 2 : 1) : 0;
          ev.cellElement.innerHTML = ev.value != null ? ev.value.toFixed(decimals) : '';
        }
      }
    },
    getDirArrow(dir, speed, row) {
      var palette = typeof this.marker.mapResource.palette === "function" ? this.marker.mapResource.palette(row) : this.marker.mapResource.palette;
      var color = PaletteService.getColor(palette , speed);
      return "<svg version='1.1' baseProfile='full' xmlns='http://www.w3.org/2000/svg' width='15' height='15' style='margin:0px; padding:0px'>"
      + "<path transform='scale(0.15,0.15) rotate(" + dir + " 50 50)' stroke-width='3' stroke='#000000' fill='#" + color + "' d='m75,50 l-25,-45 l-25,45  l13,0 l0,45 l25,0 l0,-45 l13,0z'></path></svg>"
    },
    getRouteData() {
      return this.$router.resolve({
            path: "/dataTablesPredWidget",
            query: {
              locale: this.$getLocale(),
              locationCode: this.marker.id,
              latitud: this.marker.latitud,
              longitud: this.marker.longitud,
              variable: this.variable,
              mapResource: this.marker.mapResource.id
            }
          });
    },
    cerrar() {
      this.days = [];
      MapState.setPredDataTable(null, null);
    },
    linkClass (idx) {
      if (this.tabIndex === idx) {
        return ['bg-selectedTab', 'text-light']
      } else {
        return ['bg-light']
      }
    },
  
    printTable() {
      if (!this.isWidget) {
        var routePrintData = this.getRouteData();
        var printWindow = window.open(routePrintData.href + '&forPrint=true&tab=' + this.tabIndex, "_blank");
      }
      else {
        window.print();
      }
    },

    hasReport() {
      return (this.marker && this.marker.mapOption) &&
          (this.marker.mapOption.variableType == VariableType.WAVE
          || this.marker.mapOption.variableType == VariableType.SEA_LEVEL)
    },

    isCirana() {
      return this.variable == VariableType.CURRENTS 
        || this.variable == VariableType.SALINITY 
        || this.variable == VariableType.WATER_TEMP;
    },

    openReport() {
      var reportId =  this.marker.mapOption.variableType == VariableType.WAVE ? 3 : 1;
      window.open(BASE_URL_PORTUS_REPORTS + "report?id=" + reportId + "&f=PDF&p=" + this.toBase64(this.marker), '_blank');
    },

    toBase64(marker) {
      var stationField = marker.mapResource.markerClass == MarkerClass.Ubicacion ? 'mareografo' : 'codigoEstacion';
      var str = marker.id + ";;"
				+ marker.longitud + ";;"
				+ marker.latitud + ";;"
				+ (marker.mapOption.variableType == VariableType.WAVE ? 'WANA' : 'NIVMAR') + ";;"
				+ (marker[stationField] ? marker[stationField] : 0) + ";;" 
				+ (marker.codigoModelo ? marker.codigoModelo : marker.id) + ";;"
				+ this.getMarkerReportType(marker) + ";;"
				+ marker.nombre + ";;"
				+ '' + ";;" // Region
				+ (marker.mareaAstronomica ? marker.mareaAstronomica.id : '') + ";;"
				+ Math.round(this.mapState.getMap().getZoom()) + ";;"
				+ marker.malla + ";;"
      return btoa(str);
    },

    getMarkerReportType(marker) {
      switch (marker.mapResource.markerClass) {
        case MarkerClass.Ubicacion:
            return marker.tipoUbicacion.toUpperCase();
          break;
        case MarkerClass.PuntoMalla:
            if (marker.mapOption.variableType == VariableType.WAVE)
              return 'WANA_DATA';
            else 
              return '';
          break;
        case MarkerClass.PuntoMallaVerif:
            if (marker.mapOption.variableType == VariableType.WAVE)
              return 'VERIFICACION_OLEAJE';
            else 
              return '';
          break;
      }
    },

    onShowTab(tabIndex) {
      var dataGrid = this.$refs['dataGrid' + tabIndex][0];
      if (tabIndex > 0 && !dataGrid.shown) {
          dataGrid.$el.style.visibility = "hidden";
          dataGrid.$el.style.width = this.$refs['dataGrid0'][0].$el.style.width;
          dataGrid.instance.refresh();
          dataGrid.shown = true;
          setTimeout(() => {
             dataGrid.$el.style.visibility = "visible";
          }, 100);
         
      }
    }

  }
};
</script>



<style>


.list-container .nav-link {
    padding: 5px 15px 5px 15px !important;
    font-size: 14px !important;
}

.allCenter {
    text-align: center; 
    align-items: center; 
    justify-content: center;
    display: flex
  }

.shareInfoCenter {
    margin-top: 150px;
    width: 80%;
    margin-left: 100px;
}

.dx-datagrid-rowsview .dx-row {
    border-top: 0px !important;
    border-bottom: 0px !important;
}

.bg-selectedTab, 
#tablePred .dx-datagrid-headers .dx-row .colHeader {
    background-color: rgba(127, 183, 231, 0.96) !important;
}

.nav-link.bg-light {
  color: black !important;
  background-color: #e8e8e8 !important;
  border: 1px solid white;
}

a.bg-light:hover {
  background-color: lightgray !important;
  border: 1px solid white;
  color: black !important;
}

a.text-light:hover {
  color: white !important;
  border: 1px solid white;
}

a.text-light:focus {
  color: white !important;
  border: 1px solid white;
}

#tablePred .dx-datagrid-headers .dx-row .colHeader {
  font-size: 10px;
  color: #f8f9fa;
  padding-left: 2px;
  text-align: center !important;
}

.dx-datagrid-rowsview {
    border-top: 0px !important;
}
/* 
.nav-link.active {
  background-color: red !important;
} */

.largeTitle {
  font-size: 15px;
}

.smallTitle {
  font-size: 14px;
}

.shareInfoCenter {
  margin-top: 150px;
  width: 80%;
  margin-left: 100px;
}

.minimizeIcon {
  margin-top: 3px;
  float: right;
  cursor: pointer;
  width: 17px;
  margin-right: 6px;
}

.sharePanel {
  float: right;
  margin-right: 6px;
}

.shareIcon {

  margin-right: 6px;
  cursor: pointer;
  width: 23px;
  float: right;
  margin-top: 2px;

}

</style>

