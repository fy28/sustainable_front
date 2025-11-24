<template>
  <div class="suivi-container">
    <h1> Suivi des collecteurs</h1>
    <p>Cette section affichera prochainement les livraisons, paiements et performances de chaque collecteur.</p>

    <router-link to="/collecteurs" class="btn back">⬅ Retour à la liste</router-link>
  </div>
</template>

<script>
export default {
  name: "CollecteurSuivi",
};
</script>

<style scoped>
.suivi-container {
  max-width: 800px;
  margin: 40px auto;
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}
h1 {
  color: #3c8dbc;
  margin-bottom: 15px;
}
.btn.back {
  background-color: #3c8dbc;
  color: white;
  padding: 8px 15px;
  border-radius: 6px;
  text-decoration: none;
  margin-top: 20px;
  display: inline-block;
}
.btn.back:hover {
  opacity: 0.9;
}
</style>
