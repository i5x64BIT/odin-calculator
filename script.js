let exprStack = [];
let isBracketOpen = false; // Bracket expression state


const add = (a,b) => parseFloat(a) + parseFloat(b);
const subtract = (a,b) => parseFloat(a) - parseFloat(b);
const divide = (a,b) => parseFloat(a) / parseFloat(b);
const multiply = (a,b) => parseFloat(a) * parseFloat(b);
const pow = (a,b) => parseFloat(a) ** parseFloat(b);

const isInputValid = (input) => {
    if(typeof input !== typeof Number){
        console.error('Forbidden Value');
        return false;
    }
    else return true;
}

const handleExpression = (exprStack) => {
    let tempExprStack = [...exprStack];

    const getIndexOfOperator = (exprStack, ommitOperator) =>{
        let tempExprStack = [...exprStack];
        let iOperator;
        if(ommitOperator){
            tempExprStack.includes(ommitOperator) ? tempExprStack.splice(tempExprStack.indexOf(ommitOperator), 1) : console.warn(`There is no such operator as: ${ommitOperator}`);
        }
        //Look for the highest operator
        if(tempExprStack.includes('**')) {
            for(i in tempExprStack){ //Use for in on array to get the index, look for the Current operator in the highest
                if(tempExprStack[i] === '**') {
                    iOperator = i;
                    break;
                }
            }
        }
        else if(tempExprStack.includes('*')) {
            for(i in tempExprStack){ 
                if(tempExprStack[i] === '*') {
                    iOperator = i;
                    break;
                }
            }
        }
        else if(tempExprStack.includes('/')) {
            for(i in tempExprStack){
                if(tempExprStack[i] === '/'){
                    iOperator = i;
                    break;
                }
            }
    
        }
        else if(tempExprStack.includes('-')) {
            for(i in tempExprStack){
                if(tempExprStack[i] === '-') {
                    iOperator = i;
                    break;
                }
            }
    
        }
        else if(tempExprStack.includes('+')) {
            for(i in tempExprStack){
                if(tempExprStack[i] === '+') {
                    iOperator = i;
                    break;
                }
            }    
        }

        return iOperator ? parseInt(iOperator) : null;  //If an operator is found, return it. Otherwise return null
    }

    while(tempExprStack.length > 1) {  //While the expression is not resovled...

        let iCurrentOperator = getIndexOfOperator(tempExprStack);

        if(iCurrentOperator){
            let expression = tempExprStack.slice( iCurrentOperator-1 , iCurrentOperator+2 );    //separate 2 numbers and an operator for calculation AND remove them from the stack
            let result = 0;

            switch( expression[1] ) { //Calcualtion of equation
                case '**':
                    result = pow(expression[0], expression[2]);
                    break;
                case '*':
                    result = multiply(expression[0], expression[2]);
                break;
                case '/':
                    result = divide(expression[0], expression[2]);
                    break;
                case '+':
                    result = add(expression[0], expression[2]);
                    break;
                case '-':
                    result = subtract(expression[0], expression[2]);
                    break;    
                    
            }
                                                                
            tempExprStack.splice(
                iCurrentOperator-1, 3, //The equation calculated
                result
            )
        }
    }
    return tempExprStack;
}

const calculate = (exprStack) => {
    let iOpenBracket;
    let iClosingBracket;

    //Look for parentheses
    if(exprStack.includes('(')) {
        for(i in exprStack){ //Use for in on array to get the index, look for the Current operator in the highest
            if(exprStack[i] === '(') {
                iOpenBracket = parseInt(i);
                break;
            }
        }
        for(i in exprStack){ //Use for in on array to get the index, look for the Current operator in the highest
            if(exprStack[i] === ')') {
                iClosingBracket = parseInt(i);
                break;
            }
        }
        let bracketsExpr = exprStack.slice( iOpenBracket, iClosingBracket +1 ); //bracketsExpr comes with the breckets included
        exprStack.splice( iOpenBracket, bracketsExpr.length, 
            ...handleExpression(bracketsExpr.slice(1, -1)) // Calculate the bracket expression first, as a regular one
        );
        calculate(exprStack); //Look for editional brackets
    }

    return handleExpression(exprStack); // Handle a no-bracket expression.
}

const updateDisplay = (addition) => {
    let display = document.querySelector('.display p');

    display.innerText = '';
    for(e of exprStack) display.innerText += e;
    if(addition) display.innerText += addition;
}

const initButtons = () => {
    const btnList = document.querySelectorAll('.button');
    let strNumber = '';
    btnList.forEach((b) => {
        b.addEventListener('click', () => {
            if(!b.id) {
                strNumber += b.innerText; //To be able to push multiple digit numbers
                updateDisplay(strNumber); //Add each number to display
            }
            else {
                if(strNumber) exprStack.push(strNumber);  //Add the complete number to stack when an operator is required
                strNumber = '';

                switch (b.id){
                    case 'pow':
                        exprStack.push('**');
                        break;
                    case 'multiply':
                        exprStack.push('*');
                        break;
                    case 'divide':
                        exprStack.push('/')
                        break;
                    case 'bracket':
                        if(!isBracketOpen){
                            exprStack.push('(');
                            isBracketOpen = true;
                            break;
                        } else {
                            exprStack.push(')')
                            isBracketOpen = false;
                            break;
                        }
                    case 'add':
                        exprStack.push('+');
                        break;
                    case 'subtract':
                        exprStack.push('-');
                        break;
                    case 'clear':
                        exprStack = [];
                        updateDisplay()
                        break;
                    case 'backspace':
                        value = exprStack.pop();
                        if(value === ')') isBracketOpen = true;
                        if(value === '(') isBracketOpen = false;
                        break;
                    case 'equals':
                        exprStack = [...calculate(exprStack)];
                        break;
                }
                updateDisplay();
            }
        })
    })
}

const init = () =>{
    initButtons();
}

init();

