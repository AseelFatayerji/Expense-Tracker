async function GetCurrency() {
  const res = await fetch(
    "https://ivory-ostrich-yoke.cyclic.app/students/available"
  )
    .then(function (response) {
      const currency = response.json();
      currency
        .then(function (ans) {
          document.getElementById("USD").innerText = ans[0].symbol;
          document.getElementById("Euro").innerText = ans[1].symbol;
          document.getElementById("UAE").innerText = ans[2].symbol;
          document.getElementById("LBP").innerText = ans[3].symbol;
        })
        .catch(function (err) {
          console.log(err);
        });
    })
    .catch(function (err) {
      console.log(err);
    });
}
window.onload = () => {
  console.log("onload " + JSON.parse(localStorage.getItem("expense"), "[]"));
  if (localStorage.getItem("expense") == null) {
    let empty = [];
    localStorage.setItem("expense", JSON.stringify(empty));
    return;
  }
  displayTotal();
  displayExpense();
};

function AddExpense() {
  let amount = document.getElementById("amount");
  let type = document.getElementById("type");
  let currency = document.getElementById("currency");

  let exp = JSON.parse(localStorage.getItem("expense"));
  let check = getChecked();
  let item = {
    price: amount.value,
    currency: currency.options[currency.selectedIndex].text,
    name: type.value,
    category: check.value,
  };
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
    return {
      shop,
    };
  }
}
function Store(exp) {
  localStorage.setItem("expense", JSON.stringify(exp));
}
function displayExpense() {
  let exp = JSON.parse(localStorage.getItem("expense"));
  console.log("display " + exp);
  let container = document.getElementById("expenses");
  for (let i = 0; i < exp.length; i++) {
    let main = document.createElement("div");
    let symbol = document.createElement("div");
    let text = document.createElement("div");
    let prices = document.createElement("div");
    let edit = document.createElement("div");
    let br = document.createElement("br");

    let icon = document.createElement("i");
    let edi = document.createElement("i");
    let del = document.createElement("i");

    let price = document.createElement("label");
    let name = document.createElement("label");
    let category = document.createElement("label");

    main.className = " container flex-around breakdown-contain";
    symbol.className = "child";
    price.className = "breadown-price child";
    name.className = "breakdown-text1";
    category.className = "breakdown-text2";
    edit.className = " container flex-even child";
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
      price.innerText = " ~ " + exp[i].currency + " " + exp[i].price;

      symbol.appendChild(icon);
      text.appendChild(name);
      text.appendChild(br);
      text.appendChild(category);
      main.appendChild(icon);
      main.appendChild(text);
      main.appendChild(prices);
      main.appendChild(edit);
      container.appendChild(main);
    } else if (exp[i].category == "Transport") {
      icon.className = "fa-solid fa-car-side icons";

      name.innerText = exp[i].name;
      category.innerText = exp[i].category;
      price.innerText = " ~ " + exp[i].currency + " " + exp[i].price;

      symbol.appendChild(icon);
      text.appendChild(name);
      text.appendChild(br);
      text.appendChild(category);
      main.appendChild(icon);
      main.appendChild(text);
      main.appendChild(prices);
      main.appendChild(edit);
      container.appendChild(main);
    } else {
      icon.className = "fa-solid fa-cart-shopping icons";

      name.innerText = exp[i].name;
      category.innerText = exp[i].category;
      price.innerText = " ~ " + exp[i].currency + " " + exp[i].price;

      symbol.appendChild(icon);
      text.appendChild(name);
      text.appendChild(br);
      text.appendChild(category);
      main.appendChild(icon);
      main.appendChild(text);
      main.appendChild(prices);
      main.appendChild(edit);
      container.appendChild(main);
    }
  }
}

function displayTotal() {
  let exp = JSON.parse(localStorage.getItem("expense"));
  console.log("display total " + exp);
  let total = 0;
  for (let i = 0; i < exp.length; i++) {
    total += parseInt(exp[i].price);
  }
  document.getElementById("total").innerText = total + "$";
  let expenses = ["Food", "Transport", "Misc"];
  let barColors = ["yellow", "blue", "red"];
  let prices = [];
  for (let i = 0; i < exp.length; i++) {
    if (exp[i].category == "Food") {
      prices[0] += parseInt(exp[i].price);
    } else if (exp[i].category == "Transport") {
      prices[1] += parseInt(exp[i].price);
    } else {
      prices[2] += parseInt(exp[i].price);
    }
  }
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
  console.log(exp);
  localStorage.setItem("expense", JSON.stringify(exp));
}
GetCurrency();
