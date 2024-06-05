export class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val = 0, next?: ListNode) {
    this.val = val;
    this.next = next ?? null;
  }
}

export class DoubleEndedLinkedNode {
  val: number;
  next?: DoubleEndedLinkedNode;
  prev?: DoubleEndedLinkedNode;
  constructor(val = 0) {
    this.val = val;
  }
}

/** 单向链表 */
export class OneWayLinkedList {
  #head: ListNode | null;
  #size = 0;
  constructor(head?: ListNode) {
    this.#head = head ?? null;
  }
  size() {
    return this.#size;
  }
  hasNode(node: ListNode): boolean {
    if (!this.#head) {
      return false;
    }
    return Boolean(this.findParent(node));
  }
  findParent(node: ListNode): ListNode | null {
    if (!this.#head) {
      return null;
    } else {
      let traverseNode = this.#head;
      while (traverseNode.next) {
        if (traverseNode.next === node) {
          return traverseNode;
        }
        traverseNode = this.#head;
      }
      return null;
    }
  }
  append(node: ListNode) {
    if (node.next) {
      // not a node in this linked list
      throw new Error('append failed: not a clean node');
    }
    if (!this.#head) {
      this.#head = node;
    } else {
      // find last
      let lastNode = this.#head;
      while (lastNode.next) {
        lastNode = this.#head;
      }
      lastNode.next = node;
    }
  }
  prepend(node: ListNode) {
    if (node.next) {
      throw new Error('append failed: not a clean node');
    }
    node.next = this.#head;
    this.#head = node;
  }
  insert(node: ListNode, prev: ListNode) {
    const p = prev.next;
    prev.next = node;
    node.next = p;
  }
  remove(node: ListNode) {
    const parent = this.findParent(node);
    if (!parent) {
      console.log('this node is not in this linked list');
      return;
    } else {
      parent.next = node.next;
    }
  }
}

/** 链表实现队列 */
export class LinkedQueue {
  // 头节点
  #front: ListNode | null = null;
  // 尾节点
  #rear: ListNode | null = null;
  // 队列长度
  #size = 0;

  getSize() {
    return this.#size;
  }

  isEmpty() {
    return this.#size === 0;
  }

  /** 新元素插入队尾 */
  enqueue(num: number) {
    const node = new ListNode(num);
    if (!this.#front) {
      // 队列为空，头尾指向同一节点
      this.#front = node;
    } else {
      // 队列不为空，插入队尾
      this.#rear!.next = node;
    }
    // 变更尾节点
    this.#rear = node;
    this.#size++;
  }
  /** 队首出队并返回出队元素 */
  dequeue() {
    if (!this.#front) {
      throw new Error('dequeue failed: queue is empty');
    }
    const node = this.#front;
    this.#front = this.#front.next;
    this.#size--;
    return node;
  }
  getValue(idx: number) {
    if (!this.#front) {
      throw new Error('getValue failed: queue is empty');
    }
    let i = 0;
    let node = this.#front;
    while (i < idx) {
      if (!node.next) {
        throw new Error('getValue failed: index out of range');
      }
      node = node.next;
    }
    return node.val;
  }
}

export class FixedQueue {
  #list: number[] = [];
  #front = 0;
  #size = 0;
  constructor(capacity: number) {
    this.#list = new Array(capacity);
  }
  getCapacity() {
    return this.#list.length;
  }
  getSize() {
    return this.#size;
  }
  isEmpty() {
    return this.#size === 0;
  }
  peek(): number {
    if (this.isEmpty()) {
      throw new Error('peek failed: queue is empty');
    }
    return this.#list[this.#front];
  }
  /** 新元素插入队尾 */
  enqueue(val: number) {
    const capacity = this.getCapacity();
    if (this.#size === capacity) {
      throw new Error('enqueue failed: queue is full');
    }
    const rear = (this.#front + this.#size) % capacity;
    this.#list[rear] = val;
    this.#size++;
  }
  /** 队首出队并返回出队元素 */
  dequeue() {
    const firstEl = this.peek();
    this.#front = (this.#front + 1) % this.getCapacity();
    this.#size--;
    return firstEl;
  }
}

export class DoubleEndedLinkedQueue {
  #first?: DoubleEndedLinkedNode;
  #last?: DoubleEndedLinkedNode;
  #size = 0;
  getSize() {
    return this.#size;
  }
  isEmpty() {
    return this.#size === 0;
  }
  enqueueFirst(val: number) {
    const node = new DoubleEndedLinkedNode(val);
    const curFirst = this.#first;
    if (!curFirst) {
      this.#last = node;
    } else {
      node.next = curFirst;
      curFirst.prev = node;
    }
    this.#first = node;
    this.#size++;
  }
  dequeueFirst() {
    const first = this.#first;
    const second = first?.next;
    if (first) {
      delete first.next;
    }
    if (second) {
      delete second.prev;
    }
    this.#first = second;
    this.#size--;
    if (this.isEmpty()) {
      this.#last = undefined;
    }
    return first;
  }
  enqueueLast(val: number) {
    const node = new DoubleEndedLinkedNode(val);
    const last = this.#last;
    if (!last) {
      this.#first = node;
    } else {
      node.prev = last;
      last.next = node;
    }
    this.#last = node;
    this.#size++;
  }
}
