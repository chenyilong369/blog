# K 近邻算法

这个算法比较简单，它的思想是在特征空间中，如果一个样本附近的k个最近(即特征空间中最邻近)样本的大多数属于某一个类别，则该样本也属于这个类别。

假设 K=3。那么 KNN 算法就会找到与它距离最近的三个点（这里用圆圈把它圈起来了），看看哪种类别多一些。

在计算距离时我们采用欧拉距离。

首先我们先自己写一个符合 KNN 算法的程序

```python
import numpy as np
import matplotlib.pyplot as plt
from math import sqrt
from collections import Counter

X = np.random.random(20).reshape(10, -1) * 10
x = np.random.random(2).reshape(-1, 1) * 10
y = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]

X_train = np.array(X)
y_train = np.array(y)

# 绘制图片
plt.scatter(X_train[y_train == 0, 0], X_train[y_train == 0, 1], color='g')
plt.scatter(X_train[y_train == 1, 0], X_train[y_train == 1, 1], color='r')
plt.scatter(x[0], x[1], color='b')
plt.show()

distances = [sqrt(np.sum((x_train - x) ** 2)) for x_train in X_train]
nearest = np.argsort(distances)
k = 6
topK_y = [y_train[i] for i in nearest[:k]]

# 预测结果
votes = Counter(topK_y)
predict_y = votes.most_common(1)[0][0]
print(predict_y)
```

下面我们用 `sklearn` 包来实现一下 KNN 算法：

```python
from sklearn.neighbors import KNeighborsClassifier
import numpy as np

X = np.random.random(20).reshape(-1, 2) * 10
x = np.random.random(2).reshape(-1, 2) * 10
y = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]

X_train = np.array(X)
y_train = np.array(y)
x = np.array(x)

KNN_classifier = KNeighborsClassifier(n_neighbors=7) # 创建模型
KNN_classifier.fit(X_train, y_train) # 训练模型
print(KNN_classifier.predict(x)[0])
```

下面我们将 KNN 算法进行一次封装：

```python
import numpy as np


def accuracy_score(y_true, y_predict):
    return sum(y_true == y_predict) / len(y_true)
```

```python
import numpy as np
from math import sqrt
from collections import Counter
from .metrics import accuracy_score


class KNNClassifer:
    def __init__(self, k):
        """初始化"""
        self.k = k
        self._X_train = None
        self._y_train = None

    def fit(self, X_train, y_train):
        self._X_train = X_train
        self._y_train = y_train
        return self

    def predict(self, X_predict):
        y_predict = [self._predict(x) for x in X_predict]
        return np.array(y_predict)

    def _predict(self, x):
        distances = [sqrt(np.sum((x_train - x) ** 2)) for x_train in self._X_train]
        nearest = np.argsort(distances)
        topK_y = [self._y_train[i] for i in nearest[:self.k]]
        votes = Counter(topK_y)
        return votes.most_common(1)[0][0]

    def score(self, X_test, y_test):
        y_predict = self.predict(X_test)
        return accuracy_score(y_test, y_predict)

    def __repr__(self):
        return "KNN(k=%d)" % self.k

```

下面我们就用鸢尾花的实例来试试自己写的 KNN 算法。

```python
import numpy as np
from core.KNN import KNNClassifer
from sklearn import datasets
from core.model_selection import train_test_split

iris = datasets.load_iris()

X = iris.data
y = iris.target

X_train, X_test, y_train, y_test = train_test_split(X, y)
my_knn_clf = KNNClassifer(k = 3)
my_knn_clf.fit(X_train, y_train)
print(my_knn_clf.score(X_test, y_test)) # 1.0
```

其中关于 `train_test_split` 函数代码如下：

```python
def train_test_split(X, y, test_ratio = 0.2, seed=None):
    if seed:
        np.random.seed(seed)
    shuffled_indexes = np.random.permutation(len(X))
    test_size = int(len(X) * test_ratio)
    test_indexes = shuffled_indexes[:test_size]
    train_indexes = shuffled_indexes[test_size:]

    X_train = X[train_indexes]
    y_train = y[train_indexes]
    X_test = X[test_indexes]
    y_test = y[test_indexes]

    return X_train, X_test, y_train, y_test
```

## 超参数

这里我们先了解一下定义，以及它与模型参数的不同之处：

- 超参数：在算法运行前需要决定的参数
- 模型参数：算法过程中学习的参数

例如 KNN 中的 k 就是超参数。

## Sklearn KNN参数

```python
def KNeighborsClassifier(n_neighbors = 5,
                       weights='uniform',
                       algorithm = '',
                       leaf_size = '30',
                       p = 2,
                       metric = 'minkowski',
                       metric_params = None,
                       n_jobs = None
                       )
```

