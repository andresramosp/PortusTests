<template>
<div  class="logosList rightAlign" >
  
  <img v-for="logo in logosList" :key="logo" :src="logo" class="fadeIn" style="margin-left: 5px" />
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
      return this.logos.filter(l => l.indexOf('logoPuertos') == -1).reverse();
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


.logosList {
  position: absolute;
  z-index: 2;
  bottom: 5px;
}



</style>