// binary tree types:
// 1. perfect: every node is full and complete
// 2. complete: every node is full except last two levels, and leaves are on the left side
// 3. full: every node has 0 or 2 children
// 4. balanced: for each child tree, |d| = |height(left node) - height(right node)| <= 1
// 5. binary search tree: value_left_child < value_parent < value_right_child
class BinaryTreeNode {
  val: number;
  left: IBinaryTreeNode = null;
  right: IBinaryTreeNode = null;
  constructor(val = 0) {
    this.val = val;
  }
}
type IBinaryTreeNode = BinaryTreeNode | null;

// <----------------- Common Utils (BFS DFS) ----------------->
function binaryTreeBfs(root: IBinaryTreeNode) {
  if (!root) return [];
  const queue: BinaryTreeNode[] = [root];
  const visitList: BinaryTreeNode[] = [];
  while (queue.length) {
    // queue is not empty, node must exist
    const node = queue.shift() as BinaryTreeNode;
    visitList.push(node);
    const { left, right } = node;
    if (left) {
      queue.push(left);
    }
    if (right) {
      queue.push(right);
    }
  }
  return visitList;
}
function recursiveBinaryTreeDfs({
  node,
  visitList = [],
  order = 'pre'
}: {
  node: IBinaryTreeNode;
  visitList?: BinaryTreeNode[];
  order: 'pre' | 'in' | 'post';
}): BinaryTreeNode[] {
  if (!node) {
    return visitList;
  }
  order === 'pre' && visitList.push(node);
  recursiveBinaryTreeDfs({ node: node.left, visitList, order });
  order === 'in' && visitList.push(node);
  recursiveBinaryTreeDfs({ node: node.right, visitList, order });
  order === 'post' && visitList.push(node);
  return visitList;
}

function iterBinaryTreeDfsPre(node: IBinaryTreeNode) {
  const visitList: BinaryTreeNode[] = [];
  if (!node) {
    return visitList;
  }
  const stack: BinaryTreeNode[] = [node];
  while (stack.length) {
    const node = stack.pop() as BinaryTreeNode;
    visitList.push(node);
    if (node.right) {
      stack.push(node.right);
    }
    if (node.left) {
      stack.push(node.left);
    }
  }
}

const recursivelyGetBinaryTreeHeight = (node: IBinaryTreeNode): number => {
  if (!node) {
    return -1;
  } else {
    return (
      Math.max(
        recursivelyGetBinaryTreeHeight(node.left),
        recursivelyGetBinaryTreeHeight(node.right)
      ) + 1
    );
  }
};
const getBinaryTreeHeight = (node: BinaryTreeNode) => {
  if (!node) {
    return 0;
  }
  const queue = [node];
  let height = -1;
  while (queue.length) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift() as BinaryTreeNode;
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
    height++;
  }
  return height;
};
// <----------------- Perfect Binary Tree ----------------->
function isPerfectBinaryTree(root: BinaryTreeNode) {
  // judge according to loop
  const queue: BinaryTreeNode[] = [root];
  let flag = true;
  while (queue.length) {
    const node = queue.shift() as BinaryTreeNode;
    if (!node.left || !node.right) {
      // perfect binary tree must have left and right child
      flag = false;
      break;
    } else {
      queue.push(node.left, node.right);
    }
  }
  return flag;
}

