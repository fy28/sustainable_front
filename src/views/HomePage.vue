<template>
  <div class="home-container">
    <h1>Bienvenue {{ user?.userName }}</h1>

    <div class="home-buttons">
      <div class="card" @click="$router.push('/manuel')">
        📘
        <h3>Manuel d’utilisation</h3>
        <p>Guide pour utiliser l’application</p>
      </div>

      <div class="card" @click="$router.push('/ai')">
        🤖
        <h3>Accéder à l’IA</h3>
        <p>Posez vos questions sur les données</p>
      </div>
    </div>

    <ChooseClient 
      :show="showClientPopup" 
      @close="showClientPopup = false"
      @validated="goToNewExpedition"
      @new-client="showNewClientPopup = true"
    />

    <NewClientModal 
      :show="showNewClientPopup"
      @close="showNewClientPopup = false"
      @created="onClientCreated"
    />
  </div>
</template>

<script>
import ChooseClient from "../components/ChooseClient.vue";
import NewClientModal from "../components/NewClientModal.vue";

export default {
  name: "HomePage",
  components: { ChooseClient, NewClientModal },
  data() {
    return {
      user: null,
      showClientPopup: false,
      showNewClientPopup: false
    };
  },
  mounted() {
    const savedUser = localStorage.getItem("user");
    if (savedUser) this.user = JSON.parse(savedUser);
  },
  methods: {
    goToNewExpedition(client) {
      this.$router.push({
        name: "NewExpedition",
        params: { clientId: client.idClient, clientName: client.nomClient }
      });
    },
    onClientCreated(client) {
      console.log("Nouveau client créé :", client);
    }
  }
};
</script>

<style scoped>
.home-container {
  text-align: center;
  padding: 20px;
}

.home-buttons {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-top: 30px;
}

.card {
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  width: 220px;
  height: 150px;
  padding: 15px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
  background-color: #eaf4ff;
}

.card h3 {
  margin-top: 10px;
  color: #2c3e50;
}

.card p {
  color: #7f8c8d;
  font-size: 0.9em;
}
</style>
