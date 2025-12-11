<template>
  <div class="doc-form">
    <h1>✏️ Modifier le document</h1>

    <div class="form-card">
      <label>Nom du document :</label>
      <input v-model="nom" class="input" />

      <h3>Pays associés :</h3>
      <div class="checkbox-group">
        <label v-for="p in pays" :key="p.idPays" class="checkbox-item">
          <input type="checkbox" v-model="selectedPays" :value="p.idPays" />
          {{ p.nomPays }}
        </label>
      </div>

      <h3>Produits associés :</h3>
      <div class="checkbox-group">
        <label v-for="prod in produits" :key="prod.idProduit" class="checkbox-item">
          <input type="checkbox" v-model="selectedProduits" :value="prod.idProduit" />
          {{ prod.nom }}
        </label>
      </div>

      <div class="actions">
        <button class="btn success" @click="update">💾 Enregistrer</button>
        <router-link to="/documents" class="btn cancel">Annuler</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DocumentEdit",

  data() {
    return {
      nom: "",
      pays: [],
      produits: [],
      selectedPays: [],
      selectedProduits: [],
    };
  },

  async created() {
    const id = this.$route.params.id;

    this.pays = (await axios.get("http://localhost:5156/api/pays")).data;
    this.produits = (await axios.get("http://localhost:5156/api/produit")).data;

    const d = (await axios.get(`http://localhost:5156/api/document/${id}`)).data;

    this.nom = d.nomDocument;

    this.selectedPays = d.paysAssocies.map(x => x.idPays);
    this.selectedProduits = d.produitsAssocies.map(x => x.idProduit);
  },

  methods: {
    async update() {
      const id = this.$route.params.id;

      const body = {
        nomDocument: this.nom,
        paysSelectionnes: this.selectedPays,
        produitsSelectionnes: this.selectedProduits,
      };

      await axios.put(`http://localhost:5156/api/document/${id}`, body);

      alert("Modifications enregistrées !");
      this.$router.push("/documents");
    },
  },
};
</script>
