const form = document.querySelector('.temp-converter-form');
const input = document.getElementById('temp-converter-input');
const fromSelect = document.getElementById('temp-convert-from');
const toSelect = document.getElementById('temp-convert-to');
const result = document.getElementById('temp-converter-rezult');

let rotationAngle = 0;

function rotateImage() {
  const image = document.getElementById("rotateButton");
  rotationAngle += 180;
  image.style.transform = "rotate(" + rotationAngle + "deg)";
  return rotationAngle;
}

function tempConvert(fromUnit, toUnit) {
  const temperature = parseFloat(input.value);

  if (isNaN(temperature)) {
    result.textContent = 'Пожалуйста, введите числовое значение температуры';
    return;
  }

  let convertedTemperature;

  if (fromUnit === 'Celsius' && toUnit === 'Fahrenheit') {
    convertedTemperature = (temperature * 9/5) + 32;
  } else if (fromUnit === 'Fahrenheit' && toUnit === 'Celsius') {
    convertedTemperature = (temperature - 32) * 5/9;
  } else {
    result.textContent = 'Пожалуйста, выберите разные единицы измерения для конвертации';
    return;
  }

  result.textContent = convertedTemperature.toFixed(2) + '° ' + toUnit.slice(0,1);
}

function directTempConvert() {
  const fromUnit = fromSelect.value;
  const toUnit = toSelect.value;
  tempConvert(fromUnit, toUnit);
}

function reverseTempConvert() {
  const fromUnit = toSelect.value;
  const toUnit = fromSelect.value;
  tempConvert(fromUnit, toUnit);
}

function tempConvertFunc() {
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    if (rotationAngle === 0 || rotationAngle % 360 === 0) {
      directTempConvert();
    } else {
      reverseTempConvert();
    }
  });
}

tempConvertFunc();