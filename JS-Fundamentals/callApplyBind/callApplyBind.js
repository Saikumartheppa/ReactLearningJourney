// console.log("Call, Apply, Bind");

// call

// const person1 = {
//     firstName: "Virat",
//     lastName: "Kohli",
//     age: 25,
//     city: "Hyderabad",
//     printFullName : function() {
//         console.log(this.firstName + " " + this.lastName);
//     }
// };
// person1.printFullName();

// const person2 = {
//     firstName:"Alex",
//     lastName:"Hales",
//     age:30,
//     city:"Lords"
// }
// // Function Borrowing
// // Every function in JS can have access to call method
// // First argument will the be reference to "this" variable & rest of the arguments can be passed by comma separated values like we pass in normal functions.
// // we wont declare a common function inside an object , instead we will declare outside for generic use.
// person1.printFullName.call(person2);


const printFullName = function(homeTown , country){
    console.log(this.firstName + " "+ this.lastName + " from " + homeTown + " , " + country);
}
const person1 = {
    firstName: "Virat",
    lastName: "Kohli",
    age: 25,
}
const person2 = {
    firstName: "Alex",
    lastName: "Hales",
    age: 30,
}
// printFullName.call(person1 , "Delhi" , "India"); 
// printFullName.call(person2 , "Lords" , "England");

// APPLY
// The only difference b/w call & apply is the way passing arguments.
// first argument will be the reference to "this" variable
// rest of the arguments should have to pass in a list. but why ?? 
// to dynamically handle a variable number of arguments that might already be stored in a list
//  When to use : 
//      call - Use this when you want to pass arguments individually (separated by commas).
//      apply - Use this when your arguments are already in an array. 
// printFullName.apply(person1 ,["Delhi" , "India"]); 
// printFullName.apply(person2 ,["Lords" , "England"]);

//BIND
 // Bind method will not directly invokes the function , instead it will create and return a copy of the function & binds with the object which can invoked in future.

//  const printMyName = printFullName.bind(person1 , "Delhi" , "India");
//  console.log(printMyName);
//  printMyName();
//  printMyName.call(person2, "Lords" , "England"); // still it will prints the person1 object but why ? I believe printMyName function is binded with person1 obj

// const printMyName = printFullName.bind(person1 , ["Delhi" , "India"]); // can we do like this ?? yes but it will depend how you recieve the arguments in that function
//  printMyName();
const printMyName = printFullName.bind(person1); 
 printMyName("Delhi" , "India");  // can we do like this ?? yes 
 printMyName(["Delhi" , "India"]);  // can we do like this ?? yes 

 // Use case bind
 // when you need to set the this context of a function for later execution

//  Example 
const user = {
  name: "Alice",
  greet() { console.log(`Hi, ${this.name}`); }
};
// Without bind, 'this' would refer to the global object (window)
setTimeout(user.greet.bind(user), 1000); 
// When you pass a method as a callback (e.g., to setTimeout or an event listener), the this context is often lost because the caller is no longer your original object.

