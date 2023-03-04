//import { throws } from "assert/strict";
import * as Model from "./model.js";
import view from "./view.js";
// import * as renderChart from "./view.js";
import renderedData from "./view.js";

// store company data in an object to pass to other functions
const companyObj = {
  symbol: "",
  title: "",
  apiTimeFrame: "",
  timeFrameView: "",
  stockMoveArr: [],
  xAxis: "",
  yAxis: "",
  exchange: "",
  description: "",
  ceo: "",
  address: "",
  city: "",
  country: "",
  currentPrice: "",
  change: "",
  changePercent: "",
  open: "",
  high: "",
  low: "",
  marketCap: "",
  dividendYield: "",
  volume: "",
  averageVolume: "",
  cdpScore: "",
  currency: "",
  currentDate: "",
  currentMonth: "",
  website: "",
  news: "",
  updateAxis: async function (timeFrameView, apiTimeFrame) {
    this.timeFrameView = timeFrameView;
    this.apiTimeFrame = apiTimeFrame;
    const moveValues = await Model.fetchStockData(
      this.symbol,
      this.apiTimeFrame
    );
    this.stockMoveArr = moveValues;
    console.log(this);
    console.log(this.stockMoveArr);
  },
  renderChart: function () {
    renderedData.renderChart(companyObj);
  },
  updateHeader: function () {
    renderedData.updateHeader(companyObj);
  },
  updateHeaderStats: function () {
    renderedData.updateHeaderStats(companyObj);
  },
  updateStats: function () {
    renderedData.updateStats(companyObj);
  },
  updateCompanyDesc: function () {
    renderedData.updateCompanyDesc(companyObj);
  },
  updateCompanyNews: function () {
    renderedData.updateCompanyNews(companyObj.news);
  },
  // slice up data based on time frame requested (1day, 1month, 3month, etc.)
  parseMovementsByTime: function (timeFrame, date, month, year) {
    let daysArr = [];
    let openArr = [];

    // when getting 3 or 6 month times, functions will look to this for reference
    const monthArr = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];

    // destruct object
    const [...destructedResults] = Object.entries(this.stockMoveArr);

    // func used when user requests a 3 month, 6 month, 1 year time frame
    const threeOrSixMonthParse = function (numOfMonths) {
      let currentMonthIndex = parseInt(month, 10) - 1;
      destructedResults.reverse();

      for (let i = 0; i < numOfMonths; i++) {
        let currentMonth = monthArr.at(currentMonthIndex - i);

        for (const month of destructedResults) {
          if (month[0].slice(5, 7) === currentMonth) {
            daysArr.push(month[0].slice(5, 7));
            openArr.push(month[1].price);
            break;
          }
        }
      }
    };

    switch (timeFrame) {
      // if user wants to see stock movements for today
      case "now_button":
        // filter out only today
        const results = destructedResults.filter(
          (mov) => mov[0].slice(0, 10) === date //date
        );

        console.log(destructedResults.reverse());
        console.log(results);

        // times of day converted from military hours
        // and push to array
        for (let i = 0; i < results.length - 1; i++) {
          if (!Math.abs(i % 2) == 1) {
            const timeOfDay = results[i][0].slice(11, 13);

            if (Number(timeOfDay) > 12) {
              daysArr.push(Number(timeOfDay) - 12);
              // daysArr.push(results[i][0].slice(11, 16));
            } else {
              daysArr.push(results[i][0].slice(11, 13)); //change to 11,16 for :30
            }
            openArr.push(results[i][1].price);
          }
        }

        this.xAxis = daysArr;
        this.yAxis = openArr;
        return;
      // get past 7 days dates and openings
      case "week_button":
        let w = 0;
        destructedResults.reverse();

        while (w < 7) {
          daysArr.push(destructedResults[w][0].slice(8, 10));
          openArr.push(destructedResults[w][1].price);
          w++;
        }

        this.xAxis = daysArr.reverse();
        this.yAxis = openArr.reverse();
        return;
      // if user wants to see stock movements for month
      case "month_button":
        destructedResults.reverse();

        for (const mov of destructedResults) {
          // get past 30 days dates and openings
          daysArr.push(mov[0].slice(8, 10));
          openArr.push(mov[1].price);
        }
        this.xAxis = daysArr.reverse();
        this.yAxis = openArr.reverse();
        return;
      // if user wants to see stock movements for past 3 months
      case "three-month_button":
        threeOrSixMonthParse(3);

        this.xAxis = daysArr.reverse();
        this.yAxis = openArr.reverse();
        return;
      // if user wants to see stock movements for past 6 months
      case "six-month_button":
        threeOrSixMonthParse(6);

        this.xAxis = daysArr.reverse();
        this.yAxis = openArr.reverse();
        return;
      case "ytd_button":
        let numOfPrevMonths = parseInt(month, 10);
        threeOrSixMonthParse(numOfPrevMonths);

        this.xAxis = daysArr.reverse();
        this.yAxis = openArr.reverse();
        return;
      case "year_button":
        threeOrSixMonthParse(13);

        this.xAxis = daysArr.reverse();
        this.yAxis = openArr.reverse();
        return;
      case "max_button":
        destructedResults.reverse();

        const startYearObj = destructedResults[destructedResults.length - 1];
        const startYear = startYearObj[0].slice(0, 4);

        console.log(startYear);

        const numOfDecades = (+this.currentYear - +startYear) / 5;
        const yearsArr = [+this.currentYear];

        console.log(numOfDecades);

        let r = 1;

        while (r < numOfDecades + 1) {
          yearsArr.push(+this.currentYear - 5 * r);
          r++;
        }

        for (let i = 0; i < yearsArr.length; i++) {
          for (const yrObj of destructedResults) {
            if (yrObj[0].slice(0, 4) == yearsArr[i]) {
              console.log(yrObj);
              daysArr.push(yrObj[0].slice(0, 4));
              openArr.push(yrObj[1].price);
              break;
            }
          }
        }

        if (daysArr.at(-1).slice(0, 4) !== startYear) {
          daysArr.push(startYearObj[0].slice(0, 4));
        }
        openArr.push(startYearObj[1].price);

        console.log(daysArr);
        console.log(openArr);

        this.xAxis = daysArr.reverse();
        this.yAxis = openArr.reverse();
        return;
      default:
      // code block
    }
  },
};

