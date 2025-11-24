<template>
  <div class="collecteur-form">
    <h1>✏️ Modifier un collecteur</h1>

    <form v-if="collecteur" @submit.prevent="updateCollecteur">
      <div class="form-row">
        <label>Nom :</label>
        <input v-model="collecteur.nomCollecteur" type="text" class="input" required />
      </div>

      <div class="form-row">
        <label>Contact :</label>
        <input v-model="collecteur.contact" type="text" class="input" />
      </div>

      <div class="form-row">
        <label>Zone :</label>
        <select v-model="collecteur.zone" class="input" required>
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
            <input
              type="checkbox"
              :value="p.idProduit"
              v-model="selectedProduits"
            />
            {{ p.nom }}
          </label>
        </div>
        <div class="add-product-btn">
          <router-link to="/products/add?from=collecteur" class="btn small">➕ Ajouter un produit</router-link>
        </div>
      </div>

      <div class="actions">
        <button type="submit" class="btn success">💾 Enregistrer les modifications</button>
        <router-link to="/collecteurs" class="btn cancel">Annuler</router-link>
      </div>
    </form>

    <div v-else class="loading">
      <p>Chargement du collecteur...</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CollecteurEdit",
  data() {
    return {
      collecteur: null,
      produits: [],
      selectedProduits: [],
    };
  },
  async created() {
    await this.loadProduits();
    await this.loadCollecteur();
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

    async loadCollecteur() {
      const id = this.$route.params.id;
      try {
        const res = await axios.get(`http://localhost:5156/api/collecteur/${id}`);
        this.collecteur = res.data;
        this.selectedProduits = res.data.produits.map((p) => p.idProduit);
      } catch (err) {
        console.error("Erreur chargement collecteur :", err);
        alert("❌ Collecteur introuvable !");
        this.$router.push("/collecteurs");
      }
    },

    async updateCollecteur() {
      try {
        await axios.put(`http://localhost:5156/api/collecteur/${this.collecteur.idCollecteur}`, {
          nomCollecteur: this.collecteur.nomCollecteur,
          contact: this.collecteur.contact,
          zone: this.collecteur.zone,
          produitIds: this.selectedProduits,
        });

        alert("✅ Collecteur mis à jour avec succès !");
        this.$router.push("/collecteurs");
      } catch (err) {
        console.error("Erreur mise à jour collecteur :", err);
        alert("❌ Erreur lors de la mise à jour !");
      }
    },
  },
};
</script>

<style scoped>
.collecteur-form {
  max-width: 650px;
  margin: 30px auto;
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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

.loading {
  text-align: center;
  color: #555;
  font-style: italic;
}
</style>
