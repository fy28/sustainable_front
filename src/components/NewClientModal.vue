<template>
  <div v-if="show" class="modal-overlay">
    <div class="custom-modal">
      <h3>Nouveau client</h3>

      <input 
        v-model="nomClient"
        placeholder="Nom du client"
        class="input"
      />

      <input 
        v-model="mail"
        placeholder="Adresse e-mail"
        class="input"
        type="email"
      />

      <textarea
        v-model="specificite"
        placeholder="Demande ou spécificité (ex : vanille 8 cm, sachet 50 g)"
        class="textarea"
      ></textarea>

      <h4>Choisir pays</h4>
      <div class="pays-list">
        <label v-for="p in pays" :key="p.idPays">
          <input type="checkbox" :value="p.idPays" v-model="selectedPays" />
          {{ p.nomPays }}
        </label>
      </div>

      <div class="new-pays">
        <input v-model="nouveauPays" placeholder="Nouveau pays" class="input" />
        <button @click="ajouterPays">Ajouter pays</button>
      </div>

      <div class="modal-actions">
        <button class="btn" @click="$emit('close')">Annuler</button>
        <button class="btn btn-validate" @click="valider">Créer client</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "NewClientModal",
  props: ["show"],
  data() {
    return {
      nomClient: "",
      mail: "",
      specificite: "",
      pays: [],
      selectedPays: [],
      nouveauPays: ""
    };
  },
  async mounted() {
    await this.chargerPays();
  },
  methods: {
    async chargerPays() {
      const res = await axios.get("http://localhost:5156/api/pays");
      this.pays = res.data;
    },
    async ajouterPays() {
      if (!this.nouveauPays) return;
      const res = await axios.post("http://localhost:5156/api/pays", {
        nomPays: this.nouveauPays
      });
      this.pays.push(res.data);
      this.nouveauPays = "";
    },
    async valider() {
      try {
        const res = await axios.post("http://localhost:5156/api/client", {
          nomClient: this.nomClient,
          mail: this.mail,
          specificite: this.specificite,
          paysIds: this.selectedPays
        });
        alert("Client créé : " + res.data.nomClient);
        this.$emit("created", res.data);
        this.$emit("close");
      } catch (err) {
        console.error("Erreur création client :", err);
      }
    }
  }
};
</script>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 30000 !important;
}
.custom-modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 450px;
  z-index: 30000 !important;
}
.input {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.pays-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.new-pays {
  margin: 10px 0;
  display: flex;
  gap: 10px;
}
.modal-actions {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.textarea {
  width: 100%;
  min-height: 80px;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
}
</style>
