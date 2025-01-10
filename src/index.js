let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];
const changeDue = document.getElementById("change-due");



const calculateChange = cash => {
  //sacar el cambio
  let change = cash - price;
  console.log(change);
  

  const denominations = {
    "PENNY": 0.01,
    "NICKEL": 0.05,
    "DIME": 0.10,
    "QUARTER": 0.25,
    "ONE": 1.00,
    "FIVE": 5.00,
    "TEN": 10.00,
    "TWENTY": 20.00,
    "ONE HUNDRED": 100.00
  };


  let changeReturn = [];
  
    for (let i = cid.length - 1; i >= 0; i--) {
        let [denomination, quantityAvailable] = cid[i];
        let valueDenomination = denominations[denomination];
        let amountNecessary = Math.floor(change / valueDenomination);

        if (quantityAvailable > 0 && amountNecessary > 0) {
          console.log("denominacion:",denomination);
          console.log("cantidadDisponible:",quantityAvailable );
          console.log("cantidadNecesaria:",amountNecessary);
          
          let quantityReturn = Math.min(amountNecessary, Math.floor(quantityAvailable / valueDenomination));
          console.log("quantityReturn:", quantityReturn);
          
          
           let quantityReturned = (quantityReturn * valueDenomination).toFixed(2);
          console.log("cantidad devuelta:", quantityReturned);
          
          

          if (quantityReturned > 0 && quantityAvailable >= quantityReturned) {
              changeReturn.push([denomination, parseFloat(quantityReturned)]);
              change = parseFloat((change - parseFloat(quantityReturned)).toFixed(2));  // Restar del change
              cid[i][1] = parseFloat((cid[i][1] - parseFloat(quantityReturned)).toFixed(2));  // Restar de la caja
              const allZero = cid.every(([coin, value]) => value === 0);
              console.log(allZero);
              
              if (allZero && change === 0) {
              changeDue.textContent =  `Status: CLOSED ${changeReturn.map(item => `${item[0]}: $${item[1]}`).join(" ")}`;
                return;
              }
          }
          
          console.log("cambio: ",change);

        }

        if (parseFloat(change) <= 0) break;
        
    }

    if (change > 0) {
        changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
    } else {
        changeDue.textContent = `Status: OPEN ${changeReturn.map(item => `${item[0]}: $${item[1]}`).join(" ")}`;
    }
}


document.getElementById("purchase-btn").addEventListener("click", () => {
  const cashInput = document.getElementById("cash");

  const cash = Number(cashInput.value);

  // Le falta dinero al cliente
  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }else if (cash === price) {
    changeDue.textContent = "No change due - customer paid with exact cash.";
    return;
  } else {
    calculateChange(cash)
 
  }
  cashInput.value = ""
})

