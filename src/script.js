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
const elementCorg = document.querySelector("#corg");

const elementSorbSum = document.querySelector("#sorb-sum-result");
const elementSoilResult = document.querySelector("#soil-result");
const elementSoilPercentResult = document.querySelector("#soil-percent-result");

const elementCaResult = document.querySelector("#Ca-result");
const elementMgResult = document.querySelector("#Mg-result");
const elementKResult = document.querySelector("#K-result");
const elementNaResult = document.querySelector("#Na-result");
const elementHResult = document.querySelector("#H-result");

const elementUnitSelector = document.querySelector("#unit-selector");
const elementMgUnit = document.querySelector("#Mg-unit");
const elementKUnit = document.querySelector("#K-unit");
const elementNaUnit = document.querySelector("#Na-unit");

const elementResult1 = document.querySelector("#result1-container");
const elementResult2 = document.querySelector("#result2-container");
const elementResult3 = document.querySelector("#result3-container");
const elementResultCa = document.querySelector("#result-Ca-container");
const elementResultMg = document.querySelector("#result-Mg-container");
const elementResultK = document.querySelector("#result-K-container");
const elementResultHumus = document.querySelector("#humus-container");

const elementCaPrzekroczony = document.querySelector("#Ca-cel-przekroczony");
const elementMgPrzekroczony = document.querySelector("#Mg-cel-przekroczony");
const elementKPrzekroczony = document.querySelector("#K-cel-przekroczony");

elementResult1.classList.add("hidden");
elementResult2.classList.add("hidden");
elementResult3.classList.add("hidden");
elementResultCa.classList.add("hidden");
elementResultMg.classList.add("hidden");
elementResultK.classList.add("hidden");
elementResultHumus.classList.add("hidden");
elementCaPrzekroczony.classList.add("hidden");
elementMgPrzekroczony.classList.add("hidden");
elementKPrzekroczony.classList.add("hidden");

document.querySelectorAll("input, select").forEach((inputField) => {
  inputField.addEventListener("input", function () {
    let Ca = Number(elementCa.value);
    let Mg = Number(elementMg.value);
    let K = Number(elementK.value);
    let Na = Number(elementNa.value);
    let Hh = Number(elementHh.value);
    let H = Number(elementH.value);
    let Al = Number(elementAl.value);
    if(elementUnitSelector.value === "mg/100 g"){
      Ca /= 20.04;
      Mg /= 12.155;
      K /= 39.1;
      Na /= 22.99;
    }
    let sumZasad = Ca + Mg + K + Na;

    let sumKwas = 0;
    if (H !== 0 && Al !== 0 && isNotNull(Ca, Mg, K, Na)) {
      sumKwas += H + Al;
      displayAll(Ca, Mg, K, Na, Hh, sumZasad, sumKwas)
      displayMain(sumKwas / (sumZasad + sumKwas), "H", 0.15, 0);
    } else if (Hh !== 0 && isNotNull(Ca, Mg, K, Na)) {
      sumKwas += Hh;
      displayAll(Ca, Mg, K, Na, Hh, sumZasad, sumKwas)
      displayMain(Hh / (sumZasad + sumKwas), "H", 0.15, 0);
    }
    elementSorbSum.innerHTML = sumZasad.toFixed(2).toString() + " mmol/100 g";
    elementSoilResult.innerHTML = (sumZasad + sumKwas).toFixed(2).toString() + " mmol/100 g";
    elementSoilPercentResult.innerHTML = ((sumZasad / (sumZasad + sumKwas)) * 100).toFixed(1).toString() + "%";
  });
});
elementUnitSelector.addEventListener('change', (event)=>{
  let unit = event.target.value;
  elementMgUnit.innerHTML = unit;
  elementKUnit.innerHTML = unit;
  elementNaUnit.innerHTML = unit;
})
function displayAll(Ca, Mg, K, Na, Hh, sumZasad, sumKwas){
  displayMain(Ca / (sumZasad + sumKwas), "Ca", 0.8, 0.65);
  displayMain(Mg / (sumZasad + sumKwas), "Mg", 0.15, 0.1);
  displayMain(K / (sumZasad + sumKwas), "K", 0.05, 0.02);
  displayMain(Na / (sumZasad + sumKwas), "Na", 0.02, 0);
  displayRegulations(Ca / (sumZasad + sumKwas), "Ca", sumZasad + sumKwas, 20.04, 1.399);
  displayRegulations(Mg / (sumZasad + sumKwas), "Mg", sumZasad + sumKwas, 12.155, 1.658);
  displayRegulations(K / (sumZasad + sumKwas), "K", sumZasad + sumKwas, 39.1, 1.205);
  if(elementUnitSelector.value === "mg/100 g"){
    Ca *= 20.04;
    Mg *= 12.155;
    K *= 39.1;
    Na *= 22.99;
  }
  displaySoil(Ca, "Ca", 1.399);
  displaySoil(Mg, "Mg", 1.658);
  displaySoil(K, "K", 1.205);
  displaySoil(Na, "Na", 0);
  displayHumus();

  elementResult1.classList.remove("hidden");
  elementResult2.classList.remove("hidden");
  elementResult3.classList.remove("hidden");
}

