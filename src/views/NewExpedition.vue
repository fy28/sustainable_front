<template>
  <div class="expedition-container">
    <h1>Nouvelle expédition</h1>

    <!-- Informations générales -->
    <div class="client-info">
      <p>
        <b>Client :</b> {{ $route.params.clientName }}
        <span class="client-id">(ID : {{ $route.params.clientId }})</span>
      </p>

      <div class="form-row global">
        <label>Pays de destination :</label>
        <select v-model="selectedCountry" class="input">
          <option disabled value="">-- Choisir un pays --</option>
          <option v-for="c in clientCountries" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="form-row global">
        <label>Date de livraison :</label>
        <input type="date" v-model="deliveryDate" class="input" />
      </div>
    </div>

    <hr />

    <!-- Ajouter produit -->
    <div class="add-section">
      <button class="btn-add" @click="showAddForm = !showAddForm">
        ➕ Ajouter un produit
      </button>

      <div v-if="showAddForm" class="add-form">
        <div class="form-row">
          <label>Produit :</label>
          <select v-model="selectedProduct" class="input">
            <option disabled value="">-- Choisir un produit --</option>
            <option v-for="p in products" :key="p.nom" :value="p.nom">{{ p.nom }}</option>
          </select>
        </div>

        <!-- ✅ Prix unitaire du produit -->
        <p v-if="selectedProductDetails" class="price-info">
          💵 Prix unitaire :
          <b>{{ selectedProductDetails.prix.toLocaleString() }}</b> MGA /
          {{ selectedProductDetails.unite }}
        </p>

        <div class="form-row">
          <label>Quantité :</label>
          <input type="number" v-model="quantity" class="input small" placeholder="0" />
          <select v-model="unit" class="input small">
            <option value="kg">kg</option>
            <option value="tonne">tonne</option>
          </select>
        </div>

        <div class="form-actions">
          <button class="btn-validate" @click="addExport">Ajouter à la liste</button>
        </div>
      </div>
    </div>

    <!-- Liste des produits ajoutés -->
    <div v-if="expedition.length > 0" class="expedition-list">
      <h2>📋 Produits de l’expédition</h2>

      <div v-for="(exp, index) in expedition" :key="index" class="exp-card">
        <h3>{{ exp.product }}</h3>
        <p><b>Quantité :</b> {{ exp.quantity }} {{ exp.unit }}</p>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Document nécessaire</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(doc, i) in exp.documents" :key="i">
              <td>{{ i + 1 }}</td>
              <td>{{ doc }}</td>
            </tr>
          </tbody>
        </table>

        <button class="btn-remove" @click="removeProduct(index)">🗑️ Supprimer</button>
      </div>
    </div>

    <div v-else class="empty">
      <p>Aucun produit ajouté pour le moment</p>
    </div>

    <hr />
    <button class="btn-final" @click="validateExpedition">
      Valider et voir la liste finale
    </button>
  </div>
</template>

<script>
const DOCUMENTS_RULES = {
  vanille: {
    france: ["Phytosanitaire", "Certification Bio", "Facture commerciale"],
    amerique: ["Phytosanitaire", "Numéro lock", "Licence d’exportation"],
  },
  girofle: {
    france: ["Facture commerciale", "Déclaration en douane", "Licence d’exportation"],
    amerique: ["Facture commerciale", "Analyse qualité", "Licence d’exportation"],
  },
};

