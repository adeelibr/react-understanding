const ReactDOM = {
  render: function (reactElement, container) {
    if (["string", "number"].includes(typeof reactElement)) {
      const innerContent = document.createTextNode(String(reactElement));
      container.appendChild(innerContent);
      return;
    }
    const domEl = document.createElement(reactElement.tag);
    if (reactElement.props) {
      Object.keys(reactElement.props)
        .filter((prop) => prop !== "children")
        .forEach((prop) => (domEl[prop] = reactElement.props[prop]));
    }
    if (reactElement.props.children) {
      reactElement.props.children.forEach((child) => this.render(child, domEl));
    }
    container.appendChild(domEl);
  },
  rerender: function () {
    const rootEl = document.querySelector("#app");
    rootEl.firstChild.remove();
    this.render(<App />, rootEl);
  },
};

const React = {
  createElement: function (tag, props, ...children) {
    if (typeof tag === "function") {
      try {
        return tag(props);
      } catch ({ key, promise }) {
        promise.then((data) => {
          this.resources.set(key, data);
          ReactDOM.rerender();
        });
        return { tag: "h2", props: { children: ["suspended .. loading .."] } };
      }
    }
    const element = {
      tag,
      props: {
        ...props,
        children,
      },
    };
    return element;
  },
  stateId: 0,
  states: [],
  useState: function (initialValue) {
    const frozenState = this.stateId;
    this.states[frozenState] = this.states[frozenState] || initialValue;
    const setState = (newState) => {
      this.states[frozenState] = newState;
      // poor man's reconciliate
      this.stateId = 0;
      ReactDOM.rerender();
    };
    this.stateId++;
    return [this.states[frozenState], setState];
  },
  resources: new Map(),
  createResource: function (key, action) {
    if (this.resources.has(key)) {
      return this.resources.get(key);
    }
    throw { key, promise: action() };
  },
};

const App = () => {
  const [name, setName] = React.useState("");
  const [count, setCount] = React.useState(0);

  const dogImage = React.createResource("doggo", () => {
    return fetch("https://dog.ceo/api/breeds/image/random")
      .then((r) => r.json())
      .then((data) => data.message);
  });

  return (
    <div id="app-container">
      <section>
        <p>Count is {count}</p>
        <button onclick={() => setCount(count + 1)}>increment</button>
        <button onclick={() => setCount(count - 1)}>decrement</button>
      </section>
      <section>
        <p>Name is {name === "" ? "n/a" : name}</p>
        <input
          value={name}
          onchange={(e) => setName(e.target.value)}
          type="text"
          placeholder="your name sire"
        />
      </section>
      <br />
      <br />
      <img src={dogImage} alt="doggo in action" />
      <br />
      <p className="paragraph" style="color: blue;">
        Commodo ex nostrud in fugiat Lorem consequat minim sint reprehenderit
        fugiat.
      </p>
      <p className="paragraph">
        Elit laboris Lorem laborum elit ullamco amet nulla officia. Elit
        pariatur ea enim veniam id deserunt. Enim aute enim enim occaecat magna
        esse qui aliqua.
      </p>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#app"));
