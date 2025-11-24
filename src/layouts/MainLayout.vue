<template>
  <div class="wrapper">
    <!-- Header -->
    <header class="main-header">
    <router-link to="/home" class="logo">
<span class="logo-mini"><b>MM</b>E</span>

  <span class="logo-lg">
    <img src="/dist/img/logo.png" class="custom-logo-lg" alt="Full Logo">
  </span>
</router-link>


      <nav class="navbar navbar-static-top">
        <div class="navbar-custom-menu">
          <ul class="nav navbar-nav">
            <li class="dropdown notifications-menu">
              <a href="#" class="dropdown-toggle" @click.prevent="goToNotifications">
                <i class="fa fa-bell"></i>
                <span v-if="notifCount > 0" class="label label-warning">{{ notifCount }}</span>
              </a>
            </li>

            <li class="dropdown user user-menu">
              <a href="#" class="dropdown-toggle">
                <img src="/dist/img/user2-160x160.jpg" class="user-image" alt="User Image">
                <span class="hidden-xs">{{ user?.userName }}</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>

    <!-- Sidebar -->
    <aside class="main-sidebar">
      <section class="sidebar">
        <div class="user-panel">
          <div class="pull-left image">
            <img src="/dist/img/user2-160x160.jpg" class="img-circle" alt="User">
          </div>
          <div class="pull-left info">
            <p>{{ user?.userName }}</p>
            <a href="#"><i class="fa fa-circle text-success"></i> Online</a>
          </div>
        </div>

        <ul class="sidebar-menu">
          <li class="header">MAIN NAVIGATION</li>

          <li>
            <router-link to="/home"><i class="fa fa-dashboard"></i> <span>Dashboard</span></router-link>
          </li>

          <!-- ✅ EXPÉDITION -->
          <li class="treeview">
            <a href="#">
              <i class="fa fa-plus"></i> <span>Expédition</span>
              <span class="pull-right-container">
                <i class="fa fa-angle-left pull-right"></i>
              </span>
            </a>
            <ul class="treeview-menu">
              <li>
                <a href="#" @click.prevent="showClientPopup = true">
                  <i class="fa fa-circle-o"></i> Nouvelle expédition
                </a>
              </li>
              <li><router-link to="/expeditions"><i class="fa fa-circle-o"></i> Liste des expéditions</router-link></li>
              <li><router-link to="/stats"><i class="fa fa-circle-o"></i> Statistiques</router-link></li>
            </ul>
          </li>

          <!-- ✅ CLIENTS -->
<li class="treeview">
  <a href="#">
    <i class="fa fa-user"></i> <span>Clients</span>
    <span class="pull-right-container">
      <i class="fa fa-angle-left pull-right"></i>
    </span>
  </a>
  <ul class="treeview-menu">
    <li>
      <a href="#" @click.prevent="showNewClientPopup = true">
        <i class="fa fa-circle-o"></i> Nouveau client
      </a>
    </li>
    <li>
      <router-link to="/clients">
        <i class="fa fa-circle-o"></i> Liste des clients
      </router-link>
    </li>
  </ul>
</li>


          <!-- ✅ PRODUITS -->
          <li class="treeview">
            <a href="#">
              <i class="fa fa-cube"></i> <span>Produits</span>
              <span class="pull-right-container">
                <i class="fa fa-angle-left pull-right"></i>
              </span>
            </a>
            <ul class="treeview-menu">
              <li><router-link to="/products/add"><i class="fa fa-circle-o"></i> Ajouter</router-link></li>
              <li><router-link to="/products"><i class="fa fa-circle-o"></i> Liste</router-link></li>
            </ul>
          </li>
          <!-- ✅ COLLECTEURS -->
          <li class="treeview">
            <a href="#">
              <i class="fa fa-id-card-o"></i> <span>Collecteurs</span>
              <span class="pull-right-container">
                <i class="fa fa-angle-left pull-right"></i>
              </span>
            </a>
            <ul class="treeview-menu">
              <li><router-link to="/collecteurs/add"><i class="fa fa-circle-o"></i> Nouveau</router-link></li>
              <li><router-link to="/collecteurs"><i class="fa fa-circle-o"></i> Liste</router-link></li>
              <li><router-link to="/collecteurs/suivi"><i class="fa fa-circle-o"></i> Suivi</router-link></li>
            </ul>
          </li>

          <!--  COLLECTE -->
<li class="treeview">
  <a href="#">
    <i class="fa fa-cogs"></i> <span>Collecte</span>
    <span class="pull-right-container">
      <i class="fa fa-angle-left pull-right"></i>
    </span>
  </a>
  <ul class="treeview-menu">
    <li><router-link to="/collecte/add"><i class="fa fa-circle-o"></i> Nouvelle collecte</router-link></li>
    <li><router-link to="/collecte"><i class="fa fa-circle-o"></i> Liste</router-link></li>
    <li><router-link to="/collecte/livraison"><i class="fa fa-circle-o"></i> Livraison</router-link></li>
    <li><router-link to="/collecte/paiements"><i class="fa fa-circle-o"></i> Paiements associés</router-link></li>
    <li><router-link to="/collecte/statistiques"><i class="fa fa-circle-o"></i> Statistiques</router-link></li>
  </ul>
