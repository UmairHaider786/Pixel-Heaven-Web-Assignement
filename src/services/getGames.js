export const renderDeals = (deals) => {
  // If the API sent nothing, tell the user
  if (deals.length === 0) {
    dealsList.innerHTML = `
      <p class="border-2 border-cocoa bg-sage rounded-xl p-4 font-bold sm:col-span-2 lg:col-span-3">
        No deals found right now. Check back later!
      </p>`;
    return;
  }

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
  
