<template>
  <div class="collecte-form">
    <h1>➕ Nouvelle collecte</h1>

    <form @submit.prevent="saveCollecte">
      <!-- Choix du collecteur -->
      <div class="form-row">
        <label>Collecteur :</label>
        <select v-model="selectedCollecteur" class="input" @change="updateProduits" required>
          <option disabled value="">-- Sélectionner un collecteur --</option>
          <option v-for="c in collecteurs" :key="c.idCollecteur" :value="c.idCollecteur">
            {{ c.nomCollecteur }} ({{ c.zone }})
          </option>
        </select>
      </div>

      <!--  Produit collecté selon le collecteur -->
      <div class="form-row">
        <label>Produit collecté :</label>
        <select v-model="selectedProduit" class="input" required>
          <option disabled value="">-- Sélectionner un produit --</option>
          <option v-for="p in produitsDisponibles" :key="p.idProduit" :value="p.idProduit">
            {{ p.nomProduit }}
          </option>
        </select>
      </div>

      <div class="form-row">
        <label>Date de collecte :</label>
        <input type="date" v-model="dateCollecte" class="input" required />
      </div>

      <div class="form-row">
        <label>Date d’arrivée :</label>
        <input type="date" v-model="dateArrivee" class="input" />
      </div>

      <div class="form-row">
        <label>Quantité (kg) :</label>
        <input type="number" v-model="quantite" class="input" min="0" step="0.01" required />
      </div>

      <div class="form-row">
        <label>Statut :</label>
        <select v-model="statut" class="input" required>
          <option value="En attente">En attente</option>
          <option value="Livrée">Livrée</option>
          <option value="Payée">Payée</option>
        </select>
      </div>

      <div class="actions">
        <button type="submit" class="btn success">💾 Enregistrer</button>
        <router-link to="/collecte" class="btn cancel">Annuler</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CollecteAdd",
  data() {
    return {
      collecteurs: [],
      produitsDisponibles: [],
      selectedCollecteur: "",
      selectedProduit: "",
      dateCollecte: "",
      dateArrivee: "",
      quantite: "",
      statut: "En attente",
    };
  },
  async created() {
    await this.loadCollecteurs();
  },
  methods: {
    async loadCollecteurs() {
      try {
        // ✅ On récupère les collecteurs avec leurs produits associés
        const res = await axios.get("http://localhost:5156/api/collecteur");
        this.collecteurs = res.data;
      } catch (err) {
        console.error("Erreur chargement collecteurs :", err);
        alert("❌ Impossible de charger les collecteurs !");
      }
    },

    updateProduits() {
      // ✅ Trouve le collecteur choisi
      const col = this.collecteurs.find(c => c.idCollecteur === this.selectedCollecteur);

      // ✅ Si le collecteur a des produits associés, on les affiche
      if (col && col.produits && col.produits.length > 0) {
        this.produitsDisponibles = col.produits;
      } else {
        this.produitsDisponibles = [];
      }

      this.selectedProduit = "";
    },

    async saveCollecte() {
      if (!this.selectedCollecteur || !this.selectedProduit || !this.dateCollecte || !this.quantite) {
        alert("⚠️ Remplissez tous les champs !");
        return;
      }

      try {
        await axios.post("http://localhost:5156/api/collecte", {
          idCollecteur: this.selectedCollecteur,
          idProduit: this.selectedProduit,
          quantite: this.quantite,
          dateCollecte: this.dateCollecte,
          dateArrivee: this.dateArrivee || null,
          statut: this.statut,
        });

        alert("✅ Collecte enregistrée !");
        this.$router.push("/collecte");
      } catch (err) {
        console.error("Erreur création collecte :", err);
        alert("❌ Erreur lors de l'enregistrement !");
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
.btn.success { background-color: #00a65a; }
.btn.cancel { background-color: #d9534f; text-decoration: none; }
.btn:hover { opacity: 0.9; }
</style>
