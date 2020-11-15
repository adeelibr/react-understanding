function createElement(type, ...children) {
  return { type, children };
}

function renderNode(node) {
  const { type, children } = node;
  if (type.isComponent) {
    const instance = new type()
    const element = renderNode(instance.render())
    instance.baseElement = element;
    return element;
  }
  if (typeof type === "string") {
    const el = document.createElement(type);
    children.forEach((child) => {
      if (typeof child === "string") {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(renderNode(child));
      }
    });
    return el;
  }
}

function render(node, element) {
  element.appendChild(renderNode(node));
}

/**
 * 
 * @param {HTMLElement} oldEl 
 * @param {HTMLElement} newEl 
 */
function diff(oldEl, newEl) {
  const hasNewChildren = oldEl.childNodes.length < newEl.children.length;
  if (hasNewChildren) {
    oldEl.appendChild(
      renderNode(newEl.children[newEl.children.length - 1])
    )
  }
  return oldEl;
}

function updateComponent(component) {
  const oldEl = component.baseElement;
  const newEl = component.render();
  component.baseElement = diff(oldEl, newEl);
}

class Component {
  constructor() {
    this.state = {};
  }
  setState(partialState) {
    Object.assign(this.state, partialState);
    updateComponent(this);
  }
}
Component.isComponent = true; // hahaha

class List extends Component {
  constructor() {
    super();
    this.state = { items: [] };

    setInterval(() => {
      this.setState({ items: [...this.state.items, "smart item"] });
    }, 2000);
  }

  render() {
    return createElement(
      "ul",
      ...this.state.items.map((item) => createElement("li", item))
    );
  }
}

const App = createElement(
  "div",
  createElement("h1", "heading"),
  createElement(
    "ul",
    createElement("li", "dummy item"),
    createElement("li", "dummy item")
  ),
  createElement(List)
);

/* const App = {
  type: "div",
  children: [
    {
      type: "h1",
      children: "heading",
    },
    {
      type: "ul",
      children: [
        {
          type: "li",
          children: ["item one"],
        },
        {
          type: "li",
          children: ["item two"],
        },
      ],
    },
  ],
}; */

render(App, document.querySelector("#app"));
