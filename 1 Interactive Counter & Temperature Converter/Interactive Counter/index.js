
const incrBtn = document.getElementById("incrBtn");
const decrBtn = document.getElementById("decrBtn");
const resetBtn = document.getElementById("resetBtn");
const countLabel = document.getElementById("countLabel");

let counter = 0;

incrBtn.onclick = function () {
    counter++;
    countLabel.textContent = counter;
}

decrBtn.onclick = function () {
    counter--;
    countLabel.textContent = counter;
}

resetBtn.onclick = function () {
    counter = 0;
    countLabel.textContent = counter;
}