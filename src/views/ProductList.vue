<template>
  <div class="product-list">
    <h1> Liste des produits</h1>

    <!-- 🔍 Zone de recherche -->
    <div class="filters">
      <input v-model="searchNom" type="text" placeholder=" Nom..." class="filter-input" />
      <input v-model="searchCode" type="text" placeholder=" Code HS..." class="filter-input" />
      <input v-model="searchUnite" type="text" placeholder=" Unité..." class="filter-input" />
      <input v-model="searchPrix" type="number" min="0" placeholder=" Prix unitaire" class="filter-input" />
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
            <th> Dernière modification</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(p, index) in paginatedProducts" :key="p.idProduit">
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td>{{ p.nom }}</td>
            <td>{{ p.codeHS }}</td>
            <td>{{ Number(p.prix).toLocaleString() }}</td>
            <td>{{ p.nomUnite }}</td>
            <td>{{ formatDate(p.derniereModification) }}</td>
            <td>
              <button class="btn edit" @click="openEditModal(p)"> Modifier</button>
              <button class="btn danger" @click="deleteProduct(p.idProduit, index)"> Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination">
        <button class="btn" :disabled="currentPage === 1" @click="currentPage--">◀</button>
        <span>Page {{ currentPage }} / {{ totalPages }}</span>
        <button class="btn" :disabled="currentPage === totalPages" @click="currentPage++">▶</button>
      </div>
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
      currentPage: 1,
      pageSize: 10,
    };
  },

  async created() {
    await this.loadProducts();
  },

  computed: {
    filteredProducts() {
      return this.products.filter(p => {
        const matchNom = p.nom?.toLowerCase().includes(this.searchNom.toLowerCase());
        const matchCode = p.codeHS?.toLowerCase().includes(this.searchCode.toLowerCase());
        const matchUnite = p.nomUnite?.toLowerCase().includes(this.searchUnite.toLowerCase());
        const matchPrix = !this.searchPrix || Number(p.prix) === Number(this.searchPrix);
        return matchNom && matchCode && matchUnite && matchPrix;
      });
    },

    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.pageSize) || 1;
    },

    paginatedProducts() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredProducts.slice(start, start + this.pageSize);
    },
  },

  watch: {
    filteredProducts() {
      this.currentPage = 1;
    },
  },

  methods: {
    async loadProducts() {
      const res = await axios.get("http://localhost:5156/api/produit");
      this.products = res.data;
    },

    async deleteProduct(id) {
      if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
      await axios.delete(`http://localhost:5156/api/produit/${id}`);
      this.loadProducts();
    },

    openEditModal(product) {
      this.selectedProduct = { ...product };
      this.showEditModal = true;
    },

    formatDate(dateStr) {
      if (!dateStr) return "—";
      return new Date(dateStr).toLocaleString("fr-FR");
    },
  },
};
</script>


<style scoped>
  .pagination {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
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
