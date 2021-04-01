# 手写 Array 的一些方法

参考[官方](https://tc39.es/ecma262/)

## push

下面给出官方的描述。

When the push method is called with zero or more arguments, the following steps are taken:
1. Let O be ? ToObject(this value).
2. Let len be ? LengthOfArrayLike(O).
3. Let argCount be the number of elements in items.
4. If len + argCount > 2^53 - 1, throw a TypeError exception.
5. For each element E of items, do
    a. Perform ? Set(O, ! ToString(F(len)), E, true).
    b. Set len to len + 1.
6. Perform ? Set(O, "length", F(len), true).
7. Return F(len).

```js
Array.prototype.push = function(...items) {
  let O = Object(this)
  let len = this.length >>> 0
  let argsLen = items.length >>> 0

  if(len + argsLen > 2 ** 53 - 1) {
    throw new TypeError("The number of array is over the max value")
  }
  for (let i = 0 ; i < argsLen ; i++) {
    O[len + i] = items[i]
  }
  let newLength = len + argsLen
  O.length = newLength
  return newLength
}
```

这里就讲讲无符号位移吧。

移位操作符在移位前做了两种转换，第一将不是**number**类型的数据转换为number，第二将**number**转换为无符号的**32bit**数据，也就是**Uint32**类型。代码中移位 0 位主要就是用了js的内部特性做了前两种转换。

我们看一下转换为Uint32类型具体的规则：

1. 如果不能转换为`Number`，那就为`0`。
2. 如果为非整数，先转换为整数，参考公式`sign(n) ⋅ floor(abs(n))`

3. 如果是正数，返回正数，如果是负数，返回负数 + 2的32次方

`x >>> 0`本质上就是保证x有意义（为数字类型），且为正整数，在有效的数组范围内（0 ～ 0xFFFFFFFF），且在无意义的情况下缺省值为0。

## pop

下面给出官方的解释：

When the pop method is called, the following steps are taken:
1. Let O be ? ToObject(this value).
2. Let len be ? LengthOfArrayLike(O).
3. If len = 0, then
    Perform ? Set(O, "length", +0F, true).
    Return undefined.
4. Else,
    Assert: len > 0.
    Let newLen be F(len - 1).
    Let index be ! ToString(newLen).
    Let element be ? Get(O, index).
    Perform ? DeletePropertyOrThrow(O, index).
    Perform ? Set(O, "length", newLen, true).
    Return element.

```js
Array.prototype.pop = function() {
  let O = Object(this)
  let len = this.length >>> 0
  if(len == 0) {
    O.length = 0
    return undefined
  }
  len--
  let value = O[len]
  delete O[len]
  O.length = len
  return value
}
```

## map

When the map method is called with one or two arguments, the following steps are taken:
1. Let O be ? ToObject(this value).
2. Let len be ? LengthOfArrayLike(O).
3. If IsCallable(callbackfn) is false, throw a TypeError exception.
4. Let A be ? ArraySpeciesCreate(O, len).
5. Let k be 0.
6. Repeat, while k < len,
    a. Let Pk be ! ToString(F(k)).
    b. Let kPresent be ? HasProperty(O, Pk).
    c. If kPresent is true, then
        Let kValue be ? Get(O, Pk).
        Let mappedValue be ? Call(callbackfn, thisArg, « kValue, F(k), O »).
        Perform ? CreateDataPropertyOrThrow(A, Pk, mappedValue).
    d. Set k to k + 1.
7. Return A.

```js
// thisArg 传递给函数，用作 "this" 的值。
Array.prototype.map = function(callbackfn, thisArg) {
  if(this === null || this === undefined) {
    throw new TypeError("Cannot read property 'map' of null");
  }
  if(Object.prototype.toString.call(callbackfn) != "[object Function]") {
    throw new TypeError(callbackfn + ' is not a function')
  }
  let O = Object(this)
  let T = thisArg
  let len = O.length >>> 0
  let A = new Array(len)
  for(let k = 0 ; k < len ; k++) {
    if(k in O) {
      let kValue = O[k]
      // 依次传入this, 当前项，当前索引，整个数组
      let mappedValue = callbackfn.call(T, kValue, k, O)
      A[k] = mappedValue
    }
  }
  return A
}
```

## reduce

When the reduce method is called with one or two arguments, the following steps are taken:
1. Let O be ? ToObject(this value).
2. Let len be ? LengthOfArrayLike(O).
3. If IsCallable(callbackfn) is false, throw a TypeError exception.
4. If len = 0 and initialValue is not present, throw a TypeError exception.
5. Let k be 0.
6. Let accumulator be undefined.
7. If initialValue is present, then
    Set accumulator to initialValue.
8. Else,
    Let kPresent be false.
    Repeat, while kPresent is false and k < len,
        Let Pk be ! ToString(F(k)).
        Set kPresent to ? HasProperty(O, Pk).
        If kPresent is true, then
        Set accumulator to ? Get(O, Pk).
        Set k to k + 1.
    If kPresent is false, throw a TypeError exception.
9. Repeat, while k < len,
    Let Pk be ! ToString(F(k)).
    Let kPresent be ? HasProperty(O, Pk).
    If kPresent is true, then
        Let kValue be ? Get(O, Pk).
        Set accumulator to ? Call(callbackfn, undefined, « accumulator, kValue, F(k), O »).
    Set k to k + 1.
10. Return accumulator.

```js
Array.prototype.reduce = function (callbackfn, initialValue) {
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'reduce' of null")
  }
  if (Object.prototype.toString.call(callbackfn) != '[object Function]') {
    throw new TypeError(callbackfn + ' is not a function')
  }
  let O = Object(this)
  let len = O.length >>> 0
  let k = 0
  let accumulator = initialValue
  if (accumulator === undefined) { // 初始值不传的处理(取数组第一个元素)
    for (; k < len; k++) {
      if (k in O) {
        accumulator = O[k]
        k++
        break
      }
    }
    if (accumulator === undefined) 
      throw new Error('Each element of the array is empty')
  }
  for(; k < len ; k++) {
    if(k in O) {
      accumulator = callbackfn.call(undefined, accumulator, O[k], O)
    }
  }
  return accumulator
}

```

## filter

1. Let O be ? ToObject(this value).

2. Let len be ? LengthOfArrayLike(O).

3. If IsCallable(callbackfn) is false, throw a TypeError exception.

4. Let A be ? ArraySpeciesCreate(O, 0).

5. Let k be 0.

6. Let to be 0.

7. Repeat, while k < len,
  a. Let Pk be ! ToString(𝔽(k)).
  b. Let kPresent be ? HasProperty(O, Pk).
  c. If kPresent is true, then
    i. Let kValue be ? Get(O, Pk).
    ii. Let selected be ! ToBoolean(? Call(callbackfn, thisArg, « kValue, 𝔽(k), O »)).
    iii. If selected is true, then

      1. Perform ? CreateDataPropertyOrThrow(A, ! ToString(𝔽(to)), kValue).
         2. Set to to to + 1.


  d. Set k to k + 1.

8. Return A.

```js
Array.prototype.filter = function(callbackfn, thisArg) {
  // 处理数组类型异常
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'filter' of null or undefined");
  }
  // 处理回调类型异常
  if (Object.prototype.toString.call(callbackfn) != "[object Function]") {
    throw new TypeError(callbackfn + ' is not a function')
  }
  let O = Object(this);
  let len = O.length >>> 0;
  let resLen = 0;
  let res = [];
  for(let i = 0; i < len; i++) {
    if (i in O) {
      let element = O[i];
      if (callbackfn.call(thisArg, O[i], i, O)) {
        res[resLen++] = element;
      }
    }
  }
  return res;
}
```

## splice

splice 可以说是最受欢迎的数组方法之一，api 灵活，使用方便。现在来梳理一下用法:

- 1. splice(position, count) 表示从 position 索引的位置开始，删除count个元素
- 1. splice(position, 0, ele1, ele2, ...) 表示从 position 索引的元素后面插入一系列的元素
- 1. splice(postion, count, ele1, ele2, ...) 表示从 position 索引的位置开始，删除 count 个元素，然后再插入一系列的元素
- 1. 返回值为`被删除元素`组成的`数组`。

```js
Array.prototype.splice = function(startIndex, deleteCount, ...addElements)  {
  let argumentsLen = arguments.length;
  let array = Object(this);
  let len = array.length;
  let deleteArr = new Array(deleteCount);
   
  // 拷贝删除的元素
  sliceDeleteElements(array, startIndex, deleteCount, deleteArr);
  // 移动删除元素后面的元素
  movePostElements(array, startIndex, len, deleteCount, addElements);
  // 插入新元素
  for (let i = 0; i < addElements.length; i++) {
    array[startIndex + i] = addElements[i];
  }
  array.length = len - deleteCount + addElements.length;
  return deleteArr;
}
```

先拷贝删除的元素

```js
const sliceDeleteElements = (array, startIndex, deleteCount, deleteArr) => {
  for (let i = 0; i < deleteCount; i++) {
    let index = startIndex + i;
    if (index in array) {
      let current = array[index];
      deleteArr[i] = current;
    }
  }
};
```

然后对删除元素后面的元素进行挪动, 挪动分为三种情况:

1. 添加的元素和删除的元素个数相等
2. 添加的元素个数小于删除的元素
3. 添加的元素个数大于删除的元素

当两者相等时:

```js
const movePostElements = (array, startIndex, len, deleteCount, addElements) => {
  if (deleteCount === addElements.length) return;
}
```

当添加的元素个数小于删除的元素时:

```js
const movePostElements = (array, startIndex, len, deleteCount, addElements) => {
  //...
  // 如果添加的元素和删除的元素个数不相等，则移动后面的元素
  if(deleteCount > addElements.length) {
    // 删除的元素比新增的元素多，那么后面的元素整体向前挪动
    // 一共需要挪动 len - startIndex - deleteCount 个元素
    for (let i = startIndex + deleteCount; i < len; i++) {
      let fromIndex = i;
      // 将要挪动到的目标位置
      let toIndex = i - (deleteCount - addElements.length);
      if (fromIndex in array) {
        array[toIndex] = array[fromIndex];
      } else {
        delete array[toIndex];
      }
    }
    // 注意注意！这里我们把后面的元素向前挪，相当于数组长度减小了，需要删除冗余元素
    // 目前长度为 len + addElements - deleteCount
    for (let i = len - 1; i >= len + addElements.length - deleteCount; i --) {
      delete array[i];
    }
  } 
};
```

当添加的元素个数大于删除的元素时：

```js
const movePostElements = (array, startIndex, len, deleteCount, addElements) => {
  //...
  if(deleteCount < addElements.length) {
    // 删除的元素比新增的元素少，那么后面的元素整体向后挪动
    // 思考一下: 这里为什么要从后往前遍历？从前往后会产生什么问题？
    for (let i = len - 1; i >= startIndex + deleteCount; i--) {
      let fromIndex = i;
      // 将要挪动到的目标位置
      let toIndex = i + (addElements.length - deleteCount);
      if (fromIndex in array) {
        array[toIndex] = array[fromIndex];
      } else {
        delete array[toIndex];
      }
    }
  }
};
```

### 优化一: 参数的边界情况

当用户传来非法的 startIndex 和 deleteCount 或者负索引的时候，需要我们做出特殊的处理。

```js
const computeStartIndex = (startIndex, len) => {
  // 处理索引负数的情况
  if (startIndex < 0) {
    return startIndex + len > 0 ? startIndex + len: 0;
  } 
  return startIndex >= len ? len: startIndex;
}

const computeDeleteCount = (startIndex, len, deleteCount, argumentsLen) => {
  // 删除数目没有传，默认删除startIndex及后面所有的
  if (argumentsLen === 1) 
    return len - startIndex;
  // 删除数目过小
  if (deleteCount < 0) 
    return 0;
  // 删除数目过大
  if (deleteCount > len - startIndex) 
    return len - startIndex;
  return deleteCount;
}

Array.prototype.splice = function (startIndex, deleteCount, ...addElements) {
  //,...
  let deleteArr = new Array(deleteCount);
  
  // 下面参数的清洗工作
  startIndex = computeStartIndex(startIndex, len);
  deleteCount = computeDeleteCount(startIndex, len, deleteCount, argumentsLen);
   
  // 拷贝删除的元素
  sliceDeleteElements(array, startIndex, deleteCount, deleteArr);
  //...
}
```

### 优化二: 数组为密封对象或冻结对象

什么是密封对象?

> 密封对象是不可扩展的对象，而且已有成员的[[Configurable]]属性被设置为false，这意味着不能添加、删除方法和属性。但是属性值是可以修改的。

什么是冻结对象？

> 冻结对象是最严格的防篡改级别，除了包含密封对象的限制外，还不能修改属性值。

接下来，我们来把这两种情况一一排除。

```js
// 判断 sealed 对象和 frozen 对象, 即 密封对象 和 冻结对象
if (Object.isSealed(array) && deleteCount !== addElements.length) {
  throw new TypeError('the object is a sealed object!')
} else if(Object.isFrozen(array) && (deleteCount > 0 || addElements.length > 0)) {
  throw new TypeError('the object is a frozen object!')
}
```

下面就是一个比较完整的的 splice：

```js
const sliceDeleteElements = (array, startIndex, deleteCount, deleteArr) => {
  for (let i = 0; i < deleteCount; i++) {
    let index = startIndex + i;
    if (index in array) {
      let current = array[index];
      deleteArr[i] = current;
    }
  }
};

const movePostElements = (array, startIndex, len, deleteCount, addElements) => {
  // 如果添加的元素和删除的元素个数相等，相当于元素的替换，数组长度不变，被删除元素后面的元素不需要挪动
  if (deleteCount === addElements.length) return;
  // 如果添加的元素和删除的元素个数不相等，则移动后面的元素
  else if(deleteCount > addElements.length) {
    // 删除的元素比新增的元素多，那么后面的元素整体向前挪动
    // 一共需要挪动 len - startIndex - deleteCount 个元素
    for (let i = startIndex + deleteCount; i < len; i++) {
      let fromIndex = i;
      // 将要挪动到的目标位置
      let toIndex = i - (deleteCount - addElements.length);
      if (fromIndex in array) {
        array[toIndex] = array[fromIndex];
      } else {
        delete array[toIndex];
      }
    }
    // 注意注意！这里我们把后面的元素向前挪，相当于数组长度减小了，需要删除冗余元素
    // 目前长度为 len + addElements - deleteCount
    for (let i = len - 1; i >= len + addElements.length - deleteCount; i --) {
      delete array[i];
    }
  } else if(deleteCount < addElements.length) {
    // 删除的元素比新增的元素少，那么后面的元素整体向后挪动
    // 思考一下: 这里为什么要从后往前遍历？从前往后会产生什么问题？
    for (let i = len - 1; i >= startIndex + deleteCount; i--) {
      let fromIndex = i;
      // 将要挪动到的目标位置
      let toIndex = i + (addElements.length - deleteCount);
      if (fromIndex in array) {
        array[toIndex] = array[fromIndex];
      } else {
        delete array[toIndex];
      }
    }
  }
};

const computeStartIndex = (startIndex, len) => {
  // 处理索引负数的情况
  if (startIndex < 0) {
    return startIndex + len > 0 ? startIndex + len: 0;
  } 
  return startIndex >= len ? len: startIndex;
}

const computeDeleteCount = (startIndex, len, deleteCount, argumentsLen) => {
  // 删除数目没有传，默认删除startIndex及后面所有的
  if (argumentsLen === 1) 
    return len - startIndex;
  // 删除数目过小
  if (deleteCount < 0) 
    return 0;
  // 删除数目过大
  if (deleteCount > len - startIndex) 
    return len - startIndex;
  return deleteCount;
}

Array.prototype.splice = function(startIndex, deleteCount, ...addElements)  {
  let argumentsLen = arguments.length;
  let array = Object(this);
  let len = array.length >>> 0;
  let deleteArr = new Array(deleteCount);

  startIndex = computeStartIndex(startIndex, len);
  deleteCount = computeDeleteCount(startIndex, len, deleteCount, argumentsLen);

  // 判断 sealed 对象和 frozen 对象, 即 密封对象 和 冻结对象
  if (Object.isSealed(array) && deleteCount !== addElements.length) {
    throw new TypeError('the object is a sealed object!')
  } else if(Object.isFrozen(array) && (deleteCount > 0 || addElements.length > 0)) {
    throw new TypeError('the object is a frozen object!')
  }
   
  // 拷贝删除的元素
  sliceDeleteElements(array, startIndex, deleteCount, deleteArr);
  // 移动删除元素后面的元素
  movePostElements(array, startIndex, len, deleteCount, addElements);

  // 插入新元素
  for (let i = 0; i < addElements.length; i++) {
    array[startIndex + i] = addElements[i];
  }

  array.length = len - deleteCount + addElements.length;

  return deleteArr;
}
```

## sort

这里我们采用 V8 引擎的算法：

设要排序的元素个数是n：

- 当 n <= 10 时，采用`插入排序`
- 当 n > 10 时，采用`三路快速排序`
  - 10 < n <= 1000, 采用中位数作为哨兵元素
  - n > 1000, 每隔 200~215 个元素挑出一个元素，放到一个新数组，然后对它排序，找到中间位置的数，以此作为中位数。

虽然`插入排序`理论上说是O(n^2)的算法，`快速排序`是一个O(nlogn)级别的算法。但是别忘了，这只是理论上的估算，在实际情况中两者的算法复杂度前面都会有一个系数的， 当 n 足够小的时候，快速排序`nlogn`的优势会越来越小，倘若插入排序O(n^2)前面的系数足够小，那么就会超过快排。而事实上正是如此，`插入排序`经过优化以后对于小数据集的排序会有非常优越的性能，很多时候甚至会超过快排。

因此，对于很小的数据量，应用`插入排序`是一个非常不错的选择。

下面先实现简单的插入排序：

```js
const insertSort = (arr, start = 0, end) => {
  end = end || arr.length;
  for(let i = start; i < end; i++) {
    let e = arr[i];
    let j;
    for(j = i; j > start && arr[j - 1] > e; j --)
      arr[j] = arr[j-1];
    arr[j] = e;
  }
  return;
}
```

sort 大致结构如下所示：

```js
Array.prototype.sort = (comparefn) => {
  let array = Object(this);
  let length = array.length >>> 0;
  return InnerArraySort(array, length, comparefn);
}

const InnerArraySort = (array, length, comparefn) => {
  // 比较函数未传入
  if (Object.prototype.toString.call(callbackfn) !== "[object Function]") {
    comparefn = function (x, y) {
      if (x === y) return 0;
      x = x.toString();
      y = y.toString();
      if (x == y) return 0;
      else return x < y ? -1 : 1;
    };
  }
  const insertSort = () => {
    //...
  }
  const getThirdIndex = (a, from, to) => {
    // 元素个数大于1000时寻找哨兵元素
  }
  const quickSort = (a, from, to) => {
    //哨兵位置
    let thirdIndex = 0;
    while(true) {
      if(to - from <= 10) {
        insertSort(a, from, to);
        return;
      }
      if(to - from > 1000) {
        thirdIndex = getThirdIndex(a, from , to);
      }else {
        // 小于1000 直接取中点
        thirdIndex = from + ((to - from) >> 2);
      }
    }
    //下面开始快排
  }
}
```

下面要开始寻找哨兵元素：

```js
const getThirdIndex = (a, from, to) => {
  let tmpArr = [];
  // 递增量，200~215 之间，因为任何正数和15做与操作，不会超过15，当然是大于0的
  let increment = 200 + ((to - from) & 15);
  let j = 0;
  from += 1;
  to -= 1;
  for (let i = from; i < to; i += increment) {
    tmpArr[j] = [i, a[i]];
    j++;
  }
  // 把临时数组排序，取中间的值，确保哨兵的值接近平均位置
  tmpArr.sort(function(a, b) {
    return comparefn(a[1], b[1]);
  });
  let thirdIndex = tmpArr[tmpArr.length >> 1][0];
  return thirdIndex;
}
```

下面给出快排代码：

```js
const _sort = (a, b, c) => {
  let arr = [a, b, c];
  insertSort(arr, 0, 3);
  return arr;
}

const quickSort = (a, from, to) => {
  //...
  // 上面我们拿到了thirdIndex
  // 现在我们拥有三个元素，from, thirdIndex, to
  // 为了再次确保 thirdIndex 不是最值，把这三个值排序
  [a[from], a[thirdIndex], a[to - 1]] = _sort(a[from], a[thirdIndex], a[to - 1]);
  // 现在正式把 thirdIndex 作为哨兵
  let pivot = a[thirdIndex];
  // 正式进入快排
  let lowEnd = from + 1;
  let highStart = to - 1;
  // 现在正式把 thirdIndex 作为哨兵, 并且lowEnd和thirdIndex交换
  let pivot = a[thirdIndex];
  a[thirdIndex] = a[lowEnd];
  a[lowEnd] = pivot;
  
  // [lowEnd, i)的元素是和pivot相等的
  // [i, highStart) 的元素是需要处理的
  for(let i = lowEnd + 1; i < highStart; i++) {
    let element = a[i];
    let order = comparefn(element, pivot);
    if (order < 0) {
      a[i] = a[lowEnd];
      a[lowEnd] = element;
      lowEnd++;
    } else if(order > 0) {
      do{
        highStart--;
        if(highStart === i) break;
        order = comparefn(a[highStart], pivot);
      }while(order > 0)
      // 现在 a[highStart] <= pivot
      // a[i] > pivot
      // 两者交换
      a[i] = a[highStart];
      a[highStart] = element;
      if(order < 0) {
        // a[i] 和 a[lowEnd] 交换
        element = a[i];
        a[i] = a[lowEnd];
        a[lowEnd] = element;
        lowEnd++;
      }
    }
  }
  // 永远切分大区间
  if (lowEnd - from > to - highStart) {
    // 继续切分lowEnd ~ from 这个区间
    to = lowEnd;
    // 单独处理小区间
    quickSort(a, highStart, to);
  } else if(lowEnd - from <= to - highStart) {
    from = highStart;
    quickSort(a, from, lowEnd);
  }
}
```

下面就是比较完整的代码:

```js
const sort = (arr, comparefn) => {
  let array = Object(arr);
  let length = array.length >>> 0;
  return InnerArraySort(array, length, comparefn);
}

const InnerArraySort = (array, length, comparefn) => {
  // 比较函数未传入
  if (Object.prototype.toString.call(comparefn) !== "[object Function]") {
    comparefn = function (x, y) {
      if (x === y) return 0;
      x = x.toString();
      y = y.toString();
      if (x == y) return 0;
      else return x < y ? -1 : 1;
    };
  }
  const insertSort = (arr, start = 0, end) => {
    end = end || arr.length;
    for (let i = start; i < end; i++) {
      let e = arr[i];
      let j;
      for (j = i; j > start && comparefn(arr[j - 1], e) > 0; j--)
        arr[j] = arr[j - 1];
      arr[j] = e;
    }
    return;
  }
  const getThirdIndex = (a, from, to) => {
    let tmpArr = [];
    // 递增量，200~215 之间，因为任何正数和15做与操作，不会超过15，当然是大于0的
    let increment = 200 + ((to - from) & 15);
    let j = 0;
    from += 1;
    to -= 1;
    for (let i = from; i < to; i += increment) {
      tmpArr[j] = [i, a[i]];
      j++;
    }
    // 把临时数组排序，取中间的值，确保哨兵的值接近平均位置
    tmpArr.sort(function (a, b) {
      return comparefn(a[1], b[1]);
    });
    let thirdIndex = tmpArr[tmpArr.length >> 1][0];
    return thirdIndex;
  };

  const _sort = (a, b, c) => {
    let arr = [];
    arr.push(a, b, c);
    insertSort(arr, 0, 3);
    return arr;
  }

  const quickSort = (a, from, to) => {
    //哨兵位置
    let thirdIndex = 0;
    while (true) {
      if (to - from <= 10) {
        insertSort(a, from, to);
        return;
      }
      if (to - from > 1000) {
        thirdIndex = getThirdIndex(a, from, to);
      } else {
        // 小于1000 直接取中点
        thirdIndex = from + ((to - from) >> 2);
      }
      let tmpArr = _sort(a[from], a[thirdIndex], a[to - 1]);
      a[from] = tmpArr[0]; a[thirdIndex] = tmpArr[1]; a[to - 1] = tmpArr[2];
      // 现在正式把 thirdIndex 作为哨兵
      let pivot = a[thirdIndex];
      [a[from], a[thirdIndex]] = [a[thirdIndex], a[from]];
      // 正式进入快排
      let lowEnd = from + 1;
      let highStart = to - 1;
      a[thirdIndex] = a[lowEnd];
      a[lowEnd] = pivot;
      // [lowEnd, i)的元素是和pivot相等的
      // [i, highStart) 的元素是需要处理的
      for (let i = lowEnd + 1; i < highStart; i++) {
        let element = a[i];
        let order = comparefn(element, pivot);
        if (order < 0) {
          a[i] = a[lowEnd];
          a[lowEnd] = element;
          lowEnd++;
        } else if (order > 0) {
          do{
            highStart--;
            if (highStart === i) break;
            order = comparefn(a[highStart], pivot);
          }while (order > 0) ;
          // 现在 a[highStart] <= pivot
          // a[i] > pivot
          // 两者交换
          a[i] = a[highStart];
          a[highStart] = element;
          if (order < 0) {
            // a[i] 和 a[lowEnd] 交换
            element = a[i];
            a[i] = a[lowEnd];
            a[lowEnd] = element;
            lowEnd++;
          }
        }
      }
      // 永远切分大区间
      if (lowEnd - from > to - highStart) {
        // 单独处理小区间
        quickSort(a, highStart, to);
        // 继续切分lowEnd ~ from 这个区间
        to = lowEnd;
      } else if (lowEnd - from <= to - highStart) {
        quickSort(a, from, lowEnd);
        from = highStart;
      }
    }
  }
  quickSort(array, 0, length);
}
```

