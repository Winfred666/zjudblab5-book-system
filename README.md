### lab5 图书管理系统

使用 next.js 14

预览：https://121.40.46.192/

account and password is both admin
(2024.4 - 2024.7)

##### 1.使用docker
直接使用：

```shell
docker build -t nextjs-docker .

docker run -p 3000:3000 nextjs-docker
```

之后可以在 http://127.0.0.1:3000 访问

对于部分服务器使用的 linux 系统，可能需要在 dockerfile 手动安装 `make` 等应用以完成 `gyp` package 的安装。

如果需要部署服务器端，需要更改 dockerfile 的环境变量 `ENV`

```shell
RUN apk add g++ make py3-pip
```



##### 2.运行安装依赖：

```ps1
npm install
```

初始化sqlite，并插入一些 dummy data：

```ps1
npm run rundb
npm run dummy
```

调试：
```ps1
npm run dev
```