</li>

         <!-- ✅ UTILISATEURS -->
  <li class="treeview">
    <a href="#">
      <i class="fa fa-users"></i> <span>Utilisateurs</span>
      <span class="pull-right-container">
        <i class="fa fa-angle-left pull-right"></i>
      </span>
    </a>
    <ul class="treeview-menu">
      <li><router-link to="/users/add"><i class="fa fa-circle-o"></i> Nouvel utilisateur</router-link></li>
      <li><router-link to="/users"><i class="fa fa-circle-o"></i> Liste des utilisateurs</router-link></li>
    </ul>
  </li>


        </ul>
      </section>
    </aside>

    <!-- Content -->
    <div class="content-wrapper">
      <section class="content">
        <router-view />
      </section>
    </div>

    <!-- Footer -->
    <footer class="main-footer">
      <div class="pull-right hidden-xs">Version 1.0</div>
      <strong>&copy; 2025 Sustainable App.</strong>
    </footer>

    <!-- Popups globaux -->
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
  name: "MainLayout",
  components: { ChooseClient, NewClientModal },
  data() {
    return {
      user: { userName: "Admin", roleName: "Admin" },
      showClientPopup: false,
      showNewClientPopup: false,
      notifCount: 0, // 🔔 compteur notifications
    };
  },
  created() {
    this.checkNotifications();
  },
  methods: {
    goToNewExpedition(client) {
      this.showClientPopup = false;
      this.$router.push({
        name: "NewExpedition",
        params: { clientId: client.idClient, clientName: client.nomClient },
      });
    },
    onClientCreated(client) {
      console.log("Nouveau client créé :", client);
    },

    checkNotifications() {
  const today = new Date();
  let notifications = [];

  // --- 🔹 Vérifie les EXPÉDITIONS ---
  const expeditions = JSON.parse(localStorage.getItem("expeditions_all") || "[]");
  const expSoon = expeditions.filter((exp) => {
    const dateLiv = new Date(exp.dateLivraison);
    const diffDays = Math.ceil((dateLiv - today) / (1000 * 60 * 60 * 24));

    const missingDocs =
      !exp.documents || exp.documents.length === 0 || exp.documents.includes("Non fourni");

    return diffDays <= 10 && diffDays >= 0 && missingDocs;
  });

  notifications.push(
    ...expSoon.map((exp) => ({
      type: "expedition",
      message: `Expédition de ${exp.client} prévue le ${new Date(exp.dateLivraison).toLocaleDateString("fr-FR")} avec documents manquants.`,
    }))
  );

  // --- 🔹 Vérifie les COLLECTES ---
  const collectes = JSON.parse(localStorage.getItem("collectes") || "[]");

  // 1️⃣ Collectes qui seront livrées dans ≤ 10 jours
  const collecteBientotLivree = collectes.filter((c) => {
    if (!c.dateArrivee) return false;
    const diffDays = Math.ceil((new Date(c.dateArrivee) - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 10 && diffDays >= 0;
  });

  notifications.push(
    ...collecteBientotLivree.map((c) => ({
      type: "collecte",
      message: `Collecte de ${c.produit} par ${c.collecteur} (zone ${c.zone}) prévue le ${new Date(c.dateArrivee).toLocaleDateString("fr-FR")}.`,
    }))
  );

  // Collectes livrées mais non payées
  const collecteNonPayee = collectes.filter(
    (c) => c.statut && c.statut.toLowerCase() === "livré"
  );

  notifications.push(
    ...collecteNonPayee.map((c) => ({
      type: "collecte",
      message: `Collecte de ${c.produit} (livrée) par ${c.collecteur} n’a pas encore été payée.`,
    }))
  );

  // -- Stockage et compteur ---
  this.notifCount = notifications.length;
  localStorage.setItem("notifications", JSON.stringify(notifications));
},


    //  Redirige vers la page Notifications
    goToNotifications() {
      this.$router.push({ name: "ExpeditionNotifications" });
    },
  },
};
</script>

<style>
/* ✅ Style pour la cloche de notifications dans la navbar AdminLTE */
.navbar .fa-bell {
  font-size: 18px;
  position: relative;
  color: #fff;
}

.label.label-warning {
  background-color: #f39c12 !important;
  border-radius: 50%;
  padding: 3px 6px;
  font-size: 11px;
  position: absolute;
  top: 8px;
  right: 8px;
  font-weight: bold;
}

/* Petit effet hover sur la cloche */
.navbar .fa-bell:hover {
  color: #ffd966;
}

.custom-logo-lg {
  height: 40px !important;   /* Diminue ici */
  width: auto !important;    /* Garde le ratio */
  object-fit: contain;
  margin-top: -5px;          /* Ajustement optionnel */
}

</style>
