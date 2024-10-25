<template>
  <div v-if="alert.visible" class="alert text-white font-weight-bold"
    style="top:0; position:fixed; width:100%; z-index:100000" role="alert"
    :class="getClasses(alert.color, alert.dismissible)">
    <span class="alert-icon">
      <i :class="getIcon(icon)" />
    </span>
    <span class="alert-text">
      &nbsp;{{ alert.message }}
    </span>
    <button v-if="alert.dismissible" type="button" class="btn-close d-flex justify-content-center align-items-center"
      @click="hideAlert">
      <span aria-hidden="true" class="text-lg font-weight-bold">{{ text }}</span>
    </button>
  </div>
</template>

<script>
import ShowAlert from "../showAlert.js"

export default {
  name: "VsudAlert",
  mixins: [ShowAlert],
  props: {
    icon: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: "",
    },
  },
  methods: {
    getClasses(color, dismissible) {
      let colorValue = color ? `alert-${color}` : null;
      let dismissibleValue = dismissible ? "alert-dismissible fade show" : null;
      return `${colorValue} ${dismissibleValue}`;
    },
    getIcon(icon) {
      return icon ? icon : null;
    },
  },
};
</script>