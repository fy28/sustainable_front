<template>
  <div class="collecteur-list">
    <h1>📋 Liste des collecteurs</h1>

    <!-- 🔍 Zone de recherche -->
    <div class="filters">
      <input v-model="searchNom" type="text" placeholder="🔎 Nom du collecteur..." class="filter-input" />
      <input v-model="searchContact" type="text" placeholder="📞 Contact..." class="filter-input" />
      <input v-model="searchProduit" type="text" placeholder="🍃 Produit collecté..." class="filter-input" />
      <input v-model="searchZone" type="text" placeholder="🌍 Zone..." class="filter-input" />
      <input v-model="searchDate" type="text" placeholder="📅 Date (AAAA-MM ou AAAA-MM-JJ)" class="filter-input small" />
    </div>

    <div v-if="paginatedCollecteurs.length > 0">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Contact</th>
            <th>Zone</th>
            <th>Produits collectés</th>
            <th>Dernière modification</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(c, index) in paginatedCollecteurs"
            :key="c.idCollecteur"
          >
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td>{{ c.nomCollecteur }}</td>
            <td>{{ c.contact || "—" }}</td>
            <td>{{ c.zone }}</td>
            <td>
              <ul class="produits">
                <li v-for="p in c.produits" :key="p.idProduit">
                  {{ p.nomProduit }}
                </li>
              </ul>
            </td>
            <td>{{ formatDate(c.derniereModification) }}</td>
            <td>
              <button class="btn edit" @click="editCollecteur(c)">✏️</button>
              <button class="btn danger" @click="deleteCollecteur(c.idCollecteur)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 🔢 PAGINATION -->
      <div class="pagination">
        <button
          class="btn small"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          ◀ Précédent
        </button>

        <span>Page {{ currentPage }} / {{ totalPages }}</span>

        <button
          class="btn small"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Suivant ▶
        </button>
      </div>
    </div>

    <div v-else class="empty">
      <p>Aucun collecteur trouvé pour ces critères.</p>
      <router-link to="/collecteurs/add" class="btn success">
        ➕ Ajouter un collecteur
      </router-link>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "CollecteurList",

  data() {
    return {
      collecteurs: [],

      // filtres
      searchNom: "",
      searchContact: "",
      searchProduit: "",
      searchZone: "",
      searchDate: "",

      // pagination
      currentPage: 1,
      pageSize: 15,
    };
  },

  async created() {
    await this.loadCollecteurs();
  },

  computed: {
    filteredCollecteurs() {
      return this.collecteurs.filter(c => {
        const matchNom = c.nomCollecteur?.toLowerCase().includes(this.searchNom.toLowerCase());
        const matchContact = c.contact?.toLowerCase().includes(this.searchContact.toLowerCase());
        const matchZone = c.zone?.toLowerCase().includes(this.searchZone.toLowerCase());

        const produits = c.produits?.map(p => p.nomProduit.toLowerCase()).join(", ") || "";
        const matchProduit = produits.includes(this.searchProduit.toLowerCase());

        const date = c.derniereModification ? new Date(c.derniereModification) : null;
        const dateStr = date
          ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
          : "";
        const matchDate = !this.searchDate || dateStr.startsWith(this.searchDate);

        return matchNom && matchContact && matchZone && matchProduit && matchDate;
      });
    },

    totalPages() {
      return Math.ceil(this.filteredCollecteurs.length / this.pageSize) || 1;
    },

    paginatedCollecteurs() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredCollecteurs.slice(start, start + this.pageSize);
    },
  },

  watch: {
    filteredCollecteurs() {
      this.currentPage = 1; // reset page quand filtre change
    },
  },

  methods: {
    async loadCollecteurs() {
      const res = await axios.get("http://localhost:5156/api/collecteur");
      this.collecteurs = res.data;
    },

    formatDate(date) {
      if (!date) return "—";
      return new Date(date).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    async deleteCollecteur(id) {
      if (!confirm("⚠️ Voulez-vous vraiment supprimer ce collecteur ?")) return;
      await axios.delete(`http://localhost:5156/api/collecteur/${id}`);
      this.loadCollecteurs();
    },

    editCollecteur(c) {
      this.$router.push({ name: "CollecteurEdit", params: { id: c.idCollecteur } });
    },
  },
};
</script>


<style scoped>

.collecteur-list {
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

/* Filtres */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  background: #f9f9f9;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.filter-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-width: 180px;
}
.filter-input.small {
  width: 220px;
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
  vertical-align: top;
}
.table th {
  background-color: #3c8dbc;
  color: white;
}

.produits {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.produits li {
  background: #f4f6f9;
  margin: 2px 0;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.btn {
  border: none;
  border-radius: 5px;
  padding: 6px 10px;
  margin: 2px;
  cursor: pointer;
  color: white;
}
.btn.edit {
  background-color: #3c8dbc;
}
.btn.danger {
  background-color: #d9534f;
}
.btn.success {
  background-color: #00a65a;
  display: inline-block;
  margin-top: 15px;
}
.btn:hover {
  opacity: 0.9;
}
.empty {
  text-align: center;
  color: #666;
}
.pagination {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.btn.small {
  padding: 5px 10px;
  background-color: #3c8dbc;
}
.btn.small:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
