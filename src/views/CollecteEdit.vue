<template>
  <div class="collecte-form">
    <h1>✏️ Modifier la collecte</h1>

    <form @submit.prevent="updateCollecte">
      <!-- Collecteur -->
      <div class="form-row">
        <label>Collecteur :</label>
        <select v-model="form.idCollecteur" class="input" @change="updateProduits" required>
          <option disabled value="">-- Sélectionner un collecteur --</option>
          <option v-for="c in collecteurs" :key="c.idCollecteur" :value="c.idCollecteur">
            {{ c.nomCollecteur }} ({{ c.zone }})
          </option>
        </select>
      </div>

      <!-- Produit -->
      <div class="form-row">
        <label>Produit collecté :</label>
        <select v-model="form.idProduit" class="input" required>
          <option disabled value="">-- Sélectionner un produit --</option>
          <option v-for="p in produitsDisponibles" :key="p.idProduit" :value="p.idProduit">
            {{ p.nomProduit }}
          </option>
        </select>
      </div>

      <!-- Quantité -->
      <div class="form-row">
        <label>Quantité (kg) :</label>
        <input type="number" v-model="form.quantite" class="input" min="0" step="0.01" required />
      </div>

      <!-- Dates -->
      <div class="form-row">
        <label>Date de collecte :</label>
        <input type="date" v-model="form.dateCollecte" class="input" required />
      </div>

      <div class="form-row">
        <label>Date d’arrivée :</label>
        <input type="date" v-model="form.dateArrivee" class="input" />
      </div>

      <!-- Statut -->
      <div class="form-row">
        <label>Statut :</label>
        <select v-model="form.statut" class="input" required>
          <option value="En attente">En attente</option>
          <option value="Livrée">Livrée</option>
          <option value="Payée">Payée</option>
        </select>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button type="submit" class="btn success">💾 Enregistrer les modifications</button>
        <router-link to="/collecte" class="btn cancel">Annuler</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CollecteEdit",
  data() {
    return {
      form: {
        idCollecte: "",
        idCollecteur: "",
        idProduit: "",
        quantite: "",
        dateCollecte: "",
        dateArrivee: "",
        statut: "En attente",
      },
      collecteurs: [],
      produitsDisponibles: [],
    };
  },
  async created() {
    const id = this.$route.params.id;
    await this.loadCollecteurs();
    await this.loadCollecte(id);
  },
  methods: {
    async loadCollecteurs() {
      try {
        const res = await axios.get("http://localhost:5156/api/collecteur");
        this.collecteurs = res.data;
      } catch (err) {
        console.error("Erreur chargement collecteurs :", err);
        alert("❌ Impossible de charger les collecteurs !");
      }
    },

    async loadCollecte(id) {
      try {
        const res = await axios.get(`http://localhost:5156/api/collecte/${id}`);
        this.form = {
          ...res.data,
          dateCollecte: res.data.dateCollecte?.substring(0, 10) || "",
          dateArrivee: res.data.dateArrivee?.substring(0, 10) || "",
        };
        this.updateProduits();
      } catch (err) {
        console.error("Erreur chargement collecte :", err);
        alert("❌ Impossible de charger cette collecte !");
      }
    },

    updateProduits() {
      const col = this.collecteurs.find(c => c.idCollecteur === this.form.idCollecteur);
      this.produitsDisponibles = col?.produits || [];
    },

    async updateCollecte() {
      if (!this.form.idCollecteur || !this.form.idProduit || !this.form.quantite) {
        alert("⚠️ Veuillez remplir tous les champs obligatoires !");
        return;
      }

      try {
        await axios.put(`http://localhost:5156/api/collecte/${this.form.idCollecte}`, this.form);
        alert("✅ Collecte mise à jour avec succès !");
        this.$router.push("/collecte");
      } catch (err) {
        console.error("Erreur mise à jour collecte :", err);
        alert("❌ Erreur lors de la mise à jour !");
      }
    },
  },
};
</script>

<style scoped>
.collecte-form {
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
  margin-bottom: 25px;
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
}
.btn:hover {
  opacity: 0.9;
}
</style>
