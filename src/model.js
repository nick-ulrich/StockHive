// import { API_URL } from "./config.js";

const fetchingMessage = document.querySelector(".fetching-stock_msg");

export const findCompany = async function (searchInput) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "e33a7c8d4fmsh4e62d8ff85f954dp128d21jsne2ab30bef40d",
      "X-RapidAPI-Host": "real-time-finance-data.p.rapidapi.com",
    },
  };

  // await fetch(
  //   `https://real-time-finance-data.p.rapidapi.com/search?query=${searchInput}`,
  //   options
  // )
  //   .then((response) => response.json())
  //   .then((response) => {
  //     console.log(response);
  //     companyData = response.data.stock[0].symbol.slice(0, 4);
  //   })
  //   .catch((err) => console.error(err));
  // search for company based off of user input, get company name and ticker symbol

  try {
    fetchingMessage.textContent = "Finding company...";

    const response = await fetch(
      `https://real-time-finance-data.p.rapidapi.com/search?query=${searchInput}`,
      options
    );

    //if (!response.ok) throw new Error("Oops! Something went wrong.");

    const data = await response.json();

    fetchingMessage.textContent = "";

    return data.data.stock[0];
  } catch (err) {
    console.log(err);
  }
};

export const fetchStockData = async function (symbol, timeFrame) {
  fetchingMessage.textContent = "Fetching data...";

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "e33a7c8d4fmsh4e62d8ff85f954dp128d21jsne2ab30bef40d",
      "X-RapidAPI-Host": "twelve-data1.p.rapidapi.com",
    },
  };

  // search for company based off of user input, get company name and ticker symbol
  try {
    // get company stock movements
    const response = await fetch(
      `https://twelve-data1.p.rapidapi.com/time_series?symbol=${symbol}&interval=${timeFrame}&outputsize=30&format=json`,
      options
    );

    const data = await response.json();

    console.log(data);

    if (data.status !== "ok") throw new Error("Oops! Something went wrong.");

    fetchingMessage.textContent = "";

    return data.values;
  } catch (err) {
    console.log(err);
  }
};
