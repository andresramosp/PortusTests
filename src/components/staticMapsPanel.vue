<template>
    <b-modal v-model="modalShow" v-if="mapResource" @hidden="onHidden" size="lg" :title="$t('{mapasPrediccionTitulo}')">
       <b-container style="height: 500px; overflow-y: scroll">
            <b-row>
                <b-col cols="2">
                    
                </b-col>
                <b-col>
                   <label>{{$t('{listaDominiosTexto}')}}</label>
                    <select style="margin-left: 5px; font-size: 13px; overflow-y: scroll" v-model="domainSelected">
                      <option v-for="domain in domainsList" :key="domain.url" style="font-size: 13px" :value="domain.url" >{{domain.nombre}}</option>
                    </select>
                  <b-row>
                    <img v-for="mapUrl in mapsUrlList" :key="mapsUrlList.indexOf(mapUrl)" :src="mapUrl" />
                  </b-row>
                </b-col>
            </b-row>
        </b-container>
    </b-modal>
</template>

<script>

import MapState from "@/state/map.state";
import ApiService from "@/services/api.service";
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
      mapsUrlList: []
    };
  },
  watch: {
    mapResource: function() {
      if (this.mapResource) {
        this.init();
      }
    },
    domainSelected: function() {
      if (this.domainSelected != null) {
        this.mapsUrlList.push(BASE_URL_PORTUS + this.domainSelected + "/2018112006/map.png")
      }
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
    },
    onHidden (evt) {
       MapState.staticMapResourceSelected = null;
    }
  }
};
</script>