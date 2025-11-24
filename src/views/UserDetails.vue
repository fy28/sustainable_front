<template>
  <div class="user-details">
    <h1>👤 Détails de l’utilisateur</h1>

    <div v-if="user" class="card">
      <p><strong>Nom :</strong> {{ user.userName }}</p>
      <p><strong>Prénom :</strong> {{ user.prenom }}</p>
      <p><strong>Adresse mail :</strong> {{ user.mail }}</p>
      <p><strong>Date de naissance :</strong> {{ formatDate(user.dateNaissance) }}</p>
      <p><strong>Date d’entrée :</strong> {{ formatDate(user.dateEntree) }}</p>
      <p><strong>Rôle :</strong> {{ user.roleName }}</p>
    </div>

    <div v-else class="empty">
      <p>Chargement ou utilisateur introuvable...</p>
    </div>

    <button class="btn-back" @click="$router.push('/users')">⬅ Retour à la liste</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserDetails",
  props: ["id"],
  data() {
    return { user: null };
  },
  async created() {
    try {
      const res = await axios.get(`http://localhost:5156/api/user/${this.$route.params.id}`);
      this.user = res.data;
    } catch (err) {
      console.error("Erreur chargement détails utilisateur :", err);
    }
  },
  methods: {
    formatDate(date) {
      return date ? new Date(date).toLocaleDateString("fr-FR") : "—";
    },
  },
};
</script>

<style scoped>
.user-details {
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.card {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}
p {
  font-size: 15px;
  margin: 8px 0;
}
strong {
  color: #3c8dbc;
}
.btn-back {
  background-color: #3c8dbc;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-back:hover {
  background-color: #367fa9;
}
.empty {
  text-align: center;
  color: #888;
}
</style>
