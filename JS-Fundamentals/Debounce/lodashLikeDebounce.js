let count = 0;
const getData = (searchQuery) => {
    console.log("Searching..." , searchQuery , ++count);
}
const addLodashLikeDebounce = function (func , delay , maxWait, options = {}){
    const { leading = false , trailing = true} = options;
    let debounceTimeOutId , maxTimeOutId,  lastPendingArgs , lastPendingContext;
    function invoke(){
        func.apply(lastPendingContext , lastPendingArgs);
        lastPendingArgs = null;
        lastPendingContext = null;
    }
    function debounced(...args){
        lastPendingArgs = args;
        lastPendingContext = this;
        const callNow = leading && !debounceTimeOutId;
        clearTimeout(debounceTimeOutId);
        debounceTimeOutId = setTimeout(function(){
             debounceTimeOutId = null;
             if(trailing && lastPendingArgs){
                invoke();
             }
        }, delay)
        if(!maxTimeOutId){
            maxTimeOutId = setTimeout(function(){
               clearTimeout(debounceTimeOutId);
               maxTimeOutId = debounceTimeOutId=  null
               if(lastPendingArgs){
                   invoke();
               }
            }, maxWait)
        }
        if(callNow){
            invoke();
        }
    }
    debounced.cancel = function(){
        if(!debounceTimeOutId) return;
        clearTimeout(debounceTimeOutId);
        clearTimeout(maxTimeOutId);
        debounceTimeOutId = maxTimeOutId = lastPendingArgs = lastPendingContext = null;
    }
    debounced.flush = function(){
        if(!debounceTimeOutId) return;
        clearTimeout(debounceTimeOutId);
        clearTimeout(maxTimeOutId);
        debounceTimeOutId = maxTimeOutId = null;
        if(lastPendingArgs){
            invoke();
        }
    }
    return debounced;
}
const lodashLikeDebounce = addLodashLikeDebounce(getData , 3000 , 5000, {leading:true , trailing :true});