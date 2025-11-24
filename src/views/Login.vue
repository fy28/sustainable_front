<template>
  <div class="login-page">
  
    <div class="login-left">
      <div class="overlay"></div>
      <div class="brand">
     
      </div>
    </div>

    <div class="login-right">
      <div class="form-container">
        <div class="logo">
          <img src="@/assets/MME_Logo.png" alt="MadaMarket Export" />
        </div>
        <h1>Welcome</h1>
        <p>Log into your account</p>
     <form class="login-form" @submit.prevent="login">
        <input v-model="username" type="text" placeholder="Nom d'utilisateur" class="input" />
        <input v-model="password" type="password" placeholder="Mot de passe" class="input" />
        <button type="submit" class="btn">Log in</button>
     </form>
        <p v-if="error" style="color:red">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
      error: null
    };
  },
  methods: {
    async login() {
      try {
        const res = await axios.post("http://localhost:5156/api/auth/login", {
          userName: this.username,
          password: this.password
        });

        console.log("Utilisateur connecté :", res.data);


        localStorage.setItem("user", JSON.stringify(res.data));

       
        this.$router.push("/home");
      } catch (err) {
        this.error = "Identifiants incorrects";
        console.error("Erreur login:", err);
      }
    }
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  height: 100vh;
  font-family: "Segoe UI", Arial, sans-serif;
}

/* --- Partie gauche : image --- */
.login-left {
  flex: 1;
  background: url("@/assets/sp6.jpeg") center center no-repeat;
  background-size: cover;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}


.brand {
  position: relative;
  z-index: 2;
  text-align: center;
}

.brand h2 {
  font-size: 22px;
  font-weight: bold;
}

/* --- Partie droite : logo + form --- */
.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9ff;
}

.form-container {
  width: 380px;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.1);
  text-align: center;
}

.logo {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.logo img {
  max-width: 220px;
  height: auto;
}

.form-container h1 {
  color: #009688;
  margin-bottom: 5px;
}

.form-container p {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.input {
  width: 100%;
  margin-bottom: 15px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #009688, #f5b301);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
}
</style>
