 <template>

    <div id="tableRT" class="printable">

     <div class="allCenter">
      <img 
        :src="require('@/assets/gifs/loadingBars.gif')"
        v-show="loading"
        width="100"
      >
    </div>

    <b-row v-if="!loading">
      <b-col style="float: right">
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
              :src='require("@/assets/icons/imprimir.png")'
              class="shareIcon"
              @click="printTable"
              :title="$t('{printButton}')"
            >
      </b-col>
    </b-row>
    
    <b-row v-show="true">
      <span v-if="errorMsg" >{{errorMsg}}</span>
      <b-col v-if="!loading && !errorMsg" class="fadeIn">

          <b-tabs v-if="marker && dataSources.length > 0"  v-model="tabIndex" class='infoPanelClass' >

              <b-tab 
                v-for="(dataSource, index) in dataSources" 
                :key="dataSource.id" 
                :title="$t('{'+ dataSource.id +'}')"
                :ref="'tableContainer' + index">

                <dx-data-grid
                  :data-source="dataSource.data"
                  :allow-column-reordering="true"
                  :row-alternation-enabled="true"
                  :show-borders="true"
                  :customize-columns="customizeColumns"
                  @initialized="initialized"
                  @cellPrepared="renderCell"
                >

                    <dx-paging :page-size="pageSize"/>
                    <dx-pager
                      :show-page-size-selector="true"
                      :allowed-page-sizes="[8, 15, 30, 100, 500]"
                      :show-info="true"
                      :show-navigation-buttons="true"
                    />

                </dx-data-grid>

              </b-tab>

          </b-tabs>
      </b-col>
    </b-row>

    </div>
   
</template>

<script>
import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";
import { DxPopup, DxToolbarItem } from "devextreme-vue/popup";
import { DxDataGrid, DxColumn, DxPager, DxPaging } from "devextreme-vue/data-grid";
import ShareInfoPanel from "@/components/shareInfoPanel.vue";

