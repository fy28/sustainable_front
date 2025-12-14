<template>
  <div class="expeditions-container">
    <h1>📦 Liste des expéditions enregistrées</h1>

    <!-- 🔍 Zone de filtres -->
    <div class="filters">
      <input v-model="searchClient" type="text" placeholder="🔍 Rechercher par client..." class="filter-input" />
      <input v-model="searchProduct" type="text" placeholder="🧾 Rechercher par produit..." class="filter-input" />
      <div class="filter-date">
        <label>Date d’enregistrement :</label>
        <input v-model="searchDateEnreg" type="date" class="filter-input" />
      </div>
      <div class="filter-date">
        <label>Date de livraison :</label>
        <input v-model="searchDateLiv" type="date" class="filter-input" />
      </div>
    </div>

    <!-- Tableau -->
    <div v-if="paginatedExpeditions.length > 0" class="table-wrapper">
      <table class="expeditions-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Client</th>
            <th>Produits</th>
            <th>Quantité totale</th>
            <th>Prix total (MGA)</th>
            <th>Date(s) de livraison</th>
            <th>Date d’enregistrement</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(exp, index) in paginatedExpeditions" :key="exp.id">
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td>{{ exp.client }}</td>

            <!-- Produits -->
            <td>
              <ul>
                <li v-for="(p, i) in groupByProduit(exp.produitsDetails)" :key="i">
                  {{ p.produit }}
                </li>
              </ul>
            </td>

            <!-- Quantités alignées -->
            <td>
              <ul>
                <li v-for="(q, i) in quantitesParProduit(exp.produitsDetails)" :key="i">
                  {{ q.quantite }} {{ q.unite }}
                </li>
              </ul>
            </td>

            <td>{{ totalPrix(exp.produitsDetails).toLocaleString() }}</td>

            <td>
              <ul>
                <li v-for="(d, i) in uniqueDates(exp.produitsDetails)" :key="i">
                  {{ formatDate(d) }}
                </li>
              </ul>
            </td>

            <td>{{ formatDate(exp.dateCreation) }}</td>

            <td class="actions">
              <router-link class="btn small info" :to="{ name: 'ExpeditionDetail', params: { id: exp.id } }">
                Détails
              </router-link>
              <button class="btn small danger" @click="confirmDelete(exp.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty">
      <p>Aucune expédition trouvée pour ces critères.</p>
    </div>

    <!-- 🔢 Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button class="btn small" :disabled="currentPage === 1" @click="currentPage--">
        ◀ Précédent
      </button>

      <span>Page {{ currentPage }} / {{ totalPages }}</span>

      <button class="btn small" :disabled="currentPage === totalPages" @click="currentPage++">
        Suivant ▶
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ExpeditionsList",

  data() {
    return {
      expeditions: [],
      searchClient: "",
      searchProduct: "",
      searchDateEnreg: "",
      searchDateLiv: "",

      // Pagination
      currentPage: 1,
      pageSize: 10,
    };
  },

  created() {
    this.loadExpeditions();
  },

  computed: {
    /* 🔍 Filtrage + TRI ASC (ancienne → récente) */
    filteredExpeditions() {
      return this.expeditions
        .filter(exp => {
          const clientMatch = exp.client.toLowerCase().includes(this.searchClient.toLowerCase());
          const produitMatch = exp.produitsDetails.some(p =>
            p.produit.toLowerCase().includes(this.searchProduct.toLowerCase())
          );

          const dateEnregMatch =
            !this.searchDateEnreg || exp.dateCreation.split("T")[0] === this.searchDateEnreg;

          const dateLivMatch =
            !this.searchDateLiv ||
            exp.produitsDetails.some(p => p.dateLivraison?.split("T")[0] === this.searchDateLiv);

          return clientMatch && produitMatch && dateEnregMatch && dateLivMatch;
        })
        .sort((a, b) => new Date(a.dateCreation) - new Date(b.dateCreation));
    },

    /* 📄 Pagination */
    totalPages() {
      return Math.ceil(this.filteredExpeditions.length / this.pageSize);
    },

    paginatedExpeditions() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredExpeditions.slice(start, start + this.pageSize);
    },
  },

  watch: {
    /* Reset page quand filtres changent */
    searchClient() { this.currentPage = 1; },
    searchProduct() { this.currentPage = 1; },
    searchDateEnreg() { this.currentPage = 1; },
    searchDateLiv() { this.currentPage = 1; },
  },

  methods: {
    async loadExpeditions() {
      const res = await axios.get("http://localhost:5156/api/expedition");

      this.expeditions = res.data.map(exp => ({
        id: exp.idExpedition,
        client: exp.clientName,
        dateCreation: exp.dateCreation,
        produitsDetails: exp.produits.map(p => ({
          produit: p.nomProduit,
          quantite: p.quantite,
          unite: p.unite,
          dateLivraison: exp.dateLivraison,
        })),
      }));
    },

    groupByProduit(details) {
      const map = {};
      details.forEach(p => {
        if (!map[p.produit]) map[p.produit] = { produit: p.produit };
      });
      return Object.values(map);
    },

    quantitesParProduit(details) {
      const map = {};
      details.forEach(p => {
        if (!map[p.produit]) map[p.produit] = { quantite: 0, unite: p.unite };
        map[p.produit].quantite += parseFloat(p.quantite);
      });
      return Object.values(map);
    },

    uniqueDates(details) {
      return [...new Set(details.map(p => p.dateLivraison).filter(Boolean))];
    },

    totalPrix(details) {
      return details.reduce((sum, p) => sum + (p.prixUnitaire ?? 0) * p.quantite, 0);
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("fr-FR");
    },
  },
};
</script>

<style scoped>
  .pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 15px;
}
/* style identique, inchangé */
.expeditions-container {
  padding: 25px;
  background-color: #f4f6f9;
  border-radius: 8px;
  max-width: 1100px;
  margin: auto;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  background: white;
  padding: 10px 15px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.filter-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.filter-date {
  display: flex;
  align-items: center;
  gap: 5px;
}

.table-wrapper {
  overflow-x: auto;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.expeditions-table {
  width: 100%;
  border-collapse: collapse;
}

.expeditions-table th,
.expeditions-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: center;
}

.expeditions-table th {
  background-color: #3c8dbc;
  color: white;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.btn {
  padding: 6px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  color: white;
  transition: 0.2s;
}

.btn.small {
  font-size: 12px;
}
.btn.info {
  background-color: #3c8dbc;
}
.btn.danger {
  background-color: #d9534f;
}

.btn:hover {
  opacity: 0.9;
}

.empty {
  text-align: center;
  color: #777;
  font-style: italic;
  margin-top: 25px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.custom-modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 340px;
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
