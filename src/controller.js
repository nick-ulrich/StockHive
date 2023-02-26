import * as Model from "./model.js";
// import * as renderChart from "./view.js";
import renderedData from "./view.js";

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
  let daysArr = [];
  let openArr = [];

  switch (timeFrame) {
    // if user wants to see stock movements for today
    case "1h":
      // filter out each object for today
      const results = dataArr.filter(
        (mov) => mov.datetime.slice(0, 10) === "2023-02-24" //date
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
    case "week":
      let w = 0;

      while (w < 7) {
        // get past 7 days dates and openings
        daysArr.push(dataArr[w].datetime.slice(8, 10));
        openArr.push(dataArr[w].open);
        w++;
      }

      return [daysArr, openArr];
    // if user wants to see stock movements for past 30 days
    case "1month":
      let m = 0;
      while (m < 30) {
        // get past 30 days dates and openings
        daysArr.push(dataArr[m].datetime.slice(8, 10));
        openArr.push(dataArr[m].open);
        m++;
      }
      return [daysArr, openArr];
    // if user wants to see stock movements for past 3 months
    case "3month":
      let t = 0;
      while (t < 3) {
        // get past 3 months dates and openings
        daysArr.push(dataArr[t].datetime.slice(5, 7));
        openArr.push(dataArr[t].open);
        t++;
      }
      return [daysArr, openArr];
    // if user wants to see stock movements for past 6 months
    case "6month":
      let s = 0;
      while (s < 6) {
        // get past 3 months dates and openings
        daysArr.push(dataArr[s].datetime.slice(5, 7));
        openArr.push(dataArr[s].open);
        s++;
      }
      return [daysArr, openArr];
    default:
    // code block
  }
};

const getStockData = async function () {
  const companyObj = {
    symbol: "",
    title: "",
    xAxis: "",
    yAxis: "",
    news: [],
  };

  const companyInfo = await Model.findCompany("microsoft");

  console.log(companyInfo);

  const stockMoveArr = await Model.fetchStockData(companyInfo);

  console.log(stockMoveArr);

  const currentDate = getCurrentDate();

  // slice up data based on time frame requested (1day, 1month, 3month, etc.)
  const parseStockMoveArr = parseMovementsByTime(
    stockMoveArr,
    "week",
    currentDate
  );

  companyObj.symbol = companyInfo.Symbol;
  companyObj.title = companyInfo.CompanyName;
  companyObj.xAxis = parseStockMoveArr[0].reverse();
  companyObj.yAxis = parseStockMoveArr[1].reverse();

  console.log(companyObj);

  renderedData.renderChart(companyObj);
  renderedData.updateHeader(companyObj);
};

getStockData();
