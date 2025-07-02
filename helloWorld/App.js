// const container = document.createElement("div");
// const heading = document.createElement("h1");
// heading.innerHTML= "Hello World Namasthe React";
// container.appendChild(heading);
// document.body.appendChild(container);

const heading = React.createElement(
  "h1",
  { id: "heading" },
  "Hello World Namaste React"
);
const root = ReactDOM.createRoot(document.getElementById("root"));

// root.render(heading);

// Creating Nested Elements Using React

// const parent = React.createElement(
//   "div",
//   { id: "parent" },
//   React.createElement(
//     "div",
//     { id: "child" },
//     React.createElement("h1", {}, "I am a Nested H1")
//   )
// );
// console.log(parent);
// root.render(parent);

// Creating Nested Sibling Elements Using React . This will throw a warning we can handle it later

const parent = React.createElement(
  "div",
  { id: "parent" },
  [
    React.createElement(
    "div",
    { id: "child1" },
    [
    React.createElement("h1", {}, "I am a Nested H1"),
    React.createElement("h2", {}, "I am a Nested H2"),
    React.createElement("h3", {}, "I am a Nested H3")
    ]
  ),
  React.createElement(
    "div",
    { id: "child2" },
    [
    React.createElement("h1", {}, "I am a Nested H1"),
    React.createElement("h2", {}, "I am a Nested H2"),
    React.createElement("h3", {}, "I am a Nested H3")
    ]
  )
  ]
);
console.log(parent);
root.render(parent);
