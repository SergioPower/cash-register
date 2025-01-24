const price = 45.50;
const cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

document.getElementById("value").textContent = `${price}`;
const $status = document.getElementById("notice-status");
const $changeDue = document.getElementById("change-due");
const $ticket = document.getElementById("ticket");

const updateStatus = (type) => {
  $status.classList.remove("error", "warning", "success");

  switch (type) {
  case "error":
    $status.classList.add("error");
    $status.textContent = "Status: CLOSED";
    break;

  case "warning":
    $status.classList.add("warning");
    $status.textContent = "Status: INSUFFICIENT_FUNDS";
    break;

  case "success":
    $status.classList.add("success");
    $status.textContent = "Status: OPEN";
    break;

  default:
    break;
  }
};

const calculateChange = cash => {
  let change = cash - price;
  const denominations = {
    PENNY: 0.01,
    NICKEL: 0.05,
    DIME: 0.10,
    QUARTER: 0.25,
    ONE: 1.00,
    FIVE: 5.00,
    TEN: 10.00,
    TWENTY: 20.00,
    "ONE HUNDRED": 100.00
  };

  const changeReturn = [];

  for (let i = cid.length - 1; i >= 0; i--) {
    const [denomination, quantityAvailable] = cid[i];
    const valueDenomination = denominations[denomination];
    const amountNecessary = Math.floor(change / valueDenomination);

    if (quantityAvailable > 0 && amountNecessary > 0) {
      const quantityReturn = Math.min(amountNecessary, Math.floor(quantityAvailable / valueDenomination));

      const quantityReturned = (quantityReturn * valueDenomination).toFixed(2);

      if (quantityReturned > 0 && quantityAvailable >= quantityReturned) {
        changeReturn.push([denomination, parseFloat(quantityReturned)]);
        change = parseFloat((change - parseFloat(quantityReturned)).toFixed(2)); // Restar del change
        cid[i][1] = parseFloat((cid[i][1] - parseFloat(quantityReturned)).toFixed(2)); // Restar de la caja
        const allZero = cid.every(([coin, value]) => value === 0);

        if (allZero && change === 0) {
          updateStatus("error");
		  $changeDue.textContent = changeReturn.map(item => `${item[0]}: $${item[1]}`).join(" ");
          return;
        }
      }
    }

    if (parseFloat(change) <= 0) break;
  }

  if (change > 0) {
    updateStatus("warning");
  } else {
    updateStatus("success");
    $changeDue.innerHTML = changeReturn.map(item => `${item[0]}: $${item[1]}`).join("<br>");
  }
};

const updateMoneyTray = () => {
  cid.forEach(([denomination, amount]) => {
    const className = denomination.toLowerCase().replace(" ", "-");
    const element = document.querySelector(`.${className}`);
    if (element) {
      element.textContent = `$${amount.toFixed(2)}`;
    }
  });
};

updateMoneyTray();
document.getElementById("button").addEventListener("click", () => {
  const cashInput = document.getElementById("cash");

  const cash = Number(cashInput.value);

  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  } else if (cash === price) {
    $changeDue.textContent = "No change due - customer paid with exact cash.";
    return;
  } else {
    $ticket.classList.remove("hide");
    calculateChange(cash);
    updateMoneyTray();
  }
  cashInput.value = "";
});
