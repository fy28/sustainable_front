<template>
  <div class="document-list">
    <h1>📄 Liste des documents</h1>

    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Document</th>
            <th>Pays associés</th>
            <th>Produits associés</th>
            <th>Actions</th>

          </tr>
        </thead>

        <tbody>
          <tr v-for="(d, i) in documents" :key="d.idDocument">
            <td>{{ i + 1 }}</td>
            <td>{{ d.idDocument }}</td>
            <td>{{ d.nomDocument }}</td>

            <td>
              <span v-if="d.paysAssocies.length === 0" class="empty">—</span>
              <ul v-else>
                <li v-for="p in d.paysAssocies" :key="p.idPays">{{ p.nomPays }}</li>
              </ul>
            </td>

            <td>
              <span v-if="d.produitsAssocies.length === 0" class="empty">—</span>
              <ul v-else>
                <li v-for="p in d.produitsAssocies" :key="p.idProduit">{{ p.nomProduit }}</li>
              </ul>
            </td>
            <td class="actions">
  <router-link
    :to="{ name: 'DocumentEdit', params: { id: d.idDocument } }"
    class="btn edit">
    ✏️ Modifier
  </router-link>

  <button class="btn danger" @click="deleteDocument(d.idDocument)">
    🗑️ Supprimer
  </button>
</td>

          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DocumentList",

  data() {
    return { documents: [] };
  },

  async created() {
    this.documents = (await axios.get("http://localhost:5156/api/document")).data;
  },
  methods: {
  async deleteDocument(id) {
    if (!confirm("❌ Supprimer ce document ?")) return;

    try {
      await axios.delete(`http://localhost:5156/api/document/${id}`);
      this.documents = this.documents.filter(d => d.idDocument !== id);
      alert("Document supprimé !");
    } catch (err) {
      alert("Erreur lors de la suppression");
      console.error(err);
    }
  }
}

};
</script>

<style scoped>
.document-list {
  max-width: 1100px;
  margin: 40px auto;
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #3c8dbc;
}

/* TABLE */
.table-wrapper {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

.table th {
  background-color: #3c8dbc;
  color: white;
}

.table tr:hover {
  background-color: #f7faff;
}

ul {
  padding-left: 18px;
  text-align: left;
}

.empty {
  font-style: italic;
  color: #777;
}
.actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.btn.edit {
  background-color: #f0ad4e;
  color: white;
  border-radius: 5px;
  padding: 6px 10px;
}

.btn.danger {
  background-color: #d9534f;
  color: white;
  border-radius: 5px;
  padding: 6px 10px;
}

</style>
