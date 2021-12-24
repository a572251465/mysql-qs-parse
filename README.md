![个人logo](http://lihh-core.top/images/mysql-qs-parse.png)
> 一款能够自由操作mysql语句的插件，简直是增删改查无所不能（A plug-in that can freely operate MySQL is omnipotent）

### 为什么使用（Why）
* Mysql-Qs-Parse 基于发布订阅来实现，所有的响应都可以通过订阅来做
* Mysql-Qs-Parse 所有的查询都支持Promise
* Mysql-Qs-Parse 为了方便各种业务查询，增加了很多方法find, findOne等
* Mysql-Qs-Parse 每次sql操作都会有对应的log打印
* Mysql-Qs-Parse 它是安全的，每次查询都会经过非法字符的过滤，保证安全性

> mysql数据库每次进行操作之前进行数据连接，操作结束后会自己释放连接池，使用的时候格外注意!!!

### install
```
$ npm install mysql-qs-parse
$ $yarn add mysql-qs-parse
```
### example
#### 实例1
```js
const MysqlParse = require('mysql-qs-parse')
const db = new MysqlParse('localhost', 'user', 'password', 'bookSystem')
db.on('open', () => {
  // 打开成功的订阅
})

db.on('error', (log) => {
  console.log(log) // 所有的错误都可以通过订阅来获取
})

db.on('mysql-log', (sql) => {
  console.log(sql) // 执行sql文 会从这里打印
})
// ... 还可以订阅close函数

// 查询 User表的name，id字段 条件是age = 20
const res = await db.find(['name', 'id'], 'User', {age: 20})
```
#### 实例2
```js
const MysqlParse = require('mysql-qs-parse')
const db = new MysqlParse({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'test'
})
db.on('open', () => {
  // 打开成功的订阅
})

db.on('error', (log) => {
  console.log(log) // 所有的错误都可以通过订阅来获取
})

db.on('mysql-log', (sql) => {
  console.log(sql) // 执行sql文 会从这里打印
})
// ... 还可以订阅close函数

// 查询 User表的name，id字段 条件是age = 20
const res = await db.find(['name', 'id'], 'User', {age: 20})
```
### options
#### 基于发布订阅的方法
* `db.on('open', fn)`：当数据库连接成功的时候，进行订阅方法的回调，将会调用这个订阅函数
* `db.on('close', fn)`：同理，这个是连接关闭的订阅函数
* `db.on('error', fn)`：同理，所有的错误都是通过订阅error的函数来实现
* `db.on('mysql-log', fn)`：如果您的业务场景下需要每次执行都要看到sql执行，这里会打印出拼装的sql
#### 数据库相关的函数
* `db.open()`：进行数据库的连接，连接的回调可以在`db.on('open')`中来查询
* `db.close()`：进行数据库的连接关闭，关闭成功回调可以在`db.on('close')`中来查询
#### 执行sql的函数
* `findOne(fields, tableName, where)`
  * **`fields` 是一个数组，里面存放的每个字段，每个元素可以是字符串以及对象，如果是字符串表示数据库字段，如果是对象的话，表示别名，具体实例如下：**
  * **`findOne(['name', {age: 'age1'}], 'User')` => `select name, age as age1 from User`**
  * **`tableName`字段表示可以查询的表名**
  * **`where`字段表示条件，例如`{age: 20}` => `select XXX from where age = 20`**
  * **下面相同的字段同样的意思，这里不在过多的解释了**
  * **函数`findOne`只能查询单条数据，就算实际的数据库的返回结果是多条，但是函数只会返回一个条**
* `find(fields, tableName, where)`
  * _**具体的参数字段含义，可以参照`findOne`函数**_
  * 这个函数会返回多条数据，实际数据库中返回几条会依次都返回
* `insert(fields, tableName)`
  * 对表进行插入操作
  * **`fields`属性表示插入的对象，里面所有的元素都是对象，key表示插入的表属性，value表示插入的表值**
  * **`tableName`属性表示插入的表**
* `update(fields, tableName, where)`
  * 对表中的数据进行更新
  * **`fields`字段表示更新字段，key表示表属性，value表示更新后的表值**
  * **`tableName`字段表示更新的表名**
  * **`where`字段表示条件，跟函数`findOne`的含义一样**
* `delete(tableName, where, fields)`
  * 对表进行删除，这里分为逻辑删除以及物理删除，如果字段`fields`存在就表示逻辑删除，反之就是物理删除
  * **`tableName`属性表示更新的表**
  * **`where`属性表示操作的条件，跟函数`findOne`含义一致**
  * **`fields`属性表示逻辑删除时更新的字段，逻辑删除必须的**
* **<font color=red>后续还有很多功能推出(例如：排序，分页，多表查询，复杂查询等)...</font>**
## 联系我
![个人logo](http://lihh-core.top/images/personal-logo.jpeg)
 * [GitHub](https://github.com/a572251465)
 * [个人博客](http://lihh-core.top/share)
 * [个人作品展示集](http://lihh-core.top)