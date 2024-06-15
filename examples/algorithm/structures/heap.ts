// heap is a complete binary tree, which means all levels of the tree are fully filled except possibly for the last level, which is filled from left to right.
// a complete binary tree is suitable to be stored in an array, where the parent node is at index i, the left child is at index 2 * i + 1

const getLeftChildIdx = (i: number): number => 2 * i + 1;

const getRightChildIdx = (i: number): number => getLeftChildIdx(i) + 1;

const getParentIdx = (i: number): number => Math.floor(i - 1 / 2);

type HeapType = 'max' | 'min';

class Heap {
  #data: number[];
  #type: HeapType;
  #valueInHeap = (val: number) => this.#data.includes(val);
  #compare = (a: number, b: number) => {
    if (!this.#idxInHeap(a)) {
      throw new Error(`idx ${a} not in heap`);
    }
    if (!this.#idxInHeap(b)) {
      throw new Error(`idx ${b} not in heap`);
    }
    return this.#type === 'max'
      ? this.#data[a] > this.#data[b]
      : this.#data[a] < this.#data[b];
  };
  #idxInHeap = (idx: number) => {
    if (Math.floor(idx) !== idx) {
      throw new Error('idx should be integer');
    }
    return idx >= 0 && idx < this.#data.length;
  };
  #swap = (idx1: number, idx2: number) => {
    if (this.#idxInHeap(idx1) && this.#idxInHeap(idx2)) {
      const temp = this.#data[idx1];
      this.#data[idx1] = this.#data[idx2];
      this.#data[idx2] = temp;
    } else {
      throw new Error('swap index out of bound');
    }
  };
  constructor({
    initialData = [],
    type = 'max'
  }: {
    initialData?: number[];
    type?: HeapType;
  }) {
    initialData.forEach((n) => this.push(n));
    this.#type = type;
  }
  getSize() {
    return this.#data.length;
  }
  push(n: number) {
    const lastIdx = this.#data.length;
    this.#data.push(n);
    this.siftUp(lastIdx);
  }
  pop() {
    if (this.#data.length === 0) {
      throw new Error('empty heap');
    }
    this.#swap(0, this.#data.length - 1);
    const val = this.#data.pop();
    this.siftDown(0);
    return val;
  }
  /**
   * sift idx up to the right position
   */
  siftUp(idx: number) {
    if (!this.#idxInHeap(idx)) {
      throw new Error('idx out of bound');
    }
    while (true) {
      const p = getParentIdx(idx);

      if (p < 0 || this.#compare(p, idx)) {
        break;
      }
      this.#swap(p, idx);
      idx = p;
    }
  }
  siftDown(idx: number) {
    if (!this.#idxInHeap(idx)) {
      throw new Error('idx out of bound');
    }
    while (true) {
      const cil = getLeftChildIdx(idx);
      const crl = getRightChildIdx(idx);
      let nextIdx = idx;
      if (this.#idxInHeap(cil) && this.#compare(cil, idx)) {
        nextIdx = cil;
      } else if (this.#idxInHeap(crl) && this.#compare(crl, idx)) {
        nextIdx = crl;
      } else {
        break;
      }
      this.#swap(idx, nextIdx);
      idx = nextIdx;
    }
  }
}
