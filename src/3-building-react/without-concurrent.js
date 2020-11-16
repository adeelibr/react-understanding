import "./style.css";

const TYPE = {
  TEXT_ELEMENT: "TEXT_ELEMENT",
};

function createTextElement(text) {
  return {
    type: TYPE.TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
  const element = {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        if (typeof child === "object" && !Array.isArray(child)) {
          return child;
        }
        return createTextElement(child);
      }),
    },
  };
  return element;
}

function render(element, container) {
  const domEl =
    element.type === TYPE.TEXT_ELEMENT
      ? document.createTextNode("")
      : document.createElement(element.type);
  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((prop) => {
      domEl[prop] = element.props[prop];
    });
  element.props.children.forEach((child) => render(child, domEl));
  container.appendChild(domEl);
}

const Didact = {
  createElement,
};

const DidactDOM = {
  render,
};

// const element = Didact.createElement(
//   "div",
//   { id: "app-container" },
//   Didact.createElement("p", { id: "paragraph" }, ["this is a p tag"]),
//   Didact.createElement("br", null)
// );

/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <p id="paragraph">
      Cupidatat laboris tempor pariatur adipisicing cupidatat cupidatat pariatur
      adipisicing culpa aliquip ea amet deserunt elit.
    </p>
    <b />
  </div>
);

const container = document.querySelector("#app");
DidactDOM.render(element, container);
