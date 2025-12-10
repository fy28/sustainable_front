<template>
  <div class="rules-page">
    <h1>📐 Règles documents par produit & pays</h1>

    <!-- 🔹 Formulaire d'ajout -->
    <div class="rule-form">
      <h2>➕ Ajouter une règle</h2>

      <!-- Produit -->
      <div class="form-row">
        <label>Produit :</label>
        <select v-model="selectedProduit" class="input">
          <option disabled value="">-- Choisir un produit --</option>
          <option v-for="p in produits" :key="p.idProduit" :value="p.idProduit">
            {{ p.nom }}
          </option>
        </select>
      </div>

      <!-- Pays -->
      <div class="form-row">
        <label>Pays :</label>
        <select v-model="selectedPays" class="input">
          <option disabled value="">-- Choisir un pays --</option>
          <option v-for="p in pays" :key="p.idPays" :value="p.idPays">
            {{ p.nomPays }}
          </option>
        </select>
      </div>

      <!-- Documents (checkbox multiples) -->
      <div class="form-row">
        <label>Documents :</label>

        <div class="checkbox-group">
          <label 
            v-for="d in documents" 
            :key="d.idDocument" 
            class="checkbox-item">
            <input 
              type="checkbox" 
              v-model="selectedDocuments"
              :value="d.idDocument" 
            />
            {{ d.nomDocument }}
          </label>
        </div>
      </div>

      <div class="actions">
        <button class="btn success" @click="addRule">💾 Enregistrer la règle</button>
      </div>
    </div>

    <!-- 🔹 Liste des règles regroupées -->
    <div class="rules-list">
      <h2>📋 Règles existantes</h2>

      <table class="table" v-if="groupedRules.length > 0">
        <thead>
          <tr>
            <th>#</th>
            <th>Produit</th>
            <th>Pays</th>
            <th>Documents</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(g, i) in groupedRules" :key="i">
            <td>{{ i + 1 }}</td>
            <td>{{ g.nomProduit }}</td>
            <td>{{ g.nomPays }}</td>

            <!-- Affichage groupé -->
            <td>
              <ul class="doc-list">
                <li v-for="doc in g.documents" :key="doc">{{ doc }}</li>
              </ul>
            </td>

            <td>
              <button class="btn danger" @click="deleteGroup(g.ids)">
                🗑️ Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty">
        <p>Aucune règle définie pour le moment.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DocumentRules",
  data() {
    return {
      produits: [],
      pays: [],
      documents: [],
      rules: [],

      selectedProduit: "",
      selectedPays: "",
      selectedDocuments: [], // MULTI documents
    };
  },

  async created() {
    await Promise.all([
      this.loadProduits(),
      this.loadPays(),
      this.loadDocuments(),
      this.loadRules(),
    ]);
  },

  computed: {
    // ⭐ Groupe par produit + pays pour un tableau clean
    groupedRules() {
      const groups = {};

      for (const r of this.rules) {
        const key = r.nomProduit + "_" + r.nomPays;

        if (!groups[key]) {
          groups[key] = {
            nomProduit: r.nomProduit,
            nomPays: r.nomPays,
            documents: [],
            ids: [],
          };
        }

        groups[key].documents.push(r.nomDocument);
        groups[key].ids.push(r.idProduitDocumentPays);
      }

      return Object.values(groups);
    }
  },

  methods: {
    async loadProduits() {
      const res = await axios.get("http://localhost:5156/api/produit");
      this.produits = res.data;
    },

    async loadPays() {
      const res = await axios.get("http://localhost:5156/api/pays");
      this.pays = res.data;
    },

    async loadDocuments() {
      const res = await axios.get("http://localhost:5156/api/document");
      this.documents = res.data.map(d => ({
        idDocument: d.idDocument,
        nomDocument: d.nomDocument,
      }));
    },

    async loadRules() {
      const res = await axios.get("http://localhost:5156/api/document/rules");
      this.rules = res.data;
    },

    // ⭐ Ajout multi-documents
    async addRule() {
      if (!this.selectedProduit || !this.selectedPays || this.selectedDocuments.length === 0) {
        alert("⚠️ Veuillez remplir tous les champs et sélectionner au moins 1 document.");
        return;
      }

      try {
        for (const docId of this.selectedDocuments) {
          await axios.post("http://localhost:5156/api/document/rules", {
            idProduit: this.selectedProduit,
            idPays: this.selectedPays,
            idDocument: docId,
          });
        }

        alert("✅ Règles enregistrées !");

        this.selectedProduit = "";
        this.selectedPays = "";
        this.selectedDocuments = [];

        await this.loadRules();
      } catch (err) {
        console.error(err);
        alert("❌ Erreur lors de l'ajout.");
      }
    },

    // ⭐ Suppression d'un groupe complet
    async deleteGroup(ids) {
      if (!confirm("Supprimer toutes les règles pour ce produit + pays ?")) return;

      try {
        for (const id of ids) {
          await axios.delete(`http://localhost:5156/api/document/rules/${id}`);
        }

        alert("🗑️ Groupe supprimé !");
        await this.loadRules();
      } catch (err) {
        console.error(err);
        alert("❌ Erreur lors de la suppression.");
      }
    },
  },
};
</script>

<style scoped>
.rules-page {
  max-width: 1100px;
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
h2 {
  color: #3c8dbc;
  margin-bottom: 10px;
}

/* Formulaire */
.rule-form {
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 25px;
  background: #f9fafc;
}
.form-row {
  margin-bottom: 12px;
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

/* Checkbox group */
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #eef1f4;
  padding: 6px 10px;
  border-radius: 6px;
}

/* Tableau */
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

.doc-list {
  list-style: none;
  padding: 0;
}
.doc-list li {
  background: #eef1f4;
  margin: 3px 0;
  padding: 3px 6px;
  border-radius: 4px;
}

/* Boutons */
.btn {
  border: none;
  border-radius: 5px;
  padding: 6px 10px;
  margin: 2px;
  cursor: pointer;
  color: white;
}
.btn.success {
  background-color: #00a65a;
}
.btn.danger {
  background-color: #d9534f;
}
.btn:hover {
  opacity: 0.9;
}

.empty {
  text-align: center;
  color: #666;
  margin-top: 10px;
}
</style>
