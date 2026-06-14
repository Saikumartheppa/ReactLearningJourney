let count = 0;
const getData = (searchQuery) => {
    console.log("Fetching data from API" , searchQuery , ++count);
}
const addDebounce = function (func , delay){
    let timeOutId , lastPendingArgs , lastPendingContext;
    function debounced(...args){
       const context = this;
       clearTimeout(timeOutId)
       timeOutId  = setTimeout(function (){
           func.apply(context , args);
       }, delay)
    }
    debounced.cancel = function () {
         if(!timeOutId) return;
         clearTimeout(timeOutId)
         timeOutId = null;
         console.log("Pending Execution Cancelled");
    }
    return debounced;
}
const debouncedFunction = addDebounce(getData , 20000);