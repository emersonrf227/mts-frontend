<template>
  <Loader :visible="loader" />
  <div class="py-4 container-fluid">
    <div class="col-12">
      <form @submit.prevent="getExtract" role="form" class="text-start">
        <div class="col-12">
          <div class="row">
            <div class="col-6">
              <span>De</span>
              <vsud-input
                type="date"
                ref="datei"
                placeholder="Usuário"
                name="user"
              />
            </div>
            <div class="col-6">
              <span>Até</span>
              <vsud-input
                type="date"
                ref="datef"
                placeholder="Usuário"
                name="user"
              />
            </div>
            <div class="col-12">
              <vsud-button class="my-4 mb-2" variant="gradient" color="info">
                <i class="fas fa-filter"></i> Filtrar</vsud-button
              >
            </div>
          </div>
        </div>
      </form>
      <div class="row">
        <ExtractTables :extract-list="extract" />
        <div class="flex justify-between my-3 w-full">
          <span
            @click="backPage()"
            :disabled="page === 1"
            class="px-2 py-1"
            style="font-size: 40px"
          >
            <i class="fas fa-arrow-circle-left"></i>
          </span>
          <span class="text-center flex-1" style="font-size: 20px"
            >{{ pagination }} - {{ totalPages }}</span
          >
          <span
            @click="nextPage()"
            :disabled="pagination >= totalPages"
            class="px-2 py-1"
            style="font-size: 40px"
          >
            <i class="fas fa-arrow-circle-right"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apibanks from "../core/infraestructure/http/api";
import ExtractTables from "./components/ExtractTables.vue";
import Loader from "./components/Loader.vue";
import VsudInput from "@/components/VsudInput.vue";
import VsudButton from "@/components/VsudButton.vue";
import VsudBadge from "@/components/VsudBadge.vue";

export default {
  name: "Extract",
  data() {
    return {
      loader: false,
      extract: [],
      pagination: 1,
      itemPerPage: 10,
      totalPages: 0,
      form: {
        datei: "",
        datef: "",
      },
    };
  },
  components: {
    ExtractTables,
    Loader,
    VsudBadge,
    VsudInput,
    VsudButton,
  },

  mounted() {
    this.initDate();
  },

  methods: {
    nextPage() {
      this.pagination++;
      this.getExtract();
    },

    backPage() {
      this.pagination--;
      this.getExtract();
    },

    async initDate() {
      const today = new Date();
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(today.getDate() - 3);
      const formatDate = (date) => {
        return date.toISOString().split("T")[0];
      };

      this.$refs.datei.$el.querySelector("input").value =
        formatDate(threeDaysAgo);
      this.$refs.datef.$el.querySelector("input").value = formatDate(today);

      this.getExtract();
    },

    async getExtract() {
      this.extract = [];
      const authData = JSON.parse(localStorage.getItem("authentication"));
      this.dataUser = authData.data;

      const headers = {
        headers: {
          Authorization: `Bearer ${this.dataUser.access_token}`,
        },
      };

      const formData = {
        datei: this.$refs.datei.$el.querySelector("input").value,
        datef: this.$refs.datef.$el.querySelector("input").value,
      };

      const data = {
        dateFrom: formData.datei,
        dateTo: formData.datef,
        limitPerPage: this.itemPerPage,
        page: this.pagination,
      };

      // const data = {
      //   dateFrom: "2024-07-01", //formData.datei,
      //   dateTo: "2024-12-24", // formData.datef,
      //   limitPerPage: this.itemPerPage,
      //   page: this.pagination,
      // };

      try {
        this.loader = true;
        const response = await apibanks.post(
          `baas/account/extract`,
          data,
          headers
        );
        if (response.status === 200 || response.status === 201) {
          this.extract = response.data.extract;
          this.totalPages = response.data.totalPage;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loader = false;
      }
    },
  },
};
</script>
