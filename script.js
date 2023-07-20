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
const getUserInput = ()=> {
    return prompt("Type a number or operator");
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
            iOperator = tempExprStack.indexOf('**');

            for(i in tempExprStack){ //Use for in on array to get the index, look for the Current operator in the highest
                if(tempExprStack[i] === '**') {
                    iOperator = i;
                    break;
                }
            }
        }
        else if(tempExprStack.includes('*')) {
            iOperator = tempExprStack.indexOf('*');

            for(i in tempExprStack){ 
                if(tempExprStack[i] === '*') {
                    iOperator = i;
                    break;
                }
            }
        }
        else if(tempExprStack.includes('/')) {
            iOperator = tempExprStack.indexOf('/');

            for(i in tempExprStack){
                if(tempExprStack[i] === '/'){
                    iOperator = i;
                    break;
                }
            }
    
        }
        else if(tempExprStack.includes('-')) {
            iOperator = tempExprStack.indexOf('-');

            for(i in tempExprStack){
                if(tempExprStack[i] === '-') {
                    iOperator = i;
                    break;
                }
            }
    
        }
        else if(tempExprStack.includes('+')) {
            iOperator = tempExprStack.indexOf('+');

            for(i in tempExprStack){
                if(tempExprStack[i] === '+') {
                    iOperator = i;
                    break;
                }
            }    
        }

        return iOperator ? iOperator : null;  //If an operator is found, return it. Otherwise return null
    }

    while(tempExprStack.length > 1) {  //While the expression is not resovled...

        let iCurrentOperator = getIndexOfOperator(tempExprStack);

        if(iCurrentOperator){
            let iSecOperator = getIndexOfOperator( tempExprStack, tempExprStack[iCurrentOperator] ) //Find the next operator, by ommiting the current one.

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

    //Handle Brackets
    iOpenBracket = exprStack.indexOf('(');
    if(iOpenBracket !== -1){
        let iClosingBracket = exprStack.indexOf(')');
        let bracketsExpr = exprStack.slice( iOpenBracket, iClosingBracket +1 ); //bracketsExpr comes with the breckets included

        exprStack = [
            ...exprStack.slice(0, iOpenBracket),
            calculate( bracketsExpr.slice(1) ), //slice out the brackets, checks for child brackets inside
            ...exprStack.slice(iClosingBracket)
        ]
        calculate(exprStack); //To check for more brackets in original expression.
    }

    return handleExpression(exprStack); // Handle a no-bracket expression.
}

const init = () =>{
    let exprStack = [];
    let userInput = '';

    do{
        userInput = getUserInput();
        if(userInput !== '=') exprStack.push(userInput);
        //display calculation...
    } while(userInput !== '=')
    console.log(`${exprStack} = ${calculate([...exprStack])}`);
}

