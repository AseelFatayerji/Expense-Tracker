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