function isNotNull(Ca, Mg, K, Na) {
  if (Ca !== 0 && Mg !== 0 && K !== 0 && Na !== 0 && Number(elementSoilType.value) !== 0) {
    return true;
  }
}
function displayMain(value, name, x, y) {
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
function displayRegulations(value, name, pojWym, multiplyer1, multiplyer2) {
  const elementCel = document.querySelector("#" + name + "-cel");
  const elementInput = document.querySelector("#" + name + "-cel-input");
  const elementIlosc = document.querySelector("#" + name + "-ilosc");
  const elementDawkaKgO = document.querySelector("#" + name + "-dawka-kg-O");

  soil = Number(elementSoilHeight.value) * Number(elementSoilType.value) * 100;
  x = Number(elementInput.value) * 100;

  result = x - value * 100;
  if (result >= 0) {
    document.querySelector("#" + name + "-cel-przekroczony").classList.add("hidden");
    document.querySelector("#result-" + name + "-container").classList.remove("hidden");
  } else {
    document.querySelector("#result-" + name + "-container").classList.add("hidden");
    document.querySelector("#" + name + "-cel-przekroczony").classList.remove("hidden");
  }

  elementCel.innerHTML = result.toFixed(1) + " %";
  result *= pojWym / 100;
  elementIlosc.innerHTML = result.toFixed(2) + " cmol(+)/kg";
  result *= multiplyer1;
  result *= soil / 1000;
  result *= multiplyer2;
  if (name === "K") {
    elementDawkaKgO.innerHTML = result.toFixed(2) + " kg/ha " + name + "<sub>2</sub>O";
  } else {
    elementDawkaKgO.innerHTML = result.toFixed(2) + " kg/ha " + name + "O";
  }
}
function displaySoil(value, name, multiplyer) {
  const element = document.querySelector("#" + name + "-gleba");
  soil = Number(elementSoilHeight.value) * Number(elementSoilType.value) * 100;

  element.innerHTML = ((value * soil) / 100000).toFixed(2) + " t/ha";

  if (multiplyer) {
    const elementO = document.querySelector("#" + name + "-gleba-O");
    elementO.innerHTML = (((value * soil) / 100000) * multiplyer).toFixed(2) + " t/ha";
  }
}
function displayHumus() {
  if (Number(elementCorg.value) !== 0) {
    elementResultHumus.classList.remove("hidden");
    document.querySelector("#humus").innerHTML = (Number(elementCorg.value) * 1.724).toFixed(2) + " %";
  }
}

document.querySelector("#reset").addEventListener("click", function () {
  const elementsToClean = [document.querySelector("#Ca"), document.querySelector("#Mg"), document.querySelector("#K"), document.querySelector("#Na"), document.querySelector("#H"), document.querySelector("#Al"), document.querySelector("#Hh"), document.querySelector("#corg"), document.querySelector("#Ca-result"), document.querySelector("#Mg-result"), document.querySelector("#K-result"), document.querySelector("#Na-result"), document.querySelector("#H-result")];

  elementsToClean.forEach((element) => {
    element.value = null;
    element.innerHTML = "";
    element.classList.remove("visited");
  });

  elementSoilType.value = "0";
  elementSoilType.classList.remove("visited");
  elementSoilHeight.value = "30";
  elementSoilHeight.classList.remove("visited");
  elementUnitSelector.value = "mg/100 g";
  elementUnitSelector.classList.remove("visited");
  elementMgUnit.innerHTML = "mg/100 g";
  elementKUnit.innerHTML = "mg/100 g";
  elementNaUnit.innerHTML = "mg/100 g";

  elementResult1.classList.add("hidden");
  elementResult2.classList.add("hidden");
  elementResult3.classList.add("hidden");
  elementResultCa.classList.add("hidden");
  elementResultMg.classList.add("hidden");
  elementResultK.classList.add("hidden");
  elementResultHumus.classList.add("hidden");
  elementCaPrzekroczony.classList.add("hidden");
  elementMgPrzekroczony.classList.add("hidden");
  elementKPrzekroczony.classList.add("hidden");
});
