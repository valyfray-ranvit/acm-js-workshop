const text = document.getElementById("text");
const Fahrenheit = document.getElementById("toCelsius");
const Celsius = document.getElementById("toFahrenheit");
const Result = document.getElementById("result")
let temp;

function convert() {

    if (toFahrenheit.checked) {
        temp = Number(text.value);
        temp = temp * (9 / 5) + 32;
        Result.textContent = temp.toFixed(2) + "°F"
    }
    else if (toCelsius.checked) {
        temp = Number(text.value);
        temp = (temp - 32) * (5 / 9);
        Result.textContent = temp.toFixed(2) + "°C"
    }
    else {
        Result.textContent = "Select A Unit";
    }
}