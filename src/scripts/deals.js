

// The API address (free, no API key needed)
const API_URL = "https://www.cheapshark.com/api/1.0/deals";

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

const renderDeals = (deals) => {
  // If the API sent nothing, tell the user
  if (deals.length === 0) {
    dealsList.innerHTML = `
      <p class="border-2 border-cocoa bg-sage rounded-xl p-4 font-bold sm:col-span-2 lg:col-span-3">
        No deals found right now. Check back later!
      </p>`;
    return;
  }

  // map() turns every deal object into an HTML card, join() glues them together
  dealsList.innerHTML = deals
    .map((deal) => {
      // The API sends numbers as text, so convert them
      const salePrice = Number(deal.salePrice).toFixed(2);
      const normalPrice = Number(deal.normalPrice).toFixed(2);
      const savings = Math.round(Number(deal.savings));

      return `
      <article class="bg-white border-2 border-cocoa rounded-xl shadow-[4px_4px_0_#4A3226] overflow-hidden flex flex-col">
        <img
          src="${escapeHtml(deal.thumb)}"
          alt="${escapeHtml(deal.title)}"
          class="w-full h-32 object-cover border-b-2 border-cocoa"
        />
        <div class="p-5 flex flex-col flex-1">
          <h2 class="font-extrabold text-lg">${escapeHtml(deal.title)}</h2>

          <p class="mt-3 flex flex-wrap items-center gap-2">
            <span class="inline-block px-3 py-1 rounded-full border-2 border-cocoa text-xs font-extrabold bg-butter">$${salePrice}</span>
            <span class="text-sm line-through">$${normalPrice}</span>
            <span class="inline-block px-3 py-1 rounded-full border-2 border-cocoa text-xs font-extrabold bg-berry text-white">-${savings}%</span>
          </p>

          <p class="text-sm mt-3">
            Metacritic: ${deal.metacriticScore !== "0" ? escapeHtml(deal.metacriticScore) : "n/a"}
            &bull; Steam rating: ${deal.steamRatingPercent !== "0" ? escapeHtml(deal.steamRatingPercent) + "%" : "n/a"}
          </p>

          <a
            href="https://www.cheapshark.com/redirect?dealID=${encodeURIComponent(deal.dealID)}"
            target="_blank"
            rel="noopener"
            class="mt-4 inline-block px-5 py-2 rounded-lg border-2 border-cocoa font-extrabold shadow-[3px_3px_0_#4A3226] hover:translate-y-0.5 hover:shadow-none transition text-center bg-peach"
          >
            Get deal
          </a>
        </div>
      </article>`;
    })
    .join("");
};


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