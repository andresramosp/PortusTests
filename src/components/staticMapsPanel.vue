<template>
  <dx-popup
    v-if="mapResource"
    :visible="true"
    :position="'center'"
    :resize-enabled="false"
    :drag-enabled="true"
    :close-on-outside-click="false"
    :show-title="true"
    :width="780"
    :height="665"
    :shading="false"
    class="popup staticMapPanel"
    title-template="titleTemplate"
  >
    <div slot="titleTemplate" slot-scope="title" class="popupHeader">
      {{ $t('{mapasPrediccionTitulo}') }}
      <img
        :src="require('@/assets/icons/x.png')"
        class="closeIcon"
        @click="cerrar"
      >
    </div>

    <b-container style="height: 570px;" >
      <b-row>
        <b-col cols="2">
          <b-row style="font-size: 12px; margin-top: 0px">
            <b-col cols="12">
              <label style="margin-left: 10px" class="form-check-label">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="selectAllModel"
                  @change="selectAll(selectAllModel)"
                >
                {{$t('{mapasImprimirTodos}')}}
              </label>
              <div v-for="day in dayGroups" :key="day">
                <label
                  style="margin-left: -10px; margin-top: 5px; margin-bottom: 0px !important; "
                >{{day}}</label>
                <div
                  v-if="date.dayName == day"
                  v-for="date in datesAvailables"
                  :key="date.value"
                  class="form-check text-left"
                >
                  <label class="form-check-label">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="date.active"
                      @change="paintMaps()"
                    >
                    {{ date.name }}
                  </label>
                    <!-- <label  style="float: left; cursor: pointer" class="form-check-label">
                       {{ date.name }}
                      <img style="float: left; margin-right: 2px; " width="18" :src="date.active ? require('@/assets/icons/check_activo.png') : require('@/assets/icons/check_inactivo.png')" >
                      <input class="form-check-input" style="display: none" type="checkbox" v-model="date.active" @change="paintMaps()" />
                  </label> -->
                </div>
              </div>
            </b-col>
          </b-row>
        </b-col>
        <b-col>
          <b-row style="font-size: 12px">
            <b-form-select text-field="nombre" 
                           value-field="url" 
                           :options="domainsList" 
                           v-model="domainSelected" 
                           :placeholder="$t('{listaDominiosTexto}')"
                           style="margin-left: 0px; overflow-y: scroll; width: 330px; margin-bottom: 10px"
                           class="mb-3 form-control">
            </b-form-select>
          </b-row>
          <b-row>
            <b-container
              ref="mapsContainer"
              id="specialContent"
              style="overflow-y: scroll; height: 470px; padding: 15px;"
            >
              <div style="text-align: center; background: inherit">
                <img
                  width="550"
                  v-for="mapUrl in mapsUrlList"
                  :key="mapsUrlList.indexOf(mapUrl)"
                  :src="mapUrl"
                >
              </div>
            </b-container>
          </b-row>
        </b-col>
      </b-row>
    </b-container>

    <div class="footer" >
         <dx-button :text="$t('{botonBorrarMapas}')" class="footerButton" @click="clearMaps()" />
         <dx-button :text="$t('{botonImprimirMapas}')" class="footerButton" @click="printMaps()" />
     </div>

  </dx-popup>
</template>

<script>

import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";
import MapService from "@/services/map.service";
import { BASE_URL_PORTUS } from "@/common/config";
import { DxPopup } from "devextreme-vue/popup";
import DxButton from "devextreme-vue/button";

export default {
  name: "StaticMapsPanel",
  components: {
    DxPopup,
    DxButton
  },
  props: {
    mapResource: { type: Object, default: null, required: false }
  },
  data() {
    return {
      mapState: MapState,
      domainsList: [],
      domainSelected: null,
      datesAvailables: [],
      mapsUrlList: [],
      selectAllModel: false
    };
  },
  computed: {
    dayGroups() {
      var daysList = this.datesAvailables
        .map(m => {
          return m.dayName;
        })
        .filter(function(value, index, self) {
          return self.indexOf(value) === index;
        });
      return daysList;
    }
  },
  watch: {
    mapResource: function() {
      if (this.mapResource) {
        this.init();
      }
    },
    domainSelected: function() {
      this.paintMaps();
    }
  },
  methods: {
    init() {
      this.selectAllModel = false;
      this.mapsUrlList = [];
      this.domainSelected = null;
      var sm = this;
      ApiService.get(this.mapResource.mapsResourceApi, {
        locale: this.$getLocale()
      }).then(result => {
        sm.domainsList = result.data;
        sm.domainSelected = sm.domainsList[0].url;
      });
      this.datesAvailables = [];
      var hoursGap = 3;
      var hoursInterval = 72;
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var lastDay = new Date();
      lastDay.setHours(hoursInterval, 0, 0, 0);
      while (today <= lastDay) {
        var date = new Date(today);
        var opt = {
          dayName: date.toLocaleDateString(),
          name: ("0" + date.getHours()).slice(-2) + ":00",
          value: MapService.convertDateToYMDH(date),
          active: false
        };
        this.datesAvailables.push(opt);
        today.setHours(today.getHours() + hoursGap);
      }
    },

    paintMaps() {
      this.mapsUrlList = [];
      if (this.domainSelected) {
        var datesSelected = this.datesAvailables.filter(d => {
          return d.active;
        });
        for (var d in datesSelected) {
          this.mapsUrlList.push(
            BASE_URL_PORTUS +
              this.domainSelected +
              "/" +
              datesSelected[d].value +
              "/map.png"
          );
        }

        // var that = this;
        // setTimeout(() => {
        //   that.$refs.mapsContainer.scrollTop = (that.mapsUrlList.length * 470) - 100;
        // }, 500);
      }
    },

    printMaps() {
     
      var printContents = this.$refs['mapsContainer'].innerHTML;
      var w = window.open();
      w.document.write(printContents);
      w.print();
      //this.paintMaps();
      //w.close();

      // var WindowObject = window.open('', 'PrintWindow', 'width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');
      // WindowObject.document.writeln(this.$refs.mapsContainer.innerHTML);
      // WindowObject.document.close();
      // WindowObject.focus();
      // WindowObject.print();
      // WindowObject.close();
    },

    clearMaps() {
      this.datesAvailables.forEach(d => {
        d.active = false;
      });
      this.mapsUrlList = [];
      this.selectAllModel = false;
    },

    selectAll(value) {
      this.datesAvailables.forEach(d => {
        d.active = value;
      });
      this.paintMaps();
    },

    cerrar(evt) {
      MapState.staticMapResourceSelected = null;
    }
  }
};
</script>

<style scoped>



.footerButton {
  float: right;
  /* margin-bottom: 10px; */
  margin-left: 10px;
}

.footer {
  border-top: 1px solid #dee2e624;
  padding-right: 3px;
  padding-top: 11px;
  padding-bottom: 10px;
  /* margin-top: 10px; */
}

</style>