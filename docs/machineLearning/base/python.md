# python 操作基础

## numpy

在日常开发机器学习过程中，我们要先导入 numpy

```python
import numpy as np

# 生成一个 array（类型必须一致）
nparr = np.array([i for i in range(5)]) # array([0, 1, 2, 3, 4])

# 查看数组类型
print(nparr.dtype) # dtype('int64')

# 创建一个 0 矩阵
np.zeros(5) # array([0., 0., 0., 0., 0.])
np.zeros(5).dtype # dtype('float64')
np.zeros(5, dtype=int) # array([0, 0, 0, 0, 0])
np.zeros((2, 2)) # array([[0., 0.], [0., 0.]])
np.zeros(shape=(2, 2), dtype=int) # array([[0, 0], [0, 0]])

# 创建全 1 矩阵
np.ones(5) # array([1., 1., 1., 1., 1.])

# 创建全部都是指定值的矩阵
np.full(shape=(2, 2), fill_value=555) # array([555, 555, 555, 555, 555])

# 取值范围（步长可以为 float）
np.arange(0, 10, 2) # array([0, 2, 4, 6, 8])
np.arange(0, 1, 0.2) # array([0., 0.2, 0.4, 0.6, 0.8])

# 给定范围取多少个距离相等的点
np.linspace(0, 8, 5) # array([0. 2. 4. 6. 8.])

# 随机整数
np.random.randint(0, 10) # 4
np.random.randint(0, 10, size=10) # array([8, 0, 8, 5, 4, 9, 2, 5, 3, 1])
np.random.randint(0, 10, size=(2, 2)) # array([[0, 8], [6, 5]])

# 随机数种子
np.random.seed(666)
np.random.randint(0, 10, size=(2, 2))
np.random.seed(666)
np.random.randint(0, 10, size=(2, 2)) # 和上面输出一样

# 随机浮点数
np.random.random()
np.random.random(size=10)
np.random.random(size=(2, 2))

# 符合正态分布的浮点数，均值为0，方差为1的浮点数
np.random.normal() # -0.7125408012062433
np.random.normal(loc=0, scale=1, size=(3, 5))

x = np.arange(10)
X = np.arange(15).reshape(3, 5)
# 数组维度
x.ndim # 1
X.ndim # 2
# 数组维度的具体指
x.shape # (10,)
X.shape # (3, 5)
# 元素个数
x.size # 10
X.size # 15
# 更改维度（不会改变原来的矩阵或向量）
x.reshape(2, 5)
x.reshape(2, -1) # 智能判断

x = np.array([1, 2, 3])
y = np.array([3, 2, 1])
A = np.array([[1, 2, 3], [3, 2, 1]])
# 拼接数组
np.concatenate([x, y])
np.concatenate([A, A], axis=1) # 沿着第二个维度进行拼接
np.vstack([A, y]) # 垂直拼接
np.hstack([A, y]) # 水平拼接

x = np.arange(10)
A = np.arange(16).reshape(4, 4)
# 分割数组
x1, x2, x3 = np.split(x, [3, 7])
A1, A2 = np.split(A, [2], axis=1)
A1, A2 = np.vsplit(A, [2]) # 垂直分割
A1, A2 = np.hsplit(A, [2]) # 水平分割
```

