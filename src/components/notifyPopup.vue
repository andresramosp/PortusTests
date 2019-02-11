<template>
  <div class="notifyPopup">
      <b-card v-for="(message) in messages" :key="message.id" 
              header-tag="header" 
              style="position: relative; margin-top: 15px"
              class="fadeInSlow" 
              :class="[align == 'left' ? 'leftAlign' : 'rightAlign']">
        <div slot="header" class="mb-0" >
          {{message.title ? message.title : 'Aviso'}}
          <img :src='require("@/assets/icons/x.png")' class="closeIconSm"  @click="cerrar(message)">
        </div>
        <b-container style="max-width: 380px">
          <div class="" style="padding: 10px; font-size: 13px">
              {{ message.message }}
          </div>
        </b-container>
    </b-card>
  </div>

</template>
<script>

import MapState from "@/state/map.state";

export default {
  name: "NotifyPopup",
  data() {
    return {
      align: PC.options_panel_align,
    };
  },
  props: {
    messages: { type: Array, default: null }
  },
  watch: {
    messages: function() {
      this.messages.forEach(msg => {
        if (!msg.timeout && msg.duration != 0) {
          msg.timeout = setTimeout(() => {
            this.cerrar(msg);
          }, msg.duration ? msg.duration : 15000);
        }
      });
    }
  },
  methods: {
    cerrar(message) {
      MapState.removeNotifyMessage(message.id);
    }
  }
};
</script>

<style scoped>

.notifyPopup {
  font-size: 12px;
  position: absolute;
  z-index: 15;
  top: 130px;
}

.leftAlign {
  right: 80px;
}

.rightAlign {
  left: 40px;
}

.card {
  background-color: transparent;
  border: none;
}

.card-body {
  padding: 0px;
}

.leaflet-popup-content-wrapper {
  padding: 0px;
}

.container {
    padding-bottom: 15px;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 5px;
  }

</style>
