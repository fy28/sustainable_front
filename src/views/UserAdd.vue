<template>
  <div class="user-add">
    <h1>👤 Nouvel utilisateur</h1>

    <div class="form">
      <input v-model="form.userName" placeholder="Nom" class="input" />
      <input v-model="form.prenom" placeholder="Prénom" class="input" />
      <input v-model="form.mail" placeholder="Adresse mail" class="input" type="email" />
      <input v-model="form.password" placeholder="Mot de passe" class="input" type="password" />
      
      <label>Date de naissance :</label>
      <input v-model="form.dateNaissance" type="date" class="input" />

      <label>Date d’entrée :</label>
      <input v-model="form.dateEntree" type="date" class="input" />

      <label>Rôle :</label>
      <select v-model="form.idRole" class="input">
        <option disabled value="">-- Sélectionner un rôle --</option>
        <option v-for="r in roles" :key="r.idRole" :value="r.idRole">
          {{ r.roleName }}
        </option>
      </select>

      <button class="btn" @click="saveUser">Créer utilisateur</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserAdd",
  data() {
    return {
      roles: [],
      form: {
        userName: "",
        prenom: "",
        mail: "",
        password: "",
        dateNaissance: "",
        dateEntree: "",
        idRole: "",
      },
    };
  },
  async created() {
    const res = await axios.get("http://localhost:5156/api/role");
    this.roles = res.data;
  },
  methods: {
    async saveUser() {
      try {
        await axios.post("http://localhost:5156/api/user", this.form);
        alert("✅ Utilisateur créé !");
        this.$router.push("/users");
      } catch (err) {
        console.error("Erreur création utilisateur :", err);
        alert("❌ Erreur lors de la création.");
      }
    },
  },
};
</script>

<style scoped>
.user-add {
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.input {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.btn {
  background-color: #3c8dbc;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn:hover {
  background-color: #367fa9;
}
</style>