export default {
  name: "NewExpedition",
  data() {
    return {
      products: [],
      clientCountries: ["france", "amerique"],

      selectedCountry: "",
      deliveryDate: "",
      selectedProduct: "",
      quantity: "",
      unit: "kg",

      expedition: [],
      showAddForm: false,
    };
  },
  created() {
    const savedProducts = JSON.parse(localStorage.getItem("produits") || "[]");

    if (savedProducts.length === 0) {
      this.products = Object.keys(DOCUMENTS_RULES).map((k) => ({
        nom: k,
        codeHS: "",
        prix: 0,
        unite: "kg",
        documents: [],
      }));
    } else {
      this.products = savedProducts;
    }
  },
  computed: {
    selectedProductDetails() {
      return this.products.find((p) => p.nom === this.selectedProduct);
    },
  },
  methods: {
    addExport() {
      if (!this.selectedCountry || !this.deliveryDate) {
        alert("Veuillez d’abord choisir le pays et la date de livraison !");
        return;
      }

      if (!this.selectedProduct || !this.quantity) {
        alert("Veuillez remplir les informations du produit !");
        return;
      }

      // éviter les doublons produits
      if (this.expedition.some((e) => e.product === this.selectedProduct)) {
        alert("⚠️ Ce produit a déjà été ajouté à l’expédition !");
        return;
      }

      const selectedProd = this.products.find((p) => p.nom === this.selectedProduct);
      const docs =
        selectedProd?.documents?.length > 0
          ? selectedProd.documents
          : DOCUMENTS_RULES[this.selectedProduct?.toLowerCase()]?.[this.selectedCountry] ||
            ["Facture commerciale", "Licence d’exportation"];

      this.expedition.push({
        product: this.selectedProduct,
        country: this.selectedCountry,
        documents: docs,
        deliveryDate: this.deliveryDate,
        quantity: this.quantity,
        unit: this.unit,
      });

      // reset produit uniquement
      this.selectedProduct = "";
      this.quantity = "";
      this.unit = "kg";
      this.showAddForm = false;
    },

    removeProduct(index) {
      this.expedition.splice(index, 1);
    },

    validateExpedition() {
      if (this.expedition.length === 0) {
        alert("Ajoutez au moins un produit avant de valider !");
        return;
      }

      const clientName = this.$route.params.clientName;
      const clientId = this.$route.params.clientId;

      const enrichedExpedition = this.expedition.map((exp) => ({
        ...exp,
        clientName,
        clientId,
      }));

      localStorage.setItem("expedition", JSON.stringify(enrichedExpedition));
      this.$router.push({ name: "ExpeditionList" });
    },
  },
};
</script>

<style scoped>
.expedition-container {
  padding: 20px;
  background-color: #f4f6f9;
  max-width: 900px;
  margin: auto;
  border-radius: 10px;
}

h1 {
  text-align: center;
  margin-bottom: 10px;
  color: #2c3e50;
}

.client-info {
  text-align: center;
  margin-bottom: 20px;
}

.client-id {
  color: #888;
  font-size: 13px;
}

.form-row.global {
  justify-content: center;
  margin: 10px auto;
  width: 70%;
}

.add-section {
  text-align: center;
  margin-bottom: 20px;
}

.btn-add {
  background-color: #3c8dbc;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-add:hover {
  background-color: #337ab7;
}

.add-form {
  margin-top: 20px;
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.form-row {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.input {
  flex: 1;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.input.small {
  width: 100px;
}

.price-info {
  text-align: left;
  margin-bottom: 10px;
  color: #555;
}

.form-actions {
  text-align: right;
}

.btn-validate {
  background: #00a65a;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-validate:hover {
  background: #008d4c;
}

.expedition-list {
  margin-top: 20px;
}

.exp-card {
  background: white;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.exp-card h3 {
  color: #3c8dbc;
  margin-bottom: 5px;
}

.exp-card table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.exp-card th,
.exp-card td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.exp-card th {
  background-color: #3c8dbc;
  color: white;
}

.btn-remove {
  margin-top: 10px;
  background: #d9534f;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-remove:hover {
  background: #c9302c;
}

.empty {
  text-align: center;
  color: #888;
  margin-top: 20px;
}

.btn-final {
  background-color: #605ca8;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  display: block;
  margin: 25px auto 0;
}
.btn-final:hover {
  background-color: #4b48a2;
}
</style>
