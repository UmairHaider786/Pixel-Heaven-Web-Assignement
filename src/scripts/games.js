

// The name our data is saved under inside the browser
const STORAGE_KEY = "pixelHeavenGames";

const loadGames = () => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved === null) {
    return [];
  }

  return JSON.parse(saved);
};

const saveGames = (games) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
};

let games = loadGames();


/* ---------- 2. GRAB THE HTML ELEMENTS ---------- */

// Form fields
const gameForm = document.getElementById("game-form");// hidden input, used for editing
const titleInput = document.getElementById("title");
const genreInput = document.getElementById("genre");
const priceInput = document.getElementById("price");
const descriptionInput = document.getElementById("description");

// Form text and buttons that change between "add" and "edit" mode
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");

// Search and filter controls
const searchInput = document.getElementById("search-input");
const genreFilter = document.getElementById("genre-filter");

// Where the cards are shown, and the "No games found" message
const gameList = document.getElementById("game-list");
const emptyMsg = document.getElementById("empty-msg");



// this is help us ignore any HTML tags that a user might try to sneak into the form fields
const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");


    
const renderGames = (list) => {
  // Show the "No games found" message only when the list is empty
  emptyMsg.classList.toggle("hidden", list.length > 0);

  // map() turns every game object into an HTML card, join() glues them together
  gameList.innerHTML = list
    .map(
      (game) => `
      <article class="bg-white border-2 border-cocoa rounded-xl p-5 shadow-[4px_4px_0_#4A3226]">
        <h3 class="font-extrabold text-lg">${escapeHtml(game.title)}</h3>
        <p class="text-sm mt-1">${escapeHtml(game.description)}</p>
        <p class="mt-3">
          <span class="inline-block px-3 py-1 rounded-full border-2 border-cocoa text-xs font-extrabold bg-sage">${escapeHtml(game.genre)}</span>
          <span class="inline-block px-3 py-1 rounded-full border-2 border-cocoa text-xs font-extrabold bg-white">$${Number(game.price).toFixed(2)}</span>
        </p>
        <div class="flex gap-2 mt-4">
          <button type="button" data-id="${game.id}" class="edit-btn px-3 py-1 rounded-lg border-2 border-cocoa font-extrabold text-sm bg-butter cursor-pointer">Edit</button>
          <button type="button" data-id="${game.id}" class="delete-btn px-3 py-1 rounded-lg border-2 border-cocoa font-extrabold text-sm bg-berry text-white cursor-pointer">Delete</button>
        </div>
      </article>`
    )
    .join("");
};


/* ---------- 4. SEARCH AND FILTER ---------- */

const applyFilters = () => {
  const term = searchInput.value.trim().toLowerCase();
  const genre = genreFilter.value;

  const results = games.filter((game) => {
    const matchesGenre = genre === "all" || game.genre === genre;

    // some() checks if AT LEAST ONE of these fields contains the search text
    const matchesText = [game.title, game.description, game.genre].some((field) =>
      field.toLowerCase().includes(term)
    );

    // A game must pass both tests
    return matchesGenre && matchesText;
  });

  renderGames(results);
};

// Re-filter every time the user types or changes the dropdown
searchInput.addEventListener("input", applyFilters);
genreFilter.addEventListener("change", applyFilters);



// Put the form back into normal "Add a game" mode
const resetForm = () => {
  gameForm.reset();
  gameIdInput.value = "";
  formTitle.textContent = "Add a game";
  submitBtn.textContent = "Add game";
  cancelBtn.classList.add("hidden");
};


/* ---------- 6. CREATE + UPDATE (form submit) ---------- */

gameForm.addEventListener("submit", (e) => {
  // Stop the browser from reloading the page
  e.preventDefault();

  // Read the values from the form
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  // Hidden id: has a number when editing, is empty (0) when adding
  const editingId = Number(gameIdInput.value);

  // every() checks that ALL fields are filled in
  const allFilled = [title, genreInput.value, priceInput.value, description].every(
    (value) => value !== ""
  );
  if (!allFilled) {
    alert("Please fill in every field.");
    return;
  }

  // some() checks if ANY other game already has this title
  const isDuplicate = games.some(
    (game) => game.title.toLowerCase() === title.toLowerCase() && game.id !== editingId
  );
  if (isDuplicate) {
    alert("That game is already in your library.");
    return;
  }

  if (editingId) {
    // UPDATE: map() copies every game, replacing only the one being edited
    games = games.map((game) =>
      game.id === editingId
        ? { ...game, title, genre: genreInput.value, price: Number(priceInput.value), description }
        : game
    );
  } else {
    // CREATE: build a new object and add it to the array
    games.push({
      id: Date.now(), // unique id based on the current time
      title,
      genre: genreInput.value,
      price: Number(priceInput.value),
      description,
    });
  }

  saveGames(games);  // save to Local Storage
  applyFilters();    // refresh the cards (keeps the current search/filter)
  resetForm();       // clear the form and go back to "Add" mode
});


/* ---------- 7. EDIT + DELETE (clicks on the cards) ---------- */

// One listener on the whole list catches clicks from every card's buttons
gameList.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  const editBtn = e.target.closest(".edit-btn");

  // ----- DELETE -----
  if (deleteBtn) {
    // data-id is text, so convert it to a number to match our ids
    const id = Number(deleteBtn.dataset.id);

    if (!confirm("Delete this game?")) return;

    // filter() keeps every game EXCEPT the one with this id
    games = games.filter((game) => game.id !== id);
    saveGames(games);
    applyFilters();

    // If we were editing the game we just deleted, reset the form
    if (Number(gameIdInput.value) === id) resetForm();
  }

  // ----- EDIT -----
  if (editBtn) {
    const id = Number(editBtn.dataset.id);

    // find() returns the one game that matches this id
    const game = games.find((g) => g.id === id);

    // Fill the form with that game's data
    gameIdInput.value = game.id;
    titleInput.value = game.title;
    genreInput.value = game.genre;
    priceInput.value = game.price;
    descriptionInput.value = game.description;

    // Switch the form into "edit" mode
    formTitle.textContent = "Edit game";
    submitBtn.textContent = "Save changes";
    cancelBtn.classList.remove("hidden");
    gameForm.scrollIntoView({ behavior: "smooth" });
  }
});

// Cancel button: leave edit mode without saving
cancelBtn.addEventListener("click", resetForm);


/* ---------- 8. RUN WHEN THE PAGE OPENS ---------- */

// Show all saved games as soon as the page loads
applyFilters();