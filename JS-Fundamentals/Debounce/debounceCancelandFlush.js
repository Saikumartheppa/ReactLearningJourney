let count = 0;
const getData = (searchQuery) => {
    console.log("Fetching data from API" , searchQuery , ++count);
}
const addDebounce = function (func , delay){
    let timeOutId , lastPendingArgs , lastPendingContext;
    function debounced(...args){
       const context = lastPendingContext= this;
       lastPendingArgs = args;
       clearTimeout(timeOutId)
       timeOutId  = setTimeout(function (){
           func.apply(context , args);
           timeOutId = null;
           lastPendingArgs = null;
           lastPendingContext = null;
       }, delay)
    }
    debounced.cancel = function () {
         if(!timeOutId) return;
         clearTimeout(timeOutId);
         timeOutId = null;
         console.log("Pending Execution Cancelled");
        }
    debounced.flush = function (){
        if(!timeOutId) return;
        clearTimeout(timeOutId);
        func.apply(lastPendingContext , lastPendingArgs);
        timeOutId = lastPendingContext = lastPendingArgs = null;
    }
    return debounced;
}
const debouncedFunction = addDebounce(getData , 10000);