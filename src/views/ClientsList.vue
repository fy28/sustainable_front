<template>
  <div class="clients-list">
    <h1>📋 Liste des clients</h1>

    <div v-if="clients.length > 0">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nom du client</th>
            <th>Email</th>
            <th>Pays associés</th>
            <th>Spécificité</th>
             <th>Dernière modification</th>
            <th>Actions</th>
           
          </tr>
        </thead>
        <tbody>
          <tr v-for="(c, index) in clients" :key="c.idClient || index">
            <td>{{ index + 1 }}</td>
            <td>{{ c.nomClient }}</td>
            <td>{{ c.mail || "—" }}</td>
            <td>{{ c.paysAssocies || "—" }}</td>
            <td>{{ c.specificite || "—" }}</td>
            <td>
              {{
                c.derniereModification
                  ? new Date(c.derniereModification).toLocaleString("fr-FR")
                  : "—"
              }}
            </td>
            <td>
              <button class="btn edit" @click="openEdit(c)">✏️ Modifier</button>
              <button class="btn danger" @click="deleteClient(c.idClient)">🗑️ Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty">
      <p>Aucun client enregistré.</p>
    </div>

    <EditClientModal
      :show="showEdit"
      :client="selectedClient"
      @close="showEdit = false"
      @updated="loadClients"
    />
  </div>
</template>

<script>
import axios from "axios";
import EditClientModal from "../components/EditClientModal.vue";

export default {
  name: "ClientsList",
  components: { EditClientModal },
  data() {
    return {
      clients: [],
      showEdit: false,
      selectedClient: null,
    };
  },
  async created() {
    this.loadClients();
  },
  methods: {
    async loadClients() {
      const res = await axios.get("http://localhost:5156/api/client");
      this.clients = res.data;
    },
    openEdit(client) {
      this.selectedClient = { ...client };
      this.showEdit = true;
    },
    async deleteClient(id) {
      if (!confirm("Voulez-vous supprimer ce client ?")) return;
      await axios.delete(`http://localhost:5156/api/client/${id}`);
      alert("Client supprimé !");
      this.loadClients();
    },
  },
};
</script>


<style scoped>
.clients-list {
  max-width: 950px;
  margin: 40px auto;
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}
th {
  background-color: #3c8dbc;
  color: white;
}
.btn {
  padding: 5px 10px;
  border: none;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
}
.btn.edit { background-color: #00a65a; }
.btn.danger { background-color: #d9534f; }
.btn:hover { opacity: 0.9; }
</style>
