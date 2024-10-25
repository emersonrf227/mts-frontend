<template>
  <Loader :visible="loader" />

  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-n1">
        <div class="overflow-hidden card card-body blur shadow-blur mt-n1 mb-5">
          <div class="gx-2">
            <div class="col-auto"></div>
            <div class="col-auto my-auto">
              <div class="h-100">
                <h5 class="mb-1">Bem vindo</h5>
                <p class="mb-0 text-sm font-weight-bold">{{ name }}</p>
              </div>
            </div>
          </div>
        </div>
        <card
          title="Saldo"
          :value="balance"
          icon-class="ni ni-money-coins"
          icon-background="bg-gradient-info"
          direction-reverse
        ></card>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-7 mb-lg-0 mb-4">
        <div class="card">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-lg-6">
                <div class="d-flex flex-column h-100">
                  <p class="mb-1 pt-2 text-bold">UpCapitalPay</p>
                  <h5 class="font-weight-bolder">Bem vindo ao UpCapitalPay</h5>
                  <p class="mb-5">
                    Simplificamos sua experiência bancária com inovação e
                    segurança. Conte conosco para alcançar seus objetivos
                    financeiros.
                  </p>
                </div>
              </div>
              <div class="col-lg-5 ms-auto text-center mt-5 mt-lg-0">
                <div class="bg-gradient-info border-radius-lg h-100">
                  <img
                    src="../assets/img/shapes/waves-white.svg"
                    class="position-absolute h-100 w-50 top-0 d-lg-block d-none"
                    alt="waves"
                  />
                  <div
                    class="position-relative d-flex align-items-center justify-content-center h-100"
                  >
                    <img
                      class="w-100 position-relative z-index-2 pt-4"
                      src="../assets/img/illustrations/rocket-white.png"
                      alt="rocket"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="card h-100 p-3">
          <div
            class="overflow-hidden position-relative border-radius-lg bg-cover h-100"
            style="
              background-image: url('https://demos.creative-tim.com/soft-ui-dashboard/assets/img/ivancik.jpg');
            "
          >
            <span class="mask bg-gradient-dark"></span>
            <div
              class="card-body position-relative z-index-1 d-flex flex-column h-100 p-3"
            >
              <h5 class="text-white font-weight-bolder mb-4 pt-2">
                Elaboramos uma api simples e objetiva.
              </h5>
              <p class="text-white">
                Deseja integrar seu sistema no UpCapitalPay consulte nossas
                documentações de api`s.
              </p>
              <a
                class="text-white text-sm font-weight-bold mb-0 icon-move-right mt-auto"
                href="https://api.acobank.com.br/api/v1/"
                target="_blank"
              >
                Saiba mais
                <i
                  class="fas fa-arrow-right text-sm ms-1"
                  aria-hidden="true"
                ></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-6 row">
      <div class="col-lg-12 mb-lg-0 mb-4">
        <div class="card">
          <div class="card-body p-3">
            <div class="row">
              <div class="col-lg-6">
                <div class="d-flex flex-column h-100">
                  <p class="mb-1 pt-2 text-bold">Conta Gráfica UpCapitalPay</p>
                  <h5 class="font-weight-bolder">Conta: {{ this.account }}</h5>
                  <h5 class="font-weight-bolder">
                    {{ this.accountStatus === "ACTIVE" ? "ATIVA" : "INATIVA" }}
                    <i
                      v-if="accountStatus === 'ACTIVE'"
                      class="fas fa-dot-circle"
                      style="color: green"
                    ></i>
                    <i v-else class="fas fa-dot-circle" style="color: red"></i>
                  </h5>

                  <div class="overflow-hidden card card-body blur shadow-blur">
                    <div class="row gx-4">
                      <div class="col-auto"></div>
                      <div class="col-auto my-auto">
                        <div class="h-100">
                          <h5 class="mb-1">Dados Cadastrais</h5>
                          <p class="mb-3 text-sm font-weight-bold">
                            Nome: {{ this.name }}
                          </p>
                          <p class="mb-3 text-sm font-weight-bold">
                            Documento: {{ this.document }}
                          </p>
                          <p class="mb-3 text-sm font-weight-bold">
                            Telefone: {{ this.phone }}
                          </p>
                          <p class="mb-3 text-sm font-weight-bold">
                            Email: {{ this.email }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-5 ms-auto text-center mt-5 mt-lg-0">
                <div class="bg-gradient-info border-radius-lg h-100">
                  <img
                    src="../assets/img/shapes/waves-white.svg"
                    class="position-absolute h-100 w-50 top-0 d-lg-block d-none"
                    alt="waves"
                  />
                  <div
                    class="position-relative d-flex align-items-center justify-content-center h-100"
                  >
                    <img
                      class="w-100 position-relative z-index-2 pt-4"
                      src="../assets/img/illustrations/rocket-white.png"
                      alt="rocket"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Card from "@/examples/Cards/Card.vue";
import ActiveUsersChart from "@/examples/Charts/ActiveUsersChart.vue";
import GradientLineChart from "@/examples/Charts/GradientLineChart.vue";
import OrdersCard from "./components/OrdersCard.vue";
import ProjectsCard from "./components/ProjectsCard.vue";
import Loader from "./components/Loader.vue";

import apibanks from "../core/infraestructure/http/api";

export default {
  name: "DashboardDefault",
  components: {
    Card,
    ActiveUsersChart,
    GradientLineChart,
    ProjectsCard,
    OrdersCard,
    Loader,
  },
  data() {
    return {
      balance: "R$: 0",
      dataUser: [],
      name: "",
      accountInfo: [],
      loader: null,
      account: null,
      document: null,
      phone: null,
      email: null,
      accountStatus: null,
    };
  },
  methods: {
    async getDashboard() {
      this.loader = true;
      const authData = JSON.parse(localStorage.getItem("authentication"));
      this.dataUser = authData.data;
      const headers = {
        headers: {
          Authorization: `Bearer ${this.dataUser.access_token}`,
        },
      };

      try {
        const response = await apibanks.get(`baas/account/balance`, headers);
        if (response.status === 200 || response.status === 201) {
          this.balance = `R$: ${response.data.balance}`;
          this.loader = false;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getInfo() {
      const authData = JSON.parse(localStorage.getItem("authentication"));

      this.dataUser = authData.data;
      this.name = authData.data.data.name;
      const headers = {
        headers: {
          Authorization: `Bearer ${this.dataUser.access_token}`,
        },
      };
      try {
        const response = await apibanks.get(`baas/account/info`, headers);
        if (response.status === 200 || response.status === 201) {
          localStorage.setItem(
            "accountData",
            JSON.stringify({ data: response.data })
          );
          const accountData = JSON.parse(localStorage.getItem("accountData"));
          this.accountInfo = accountData;
          console.log(this.accountInfo);
          this.document = this.accountInfo.data.document;
          this.phone = this.accountInfo.data.phone;
          this.email = this.accountInfo.data.email;
          this.document = this.accountInfo.data.document;
          this.account = this.accountInfo.data.Account.account;
          this.accountStatus = this.accountInfo.data.Account.status;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  beforeMount() {
    this.getDashboard();
    this.getInfo();
  },
};
</script>
