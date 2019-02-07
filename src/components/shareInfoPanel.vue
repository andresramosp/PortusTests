 <template>
  <div>

    <img :src="iconColor == 'black' ? require('@/assets/icons/shareIconBlack.png') : require('@/assets/icons/shareIcon.png')"
          :width="imgWidth"
          style="cursor: pointer"
          @click="openShareInfo"
          @mouseover="openShareInfo"
          @mouseout="closeShareInfo"
  
    >

    <div v-show="displayShareInfo" :style="'width:' + panelWidth" :class="position" @mouseover="openShareInfo" @mouseout="closeShareInfo" class="shareInfoPanel fadeIn">
       <label class="alertText" style="float: left: display: inline; margin-right:3px" for="urlLink">URL</label>
      <img :src='require("@/assets/icons/openLink.png")' width="11" class="shareImg" @click="openLink">
      <b-form-input id="specialContent" 
                  class="shareInput"
                  size="sm" 
                  :value="widgetUrl"
                  v-model="widgetUrl" 
                  type="text">
      </b-form-input>
      <br />
      <br />
      <label class="alertText" style="float: left; clear: left; display: inline; margin-right:6px">Widget:</label>
      <b-form-textarea id="specialContent" class="shareInput" :value="iFrameCode" placeholder="Enter something" :rows="4" :max-rows="6"></b-form-textarea>
    </div>
   
  </div>
</template>

<script>
export default {
  name: "ShareInfoPanel",
  components: {},
  data() {
    return {
      widgetUrl: '',
      displayShareInfo: false
    };
  },
  props: {
    routeData: { type: Object, default: null },
    iFrameWidth: { type: Number, default: 430 },
    iFrameHeight: { type: Number, default: 239 },
    iconColor: { type: String, default: 'black', required: false},
    position: { type: String },
    imgWidth: { type: Number },
    panelWidth: { type: String, default: '480px' },
    offsetX: { type: Number }
  },
  computed: {
    iFrameCode() {
      return (
        "<iframe width='" + this.iFrameWidth +  "' height='" + this.iFrameHeight +  "' src='" +
        this.widgetUrl +
        "' frameborder='0' />"
      );
    }
  },
  watch: {
    routeData: function() {
      if (this.routeData)
        this.widgetUrl = window.location.origin + '/' + this.routeData.href;
    }
  },
  created() {
    if (this.routeData)
      this.widgetUrl = window.location.origin + '/' + this.routeData.href;
  },
  mounted() {},
  methods: {
    openShareInfo() {
        if (this.timeOutShareInfoClose)
            clearInterval(this.timeOutShareInfoClose)
         this.timeOutShareInfoOpen = setTimeout(() => {
            this.displayShareInfo = true;
            this.$emit('opening');
        }, 500)
    },

    closeShareInfo() {
        if (this.timeOutShareInfoOpen)
            clearInterval(this.timeOutShareInfoOpen)
        this.timeOutShareInfoClose = setTimeout(() => {
            this.displayShareInfo = false;
            this.$emit('closing');
        }, 1000)
    },
    openLink() {
      window.open(this.routeData.href, "_blank");
    },
    cerrar() {}
  }
};
</script>

<style scoped>

.shareImg {
  cursor: pointer;
  margin-left: 4px;
  margin-right: 5px;
  margin-top: -6px;
 
}

.shareInput {
  width: 87%;
  display: inline;
  border-radius: 0px;
  border: 0px;
  font-size: 12px;
  
}

.shareInfoPanel {
    position: absolute;
    color: white;
    z-index: 5;
    padding: 10px;
    font-size: 11px;
    border-radius: 0px;
    height: 151px;
}

.bottomRight {
    margin-left: 10px;
    top: 35px;
}

.bottomLeft {
  margin-left: -450px;
  top: 35px;
}

.topRight {
  margin-left: 35px;
  bottom: 60px;
}

.topLeft {
  margin-left: -450px;
  bottom: 60px;
}

.bottomCenter {
  margin-left: -225px;
  top: 35px;
}

.topCenter {
  margin-left: -225px;
  bottom: 30px;
}

.shareIcon {
  cursor: pointer;

}

</style>