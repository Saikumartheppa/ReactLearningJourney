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
           // Its not necessary to assign timeOutId , lastArgs , lastContext to null even if a new query is fetched while existing one is still pending we are clearing the time out.
           // post executing the function(getData) lastPendingArgs , lastPendingContext are no longer pending
           // but still our closure contains old invocation data which is slightly misleading.
           // it is good practice because the invocation is no longer pending, it avoids stale state, helps garbage collection,
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