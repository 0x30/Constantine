---
categories: 大数据
title: Hadoop Hive 环境搭建
tags:
  - 大数据
  - hadoop
  - hive
date: 2019-10-23 22:25:00
---


本文主要为了自己以后再搭建Hadoop的时候，不需要四处查资料，备份用。
本文使用的hadoop 版本为 `2.7.2`,其他版本的文档以及下载文件，可以根据自己的需求进行调整。

<!-- more -->

## Hadoop 搭建

搭建 Hadoop 可以参考，官方文档，注意选择对应的版本  `https://hadoop.apache.org/docs/r2.7.2/hadoop-project-dist/hadoop-common/SingleCluster.html`

### 安装前提条件

搭建Hadoop，需要以下软件

```sh
$ sudo apt-get install ssh
$ sudo apt-get install rsync
```

需要确认配置环境，已经安装好了 Java 并且已经配置好环境变量 `JAVA_HOME`.

如果需要配置集群，至少需要你可以登陆（SSH）集群中的服务器。

并且如果可以的话，配置一下配置分发文件，要不然累死... 貌似 `ZooKeeper`可以，但是我不会啊

### 下载软件包

下载`Hadoop` 编译好的包， `https://hadoop.apache.org/release/2.7.2.html`

下载 `tar.gz` 文件， `src.tar.gz`文件为软件源码， 需要自己编译，有兴趣可以研究。

### Hadoop 本地运行模式配置

配置以下文件 `etc/hadoop/hadoop-env.sh`,配置自己的目录

```sh
# set to the root of your Java installation
export JAVA_HOME=/usr/java/latest
```

此时，hadoop 就已经搭建完成

可以运行`share/hadoop/mapreduce/hadoop-mapreduce-examples-2.7.2.jar` 进行测试 wordCount.

```sh
$ mkdir input
$ cp etc/hadoop/*.xml input
$ bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.7.2.jar grep input output 'dfs[a-z.]+'
$ cat output/*
```

### Hadoop 伪分布式模式配置

在本地模式下，我们的`hadoop`输入和输出的文件都是再本地进行的，伪分布式就需要使用 `HDFS`，来进行文件配置。

修改改写 hadoop 的配置文件， `etc/hadoop/core-site.xml`，让其默认的文件系统使用的是 HDFS。

```xml
<configuration>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://localhost:9000</value>
    </property>
</configuration>
```

记下来，配置 HDFS 副本数为 1个。因为我们只有一个 DataNode 无法多副本备份数据，但是配置多份会不会出现问题？我没有试。

```xml
<configuration>
    <property>
        <name>dfs.replication</name>
        <value>1</value>
    </property>
</configuration>
```

此时，使用以下命令 hdfs 即运行起来了。就可以使用 之前的 `share/hadoop/mapreduce/hadoop-mapreduce-examples-2.7.2.jar` 再 hdfs上进行输入输出了。

```sh
# 格式化 namenode
$ bin/hdfs namenode -format
# 开始运行 hdfs
$ sbin/start-dfs.sh
```


配置 Yarn 环境

配置以下环境 `etc/hadoop/mapred-site.xm`

```xml
<configuration>
    <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
    </property>
</configuration>
```

以及 `etc/hadoop/yarn-site.xml`

```xml
<configuration>
    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>
</configuration>
```

运行 ` sbin/start-yarn.sh`,访问 http://localhost:8088/，可以访问，即表示启动成功

### 完全分布式模式

https://hadoop.apache.org/docs/r2.7.2/hadoop-project-dist/hadoop-common/ClusterSetup.html

确定配置三个文件的 JAVA_HOME.

```
etc/hadoop/hadoop-env.sh 
etc/hadoop/mapred-env.sh 
etc/hadoop/yarn-env.sh
```

配置 `etc/hadoop/core-site.xml` 文件，核心配置文件，确认 `NameNode`，所在的地方，集群中所有的`DateNode` 服务在启动之后，都会通过该地址像 NameNode 报道，响应其管理

| Parameter      | Value        | Notes                                   |
| -------------- | ------------ | --------------------------------------- |
| fs.defaultFS   | NameNode URI | hdfs://host:port/  Name Node 的访问路径 |
| hadoop.tmp.dir | Local Path   | Hadoop 运行临时文件存放目录             |

配置 `etc/hadoop/hdfs-site.xml` 文件，HDFS配置文件，主要

`NameNode` 需要配置以下配置，确保其划分任务的需要。而 `DataNode` 只需要配置 ` dfs.namenode.name.dir` 即可。

| Paramete                            | Value                                 | Notes                                                                       |
| ----------------------------------- | ------------------------------------- | --------------------------------------------------------------------------- |
| dfs.namenode.name.dir               | Local Path.                           | 以逗号分割的本地目录集合方便后期扩容.                                       |
| dfs.namenode.secondary.http-address | 0.0.0.0:50090                         | secondary namenode 指定地址.                                                |
| dfs.hosts / dfs.hosts.exclude       | List of permitted/excluded DataNodes. | hosts 白名单 以及 exclude 黑名单.                                           |
| dfs.blocksize                       | 268435456                             | HDFS存储文件的块大小，默认为 128M，如果性能好可以适当的增加块大小           |
| dfs.namenode.handler.count          | 100                                   | More NameNode server threads to handle RPCs from large number of DataNodes. |


配置以下环境 `etc/hadoop/mapred-site.xm`


| Paramete                 | Value | Notes                               |
| ------------------------ | ----- | ----------------------------------- |
| mapreduce.framework.name | yarn  | 指定 map reducer 使用的资源管理框架 |

以及 `etc/hadoop/yarn-site.xml`

| Paramete                      | Value             | Notes                                           |
| ----------------------------- | ----------------- | ----------------------------------------------- |
| yarn.nodemanager.aux-services | mapreduce_shuffle | 指定 node manager 使用的 aux service 为 shuffle |
| yarn.resourcemanager.hostname | hostname          | 指定 resourceManager 的hostname                 |


**一键启动集群** 在NameNode配置 `etc/hadoop/slaves` 增加 `DataNode` 节点HostName.

## Hive 配置

hive 下载地址 `http://archive.apache.org/dist/hive/`,下载对应的版本。

配置 Hive 环境, `hive-env.sh` 文件，配置 `HAOOP_HOME` ，以及 `HIVE_CONFI_DIR` 两个配置。

### hive mysql 配置

前往 [MVN Repository](https://mvnrepository.com),下载 `Mysql Connector` jar 包，放置在 `hive/lib` 目录下。

修改 `conf/hive-site.xml`,

```xml
<property>
  <name>javax.jdo.option.ConnectionURL</name>
  <value>jdbc:mysql://hadoop102:3306/DataBaseName?createDatabaseIfNotExist=true</value>
</property>
<property>
  <name>javax.jdo.option.ConnectionDriverName</name>
  <value>com.mysql.jdbc.Driver</value>
</property>
<property>
  <name>javax.jdo.option.ConnectionUserName</name>
  <value>root</value>
</property>
<property>
  <name>javax.jdo.option.ConnectionPassword</name>
  <value>000000</value>
</property>
```
