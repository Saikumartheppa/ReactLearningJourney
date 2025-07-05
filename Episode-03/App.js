import React from "react";
import ReactDOM from "react-dom/client";

// Working Behind when we create element using react core method
// React.creatElement => React Element (JS Object) => HTMLElement(render)

// JSX transpiled before it reaches JS engine -
// Working Behind when we create element using JSX
// JSX => Parcel Internally uses Babel to transpile the JSX => React.creatElement => React Element (JS Object) => HTMLElement(render)

// React Element
const heading = (
  <h1 id="heading" className="head" tabIndex="1">
    Hello World
  </h1>
);

//React Functional Component & Component Composition as well
const HeadingComponent = () => (
  <div className="container">
    {"Piece of JavaScript"}
    {heading}
    <h1>{400 + 500}</h1>
    <HeadingComponent2 />
    <h1 className="heading1">First React Functional Component</h1>
  </div>
);

const HeadingComponent2 = () => (
  <div className="container2">
    <HeadingComponent3 />
    <h1 className="heading2">Second React Functional Component</h1>
  </div>
);

const HeadingComponent3 = () => {
  return (
    <h1 id="Heading3" className="Heading3" tabIndex="3">
      HeadingComponent3
    </h1>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(heading);
root.render(<HeadingComponent />);
