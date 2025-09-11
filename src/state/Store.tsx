import { useEffect, useState } from "react";
import { createStore } from "zustand";
import { produce } from "immer";

type TreeNode = {
  data: {
    id: string;
    core: string;
  };
  children: TreeNode[];
};

const createTree = () => ({
  data: {
    id: "root",
    core: "foo",
  },
  children: [
    {
      data: {
        id: "c1",
        core: "bar",
      },
      children: [
        {
          data: {
            id: "c1-c1",
            core: "bar+baz",
          },
          children: [
            {
              data: {
                id: "c1-c1-c1",
                core: "bar+baz+qux",
              },
              children: [],
            },
          ],
        },
      ],
    },
    {
      data: {
        id: "c2",
        core: "bar",
      },
      children: [
        {
          data: {
            id: "c2-c1",
            core: "bar+baz",
          },
          children: [],
        },
      ],
    },
  ],
});

export const store = createStore<{
  tree: TreeNode;
  getNode: (id: string) => TreeNode | null;
  setNode: (id: string, value: string) => void;
  buildSubscriber: (id: string) => () => TreeNode["data"] | null;
  resetWholeTree: () => void;
}>((set, get) => {
  return {
    tree: createTree(),
    getNode: (id: string) => {
      if (id === "root") {
        return get().tree;
      }
      const queue = [...get().tree.children];
      while (queue.length > 0) {
        const node = queue.shift()!;
        if (node.data.id === id) {
          return node;
        }
        queue.push(...node.children);
      }
      return null;
    },
    resetWholeTree: () => {
      set((base) =>
        produce(base, (draft) => {
          draft.tree = createTree();
        })
      );
    },
    setNode: (id: string, value: string) => {
      const path = getNodePath(get().tree, id);
      set((base) =>
        produce(base, (draft) => {
          let mutateRef = draft.tree;
          for (const index of path) {
            mutateRef = mutateRef.children[index];
          }
          mutateRef.data.core = value;
        })
      );
    },
    buildSubscriber: (id: string) => {
      return () => {
        const [node, setNode] = useState<TreeNode["data"] | null>(
          get().getNode(id)?.data ?? null
        );
        useEffect(() => {
          const unsub = store.subscribe((state) => {
            const node = state.getNode(id);

            if (node) {
              setNode(node.data);
            }
          });
          return () => unsub();
        }, []);
        return node;
      };
    },
  };
});

export function getNodePath(tree: TreeNode | null, selectedNodeId: string) {
  function findIndexPathById(
    rootNode: TreeNode,
    targetId: string
  ): number[] | null {
    type Frame = { node: TreeNode; path: number[] };
    const stack: Frame[] = [{ node: rootNode, path: [] }];
    while (stack.length > 0) {
      const { node, path } = stack.pop() as Frame;
      if (node.data.id === targetId) {
        return path;
      }
      for (let i = node.children.length - 1; i >= 0; i -= 1) {
        const child = node.children[i];
        stack.push({ node: child, path: [...path, i] });
      }
    }
    return null;
  }

  if (!tree) return [];

  return findIndexPathById(tree, selectedNodeId) ?? [];
}
