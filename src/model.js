// import { API_URL } from "./config.js";

const fetchingMessage = document.querySelector(".fetching-stock_msg");

export const findCompany = async function (searchInput) {
  console.log(searchInput);

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "",
      "X-RapidAPI-Host": "schwab.p.rapidapi.com",
    },
  };

  // search for company based off of user input, get company name and ticker symbol

  // try {
  //   fetch(
  //     "https://schwab.p.rapidapi.com/auto-complete?MatchChars=tesla",
  //     options
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       return data.SymbolLookupResponse.Symbols[0];
  //     });
  // } catch (err) {
  //   console.error(err);
  // }

  try {
    fetchingMessage.textContent = "Finding company...";

    console.log(
      `https://schwab.p.rapidapi.com/auto-complete?MatchChars=${searchInput}`
    );

    const response = await fetch(
      `https://schwab.p.rapidapi.com/auto-complete?MatchChars=microsoft`,
      options
    );

    console.log(response);

    // if (!response.ok) throw new Error("Oops! Something went wrong.");

    const data = await response.json();

    console.log(data);

    fetchingMessage.textContent = "";

    return data.SymbolLookupResponse.Symbols[0];
  } catch (err) {
    console.log(err);
  }
};

export const fetchStockData = async function (obj) {
  fetchingMessage.textContent = "Fetching data...";

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "",
      "X-RapidAPI-Host": "twelve-data1.p.rapidapi.com",
    },
  };

  // search for company based off of user input, get company name and ticker symbol
  try {
    // get company stock movements
    const response = await fetch(
      `https://twelve-data1.p.rapidapi.com/time_series?symbol=${obj.Symbol}&interval=1day&outputsize=30&format=json`,
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
