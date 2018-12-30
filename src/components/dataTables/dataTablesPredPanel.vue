 <template>
  <dx-popup
    v-if="marker && variable"
    :visible="true"
    :position="popupPosition"
    :resize-enabled="true"
    :drag-enabled="true"
    :close-on-outside-click="false"
    :show-title="true"
    :width="popupWidth"
    :height="popupHeight"
    :shading="false"
    :title="titulo"
    class="popup"
    @hidden="cerrar"
    title-template="titleTemplate"
  >
    <div
      slot="titleTemplate"
      slot-scope="title"
      style="background: rgb(69, 99, 205); color: white"
      class="largeTitle"
    >
      {{titulo}}
      <span @click="cerrar" style="float:right; cursor:pointer">x</span>
      <img
        :src='require("@/assets/icons/shareIcon.png")'
        class="shareIcon"
        @click="openShareInfo"
        @mouseover="openShareInfo"
        @mouseout="closeShareInfo"
      >
       <img
        :src='require("@/assets/icons/imprimir.png")'
        class="shareIcon"
        @click="printTable"
      >
    </div>

    <img
      style="margin-left: 450px; margin-top: 160px;"
      :src="require('@/assets/gifs/loadingBars.gif')"
      v-show="loading"
      width="100"
    >

      <ShareInfoPanel
        @shareinfo-mouseover="openShareInfo"
        @shareinfo-mouseout="closeShareInfo"
        :routeData="routeData"
        :iFrameWidth="1040"
        :iFrameHeight="570"
        v-show="displayShareInfo"
        class=""
      />

    <div v-show="!displayShareInfo">
      <b-row>
        <b-col v-if="!loading" class="fadeIn">
          <img :src="defaultLogo" style="margin-left: 5px; margin-bottom: 15px">
        </b-col>
      </b-row>
      <b-row >
        <b-col v-if="!loading" class="fadeIn">
          <b-tabs v-if="marker && days.length > 0" v-model="tabIndex">
            <b-tab
              v-for="(dataSource, index) in days"
              :key="dataSource.id"
              :title="$t('{'+ dataSource.id +'}')"
              :title-link-class="linkClass(index)"
              :ref="'tableContainer' + index"
            >
            <div >
                 <dx-data-grid
                :data-source="dataSource.data"
                :allow-column-reordering="true"
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
        </b-col>
      </b-row>
    </div>
  </dx-popup>
</template>

<script>
import MapState from "@/state/map.state";
import MapUtils from "@/services/map.utils";
import ApiService from "@/services/api.service";
import { VariableType } from "@/common/enums";
import { DxPopup, DxToolbarItem } from "devextreme-vue/popup";
import { DxDataGrid, DxColumn, DxPager, DxPaging, DxGrouping, DxGroupPanel } from "devextreme-vue/data-grid";

import ShareInfoPanel from "@/components/shareInfoPanel.vue";

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
    DxGroupPanel
  },
  data() {
    return {
      defaultLogo: PC.default_map_logo,
      align: PC.options_panel_align,
      theme: PC.color_theme,
      mapState: MapState,
      titulo: '',
      displayShareInfo: false,
      columnsNames: {},
      days: [],
      tabIndex: 0,
      repeatedVarGroup: null
    };
  },
  props: {
    marker: { type: Object, default: null },
    variable: { type: String, default: null },
    minimized: { type: Boolean, default: true }
  },
  computed: {
    loading() {
      return this.days.length == 0;
    },
    popupWidth() {
      return 1050;
    },
    popupHeight() {
      return this.days.length > 0 ? ((this.days[0].data.length) * 28) + 178: 400;
    },
    popupPosition() {
      return this.minimized
        ? this.align == "left"
          ? "bottom"
          : "bottom"
        : "center";
    }
  },
  // TODO: comprobar si en el mount ya están todas las props y hacer el getTableData ahí
  watch: {
    marker: function() {
      if (this.marker != null) {
        this.titulo = this.$t('{tablePredTitle_' + this.variable + '}') + " " + MapUtils.getMarkerName(this.marker);
        if (this.variable) {
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
        }
      }
    },
    variable: function() {
      // if (this.marker != null && this.variable) {
      //   this.getTableData();
      // }
    }
  },
  created() {},
  mounted() {},
  methods: {
    getTableData() {
      this.days = [];
      var dt = this;
      ApiService.get(
        "predData/" + this.variable + "/" + this.marker.id + "?locale=" + this.$getLocale())
        .then(result => {
          if (result.data.length > 0) {
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            var lang = this.$getLocale() == 'es' ? 'es-ES' : 'en-US';
            var groupDays = result.data.map(d => new Date(d.fecha)
                            .toLocaleDateString(lang, options))
                            .filter(function (elem, index, self) { return index == self.indexOf(elem); });
            groupDays.forEach(day => {
              var dayData = { 
                id: day,
                data: this.formatData(result.data.filter(d => new Date(d.fecha).toLocaleDateString(lang, options) == day))
              }
              dt.days.push(dayData);
            })
          }
        });
    },
    formatData(data) {
      var result = [];
      data.forEach(fechaData => {
          fechaData.datos.forEach(paramData => {
            var reg = result.find(r => r.id == paramData.variableParametro + '-' + paramData.nombreParametro);
            if (!reg) {
              reg = { 
                id: paramData.variableParametro + '-' + paramData.nombreParametro, 
                variableParametro: paramData.variableParametro, 
                nombreParametro: paramData.nombreParametro 
              }
              result.push(reg);
            }
            var fecha = new Date(fechaData.fecha)
            var hora = fecha.toISOString().split('T')[1].substr(0,5)
            // var hora = fechaData.fecha.split(' ')[1].substr(0,5);
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
        }, 500)
    },

    printTable() {
      // Ponerle ref al logo y traerse el innerHtml, si lo piden
      // Se le puede quitar la primera columna para ajustarlo mejor
      var printContents = "<style type='text/css' media='print'>  @page { size: landscape; } .dx-datagrid-headers .dx-row .colHeader { background-color: #7fb7e7f5 !important; font-size: 10px; font-weight: bold; color: #f8f9fa; padding-left: 2px } </style>"
      printContents += "<div style='margin-left: 800px;margin-bottom: 20px;'>" + this.$refs['tableContainer' + this.tabIndex][0].title + "</div>"
      printContents += this.$refs['tableContainer' + this.tabIndex][0].$el.innerHTML; 
      var w = window.open();
      w.document.write(printContents);
      w.print();
    }
  }
};
</script>

<style>

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
  width: 19px;
  margin-right: 6px;
}
</style>