<template>
  <div class="expedition-container">
    <h1>Nouvelle expédition</h1>

    <!-- Infos client -->
    <div class="client-info">
      <p>
        <b>Client :</b> {{ clientName }}
        <span class="client-id">(ID : {{ clientId }})</span>
      </p>

      <div class="form-row global">
        <label>Pays de destination :</label>
        <select v-model="selectedPays" class="input">
          <option disabled value="">-- Choisir un pays --</option>
          <option v-for="p in paysClient" :key="p.id" :value="p.id">
            {{ p.nom }}
          </option>
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
          <select v-model="selectedProductId" class="input">
            <option disabled value="">-- Choisir un produit --</option>
            <option v-for="p in produits" :key="p.idProduit" :value="p.idProduit">
              {{ p.nom }}
            </option>
          </select>
        </div>

        <!-- Affichage prix -->
        <p v-if="selectedProductDetails" class="price-info">
          💵 Prix unitaire :
          <b>{{ selectedProductDetails.prix.toLocaleString() }}</b> MGA /
          {{ selectedProductDetails.nomUnite }}
        </p>

        <div class="form-row">
          <label>Quantité :</label>
          <input
            type="number"
            v-model="quantity"
            class="input small"
            placeholder="0"
          />
          <select v-model="unit" class="input small">
            <option>kg</option>
            <option>tonne</option>
          </select>
        </div>

        <div class="form-actions">
          <button class="btn-validate" @click="addProduct">Ajouter à la liste</button>
        </div>
      </div>
    </div>

    <!-- Liste des produits -->
    <div v-if="expeditionLignes.length > 0" class="expedition-list">
      <h2>📋 Produits de l’expédition</h2>

      <div
        v-for="(exp, index) in expeditionLignes"
        :key="index"
        class="exp-card"
      >
        <h3>{{ exp.nomProduit }}</h3>
        <p><b>Quantité :</b> {{ exp.quantite }} {{ exp.unite }}</p>

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
              <td>{{ doc.nomDocument }}</td>
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
      Valider l'expédition
    </button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "NewExpedition",

  data() {
    return {
      clientId: this.$route.params.clientId,
      clientName: this.$route.params.clientName,

      produits: [],
      paysClient: [],

      selectedPays: "",
      deliveryDate: "",

      selectedProductId: "",
      quantity: "",
      unit: "kg",

      expeditionLignes: [],
      showAddForm: false,
    };
  },

  computed: {
    selectedProductDetails() {
      return this.produits.find((p) => p.idProduit === this.selectedProductId);
    },
  },

  async created() {
    await this.loadProduits();
    await this.loadPaysClient();
  },

  methods: {
    async loadProduits() {
      const res = await axios.get("http://localhost:5156/api/produit");
      this.produits = res.data;
    },

    async loadPaysClient() {
      const res = await axios.get(
        `http://localhost:5156/api/client/${this.clientId}/pays`
      );

      this.paysClient = res.data.map((nom) => ({
        id: nom.includes("France") ? "PAY_001" : 
            nom.includes("Grece") ? "PAY_002" : "PAY_003",
        nom,
      }));
    },

    async addProduct() {
      if (!this.selectedPays || !this.selectedProductId || !this.quantity) {
        alert("Veuillez remplir toutes les informations !");
        return;
      }

      // Charger documents dynamiques depuis backend
      const res = await axios.get(
        `http://localhost:5156/api/expedition/docs?produit=${this.selectedProductId}&pays=${this.selectedPays}`
      );

      const docs = res.data;

      const produit = this.selectedProductDetails;

      this.expeditionLignes.push({
        idProduit: produit.idProduit,
        nomProduit: produit.nom,
        quantite: this.quantity,
        unite: this.unit,
        documents: docs,
      });

      this.selectedProductId = "";
      this.quantity = "";
      this.unit = "kg";
      this.showAddForm = false;
    },

    removeProduct(index) {
      this.expeditionLignes.splice(index, 1);
    },

    async validateExpedition() {
  if (this.expeditionLignes.length === 0) {
    alert("Ajoutez au moins un produit !");
    return;
  }

  // 🔥 REGROUPEMENT PAR PRODUIT
  const grouped = {};

  this.expeditionLignes.forEach(e => {
    const key = `${e.idProduit}|${e.unite}`;

    if (!grouped[key]) {
      grouped[key] = {
        idProduit: e.idProduit,
        nomProduit: e.nomProduit,
        quantite: 0,
        unite: e.unite,
        documents: e.documents
      };
    }

    grouped[key].quantite += parseFloat(e.quantite);
  });

  const lignesRegroupees = Object.values(grouped);

  // 🔹 Objet pour la page LIST
  const expeditionFinale = lignesRegroupees.map(e => ({
    clientName: this.clientName,
    product: e.nomProduit,
    quantity: e.quantite,
    unit: e.unite,
    country: this.selectedPays,
    deliveryDate: this.deliveryDate,
    documents: e.documents.map(d => d.nomDocument ?? d),
  }));

  // Sauvegarde pour LIST
  localStorage.setItem("expedition", JSON.stringify(expeditionFinale));

  // 🔹 Payload API
  const payload = {
    idClient: this.clientId,
    idPaysDestination: this.selectedPays,
    dateLivraison: this.deliveryDate,
    lignes: lignesRegroupees.map(e => ({
      idProduit: e.idProduit,
      quantite: e.quantite,
      unite: e.unite,
    })),
  };

  const res = await axios.post("http://localhost:5156/api/expedition", payload);

  alert("Expédition créée : " + res.data.idExpedition);
  this.$router.push("/list");
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
