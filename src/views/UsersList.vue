<template>
  <div class="users-list">
    <h1>👥 Liste des utilisateurs</h1>

    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Adresse mail</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.idUser">
          <td>{{ index + 1 }}</td>
          <td>{{ user.userName }}</td>
          <td>{{ user.prenom }}</td>
          <td>{{ user.mail }}</td>
          <td>
            <button class="btn" @click="goToDetails(user.idUser)">Détails</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="users.length === 0" class="empty">
      Aucun utilisateur enregistré.
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UsersList",
  data() {
    return { users: [] };
  },
  async created() {
    try {
      const res = await axios.get("http://localhost:5156/api/user");
      this.users = res.data;
    } catch (err) {
      console.error("Erreur chargement utilisateurs :", err);
    }
  },
  methods: {
    goToDetails(id) {
      this.$router.push(`/users/${id}`);
    },
  },
};
</script>

<style scoped>
.users-list {
  max-width: 800px;
  margin: 40px auto;
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}
th {
  background-color: #3c8dbc;
  color: white;
}
.btn {
  background-color: #3c8dbc;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}
.btn:hover {
  background-color: #367fa9;
}
.empty {
  text-align: center;
  color: #888;
  margin-top: 20px;
}
</style>
