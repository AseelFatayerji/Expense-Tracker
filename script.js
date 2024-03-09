async function GetCurrency() {
  const res = await fetch(
    "https://ivory-ostrich-yoke.cyclic.app/students/available"
  )
    .then(function (response) {
      const currency = response.json();
      currency
        .then(function (ans) {
          console.log(ans);
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
async function convertTo(currency, amount) {
  const convert = await fetch(
    "https://ivory-ostrich-yoke.cyclic.app/students/convert/",
    {
      method: "POST",
      body: JSON.stringify({ from: currency, to: "USD", amount: amount }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    // .then(function (response) {
    //   const result = response.json();
    //   result
    //     .then(function (ans) {
    //       console.log(ans);
    //       return ans;
    //     })
    //     .catch(function (err) {
    //       console.log(err);
    //     });
    // })
    // .catch(function (err) {
    //   console.log(err);
    // });
    const content = await convert.json();
    return await content;  
}

window.onload = () => {
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
    currency: currency.options[currency.selectedIndex].value,
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

    let icon = document.createElement("i");
    let edi = document.createElement("i");
    let del = document.createElement("i");

    let price = document.createElement("label");
    let name = document.createElement("label");
    let category = document.createElement("label");

    main.className = " container flex-between breakdown-contain";
    left.className = "container flex-even";
    right.className = "container flex-even";

    price.className = "breadown-price ";
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
      price.innerText = " ~ " + exp[i].currency + " " + exp[i].price;

      text.appendChild(name);
      text.appendChild(br);
      text.appendChild(category);

      left.appendChild(icon);
      left.appendChild(text);

      right.appendChild(prices);
      right.appendChild(edit);

      main.appendChild(left);
      main.appendChild(right);

      container.appendChild(main);
    } else if (exp[i].category == "Transport") {
      icon.className = "fa-solid fa-car-side icons";

      name.innerText = exp[i].name;
      category.innerText = exp[i].category;
      price.innerText = " ~ " + exp[i].currency + " " + exp[i].price;

      text.appendChild(name);
      text.appendChild(br);
      text.appendChild(category);

      left.appendChild(icon);
      left.appendChild(text);

      right.appendChild(prices);
      right.appendChild(edit);

      main.appendChild(left);
      main.appendChild(right);

      container.appendChild(main);
    } else {
      icon.className = "fa-solid fa-cart-shopping icons";

      name.innerText = exp[i].name;
      category.innerText = exp[i].category;
      price.innerText = " ~ " + exp[i].currency + " " + exp[i].price;

      text.appendChild(name);
      text.appendChild(br);
      text.appendChild(category);

      left.appendChild(icon);
      left.appendChild(text);

      right.appendChild(prices);
      right.appendChild(edit);

      main.appendChild(left);
      main.appendChild(right);

      container.appendChild(main);
    }
  }
}

async function displayTotal() {
  let exp = JSON.parse(localStorage.getItem("expense"));
  let total = 0;

  for (let i = 0; i < exp.length; i++) {
    total += await convertTo(exp[i].currency, exp[i].price);
  }
  total = Math.round(total* 100) / 100;
  document.getElementById("total").innerText = total + "$";
  let expenses = ["Food", "Transport", "Misc"];
  let barColors = ["#E9FF70", "#0078BE", "#FF70A6"];
  let prices = [0, 0, 0];
  for (let i = 0; i < exp.length; i++) {
    if (exp[i].category == "Food") {
      prices[0] += await convertTo(exp[i].currency, exp[i].price);
    } else if (exp[i].category == "Transport") {
      prices[1] += await convertTo(exp[i].currency, exp[i].price);
    } else {
      prices[2] += await convertTo(exp[i].currency, exp[i].price);
    }
  }
  prices[0] =Math.round(prices[0] * 100) / 100;
  prices[1] =Math.round(prices[1] * 100) / 100;
  prices[2] =Math.round(prices[2] * 100) / 100;
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
