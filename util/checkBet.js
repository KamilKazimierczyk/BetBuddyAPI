const checkBet = (event, betValue) => {
    let value = true;
    if(event.type == 'scoreline'){
        const splitted = betValue.split('-');
        if(splitted.length !== 2 || !Number.isInteger(parseInt(splitted[0])) || !Number.isInteger(parseInt(splitted[1]))) value = false;
    }else {
        if(!event.options.includes(betValue)) value = false;
    }

    return value;
}

module.exports = checkBet;