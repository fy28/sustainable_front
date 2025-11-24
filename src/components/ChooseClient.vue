<template>
  <div v-if="show" class="modal-overlay">
    <div class="custom-modal">
      <h3>Choisissez la société</h3>


      <div class="search-bar">
        <input 
          v-model="search"
          @keyup.enter="searchClients"
          placeholder="Rechercher votre société"
          class="input"
        />
        <button class="btn-search" @click="searchClients">Rechercher</button>
      </div>

     
      <ul class="results">
        <li 
          v-for="client in clients" 
          :key="client.idClient"
          @click="selectClient(client)"
          :class="{ selected: client.idClient === selectedClient?.idClient }"
        >
          {{ client.nomClient }}
        </li>
        <li v-if="clients.length === 0 && search.length >= 2" class="no-result">
          Aucun résultat trouvé
        </li>
      </ul>

      <div class="modal-actions">
        <button class="btn" @click="$emit('close')">Annuler</button>
        <button class="btn btn-new" @click="$emit('new-client')">Nouveau client</button>
        <button class="btn btn-validate" @click="validate" :disabled="!selectedClient">Valider</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ChooseClient",
  props: ["show"],
  data() {
    return {
      search: "",
      clients: [],
      selectedClient: null
    };
  },
  methods: {
    async searchClients() {
      if (this.search.length < 2) {
        this.clients = [];
        return;
      }
      try {
        const res = await axios.get("http://localhost:5156/api/client/search?q=" + this.search);
        this.clients = res.data;
      } catch (err) {
        console.error("Erreur recherche client :", err);
      }
    },
    selectClient(client) {
      this.selectedClient = client;
    },
    validate() {
      if (this.selectedClient) {
        this.$emit("validated", this.selectedClient);
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
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20000 !important; /* au-dessus de tout */
}

/* ✅ Nouveau nom pour éviter le conflit Bootstrap */
.custom-modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 420px;
  z-index: 20001 !important;
  position: relative;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

h3 {
  margin-bottom: 15px;
  font-size: 18px;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.btn-search {
  padding: 8px 12px;
  background: #009688;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}
.btn-search:hover {
  background: #00796b;
}

.results {
  margin: 10px 0;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  border: 1px solid #eee;
  border-radius: 6px;
}
.results li {
  padding: 8px;
  cursor: pointer;
}
.results li:hover,
.results li.selected {
  background: #009688;
  color: white;
}
.no-result {
  padding: 8px;
  color: #777;
  text-align: center;
  font-style: italic;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-new {
  background: #f39c12;
  color: white;
}
.btn-validate {
  background: #009688;
  color: white;
}
.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