// <----------------- BST ----------------->
function isBST(root: BinaryTreeNode) {
  if (!root) {
    return false;
  }
  const queue = [root];
  while (queue.length) {
    const node = queue.shift() as BinaryTreeNode;
    const { left, right } = node;
    if (left) {
      if (left.val > node.val) {
        return false;
      }
      queue.push(left);
    }
    if (right) {
      if (right.val < node.val) {
        return false;
      }
      queue.push(right);
    }
  }
  return true;
}
function recursiveIsBST({
  node,
  min,
  max
}: {
  node: IBinaryTreeNode;
  min?: number;
  max?: number;
}) {
  if (!node) {
    return true;
  }
  const leftOutBound = max !== undefined && node.val >= max;
  const rightOutBound = min !== undefined && node.val <= min;
  if (leftOutBound || rightOutBound) {
    return false;
  }
  return (
    recursiveIsBST({
      node: node.left,
      min,
      max: node.val
    }) &&
    recursiveIsBST({
      node: node.right,
      min: node.val,
      max
    })
  );
}
function searchBST(root: BinaryTreeNode, targetVal: number): IBinaryTreeNode {
  let node: IBinaryTreeNode = root;
  while (node) {
    if (node.val < targetVal) {
      // search right for larger
      node = node.right;
    } else if (node.val > targetVal) {
      // search left for smaller
      node = node.left;
    } else {
      break;
    }
  }
  return node;
}
function insertNodeBST(root: IBinaryTreeNode, val: number) {
  if (!root) {
    return;
  }
  let parent: IBinaryTreeNode = null;
  let node: IBinaryTreeNode = root;
  // find parent
  while (node) {
    // break when found duplicate node
    if (node.val === val) return;
    parent = node;
    if (node.val < val) {
      node = node.right;
    } else if (node.val > val) {
      node = node.left;
    }
  }
  // insert
  if (parent) {
    const insertNode = new BinaryTreeNode(val);
    if (parent.val < val) {
      parent.right = insertNode;
    } else {
      parent.left = insertNode;
    }
  }
}
function removeNodeBST(root: IBinaryTreeNode, val: number) {
  if (!root) {
    return;
  }
  /** target node */
  let node: IBinaryTreeNode = root;
  /** parent node */
  let parent: IBinaryTreeNode = null;
  /** position of target node against parent node */
  let isLeft = false;
  while (node) {
    if (node.val === val) {
      break;
    }
    parent = node;
    if (node.val < val) {
      isLeft = false;
      node = node.right;
    } else {
      isLeft = true;
      node = node.left;
    }
  }
  if (node === root) {
    console.warn('root node cannot be removed');
    return;
  }
  // not found target node
  if (!node || !parent) return;
  if (!node.left || !node.right) {
    // has no child or one child
    const child = node.left || node.right;
    // replace with child or null
    isLeft ? (parent.left = child) : (parent.right = child);
  } else {
    // two children
    let lastLeaf: IBinaryTreeNode = node.right;
    while (lastLeaf.left) {
      lastLeaf = lastLeaf.left;
    }
    // remove last leaf
    removeNodeBST(parent, lastLeaf.val);
    // replace current with last leaf node
    const replaceNode = new BinaryTreeNode(lastLeaf.val);
    replaceNode.left = node.left;
    replaceNode.right = node.right;
    isLeft ? (parent.left = replaceNode) : (parent.right = replaceNode);
  }
}
function buildBSTFromSortedArray(
  arr: number[],
  start = 0,
  end = arr.length - 1
) {
  if (start > end) {
    return null;
  }
  const mid = Math.floor((start + end) / 2);
  const root = new BinaryTreeNode(arr[mid]);
  root.left = buildBSTFromSortedArray(arr, start, mid - 1);
  root.right = buildBSTFromSortedArray(arr, mid + 1, end);
  return root;
}

function buildBSTFromArray(arr: number[]) {
  const sortedArr = arr.slice().sort((a, b) => a - b);
  return buildBSTFromSortedArray(sortedArr);
}
/**
 * construct test tree
 * @description every node has its index
 */
function constructTestPerfectTree(nodeNum: number) {
  const root = new BinaryTreeNode(0);
  const queue: BinaryTreeNode[] = [root];
  let index = 1;
  while (queue.length) {
    const node = queue.shift() as BinaryTreeNode;
    if (index < nodeNum) {
      node.left = new BinaryTreeNode(index++);
      queue.push(node.left);
    }
    if (index < nodeNum) {
      node.right = new BinaryTreeNode(index++);
      queue.push(node.right);
    }
  }
  return root;
}
function main() {
  const testTreeNode = constructTestPerfectTree(3);
  console.log('recursive depth', recursivelyGetBinaryTreeHeight(testTreeNode));
  console.log('depth', getBinaryTreeHeight(testTreeNode));
}
main();
