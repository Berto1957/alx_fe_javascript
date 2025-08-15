// -------------------- Configuration --------------------
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock server
const SYNC_INTERVAL = 30000; // 30 seconds

// -------------------- Initialization --------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Your limitation—it's only your imagination.", category: "Motivation" },
  { text: "Push yourself, because no one else is going to do it for you.", category: "Motivation" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", category: "Success" },
  { text: "Dream it. Wish it. Do it.", category: "Inspiration" }
];

// -------------------- Storage Functions --------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// -------------------- Display Functions --------------------
function displayQuotes(quotesToShow) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  if (!quotesToShow.length) {
    quoteDisplay.innerHTML = "<p>No quotes found for this category.</p>";
    return;
  }

  quotesToShow.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" — ${q.category}`;
    quoteDisplay.appendChild(p);
  });
}

function showRandomQuote() {
  if (!quotes.length) return;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  displayQuotes([quote]);
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function showLastViewedQuote() {
  const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
  if (lastQuote) displayQuotes([lastQuote]);
  else alert("No quote viewed this session yet.");
}

// -------------------- Add Quote Form --------------------
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.insertBefore(formContainer, document.getElementById("exportQuotes"));
}

// -------------------- Add & Filter Quotes --------------------
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Please fill in both fields.");

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  filterQuotes();
  syncNewQuoteToServer(newQuote); // Sync to server

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");
  const selected = categorySelect.value;

  categorySelect.innerHTML = '<option value="all">All Categories</option>';
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  const lastCategory = localStorage.getItem("selectedCategory") || selected;
  categorySelect.value = lastCategory;
}

function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", category);

  const filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);
  displayQuotes(filtered);
}

// -------------------- JSON Import/Export --------------------
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error("Invalid JSON format");
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes imported successfully!");
    } catch {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// -------------------- Server Sync & Conflict Resolution --------------------
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    const serverQuotes = serverData.map(item => ({
      text: item.title || "No text",
      category: item.body || "General"
    }));

    let conflictsResolved = false;
    serverQuotes.forEach(sq => {
      const exists = quotes.some(lq => lq.text === sq.text && lq.category === sq.category);
      if (!exists) {
        quotes.push(sq);
        conflictsResolved = true;
      }
    });

    if (conflictsResolved) {
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes updated from server. Conflicts resolved.");
    }
  } catch (error) {
    console.error("Error fetching server quotes:", error);
  }
}

async function syncNewQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: quote.text, body: quote.category })
    });
  } catch (error) {
    console.error("Error syncing quote to server:", error);
  }
}

// Wrapper function for syncing (for checklist)
async function syncQuotes() {
  await fetchQuotesFromServer();
}

// -------------------- Event Listeners --------------------
document.getElementById("showRandomQuote").addEventListener("click", showRandomQuote);
document.getElementById("showLastQuote").addEventListener("click", showLastViewedQuote);
document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// -------------------- Periodic Server Sync --------------------
setInterval(fetchQuotesFromServer, SYNC_INTERVAL);

// -------------------- Initialize --------------------
createAddQuoteForm();
populateCategories();
filterQuotes();
