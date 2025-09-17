import { useState } from "react";
import { store } from "./state/Store";
import { useStore } from "zustand";

const App = () => {
  return (
    <>
      <div
        style={{
          width: "100%",
          height: 50,
          padding: 10,
          borderBottom: "1px solid black",
        }}
      ></div>
      <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
        <div
          style={{
            width: "15%",
            borderRight: "1px solid black",
          }}
        >
          <LHPanel />
        </div>
        <div style={{ width: "60%", padding: 25 }}>
          <div>
            <TreeListener />
            <br />
            <h1>Node (Tree) Listeners</h1>
            <div>
              <RootListener />
              <br />
              <ChildListener />
              <br />
              <GrandChildListener />
              <br />
              <GreatGrandChildListener />
            </div>
          </div>
          <div>
            <h1>Node (Flat) Listeners</h1>
            <div>
              <ChildFlatNodeListener />
            </div>
          </div>
          <div>
            <h1>Data Field Listeners</h1>
            <RootDataFieldListener />
            <br />
            <ChildDataFieldListener />
            <br />
            <GrandChildDataFieldListener />
            <br />
            <GreatGrandChildDataFieldListener />
          </div>
          {/* <div>
            <h1>Global (Flat) Node Listeners</h1>
            <GlobalFlatNodeListener />
          </div>
          */}
          <div>
            <h1>Global (Tree) Node Listeners</h1>
            <GlobalTreeNodeListener />
          </div>
        </div>

        <div style={{ width: "25%", borderLeft: "1px solid black" }}>
          {/* <RHPanel /> */}
        </div>
      </div>
    </>
  );
};

function TreeListener() {
  const tree = useStore(store, (store) => store.tree);
  return (
    <div style={{ marginTop: 16 }}>
      <h1>store.tree listener</h1>
      <hr />
      <div style={{ margin: "25px 0" }}>{JSON.stringify(tree)}</div>
      <hr />
    </div>
  );
}

function GlobalFlatNodeListener() {
  const node = useStore(store, (store) => store.nodes["c1-c1"]);
  return <div>{JSON.stringify(node)}</div>;
}

function GlobalTreeNodeListener() {
  const node = useStore(store, (store) => store.tree.children[0].children[0]);
  return <div>{JSON.stringify(node)}</div>;
}

function ChildFlatNodeListener() {
  const buildNodeSubscriber = useStore(
    store,
    (store) => store.buildFlatSubscriber
  );
  const nodeSubscriber = buildNodeSubscriber("c1-c1");
  const node = nodeSubscriber();

  return <div>{JSON.stringify(node)}</div>;
}

function RootListener() {
  const buildSubscriber = useStore(store, (store) => store.buildSubscriber);
  const getNode = buildSubscriber("root");
  const tree = getNode();
  return <div>{JSON.stringify(tree)}</div>;
}

function ChildListener() {
  const buildSubscriber = useStore(store, (store) => store.buildSubscriber);
  const getNode = buildSubscriber("c1");
  const tree = getNode();
  return <div>{JSON.stringify(tree)}</div>;
}
function GrandChildListener() {
  const buildSubscriber = useStore(store, (store) => store.buildSubscriber);
  const getNode = buildSubscriber("c1-c1");
  const tree = getNode();
  return <div>{JSON.stringify(tree)}</div>;
}

function GreatGrandChildListener() {
  const buildSubscriber = useStore(store, (store) => store.buildSubscriber);
  const getNode = buildSubscriber("c1-c1-c1");
  const tree = getNode();
  return <div>{JSON.stringify(tree)}</div>;
}

function RootDataFieldListener() {
  const buildSubscriber = useStore(store, (store) => store.buildSubscriber);
  const getNode = buildSubscriber("root");
  const tree = getNode();
  return <div>Root: {tree?.core}</div>;
}

function ChildDataFieldListener() {
  const buildSubscriber = useStore(store, (store) => store.buildSubscriber);
  const getNode = buildSubscriber("c1");
  const tree = getNode();
  return <div>Child: {tree?.core}</div>;
}

function GrandChildDataFieldListener() {
  const buildSubscriber = useStore(store, (store) => store.buildSubscriber);
  const getNode = buildSubscriber("c1-c1");
  const tree = getNode();
  return <div>GrandChild: {tree?.core}</div>;
}

function GreatGrandChildDataFieldListener() {
  const buildSubscriber = useStore(store, (store) => store.buildSubscriber);
  const getNode = buildSubscriber("c1-c1-c1");
  const tree = getNode();
  return <div>GreatGrandChild: {tree?.core}</div>;
}

function LHPanel() {
  const setNode = useStore(store, (store) => store.setNode);
  const resetWholeTree = useStore(store, (store) => store.resetWholeTree);
  const [idToChange, setIdToChange] = useState("");
  const [valueToChange, setValueToChange] = useState("");
  return (
    <div>
      <div>
        <label>ID to change</label>
        <input
          type="text"
          value={idToChange}
          onChange={(e) => setIdToChange(e.target.value)}
        />
      </div>
      <div>
        <label>Value for Node</label>
        <input
          type="text"
          value={valueToChange}
          onChange={(e) => setValueToChange(e.target.value)}
        />
        <button onClick={() => setNode(idToChange, valueToChange)}>
          Change
        </button>
      </div>
      <br />
      <button onClick={() => resetWholeTree()}>Reset Whole Tree</button>
    </div>
  );
}

export default App;
