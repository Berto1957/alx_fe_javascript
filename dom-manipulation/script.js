cat > script.js <<'JS'
// Initial quotes array
let quotes = [
  { text: "Your limitation—it's only your imagination.", category: "Motivation" },
  { text: "Push yourself, because no one else is going to do it for you.", category: "Motivation" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", category: "Success" },
  { text: "Dream it. Wish it. Do it.", category: "Inspiration" }
];

// Display a random quote
function showRandomQuote() {
  if (!quotes.length) return;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const target = document.getElementById("quoteDisplay");
  target.innerHTML = `"${quote.text}"<br><em>- ${quote.category}</em>`;
}

// Add a new quote from inputs
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please fill in both fields.");
    return;
  }

  quotes.push({ text, category });

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Optionally show the newly added quote right away
  const target = document.getElementById("quoteDisplay");
  target.innerHTML = `"${text}"<br><em>- ${category}</em>`;
  // alert("Quote added successfully!");
}

// Wire the button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Show one on first load (optional)
showRandomQuote();
JS
