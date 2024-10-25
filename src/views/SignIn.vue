<template>
  <Loader :visible="loader" />

  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12"></div>
    </div>
  </div>
  <main class="mt-0 main-content main-content-bg">
    <section>
      <div class="page-header min-vh-75">
        <div class="container">
          <div class="row">
            <div class="mx-auto col-xl-4 col-lg-5 col-md-6 d-flex flex-column">
              <div class="mt-8 card card-plain">
                <div class="pb-0 card-header text-start">
                  <img :src="logo" width="300" alt="main_logo" />

                  <h3 class="font-weight-bolder text-info text-gradient">
                    Bem vindo
                  </h3>
                  <p class="mb-0">Entre com seu usuário e senha.</p>
                </div>
                <div class="card-body">
                  <form @submit.prevent="signIn" role="form" class="text-start">
                    <label>Usuário</label>
                    <vsud-input
                      type="text"
                      ref="username"
                      placeholder="Usuário"
                      name="user"
                    />
                    <label>Senha</label>
                    <vsud-input
                      type="password"
                      ref="password"
                      placeholder="Senha"
                      name="password"
                    />
                    <div class="text-center">
                      <vsud-button
                        class="my-4 mb-2"
                        variant="gradient"
                        color="info"
                        full-width
                        >Acessar</vsud-button
                      >
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div
                class="top-0 oblique position-absolute h-100 d-md-block d-none me-n8"
              >
                <div
                  class="bg-cover oblique-image position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6"
                  :style="{
                    backgroundImage: `url(${bgImg})`,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <app-footer />
</template>

<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";
import VsudInput from "@/components/VsudInput.vue";
import VsudSwitch from "@/components/VsudSwitch.vue";
import VsudButton from "@/components/VsudButton.vue";
import bgImg from "@/assets/img/curved-images/curved9.jpg";
import apibanks from "../core/infraestructure/http/api";
import logo from "@/assets/img/logo-ct.png";
import Loader from "./components/Loader.vue";

const body = document.getElementsByTagName("body")[0];

export default {
  name: "SigninPage",
  components: {
    Navbar,
    AppFooter,
    VsudInput,
    VsudSwitch,
    VsudButton,
    Loader,
  },
  data() {
    return {
      bgImg,
      form: {
        username: "",
        password: "",
      },
      logo,
      loader: false,
    };
  },
  methods: {
    showAlert(color, message, timeout, dismissible) {
      this.$root.triggerAlert(color, message, timeout, dismissible);
    },
    hideAlert() {
      this.$root.triggerAlertHide();
    },
    async signIn() {
      try {
        this.loader = true;
        const formData = {
          username: this.$refs.username.$el.querySelector("input").value,
          password: this.$refs.password.$el.querySelector("input").value,
        };

        if (formData.username === "") {
          this.showAlert(
            "success",
            `Campo "Usuário" não pode ser vazio.`,
            6000,
            false
          );
          return;
        }
        if (formData.password === "") {
          this.showAlert(
            "success",
            `Campo "Senha" não pode ser vazio.`,
            6000,
            false
          );
          return;
        }
        const data = {
          username: formData.username,
          password: formData.password,
        };
        const response = await apibanks.post(`auth/sign-in`, data);
        if (response.status === 200 || response.status === 201) {
          const expirationTime = new Date().getTime() + 60 * 60 * 1000;
          localStorage.setItem(
            "authentication",
            JSON.stringify({ data: response.data, expirationTime })
          );
          window.location.href = "#dashboard/";
        } else {
          this.loader = false;
        }
      } catch (e) {
        this.loader = false;

        console.log(e.response.data.message);
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
  beforeMount() {
    this.$store.state.hideConfigButton = true;
    this.$store.state.showNavbar = false;
    this.$store.state.showSidenav = false;
    this.$store.state.showFooter = false;
    body.classList.remove("bg-gray-100");
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    this.$store.state.showNavbar = true;
    this.$store.state.showSidenav = true;
    this.$store.state.showFooter = true;
    body.classList.add("bg-gray-100");
  },
};
</script>
