<template>
  <div class="manuel-container">
    <h1>Bienvenue au Manuel d’utilisation 📘</h1>

    <p>Ce guide vous aide à comprendre comment utiliser l’application :</p>

    <ul>
      <li>👤 <b>Expeditions :</b> créer, modifier et gérer vos clients.
           <p> <b>Creer :</b> Expeditions -> Nouvelle -> Choisir societe ou ajout nouvelle societe -> choisir pays de destination + date de livraison -> choix des produits : quantite, unite -> Enregsitrer, envoyer mail au client + les oducments en pj ou exporter en pdf les documents</p>
           <p> <b>Liste :</b> Liste des expeditions faites avec toutes ses informations, avec recherches multicriteres : par client, par produit, date d'enregistrement et date de livraison</p>
           <p> <b>Statistiques :</b> Statistiques des expeditions faites par produit, annee</p>
          </li>
      <li>🚚 <b>Clients :</b> créer une nouvelle clients, consulter la liste existante.</li>
      <li>📦 <b>Produits :</b> ajouter et gérer les produits exportés.</li>
      <li>🧾 <b>Documents :</b> consulter et générer les certificats nécessaires.</li>
      <li>📊 <b>Statistiques :</b> visualiser les performances et rapports.</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ManuelPage"
};
</script>

<style scoped>
.manuel-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
  background: #fdfdfd;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.manuel-container h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}
.manuel-container ul {
  list-style-type: none;
  padding: 0;
}
.manuel-container li {
  background: #eef7ff;
  margin: 10px 0;
  padding: 10px 15px;
  border-radius: 8px;
  color: #34495e;
}
</style>