- n_neighbors：这个值就是指 KNN 中的 “K”了。前面说到过，通过调整 K 值，算法会有不同的效果。
- weights（权重）：最普遍的 KNN 算法无论距离如何，权重都一样，但有时候我们想搞点特殊化，比如距离更近的点让它更加重要。这时候就需要 weight 这个参数了，这个参数有三个可选参数的值，决定了如何分配权重。参数选项如下：
  - ‘uniform’：不管远近权重都一样，就是最普通的 KNN 算法的形式。
  - ‘distance’：权重和距离成反比，距离预测目标越近具有越高的权重。
  -  自定义函数：自定义一个函数，根据输入的坐标值返回对应的权重，达到自定义权重的目的。

- algorithm：在 Sklearn 中，要构建 KNN 模型有三种构建方式：

  - 暴力法，就是直接计算距离存储比较的那种方式。

  - 使用 Kd 树构建 KNN 模型。

  - 使用球树构建。

    其中暴力法适合数据较小的方式，否则效率会比较低。如果数据量比较大一般会选择用 Kd 树构建 KNN 模型，而当 Kd 树也比较慢的时候，则可以试试球树来构建 KNN。参数选项如下：

    - ‘brute’ ：蛮力实现；
    - ‘kd_tree’：KD 树实现 KNN；
    - ‘ball_tree’：球树实现 KNN ；
    - ‘auto’： 默认参数，自动选择合适的方法构建模型。

    不过当数据较小或比较稀疏时，无论选择哪个最后都会使用 ‘brute’。

- leaf_size：如果是选择蛮力实现，那么这个值是可以忽略的。当使用 Kd 树或球树，它就是停止建子树的叶子节点数量的阈值。默认30，但如果数据量增多这个参数需要增大，否则速度过慢不说，还容易过拟合。

- p：和 metric 结合使用，当 metric 参数是 “minkowski” 的时候，p=1 为曼哈顿距离， p=2 为欧式距离。默认为p=2。

- metric：指定距离度量方法，一般都是使用欧式距离。
  - ‘euclidean’ ：欧式距离；
  - ‘manhattan’：曼哈顿距离；
  - ‘chebyshev’：切比雪夫距离；
  - ‘minkowski’： 闵可夫斯基距离，默认参数。

- n_jobs：指定多少个CPU进行运算，默认是-1，也就是全部都算。

## 网格搜索(GridSearchCV)

GridSearchCV的名字其实可以拆分为两部分，GridSearch和CV，即网格搜索和交叉验证。这两个名字都非常好理解。网格搜索，搜索的是参数，即在指定的参数范围内，按步长依次调整参数，利用调整的参数训练学习器，从所有的参数中找到在验证集上精度最高的参数，这其实是一个训练和比较的过程。

它可以保证在指定的参数范围内找到精度最高的参数，但是这也是网格搜索的缺陷所在，他要求遍历所有可能参数的组合，在面对大数据集和多参数的情况下，非常耗时。

我们以 KNN 算法分类鸢尾花的例子来看看什么是网格搜索：

```python
import numpy as np
from core.KNN import KNNClassifer
from sklearn import datasets
from core.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import GridSearchCV

iris = datasets.load_iris()

param_grid = [
    {
        'weights': ['uniform'],
        'n_neighbors': [i for i in range(1, 11)]
    },
    {
        'weights': ['distance'],
        'n_neighbors': [i for i in range(1, 11)],
        'p': [i for i in range(1, 6)]
    }
]

X = iris.data
y = iris.target

X_train, X_test, y_train, y_test = train_test_split(X, y)
knn_clf = KNeighborsClassifier()
grid_search = GridSearchCV(knn_clf, param_grid, n_jobs=-1, verbose=2)
grid_search.fit(X_train, y_train)
print(grid_search.best_score_)
print(grid_search.best_params_)
knn_clf = grid_search.best_estimator_
print(knn_clf.score(X_test, y_test))
```

## 数据归一化

为了解决某些特征跨度大的问题，需要将所有数据映射到同一个尺度上。

- 最值归一化：将所有数据映射到 0-1 之间。适用于分布有明显边界的情况。

$$
x_{scale} = \frac{x-x_{min}}{x_{max}-x_{min}}
$$

- 均值方差归一化。它把所有的数据归一到均值为 0 方差为 1 的分布中。它比较适合用在数据分布没有明显的边界，以及可能存在极端数据值的数据集中。

$$
x_{scale} = \frac{x-x_{mean}}{s}
$$

由于在真实环境中基本上不可能传一个数据就去计算均值和方差，所以这些模型均值和方差大多都是来自训练数据的。

