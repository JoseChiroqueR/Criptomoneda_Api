const form = document.querySelector("#form-search");
const moneda = document.querySelector("#moneda");
const criptoMoneda = document.querySelector("#criptomonedas");
const formContainer = document.querySelector(".form-side");
const containerAnswer = document.querySelector(".container-answer");

const objSearch = {
  moneda: "",
  criptomoneda: "",
};

document.addEventListener("DOMContentLoaded", () => {
  callCriptos();

  form.addEventListener("submit", submitForm);
  moneda.addEventListener("change", getValue);
  criptoMoneda.addEventListener("change", getValue);
});

function submitForm(e) {
  e.preventDefault();
  const { moneda, criptomoneda } = objSearch;
  if (moneda === "" || criptomoneda === "") {
    showError("Seleccione ambos campos");
    return;
  }
  consultAPI(moneda, criptomoneda);
}

function consultAPI(moneda, criptomoneda) {
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
  fetch(url)
    .then((result) => result.json())
    .then((resultJson) => {
      showQuote(resultJson.DISPLAY[criptomoneda][moneda]);
    })
    .catch((error) => console.log(error));
}

function showQuote(data) {
  clearHTML();
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = data;
  const answer = document.createElement("div");
  answer.classList.add("display-info");
  answer.innerHTML = `
    <p class="main-price">Precio: <span>${PRICE}</span></p>
    <p>Precio más alto del día:: <span>${HIGHDAY}</span></p>
    <p>Precio más bajo del día: <span>${LOWDAY}</span></p>
    <p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>
    <p>Última Actualización: <span>${LASTUPDATE}</span></p>
  `;
  containerAnswer.appendChild(answer);
}

function showError(message) {
  const error = document.createElement("p");
  error.classList.add("error");
  error.textContent = message;
  formContainer.appendChild(error);
  setTimeout(() => error.remove(), 1500);
}

function getValue(e) {
  objSearch[e.target.name] = e.target.value;
}

function callCriptos() {
  const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

  fetch(url)
    .then((answer) => answer.json())
    .then((answerJson) => {
      selectCriptos(answerJson.Data);
    })
    .catch((error) => console.log("error"));
}

function selectCriptos(criptos) {
  criptos.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;
    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    criptoMoneda.appendChild(option);
  });
}

function clearHTML(){
  containerAnswer.innerHTML = "";
}
