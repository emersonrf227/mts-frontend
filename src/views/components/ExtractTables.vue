<template>
  <div class="card mb-4">
    <div class="card-header pb-0">
      <h6>Extrato</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                ID/Data
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
              >
                Nome / Instituição
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Tipo
              </th>

              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Valor
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Status
              </th>
              <th class="text-secondary opacity-7">Descrição</th>
              <th class="text-secondary opacity-7">Comprovante</th>
            </tr>
          </thead>
          <tbody v-for="(extract, index) in extractList" :key="index">
            <tr>
              <td>
                <div class="d-flex px-2 py-1">
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">{{ extract.transactionId }}</h6>
                    <p class="text-xs text-secondary mb-0">
                      {{ this.formatDate(extract.data.createdAt) }}
                    </p>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">
                  {{ extract.data.name }}
                </p>
                <p class="text-xs text-secondary mb-0">
                  {{ extract.data.bankName }}
                </p>
              </td>
              <td class="align-middle text-center text-sm">
                <vsud-badge
                  :color="extract.data.type === 'CREDIT' ? 'success' : 'danger'"
                  variant="gradient"
                  size="sm"
                  >{{
                    extract.data.type === "CREDIT" ? "CREDITO" : "DEBITO"
                  }}</vsud-badge
                >
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold">
                  {{ this.formatPriceBr(Number(extract.data.amount)) }}
                </span>
              </td>
              <td class="align-middle text-center text-sm">
                <vsud-badge
                  :color="
                    extract.data.status === 'COMPLETED' ? 'success' : 'danger'
                  "
                  variant="gradient"
                  size="sm"
                  >{{
                    extract.data.status === "COMPLETED" ? "COMPLETED" : "ERROR"
                  }}</vsud-badge
                >
              </td>
              <td>
                <p class="text-xs text-secondary mb-0">
                  {{ extract.data.description }}
                </p>
              </td>
              <td
                style="
                  display: flex;
                  flex-direction: row;
                  justify-content: center;
                "
              >
                <router-link
                  :to="`/proof/${extract.transactionId}`"
                  v-bind="$attrs"
                >
                  <i class="fa-solid fa fa-receipt"></i>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import VsudAvatar from "@/components/VsudAvatar.vue";
import VsudBadge from "@/components/VsudBadge.vue";

export default {
  name: "AuthorsTable",
  components: {
    VsudAvatar,
    VsudBadge,
  },
  data() {
    return {
      loader: false,
    };
  },
  methods: {
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
  },
  props: {
    extractList: [],
  },
};
</script>
