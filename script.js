window.onload = () => {
  if (localStorage.getItem("expense") == null) {
    let empty = [];
    localStorage.setItem("expense", JSON.stringify(empty.length));
    return;
  }
  displayTotal();
  displayExpense();
};
function GetCurrency() {
  const res = fetch(
    "https://api.freecurrencyapi.com/v1/currencies?apikey=fca_live_H2eEwbop6CGtF3QP9pakHClp5CjSyQAEKr1WTjQh&currencies=EUR%2CUSD%2CCAD"
  )
    .then(function (response) {
      const currency = response.json();
      currency
        .then(function (ans) {
          document.getElementById("USD").innerText = ans.data.USD.symbol;
          document.getElementById("Euro").innerText = ans.data.EUR.symbol;
          document.getElementById("CAD").innerText = ans.data.CAD.symbol;
        })
        .catch(function (err) {
          console.log(err);
        });
    })
    .catch(function (err) {
      console.log(err);
    });
}
async function convertTo(currency, amount) {
  try {
    const response = await fetch(
      "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_H2eEwbop6CGtF3QP9pakHClp5CjSyQAEKr1WTjQh&currencies=EUR%2CUSD%2CCAD"
    );
    const data = await response.json();
    if (currency === "CAD") {
      return amount / data.data.CAD ;
    }
    if (currency === "EUR") {
      return amount /data.data.EUR ;
    }
  } catch (err) {
    console.log(err);
  }
}

function AddExpense() {
  let amount = document.getElementById("amount");
  let type = document.getElementById("type");
  let currency = document.getElementById("currency");

  let exp = JSON.parse(localStorage.getItem("expense"))|| '[]';
  let check = getChecked();
  let item = {
    price: amount.value,
    currency: currency.options[currency.selectedIndex].value,
    name: type.value,
    category: check.value,
  };
  console.log(item);
  exp.push(item);
  Store(exp);
}
function getChecked() {
  let food = document.getElementById("food");
  let travel = document.getElementById("travel");
  let shop = document.getElementById("shop");
  if (food.checked == true) {
    return food;
  } else if (travel.checked == true) {
    return travel;
  } else {
    return shop;
  }
}
function Store(exp) {
  localStorage.setItem("expense", JSON.stringify(exp));
}
function displayExpense() {
  let exp = JSON.parse(localStorage.getItem("expense"));
  let container = document.getElementById("expenses");
  for (let i = 0; i < exp.length; i++) {
    let main = document.createElement("div");
    let left = document.createElement("div");
    let right = document.createElement("div");
    let text = document.createElement("div");
    let prices = document.createElement("div");
    let edit = document.createElement("div");
    let br = document.createElement("br");

    let icon = document.createElement("div");
    let edi = document.createElement("div");
    let del = document.createElement("div");

    let price = document.createElement("label");
    let name = document.createElement("label");
    let category = document.createElement("label");

    main.className = " container flex-between breakdown-contain";
    left.className = "container flex-even";
    right.className = "container flex-even";
    text.className = "expenses";

    prices.className = "breadown-price ";
    name.className = "breakdown-text1";
    category.className = "breakdown-text2";

    edit.className = " container flex-even";
    edi.className = "fa-solid fa-pen-to-square edit";
    del.className = "fa-solid fa-trash del";

    edi.id = exp[i].name;
    edi.addEventListener("click", function () {
      let popup = document.getElementById("myPopup");
      let btn = document.getElementsByClassName("popup-button");
      btn.id = edi.id;
      popup.classList.remove("hidden");
    });

    del.id = exp[i].name;
    del.addEventListener("click", function () {
      let exp = JSON.parse(localStorage.getItem("expense"));
      let newexp = [];
      for (let i = 0; i < exp.length; i++) {
        if (exp[i].name != del.id) {
          newexp.push(exp[i]);
        }
      }
      localStorage.setItem("expense", JSON.stringify(newexp));
      location.reload();
    });
    edit.appendChild(del);
    edit.appendChild(edi);

    if (exp[i].category == "Food") {
      icon.className = "fa-solid fa-utensils icons";
      name.innerText = exp[i].name;
      category.innerText = exp[i].category;
      price.innerText = " ~ " + exp[i].price + " " + exp[i].currency;

      text.appendChild(name);
      text.appendChild(br);
      text.appendChild(category);

      prices.appendChild(price);

      left.appendChild(icon);

      right.appendChild(prices);
      right.appendChild(edit);

      main.appendChild(left);
      main.appendChild(text);
      main.appendChild(right);

      container.appendChild(main);
    } else if (exp[i].category == "Transport") {
      icon.className = "fa-solid fa-car-side icons";

      name.innerText = exp[i].name;
      category.innerText = exp[i].category;
      price.innerText = " ~ " + exp[i].price + " " + exp[i].currency;

      text.appendChild(name);
      text.appendChild(br);
      text.appendChild(category);

      prices.appendChild(price);

      left.appendChild(icon);

      right.appendChild(prices);
      right.appendChild(edit);

      main.appendChild(left);
      main.appendChild(text);
      main.appendChild(right);

      container.appendChild(main);
    } else {
      icon.className = "fa-solid fa-cart-shopping icons";

      name.innerText = exp[i].name;
      category.innerText = exp[i].category;
      price.innerText = " ~ " + exp[i].price + " " + exp[i].currency;

      text.appendChild(name);
      text.appendChild(br);
      text.appendChild(category);

      prices.appendChild(price);

      left.appendChild(icon);

      right.appendChild(prices);
      right.appendChild(edit);

      main.appendChild(left);
      main.appendChild(text);
      main.appendChild(right);

      container.appendChild(main);
    }
  }
}

