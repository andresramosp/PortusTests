
 <template>
  <div style="min-height: 200px">
    <div class="allCenter">
      <img 
        style="margin-top: 80px"
        :src="require('@/assets/gifs/loadingBars.gif')"
        v-show="loading"
        width="100"
      >
    </div>
    

      <ShareInfoPanel
        v-if="routeData"
        @shareinfo-mouseover="openShareInfo"
        @shareinfo-mouseout="closeShareInfo"
        :routeData="routeData"
        :iFrameWidth="1040"
        :iFrameHeight="570"
        v-show="displayShareInfo"
        class=""
      />

    <div v-show="!displayShareInfo">
      <b-row v-if="!loading">
        <b-col  class="fadeIn" cols="2">
          <img :src="defaultLogo" style="margin-left: 5px; margin-bottom: 15px">
        </b-col>
        <b-col style="font-weight: bold" cols="8">
          {{titulo}}
         </b-col>
         <b-col cols="2">
            <img
              :src='require("@/assets/icons/shareIconBlack.png")'
              class="shareIcon"
              @click="openShareInfo"
              @mouseover="openShareInfo"
              @mouseout="closeShareInfo"
            >
             <img
              :src='require("@/assets/icons/pdfReport.png")'
              class="shareIcon"
              v-if="hasReport()"
              @click="openReport"
            >
            <img
              :src='require("@/assets/icons/imprimir.png")'
              class="shareIcon"
              @click="printTable"
            >
        </b-col>
      </b-row>
      <b-row >
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
import MapUtils from "@/services/map.utils";
import ApiService from "@/services/api.service";
import { VariableType, UbicacionType, MarkerClass } from "@/common/enums";
import { DxPopup, DxToolbarItem } from "devextreme-vue/popup";
import { DxDataGrid, DxColumn, DxPager, DxPaging, DxGrouping, DxGroupPanel } from "devextreme-vue/data-grid";
import ShareInfoPanel from "@/components/shareInfoPanel.vue";
import NivmarPleaBajaPredPanel from "@/components/dataTables/nivmarPleaBajaPredPanel.vue";
import { INFORMES_URL, BASE_URL_PORTUS_REPORTS } from '@/common/config';

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
      mapUtils: MapUtils,
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
      routeData: null
    };
  },
  props: {
    marker: { type: Object, default: null },
    variable: { type: String, default: null }
  },
  computed: {
    loading() {
      return this.days.length == 0;
    },
    titulo() {
      if (this.variable == VariableType.SEA_LEVEL) {
          return this.$t('{tablePredTitle_' + this.variable + '}') 
          + " " + MapUtils.getMarkerName(this.marker)
          + ' (Ref: ' +  (this.nivelMarRef == 0 ? this.$t('{nivelMedio}') : this.$t('{ceroRedmar}')) + ')'
      }
      else {
        return this.$t('{tablePredTitle_' + this.variable + '}') + " " + MapUtils.getMarkerName(this.marker);
      }
        
    }
  },
  watch: {
    marker: function () {
      if (this.marker && this.variable)
        this.init();
    }
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      if (this.marker != null) {
        //this.titulo = this.$t('{tablePredTitle_' + this.variable + '}') + " " + MapUtils.getMarkerName(this.marker);
        if (this.variable) {
           this.tabIndex = 0;
           this.days = [];
           this.getTableData();

           this.routeData = this.$router.resolve({
            path: "/dataTablesPredWidget",
            query: {
              locale: this.$getLocale(),
              locationCode: this.marker.id,
              latitud: this.marker.latitud,
              longitud: this.marker.longitud,
              variable: this.variable
            }
          });

          if (this.marker.mareaAstronomica) {
            this.mareaAstronomicaUrl = INFORMES_URL + "Mareas/Principal1.php?Estacion=" + this.marker.mareaAstronomica.id + "&Lenguaje=es"
          }
          else {
            this.mareaAstronomicaUrl = null;
          }

        }
      }
    },
    async getTableData() {
      var result = await ApiService.get("predData/" + this.variable + "/" + this.marker.id + "?locale=" + this.$getLocale());
      if (result.data.length > 0) {
          var groupDays = result.data.map(d => new Date(d.fecha)
              .toISOString().split('T')[0])
              .filter(function (elem, index, self) { return index == self.indexOf(elem); });
          groupDays.forEach(day => {
            var dayData = { 
              _date: day,
              id: new Date(day).toLocaleDateString(this.$getLocale() == 'es' ? 'es-ES' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
              data: this.formatData(result.data.filter(d => new Date(d.fecha).toISOString().split('T')[0] == day))
            }
            if (Object.keys(dayData.data[0]).length > this.minDataDay)
              this.days.push(dayData);
          })
          if (this.variable == VariableType.SEA_LEVEL)
            this.nivelMarRef = result.data[0].nivelRef;
      }
    },
    formatData(data) {
      var result = [];
      data.forEach(fechaData => {
          fechaData.datos.forEach(paramData => {
            var reg = result.find(r => r.id == paramData.variableParametro + '-' + paramData.nombreParametro);
            if (!reg) {
              reg = { 
                id: paramData.variableParametro + '-' + paramData.nombreParametro, 
                variableParametro: paramData.variableParametro ? paramData.variableParametro.toUpperCase() : null, 
                nombreParametro: paramData.nombreParametro 
              }
              result.push(reg);
            }
            var fecha = new Date(fechaData.fecha)
            var hora = fecha.toISOString().split('T')[1].substr(0,5)
            var decimals = paramData.valor < 999 ? (this.variable == VariableType.SEA_LEVEL ? 2 : 1) : 0;
            reg[hora] = paramData.valor ? parseFloat(paramData.valor).toFixed(decimals) : null; 
          })
        }
      )
      return result;
    },
    customizeColumns(columns) {
      columns.forEach(col => {
        col.cssClass = "colHeader";
        if (col.dataField == 'nombreParametro') {
          col.caption = " ";
          col.width = this.variable == VariableType.SEA_LEVEL ? 80 : 60;
          col.visibleIndex = 1;
        }
        else if (col.dataField == "variableParametro") {
          col.caption = " ";
          col.width = this.variable == VariableType.SEA_LEVEL ? 0 : 100;
          col.visibleIndex = 0;
        }
       else if (col.dataField == "id") {
          col.visible = false;
        }
        else {
           col.width = this.variable == VariableType.SEA_LEVEL ? 45 : 34;
        }
      });
      return columns;
    },
    renderCell(ev) {
      if (ev.column.dataField == "variableParametro") {
        ev.cellElement.style.background = "#7fb7e7f5";
        ev.cellElement.style.color = "white";
        ev.cellElement.style.fontWeight = 'bold';
        if (this.repeatedVarGroup && ev.value == this.repeatedVarGroup.value) {
          //ev.cellElement.remove();
          ev.cellElement.innerHTML = "";
          //this.repeatedVarGroup.cellElement.rowSpan = "2";
        }
        this.repeatedVarGroup = ev;
      }
      else if (ev.column.dataField == "nombreParametro") {
        ev.cellElement.style.background = "#D5D5D5";
      }
      else if (ev.rowType == "data") { // dato
        ev.cellElement.style.textAlign = "center";
        if (ev.data.nombreParametro == "Dir") {
          ev.cellElement.innerHTML = ev.value ? this.getDirArrow(parseFloat(ev.value), 0.321) : '';
        }
      }
    },
    getDirArrow(dir, speed) {
      return "<svg version='1.1' baseProfile='full' xmlns='http://www.w3.org/2000/svg' width='15' height='15' style='margin:0px; padding:0px'>"
      + "<path transform='scale(0.15,0.15) rotate(" + dir + " 50 50)' stroke-width='3' stroke='#000000' fill='#3FC0FF' d='m75,50 l-25,-45 l-25,45  l13,0 l0,45 l25,0 l0,-45 l13,0z'></path></svg>"
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
    toggleShareInfo() {
      this.displayShareInfo = !this.displayShareInfo;
    },

    openShareInfo() {
        if (this.timeOutShareInfoClose)
            clearInterval(this.timeOutShareInfoClose)
         this.timeOutShareInfoOpen = setTimeout(() => {
            this.displayShareInfo = true;
        }, 500)
    },

    closeShareInfo() {
        if (this.timeOutShareInfoOpen)
            clearInterval(this.timeOutShareInfoOpen)
        this.timeOutShareInfoClose = setTimeout(() => {
            this.displayShareInfo = false;
        }, 1000)
    },

    printTable() {
      // Ponerle ref al logo y traerse el innerHtml, si lo piden
      // Se le puede quitar la primera columna para ajustarlo mejor
      // var printContents = "<style type='text/css' media='print'>  @page { size: landscape; } .dx-datagrid-headers .dx-row .colHeader { background-color: #7fb7e7f5 !important; font-size: 10px; font-weight: bold; color: #f8f9fa; padding-left: 2px } </style>"
      // printContents += "<div style='margin-left: 800px;margin-bottom: 20px;'>" + this.$refs['tableContainer' + this.tabIndex][0].title + "</div>"
      // // if (this.$refs.pleaBajaContainer)
      // //   printContents += this.$refs.pleaBajaContainer.$el.innerHTML;
      // printContents += this.$refs['tableContainer' + this.tabIndex][0].$el.innerHTML; 
      // var w = window.open();
      // w.document.write(printContents);
      // w.print();

      // TODO: abrir como widget y pasarle parametro para que imprima directamente
      window.print();
    },

    hasReport() {
      return (this.marker && this.marker.mapOption) &&
          (this.marker.mapOption.variableType == VariableType.WAVE
          || this.marker.mapOption.variableType == VariableType.SEA_LEVEL)
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

<style >
/* 
.list-container .nav-tabs {
    border-bottom: 0px;
} */

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

.bg-selectedTab {
    background-color: #7fb7e7f5 !important;
}

.dx-datagrid-headers .dx-row .colHeader {
    background-color: #7fb7e7f5 !important;
    font-size: 10px;
    font-weight: bold;
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

.shareIcon {
  margin-top: 2px;
  float: right;
  cursor: pointer;
  width: 23px;
  margin-right: 6px;
}
</style>

