<template>
  <div class="container-fluid">
    <div class="mt-4 page-header min-height-300 border-radius-xl" :style="{
      backgroundImage: `url(${bgImg})`,

      backgroundPositionY: '50%',
    }">
      <span class="mask bg-gradient-success opacity-6"></span>
    </div>

    <div class="mx-4 overflow-hidden card card-body blur shadow-blur mt-n6">
      <div class="row gx-4">
        <div class="col-auto"></div>
        <div class="col-auto my-auto">
          <div class="h-100">
            <h5 class="mb-1">Comprovante</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="printArea" class="py-2 container-fluid">
    <div class="mt-3 row">
      <div class="mt-6 col-12 col-md-6 col-xl-6 mt-md-0">
        <div class="card h-100">
          <div class="p-3 pb-0 card-header">
            <div class="row">
              <span @click="printDiv"><i class="fa-solid fa fa-print"></i></span>

              <div class="col-md-8 d-flex align-items-center">
                <h6 class="mb-4">Comprovante de transação</h6>
              </div>

              <div class="Loader-overlay" style="
                  display: flex;
                  flex-direction: column;

                  padding: 20px;
                ">
                <div class="col-md-8 d-flex align-items-center">
                  <h3 class="mb-4">Transação:</h3>
                </div>
                <div class="align-items-center">
                  <h6 class="mb-4">
                    Tipo:
                    <vsud-badge :color="this.proof.type === 'CREDIT' ? 'success' : 'danger'
                      " variant="gradient" size="sm">{{
                        this.proof.type === "CREDIT" ? "CREDITO" : "DEBITO"
                      }}</vsud-badge>
                  </h6>
                </div>
                <div class="align-items-center">
                  <h6 class="mb-4">
                    Status:
                    <vsud-badge :color="this.proof.status === 'COMPLETED' ? 'success' : 'danger'
                      " variant="gradient" size="sm">{{
                        this.proof.status === "COMPLETED"
                          ? "COMPLETED"
                          : "ERROR"
                      }}</vsud-badge>
                  </h6>
                </div>

                <div class="align-items-center">
                  <h6 class="mb-4">Movimento: {{ this.proof.subType }}</h6>
                </div>
                <div class="align-items-center">
                  <h6 class="mb-4">
                    Valor: {{ formatPriceBr(Number(this.proof.amount)) }}
                  </h6>
                </div>

                <div class="align-items-center">
                  <h6 class="mb-4">Endtoend: {{ this.proof.endtoendId }}</h6>
                </div>

                <div class="col-md-8 d-flex align-items-center">
                  <h3 class="mb-4">Favorecido:</h3>
                </div>
                <div class="align-items-center">
                  <h6 class="mb-4">Nome: {{ this.proof.name }}</h6>
                </div>
                <div class="align-items-center">
                  <h6 class="mb-4">
                    Documento: {{ this.proof.documentNumber }}
                  </h6>
                </div>

                <div class="align-items-center">
                  <h6 class="mb-4">Banco: {{ this.proof.isbp }}</h6>
                </div>

                <div class="align-items-center">
                  <h5 class="mb-2">Data</h5>
                  <span class="mb-4">{{
                    formatDate(this.proof.createdAt)
                    }}</span>
                </div>
                <div class="align-items-center">
                  <h6 class="mb-4">
                    Identificador: {{ this.proof.uuid }}:{{
                      this.proof.endtoendId
                    }}:{{ this.id }}
                  </h6>
                </div>
                <div class="LoaderPix"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span @click="goBack">
      <i class="fa-solid fa fa-arrow-left"></i> Voltar</span>
  </div>
</template>

<script>
import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import bgImg from "@/assets/img/curved-images/curved14.jpg";
import apibanks from "../core/infraestructure/http/api";
import VsudBadge from "@/components/VsudBadge.vue";

export default {
  name: "ProfileOverview",
  components: {
    VsudBadge,
  },
  data() {
    return {
      showMenu: false,
      bgImg,
      id: null,
      proof: [],
    };
  },

  beforeMount() {
    this.id = this.$route.params.id;
    this.getTransaction();
  },
  mounted() {
    this.$store.state.isAbsolute = true;
    this.$store.state.isNavFixed = false;
    setNavPills();
    setTooltip();
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },
    printDiv() {
      const printContent = document.getElementById("printArea").innerHTML;
      const originalContent = document.body.innerHTML;

      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;

      // Recarrega o Vue para garantir que o conteúdo completo retorne ao estado original
      window.location.reload();
    },
    formatDate(param) {
      const date = new Date(param);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (Number(date.getMonth()) + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hour = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${day}/${month}/${year} - ${hour}:${minutes}`;
    },
    formatPriceBr(price) {
      if (price !== null) {
        return price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      } else {
        return "N/A";
      }
    },

    async getTransaction() {
      this.loader = true;
      const authData = JSON.parse(localStorage.getItem("authentication"));
      this.dataUser = authData.data;

      const headers = {
        headers: {
          Authorization: `Bearer ${this.dataUser.access_token}`,
        },
      };

      try {
        const response = await apibanks.get(
          `pix/status?transactionId=${this.id}`,
          headers
        );
        if (response.status === 200 || response.status === 201) {
          console.log(response.data);
          this.proof = response.data.data;
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
  },

  beforeUnmount() {
    this.$store.state.isAbsolute = false;
  },
};
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }

  #printArea,
  #printArea * {
    visibility: visible;
  }

  #printArea {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
