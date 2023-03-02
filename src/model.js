// import { API_URL } from "./config.js";

const fetchingMessage = document.querySelector(".fetching-stock_msg");

// get company ticker symbol on first load or based on users input
export const findCompany = async function (searchInput) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "e33a7c8d4fmsh4e62d8ff85f954dp128d21jsne2ab30bef40d",
      "X-RapidAPI-Host": "real-time-finance-data.p.rapidapi.com",
    },
  };

  try {
    fetchingMessage.textContent = "Finding company...";

    const response = await fetch(
      `https://real-time-finance-data.p.rapidapi.com/search?query=${searchInput}`,
      options
    );

    if (!response.ok)
      throw new Error(
        "Oops! The worker bees could not find the company you're looking for. Please try again."
      );

    const data = await response.json();

    fetchingMessage.textContent = "";

    console.log(data);

    return data.data.stock[0];
  } catch (err) {
    console.log(err);
  }
};

// get general information about company (name, address, ceo, etc.)
export const getCompanyProfile = async function (symbol, request) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "e33a7c8d4fmsh4e62d8ff85f954dp128d21jsne2ab30bef40d",
      "X-RapidAPI-Host": "real-time-finance-data.p.rapidapi.com",
    },
  };

  try {
    fetchingMessage.textContent = "Getting company data...";

    const response = await fetch(
      `https://real-time-finance-data.p.rapidapi.com/${request}?symbol=${symbol}&language=en`,
      options
    );

    if (!response.ok)
      throw new Error(
        "Oops! The worker bees could not find the company information. Please try again."
      );

    const data = await response.json();

    console.log(data);

    fetchingMessage.textContent = "";
    return data;
  } catch (err) {
    console.log(err);
  }
};

// get actual stock movements
export const fetchStockData = async function (symbol, apiTimeFrame) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "e33a7c8d4fmsh4e62d8ff85f954dp128d21jsne2ab30bef40d",
      "X-RapidAPI-Host": "real-time-finance-data.p.rapidapi.com",
    },
  };

  try {
    fetchingMessage.textContent = "Getting stock data...";

    // get company stock movements
    const response = await fetch(
      `https://real-time-finance-data.p.rapidapi.com/stock-time-series?symbol=${symbol}&period=${apiTimeFrame}`,
      options
    );

    if (!response.ok)
      throw new Error(
        "Oops! The worker bees could not find the stock data you're looking for. Please try again."
      );

    const data = await response.json();

    console.log(data);

    fetchingMessage.textContent = "";

    return data.data.time_series;
  } catch (err) {
    console.log(err);
    fetchingMessage.textContent = err;
  }
};
