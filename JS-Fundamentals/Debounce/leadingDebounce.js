let count = 0;
const getData = () => {
  console.log("Fetching data from API" , ++count);
}
const addLeadingDebounce = function(func , delay , ){
    let timeOutId;
    return function(...args){
        const context = this;
        let shouldCallNow = !timeOutId;
        clearTimeout(timeOutId);
        timeOutId = setTimeout(function(){
              timeOutId = null;
        }, delay)
        if(shouldCallNow){
            func.apply(context, args);
        }
    }
}
const betterFunction = addLeadingDebounce(getData , 3000)
