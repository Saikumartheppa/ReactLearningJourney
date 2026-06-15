let count = 0;
const getData = (searchQuery) => {
    console.log("Searching...." , searchQuery,  ++count);
}
const addLeadingAndTrailingDebounce = function (func , delay , {leading = false , trailing = true} = {}){
    let timeOutId;
    return function(...args){
        const context = this;
        const callNow = leading && !timeOutId;
        clearTimeout(timeOutId);
        timeOutId = setTimeout(function(){
            timeOutId = null;
            if(trailing && !callNow){
                func.apply(context , args);
            }
        }, delay)
        if(callNow){
            func.apply(context , args);
        }
    }
}
const leadingAndTrailingDebounce = addLeadingAndTrailingDebounce(getData , 3000, {leading : true, trailing : true});