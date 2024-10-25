<!-- Loader.vue -->
<template>
  <div v-if="visible" class="Loader-overlay">
    <div class="Loader"></div>
  </div>
</template>

<script>
export default {
  name: "Loader",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    openLoader() {
      this.$emit("open");
    },
    // Função para fechar o Loader
    closeLoader() {
      this.$emit("close");
    },
    onLanguageChange() {
      // Chame a função para abrir o Loader
      this.openLoader();
    },
  },
};
</script>

<style scoped>
.Loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;
}

.Loader {
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.close {
  background: none;
  border: none;
  font-size: 1.5rem;
}
</style>
