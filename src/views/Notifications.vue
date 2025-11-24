<template>
  <div class="notifications-container">
    <h1> Notifications d’expédition</h1>

    <div v-if="notifications.length > 0">
      <table class="table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Produits</th>
            <th>Date de livraison</th>
            <th>Jours restants</th>
            <th>Documents manquants</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(n, i) in notifications" :key="i">
            <td>{{ n.client }}</td>
            <td>
              <ul>
                <li v-for="(p, j) in n.produitsDetails" :key="j">{{ p.produit }}</li>
              </ul>
            </td>
            <td>{{ formatDate(n.dateLivraison) }}</td>
            <td>{{ joursRestants(n.dateLivraison) }}</td>
            <td class="missing">⚠️ Documents incomplets</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty">
      <p> Aucune expédition urgente ou incomplète.
        Aucun impayé ou collecte a venir 
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExpeditionNotifications",
  data() {
    return {
      notifications: [],
    };
  },
  created() {
    this.notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
  },
  methods: {
    formatDate(date) {
      if (!date) return "—";
      const d = new Date(date);
      return d.toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" });
    },
    joursRestants(date) {
      const diff = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24);
      return Math.ceil(diff);
    },
  },
};
</script>

<style scoped>
.notifications-container {
  max-width: 950px;
  margin: 40px auto;
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th, .table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}
.table th {
  background-color: #3c8dbc;
  color: white;
}
.missing {
  color: #d9534f;
  font-weight: bold;
}
.empty {
  text-align: center;
  color: #777;
  margin-top: 20px;
}
</style>
