<template>
  <div class="list-container">
    <h1> Liste des documents définitifs</h1>

    <div v-if="expedition.length > 0">
      <div class="client-summary">
        <h3>Informations générales</h3>
        <p>
          <b>Client :</b> <span>{{ clientName }}</span><br />
          <b>Quantité totale :</b> <span>{{ totalQuantity }}</span>
          <span>{{ unit }}</span>
        </p>
      </div>

      <div class="summary">
        <h3>Résumé des expéditions</h3>
        <ul>
          <li v-for="(exp, index) in expedition" :key="index">
            <b>{{ exp.product }}</b> → {{ exp.country }},
            livraison prévue le
            <span class="date">{{ formatDate(exp.deliveryDate) }}</span>
          </li>
        </ul>
      </div>

      <table class="doc-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Document</th>
            <th>Produit</th>
            <th>Pays</th>
            <th>Date livraison</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in globalList" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.doc }}</td>
            <td class="capitalize">{{ item.product }}</td>
            <td class="capitalize">{{ item.country }}</td>
            <td>{{ formatDate(item.deliveryDate) }}</td>

            <td>
              <span v-if="!item.file" class="badge missing">Non fourni</span>
              <a v-else :href="item.file" target="_blank" class="badge provided">
                Aperçu
              </a>
            </td>

            <td>
              <button class="btn small info" @click="triggerFileInput(index)">Importer</button>
              <input
                type="file"
                ref="fileInputs"
                style="display:none"
                accept=".pdf,.jpg,.jpeg,.png"
                @change="handleFileUpload($event, index)"
              />
              <button class="btn small danger" @click="deleteDocument(index)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="add-doc">
        <button class="btn add" @click="showModal = true">➕ Ajouter un document</button>
      </div>
    </div>

    <div v-else class="empty">
      <p>Aucune donnée reçue depuis Nouvelle expédition</p>
    </div>

    <div class="actions">
      <button class="btn success" @click="confirmExpedition"> Enregistrer</button>
      <button class="btn info" @click="sendEmail"> Envoyer au client</button>
      <button class="btn pdf" @click="exportPDF"> Exporter en PDF</button>
    </div>

    <!-- Popup ajout document -->
    <div v-if="showModal" class="modal-overlay">
      <div class="custom-modal">
        <h3>Ajouter un document</h3>

        <label>Nom du document :</label>
        <input v-model="newDocName" placeholder="Ex : Certificat d’origine" class="input" />

        <label>Produit concerné :</label>
        <select v-model="selectedProduct" class="input">
          <option disabled value="">-- Choisir un produit --</option>
          <option v-for="p in productList" :key="p">{{ p }}</option>
        </select>

        <div class="modal-actions">
          <button class="btn" @click="showModal = false">Annuler</button>
          <button class="btn success" @click="confirmAddDocument">OK</button>
        </div>
      </div>
    </div>

    <!-- POPUP EMAIL -->
    <div v-if="showMailPopup" class="modal-overlay">
      <div class="custom-modal large">
        <h3> Envoi de mail au client</h3>

        <p><b>Client :</b> {{ clientName }}</p>
        <p><b>Email :</b> {{ clientMail }}</p>

        <h4>📎 Pièces jointes sélectionnées :</h4>
        <ul>
          <li v-for="(att, idx) in attachmentsToSend" :key="idx">
            {{ att.fileName }}
            <button class="btn small danger" @click="removeAttachment(idx)">Retirer</button>
          </li>

          <li v-if="attachmentsToSend.length === 0" style="color:#999;">
            Aucune pièce jointe sélectionnée
          </li>
        </ul>

        <h4>✏️ Modifier l'email :</h4>
        <textarea
          v-model="emailBody"
          class="input textarea"
          rows="10"
        ></textarea>

        <div class="modal-actions">
          <button class="btn" @click="showMailPopup = false">Fermer</button>
          <button class="btn success" @click="confirmSendEmail">Envoyer</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default {
  name: "ExpeditionList",

  data() {
    return {
      expedition: [],
      globalList: [],
      showModal: false,
      newDocName: "",
      selectedProduct: "",
      clientName: "",
      totalQuantity: "",
      unit: "",
      showMailPopup: false,
      clientMail: "",
      mailLoading: false,

      // NEW
      emailBody: "",
      attachmentsToSend: [],
    };
  },

  computed: {
    productList() {
      return [...new Set(this.expedition.map(e => e.product))];
    },

    mailPreview() {
      const docs = this.globalList
        .map(i => `- ${i.doc} (${i.product} - ${i.country})`)
        .join("\n");

      return `Bonjour Mr/Mme ${this.clientName},

Veuillez trouver ci-joint les documents relatifs à votre expédition :
${docs}

Quantité totale : ${this.totalQuantity}

Cordialement,
L’équipe Mada Market Export`;
    }
  },

  created() {
    const saved = localStorage.getItem("expedition");
    this.expedition = saved ? JSON.parse(saved) : [];

    if (this.expedition.length > 0) {
      const first = this.expedition[0];
      this.clientName = first.clientName;

      const grouped = this.expedition.reduce((acc, exp) => {
        const key = `${exp.product}|${exp.unit}|${exp.country}`;
        acc[key] = (acc[key] || 0) + parseFloat(exp.quantity);
        return acc;
      }, {});

      this.totalQuantity = Object.entries(grouped)
        .map(([key, qty]) => {
          const [product, unit, country] = key.split("|");
          return `${qty} ${unit}${qty > 1 ? "s" : ""} de ${product} (${country})`;
        })
        .join(" + ");
    }

    this.globalList = this.expedition.flatMap(exp =>
      exp.documents.map(doc => ({
        product: exp.product,
        country: exp.country,
        doc,
        deliveryDate: exp.deliveryDate,
        file: null,
      }))
    );
  },

  methods: {
    formatDate(date) {
      if (!date) return "—";
      return new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },

    // CONFIRM EXPEDITION
    confirmExpedition() {
      const all = JSON.parse(localStorage.getItem("expeditions_all") || "[]");

      const produitsDetails = this.expedition.map(exp => ({
        produit: exp.product,
        pays: exp.country,
        quantite: exp.quantity,
        unite: exp.unit,
        dateLivraison: exp.deliveryDate,
      }));

      all.push({
        client: this.clientName,
        dateLivraison: new Date().toISOString(),
        produits: [...new Set(this.expedition.map(e => e.product))],
        produitsDetails,
        documents: this.globalList.map(d => d.doc),
      });

      localStorage.setItem("expeditions_all", JSON.stringify(all));

      alert("Expédition enregistrée !");
      this.$router.push({ name: "ExpeditionsList" });
    },

    // FETCH CLIENT MAIL
    async fetchClientMail() {
      this.mailLoading = true;

      try {
        const res = await fetch(`http://localhost:5156/api/Client/search?q=${this.clientName}`);
        const clients = await res.json();

        const found = clients.find(c =>
          c.nomClient.toLowerCase().includes(this.clientName.toLowerCase())
        );

        this.clientMail = found?.mail || "Mail non renseigné";
      } catch {
        this.clientMail = "Erreur";
      }

      this.mailLoading = false;
    },

    // OPEN EMAIL POPUP
    async sendEmail() {
      await this.fetchClientMail();

      this.attachmentsToSend = this.globalList
        .filter(i => i.file)
        .map(i => ({
          file: i.file,
          fileName: i.fileName
        }));

      this.emailBody = this.mailPreview;

      this.showMailPopup = true;
    },

    // REMOVE ATTACHMENT
    removeAttachment(idx) {
      this.attachmentsToSend.splice(idx, 1);
    },

    // SEND EMAIL
    async confirmSendEmail() {
      if (!this.clientMail.includes("@")) {
        alert("Adresse mail invalide.");
        return;
      }

      const formData = new FormData();
      formData.append("To", this.clientMail);
      formData.append("Subject", `Documents expédition - ${this.clientName}`);
      formData.append("Body", this.emailBody);

      for (const att of this.attachmentsToSend) {
        const response = await fetch(att.file);
        const blob = await response.blob();
        formData.append("Attachments", blob, att.fileName);
      }

      try {
        const res = await fetch("http://localhost:5156/api/email/send", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error();

        alert("📨 Email envoyé !");
        this.showMailPopup = false;
      } catch {
        alert("Erreur lors de l'envoi.");
      }
    },

    triggerFileInput(index) {
      this.$refs.fileInputs[index].click();
    },

    handleFileUpload(event, index) {
      const file = event.target.files[0];
      if (!file) return;

      this.globalList[index].file = URL.createObjectURL(file);
      this.globalList[index].fileName = file.name;
    },

    deleteDocument(index) {
      if (confirm("Supprimer ?")) this.globalList.splice(index, 1);
    },

    exportPDF() {
      const pdf = new jsPDF();

      pdf.setFontSize(16);
      pdf.text("Liste des documents définitifs", 14, 20);

      const rows = this.globalList.map((item, i) => [
        i + 1,
        item.doc,
        item.product,
        item.country,
        this.formatDate(item.deliveryDate),
        item.file ? "✔" : "—"
      ]);

      autoTable(pdf, {
        head: [["#", "Document", "Produit", "Pays", "Livraison", "Statut"]],
        body: rows,
        startY: 30,
      });

      pdf.save("expedition-documents.pdf");
    },

    confirmAddDocument() {
      if (!this.newDocName || !this.selectedProduct) {
        alert("Champs obligatoires");
        return;
      }

      const expToUpdate = this.expedition.find(e => e.product === this.selectedProduct);

      if (expToUpdate) {
        this.globalList.push({
          product: expToUpdate.product,
          country: expToUpdate.country,
          doc: this.newDocName,
          deliveryDate: expToUpdate.deliveryDate,
          file: null,
        });
      }

      this.newDocName = "";
      this.selectedProduct = "";
      this.showModal = false;
    }
  }
};
</script>

<style scoped>
/* styles identiques, je n’ai rien modifié */
.list-container {
  padding: 20px;
  background-color: #f4f6f9;
  border-radius: 8px;
  max-width: 1050px;
  margin: auto;
}
h1 { text-align: center; margin-bottom: 15px; color: #2c3e50; }
.client-summary { background: #fff; padding: 15px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-bottom: 15px; }
.client-summary h3 { color: #00a65a; margin-bottom: 8px; }
.client-summary span { color: #3c8dbc; font-weight: 500; }
.summary { background: white; padding: 15px; border-radius: 10px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.summary h3 { color: #3c8dbc; }
.doc-table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.doc-table th, .doc-table td { padding: 8px; border: 1px solid #ddd; text-align: center; }
.doc-table th { background-color: #3c8dbc; color: white; }
.badge { padding: 4px 10px; border-radius: 12px; color: white; }
.badge.provided { background-color: #00a65a; }
.badge.missing { background-color: #dd4b39; }
.actions { display: flex; justify-content: center; gap: 10px; margin-top: 15px; }
.btn { padding: 7px 13px; border-radius: 5px; cursor: pointer; color: white; }
.btn.success { background-color: #00a65a; }
.btn.info { background-color: #3c8dbc; }
.btn.pdf { background-color: #605ca8; }
.btn.danger { background-color: #d9534f; }
.btn.add { background-color: #558ad5; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; }
.custom-modal { background: white; padding: 20px; border-radius: 10px; width: 380px; }
.custom-modal.large { width: 550px; max-height: 90vh; overflow-y: auto; }
.input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 6px; }
.textarea { background-color: #f7f7f7; resize: none; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
</style>
