import Chart from "../node_modules/chart.js/auto";

class renderedData {
  myChartContainer = document.getElementById("stock-chart");
  companyName = document.querySelector(".company-name");
  companySymbol = document.querySelector(".company-symbol");
  nowButton = document.querySelector(".now_button");
  weekButton = document.querySelector(".week_button");
  monthButton = document.querySelector(".month_button");
  threeMonthButton = document.querySelector(".three-month_button");
  sixMonthButton = document.querySelector(".six-month_button");
  ytdButton = document.querySelector(".ytd_button");
  stockChart;

  constructor() {}
  renderChart(obj) {
    this.myChartContainer.style.backgroundColor = "#4484ce";

    Chart.defaults.elements.point.pointStyle = false;
    Chart.defaults.borderColor = "#4484ce";
    Chart.defaults.color = "#f9f9f9";

    this.stockChart = new Chart(this.myChartContainer, {
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
  changeTimeSeries(func) {
    const buttonsArr = [
      this.nowButton,
      this.weekButton,
      this.monthButton,
      this.threeMonthButton,
      this.sixMonthButton,
      this.ytdButton,
    ];

    const newArr = buttonsArr.map((button) => {
      button.addEventListener("click", (e) => {
        console.log(e.target.id);
        this.stockChart.destroy();
        func(e.target.className, e.target.id);
      });
    });
  }
}

export default new renderedData();
