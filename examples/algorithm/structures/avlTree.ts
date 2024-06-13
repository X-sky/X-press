// avl tree: named after its inventors Adelson-Velsky and Landis, is a self-balancing binary search tree.
// binary search tree will degenerate into a linked list if the tree is not balanced.
// alv tree rotates nodes according to its balance factor to keep the tree height balanced.
// balance factor = height(left node) - height(right node). The absolute value of the balance factor should be less than or equal to 1.

type Nullable<T> = T | null;
class AVLTreeNode {
  val: number;
  height: number;
  left: Nullable<AVLTreeNode> = null;
  right: Nullable<AVLTreeNode> = null;
  constructor({ val, height, left, right }: Partial<AVLTreeNode>) {
    this.val = val ?? 0;
    this.height = height ?? 0;
    this.left = left || null;
    this.right = right || null;
  }
}

function getNodeHeight(node: Nullable<AVLTreeNode>) {
  return node ? node.height : -1;
}
/**
 * update the height of the node
 * @description the height of the node is the maximum height of its children plus 1
 */
function updateNodeHeight(node: AVLTreeNode) {
  if (!node) return;
  node.height =
    Math.max(getNodeHeight(node.left), getNodeHeight(node.right)) + 1;
}

/**
 * get the balance factor of the node
 */
function getNodeBalanceFactor(node: Nullable<AVLTreeNode>) {
  if (!node) return 0;
  return getNodeHeight(node.left) - getNodeHeight(node.right);
}

/**
 * rotate node if current node is not balanced
 * @description there are 4 cases to rotate the node depending on the child node path
 * @path1: left-left -> right rotate
 * @path2: right-right -> left rotate
 * @path3: left-right -> child node left rotate, current node right rotate
 * @path4: right-left -> child node right rotate, current node left rotate
 */

/**
 * path1 need left rotate
 */
function rightRotate(node: Nullable<AVLTreeNode>): Nullable<AVLTreeNode> {
  if (!node) return null;
  const child = node.left;
  if (!child) return null;
  const grandChildRight = child.right;
  child.right = node;
  node.left = grandChildRight;
  updateNodeHeight(node);
  updateNodeHeight(child);
  return child;
}

/**
 * path2 need right rotate
 */
function leftRotate(node: Nullable<AVLTreeNode>): Nullable<AVLTreeNode> {
  if (!node) return null;
  const child = node.right;
  if (!child) return null;
  const grandChildLeft = child.left;
  child.left = node;
  node.right = grandChildLeft;
  updateNodeHeight(node);
  updateNodeHeight(child);
  return child;
}
function rotateNode(node: Nullable<AVLTreeNode>): Nullable<AVLTreeNode> {
  if (!node) {
    return null;
  }
  const nodeBf = getNodeBalanceFactor(node);
  if (nodeBf > 1) {
    // left-left or left-right
    const childNodeBf = getNodeBalanceFactor(node.left);
    if (childNodeBf >= 0) {
      // left-left, right rotate
      rightRotate(node);
    } else {
      // left-right, child left rotate, current right rotate
      node.left = leftRotate(node.left);
      rightRotate(node);
    }
  } else if (nodeBf < -1) {
    // right-right or right-left
    const childNodeBf = getNodeBalanceFactor(node.right);
    if (childNodeBf >= 0) {
      // right-left, child right rotate, current left rotate
      node.right = rightRotate(node.right);
      leftRotate(node);
    } else {
      // right-right, left rotate
      leftRotate(node);
    }
  }
  return node;
}

function insertNode(
  node: Nullable<AVLTreeNode>,
  val: number
): Nullable<AVLTreeNode> {
  if (!node) {
    return new AVLTreeNode({ val });
  }
  if (val < node.val) {
    node.left = insertNode(node.left, val);
  } else if (val > node.val) {
    node.right = insertNode(node.right, val);
  } else {
    // duplicate node
    return node;
  }
  updateNodeHeight(node);
  node = rotateNode(node);
  return node;
}

function removeNode(
  node: Nullable<AVLTreeNode>,
  val: number
): Nullable<AVLTreeNode> {
  if (!node) {
    return null;
  }
  if (val < node.val) {
    node.left = removeNode(node.left, val);
  } else if (val > node.val) {
    node.right = removeNode(node.right, val);
  } else {
    if (!node.left || !node.right) {
      const child = node.left || node.right;
      if (!child) {
        return null;
      } else {
        node = child;
      }
    } else {
      let temp = node.right;
      while (temp.left) {
        temp = temp.left;
      }
      node.right = removeNode(node.right, temp.val);
      node.val = temp.val;
    }
  }
  updateNodeHeight(node);
  node = rotateNode(node);
  return node;
}
