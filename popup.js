const fromUnitSelect = document.getElementById('fromUnit');
const toUnitSelect = document.getElementById('toUnit');
const valueInput = document.getElementById('value');
const resultDiv = document.getElementById('result');
const convertBtn = document.getElementById('convertBtn');

const modeUSRadio = document.getElementById('modeUS');
const modeEURadio = document.getElementById('modeEU');

const allowedConversions = {
  // first value in list is the default value

  lbs: ['kg', 'grams'],
  kg: ['lbs'],
  grams: ['lbs'],

  miles: ['km'],
  km: ['miles'],

  inches: ['cm', 'meters'],
  feet: ['cm', 'meters'],
  cm: ['inches', 'feet'],
  meters: ['inches', 'feet'],

  fahrenheit: ['celsius'],
  celsius: ['fahrenheit']
};

const conversions = {
  lbs_to_kg: v => v / 2.2046,
  kg_to_lbs: v => v * 2.2046,

  lbs_to_grams: v => v * 453.592,
  grams_to_lbs: v => v / 453.592,

  miles_to_km: v => v * 1.60934,
  km_to_miles: v => v / 1.60934,

  inches_to_cm: v => v * 2.54,
  cm_to_inches: v => v / 2.54,

  inches_to_meters: v => v * 0.0254,
  meters_to_inches: v => v / 0.0254,

  fahrenheit_to_celsius: v => (v - 32) * 5 / 9,
  celsius_to_fahrenheit: v => (v * 9 / 5) + 32
};

const unitNamesUS = {
  lbs: 'Фунты (lbs)',
  miles: 'Мили (miles)',
  feet: 'Футы (feet)',
  inches: 'Дюймы (inches)',
  fahrenheit: 'Фаренгейты (°F)'
};

const unitNamesEU = {
  kg: 'Килограммы (kg)',
  grams: 'Граммы (g)',
  km: 'Километры (km)',
  cm: 'Сантиметры (cm)',
  meters: 'Метры (m)',
  celsius: 'Цельсии (°C)'
};

const unitNames = {
  ...unitNamesUS,
  ...unitNamesEU
};

function populateSelect(selectElement, unitsObj) {
  selectElement.innerHTML = '';
  for (const [unit, label] of Object.entries(unitsObj)) {
    const option = document.createElement('option');
    option.value = unit;
    option.textContent = label;
    selectElement.appendChild(option);
  }
}

function updateUnitsByMode() {
  if (modeUSRadio.checked) {
    populateSelect(fromUnitSelect, unitNamesUS);
  } else {
    populateSelect(fromUnitSelect, unitNamesEU);
  }

  updateToUnitOptions();
}


function updateToUnitOptions() {
  const fromUnit = fromUnitSelect.value;

  toUnitSelect.innerHTML = '';

  if (fromUnit && !Object.hasOwn(allowedConversions, fromUnit)) {
    resultDiv.textContent = `Нельзя конвертировать из (${fromUnit}). Обратитесь в техподдержку.`
    return
  }
  const allowed = allowedConversions[fromUnit];

  allowed.forEach(unit => {
    const option = document.createElement('option');
    option.value = unit;
    option.textContent = unitNames[unit];
    toUnitSelect.appendChild(option);
  });

  if (allowed.length > 0) {
    toUnitSelect.value = allowed[0];
  }
}

function isValidNumber(str) {
  return /^\d*\.?\d+$/.test(str);
}

function convertFeetToInches(str){
  const match = str.match(/^(\d+)'?(\d|1[0-1])?"?$/)
  if (!match) return null;

  const feet = parseInt(match[1], 10);
  const inches = match[2] ? parseInt(match[2], 10) : 0;

  return feet * 12 + inches;
}

function convertInchesToFeet(totalInches) {
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}


convertBtn.addEventListener('click', () => {
  let fromUnit = fromUnitSelect.value;
  const toUnit = toUnitSelect.value;
  const valueStr = valueInput.value.trim();

  if (!valueStr) {
    resultDiv.textContent = 'Пожалуйста, введите значение.';
    return;
  }

  let value, actualFromUnit, actualToUnit;

  if (fromUnit === 'feet') {
    value = convertFeetToInches(valueStr);
    if (!value) {
      resultDiv.textContent = 'Пожалуйста, введите футы в правильном формате, например, 5\'11';
      return;
    }
    actualFromUnit = 'inches';
  } else {
    if (!isValidNumber(valueStr)){
      resultDiv.textContent = 'Пожалуйста, введите корректное число.';
      return;
    }
    value = parseFloat(valueStr);
    actualFromUnit = fromUnit;
  }

  if (toUnit === 'feet') {
    actualToUnit = 'inches';
  } else {
    actualToUnit = toUnit;
  }

  const key = `${actualFromUnit}_to_${actualToUnit}`;
  const convertFunc = conversions[key];

  if (!convertFunc) {
    resultDiv.textContent = 'Невозможно выполнить конвертацию между выбранными единицами.';
    return;
  }

  const converted = convertFunc(value);
  resultDiv.textContent = `${valueStr} ${unitNames[fromUnit]} = ${toUnit === 'feet' ? 
      convertInchesToFeet(converted) : converted.toFixed(2)} ${unitNames[toUnit]}`;
});


modeUSRadio.addEventListener('change', updateUnitsByMode);
modeEURadio.addEventListener('change', updateUnitsByMode);
fromUnitSelect.addEventListener('change', updateToUnitOptions);


window.addEventListener('DOMContentLoaded', updateUnitsByMode);
window.addEventListener('DOMContentLoaded', updateToUnitOptions);