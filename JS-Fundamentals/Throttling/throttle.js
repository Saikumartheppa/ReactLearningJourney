const expensive = (val) => {
    console.log("Expensive Operation" , val)
};
const addThrottling = function (func , delay){
    let shouldCall = true;
    let timer;
    return function(...args){
        const context = this;
        if(!shouldCall) return ;
        shouldCall = false;
        func.apply(context , args);
        setTimeout(function (){
           shouldCall = true;
        }, delay);
    }
};
const betterExpensive = addThrottling(expensive , 3000);