[标准化CRUD作用域变量规范](https://github.com/alibaba/formily/discussions/3207)
> 首先，变量名标准化
  ```sh
  $record 代表任何列表记录对象
  $lookup 代表父级记录对象(与$record.$lookup的区别是如果$record为非对象数据，则需要通过$lookup获取)
  $index 代表任何列表记录当前索引值
  $records 代表任何列表数据
  $record.$lookup 代表父级记录对象，可以层层往上找
  $record.$index 代表当前记录对象的索引，同样可以层层往上找，比如$record.$lookup.$index or $record.$lookup.$lookup.$index
  ```
