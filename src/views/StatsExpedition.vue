<template>
  <div class="stats-container">
    <h1> Statistiques des expéditions</h1>

    <!-- 🔹 Sélecteur d'année -->
    <div class="filter-bar">
      <label for="yearSelect">Choisir une année :</label>
      <select id="yearSelect" v-model="selectedYear" @change="updateChart">
        <option value="">Toutes les années</option>
        <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
      </select>
    </div>

    <!-- 🔹 Graphique -->
    <div v-if="chartData">
      <Bar :data="chartData" :options="chartOptions" />
    </div>

    <div v-else class="empty">
      <p>Aucune donnée d'expédition trouvée </p>
    </div>
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

export default {
  name: "StatsExpedition",
  components: { Bar },
  data() {
    return {
      expeditions: [],
      selectedYear: "",
      chartData: null,
      chartOptions: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          title: {
            display: true,
            text: "Quantités expédiées par mois et par produit",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Quantité totale" },
          },
          x: {
            title: { display: true, text: "Mois" },
          },
        },
      },
    };
  },
  computed: {
    availableYears() {
      const years = this.expeditions
        .map((e) => new Date(e.deliveryDate).getFullYear())
        .filter((y) => !isNaN(y));
      return [...new Set(years)].sort((a, b) => b - a);
    },
  },
  created() {
    const data = JSON.parse(localStorage.getItem("expedition") || "[]");
    this.expeditions = data;
    this.updateChart();
  },
  methods: {
    updateChart() {
      if (!this.expeditions || this.expeditions.length === 0) {
        this.chartData = null;
        return;
      }

      // Mois abrégés (index 0 = Janvier)
      const months = [
        "Janv", "Févr", "Mars", "Avr", "Mai", "Juin",
        "Juil", "Août", "Sept", "Oct", "Nov", "Déc"
      ];

      // 🔹 Filtrage par année si sélectionnée
      const filtered = this.selectedYear
        ? this.expeditions.filter(
            (e) => new Date(e.deliveryDate).getFullYear() === Number(this.selectedYear)
          )
        : this.expeditions;

      // 🔹 Liste unique des produits
      const products = [...new Set(filtered.map((e) => e.product))];

      // 🔹 Regrouper les quantités par produit et mois
      const groupedData = products.map((product) => {
        const monthlyQuantities = Array(12).fill(0);

        filtered
          .filter((e) => e.product === product)
          .forEach((e) => {
            const d = new Date(e.deliveryDate);
            const month = d.getMonth();
            const qty = parseFloat(e.quantity) || 0;
            monthlyQuantities[month] += qty;
          });

        return {
          label: product,
          data: monthlyQuantities,
          backgroundColor: this.randomColor(),
        };
      });

      // 🔹 Construction du graphique
      this.chartData = {
        labels: months,
        datasets: groupedData,
      };
    },

    // Génère des couleurs aléatoires (une par produit)
    randomColor() {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      return `rgba(${r}, ${g}, ${b}, 0.7)`;
    },
  },
};
</script>

<style scoped>
.stats-container {
  background: #f4f6f9;
  border-radius: 10px;
  padding: 25px;
  max-width: 900px;
  margin: auto;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.filter-bar {
  margin-bottom: 25px;
}

select {
  padding: 6px 10px;
  margin-left: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.empty {
  color: #999;
  font-style: italic;
  margin-top: 30px;
}
</style>
