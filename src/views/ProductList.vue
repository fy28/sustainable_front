<template>
  <div class="product-list">
    <h1>📦 Liste des produits</h1>

    <!-- 🔍 Zone de recherche -->
    <div class="filters">
      <input v-model="searchNom" type="text" placeholder="🔍 Nom..." class="filter-input" />
      <input v-model="searchCode" type="text" placeholder="🔍 Code HS..." class="filter-input" />
      <input v-model="searchUnite" type="text" placeholder="⚖️ Unité..." class="filter-input" />
      <input v-model="searchPrix" type="number" min="0" placeholder="💰 Prix unitaire" class="filter-input" />
    </div>

    <!-- Tableau -->
    <div v-if="filteredProducts.length > 0">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nom du produit</th>
            <th>Code HS</th>
            <th>Prix unitaire (MGA)</th>
            <th>Unité</th>
            <th>🕓 Dernière modification</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, index) in filteredProducts" :key="p.idProduit">
            <td>{{ index + 1 }}</td>
            <td>{{ p.nom }}</td>
            <td>{{ p.codeHS }}</td>
            <td>{{ Number(p.prix).toLocaleString() }}</td>
            <td>{{ p.nomUnite }}</td>
            <td>{{ formatDate(p.derniereModification) }}</td>
            <td>
              <button class="btn edit" @click="openEditModal(p)">✏️ Modifier</button>
              <button class="btn danger" @click="deleteProduct(p.idProduit, index)">🗑️ Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Aucun produit -->
    <div v-else class="empty">
      <p>Aucun produit trouvé pour ces critères.</p>
      <router-link to="/products/add" class="btn success">➕ Ajouter un produit</router-link>
    </div>

    <!-- 🔧 Modal édition -->
    <EditProductModal
      v-if="showEditModal"
      :show="showEditModal"
      :product="selectedProduct"
      @close="showEditModal = false"
      @updated="loadProducts"
    />
  </div>
</template>

<script>
import axios from "axios";
import EditProductModal from "../components/EditProductModal.vue";

export default {
  name: "ProductList",
  components: { EditProductModal },
  data() {
    return {
      products: [],
      searchNom: "",
      searchCode: "",
      searchUnite: "",
      searchPrix: "",
      showEditModal: false,
      selectedProduct: null,
    };
  },
  async created() {
    await this.loadProducts();
  },
  computed: {
    filteredProducts() {
      return this.products.filter((p) => {
        const matchNom = p.nom?.toLowerCase().includes(this.searchNom.toLowerCase());
        const matchCode = p.codeHS?.toLowerCase().includes(this.searchCode.toLowerCase());
        const matchUnite = p.nomUnite?.toLowerCase().includes(this.searchUnite.toLowerCase());
        const matchPrix = !this.searchPrix || Number(p.prix) === Number(this.searchPrix);
        return matchNom && matchCode && matchUnite && matchPrix;
      });
    },
  },
  methods: {
    async loadProducts() {
      try {
        const res = await axios.get("http://localhost:5156/api/produit");
        this.products = res.data;
      } catch (err) {
        console.error("Erreur chargement produits :", err);
        alert("❌ Impossible de charger la liste des produits.");
      }
    },
    async deleteProduct(id, index) {
      if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
      try {
        await axios.delete(`http://localhost:5156/api/produit/${id}`);
        this.products.splice(index, 1);
        alert("✅ Produit supprimé avec succès !");
      } catch (err) {
        console.error("Erreur suppression produit :", err);
        alert("❌ Erreur lors de la suppression !");
      }
    },
    openEditModal(product) {
      this.selectedProduct = { ...product };
      this.showEditModal = true;
    },
    formatDate(dateStr) {
      if (!dateStr) return "—";
      const date = new Date(dateStr);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>

<style scoped>
.product-list {
  max-width: 1000px;
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

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  transition: 0.2s;
}

.btn.success {
  background-color: #00a65a;
}
.btn.danger {
  background-color: #d9534f;
}
.btn.edit {
  background-color: #f0ad4e;
}
.btn:hover {
  opacity: 0.9;
}

.empty {
  text-align: center;
  color: #888;
  margin-top: 15px;
}
</style>
