<template>
  <div
    id="sidenav-collapse-main"
    class="w-auto h-auto collapse navbar-collapse max-height-vh-100 h-100"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-collapse nav-text="Dashboard" :to="{ name: 'Dashboard' }">
          <template #icon>
            <icon name="dashboard" />
          </template>
        </sidenav-collapse>
      </li>

      <li class="mt-3 nav-item">
        <h6
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="$store.state.isRTL ? 'me-4' : 'ms-2'"
        >
          PIX
        </h6>
      </li>

      <li class="nav-item">
        <sidenav-collapse nav-text="Recarga" :to="{ name: 'recarga' }">
          <template #icon>
            <i
              class="fa-solid fa fa-money-bill"
              style="color: #333; font-size: 14px"
            ></i>
          </template>
        </sidenav-collapse>
      </li>

      <li class="nav-item">
        <sidenav-collapse nav-text="Saque" :to="{ name: 'withdrawal' }">
          <template #icon>
            <i
              class="fa-solid fa fa-money-bill"
              style="color: #333; font-size: 14px"
            ></i>
          </template>
        </sidenav-collapse>
      </li>

      <li class="mt-3 nav-item">
        <h6
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="$store.state.isRTL ? 'me-4' : 'ms-2'"
        >
          RELATÓRIOS
        </h6>
      </li>

      <li class="nav-item">
        <sidenav-collapse nav-text="Extrato" :to="{ name: 'extract' }">
          <template #icon>
            <i
              class="fa-solid fa fa-receipt"
              style="color: #333; font-size: 14px"
            ></i>
          </template>
        </sidenav-collapse>
      </li>

      <li class="mt-3 nav-item">
        <h6
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="$store.state.isRTL ? 'me-4' : 'ms-2'"
        >
          CONTA
        </h6>
      </li>

      <li class="nav-item">
        <sidenav-collapse
          nav-text="Alterar Senha"
          :to="{ name: 'changerPassword' }"
        >
          <template #icon>
            <i
              class="fa-solid fa fa-lock"
              style="color: #333; font-size: 14px"
            ></i>
          </template>
        </sidenav-collapse>
      </li>

      <li class="nav-item" @click="signOut()">
        <sidenav-collapse nav-text="Encerrar Sessão" to="/sign-in">
          <template #icon>
            <i
              class="fa-solid fa fa-sign-out-alt"
              style="color: #333; font-size: 14px"
            ></i>
          </template>
        </sidenav-collapse>
      </li>
    </ul>
  </div>
</template>
<script>
import Icon from "@/components/Icon.vue";
import SidenavCollapse from "./SidenavCollapse.vue";
import SidenavCard from "./SidenavCard.vue";

export default {
  name: "SidenavList",
  components: {
    Icon,
    SidenavCollapse,
    SidenavCard,
  },
  props: {
    cardBg: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      title: "Vite Soft UI Dashboard",
      controls: "dashboardsExamples",
      isActive: "active",
    };
  },
  methods: {
    getRoute() {
      const routeArr = this.$route.path.split("/");
      return routeArr[1];
    },
    showAlert(color, message, timeout, dismissible) {
      this.$root.triggerAlert(color, message, timeout, dismissible);
    },

    hideAlert() {
      this.$root.triggerAlertHide();
    },

    signOut() {
      localStorage.removeItem("authentication");
      this.showAlert("info", `Sessão encerrada com sucesso!`, 6000, false);
      window.location.href = "#/sign-in";
    },
  },
};
</script>
