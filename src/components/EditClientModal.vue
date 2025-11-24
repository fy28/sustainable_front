<template>
  <div v-if="show" class="modal-overlay">
    <div class="custom-modal">
      <h3>✏️ Modifier le client</h3>

      <input v-model="clientData.nomClient" class="input" placeholder="Nom du client" />
      <input v-model="clientData.mail" class="input" placeholder="Adresse mail" />
      <textarea v-model="clientData.specificite" class="textarea" placeholder="Spécificité"></textarea>

      <h4>Changer les pays associés</h4>
      <div class="pays-list">
        <label v-for="p in allPays" :key="p.idPays">
          <input type="checkbox" :value="p.idPays" v-model="selectedPays" /> {{ p.nomPays }}
        </label>
      </div>

      <div class="modal-actions">
        <button class="btn" @click="$emit('close')">Annuler</button>
        <button class="btn btn-validate" @click="saveChanges">Mettre à jour</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditClientModal",
  props: ["show", "client"],
  data() {
    return {
      clientData: {
        idClient: "",
        nomClient: "",
        mail: "",
        specificite: "",
      },
      selectedPays: [],
      allPays: [],
    };
  },
  watch: {
    client: {
      immediate: true,
      async handler(newVal) {
        if (!newVal) return;
        // Copier les données du client
        this.clientData = {
          idClient: newVal.idClient,
          nomClient: newVal.nomClient,
          mail: newVal.mail,
          specificite: newVal.specificite,
        };
        await this.loadPays();

        // Charger les pays déjà associés à ce client
        try {
          const resPays = await axios.get(`http://localhost:5156/api/client/${newVal.idClient}/pays`);
          // ⚠️ Attention : l’API renvoie des noms de pays, pas des IDs.
          // On mappe donc ces noms vers les IDs correspondants :
          this.selectedPays = this.allPays
            .filter(p => resPays.data.includes(p.nomPays))
            .map(p => p.idPays);
        } catch (err) {
          console.error("Erreur chargement pays du client :", err);
        }
      },
    },
  },
  methods: {
    async loadPays() {
      try {
        const res = await axios.get("http://localhost:5156/api/pays");
        this.allPays = res.data;
      } catch (err) {
        console.error("Erreur chargement pays :", err);
      }
    },
    async saveChanges() {
      try {
        // ✅ Construction du payload conforme au backend
        const payload = {
          nomClient: this.clientData.nomClient,
          mail: this.clientData.mail,
          specificite: this.clientData.specificite,
          paysIds: this.selectedPays, // ⚠️ tableau d’IDs uniquement
        };

        await axios.put(
          `http://localhost:5156/api/client/${this.clientData.idClient}`,
          payload
        );

        alert("✅ Client mis à jour avec succès !");
        this.$emit("updated");
        this.$emit("close");
      } catch (err) {
        console.error("❌ Erreur update client :", err.response?.data || err.message);
        alert("Erreur lors de la mise à jour du client.");
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 2000;
}
.custom-modal {
  background: white; padding: 20px;
  border-radius: 10px; width: 450px;
}
.input, .textarea {
  width: 100%; margin-bottom: 10px;
  border: 1px solid #ccc; border-radius: 6px; padding: 8px;
}
.textarea { min-height: 60px; }
.pays-list {
  display: flex; flex-wrap: wrap; gap: 10px;
}
.modal-actions {
  display: flex; justify-content: flex-end; gap: 10px;
}
.btn { padding: 6px 10px; border: none; border-radius: 5px; cursor: pointer; color: white; }
.btn-validate { background-color: #3c8dbc; }
.btn:hover { opacity: 0.9; }
</style>
