let display = document.getElementById("display");
let isOn = true;

if (display) display.value = isOn ? "0" : "";

function start() {
    isOn = true;
    if (display) display.value = "0";
}

function shuttdown() {
    isOn = false;
    if (display) display.value = "";
}

function cleardisplay() {
    if (!isOn) return;
    if (display) display.value = "0";
}

function deletenumber() {
    if (!isOn) return;
    if (!display) return;
    display.value = display.value.slice(0, -1);
    if (display.value === "") display.value = "0";
}

function appendToDisplay(value) {
    if (!isOn) return;
    if (!display) return;

    const operators = ["+", "-", "*", "/", ".", "%"];
    const lastChar = display.value.slice(-1);

    // Replace leading zero when entering a number
    if (display.value === "0" && /^\d+$/.test(value)) {
        display.value = value;
        return;
    }

    // Prevent two consecutive operators (replace last operator)
    if (operators.includes(value) && operators.includes(lastChar)) {
        display.value = display.value.slice(0, -1) + value;
        return;
    }

    display.value += value;
}

function calculate() {
    if (!isOn) return;
    if (!display) return;

    try {
        let expression = display.value;
        // Convert percent signs to division by 100
        expression = expression.replace(/%/g, "/100");
        // Basic safety: allow only numbers, operators and parentheses
        if (!/^[0-9+\-*/().\s%]+$/.test(display.value)) {
            display.value = "Syntax error";
            return;
        }
        let result = eval(expression);
        display.value = result;
    } catch (e) {
        display.value = " Syntax error";
    }
}

// Attach event listeners to keys
document.querySelectorAll('.key').forEach(btn => {
    const value = btn.dataset.value;
    const action = btn.dataset.action;
    if (value !== undefined) {
        btn.addEventListener('click', () => appendToDisplay(value));
    } else if (action) {
        if (action === 'clear') btn.addEventListener('click', cleardisplay);
        if (action === 'delete') btn.addEventListener('click', deletenumber);
        if (action === 'off') btn.addEventListener('click', shuttdown);
        if (action === 'on') btn.addEventListener('click', start);
        if (action === 'equals') btn.addEventListener('click', calculate);
    }
});

// Also wire the special IDs for backward compatibility
const ac = document.getElementById('ac');
if (ac) ac.addEventListener('click', cleardisplay);
const del = document.getElementById('del');
if (del) del.addEventListener('click', deletenumber);
const onBtn = document.getElementById('on');
if (onBtn) onBtn.addEventListener('click', start);
const offBtn = document.getElementById('off');
if (offBtn) offBtn.addEventListener('click', shuttdown);
const eq = document.getElementById('equals');
if (eq) eq.addEventListener('click', calculate);
