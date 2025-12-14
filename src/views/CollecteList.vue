<template>
  <div class="collecte-list">
    <h1>📦 Liste des collectes</h1>

    <!-- 🔍 Zone de filtres -->
    <div class="filters">
      <input v-model="searchCollecteur" type="text" placeholder="🔎 Collecteur..." class="filter-input" />
      <input v-model="searchProduit" type="text" placeholder="🍃 Produit..." class="filter-input" />
      <select v-model="searchStatut" class="filter-input">
        <option value="">-- Statut --</option>
        <option>En attente</option>
        <option>Livrée</option>
        <option>Payée</option>
      </select>

      <div class="date-range">
        <label>📅 Du :</label>
        <input type="date" v-model="dateDebut" class="filter-date" />
        <label>au :</label>
        <input type="date" v-model="dateFin" class="filter-date" />
      </div>
    </div>

    <!-- ✅ Tableau si données -->
    <div v-if="filteredCollectes.length > 0">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Collecteur</th>
            <th>Produit</th>
            <th>Quantité (kg)</th>
            <th>Date de collecte</th>
            <th>Date d’arrivée</th>
            <th>Statut</th>
            <th>🕓 Dernière modif</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(c, i) in paginatedCollectes" :key="c.idCollecte">
            <td>{{ (currentPage - 1) * pageSize + i + 1 }}</td>
            <td>{{ c.nomCollecteur || "—" }}</td>
            <td>{{ c.nomProduit || "—" }}</td>
            <td>{{ Number(c.quantite).toLocaleString() }}</td>
            <td>{{ formatDate(c.dateCollecte) }}</td>
            <td>{{ formatDate(c.dateArrivee) }}</td>
            <td>
              <span :class="['status', statutClass(c.statut)]">{{ c.statut }}</span>
            </td>
            <td>{{ formatDateTime(c.derniereModification) }}</td>
            <td>
              <router-link
                :to="{ name: 'CollecteEdit', params: { id: c.idCollecte } }"
                class="btn edit"
              >
                ✏️
              </router-link>
              <button class="btn danger" @click="deleteCollecte(c.idCollecte)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 🔢 Pagination -->
      <div class="pagination">
        <button class="btn" :disabled="currentPage === 1" @click="currentPage--">◀</button>
        <span>Page {{ currentPage }} / {{ totalPages }}</span>
        <button class="btn" :disabled="currentPage === totalPages" @click="currentPage++">▶</button>
      </div>
    </div>

    <!-- 🔹 Aucun résultat -->
    <div v-else class="empty">
      <p>Aucune collecte trouvée avec ces filtres.</p>
      <router-link to="/collecte/add" class="btn success">➕ Nouvelle collecte</router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CollecteList",

  data() {
    return {
      collectes: [],
      searchCollecteur: "",
      searchProduit: "",
      searchStatut: "",
      dateDebut: "",
      dateFin: "",
      currentPage: 1,
      pageSize: 10,
    };
  },

  async created() {
    await this.loadCollectes();
  },

  computed: {
    filteredCollectes() {
      return this.collectes.filter(c => {
        const matchCollecteur = c.nomCollecteur?.toLowerCase().includes(this.searchCollecteur.toLowerCase());
        const matchProduit = c.nomProduit?.toLowerCase().includes(this.searchProduit.toLowerCase());
        const matchStatut = this.searchStatut ? c.statut === this.searchStatut : true;

        const dateCol = c.dateCollecte ? new Date(c.dateCollecte) : null;
        const debut = this.dateDebut ? new Date(this.dateDebut) : null;
        const fin = this.dateFin ? new Date(this.dateFin) : null;

        const matchDate =
          (!debut || (dateCol && dateCol >= debut)) &&
          (!fin || (dateCol && dateCol <= fin));

        return matchCollecteur && matchProduit && matchStatut && matchDate;
      });
    },

    totalPages() {
      return Math.ceil(this.filteredCollectes.length / this.pageSize) || 1;
    },

    paginatedCollectes() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredCollectes.slice(start, start + this.pageSize);
    },
  },

  watch: {
    filteredCollectes() {
      this.currentPage = 1;
    },
  },

  methods: {
    async loadCollectes() {
      try {
        const res = await axios.get("http://localhost:5156/api/collecte");
        this.collectes = res.data;
      } catch (err) {
        console.error("Erreur chargement collectes :", err);
        alert("❌ Impossible de charger la liste des collectes !");
      }
    },

    async deleteCollecte(id) {
      if (!confirm("⚠️ Voulez-vous vraiment supprimer cette collecte ?")) return;
      try {
        await axios.delete(`http://localhost:5156/api/collecte/${id}`);
        this.collectes = this.collectes.filter(c => c.idCollecte !== id);
        alert("🗑️ Collecte supprimée !");
      } catch (err) {
        console.error("Erreur suppression collecte :", err);
        alert("❌ Erreur lors de la suppression !");
      }
    },

    formatDate(dateStr) {
      if (!dateStr) return "—";
      return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },

    formatDateTime(dateStr) {
      if (!dateStr) return "—";
      return new Date(dateStr).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    statutClass(statut) {
      if (!statut) return "";
      const s = statut.toLowerCase();
      if (s.includes("attente")) return "en-attente";
      if (s.includes("livr")) return "livree";
      if (s.includes("pay")) return "payee";
      return "";
    },
  },
};
</script>

<style scoped>
.collecte-list {
  max-width: 1100px;
  margin: 40px auto;
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
h1 {
  text-align: center;
  color: #3c8dbc;
  margin-bottom: 20px;
}

/* 🔍 Filtres */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}
.filter-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-width: 150px;
}
.date-range {
  display: flex;
  align-items: center;
  gap: 5px;
}
.filter-date {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

/* Tableau */
.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
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
.status {
  padding: 4px 8px;
  border-radius: 5px;
  color: #fff;
  font-weight: bold;
}
.status.en-attente {
  background-color: #f0ad4e;
}
.status.livree {
  background-color: #5bc0de;
}
.status.payee {
  background-color: #5cb85c;
}
.btn {
  border: none;
  border-radius: 5px;
  padding: 6px 10px;
  margin: 2px;
  cursor: pointer;
  color: white;
}
.btn.danger {
  background-color: #d9534f;
}
.btn.edit {
  background-color: #f0ad4e;
}
.btn.success {
  background-color: #00a65a;
  display: inline-block;
  text-decoration: none;
  margin-top: 15px;
}
.btn:hover {
  opacity: 0.9;
}
.empty {
  text-align: center;
  color: #666;
}
</style>
