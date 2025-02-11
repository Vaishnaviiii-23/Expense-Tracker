// Selecting elements
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const addExpenseBtn = document.getElementById("addExpense");
const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");
const remainingBudget = document.getElementById("remainingBudget");
const darkModeToggle = document.getElementById("darkModeToggle");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budget = localStorage.getItem("budget") ? parseFloat(localStorage.getItem("budget")) : 10000;

// Update UI when page loads
updateExpenseList();
updateRemainingBudget();

// Add Expense
addExpenseBtn.addEventListener("click", () => {
    const amount = parseFloat(amountInput.value.trim());
    const category = categoryInput.value.trim();
    const date = dateInput.value.trim();

    if (!amount || category === "" || date === "") {
        alert("Please fill in all fields.");
        return;
    }

    const expense = {
        id: Date.now(),
        amount,
        category,
        date
    };

    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    updateExpenseList();
    updateRemainingBudget();
    clearInputs();
});

// Update Expense List in Table
function updateExpenseList() {
    expenseList.innerHTML = "";
    let total = 0;

    expenses.forEach((expense) => {
        total += expense.amount;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>₹${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td><button class="delete-btn" onclick="deleteExpense(${expense.id})">❌</button></td>
        `;
        expenseList.appendChild(row);
    });

    totalAmount.textContent = total.toFixed(2);
}

// Update Remaining Budget
function updateRemainingBudget() {
    let totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    let remaining = budget - totalSpent;

    remainingBudget.textContent = remaining.toFixed(2);
    if (remaining < 0) {
        remainingBudget.style.color = "red";
    } else {
        remainingBudget.style.color = "green";
    }
}

// Delete Expense
function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateExpenseList();
    updateRemainingBudget();
}

// Clear Input Fields
function clearInputs() {
    amountInput.value = "";
    categoryInput.value = "";
    dateInput.value = "";
}

// Dark Mode Toggle
// Dark Mode Toggle
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Save the preference in local storage
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
        darkModeToggle.textContent = "☀️"; // Change icon to sun
    } else {
        localStorage.setItem("darkMode", "disabled");
        darkModeToggle.textContent = "🌙"; // Change icon to moon
    }
});

// Check if Dark Mode was enabled before (when the page loads)
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.textContent = "☀️"; // Set sun icon if dark mode was enabled
}

// Load Chart.js for Expense Breakdown
function loadChart() {
    const ctx = document.getElementById("expenseChart").getContext("2d");
    ctx.canvas.width = 400;  // Reduce width
    ctx.canvas.height = 300; // Reduce height
        const categoryTotals = {};

    expenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });

    const chartData = {
        labels: Object.keys(categoryTotals),
        datasets: [{
            label: "Expense Breakdown",
            data: Object.values(categoryTotals),
            backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4caf50", "#ff9800"],
        }]
    };

    new Chart(ctx, {
        type: "pie",
        data: chartData
    });
}

// Load Chart when page loads
loadChart();
// Select Elements
const budgetInput = document.getElementById("budgetInput");
const setBudgetBtn = document.getElementById("setBudgetBtn");

// Set New Budget
setBudgetBtn.addEventListener("click", () => {
    const newBudget = parseFloat(budgetInput.value.trim());

    if (!newBudget || newBudget <= 0) {
        alert("Please enter a valid budget amount.");
        return;
    }

    budget = newBudget;
    localStorage.setItem("budget", budget);
    updateRemainingBudget();
    alert(`Your new budget is set to ₹${budget}`);
});
