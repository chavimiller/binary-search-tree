class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  buildBSTRecur(arr, start, end) {
    if (start > end) return null;
    const mid = start + Math.floor((end - start) / 2);
    const root = new Node(arr[mid]);
    root.left = this.buildBSTRecur(arr, start, mid - 1);
    root.right = this.buildBSTRecur(arr, mid + 1, end);
    return root;
  }

  buildTree(array) {
    const workingArray = [...new Set(array.sort((a, b) => a - b))];
    console.log(`workingArray prints out: ${workingArray}`);
    return this.buildBSTRecur(workingArray, 0, workingArray.length - 1);
  }

  insert(value) {
    function insertRec(root, key) {
      if (root === null) return new Node(key);

      if (root.data === key) return root;

      if (key < root.data) {
        root.left = insertRec(root.left, key);
      } else {
        root.right = insertRec(root.right, key);
      }
      return root;
    }
    this.root = insertRec(this.root, value);
  }

  deleteItem(value) {
    function getSuccessor(node) {
      let currentNode = node.right;
      while (currentNode !== null && currentNode.left !== null) {
        currentNode = currentNode.left;
      }
      return currentNode;
    }
    function deleteItemHelper(node, value) {
      if (node === null) return node;

      if (value > node.data) {
        node.right = deleteItemHelper(node.right, value);
      } else if (value < node.data) {
        node.left = deleteItemHelper(node.left, value);
      } else {
        if (node.left === null) {
          return node.right;
        }

        if (node.right === null) {
          return node.left;
        }

        const successor = getSuccessor(node);
        node.data = successor.data;
        node.right = deleteItemHelper(node.right, successor.data);
      }

      return node;
    }
    this.root = deleteItemHelper(this.root, value);
  }

  find(value) {
    let currentNode = this.root;
    while (currentNode !== null) {
      if (currentNode.data === value) {
        return currentNode;
      } else {
        value > currentNode.data
          ? (currentNode = currentNode.right)
          : (currentNode = currentNode.left);
      }
    }
    console.log(`The value ${value} was not found in the tree`);
    return null;
  }

  levelOrderForEach(callback) {
    if (!callback) {
      throw new Error("Callback is required");
    }
    if (this.root === null) return;

    let queue = [this.root];
    while (queue.length !== 0) {
      let currentNode = queue.shift();

      callback(currentNode);

      if (currentNode.left) {
        queue.push(currentNode.left);
      }
      if (currentNode.right) {
        queue.push(currentNode.right);
      }
    }
  }

  inOrderForEach(callback) {
    if (!callback) {
      throw new Error("Callback is required");
    }
    function inOrderRecur(root) {
      if (root === null) {
        return;
      } else {
        inOrderRecur(root.left);
        callback(root);
        inOrderRecur(root.right);
      }
    }
    inOrderRecur(this.root);
  }

  preOrderForEach(callback) {
    if (!callback) {
      throw new Error("Callback is required");
    }
    function preOrderRecur(root) {
      if (root === null) {
        return;
      } else {
        callback(root);
        preOrderRecur(root.left);
        preOrderRecur(root.right);
      }
    }
    preOrderRecur(this.root);
  }

  postOrderForEach(callback) {
    if (!callback) {
      throw new Error("Callback is required");
    }
    function postOrderRecur(root) {
      if (root === null) {
        return;
      } else {
        postOrderRecur(root.left);
        postOrderRecur(root.right);
        callback(root);
      }
    }
    postOrderRecur(this.root);
  }

  height(value) {
    let foundNode = this.find(value);
    if (!foundNode) return null;

    function heightRecur(node) {
      if (node === null) {
        return -1;
      } else {
        return 1 + Math.max(heightRecur(node.left), heightRecur(node.right));
      }
    }
    return heightRecur(foundNode);
  }

  depth(value) {
    let currentNode = this.root;
    let depth = 0;
    while (currentNode !== null) {
      if (currentNode.data === value) {
        return depth;
      } else {
        value > currentNode.data
          ? (currentNode = currentNode.right)
          : (currentNode = currentNode.left);
        depth++;
      }
    }
  }

  isBalanced() {
    function height(node) {
      if (node === null) return 0;

      return 1 + Math.max(height(node.left), height(node.right));
    }

    function check(root) {
      if (root === null) return true;

      let leftHeight = height(root.left);
      let rightHeight = height(root.right);

      if (Math.abs(leftHeight - rightHeight) > 1) return false;

      return check(root.left) && check(root.right);
    }

    return check(this.root);
  }

  rebalance() {
    if (this.isBalanced() === true) {
      console.log("This tree does not need balancing");
      return;
    }

    let storeValues = [];
    function storeRecur(root) {
      if (root === null) {
        return;
      } else {
        storeRecur(root.left);
        storeValues.push(root.data);
        storeRecur(root.right);
      }
    }
    storeRecur(this.root);

    this.root = this.buildTree(storeValues);
    console.log("Tree has been rebalanced");
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

// Insertion method tested
// Delete method tested
// Find method tested
// Level order forEach method tested
// Height method tested
// Depth method tested
// isBalanced method tested

const array1 = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const tree1 = new Tree(array1);
prettyPrint(tree1.root);
console.log(tree1.isBalanced());
tree1.insert(25);
tree1.insert(2);
tree1.insert(1000);
tree1.insert(6);
tree1.insert(50);
tree1.insert(1);
tree1.insert(8);
tree1.insert(30000);
tree1.insert(4);
tree1.insert(15000);
tree1.insert(100);
tree1.insert(5000);
tree1.insert(15);
console.log(tree1.isBalanced());
tree1.rebalance();
prettyPrint(tree1.root);
console.log(tree1.isBalanced());
