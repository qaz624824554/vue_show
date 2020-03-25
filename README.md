# czl的电商后台管理系统

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### 功能介绍

#### 1.登录页面

1. 后台登录功能，需要输入用户名和密码进行校验，用户名是admin，密码是123456，校验通过后想后台发送ajax请求验证，后台返回token，将token存储到sessionstorage

2. 登录成功后，通过路由守卫判断是否有登录，没有登录则没有权限去到首页

   ![](/Users/mac/Desktop/前端项目/vue_show/readmeImages/image-20200325203648066.png)

#### 1.1首页

![image-20200325203720882](/Users/mac/Library/Application Support/typora-user-images/image-20200325203720882.png)

#### 1.2用户列表

![image-20200325203754920](/Users/mac/Library/Application Support/typora-user-images/image-20200325203754920.png)

##### 1.2.1添加用户对话框

![image-20200325203833081](/Users/mac/Library/Application Support/typora-user-images/image-20200325203833081.png)

##### 1.2.2编辑用户对话框

![image-20200325203939371](/Users/mac/Library/Application Support/typora-user-images/image-20200325203939371.png)

##### 1.2.3删除用户

![image-20200325204008160](/Users/mac/Library/Application Support/typora-user-images/image-20200325204008160.png)

##### 1.2.3分配角色

![image-20200325204030051](/Users/mac/Library/Application Support/typora-user-images/image-20200325204030051.png)

#### 1.3角色列表

![image-20200325204104170](/Users/mac/Library/Application Support/typora-user-images/image-20200325204104170.png)

##### 1.3.1编辑角色

![image-20200325204127527](/Users/mac/Library/Application Support/typora-user-images/image-20200325204127527.png)

##### 1.3.2角色分配权限

![image-20200325204202119](/Users/mac/Library/Application Support/typora-user-images/image-20200325204202119.png)

#### 1.4权限列表

![image-20200325204235432](/Users/mac/Library/Application Support/typora-user-images/image-20200325204235432.png)

#### 1.5商品列表

![image-20200325204300892](/Users/mac/Library/Application Support/typora-user-images/image-20200325204300892.png)

##### 1.5.1添加商品

![image-20200325204320154](/Users/mac/Library/Application Support/typora-user-images/image-20200325204320154.png)

#### 1.6分类参数

![image-20200325204422740](/Users/mac/Library/Application Support/typora-user-images/image-20200325204422740.png)

#### 1.7商品分类

![image-20200325204452305](/Users/mac/Library/Application Support/typora-user-images/image-20200325204452305.png)

#### 1.8订单列表

![image-20200325204519721](/Users/mac/Library/Application Support/typora-user-images/image-20200325204519721.png)

##### 1.8.1修改收货地址

![image-20200325204606618](/Users/mac/Library/Application Support/typora-user-images/image-20200325204606618.png)

##### 1.8.2物流信息查询

![image-20200325204709436](/Users/mac/Library/Application Support/typora-user-images/image-20200325204709436.png)

#### 1.9数据报表

![image-20200325204747287](/Users/mac/Library/Application Support/typora-user-images/image-20200325204747287.png)