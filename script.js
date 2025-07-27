const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.createElement("p");
document.querySelector("form").appendChild(msg);

// Populate dropdowns from countryList
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      option.selected = "selected";
    }

    select.append(option);
  }

  // Change flag when a new currency is selected
  select.addEventListener("change", (e) => updateFlag(e.target));
}

// Update flag icon
const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// Fetch and display exchange rate
const updateExchangeRate = async () => {
  let amountInput = document.getElementById("amount");
  let amtVal = parseFloat(amountInput.value);

  if (isNaN(amtVal) || amtVal <= 0) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const base = fromCurr.value;
  const URL = `https://api.exchangerate-api.com/v4/latest/${base}`;

  try {
    const res = await fetch(URL);
    const data = await res.json();

    const rate = data.rates[toCurr.value];
    const finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    msg.style.fontWeight = "bold";
    msg.style.textAlign = "center";
    msg.style.marginTop = "1rem";
  } catch (err) {
    msg.innerText = "Error fetching exchange rate.";
  }
};

// Convert only when button is clicked
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// Show default conversion once when page loads
window.addEventListener("load", updateExchangeRate);