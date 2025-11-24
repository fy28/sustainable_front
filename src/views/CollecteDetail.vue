<template>
  <div class="detail-container" v-if="collecte">
    <h1> Détails de la collecte</h1>

    <p><b>Collecteur :</b> {{ collecte.collecteur }}</p>
    <p><b>Zone :</b> {{ collecte.zone }}</p>
    <p><b>Produit :</b> {{ collecte.produit }}</p>
    <p><b>Date de collecte :</b> {{ formatDate(collecte.dateCollecte) }}</p>
    <p><b>Date d’arrivée :</b> {{ collecte.dateArrivee || "—" }}</p>
    <p><b>Quantité :</b> {{ collecte.quantite }} kg</p>
    <p><b>Statut :</b> {{ collecte.statut }}</p>

    <router-link to="/collecte" class="btn back">⬅ Retour à la liste</router-link>
  </div>

  <div v-else class="empty">
    <p>Collecte introuvable.</p>
  </div>
</template>

<script>
export default {
  name: "CollecteDetail",
  props: ["id"],
  data() {
    return { collecte: null };
  },
  created() {
    const all = JSON.parse(localStorage.getItem("collectes") || "[]");
    this.collecte = all.find(c => c.id == this.id) || null;
  },
  methods: {
    formatDate(date) {
      const d = new Date(date);
      return d.toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" });
    },
  },
};
</script>

<style scoped>
.detail-container {
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.btn.back {
  display: inline-block;
  background: #3c8dbc;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  text-decoration: none;
}
</style>
