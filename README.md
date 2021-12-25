![个人logo](http://lihh-core.top/images/mysql-qs-parse.png)
> 一款能够自由操作mysql语句的插件，简直是增删改查无所不能（A plug-in that can freely operate MySQL is omnipotent）

### 为什么使用（Why）
* Mysql-Qs-Parse 基于发布订阅来实现，所有的响应都可以通过订阅来做
* Mysql-Qs-Parse 所有的查询都支持Promise
* Mysql-Qs-Parse 为了方便各种业务查询，增加了很多方法find, findOne等
* Mysql-Qs-Parse 每次sql操作都会有对应的log打印
* Mysql-Qs-Parse 它是安全的，每次查询都会经过非法字符的过滤，保证安全性

> mysql数据库每次进行操作之前进行数据连接，为了能让每次请求后释放连接，提供了release方法，请注意!!!!

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
db.once('open', () => {
  // 打开成功的订阅
})

db.on('error', (log) => {
  console.log(log) // 所有的错误都可以通过订阅来获取
})

db.on('mysql-log', (sql) => {
  console.log(sql) // 执行sql文 会从这里打印
})
// ... 还可以订阅close函数

// 进行数据库连接
await db.open()

// 查询 User表的name，id字段 条件是age = 20
const res = await db.find(['name', 'id'], 'User', {age: 20})

// 查询结束后 释放连接
db.release()
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
db.once('open', () => {
  // 打开成功的订阅
})

db.on('error', (log) => {
  console.log(log) // 所有的错误都可以通过订阅来获取
})

db.on('mysql-log', (sql) => {
  console.log(sql) // 执行sql文 会从这里打印
})
// ... 还可以订阅close函数

// 进行数据库连接
await db.open()

// 查询 User表的name，id字段 条件是age = 20
const res = await db.find(['name', 'id'], 'User', {age: 20})
// 查询结束后 释放连接
db.release()
```
### options
#### 基于发布订阅的方法
* `db.once('open', fn)`：当数据库连接成功的时候，进行订阅方法的回调，将会调用这个订阅函数, 下次重新连接，重新订阅
* `db.on('close', fn)`：同理，这个是连接关闭的订阅函数
* `db.on('error', fn)`：同理，所有的错误都是通过订阅error的函数来实现
* `db.on('mysql-log', fn)`：如果您的业务场景下需要每次执行都要看到sql执行，这里会打印出拼装的sql
#### 数据库相关的函数
* `db.open()`：进行数据库的连接，连接的回调可以在`db.on('open')`/ `或是await db.open()`(建议使用后者)中来查询
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
  * 如果插入后的返回值是`1`，表示`插入成功`反之失败(0)
* `update(fields, tableName, where)`
  * 对表中的数据进行更新
  * **`fields`字段表示更新字段，key表示表属性，value表示更新后的表值**
  * **`tableName`字段表示更新的表名**
  * **`where`字段表示条件，跟函数`findOne`的含义一样**
  * 如果更新后的返回值是`1`，表示`更新成功`反之失败(0)
* `delete(tableName, where, fields)`
  * 对表进行删除，这里分为逻辑删除以及物理删除，如果字段`fields`存在就表示逻辑删除，反之就是物理删除
  * **`tableName`属性表示更新的表**
  * **`where`属性表示操作的条件，跟函数`findOne`含义一致**
  * **`fields`属性表示逻辑删除时更新的字段，逻辑删除必须的**
  * 如果删除后的返回值是`1`，表示`删除成功`反之失败(0)
* `release`
  * 每次执行mysql操作的时候，都会创建连接，每次执行结束后释放连接，但是考虑到用户可能一个连接执行多次sql，所以释放连接的功能暴露出去
  * 每次执行结束后执行`release`函数，记得下次请求前一定要重新执行`open`函数
* **<font color=red>后续还有很多功能推出(例如：排序，分页，多表查询，复杂查询等)...</font>**
## QA
* 使用插件后，在查询的时候出现错误（mysql PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR）
  * answer: [参照mysql issues](https://github.com/mysqljs/mysql/issues/1166)
* 为什么会多测触发订阅的open方法呢？？？
  * answer: 回调时基于发布订阅的，不能连续订阅多次，如果想订阅也可以用once 来替代on
* 还是不太明白该怎么用？？？ 怎么能高效使用插件
  * answer: 下面来给大家讲解一个我自己用的mysql-connect中间件
    ```js
    // 初始化mysql配置
    const connect = new MysqlParse({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'super-admin-system'
    })

    function mysqlConnect() {
      return async (ctx, next) => {
        // 订阅错误信息 一次订阅执行结束后销毁 如果不是关联ctx 可以单独独立出去
        connect.once('error', (log) => {
          logInfo.fail(log)
          ctx.body = resultInfo.result('', CONNECT_FAIL.code, CONNECT_FAIL.msg)
        })

        // open 也是promise 支持同步写法（也可以使用connect.on('open', fn) 来实现，不过还是建议这种）
        await connect.open()
        ctx.db = connect
        logInfo.info('数据库连接成功')
        await next()
      }
    }
    ```

## 联系我
![个人logo](http://lihh-core.top/images/personal-logo.jpeg)
 * [GitHub](https://github.com/a572251465)
 * [个人博客](http://lihh-core.top/share)
 * [个人作品展示集](http://lihh-core.top)