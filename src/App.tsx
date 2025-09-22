import { memo, useState, Children } from "react";
import { store } from "./state/Store";
import { useStore } from "zustand";

const MemoComp = memo((props: { children: React.ReactNode }) => {
  return <div>{props.children}</div>;
});

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
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            width: "25%",
            borderRight: "1px solid black",
            padding: 10,
          }}
        >
          <LHPanel />
        </div>
        <div style={{ width: "75%" }}>
          <MemoComp>
            <div
              style={{
                padding: 25,
                overflowY: "auto",
                height: "calc(100vh - 50px)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ width: "50%" }}>
                  <h1>Deep Architecture</h1>
                </div>
                <div style={{ width: "50%" }}>
                  <h1>Flat Architecture</h1>
                </div>
              </div>
              <ExampleSection title="Global Listener">
                <Deep_TreeListener />
                <Flat_TreeListener />
              </ExampleSection>
              <ExampleSection title="Node Listeners (drilled in)">
                <div>
                  <Deep_Node_DrilledIn nodeId="root" />
                  <br />
                  <Deep_Node_DrilledIn nodeId="c1" />
                  <br />
                  <Deep_Node_DrilledIn nodeId="c1-c1" />
                  <br />
                  <Deep_Node_DrilledIn nodeId="c1-c1-c1" />
                </div>
                <div>
                  <Flat_Node_DrilledIn nodeId="root" />
                  <br />
                  <Flat_Node_DrilledIn nodeId="c1" />
                  <br />
                  <Flat_Node_DrilledIn nodeId="c1-c1" />
                  <br />
                  <Flat_Node_DrilledIn nodeId="c1-c1-c1" />
                </div>
              </ExampleSection>
              <ExampleSection title="Node Listeners (direct)">
                <div>
                  <Deep_Node_Direct nodeId="root" />
                  <br />
                  <Deep_Node_Direct nodeId="c1" />
                  <br />
                  <Deep_Node_Direct nodeId="c1-c1" />
                  <br />
                  <Deep_Node_Direct nodeId="c1-c1-c1" />
                </div>
                <div>
                  <Flat_Node_Direct nodeId="root" />
                  <br />
                  <Flat_Node_Direct nodeId="c1" />
                  <br />
                  <Flat_Node_Direct nodeId="c1-c1" />
                  <br />
                  <Flat_Node_Direct nodeId="c1-c1-c1" />
                </div>
              </ExampleSection>

              <ExampleSection title="Property Listeners (drilled in)">
                <div>
                  <Deep_NodeProperty_DrilledIn nodeId="root" />
                  <br />
                  <Deep_NodeProperty_DrilledIn nodeId="c1" />
                  <br />
                  <Deep_NodeProperty_DrilledIn nodeId="c1-c1" />
                  <br />
                  <Deep_NodeProperty_DrilledIn nodeId="c1-c1-c1" />
                </div>
                <div>
                  <Flat_NodeProperty_DrilledIn nodeId="root" />
                  <br />
                  <Flat_NodeProperty_DrilledIn nodeId="c1" />
                  <br />
                  <Flat_NodeProperty_DrilledIn nodeId="c1-c1" />
                  <br />
                  <Flat_NodeProperty_DrilledIn nodeId="c1-c1-c1" />
                </div>
              </ExampleSection>
              <ExampleSection title="Property Listeners (direct)">
                <div>
                  <Deep_NodeProperty_Direct nodeId="root" />
                  <br />
                  <Deep_NodeProperty_Direct nodeId="c1" />
                  <br />
                  <Deep_NodeProperty_Direct nodeId="c1-c1" />
                  <br />
                  <Deep_NodeProperty_Direct nodeId="c1-c1-c1" />
                </div>
                <div>
                  <Flat_NodeProperty_Direct nodeId="root" />
                  <br />
                  <Flat_NodeProperty_Direct nodeId="c1" />
                  <br />
                  <Flat_NodeProperty_Direct nodeId="c1-c1" />
                  <br />
                  <Flat_NodeProperty_Direct nodeId="c1-c1-c1" />
                </div>
              </ExampleSection>
            </div>
          </MemoComp>
        </div>
      </div>
    </>
  );
};

function ExampleSection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div
      style={{
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 5,
        marginBottom: 5,
      }}
    >
      <h2>{title}</h2>
      <hr />
      <div style={{ display: "flex", flexDirection: "row", columnGap: 15 }}>
        <div style={{ width: "50%" }}>{Children.toArray(children)[0]}</div>
        <div style={{ width: "50%" }}>{Children.toArray(children)[1]}</div>
      </div>
    </div>
  );
}

function Deep_TreeListener() {
  const tree = useStore(store, (store) => store.tree);
  return (
    <div>
      <pre>{JSON.stringify(tree, null, 2)}</pre>
    </div>
  );
}

function Deep_Node_Direct({ nodeId }: { nodeId: string }) {
  const buildSubscriber = useStore(store, (store) => store.buildSubscriber);
  const getNode = buildSubscriber(nodeId);
  const tree = getNode();
  return <div>{JSON.stringify(tree)}</div>;
}

function Deep_Node_DrilledIn({ nodeId }: { nodeId: string }) {
  const node = useStore(store, (store) => store.getNode(nodeId));
  return <div>{JSON.stringify(node)}</div>;
}

function Deep_NodeProperty_DrilledIn({ nodeId }: { nodeId: string }) {
  const node = useStore(store, (store) => store.getNode(nodeId)?.data.core);
  return <div>{JSON.stringify(node)}</div>;
}

function Deep_NodeProperty_Direct({ nodeId }: { nodeId: string }) {
  const buildSubscriber = useStore(store, (store) => store.buildSubscriber);
  const getNode = buildSubscriber(nodeId);
  const node = getNode();
  return <div>{JSON.stringify(node?.core)}</div>;
}

function Flat_TreeListener() {
  const tree = useStore(store, (store) => store.nodes);
  return (
    <div>
      <pre>{JSON.stringify(tree, null, 2)}</pre>
    </div>
  );
}

function Flat_Node_Direct({ nodeId }: { nodeId: string }) {
  const buildSubscriber = useStore(store, (store) => store.buildFlatSubscriber);
  const getNode = buildSubscriber(nodeId);
  const tree = getNode();
  return <div>{JSON.stringify(tree)}</div>;
}

function Flat_Node_DrilledIn({ nodeId }: { nodeId: string }) {
  const node = useStore(store, (store) => store.nodes[nodeId]);
  return <div>{JSON.stringify(node)}</div>;
}

function Flat_NodeProperty_DrilledIn({ nodeId }: { nodeId: string }) {
  const node = useStore(store, (store) => store.nodes[nodeId]?.data.core);
  return <div>{JSON.stringify(node)}</div>;
}

function Flat_NodeProperty_Direct({ nodeId }: { nodeId: string }) {
  const buildSubscriber = useStore(store, (store) => store.buildFlatSubscriber);
  const getNode = buildSubscriber(nodeId);
  const node = getNode();
  return <div>{JSON.stringify(node?.core)}</div>;
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
