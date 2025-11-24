<template>
  <div v-if="show" class="modal-overlay">
    <div class="custom-modal">
      <h3>✏️ Modifier le produit</h3>

      <div class="form">
        <label>Nom :</label>
        <input v-model="edited.nom" class="input" />

        <label>Code HS :</label>
        <input v-model="edited.codeHS" class="input" />

        <label>Prix unitaire (MGA) :</label>
        <input v-model.number="edited.prix" type="number" class="input" />

        <label>Unité :</label>
        <select v-model="edited.unite" class="input small">
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="t">tonne</option>
        </select>
      </div>

      <div class="actions">
        <button class="btn cancel" @click="$emit('close')">Annuler</button>
        <button class="btn save" @click="updateProduct">💾 Enregistrer</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditProductModal",
  props: ["show", "product"],
  data() {
    return {
      edited: {},
    };
  },
  watch: {
    product: {
      immediate: true,
      handler(newVal) {
        this.edited = { ...newVal };
      },
    },
  },
  methods: {
    async updateProduct() {
      try {
        await axios.put(`http://localhost:5156/api/produit/${this.edited.idProduit}`, this.edited);
        alert("✅ Produit mis à jour avec succès !");
        this.$emit("updated");
        this.$emit("close");
      } catch (err) {
        console.error("Erreur mise à jour produit :", err);
        alert("❌ Erreur lors de la mise à jour !");
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.custom-modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

h3 {
  text-align: center;
  color: #3c8dbc;
}

.input {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.btn {
  border: none;
  border-radius: 5px;
  color: white;
  padding: 8px 12px;
  cursor: pointer;
  transition: 0.2s;
}
.btn.save {
  background-color: #00a65a;
}
.btn.cancel {
  background-color: #d9534f;
}
.btn:hover {
  opacity: 0.85;
}
</style>
