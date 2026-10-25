// Extract list of show btn

const displayBtn = document.querySelectorAll('.show-btn');
const labelData = document.getElementById("label-data");
const showData = document.getElementById("show-data");
const btnList = document.querySelectorAll(".btn");

let storeData = ""
let checkType;
let previousCheckType ="number";
const MAX_LENGTH = 20;

// after result next number join the result not do operation like 9+7 ---> 16 press 5 so 
// result is 165 but we don't need this so it replace the full number
let justCalculated = false;

function updateDisplay(){
    showData.innerHTML = storeData.length ? storeData : "0";
    adjustFontSize();
}

// set font size of result
function adjustFontSize() {
    const len = storeData.length;

    if (len <= 8) {
        showData.style.fontSize = "3rem";
    } else if (len <= 12) {
        showData.style.fontSize = "2.5rem";
    } else if (len <= 16) {
        showData.style.fontSize = "2rem";
    } else {
        showData.style.fontSize = "1.6rem";
    }
}

function displayNumber(value,type){
    if(justCalculated){
            storeData = "";
            labelData.innerHTML = "00";
            justCalculated = false;

           }
           const currentNumber = storeData.split(/[+\-*/%]/).pop();

           // it replace the number who start with zero(0) like 005 ---> 5
           if(currentNumber === '0'){

            storeData = storeData.slice(0,-currentNumber.length);
            storeData += value;
           }
           else{
            storeData += value;
           }
           previousCheckType = type;
}

function displayOperator(value,type){
    if(justCalculated) justCalculated = false;
    if(previousCheckType === "operator") {
         storeData = storeData.slice(0,-1);
         storeData += storeData.length > 0 ? value : `0${value}`;
    }
    else{
        storeData += storeData.length > 0 ? value : `0${value}`
    }
    previousCheckType = type;
}

function displayDecimal(value,type){
        if(justCalculated) justCalculated = false;
        if(previousCheckType === "operator" ) {
           storeData += `0${value}`;
        }
        else{
            // last number check that it includes any (.) decimal already or not
            const currentNumber = storeData.split(/[+\-*/%]/).pop();
            if(currentNumber.includes(".")) return;
            else{
               storeData += storeData.length === 0 ? `0${value}` : `${value}`
               
            }
            
        }
        previousCheckType = type;
}

// Show Data
displayBtn.forEach( (e) => {
    e.addEventListener( 'click', () => {
        
        checkType = e.dataset.type;
        if(storeData.length >= MAX_LENGTH) return;

        // number btn click
        if(checkType === "number" ){
           displayNumber(e.dataset.value,checkType);
        }

        // operator button click
        else if(checkType === "operator"){
           displayOperator(e.dataset.value,checkType)
            
        }

        // decimal button click
        else if( checkType === "decimal"){
            displayDecimal(e.dataset.value,checkType)
        }
        updateDisplay()

    })
})

/*    ====    All Clear Button   ====     */

function allClearBtn(){
    storeData = ""
    updateDisplay()
    previousCheckType = "number"
    justCalculated = false
}

const allClear = document.getElementById("allClear");
allClear.addEventListener("click", () => {
    allClearBtn()
})

/*    =====      Delete Button     =====      */

function delLast(){
    storeData = storeData.slice(0,-1);

    // it's update the previousCheck because user click on operators but after delete btn click
    // so last previousCheck get the last index data-value
    if(storeData.length === 0) previousCheckType = "number";
    else{
        const lastChar = storeData[storeData.length-1];

        // last index is operator
        if(["+", "-", "*", "/", "%"].includes(lastChar)){
            previousCheckType = "operator";
        }

        // last index is decimal
        else if(lastChar === "."){
            previousCheckType = "decimal";
        }

        // last index is number
        else{
            previousCheckType = "number";
        }
    }
}

const delBtn = document.getElementById("delBtn");
delBtn.addEventListener("click", () =>{
    delLast()
    updateDisplay()
})

/*       ====       Equal Button       ====       */

function calculateResult(){
    // show result in label
    let expression = storeData;
    labelData.innerHTML = `${expression}=`
    try{
        let result = eval(storeData);

        // add resutl to storedata because user continue their operations on results
        storeData = result.toString();
        updateDisplay()
        previousCheckType = "number";
        justCalculated = true
    }
    catch{
        showData.innerHTML = "Error"
        disableButtons()
        setTimeout(() => {
           storeData = ""
           updateDisplay()
           previousCheckType = "number" 
           enableButtons()
           justCalculated = false;
        }, 1000);
        
    }
}


const equalBtn = document.getElementById("equalBtn");

equalBtn.addEventListener("click", () => {
    
    calculateResult()
})

function disableButtons(){
    btnList.forEach( (btn) =>{
       btn.disabled = true;
       btn.classList.add("disable")
    })
}

function enableButtons(){
    btnList.forEach( (btn) =>{
       btn.disabled = false;
       btn.classList.remove("disable")
    })
}


/*       ==========        Keyboard Key Function      ==========       */

document.addEventListener("keydown", (e) => {
    
    if(e.key >= "0" && e.key <= "9"){
        if(storeData.length >= MAX_LENGTH) return;
        displayNumber(e.key,"number");
        updateDisplay()
    }
    else if(["+", "-", "*", "/", "%"].includes(e.key)){
        if(storeData.length >= MAX_LENGTH) return;
        displayOperator(e.key,"operator");
        updateDisplay()
    }
    else if(e.key === "."){
        if(storeData.length >= MAX_LENGTH) return;
        e.preventDefault();
        displayDecimal(e.key,"decimal")
        updateDisplay()
    }
    else if(e.key === "Enter"){
        e.preventDefault();
        calculateResult()
        updateDisplay()
    }
    else if(e.key === "Backspace"){
        e.preventDefault();
        delLast()
        updateDisplay()
    }
    else if(e.key === "Escape"){
       e.preventDefault()
       allClearBtn()
       updateDisplay()
    }
})

