const ReactDOM = {
  render: function (reactElement, container) {
    if (["string", "number"].includes(typeof reactElement)) {
      const el = document.createTextNode(String(reactElement));
      container.appendChild(el);
      return;
    }
    const domEl = document.createElement(reactElement.tag);
    if (reactElement.props) {
      Object.keys(reactElement.props)
        .filter((prop) => prop !== "children")
        .forEach((prop) => {
          domEl[prop] = reactElement.props[prop];
        });
    }
    if (reactElement.props.children) {
      reactElement.props.children.forEach((child) => this.render(child, domEl));
    }
    container.appendChild(domEl);
  },
  rerender: function () {
    document.querySelector("#app").firstChild.remove();
    this.render(<App />, document.querySelector("#app"));
  },
};

const React = {
  createElement: function (tag, props, ...children) {
    if (typeof tag === "function") {
      return tag(props);
    }
    const element = { tag, props: { ...props, children } };
    return element;
  },
  stateId: 0,
  states: [],
  useState: function (initialValue) {
    const frozenState = this.stateId;
    this.states[frozenState] = this.states[frozenState] || initialValue;
    const setState = (newValue) => {
      this.states[frozenState] = newValue;

      // bad render
      this.stateId = 0;
      ReactDOM.rerender();
    };
    this.stateId++;
    return [this.states[frozenState], setState];
  },
};

const App = () => {
  const [name, setName] = React.useState("");
  const [count, setCount] = React.useState(0);

  return (
    <div id="app-container">
      <h1 class="heading" style={"color: red;"}>
        Create react
      </h1>
      <section>
        <span>Your name is: {name === "" ? "n/a" : name}</span>
        <br />
        <input
          value={name}
          onchange={(e) => setName(e.target.value)}
          type="text"
          placeholder="your name sire"
        />
      </section>
      <br />
      <br />
      <section>
        <span>Count {count}</span>
        <br />
        <button onclick={() => setCount(count + 1)}>Increment</button>
        <button onclick={() => setCount(count - 1)}>Decrement</button>
      </section>
      <p>
        lMagna eu reprehenderit consequat officia irure ullamco occaecat ut.
      </p>
      <p>
        Voluptate amet esse excepteur sint mollit culpa laboris ut tempor
        cupidatat ex minim. Consequat mollit deserunt sint ea qui aliqua ut sunt
        excepteur. Duis consectetur pariatur irure excepteur Lorem. Occaecat
        consectetur exercitation enim excepteur fugiat esse minim adipisicing
        enim anim in minim aliquip. Voluptate labore velit magna eiusmod
        adipisicing do minim voluptate. Pariatur qui sint enim aliqua ad.
      </p>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#app"));
