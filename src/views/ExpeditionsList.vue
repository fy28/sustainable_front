<template>
  <div class="expeditions-container">
    <h1>📦 Liste des expéditions enregistrées</h1>

    <!-- 🔍 Zone de filtres -->
    <div class="filters">
      <input
        v-model="searchClient"
        type="text"
        placeholder="🔍 Rechercher par client..."
        class="filter-input"
      />
      <input
        v-model="searchProduct"
        type="text"
        placeholder="🧾 Rechercher par produit..."
        class="filter-input"
      />
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
    <div v-if="filteredExpeditions.length > 0" class="table-wrapper">
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
          <tr v-for="(exp, index) in filteredExpeditions" :key="exp.id">
            <td>{{ index + 1 }}</td>
            <td>{{ exp.client }}</td>

            <td>
              <ul>
                <li v-for="(p, i) in exp.produitsDetails" :key="i">
                  {{ p.produit }} — {{ p.quantite }} {{ p.unite }}
                </li>
              </ul>
            </td>

            <td>{{ totalQuantite(exp.produitsDetails).toLocaleString() }}</td>
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
              <router-link
                class="btn small info"
                :to="{ name: 'ExpeditionDetail', params: { id: exp.id } }"
              >
                Détails
              </router-link>

              <button class="btn small danger" @click="confirmDelete(exp.id)">
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty">
      <p>Aucune expédition trouvée pour ces critères.</p>
    </div>

    <!-- Popup suppression -->
    <div v-if="showConfirm" class="modal-overlay">
      <div class="custom-modal">
        <h3>⚠️ Confirmation</h3>
        <p>Voulez-vous vraiment supprimer cette expédition ?</p>
        <div class="modal-actions">
          <button class="btn" @click="showConfirm = false">Annuler</button>
          <button class="btn danger" @click="deleteExpedition">Supprimer</button>
        </div>
      </div>
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
      showConfirm: false,
      deleteId: null,

      // 🔍 Filtres
      searchClient: "",
      searchProduct: "",
      searchDateEnreg: "",
      searchDateLiv: "",
    };
  },
  created() {
    this.loadExpeditions();
  },
  computed: {
    filteredExpeditions() {
      return this.expeditions.filter((exp) => {
        const clientMatch = exp.client
          .toLowerCase()
          .includes(this.searchClient.toLowerCase());

        const produitMatch = exp.produitsDetails.some((p) =>
          p.produit.toLowerCase().includes(this.searchProduct.toLowerCase())
        );

        const dateEnregMatch =
          !this.searchDateEnreg ||
          exp.dateCreation.split("T")[0] === this.searchDateEnreg;

        const dateLivMatch =
          !this.searchDateLiv ||
          exp.produitsDetails.some(
            (p) => p.dateLivraison?.split("T")[0] === this.searchDateLiv
          );

        return clientMatch && produitMatch && dateEnregMatch && dateLivMatch;
      });
    },
  },
  methods: {
    async loadExpeditions() {
      try {
        const res = await axios.get("http://localhost:5156/api/expedition");

        this.expeditions = res.data.map((exp) => ({
          id: exp.idExpedition,
          client: exp.clientName,
          dateCreation: exp.dateCreation,
          produitsDetails: exp.produits.map((p) => ({
            produit: p.nomProduit,
            quantite: p.quantite,
            unite: p.unite,
            dateLivraison: exp.dateLivraison,
          })),
        }));
      } catch (err) {
        console.error("Erreur lors du chargement des expéditions :", err);
      }
    },

    formatDate(date) {
      if (!date) return "—";
      return new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },

    uniqueDates(details) {
      const dates = details.map((p) => p.dateLivraison).filter(Boolean);
      return [...new Set(dates)];
    },

    totalQuantite(details) {
      return details.reduce((sum, p) => sum + (parseFloat(p.quantite) || 0), 0);
    },

    totalPrix(details) {
      return details.reduce((sum, p) => {
        const prixU = p.prixUnitaire ?? 0;
        return sum + prixU * (parseFloat(p.quantite) || 0);
      }, 0);
    },

    confirmDelete(id) {
      this.deleteId = id;
      this.showConfirm = true;
    },

    async deleteExpedition() {
      try {
        await axios.delete(`http://localhost:5156/api/expedition/${this.deleteId}`);
        this.expeditions = this.expeditions.filter((e) => e.id !== this.deleteId);
        alert("Expédition supprimée avec succès !");
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
      this.showConfirm = false;
    },
  },
};
</script>

<style scoped>
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
