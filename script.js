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
    console.log("onload "+localStorage.getItem("expense"));
    if (localStorage.getItem("expense") == null) {
        let empty = [];
        localStorage.setItem("expense",JSON.stringify(empty));        
      return;
    }    
    displayTotal();
    displayExpense();
  };
  

  
  function AddExpense() {
    let amount = document.getElementById("amount");
    let type = document.getElementById("type");
    let food = document.getElementById("food");
    let travel = document.getElementById("travel");
    let shop = document.getElementById("shop");
    let currency = document.getElementById("currency");
  
    let exp = JSON.parse(localStorage.getItem("expense"));
    if (food.checked == true) {
        let item = {
          price: amount.value,
          currency: currency.options[currency.selectedIndex].text,
          name: type.value,
          category: food.innerText,
        };
        exp.push(item);
      } else if (travel.checked == true) {
        let item = {
          price: amount.value,
          currency: currency.options[currency.selectedIndex].text,
          name: type.value,
          category: travel.innerText,
        };
        exp.push(item);
      } else if (shop.checked == true) {
        let item = {
          price: amount.value,
          currency: currency.options[currency.selectedIndex].text,
          name: type.value,
          category: shop.value,
        };
        exp.push(item);
        
      }    
    Store(exp)
  }
  function Store(exp){
    localStorage.setItem("expense",JSON.stringify(exp));
  }
  function displayExpense() {
    let exp = JSON.parse(localStorage.getItem("expense"));  
    console.log("display "+exp);
    let container = document.getElementById("expenses");
    for (let i = 0; i < exp.length; i++) {
      let main = document.createElement("div");
      let symbol = document.createElement("div");
      let text = document.createElement("div");
      let prices = document.createElement("div");
      let edit = document.createElement("div");
  
      let icon = document.createElement("i");
      let edi = document.createElement("a");
      let del = document.createElement("a");
  
      let price = document.createElement("label");
      let name = document.createElement("label");
      let category = document.createElement("label");
  
      main.className = " container flex-around";
      price.className = "breadown-price";
      name.className = "breakdown-text1";
      category.className = "breakdown-text2";
      edit.className = " container flex-even";
      edi.className = "fa-solid fa-pen-to-square edit";
      del.className = "fa-solid fa-trash del";
  
      del.id = exp[i].name;
      del.onclick = removeExpense(del.id);
      edit.appendChild(del);
      edit.appendChild(edi);
  
      if (exp[i].category == "Food") {
        icon.className = "fa-solid fa-utensils icon";
        name.innerText = exp[i].name;
        category.innerText = exp[i].category;
        price.innerText = " ~ " + exp[i].currency + " " + exp[i].price;
  
        symbol.appendChild(icon);
        text.appendChild(name);
        text.appendChild(category);
        main.appendChild(icon);
        main.appendChild(text);
        main.appendChild(prices);
        main.appendChild(edit);
        container.appendChild(main);
      } else if (exp[i].category == "Transport") {
        icon.className = "fa-solid fa-car-side icon";
  
        name.innerText = exp[i].name;
        category.innerText = exp[i].category;
        price.innerText = " ~ " + exp[i].currency + " " + exp[i].price;
  
        symbol.appendChild(icon);
        text.appendChild(name);
        text.appendChild(category);
        main.appendChild(icon);
        main.appendChild(text);
        main.appendChild(prices);
        main.appendChild(edit);
        container.appendChild(main);
      } else {
        icon.className = "fa-solid fa-cart-shopping icon";
  
        name.innerText = exp[i].name;
        category.innerText = exp[i].category;
        price.innerText = " ~ " + exp[i].currency + " " + exp[i].price;
  
        symbol.appendChild(icon);
        text.appendChild(name);
        text.appendChild(category);
        main.appendChild(icon);
        main.appendChild(text);
        main.appendChild(prices);
        main.appendChild(edit);
        container.appendChild(main);
      }
    }
  }
  
  function removeExpense(item) {
    let exp = JSON.parse(localStorage.getItem("expense"));
    let newexp = [];
    for (let i = 0; i < exp.length; i++) {
      if (exp[i].name != item) {
        newexp.push(exp[i]);
      }
    }
    localStorage.setItem("expense", JSON.stringify(newexp));
  }
  
  function displayTotal() {
    let exp = JSON.parse(localStorage.getItem("expense"));
    console.log("display total "+exp);
    let total = 0;
    for (let i = 0; i < exp.length; i++) {
      total += parseInt(exp[i].price);
    }
    document.getElementById("total").innerText = total + "$";
  }
  GetCurrency();
  