async function displayTotal() {
  let exp = JSON.parse(localStorage.getItem("expense"));
  let total = 0;
  for (let i = 0; i < exp.length; i++) {
    if (exp[i].currency == "USD") {
      total += parseInt(exp[i].price);
    } else {
      total += await convertTo(exp[i].currency, parseInt(exp[i].price));
    }
  }
  total = Math.round(total * 100) / 100;
  document.getElementById("total").innerText = total + "$";
  let expenses = ["Food", "Transport", "Misc"];
  let barColors = ["#E9FF70", "#0078BE", "#FF70A6"];
  let prices = [0, 0, 0];
  for (let i = 0; i < exp.length; i++) {
    if (exp[i].category == "Food") {
      if (exp[i].currency == "USD") {
        prices[0] += parseInt(exp[i].price);
      } else {
        prices[0] += await convertTo(exp[i].currency, parseInt(exp[i].price));
      }
    } else if (exp[i].category == "Transport") {
      if (exp[i].currency == "USD") {
        prices[1] += parseInt(exp[i].price);
      } else {
        prices[1] += await convertTo(exp[i].currency, parseInt(exp[i].price));
      }
    } else {
      if (exp[i].currency == "USD") {
        prices[2] += parseInt(exp[i].price);
      } else {
        prices[2] += await convertTo(exp[i].currency, parseInt(exp[i].price));
      }
    }
  }
  prices[0] = Math.round(prices[0] * 100) / 100;
  prices[1] = Math.round(prices[1] * 100) / 100;
  prices[2] = Math.round(prices[2] * 100) / 100;
  new Chart("myChart", {
    type: "pie",
    data: {
      labels: expenses,
      datasets: [
        {
          backgroundColor: barColors,
          data: prices,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Expense Chart",
      },
    },
  });
}
function AdjustExpense() {
  let exp = JSON.parse(localStorage.getItem("expense"));
  let item = document.getElementsByClassName("popup-button");
  let new_price = document.getElementById("amount-adjust");
  let new_type = document.getElementById("type-adjust");
  let index = 0;
  for (let i = 0; i < exp.length; i++) {
    if (exp[i].name == item.id) {
      index = i;
      break;
    }
  }
  exp[index].name = new_type.value;
  exp[index].price = new_price.value;
  localStorage.setItem("expense", JSON.stringify(exp));
}

GetCurrency();
