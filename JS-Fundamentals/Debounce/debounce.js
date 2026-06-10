// Debouncing in JavaScript
let count = 0;
const getData = (searchText) => {
    // Make an API call and return the response
    console.log("Fetching data----" , searchText,  ++count);
}
const addDebounce = function(fn , delay){
    let timer;
    return function(...args){
        const context = this;
        clearTimeout(timer);
        // using arrow functions ---> This works because arrow functions inherit this lexically or from thier surroundings.
        // timer = setTimeout(() => {
        //     fn.apply(this, args);
        // }, delay);
        timer = setTimeout(function () {
          fn.apply(context , args);
        } , delay)
    };
}
// getData function will invoke only if the differene between the 2 key press events is greater than 300 ms.
const betterFunction =  addDebounce(getData , 300);