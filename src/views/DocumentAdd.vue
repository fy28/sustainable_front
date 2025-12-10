<template>
  <div class="doc-form">
    <h1>➕ Ajouter un document</h1>

    <div class="form-card">
      <label>Nom du document :</label>
      <input v-model="nom" class="input" placeholder="Ex : Certificat d’origine" />

      <h3>🌍 Pays associés :</h3>
      <div class="checkbox-group">
        <div v-for="p in pays" :key="p.idPays" class="checkbox-item">
          <label>
            <input type="checkbox" v-model="selectedPays" :value="p.idPays" />
            {{ p.nomPays }}
          </label>
        </div>
      </div>

      <h3>🍃 Produits associés :</h3>
      <div class="checkbox-group">
        <div v-for="prod in produits" :key="prod.idProduit" class="checkbox-item">
          <label>
            <input type="checkbox" v-model="selectedProduits" :value="prod.idProduit" />
            {{ prod.nom }}
          </label>
        </div>
      </div>

      <div class="actions">
        <button class="btn success" @click="save">💾 Enregistrer</button>
        <router-link to="/documents" class="btn cancel">Annuler</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DocumentAdd",
  data() {
    return {
      nom: "",
      pays: [],
      produits: [],
      selectedPays: [],
      selectedProduits: []
    };
  },

  async created() {
    this.pays = (await axios.get("http://localhost:5156/api/pays")).data;
    this.produits = (await axios.get("http://localhost:5156/api/produit")).data;
  },

  methods: {
    async save() {
      if (!this.nom) {
        alert("⚠️ Entrez un nom de document.");
        return;
      }

      const body = {
        nomDocument: this.nom,
        paysSelectionnes: this.selectedPays,
        produitsSelectionnes: this.selectedProduits,
      };

      await axios.post("http://localhost:5156/api/document", body);
      alert("✅ Document ajouté !");
      this.$router.push("/documents");
    },
  },
};
</script>

<style scoped>
.doc-form {
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
h1 {
  text-align: center;
  color: #3c8dbc;
  margin-bottom: 20px;
}
.form-card label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}
.input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 15px;
}
h3 {
  margin-top: 15px;
  color: #3c8dbc;
}
.checkbox-group {
  margin-left: 10px;
  margin-bottom: 10px;
}
.checkbox-item {
  margin-bottom: 5px;
}
.actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.btn {
  padding: 8px 15px;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}
.btn.success {
  background-color: #00a65a;
}
.btn.cancel {
  background-color: #d9534f;
  text-decoration: none;
}
.btn:hover {
  opacity: 0.9;
}
</style>
