import Chart from "chart.js/auto";

class renderedData {
  myChartContainer = document.getElementById("stock-chart");
  companyName = document.querySelector(".company-name");
  companySymbol = document.querySelector(".company-symbol");

  constructor() {}
  renderChart(obj) {
    this.myChartContainer.style.backgroundColor = "#4484ce";

    Chart.defaults.elements.point.pointStyle = false;
    Chart.defaults.borderColor = "#4484ce";
    Chart.defaults.color = "#f9f9f9";

    new Chart(this.myChartContainer, {
      type: "line",
      data: {
        labels: obj.xAxis,
        datasets: [
          {
            label: "",
            data: obj.yAxis,
            backgroundColor: "#f9f9f9",
            borderColor: "#f9f9f9",
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              font: {
                size: 0,
                font: "Arial",
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });
  }
  updateHeader(obj) {
    this.companyName.textContent = `${obj.title}`;
    this.companySymbol.textContent = `${obj.symbol}`;
  }
}

export default new renderedData();
