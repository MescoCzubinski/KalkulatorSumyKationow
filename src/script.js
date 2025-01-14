function format(inputString) {
  return inputString
    .replace(/[^0-9.,]/g, "")
    .replace(/^0+(?=\d)/, "")
    .replace(/,/g, ".")
    .replace(/^\.($|[^0-9])/, "0.")
    .replace(/\.{2,}/g, ".")
    .replace(/(.*?\..*?)\./g, "$1")
    .replace(/(\d+\.\d{2})\d*/g, "$1")
    .replace(/[a-zA-Z]+/g, "");
}

document.querySelectorAll("input").forEach((inputField) => {
  inputField.addEventListener("input", (event) => {
    const input = event.target;
    input.value = format(input.value);
  });
});

const visitedElements = document.querySelectorAll("input, select");
visitedElements.forEach((input) => {
  input.addEventListener("blur", function () {
    if (this.value) {
      this.classList.add("visited");
    } else {
      this.classList.remove("visited");
    }
  });
});

const elementCa = document.querySelector("#Ca");
const elementMg = document.querySelector("#Mg");
const elementK = document.querySelector("#K");
const elementNa = document.querySelector("#Na");
const elementH = document.querySelector("#H");
const elementAl = document.querySelector("#Al");
const elementHh = document.querySelector("#Hh");

const elementSoilType = document.querySelector("#soil-type");
const elementSoilHeight = document.querySelector("#soil-height");

const elementCaResult = document.querySelector("#Ca-result");
const elementMgResult = document.querySelector("#Mg-result");
const elementKResult = document.querySelector("#K-result");
const elementNaResult = document.querySelector("#Na-result");
const elementHResult = document.querySelector("#H-result");

const elementResult1 = document.querySelector("#result1-container");
const elementResult2 = document.querySelector("#result2-container");
const elementResult3 = document.querySelector("#result3-container");

elementResult1.classList.add("hidden");
elementResult2.classList.add("hidden");
elementResult3.classList.add("hidden");

document.querySelectorAll("input").forEach((inputField) => {
  inputField.addEventListener("input", function () {
    let Ca = Number(elementCa.value) / 20.04;
    let Mg = Number(elementMg.value) / 12.155;
    let K = Number(elementK.value) / 39.1;
    let Na = Number(elementNa.value) / 22.99;
    let Hh = Number(elementHh.value);
    let H = Number(elementH.value);
    let Al = Number(elementAl.value);
    let sumZasad = Ca + Mg + K + Na;

    let sumKwas = 0;
    if (H !== 0 && Al !== 0) {
      sumKwas += H + Al;

      display(Ca / (sumZasad + sumKwas), "Ca", 0.8, 0.65);
      display(Mg / (sumZasad + sumKwas), "Mg", 0.15, 0.1);
      display(K / (sumZasad + sumKwas), "K", 0.05, 0.02);
      display(Na / (sumZasad + sumKwas), "Na", 0.02, 0);
      display((H + Al) / (sumZasad + sumKwas), "H", 0.15, 0);
      displayRegulations(Ca / (sumZasad + sumKwas), "Ca", 75, sumZasad + sumKwas, 20.04, 1.399);
      displayRegulations(Mg / (sumZasad + sumKwas), "Mg", 15, sumZasad + sumKwas, 12.155, 1.658);

      elementResult1.classList.remove("hidden");
      elementResult2.classList.remove("hidden");
      elementResult3.classList.remove("hidden");
    } else {
      display(Ca / (sumZasad + sumKwas), "Ca", 0.8, 0.65);
      display(Mg / (sumZasad + sumKwas), "Mg", 0.15, 0.1);
      display(K / (sumZasad + sumKwas), "K", 0.05, 0.02);
      display(Na / (sumZasad + sumKwas), "Na", 0.02, 0);
      display(Hh / (sumZasad + sumKwas), "H", 0.15, 0);
      displayRegulations(Ca / (sumZasad + sumKwas), "Ca", 75, sumZasad + sumKwas, 20.04, 1.399);
      displayRegulations(Mg / (sumZasad + sumKwas), "Mg", 15, sumZasad + sumKwas, 12.155, 1.658);

      elementResult1.classList.remove("hidden");
      elementResult2.classList.remove("hidden");
      elementResult3.classList.remove("hidden");
    }
  });
});
function display(value, name, x, y) {
  const element = document.querySelector("#" + name + "-result");
  if (value > x) {
    element.classList.remove("green");
    element.classList.remove("blue");
    element.classList.add("red");
  } else if (value < y) {
    element.classList.remove("green");
    element.classList.remove("red");
    element.classList.add("blue");
  } else {
    element.classList.remove("red");
    element.classList.remove("blue");
    element.classList.add("green");
  }
  element.innerHTML = (Math.round(value * 1000) / 10).toString() + " %";
}
function displayRegulations(value, name, x, pojWym, multiplyer1, multiplyer2) {
  const elementCel = document.querySelector("#" + name + "-cel");
  const elementIlosc = document.querySelector("#" + name + "-ilosc");
  const elementDawkaMg = document.querySelector("#" + name + "-dawka-mg");
  const elementDawkaKg = document.querySelector("#" + name + "-dawka-kg");
  const elementDawkaKgO = document.querySelector("#" + name + "-dawka-kg-O");

  soil = Number(elementSoilHeight.value) * Number(elementSoilType.value) * 100;

  value = Math.round(value * 1000) / 10;
  elementCel.innerHTML = Math.round((x - value) * 100) / 100;
  elementIlosc.innerHTML = Math.round((x - value) * pojWym) / 100;
  elementDawkaMg.innerHTML = ((x - value) * pojWym * multiplyer1) / 100;
  elementDawkaKg.innerHTML = ((x - value) * pojWym * multiplyer1 * soil) / 100000;
  elementDawkaKgO.innerHTML = (((x - value) * pojWym * multiplyer1 * soil) / 100000) * multiplyer2;
}

document.querySelector("#reset-section").addEventListener("click", function () {
  const elements = [elementHh, elementH, elementAl];
  for (element of elements) {
    element.value = null;
    element.disabled = false;
    element.classList.remove("visited");
  }

  elementHh.placeholder = "Wartość Hh";
  elementH.placeholder = "H^+";
  elementAl.placeholder = "Al^3+";
});
