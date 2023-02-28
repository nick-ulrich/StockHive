import * as Model from "./model.js";
import view from "./view.js";
// import * as renderChart from "./view.js";
import renderedData from "./view.js";

// store company data in an object to pass to other functions
const companyObj = {
  symbol: "",
  title: "",
  xAxis: "",
  yAxis: "",
  news: [],
};

const getCurrentDate = function () {
  // get current date
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  month = month.toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseMovementsByTime = function (dataArr, timeFrame, date) {
  console.log("timeFrame");
  console.log(timeFrame);
  console.log("dataArr");
  console.log(dataArr);

  let daysArr = [];
  let openArr = [];

  switch (timeFrame) {
    // if user wants to see stock movements for today
    case "now_button":
      console.log("now_button FIRED");
      // filter out each object for today
      const results = dataArr.filter(
        (mov) => mov.datetime.slice(0, 10) === "2023-02-27" //date
      );

      // times of day converted from military hours
      for (const time of results) {
        const timeOfDay = time.datetime.slice(11, 13);

        if (Number(timeOfDay) > 12) {
          daysArr.push(Number(timeOfDay) - 12);
        } else {
          daysArr.push(Number(timeOfDay));
        }

        openArr.push(time.open);
      }
      return [daysArr, openArr];
    // if user wants to see stock movements for this week
    case "week_button":
      let w = 0;

      while (w < 7) {
        // get past 7 days dates and openings
        daysArr.push(dataArr[w].datetime.slice(8, 10));
        openArr.push(dataArr[w].open);
        w++;
      }

      return [daysArr, openArr];
    // if user wants to see stock movements for past 30 days
    case "month_button":
      let m = 0;
      while (m < 30) {
        // get past 30 days dates and openings
        daysArr.push(dataArr[m].datetime.slice(8, 10));
        openArr.push(dataArr[m].open);
        m++;
      }
      return [daysArr, openArr];
    // if user wants to see stock movements for past 3 months
    case "three-month_button":
      let t = 0;
      while (t < 3) {
        // get past 3 months dates and openings
        daysArr.push(dataArr[t].datetime.slice(5, 7));
        openArr.push(dataArr[t].open);
        t++;
      }
      return [daysArr, openArr];
    // if user wants to see stock movements for past 6 months
    case "six-month_button":
      let s = 0;
      while (s < 6) {
        // get past 3 months dates and openings
        daysArr.push(dataArr[s].datetime.slice(5, 7));
        openArr.push(dataArr[s].open);
        s++;
      }
      return [daysArr, openArr];
    case "ytd_button":
      // get data for each month of this year
      const todaysDate = getCurrentDate();
      const year = todaysDate.slice(0, 4);

      for (const obj of dataArr) {
        if (obj.datetime.slice(0, 4) === year) {
          // push months and opening data
          daysArr.push(obj.datetime.slice(5, 7));
          openArr.push(obj.open);
        }
      }
      return [daysArr, openArr];
    default:
    // code block
  }
};

const getData = async function (requestedTimeView, apiTimeSeries) {
  // find company symbol when user uses search bar
  const companyInfo = await Model.findCompany("apple inc");

  // assign company symbol and name to companyObj
  companyObj.symbol = companyInfo.symbol.slice(0, 4);
  companyObj.title = companyInfo.name;

  // get and return stock movements
  const stockMoveArr = await Model.fetchStockData(
    companyObj.symbol,
    apiTimeSeries
  );

  const currentDate = getCurrentDate();

  // slice up data based on time frame requested (1day, 1month, 3month, etc.)
  const parseStockMoveArr = parseMovementsByTime(
    stockMoveArr,
    requestedTimeView,
    currentDate
  );

  companyObj.xAxis = parseStockMoveArr[0].reverse();
  companyObj.yAxis = parseStockMoveArr[1].reverse();

  renderedData.renderChart(companyObj);
  renderedData.updateHeader(companyObj);
  renderedData.changeTimeSeries(getData);
};

getData("now_button", "1h");
