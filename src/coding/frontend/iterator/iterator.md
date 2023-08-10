---
outline: deep
---

# Iterator and Generator

## Iteration

> 迭代的英文iteration来自拉丁文itero，意思是⁄“重复”或“再来”。在软开领域，迭代就是**按照顺序反复多次**执行一段程序，通常有明确的终止条件

- 循环是一种基础的迭代，可以指定迭代次数(有明确的终止条件)，以及每次迭代要执行什么操作(反复多次执行一段程序)
- 迭代通常在一个**有序**集合上进行，有序集合中的所有项都可以按照既定的顺序被遍历。数组是js中最典型的有序集合，因而我们经常会把迭代与数组遍历混为一谈，实际二者是包含的关系，数组遍历是迭代的一种。

### Interator Pattern(迭代器模式)

> 早期版本的ECMAScript中，迭代必须借助循环或者其他辅助结构。随着代码量的不断增加，结构会变的越发混乱。很多语言通过原生的语言结构解决了这个问题，开发者无需事先知道如何迭代就能实现迭代操作。这个解决方案就是迭代器模式

#### Concept

> 迭代器模式描述了一个方案：Something can be described as “**iterable**” and can implement a formal **Iterable interface** and consumed by an **Iterator**

Iterable既可以描述一个对象是可迭代的，也可以直接指代一个可迭代对象。可迭代对象可以理解为具有特定数据结构的对象，其满足两个条件：

1. 包含的元素都是有限的
2. 具有无歧义的遍历顺序

当然可迭代的这一概念并不局限于上述结构，凡是具有类似表现的，比如计数循环，都是可迭代的。

#### Iterable Protocol(可迭代协议)

> 实现可迭代协议要求同时具备两种能力：自我识别和创建iterator Inerface(迭代器接口)的能力
>
> ECMAScript暴露了[Symbol.iterator]的属性，该属性指向一个迭代器工厂函数。调用这个工厂函数，则可以生成一个新的迭代器

很多内置类型都实现了迭代接口，包括：String, Array, Map, Set, arguments, NodeList等DOM Collection。

实际开发中，并非一定要显式调用这个工厂函数来生成iterator，实现可迭代协议的所有类型结构都会自动兼容可迭代对象：

1. for...of循环 ` for (const x of [0, 1, 2]) console.log(x)`
2. 数组结构 ` const [a, b] = [0, 1, 2]`
3. 扩展操作符 `doSomeThing(...restArgs)`
4. Array.from
5. 创建Set `const newSet = new Set([a, b, c])`
6. 创建Map
7. Promise.all() ` Promise.all([a, b, c])`
8. Promise.race()
9. yield * 操作符 (在Generator生成器章节中讲解)

这种兼容可以沿着原型链进行追溯

#### Iterator Protocol(迭代器协议)

>  通过查看[Symbol.iterator]属性，可以获得这个工厂函数，直接调用可以生成一个一次性的迭代器

迭代器是一种**一次性**使用的**对象**，用于迭代与其关联的可迭代对象。

- 通过定义next()方法来推进迭代进度。next返回一个对象，其中包含迭代进度(done)和迭代数据(value)，一旦迭代到达done为true的状态时，调用next方法是幂等的
- 有可选的return方法用来定义迭代器在特殊情况下过早结束时，调用的方法，同样需要返回一个包含迭代进度(done)的对象，需要自行定义。调用return并不会强制使迭代器关闭，但return依然会被调用。特殊情况包括：
  1. for...of中通过return/throw/break关键字退出迭代
  2. 解构没有消耗全部的值 `const [a, b] = [0, 1, 2]`

```javascript
const list = [0, 1];
let iter = list[Symbol.iterator]();
iter.next(); //{done: false; value: 0}
iter.next(); //{done: false; value: 1}
iter.next(); //{done: true; value: undefined}
iter.next(); //{done: true; value: undefined}
```

不同的迭代器之间并没有联系。

```javascript
const list = [0, 1];
let iter1 = list[Symbol.iterator]();
let iter2 = list[Symbol.iterator]();
iter1.next(); //{done: false; value: 0}
iter2.next(); //{done: false; value: 0}
iter2.next(); //{done: false; value: 1}
```

迭代器内部是一个“黑箱”，既无法知道当前所处的迭代位置，也无法知道迭代对象的数据状态。他不保存被创建时的数据快照，只是通过一个指针追踪迭代进度。这意味着如果迭代对象产生了变化迭代器会实时反映这个变化。

