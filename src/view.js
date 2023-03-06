import Chart from "../node_modules/chart.js/auto";

class renderedData {
  myChartContainer = document.getElementById("stock-chart");
  companyName = document.querySelector(".company-name");
  companySymbol = document.querySelector(".company-symbol");
  companyCurrency = document.querySelector(".company-currency");
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
  searchField = document.querySelector(".search-input");

  highStat = document.querySelector(".key-stat-high");
  lowStat = document.querySelector(".key-stat-low");
  volumeStat = document.querySelector(".key-stat-volume");
  avgVolumeStat = document.querySelector(".avg-volume-stat");
  marketCapStat = document.querySelector(".market-cap-stat");
  divYieldStat = document.querySelector(".div-yield-stat");
  cdpScoreStat = document.querySelector(".cdp-score-stat");
  companyAbout = document.querySelector(".company-about_container");
  companyAboutTitle = document.querySelector(".company-about_title");
  companyNews = document.querySelector(".company-news_container");
  stockListContainer = document.querySelector(".stock-list");
  stockChart;

  constructor() {}
  renderChart(obj) {
    if (this.stockChart) {
      this.stockChart.destroy();
      this.stockChart;
    }

    this.myChartContainer.style.backgroundColor = "#222842";

    Chart.defaults.elements.point.pointStyle = false;
    Chart.defaults.borderColor = "#222842";
    Chart.defaults.color = "#ced1d7";

    this.stockChart = new Chart(this.myChartContainer, {
      type: "line",
      data: {
        labels: obj.xAxis,
        datasets: [
          {
            label: "",
            data: obj.yAxis,
            backgroundColor: "",
            borderColor: "#ced1d7",
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
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

    if (obj.currency) {
      this.companyCurrency.innerHTML = `&#xb7;&nbsp;&nbsp;&nbsp;${obj.currency}`;
    }

    this.currentPrice.textContent = `${parseFloat(obj.currentPrice)
      .toFixed(2)
      .toLocaleString()}`;

    if (Number(obj.change) < 0) {
      this.changePer.textContent = `${parseFloat(obj.changePercent).toFixed(
        2
      )}%`;
      this.changePer.style.color = "#fd4949";
    } else {
      this.changePer.textContent = `+ ${parseFloat(obj.changePercent).toFixed(
        2
      )}%`;
      this.changePer.style.color = "#1ca1c0";
    }
  }
  updateHeaderStats(obj) {
    this.highStat.textContent = `${obj.high}`;
    this.lowStat.textContent = `${obj.low}`;
    this.volumeStat.textContent = `${obj.volume.toLocaleString()}`;
  }
  updateStats(obj) {
    this.avgVolumeStat.textContent = `${obj.averageVolume.toLocaleString()}`;
    this.marketCapStat.textContent = `${obj.marketCap.toLocaleString()}`;
    this.divYieldStat.textContent = `${obj.dividendYield}`;
    this.cdpScoreStat.textContent = `${obj.cdpScore}`;
  }
  updateCompanyDesc(obj) {
    // clear current desc html
    this.companyAbout.innerHTML = "";

    if (obj.description) {
      const html = `
      <h1 class="company-about_title font">About</h1>
      <p class="company-about_content font">&nbsp;&nbsp;&nbsp;&nbsp;${obj.description}</p>
      `;

      this.companyAbout.insertAdjacentHTML("beforeend", html);
    } else {
      this.companyAbout.style.display = "none";
    }

    if (obj.ceo && obj.country) {
      const html2 = `
        <div class="company-about_details flex">
          <div class="font detail flex">
            <p>CEO&nbsp;</p>
            <h3>${obj.ceo}</h3>
          </div>
          <div class="font detail flex">
            <p>Location&nbsp;</p>
            <h3>${obj.city}, ${obj.country}</h3>
          </div>
        </div>`;

      this.companyAbout.insertAdjacentHTML("beforeend", html2);
    }

    // this.companyAboutTitle.textContent = `About ${obj.title}`;
  }
  updateCompanyNews(newsObj) {
    // clear current news html
    this.companyNews.innerHTML = "";

    // update company news with new html
    let i = 0;

    while (i < 6) {
      const html = `
      <a href="${newsObj[i].article_url}" class="company-news_link" target="_blank">
        <div class="company-news_content grid font">
          <img src="${newsObj[i].article_photo_url}" alt="" class="company-news_img">
          <div class="company-news">
            <p>${newsObj[i].source}</p>
            <h3>${newsObj[i].article_title}</h3>
          </div>
        </div>
        </a>`;
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
        this.stockChart;
        await obj.updateAxis(e.target.classList[0], e.target.id);
        obj.parseMovementsByTime(e.target.classList[0], obj.currentMonth);
        obj.renderChart();
      });
    });
  }
  findNewStock(func) {
    this.searchField.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        const searchFieldValue = document.querySelector(".search-input").value;

        func("now_button", "5D", searchFieldValue);
        this.stockChart.destroy();
        this.stockChart;

        this.searchField.value = "";
      }
    });
  }
  displayMostActive(arr) {
    arr.reverse();

    let i = -10;

    while (i < 0) {
      const html = `
      <li class="stock-list_item flex">
        <div>
        ${arr.at(i).symbol}
        </div>
        <div>
        ${parseFloat(arr.at(i).regularMarketChangePercent).toFixed(2)}%
        </div>
      </li>
    `;
      this.stockListContainer.insertAdjacentHTML("afterbegin", html);
      i++;
    }
  }
}

export default new renderedData();
