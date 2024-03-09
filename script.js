window.onload = () => {
  if (localStorage.getItem("expense") == null) {
    return;
  }
  displayTotal()
  displayExpense();
};

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


GetCurrency();
