<template>
  <div class="collecteur-form">
    <h1>➕ Nouveau collecteur</h1>

    <form @submit.prevent="saveCollecteur">
      <div class="form-row">
        <label>Nom :</label>
        <input v-model="nom" type="text" class="input" required />
      </div>

      <div class="form-row">
        <label>Contact :</label>
        <input v-model="contact" type="text" class="input" />
      </div>

      <div class="form-row">
        <label>Zone :</label>
        <select v-model="zone" class="input" required>
          <option disabled value="">-- Sélectionner une zone --</option>
          <option>NORD</option>
          <option>SUD</option>
          <option>EST</option>
          <option>OUEST</option>
          <option>CENTRE</option>
        </select>
      </div>

      <div class="form-row">
        <label>Produits collectés :</label>
        <div class="checkboxes">
          <label v-for="p in produits" :key="p.idProduit">
            <input type="checkbox" :value="p.idProduit" v-model="selectedProduits" />
            {{ p.nom }}
          </label>
        </div>

        <!-- ✅ Bouton pour ajouter un produit -->
        <div class="add-product-btn">
          <router-link to="/products/add?from=collecteur" class="btn small">➕ Ajouter un produit</router-link>
        </div>
      </div>

      <div class="actions">
        <button type="submit" class="btn success">💾 Enregistrer</button>
        <router-link to="/collecteurs" class="btn cancel">Annuler</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CollecteurAdd",
  data() {
    return {
      nom: "",
      contact: "",
      zone: "",
      produits: [],
      selectedProduits: [],
    };
  },
  async created() {
    await this.loadProduits();
  },
  methods: {
    async loadProduits() {
      try {
        const res = await axios.get("http://localhost:5156/api/produit");
        this.produits = res.data;
      } catch (err) {
        console.error("Erreur chargement produits :", err);
        alert("❌ Impossible de charger les produits !");
      }
    },

    async saveCollecteur() {
      if (!this.nom || !this.zone) {
        alert("⚠️ Veuillez remplir tous les champs obligatoires !");
        return;
      }

      try {
     await axios.post("http://localhost:5156/api/collecteur", {
  nomCollecteur: this.nom,
  contact: this.contact,
  zone: this.zone,
  produitIds: this.selectedProduits,
});

        alert("✅ Collecteur ajouté avec succès !");
        this.$router.push("/collecteurs");
      } catch (err) {
        console.error("Erreur création collecteur :", err);
        alert("❌ Erreur lors de l'ajout du collecteur !");
      }
    },
  },
};
</script>

<style scoped>
.collecteur-form {
  max-width: 600px;
  margin: 30px auto;
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
h1 {
  text-align: center;
  color: #3c8dbc;
  margin-bottom: 20px;
}
.form-row {
  margin-bottom: 15px;
}
label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}
.input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.add-product-btn {
  margin-top: 10px;
}
.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.btn {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}
.btn.success {
  background-color: #00a65a;
}
.btn.cancel {
  background-color: #d9534f;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}
.btn.small {
  background-color: #3c8dbc;
  padding: 6px 10px;
}
.btn:hover {
  opacity: 0.9;
}
</style>
