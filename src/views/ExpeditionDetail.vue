<template>
  <div class="detail-container" v-if="expedition">
    <h1>📦 Détails de l’expédition</h1>

    <div class="summary">
      <p><b>Client :</b> {{ expedition.client }}</p>
      <p><b>Date d’enregistrement :</b> {{ formatDate(expedition.dateLivraison) }}</p>
    </div>

    <h3>Produits et quantités</h3>
    <table class="product-table">
      <thead>
        <tr>
          <th>Produit</th>
          <th>Pays</th>
          <th>Quantité</th>
          <th>Unité</th>
          <th>Prix unitaire (MGA)</th>
          <th>Prix total (MGA)</th>
          <th>Date de livraison</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in expedition.produitsDetails" :key="i">
          <td>{{ item.produit }}</td>
          <td>{{ item.pays }}</td>
          <td>{{ item.quantite }}</td>
          <td>{{ item.unite }}</td>
          <td>{{ getPrixUnitaire(item.produit).toLocaleString() }}</td>
          <td>{{ (getPrixUnitaire(item.produit) * item.quantite).toLocaleString() }}</td>
          <td>{{ formatDate(item.dateLivraison) }}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <p><b>Quantité totale :</b> {{ totalQuantite.toLocaleString() }}</p>
      <p><b>Prix total global :</b> {{ totalPrix.toLocaleString() }} MGA</p>
    </div>

    <h3>📄 Documents associés</h3>
    <ul>
      <li v-for="(doc, i) in expedition.documents" :key="i">
        {{ doc }}
      </li>
      <li v-if="!expedition.documents.length" style="color:#777;">
        Aucun document enregistré.
      </li>
    </ul>

    <router-link to="/expeditions" class="btn back">⬅ Retour à la liste</router-link>
  </div>

  <div v-else class="empty">
    <p>Expédition introuvable.</p>
  </div>
</template>

<script>
export default {
  name: "ExpeditionDetail",
  props: ["id"],
  data() {
    return {
      expedition: null,
      produitsRef: JSON.parse(localStorage.getItem("produits") || "[]"),
    };
  },
  created() {
    const saved = localStorage.getItem("expeditions_all");
    const all = saved ? JSON.parse(saved) : [];
    this.expedition = all[this.id] || null;
  },
  computed: {
    totalQuantite() {
      if (!this.expedition) return 0;
      return this.expedition.produitsDetails.reduce(
        (sum, p) => sum + (parseFloat(p.quantite) || 0),
        0
      );
    },
    totalPrix() {
      if (!this.expedition) return 0;
      return this.expedition.produitsDetails.reduce((sum, p) => {
        const prixU = this.getPrixUnitaire(p.produit);
        return sum + prixU * (parseFloat(p.quantite) || 0);
      }, 0);
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return "—";
      const d = new Date(date);
      return d.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    getPrixUnitaire(produit) {
      const found = this.produitsRef.find(
        (p) => p.nom.toLowerCase() === produit.toLowerCase()
      );
      return found ? parseFloat(found.prix) : 0;
    },
  },
};
</script>

<style scoped>
.detail-container {
  padding: 20px;
  background: #f4f6f9;
  border-radius: 8px;
  max-width: 900px;
  margin: auto;
}
.summary {
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}
.product-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.product-table th,
.product-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: center;
}
.product-table th {
  background-color: #3c8dbc;
  color: white;
}
.totals {
  background: white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: right;
}
ul { list-style-type: disc; margin-left: 25px; }
.btn.back {
  display: inline-block;
  margin-top: 15px;
  background: #3c8dbc;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  text-decoration: none;
}
.empty { text-align: center; color: #888; margin-top: 30px; }
</style>
