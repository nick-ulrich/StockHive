import Chart from "../node_modules/chart.js/auto";

class renderedData {
  myChartContainer = document.getElementById("stock-chart");
  companyName = document.querySelector(".company-name");
  companySymbol = document.querySelector(".company-symbol");
  currentPrice = document.querySelector(".company-price");
  changePer = document.querySelector(".change-percent");
  nowButton = document.querySelector(".now_button");
  weekButton = document.querySelector(".week_button");
  monthButton = document.querySelector(".month_button");
  threeMonthButton = document.querySelector(".three-month_button");
  sixMonthButton = document.querySelector(".six-month_button");
  ytdButton = document.querySelector(".ytd_button");
  yearButton = document.querySelector(".year_button");
  maxButton = document.querySelector(".max_button");

  highStat = document.querySelector(".key-stat-high");
  lowStat = document.querySelector(".key-stat-low");
  volumeStat = document.querySelector(".key-stat-volume");
  avgVolumeStat = document.querySelector(".avg-volume-stat");
  marketCapStat = document.querySelector(".market-cap-stat");
  divYieldStat = document.querySelector(".div-yield-stat");
  companyAbout = document.querySelector(".company-about_content");
  companyNews = document.querySelector(".company-news_container");
  stockChart;

  constructor() {}
  renderChart(obj) {
    this.myChartContainer.style.backgroundColor = "#f9f9f9";

    Chart.defaults.elements.point.pointStyle = false;
    Chart.defaults.borderColor = "#f9f9f9";
    Chart.defaults.color = "#272727;";

    this.stockChart = new Chart(this.myChartContainer, {
      type: "line",
      data: {
        labels: obj.xAxis,
        datasets: [
          {
            label: "",
            data: obj.yAxis,
            backgroundColor: "",
            borderColor: "#272727;",
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
    this.currentPrice.textContent = `${obj.currentPrice}`;
    this.changePer.textContent = `${obj.changePercent}%`;
  }
  updateHeaderStats(obj) {
    this.highStat.textContent = `${obj.high}`;
    this.lowStat.textContent = `${obj.low}`;
    this.volumeStat.textContent = `${obj.volume}`;
  }
  updateStats(obj) {
    this.avgVolumeStat.textContent = `${obj.averageVolume}`;
    this.marketCapStat.textContent = `${obj.marketCap}`;
    this.divYieldStat.textContent = `${obj.dividendYield}%`;
  }
  updateCompanyDesc(obj) {
    this.companyAbout.textContent = `${obj.description}`;
  }
  updateCompanyNews(newsObj) {
    let i = 0;

    while (i < 6) {
      const html = `
        <div class="flex font">
          <img src="${newsObj[i].article_photo_url}" alt="">
          <div>
            <p>${newsObj[i].source}</p>
            <h3>${newsObj[i].article_title}</h3>
          </div>
        </div>`;
      i++;
      this.companyNews.insertAdjacentHTML("afterbegin", html);
    }
  }
  changeTimeSeries(obj) {
    const buttonsArr = [
      this.nowButton,
      this.weekButton,
      this.monthButton,
      this.threeMonthButton,
      this.sixMonthButton,
      this.ytdButton,
      this.yearButton,
      this.maxButton,
    ];

    const newArr = buttonsArr.map((button) => {
      button.addEventListener("click", async (e) => {
        this.stockChart.destroy();
        await obj.updateAxis(e.target.className, e.target.id);
        obj.parseMovementsByTime(
          e.target.className,
          obj.currentDate,
          obj.currentMonth
        );
        obj.renderChart();
      });
    });
  }
}

export default new renderedData();