const getCurrentDate = function () {
  // get current date
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();
  let hours = today.getHours();

  year = year.toString();
  month = month.toString().padStart(2, "0");
  day = day.toString().padStart(2, "0");

  return [month, `${year}-${month}-${day}`, year, hours];
};

const getData = async function (
  requestedTimeView,
  apiTimeFrame,
  search = "nasdaq"
) {
  // find company symbol when user uses search bar
  const companySymbolRes = await Model.findCompany(search);

  // assign company symbol and name to companyObj
  companyObj.symbol = companySymbolRes.symbol; //.slice(0, 4);

  const companyProfile = await Model.getCompanyProfile(
    companyObj.symbol,
    "stock-overview"
  );

  const companyNews = await Model.getCompanyProfile(
    companyObj.symbol,
    "stock-news"
  );

  // assign info to company obj
  companyObj.title = companyProfile.data.name;
  companyObj.exchange = companyProfile.data.exchange;
  companyObj.description = companyProfile.data.about;
  companyObj.ceo = companyProfile.data.company_ceo;
  companyObj.address = companyProfile.data.company_street_address;
  companyObj.city = companyProfile.data.company_city;
  companyObj.country = companyProfile.data.company_country;
  companyObj.open = companyProfile.data.open;
  companyObj.high = companyProfile.data.high;
  companyObj.low = companyProfile.data.low;
  companyObj.marketCap = companyProfile.data.company_market_cap;
  companyObj.website = companyProfile.data.company_website;
  companyObj.volume = companyProfile.data.volume;
  companyObj.averageVolume = companyProfile.data.avg_volume;
  companyObj.currentPrice = companyProfile.data.price;
  companyObj.change = companyProfile.data.change;
  companyObj.changePercent = companyProfile.data.change_percent;
  companyObj.news = companyNews.data.news;
  companyObj.currency = companyProfile.data.currency;
  if (!companyProfile.data.company_dividend_yield) {
    companyObj.dividendYield = "-";
  } else {
    companyObj.dividendYield = `${parseFloat(
      companyProfile.data.company_dividend_yield
    ).toFixed(2)}%`;
  }

  if (!companyProfile.data.company_cdp_score) {
    companyObj.cdpScore = "-";
  } else {
    companyObj.cdpScore = companyProfile.data.company_cdp_score;
  }

  await companyObj.updateAxis(requestedTimeView, apiTimeFrame);
  const currentDate = getCurrentDate();

  companyObj.currentDate = currentDate[1];
  companyObj.currentMonth = currentDate[0];
  companyObj.currentYear = currentDate[2];

  companyObj.parseMovementsByTime(
    requestedTimeView,
    currentDate[1],
    currentDate[0],
    currentDate[2]
  );

  console.log(companyObj);

  companyObj.renderChart();
  companyObj.updateHeader();
  companyObj.updateHeaderStats();
  companyObj.updateStats();
  companyObj.updateCompanyDesc();
  companyObj.updateCompanyNews();
  renderedData.changeTimeSeries(companyObj);
  renderedData.findNewStock(getData, companyObj);
};

let timeIntOnLoad = "1D";

// determine if it is currently before 10am
const determineTimeInt = function () {
  const currentTime = getCurrentDate();

  // if it is currently 10am or later, set interval to 5D, else 1D
  if (currentTime[3] >= 10) {
    timeIntOnLoad = "5D";
  }
};

const getMostActive = async function () {
  const mostActiveArr = await Model.getMostActiveStocks();
  renderedData.displayMostActive(mostActiveArr);
};

getMostActive();

determineTimeInt();

getData("now_button", timeIntOnLoad);
