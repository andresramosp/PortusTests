<template>
<div  class="logosList" :class="{ 'leftAlign': align == 'right', 'rightAlign': align == 'left' }" >
  
  <!-- <img v-for="logo in logosList" :key="logo" :src="'/images/logos/' + logo" style="margin-left: 5px" /> -->
  <img v-for="logo in logosList" :key="logo" :src="logo" class="fadeIn" style="margin-left: 5px" />
  <!-- <img :src="'/images/logos/' + defaultLogo" style="margin-left: 5px" /> -->
  <img :src="defaultLogo" style="margin-left: 5px" />

</div>
</template>

<script>

export default {
  name: "LogosList",
  data() {
    return {
      align: PC.options_panel_align
    };
  },
  props: {
    logos: { type: Array, default: [], required: false },
    defaultLogo: { type: String, required: false }
  },
  computed: {
    logosList() {
      return this.logos.filter(l => l != this.defaultLogo).reverse();
    }
  },
  mounted() {},
  methods: {
  }
};
</script>

<style scoped>
.leftAlign {
  left: 4px;
}
.rightAlign {
  right: 4px;
}
.blueTheme {
  background-color: rgba(0, 123, 255, 0.6);
}
.grayTheme {
  background-color: #39434fbf;
}
.greenTheme {
  background-color: rgba(0, 255, 0, 0.6);
}

.logosList {
  position: absolute;
  z-index: 2;
  bottom: 20px;
}



</style>