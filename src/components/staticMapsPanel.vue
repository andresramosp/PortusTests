<template>
    <b-modal v-model="modalShow" v-if="mapResource" @hidden="onHidden" class="staticmaps-modal" size="lg" :title="$t('{mapasPrediccionTitulo}')">
       <!-- <div class="custom-modal-header" slot="modal-header">{{$t('{mapasPrediccionTitulo}')}}</div> -->
       <b-container style="height: 570px; ">
            <b-row>
                <b-col cols="2">
                     <b-row style="font-size: 12px; margin-top: 0px">
                       <b-col v-for="day in dayGroups" :key="day" cols="12"  >
                          <label style="margin-left: -10px; margin-top: 5px; margin-bottom: 0px !important; font-weight: bold">{{day}}</label>
                          <div v-if="date.dayName == day" v-for="date in datesAvailables" :key="date.value" class="form-check text-left">
                              <label class="form-check-label">
                                <input class="form-check-input" type="checkbox" v-model="date.active" @change="paintMaps()" />
                                {{ date.name }}
                              </label>
                          </div>
                       </b-col>
                    </b-row>
                </b-col>
                <b-col>
                  <b-row style="font-size: 12px">
                      <select style="margin-left: 0px; overflow-y: scroll" v-model="domainSelected">
                          <option :value="null" disabled="disabled">-{{$t('{listaDominiosTexto}')}}-</option>
                          <option v-for="domain in domainsList" :key="domain.url" :value="domain.url" >{{domain.nombre}}</option>
                      </select>
                  </b-row>
                   <b-row>
                      <b-container ref="mapsContainer" style="overflow-y: scroll; height: 470px; margin-top: 20px">
                        <img v-for="mapUrl in mapsUrlList" :key="mapsUrlList.indexOf(mapUrl)" :src="mapUrl" />
                      </b-container>
                   </b-row>
                </b-col>
            </b-row>
        </b-container>
    </b-modal>
</template>

<script>

import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";
import MapUtils from "@/services/map.utils";
import { BASE_URL_PORTUS } from '@/common/config';

export default {
  name: "StaticMapsPanel",
  props: {
    mapResource: { type: Object, default: null, required: false }
  },
  data() {
    return {
      mapState: MapState,
      modalShow: false,
      domainsList: [],
      domainSelected: null,
      datesAvailables: [],
      mapsUrlList: []
    };
  },
  computed: {
    dayGroups() {
      var daysList = this.datesAvailables
        .map(m => {
          return m.dayName;
        })
        .filter(function (value, index, self) {
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
      this.modalShow = true;
      this.mapsUrlList = [];
      this.domainSelected = null;
      var sm = this;
      ApiService.get(this.mapResource.mapsResourceApi, { locale: this.$getLocale() })
      .then((result) => {
        sm.domainsList = result.data;
      });

      this.datesAvailables = [];
      var hoursGap = 3;
      var hoursInterval = 72;
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var lastDay = new Date();
      lastDay.setHours(hoursInterval, 0, 0, 0);
      while(today <= lastDay) {
        var date = new Date(today);
        var opt = { dayName: date.toLocaleDateString(), name: ("0" + date.getHours()).slice(-2) + ":00", value: MapUtils.convertDateToYMDH(date), active: false};
        this.datesAvailables.push(opt);
        today.setHours(today.getHours() + hoursGap)
      }
    
    },

    paintMaps() {
      this.mapsUrlList = [];
      if (this.domainSelected) {
        var datesSelected = this.datesAvailables.filter(d => { return d.active });
        for (var d in datesSelected) {
          this.mapsUrlList.push(BASE_URL_PORTUS + this.domainSelected + "/" + datesSelected[d].value + "/map.png");
        }

        // var that = this;
        // setTimeout(() => {
        //   that.$refs.mapsContainer.scrollTop = (that.mapsUrlList.length * 470) - 100;
        // }, 500);
        
      }

    },

    onHidden (evt) {
       MapState.staticMapResourceSelected = null;
    }
  }
};
</script>

<style scoped>

div.modal.staticmaps-modal .modal-dialog {
  max-width: 900px !important;
  width: 900px !important;
}

.custom-modal-header {
  background-color: #e9ecef;
}

</style>