export default {
  name: "DataTablesRTPanel",
  components: {
    DxPopup,
    DxToolbarItem,
    DxDataGrid,
    DxColumn,
    DxPager,
    DxPaging,
    ShareInfoPanel
  },
  data() {
    return {
      defaultLogo: PC.default_map_logo,
      align: PC.options_panel_align,
      mapState: MapState,
      titulo: '',
      showingShareInfo: false,
      minimized: true,
      columnsNames: {},
      dataSources: [],
      tabIndex: 0,
      width: 1000,
      height: 360,
      errorMsg: null
    };
  },
  props: {
    marker: { type: Object, default: null },
    parameters: { type: Array, default: [] },
    isWidget: { type: Boolean, default: false },
    preselectedTabIndex: { type: Number, default: 0 },
    pageSize: { type: Number, default: 8 }
  },
  computed: {

    loading() {
      return (!this.paramsGroups || this.dataSources.length != this.paramsGroups.length) && !this.errorMsg;
    },
    popupWidth() {
      return this.width;
    },
    popupHeight() {
      return this.height;
    },
    popupPosition() {
      return this.minimized
        ? this.align == "left"
          ? "bottom"
          : "bottom"
        : "center";
    }
  },
  watch: {
    parameters: function() {
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
      this.dataSources = [];
      if (this.marker != null && this.parameters.length > 0) {
          this.paramsGroups = this.parameters.map(p => p.variable).filter(function (elem, index, self) { return index == self.indexOf(elem); });
          this.paramsGroups.forEach(pGrp => {
            this.getTableData(this.parameters.filter(p => p.variable == pGrp), pGrp);
          });
          this.titulo = this.marker.nombre;
          if (this.marker.radar) {
            this.titulo += ". " + "Posición del punto: " +  " Lat " + parseFloat(this.marker.lat).toFixed(2) + " N" + ": Lon " + parseFloat(this.marker.lon).toFixed(2) + " O";
          }
      }

      this.routeData = this.getRouteData();

    },
    async getTableData(parametrosDataSource, dataSourceId) {
      var dt = this;

      if (!this.marker.radar) {
        var url = "RTData/station/" + this.marker.id + "?locale=" + this.$getLocale();
        var params = parametrosDataSource.map(p => p.id);
      }
      else {
        var url = "RTData/radar/" + this.marker.id + "?locale=" + this.$getLocale();
        var params = [this.marker.latId, this.marker.lonId];
      }
      
      try {
        var result = await ApiService.post(url, params)
        if (result.data.length > 0) {
            var dataSource = { 
              id: dataSourceId,
              data: result.data.map((row) => this.formatRow(row) )
            };
          dt.dataSources.push(dataSource);
          Object.assign(this.columnsNames, this.generateColumnsNames(result.data[0]));
          this.$emit('loaded');
        }
        else {
          this.errorMsg = "Error. No hay datos que mostrar.";
        }

      }
      catch(error) {
        this.errorMsg = error.message;
      }
      
    },
    generateColumnsNames(row) {
      var result = {};
      row.datos.forEach(dato => {
        result[dato.nombreColumna] = dato.nombreParametro + " (" + dato.unidad + ")";;
      });
      return result;
    },
    customizeColumns(columns) {
      columns.forEach(col => {
        col.caption = this.columnsNames[col.dataField];
        col.cssClass = "colHeader";
        if (col.dataField == 'Fecha (GMT)') {
          col.width = 160;
        }
        // else {
        //    col.width = this.columnWidth;
        // }
        if (col.dataField == "QCs")
          col.visible = false;
      });
      return columns;
    },
    formatRow(row) {
      // var formattedRow = { 'Fecha (GMT)': new Date(row.fecha).toISOString().slice(0, 19).replace("T", " "),  };
      var formattedRow = { 'Fecha (GMT)': row.fecha.slice(0, 19),  };
      formattedRow.QCs = [];
      row.datos.forEach(dato => {
        formattedRow[dato.nombreColumna] = this.formatParamValue(dato);
        if (dato.paramQC)
          formattedRow.QCs.push(dato.nombreColumna);
      });
      return formattedRow;
    },
    formatParamValue: function(lastDataResult) {
      var value = parseFloat(lastDataResult.valor) / lastDataResult.factor;
      return value.toFixed(3);
    },
    initialized(dataGrid) {
      //dataGrid.component.columnOption('QCs', 'cssClass', 'colHeader');
    },
    renderCell(ev) {
      if (ev.rowType == "data" && ev.data.QCs.indexOf(ev.column.dataField) != -1) {
        ev.cellElement.style.color = 'red';
      }
      if (ev.column.caption.indexOf("Fecha") != -1) {
        ev.cellElement.style.textAlign = "center";
      }
      else {
        ev.cellElement.style.textAlign = "center";
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
    getRouteData() {  
      return this.$router.resolve({
        path: "/dataTablesRTWidget",
        query: {
          locale: this.$getLocale(),
          stationCode: this.marker.id,
          variables: this.paramsGroups.join(),
          isRadar: this.marker.radar,
          latId: this.marker.latId ? this.marker.latId : '',
          lonId: this.marker.lonId ? this.marker.lonId : ''
        }
      });
    },
    cerrar() {
      this.dataSources = [];
      MapState.setRTDataTable(null, []);
    },
   
  }
};
</script>




<style>

#tableRT .nav-link.active {
  background-color: rgba(127, 183, 231, 0.96) !important;
  color: white !important;
  border: 1px solid white;
}

#tableRT .nav-link {
  background-color: #e8e8e8 !important;
  color: black !important;
  border: 1px solid white;
}

#tableRT .nav-link:hover:not(.active) {
   background-color: lightgray !important;
}

#tableRT .dx-datagrid-headers .dx-row .colHeader {
  background-color: rgba(127, 183, 231, 0.96) !important;
  font-size: 13px;
  color: white;
  padding-left: 2px;
  text-align: center !important;
}

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

