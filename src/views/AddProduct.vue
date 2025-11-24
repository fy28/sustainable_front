<template>
  <div class="product-container">
    <h1>➕ Ajouter un produit</h1>

    <div class="form">
      <div class="form-row">
        <label>Nom du produit :</label>
        <input v-model="nom" placeholder="ex : Poivre noir moulu" class="input" />
      </div>

      <div class="form-row">
        <label>Code HS :</label>
        <input v-model="codeHS" placeholder="ex : 0904.11" class="input" />
      </div>

      <div class="form-row">
        <label>Prix unitaire (MGA) :</label>
        <input v-model.number="prix" type="number" placeholder="ex : 25000" class="input" />
      </div>

      <!-- ✅ Liste dynamique des unités -->
      <div class="form-row">
        <label>Unité :</label>
        <select v-model="idUnite" class="input small" required>
          <option disabled value="">-- Choisir une unité --</option>
          <option v-for="u in unites" :key="u.idUnite" :value="u.idUnite">
            {{ u.nomUnite }} ({{ u.symbole }})
          </option>
        </select>
      </div>

      <div class="form-row">
        <label>Documents nécessaires (séparés par une virgule) :</label>
        <textarea
          v-model="documentsInput"
          placeholder="Ex : Facture commerciale, Licence d’exportation, Certificat d’origine"
          class="input textarea"
          rows="3"
        ></textarea>
      </div>

      <div class="form-actions">
        <button class="btn" @click="saveProduct">💾 Enregistrer</button>
        <router-link to="/products" class="btn cancel">↩ Retour à la liste</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AddProduct",
  data() {
    return {
      nom: "",
      codeHS: "",
      prix: "",
      idUnite: "", // 🔹 ID de l’unité choisie
      unites: [],  // 🔹 Liste des unités chargées depuis le backend
      documentsInput: "",
    };
  },
  async created() {
    try {
      const res = await axios.get("http://localhost:5156/api/unite");
      this.unites = res.data;
    } catch (err) {
      console.error("Erreur lors du chargement des unités :", err);
      alert("❌ Impossible de charger les unités !");
    }
  },
  methods: {
    async saveProduct() {
      if (!this.nom || !this.codeHS || !this.prix || !this.idUnite) {
        alert("⚠️ Veuillez remplir tous les champs obligatoires !");
        return;
      }

      try {
        const response = await axios.post("http://localhost:5156/api/produit", {
          nom: this.nom,
          codeHS: this.codeHS,
          prix: this.prix,
          idUnite: this.idUnite, // ✅ envoie de l’ID unité au backend
        });

        alert(`✅ Produit ajouté avec succès : ${response.data.nom}`);

        // ✅ Si on vient du collecteur → retour automatique
        if (this.$route.query.from === "collecteur") {
          this.$router.back();
        } else {
          this.$router.push("/products");
        }
      } catch (err) {
        console.error("Erreur ajout produit :", err);
        alert("❌ Erreur lors de l'ajout du produit !");
      }
    },
  },
};
</script>

<style scoped>
.product-container {
  background-color: #f4f6f9;
  padding: 25px;
  border-radius: 10px;
  max-width: 700px;
  margin: 40px auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 25px;
}
.form-row {
  margin-bottom: 15px;
}
label {
  font-weight: 500;
  color: #333;
}
.input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.input.small {
  width: 150px;
}
.textarea {
  resize: vertical;
}
.form-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}
.btn {
  background-color: #00a65a;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
}
.btn:hover {
  background-color: #008d4c;
}
.btn.cancel {
  background-color: #3c8dbc;
}
.btn.cancel:hover {
  background-color: #337ab7;
}
</style>
