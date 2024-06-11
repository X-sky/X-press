// hash table, also known as hash map, is a data structure that maps keys to values
// specifically, a hash table can get values in O(1) time complexity when given a key
// Python's dict uses open addressing with pseudo-random probing; Java uses chaining, and after JDK 1.8, when the array length reaches 64 and the linked list length reaches 8, it switches to a red-black tree; Go uses chaining.

type Nullable<T> = T | null;
interface IBucket {
  key: number;
  val: string;
}

class Bucket implements IBucket {
  key: number;
  val: string;
  constructor(key: number, val: string) {
    this.key = key;
    this.val = val;
  }
}
/** 数组哈希表 */
class HashTableArray {
  #capacity = 1000;
  #buckets = new Array<Nullable<IBucket>>(this.#capacity);

  #hashFunc(k: number): number {
    return k % this.#capacity;
  }

  get(k: number): string | null {
    const calcKey = this.#hashFunc(k);
    const bucket = this.#buckets[calcKey];
    return bucket ? bucket.val : null;
  }
  set(k: number, v: string) {
    const idx = this.#hashFunc(k);
    this.#buckets[idx] = new Bucket(k, v);
  }
  delete(k: number) {
    const calcKey = this.#hashFunc(k);
    this.#buckets[calcKey] = null;
  }
  entries() {
    return this.#buckets.filter((bucket) => bucket !== null) as IBucket[];
  }
  values() {
    return this.entries().map((bucket) => bucket.val);
  }
  keys() {
    return this.entries().map((bucket) => bucket.key);
  }
}

/** 冲突的哈希表 */
class HashTableChaining {
  /** 当前大小 */
  #size = 0;
  /** 当前容量 */
  #capacity = 4;
  /** 负载 */
  #loadThreshold = 0.75;
  /** 扩充比例 */
  #extendRatio = 2;
  #buckets: IBucket[][] = new Array(this.#capacity).fill([]);

  #hashFunc(k: number): number {
    return k % this.#capacity;
  }

  #loadFactor(): number {
    return this.#size / this.#capacity;
  }

  /** extend array when out of boundary */
  #extend() {
    const oldBuckets = this.#buckets.reduce(
      (acc, cur) => acc.concat(cur.flat()),
      [] as IBucket[]
    );
    this.#capacity *= this.#extendRatio;
    this.#buckets = new Array(this.#capacity).fill([]);
    this.#size = 0;
    oldBuckets.forEach((bucket) => {
      this.set(bucket);
    });
  }
  set({ key, val }: IBucket) {
    if (this.#loadFactor() > this.#loadThreshold) {
      // extend hashmap
      this.#extend();
    }
    const hashIdx = this.#hashFunc(key);
    const bucketPos = this.#buckets[hashIdx];
    const targetBucket = bucketPos.find((b) => b.key === key);
    if (targetBucket) {
      // update value
      targetBucket.val = val;
    } else {
      // chain new bucket
      bucketPos.push(new Bucket(key, val));
      this.#size++;
    }
  }
  get(key: number): string | null {
    const hashIdx = this.#hashFunc(key);
    const bucketPos = this.#buckets[hashIdx];
    // time complexity: O(n)
    // can be optimized by using avl tree or red-black tree
    const targetBucket = bucketPos.find((b) => b.key === key);
    if (targetBucket) {
      return targetBucket.val;
    }
    return null;
  }
}

class HashTableOpenAddr {
  #size = 0;
  #capacity = 4;
  #loadThreshold = 0.75;
  #extendRatio = 2;
  #TOMBSTONE = new Bucket(-1, '');
  #buckets = new Array<IBucket | null>(this.#capacity).fill(null);

  #hashFunc = (k: number) => k % this.#capacity;
  #loadFactor = () => this.#size / this.#capacity;
  #extend = () => {
    const tmp = this.#buckets;
    this.#capacity *= this.#extendRatio;
    this.#buckets = new Array(this.#capacity).fill(null);
    this.#size = 0;
    for (const p of tmp) {
      if (p && p !== this.#TOMBSTONE) {
        this.set(p as any);
      }
    }
  };

  /**
   * find bucket idx, return first tombstone idx if not exist
   */
  findBucketIdx(k: number): number {
    let idx = this.#hashFunc(k);
    let firstTombstone = -1;
    // linear detection
    // break if find empty bucket or find target bucket
    while (this.#buckets[idx] !== null) {
      if (this.#buckets[idx]?.key === k) {
        if (firstTombstone !== -1) {
          // move target node to first tombstone if has any
          this.#buckets[firstTombstone] = this.#buckets[idx];
          this.#buckets[idx] = this.#TOMBSTONE;
          return firstTombstone;
        }
        return idx;
      }
      if (firstTombstone === -1 && this.#buckets[idx] === this.#TOMBSTONE) {
        firstTombstone = idx;
      }
      idx = (idx + 1) % this.#capacity;
    }
    // return idx of empty point
    return firstTombstone === -1 ? idx : firstTombstone;
  }
  get(k: number): IBucket['val'] | null {
    const idx = this.findBucketIdx(k);
    if (this.#buckets[idx] && this.#buckets[idx] !== this.#TOMBSTONE) {
      return this.#buckets[idx]?.val || null;
    }
    return null;
  }
  set({ key, val }: IBucket) {
    if (this.#loadFactor() > this.#loadThreshold) {
      this.#extend();
    }
    const idx = this.findBucketIdx(key);
    const targetBucket = this.#buckets[idx];
    if (targetBucket && targetBucket !== this.#TOMBSTONE) {
      // update
      targetBucket.val = val;
      return;
    }
    this.#buckets[idx] = new Bucket(key, val);
    this.#size++;
  }
  remove(k: number) {
    const targetIdx = this.findBucketIdx(k);
    if (
      this.#buckets[targetIdx] &&
      this.#buckets[targetIdx] !== this.#TOMBSTONE
    ) {
      this.#buckets[targetIdx] = this.#TOMBSTONE;
      this.#size--;
    }
  }
}
