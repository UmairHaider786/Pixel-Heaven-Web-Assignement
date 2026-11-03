import {API_URL} from "../constants/url.js";
import {renderDeals} from "../services/getGames.js";

// The API address (free, no API key needed)
// const API_URL = "https://www.cheapshark.com/api/1.0/deals";

// Extra options added to the address: ?pageSize=12&upperPrice=15
const API_PARAMS = {
  pageSize: 12,    // how many deals to get
  upperPrice: 15,  // only deals up to $15
};


/* ---------- 2. GRAB THE HTML ELEMENTS ---------- */

const loadingMsg = document.getElementById("loading-msg");
const errorMsg = document.getElementById("error-msg");
const dealsList = document.getElementById("deals-list");


/* ---------- 3. HELPER ---------- */

// Stops text from the API from being treated as HTML code
const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");


/* ---------- 4. SHOW THE DEALS AS CARDS ---------- */
// modular code: this function is imported from src/services/getGames.js, so it can be used in other files too


  // map() turns every deal object into an HTML card, join() glues them together
  

/* ---------- 5. FETCH THE DATA WITH AXIOS ---------- */

const loadDeals = async () => {
  try {
    // axios.get() sends the GET request and waits for the answer
    const response = await axios.get(API_URL, { params: API_PARAMS });

    // response.data is the JSON array the API sent back
    console.log(response.data);

    renderDeals(response.data);
  } catch (error) {
    // Something went wrong (no internet, API down...) so show the error message
    console.error("Could not load deals:", error);
    errorMsg.classList.remove("hidden");
  } finally {
    // Runs in BOTH cases: hide the "Loading..." message
    loadingMsg.classList.add("hidden");
  }
};


/* ---------- 6. RUN WHEN THE PAGE OPENS ---------- */

loadDeals();