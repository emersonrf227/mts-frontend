<template>
  <div class="container-fluid">
    <div
      class="mt-4 page-header min-height-300 border-radius-xl"
      :style="{
        backgroundImage: `url(${bgImg})`,

        backgroundPositionY: '50%',
      }"
    >
      <span class="mask bg-gradient-success opacity-6"></span>
    </div>

    <div class="mx-4 overflow-hidden card card-body blur shadow-blur mt-n6">
      <div class="row gx-4">
        <div class="col-auto"></div>
        <div class="col-auto my-auto">
          <div class="h-100">
            <h5 class="mb-1">Pagar com pix</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="py-2 container-fluid">
    <div class="mt-3 row">
      <div class="mt-6 col-12 col-md-6 col-xl-6 mt-md-0">
        <PixOutCard />
      </div>
    </div>
  </div>
</template>

<script>
import PixOutCard from "./components/PixOutCard.vue";
import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import bgImg from "@/assets/img/curved-images/curved14.jpg";

export default {
  name: "PixOut",
  components: {
    PixOutCard,
  },
  data() {
    return {
      showMenu: false,
      bgImg,
    };
  },

  mounted() {
    this.$store.state.isAbsolute = true;
    this.$store.state.isNavFixed = false;
    setNavPills();
    setTooltip();
  },
  beforeUnmount() {
    this.$store.state.isAbsolute = false;
  },
};
</script>
