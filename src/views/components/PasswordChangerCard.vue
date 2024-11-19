<template>
  <Loader :visible="loader" />

  <div class="card h-100">
    <div class="p-3 pb-0 card-header">
      <div class="row">
        <div class="col-md-8 d-flex align-items-center">
          <h6 class="mb-4"></h6>
        </div>

        <div class="bg-gradient-info border-radius-lg h-90">
          <img src="../../assets/img/shapes/waves-white.svg" class="position-absolute h-40 w-50 top-0 d-lg-block d-none"
            alt="waves" />
          <div class="position-relative d-flex align-items-center justify-content-center h-100">
            <img class="w-40 position-relative z-index-2 pt-4" src="../../assets/img/illustrations/rocket-white.png"
              alt="rocket" />
          </div>
        </div>

        <div class="Loader-overlay">
          <div class="col-md-4 text-end">
            <a href="javascript:;">
              <i class="text-sm fas fa-money text-secondary" data-bs-toggle="tooltip" data-bs-placement="top"
                title="Recharge Pix"></i>
            </a>
          </div>
          <form @submit.prevent="changerPassword" role="form" class="text-start">
            <label>Digite a sua nova atual</label>
            <vsud-input type="text" placeholder="Digite sua Senha Atual" aria-label="Digite sua Senha Atual"
              v-model="this.actualkey" ref="actualkey" />

            <label>Digite a sua nova senha</label>
            <vsud-input type="text" placeholder="Digite sua Senha" aria-label="Digite sua Senha" v-model="this.key"
              ref="key" />
            <label>Confirme a sua nova senha</label>

            <vsud-input type="text" placeholder="Confirme sua Senha" aria-label="Confirme sua Senha" v-model="this.key"
              ref="confkey" />

            <div class="text-center">
              <vsud-button class="my-4 mb-2" variant="gradient" color="info" full-width>
                Enviar
              </vsud-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VsudInput from "@/components/VsudInput.vue";
import VsudButton from "@/components/VsudButton.vue";
import apibanks from "../../core/infraestructure/http/api";
import Loader from "./Loader.vue";
export default {
  name: "PasswordChangerCard",
  components: {
    VsudInput,
    VsudButton,
    Loader,
  },
  data() {
    return {
      form: {
        amount: "",
        description: "",
      },
      loader: false,
      key: "",
      confkey: "",
      actualkey: "",
    };
  },
  methods: {
    showAlert(color, message, timeout, dismissible) {
      this.$root.triggerAlert(color, message, timeout, dismissible);
    },

    hideAlert() {
      this.$root.triggerAlertHide();
    },

    async changerPassword() {
      this.loader = true;
      this.key = this.$refs.key.$el.querySelector("input").value;
      this.confkey = this.$refs.confkey.$el.querySelector("input").value;
      this.actualkey = this.$refs.actualkey.$el.querySelector("input").value;

      const authData = JSON.parse(localStorage.getItem("authentication"));
      this.dataUser = authData.data;
      const headers = {
        headers: {
          Authorization: `Bearer ${this.dataUser.access_token}`,
        },
      };
      if (this.key !== this.confkey) {
        this.showAlert("danger", `As senhas não coincidem.`, 6000, false);
        this.loader = false;

        return;
      }
      const data = {
        currentPassword: this.actualkey,
        newPassword: this.confkey,
      };
      try {
        const response = await apibanks.post(
          `auth/chanrger-pwd`,
          data,
          headers
        );
        if (response.status === 200 || response.status === 201) {
          this.showAlert("success", `Realizado com sucesso`, 6000, false);
        }
        throw new Error(response.data);
      } catch (e) {
        this.loader = false;
        this.showAlert(
          "danger",
          `${JSON.stringify(e.response.data.message)}`,
          6000,
          false
        );
      } finally {
        this.loader = false;
      }
    },

    async SendPixin() {
      const timestampInSeconds = Math.floor(Date.now() / 1000);

      this.loader = true;
      const authData = JSON.parse(localStorage.getItem("authentication"));
      this.dataUser = authData.data;

      const headers = {
        headers: {
          Authorization: `Bearer ${this.dataUser.access_token}`,
        },
      };

      try {
        await this.formatToDecimal(
          this.$refs.amount.$el.querySelector("input").value
        );

        if (this.formattedValue === "") {
          console.log(this.formattedValue);
          this.showAlert("success", `Digite um valor`, 6000, false);
          return;
        }

        const data = {
          externalId: timestampInSeconds,
          keyType:
            this.dataPix.keyType === "E-MAIL" ? "EMAIL" : this.dataPix.keyType,
          key: this.dataPix.dictKey,
          name: this.dataPix.name,
          amount: this.formattedValue,
        };
        const response = await apibanks.post(
          `pix/withdraw`,
          data,
          headers
        );
        if (response.status === 200 || response.status === 201) {
          this.identifier = response.data.transactionId;
          this.startPixStatusPolling(this.identifier);
        }
      } catch (e) {
        this.loader = false;
        this.showAlert(
          "danger",
          `${JSON.stringify(e.response.data.message)}`,
          6000,
          false
        );
      }
    },

    startPixStatusPolling(identifier) {
      this.intervalId = setInterval(async () => {
        await this.consultPix(identifier);
      }, 5000);
    },

    async consultPix(indentify) {
      const authData = JSON.parse(localStorage.getItem("authentication"));
      this.dataUser = authData.data;

      const headers = {
        headers: {
          Authorization: `Bearer ${this.dataUser.access_token}`,
        },
      };
      try {
        const response = await apibanks.get(
          `pix/status?transactionId=${indentify}`,
          headers
        );
        if (response.status === 200 || response.status === 201) {
          if (response.data.data.status === "COMPLETED") {
            clearInterval(this.intervalId);
            this.showAlert("success", "Pagamento confirmado!", 10000, false);
            this.loader = false;
          }
          if (response.data.data.status === "FAILED") {
            clearInterval(this.intervalId);
            this.showAlert("danger", "Ocorreu um erro!", 10000, false);
            this.loader = false;
          }

          if (response.data.data.status === "DROP") {
            clearInterval(this.intervalId);
            this.showAlert("danger", "Ocorreu um erro!", 10000, false);
            this.stageTwo(false);
            this.loader = false;
          }
        }
      } catch (e) {
        this.showAlert(
          "danger",
          `${JSON.stringify(e.response.data.message)}`,
          6000,
          false
        );
      }
    },

    async formatToDecimal(value) {
      value = value.replace(/[^0-9.,]/g, "");
      value = value.replace(",", ".");
      const parts = value.split(".");
      if (parts.length > 2) {
        value = `${parts[0]}.${parts[1]}`; // Limita a um único ponto
      }
      if (parts.length === 2) {
        value = `${parts[0]}.${parts[1].slice(0, 2)}`;
      }
      this.formattedValue = value;
    },
  },
};
</script>

<style scoped>
.LoaderPix-overlay {
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

.LoaderPix {
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
</style>
