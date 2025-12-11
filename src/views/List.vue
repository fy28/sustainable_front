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
              <a
                v-else
                :href="item.file"
                target="_blank"
                rel="noopener noreferrer"
                class="badge provided"
              >
                Aperçu
              </a>
            </td>

            <td>
              <button class="btn small info" @click="triggerFileInput(index)">
                Importer
              </button>
              <input
                type="file"
                ref="fileInputs"
                style="display: none"
                accept=".pdf,.jpg,.jpeg,.png"
                @change="handleFileUpload($event, index)"
              />
              <button class="btn small danger" @click="deleteDocument(index)">
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="add-doc">
        <button class="btn add" @click="showModal = true">➕ Ajouter un document</button>
      </div>
    </div>

    <div v-else class="empty">
      <p>Aucune donnée reçue depuis Nouvelle expédition </p>
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
          <option v-for="p in productList" :key="p" :value="p">{{ p }}</option>
        </select>

        <div class="modal-actions">
          <button class="btn" @click="showModal = false">Annuler</button>
          <button class="btn success" @click="confirmAddDocument">OK</button>
        </div>
      </div>
    </div>

    <!--  Popup envoi mail -->
    <div v-if="showMailPopup" class="modal-overlay">
      <div class="custom-modal large">
        <h3> Envoi de mail au client</h3>

        <p><b>Client :</b> {{ clientName }}</p>
        <p>
          <b>Email :</b>
          <span v-if="mailLoading">Chargement...</span>
          <span v-else>{{ clientMail }}</span>
        </p>

        <h4>📎 Pièces jointes :</h4>
        <ul>
          <li v-for="(item, index) in globalList.filter(i => i.file)" :key="index">
            {{ item.doc }} — {{ item.product }} ({{ item.country }})
          </li>
          <li v-if="globalList.filter(i => i.file).length === 0" style="color:#999;">
            Aucune pièce jointe pour l’instant
          </li>
        </ul>

        <h4> Exemple d’email :</h4>
        <textarea
          class="input textarea"
          rows="8"
          readonly
          :value="mailPreview"
        ></textarea>

        <div class="modal-actions">
          <button class="btn" @click="showMailPopup = false">Fermer</button>
          <button class="btn success" @click="simulateSend">Simuler envoi </button>
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
    };
  },
  computed: {
    productList() {
      return [...new Set(this.expedition.map((e) => e.product))];
    },
    mailPreview() {
      const docs = this.globalList
        .map(i => `- ${i.doc} (${i.product} - ${i.country})`)
        .join('\n');

      return `Bonjour ${this.clientName},

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
      this.clientName = first.clientName || this.$route.params.clientName || "Client inconnu";

      // Regroupement par produit + unité + pays
      const grouped = this.expedition.reduce((acc, exp) => {
        const product = exp.product || "Produit inconnu";
        const unit = exp.unit || "kg";
        const country = exp.country || "pays inconnu";
        const qty = parseFloat(exp.quantity) || 0;
        const key = `${product}|${unit}|${country}`;
        acc[key] = (acc[key] || 0) + qty;
        return acc;
      }, {});

      // 🔹 Format lisible
      const formatted = Object.entries(grouped)
        .map(([key, qty]) => {
          const [product, unit, country] = key.split("|");
          return `${qty} ${unit}${qty > 1 ? "s" : ""} de ${product} (${country})`;
        })
        .join(" + ");

      this.totalQuantity = formatted;
      this.unit = first.unit || "";
    }

    // Construction de la liste globale
    this.globalList = this.expedition.flatMap((exp) =>
      exp.documents.map((doc) => ({
        product: exp.product,
        country: exp.country,
        doc: doc,
        deliveryDate: exp.deliveryDate,
        file: null,
      }))
    );
  },
  methods: {
    formatDate(date) {
      if (!date) return "—";
      const d = new Date(date);
      return d.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  confirmExpedition() {
  const all = JSON.parse(localStorage.getItem("expeditions_all") || "[]");

  // Détail complet des produits
  const produitsDetails = this.expedition.map(exp => ({
    produit: exp.product,
    pays: exp.country,
    quantite: exp.quantity,
    unite: exp.unit,
    dateLivraison: exp.deliveryDate,
  }));

  // Enregistrement global
  all.push({
    client: this.clientName,
    dateLivraison: new Date().toISOString(), // date d’enregistrement globale
    produits: [...new Set(this.expedition.map(e => e.product))],
    produitsDetails,
    documents: this.globalList.map(d => d.doc),
  });

  localStorage.setItem("expeditions_all", JSON.stringify(all));

  alert(" Expédition enregistrée !");
  this.$router.push({ name: "ExpeditionsList" });
},


    //  Récupération adress mail
  async fetchClientMail() {
  this.mailLoading = true;
  this.clientMail = "Recherche en cours...";

  try {
    const url = `http://localhost:5156/api/Client/search?q=${encodeURIComponent(this.clientName.trim())}`;
    console.log("📡 Requête vers :", url);

    const res = await fetch(url);
    console.log("📨 Statut HTTP :", res.status);

    if (!res.ok) throw new Error(`Réponse HTTP ${res.status}`);

    const clients = await res.json();
    console.log("📦 Données reçues :", clients);

    if (!Array.isArray(clients) || clients.length === 0) {
      this.clientMail = "Aucun client trouvé pour ce nom";
      return;
    }

    // Match plus souple
    const found = clients.find(c =>
      c.nomClient?.trim().toLowerCase().includes(this.clientName.trim().toLowerCase())
    );

    if (found) {
      this.clientMail = found.mail || "Mail non renseigné";
      console.log(" Client trouvé :", found);
    } else {
      this.clientMail = "Client trouvé mais sans correspondance exacte";
    }

  } catch (err) {
    console.error(" Erreur lors du fetch mail :", err);
    this.clientMail = "Erreur lors de la récupération (voir console)";
  } finally {
    this.mailLoading = false;
  }
},

  async sendEmail() {
  await this.fetchClientMail();

  if (!this.clientMail || this.clientMail.includes("Aucun") || this.clientMail.includes("Erreur")) {
    alert("Impossible de récupérer l'adresse email du client.");
    return;
  }

  // Préparer la liste des pièces jointes fournies
  const attachments = this.globalList
    .filter(i => i.file) // seulement les documents fournis
    .map(i => ({
      file: i.file,
      fileName: i.fileName
    }));

  const formData = new FormData();
  formData.append("To", this.clientMail);
  formData.append("Subject", `Documents expédition - ${this.clientName}`);
  formData.append("Body", this.mailPreview);

  // 🔥 Télécharger les fichiers et les envoyer au backend
  for (const att of attachments) {
    const response = await fetch(att.file);
    const blob = await response.blob();
    formData.append("Attachments", blob, att.fileName);
  }

  try {
    const res = await fetch("http://localhost:5156/api/email/send", {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("Erreur serveur");

    alert("📨 Email envoyé avec succès !");
  } catch (err) {
    console.error(err);
    alert("❌ Erreur lors de l’envoi de l’email.");
  }
},

   simulateSend() {
  alert("Mode simulation désactivé — utilisez Envoyer au client.");
},

    triggerFileInput(index) {
      this.$refs.fileInputs[index].click();
    },
    handleFileUpload(event, index) {
      const file = event.target.files[0];
      if (!file) return;
      const blobUrl = URL.createObjectURL(file);
      this.globalList[index].file = blobUrl;
      this.globalList[index].fileName = file.name;
    },
    deleteDocument(index) {
      if (confirm("Supprimer ce document ?")) this.globalList.splice(index, 1);
    },
    exportPDF() {
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      pdf.setFontSize(16);
      pdf.text("Liste des documents définitifs", 14, 20);
      pdf.setFontSize(11);
      pdf.text(`Client : ${this.clientName}`, 14, 28);
      pdf.text(`Quantité : ${this.totalQuantity} ${this.unit}`, 14, 34);

      const tableData = this.globalList.map((item, index) => [
        index + 1,
        item.doc,
        item.product,
        item.country,
        this.formatDate(item.deliveryDate),
        item.file ? "Fourni" : "Non fourni",
      ]);

      autoTable(pdf, {
        startY: 40,
        head: [["#", "Document", "Produit", "Pays", "Livraison", "Statut"]],
        body: tableData,
        theme: "grid",
        styles: { halign: "center", valign: "middle", fontSize: 9 },
        headStyles: { fillColor: [60, 141, 188], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      pdf.save("expedition-documents.pdf");
    },

    confirmAddDocument() {
      if (!this.newDocName || !this.selectedProduct) {
        alert("Veuillez remplir tous les champs !");
        return;
      }

      if (
        confirm(
          "Souhaitez-vous ajouter ce document pour TOUTES les expéditions à venir ?\nCliquez sur Annuler pour l’ajouter seulement à celle-ci."
        )
      ) {
        alert(" Ce document sera ajouté pour les futures expéditions (fonctionnalité à venir).");
      } else {
        const expToUpdate = this.expedition.find((e) => e.product === this.selectedProduct);
        if (expToUpdate) {
          this.globalList.push({
            product: expToUpdate.product,
            country: expToUpdate.country,
            doc: this.newDocName,
            deliveryDate: expToUpdate.deliveryDate,
            file: null,
          });
        }
      }

      this.newDocName = "";
      this.selectedProduct = "";
      this.showModal = false;
    },
  },
};
</script>

<style scoped>
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
.badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-weight: 500; color: white; }
.badge.provided { background-color: #00a65a; }
.badge.missing { background-color: #dd4b39; }
.actions { display: flex; justify-content: center; gap: 10px; margin-top: 15px; }
.btn { padding: 7px 13px; border: none; border-radius: 5px; cursor: pointer; font-weight: 500; color: white; transition: 0.2s; }
.btn.success { background-color: #00a65a; }
.btn.info { background-color: #3c8dbc; }
.btn.pdf { background-color: #605ca8; }
.btn.danger { background-color: #d9534f; }
.btn.add { background-color: #558ad5; }
.btn:hover { opacity: 0.9; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 10000; }
.custom-modal { background: white; padding: 20px; border-radius: 10px; width: 380px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
.custom-modal.large { width: 550px; max-height: 85vh; overflow-y: auto; }
.input { width: 100%; margin: 8px 0 15px 0; padding: 8px; border: 1px solid #ccc; border-radius: 6px; }
.textarea { font-family: monospace; background-color: #f7f7f7; resize: none; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
</style>