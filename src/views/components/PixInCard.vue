<template>
  <Loader :visible="loader" />

  <div class="card h-100">
    <div class="p-3 pb-0 card-header">
      <div class="row">
        <div class="col-md-8 d-flex align-items-center">
          <h6 class="mb-4">Abstecer conta</h6>
        </div>

        <div v-if="qrcode" class="Loader-overlay" style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
          ">
          <qrcode-vue :value="qrcode" size="250" level="H" />
          <p class="mt-4 font-weight-bold" style="display: flex; justify-content: center; flex-direction: column; width: 100%; align-items:center
        ">
            <label>Copiar EMV</label>

            <i style='font-size: 25px' class="fa fa-copy" aria-hidden="true" @click="copyText"></i>
          </p>

          <div class="align-items-center">

            <h2 class="mb-4">R$ {{ this.formattedValue }}</h2>
          </div>
          <div class="align-items-center">
            <h5 class="mb-4">Identificador</h5>
          </div>
          <span class="mb-4">{{ this.identifier }}</span>
          <div class="LoaderPix"></div>
          <h5 class="mb-4">Aguardando Pagamento</h5>
        </div>
        <div v-if="!qrcode" class="Loader-overlay">
          <div class="bg-gradient-info border-radius-lg h-90">
            <img src="../../assets/img/shapes/waves-white.svg"
              class="position-absolute h-40 w-50 top-0 d-lg-block d-none" alt="waves" />
            <div class="position-relative d-flex align-items-center justify-content-center h-100">
              <img class="w-40 position-relative z-index-2 pt-4" src="../../assets/img/illustrations/rocket-white.png"
                alt="rocket" />
            </div>
          </div>

          <div class="col-md-4 text-end">
            <a href="javascript:;">
              <i class="text-sm fas fa-money text-secondary" data-bs-toggle="tooltip" data-bs-placement="top"
                title="Recharge Pix"></i>
            </a>
          </div>
          <form @submit.prevent="SendPixin" role="form" class="text-start">
            <label>Valor</label>
            <vsud-input type="number" placeholder="10.00" aria-label="Digite o valor" step="0.01" min="0"
              ref="amount" />
            <label>Descrição</label>
            <vsud-input type="text" placeholder="Descrição" aria-label="Descrição" ref="description" />

            <label>Nome</label>
            <vsud-input type="text" placeholder="Nome" aria-label="Nome" ref="name" />

            <label>Documento</label>
            <vsud-input type="text" placeholder="Documento" aria-label="Documento" ref="document" />

            <div class="text-center">
              <vsud-button class="my-4 mb-2" variant="gradient" color="info" full-width>
                Enviar</vsud-button>
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
import QrcodeVue from "qrcode.vue";
import { v4 as uuidv4 } from 'uuid';

export default {
  name: "PixInCard",
  components: {
    VsudInput,
    VsudButton,
    Loader,
    QrcodeVue,
  },
  data() {
    return {
      showMenu: false,
      formattedValue: "",
      rawValue: "",
      timeoutId: null,
      form: {
        amount: "",
        description: "",
      },
      loader: false,
      qrcode: "",
      identifier: null,
      intervalId: null,
    };
  },
  methods: {

    async copyText() {
      try {
        await navigator.clipboard.writeText(this.qrcode);
        this.showAlert("info", "Chave copiada com sucesso!", 6000, false);

      } catch (err) {
        this.message = "Ocorreu um erro ao copiar.: " + err;
      }
    },
    showAlert(color, message, timeout, dismissible) {
      this.$root.triggerAlert(color, message, timeout, dismissible);
    },

    hideAlert() {
      this.$root.triggerAlertHide();
    },
    async SendPixin() {
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

        const formData = {
          amount: this.formattedValue,
          description: this.$refs.description.$el.querySelector("input").value,
          name: this.$refs.name.$el.querySelector("input").value,
          document: this.$refs.document.$el.querySelector("input").value,

        };


        const data = {
          externalId: uuidv4(),
          amount: formData.amount,
          description: formData.description,
          identification: uuidv4(),
          document: formData.document,
          name: formData.name,
          expire: 3600

        };
        const response = await apibanks.post(
          `pix/create-immediate-qrcode`,
          data,
          headers
        );
        if (response.status === 200 || response.status === 201) {
          this.qrcode = response.data.data.key;
          this.identifier = response.data.data.identifier;
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
      } finally {
        this.loader = false;
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
          `pix/status-invoice?identifier=${indentify}`,
          headers
        );
        if (response.status === 200 || response.status === 201) {
          if (response.data.data.status === "DONE") {
            clearInterval(this.intervalId);
            this.showAlert("success", "Pagamento confirmado!", 10000, false);
            this.qrcode = null;
            this.$refs.amount.$el.querySelector("input").value = "";
            this.$refs.description.$el.querySelector("input").value = "";
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