```javascript
const list = [0, 1, 2];
const iter = list[Symbol.iterator]();
iter.next(); //{done: false; value: 0}
// 插入新的值
list.splice(1, 0, 'insert');
iter.next(); //{done: false; value: 'insert'}
iter.next(); //{done: false; value: 1}
```

⚠️注意：因为迭代器内部维护着一个指向可迭代对象的引用，所以迭代器的存在会阻止垃圾回收程序回收可迭代对象

### Custom Itterator(自定义迭代器)

迭代器模式会让期望迭代数据的结构自动兼容可迭代协议，因此我们可以在class中使用[Symbol.iterator]暴露迭代器工厂函数，从而自定义迭代器

```javascript
class Counter {
  constructor(limit) {
    this.count = 1;
    this.limit = limit;
  }
  [Symbol.iterator](){
		// 闭包变量，可多次迭代
    let count = 1,
    limit = this.limit;
    return {
      next() {
        if (count <= limit) {
          return {done: false, value: count++};
        } else {
          return {done: true, value: undefined};
        }
      },
      return(){
        console.log('我还没迭代完呢！');
        return {done: true, value: 'someValue'}
      }
    };
  }
}
let counter = new Counter(3);
for (let i of counter) console.log(i) 
//1 
//2 
//3
for (let i of counter) {
  if (i===2) break;
  console.log(i) 
}
//1 
//'我还没迭代完呢！'
const [a, b] = counter;
// (非输出)a => 1; b => 2
// '我还没迭代完呢！'
```

## Generator

> Generator是ES6新增的一个强大的能力，拥有在一个函数块内**暂停**和**恢复**代码执行的能力

生成器的形式是一个函数，函数名称前加一个星号(*)表示它是一个生成器(星号忽略空格)。只要是可以定义函数的地方，就可以定义生成器。函数声明，函数表达式，对象字面量的方法，class实例/静态方法，都可以定义生成器。箭头函数不可用做生成器函数

### generator object(生成器对象)

调用generator会产生一个生成器对象。生成器对象可以类比迭代器，也通过next方法推动执行，其中也包含迭代进度(done)和迭代数据(value)。

事实上，生成器对象内部实现了可迭代协议，其[Symbol.iterator]属性的工厂函数调用结果指向自身，在这种层面上可以说，生成器对象本身就是一种迭代器。

generator**调用即挂起**，generator object一开始处于暂停执行(suspended)的状态。通过调用其next方法，让generator继续执行。当next到达done: true时，其value就是generator的return的值

```javascript
function * generatorFn() {
	console.log('执行了');
  return 'returnValue'
}
let gen = generatorFn();
// (没有任何日志)
gen.next(); 
// '执行了' 
// {done: true; value: 'returnValue'}
gen[Symbol.iterator]() === gen; // true
```

generator object类比迭代器，generator产生的每个generator object都会区分作用域，互不影响。

generator object可以作为可迭代对象被迭代

```javascript
function * generatorFn() {
  yield 1;
  yield 2;
  yield 3;
}
for (const x of generatorFn()) {
  console.log(x); // 1 2 3
}
```

### yield关键字

>  yield是生成器最有用的地方，它赋予了函数内部暂停与继续执行的能力。生成器在yield之前会正常执行，遇到这个关键字后，执行会暂停，函数的作用与的状态会被保留。

yield可以类比为“函数内部的return”，通过yield退出的函数会处于done: false状态，yield的值会作为next中value的值

```javascript
function *generatorFn() {
  yield '1st';
  yield '2nd';
  return 'finished';
}
let gen = generatorFn();
gen.next(); // {done: false, value: '1st'}
gen.next(); // {done: false, value: '2nd'}
gen.next(); // {done: false, value: 'finished'}
```

yield既可作为输入，也可作为输出。第一次调用next()传入的值不会被使用，因为这次调用是为了开始执行generator

```javascript
function *generatorFn() {
  console.log('function start');
  console.log(yield '1st');
  console.log(yield '2nd');
}
let gen = generatorFn();
gen.next('1st pass'); // 'function start' //'1st'
gen.next('2nd pass'); // '2nd' // '2nd pass'
gen.next('3rd pass'); // '3rd' // '3rd pass'
```

yield* 迭代对象，一次产出一个值。与生成器星号类似，星号标志也是忽略空格的。而与yield不同，yield*不可以作为输出使用

```javascript
function *generatorFn() {
  // for (const x of [1,2,3]) {
  //   yield x;
  // }
  yield *[1, 2, 3];
}
```





