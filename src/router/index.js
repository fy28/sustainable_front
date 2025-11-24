import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/Login.vue'
import MainLayout from "../layouts/MainLayout.vue"
import HomePage from '../views/HomePage.vue'
import NewExpedition from '../views/NewExpedition.vue'
import ExpeditionList from '../views/List.vue' // ton ancienne "Liste des documents"

const routes = [
  // Page de login (hors layout principal)
  { path: '/', name: 'Login', component: LoginPage },

  // Routes avec le layout principal
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '/home', name: 'Home', component: HomePage },
      { path: '/new-expedition/:clientId/:clientName', name: 'NewExpedition', component: NewExpedition, props: true },
      { path: '/list', name: 'ExpeditionList', component: ExpeditionList },

      // 🔹 Nouvelle page : liste des expéditions sauvegardées
      { path: '/expeditions', name: 'ExpeditionsList', component: () => import('../views/ExpeditionsList.vue') },

      // 🔹 Détail d'une expédition spécifique
      { path: '/expeditions/:id', name: 'ExpeditionDetail', component: () => import('../views/ExpeditionDetail.vue'), props: true },
      { path: "/products/add", name: "AddProduct", component: () => import("../views/AddProduct.vue") },
      { path: "/products", name: "ProductList", component: () => import("../views/ProductList.vue") },
      { path: "/stats", name: "StatsExpedition", component: () => import("../views/StatsExpedition.vue") },
      { path: '/notifications', name: 'ExpeditionNotifications', component: () => import('@/views/Notifications.vue') },
      { path: '/collecteurs/add', name: 'CollecteurAdd', component: () => import('@/views/CollecteurAdd.vue') },
{ path: '/collecteurs', name: 'CollecteurList', component: () => import('@/views/CollecteurList.vue') },
{ path: '/collecteurs/suivi', name: 'CollecteurSuivi', component: () => import('@/views/CollecteurSuivi.vue') },
{
  path: '/clients',
  name: 'ClientsList',
  component: () => import('@/views/ClientsList.vue')
},

{
  path: '/collecte/add',
  name: 'CollecteAdd',
  component: () => import('@/views/CollecteAdd.vue')
},
{
  path: '/collecte',
  name: 'CollecteList',
  component: () => import('@/views/CollecteList.vue')
},
{
  path: '/collecte/livraison',
  name: 'CollecteLivraison',
  component: () => import('@/views/CollecteLivraison.vue')
},
{
  path: '/collecte/paiements',
  name: 'CollectePaiements',
  component: () => import('@/views/CollectePaiements.vue')
},
{
  path: '/collecte/statistiques',
  name: 'CollecteStats',
  component: () => import('@/views/CollecteStats.vue')
},
{
  path: '/collecte/detail/:id',
  name: 'CollecteDetail',
  component: () => import('@/views/CollecteDetail.vue'),
  props: true
},
{ path: '/manuel', name: 'ManuelPage', component: () => import('../views/Manuel.vue') },
//{ path: '/ai', name: 'AI', component: () => import('../views/AI.vue') }, 
// optionnel pour la suite

{
  path: "/users/add",
  name: "UserAdd",
  component: () => import("../views/UserAdd.vue"),
},

{
  path: "/users",
  name: "UsersList",
  component: () => import("../views/UsersList.vue"),
},
{
  path: "/users/:id",
  name: "UserDetails",
  component: () => import("../views/UserDetails.vue"),
  props: true,
},
{
  path: "/collecteurs/edit/:id",
  name: "CollecteurEdit",
  component: () => import("@/views/CollecteurEdit.vue"),
  props: true,
},

{
  path: "/collecte/edit/:id",
  name: "CollecteEdit",
  component: () => import("../views/CollecteEdit.vue"),
},




    ]
  },

  // 🔹 404 simple (facultatif mais utile)
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: { template: '<h2>Page non trouvée</h2>' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

// import { createRouter, createWebHistory } from 'vue-router'
// import LoginPage from '../views/Login.vue'
// import MainLayout from "../layouts/MainLayout.vue";
// import HomePage from '../views/HomePage.vue'
// import NewExpedition from '../views/NewExpedition.vue'
// import ExpeditionList from '../views/List.vue'   // <-- AJOUT

// const routes = [
//   { path: '/', name: 'Login', component: LoginPage },
//   {
//     path: "/",
//     component: MainLayout,   // Layout global
//     children: [
//       { path: '/home', name: 'Home', component: HomePage },
//       { path: '/new-expedition/:clientId/:clientName', name: 'NewExpedition', component: NewExpedition, props: true },
//       { path: '/list', name: 'ExpeditionList', component: ExpeditionList },
//       {path: "/expeditions", name: "ExpeditionsList", component: () => import("../views/ExpeditionsList.vue") },
// { path: "/expeditions/:id", name: "ExpeditionDetail", component: () => import("../views/ExpeditionDetail.vue"), props: true }
//     ]
//   }
// ]

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// })

// export default router


//taloha1

// import { createRouter, createWebHistory } from 'vue-router'
// import LoginPage from '../views/Login.vue'

// const routes = [
//   { path: '/', name: 'Login', component: LoginPage }
// ]

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes
// })

// export default router



// const routes = [
//   { 
//     path: '/new-expedition/:clientId/:clientName',
//     name: 'NewExpedition',
//     component: NewExpedition,
//     props: true
//   }
// ]


// { 
//   path: '/new-expedition/:clientId/:clientName',
//   name: 'NewExpedition',
//   component: NewExpedition,
//   props: true   // ✅ injecte les params comme props
// }
