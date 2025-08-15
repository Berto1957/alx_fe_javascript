// Retrieve quotes from localStorage or set default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Simplicity is the ultimate sophistication.", category: "Wisdom" }
];

// Populate categories on page load
window.onload = function () {
  populateCategories();
  restoreLastFilter();
  filterQuotes(); // Apply filter immediately
};

// Populate the category dropdown dynamically
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");

  // Clear existing options except "All"
  categorySelect.innerHTML = '<option value="all">All Categories</option>';

  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];

  // Add to dropdown
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Filter quotes by selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", selectedCategory); // Save last selection

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  displayQuotes(filteredQuotes);
}

// Display quotes in DOM
function displayQuotes(quotesToShow) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  if (quotesToShow.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes found for this category.</p>";
    return;
  }

  quotesToShow.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" — ${q.category}`;
    quoteDisplay.appendChild(p);
  });
}

// Add new quote
function addQuote() {
  const quoteText = document.getElementById("quoteText").value.trim();
  const quoteCategory = document.getElementById("quoteCategory").value.trim();

  if (quoteText && quoteCategory) {
    quotes.push({ text: quoteText, category: quoteCategory });

    // Save to localStorage
    localStorage.setItem("quotes", JSON.stringify(quotes));

    // Update categories
    populateCategories();

    // Refresh display
    filterQuotes();

    // Clear input fields
    document.getElementById("quoteText").value = "";
    document.getElementById("quoteCategory").value = "";
  } else {
    alert("Please fill in both fields.");
  }
}

// Restore last selected category from localStorage
function restoreLastFilter() {
  const lastCategory = localStorage.getItem("lastCategory");
  if (lastCategory) {
    document.getElementById("categoryFilter").value = lastCategory;
  }
}
