---
categories: 杂谈
title: 小额贷款api 接口总结
tags:
  - 贷款api
  - 分析
date: 2019-01-09 17:40:00
---

最近需要分析以下各个贷款软件api的请求。在该文章中，我会总结下我的api分析结果。

在文章最后总结了一下，获取设备的一些唯一标示。

<!-- more -->

## 融360请求方式

### SSL pinning 处理

其请求没有进行`SSL Pinning`处理，在中间人攻击中，可以成功的获取到数据。

### Request Header

该软件并没有将信息过多的放在header中

#### UA 设置

值得注意的是她的 UA 设置为
````
RB-Loan/5.0 (iPhone; iOS 12.1.2; Scale/3.00) rong360app R360_api_version_2.6
项目名称/贷款版本(设备类型;系统版本;屏幕分辨率倍数) 应用名称 api版本
````

#### cookie 设置

融360使用了 cookie传入了一些信息，最开始的cookie为
````
DEVICE	1 // 设备平台？
RONGID	a0a0725a0d964f9ca5e145e55e8c9324 // 融 ID 估计是某种标示
````
在应用首次开始启动之后，会调用一个 `https://bigapp.rong360.com/mapi/userv12/start` ，会设置一些新的数据

````
Permanent Cookies
abclass	1547014952_59
Expires	Thu, 09-Jan-20 06:22:32 GMT
Domain	.rong360.com
Path	/
__utmz	1547014952.utmcsr=(direct)|utmcmd=(direct)
Expires	Thu, 09-Jan-20 06:22:32 GMT
Domain	.rong360.com
Path	/
__jsluid	c02f0b24ba169497e772e9afda1c398c
Max Age	31536000
Path	/
Http Only	true
````
在随后的请求其cookie 并不会因为软件重启而改变，在 start 请求的返回中，也没有 set cookie的操作，并不清楚是否会有什么操作？比如时间？有效期等，操作该些值的变化

### Request Body

该软件的传递参数一般为 `application/x-www-form-urlencoded` 传递。但，例如 log 等日志相关，会使用 `multipart/form-data; `方式传递。

该软件把设备软件版本等设备指纹等信息，于请求体中提交的form 表单中，放置在 data 字段，就为 普通的 字符串格式。

````js
{
    "appid":"13", // 应用 ID 因为该软件有很多子应用，该ID也无可厚非
    "app_name":"r360loan", // 应名称
    "channel":"AppStore", // 下载渠道
    "rongussd":"a0a0725a0d964f9ca5e145e55e8c9324", // rong-ussd？ 应该是唯一标示类的数据
    "app_version":"2.7.9", // 应用皮版本
    "app_loan_version":"5.0", // 应用贷款的版本？
    "sys_version":"12.1.2", //系统版本
    "api_version":"2.0",
    "idfa":"34675DCC-539B-43CC-9EDD-C9603C0CED08", // idfa
    "city_id":"2", // 城市id
    "platform":"ios", // 平台类型
    "time_stamp":"1547014953", // 提交的时间戳
    "token":"ad6837985a8a65d2a11d9acb86037efb", // 也许是游客的token
    "device_id":"a0a0725a0d964f9ca5e145e55e8c9324", // 设备的id
    "nettype":"WIFI", // 设备的网络情况
    "device_model":"Unknown iPhone" /// ？？？ 啥啥啥？ 获取不到 device model？猜测是没适配？ ipHoneXs max； switch 用了 default 数据
}
````

一般情况下都是直接传递数据，但是在一些接口中，例如 `login` 的接口中，软件会讲data字段进行加密，即使解惑到数据仍不明白所包含数据

### Response header

其大多数的返回结果中 header 都如下。

````ruby
HTTP/1.1 200 OK
Date	Wed, 09 Jan 2019 06:39:02 GMT
Content-Type	text/html; charset=UTF-8
Vary	Accept-Encoding
X-RONG-REQID	5c3597060b03ef00620d000058 ## 请求ID
Vary	Accept-Encoding
Expires	Thu, 19 Nov 1981 08:52:00 GMT
Cache-Control	no-store, no-cache, must-revalidate
Pragma	no-cache
Content-Encoding	gzip
X-Via-JSL	5b5f611,- ## 不明 但是不会随这软件重启而变化
X-Cache	bypass ## 不明 但是不会随这软件重启而变化
Transfer-Encoding	chunked
Connection	Keep-alive
````

在某些情况，例如log日志上传结果中，会没有 `Expires`,`Cache-Control` 以及 `Pragma`
查了下资料，这些参数为禁止客户端缓存页面数据？

猜测是无心的，并没有很深的意思，因为缓存不缓存都一样的。另外我们结合前面的不同的请求参数上传方式，很有可能，就是两套接口？服务。

### Response Body

请求返回体，都是JSON，结构体大致如下

````js
{
	"msg": "ok", // 消息
	"data": {}, // 数据
	"status": 0, // 状态
	"alert_type": 0, // 弹出框类型 ，例如在 登录的时候，如果密码错误，该值为 1，客户端就会 toast msg 中的数据，告知用户错误信息
	"server_time": 1547016163, // 服务器的时间
	"stamp": 1189299007, // 标记 作用不明？
	"sec_level": 0 // 猜测为 security - level 安全等级
}
````

## 够花

### SSL pinning 处理

其请求没有进行`SSL Pinning`处理，在中间人攻击中，可以成功的获取到数据。

### Request Header

该软件被接口基本分为两套 一套为 `https://lzvds.haier.net/` 另外一套 `https://shop.haiercash.com` 在两个请求中 header 存在一些小小的不同。

该软件的请求中，header中包含一些细小的数据

**haiercash**

````ruby
GET /app/appmanage/booth/selectEffective?type=boothType HTTP/1.1
Host	shop.haiercash.com
channel_no	42 ##渠道
Accept	*/*
Authorization
channel	18 ## 渠道
APPVersion	IOS-P-2.5.0 ## 应用信息
Accept-Language	zh-Hans-CN;q=1, en-US;q=0.9, bo-CN;q=0.8
Accept-Encoding	br, gzip, deflate
DeviceResolution	IOS-P-375,812 ## 设备 分辨率
SysVersion	12.1.2 ## 系统版本
promotionChannel	iOS ## 平台
User-Agent	newHaierCash/2.5.0 (iPhone; iOS 12.1.2; Scale/3.00)
Connection	keep-alive
DeviceModel	IOS-P-iPhone ## 设备类型
````

不明白为什么 Authentication 为

````
Server
ParseException: Failed to parse authentication header: 	
````

**lzvds.haier**
````ruby
POST /v3/94b6425d7d003740/ios/other?stm=1547017072093 HTTP/1.1
Host	lzvds.haier.net
X-Timestamp	1547017072096 ## 请求时间
Accept	application/json
Accept-Language	zh-cn
Accept-Encoding	br, gzip, deflate
Content-Type	application/octet-stream
X-GrowingIO-UID	94b6425d7d003740 ## 貌似采用了， 使用 GrowingIO 数据分析产品 https://www.growingio.com/ 也就是一个统计平台，分析用户行为
Content-Length	162
X-Compress-Codec	3 ## 压缩代码？
User-Agent	%E5%A4%9F%E8%8A%B1/2018.12.29.16.00 CFNetwork/976 Darwin/18.2.0
Connection	keep-alive
X-Crypt-Codec	1 ## 加密代码？
````

其中的 UA 也可以看出一些区别，后者的 ua 基本是最简单请求。包含了 CFNetWork 以及 Darwin，也就是系统内核版本。但是不明白的是为何后者，的时间为 2018.12.29？

#### cookie

该软件并没有使用 cookie

### Request Body

该软件在第一套请求中，分为两种情况进行传递参数。一种就是query String 传参。 其参数基本都是明文传输，但是涉及到一些隐秘的接口，它的处理方式和融360类似，都是使用的某种加密方式对数据进行累加密。

例如该软件的是否注册接口，检验手机号码是否注册过了

````
mobile	zsnMzszPysfOysY=
````

手机号码就进行了加密。

另外一红就是，`application/json` 使用json方式传递参数。当然其中涉及到的隐私数据也全部都是加密传输的。例如该软件的更新风险信息。

````js
{
	"mobile": "zsnMzszPysfOysY=",
	"dataTyp": "A501",
	"reserved7": "antifraud_login",
	"source": "18",
	"userId": "zc\/Ky8nLycs=",
	"idNo": "zM\/Oz83Mzs7GysjNzMfKy8bJ",
	"content": ["psaghouvupKzlcaznp28vrW0jq3IuJWrzbyMkY7JkYiGiIyVyLmZlIezltzHzbXGjse4zpfGqp6Hz4msk4iesrrKiJmlr7uMrZuyl8iTyIrIkcqJkJaY0oXOh9Kxy7LOkbzSvpSUtIbSlJC3zYzKiZyTnL3Ols2nx4zPiLOgiIw="],
	"name": "F3h5QWlyGhl+"
}
````

其中的大部分数据都进行加密处理。

另外，由于是两套请求，其第后一个接口请求的参数除了使用 Query String 发送了一个参数之外，其他的数据皆为采用的`application/octet-stream`方式传输的流数据，貌似进行了某种加密，或者他就是干脆的流数据，而我无法看出。但是不重要……

毕竟他是一个 行为分析，日志上报接口。也许设备指纹都是在这里进行的上报。

### Response Header

后者的请求接口，只是普通的回复一个 http 200的请求成功，所以这里不在记录。

我们主要来说说第一个请求。类型

````ruby
HTTP/1.1 200 OK
Date	Wed, 09 Jan 2019 07:12:09 GMT
Server	wswaf/2.10.3-0.el6
Content-Type	application/json;charset=UTF-8
X-Content-Type-Options	nosniff
X-XSS-Protection	1; mode=block
Cache-Control	no-cache, no-store, max-age=0, must-revalidate
Pragma	no-cache
Expires	0
X-Frame-Options	SAMEORIGIN
X-Application-Context	AppServer-GOUHUA:8080
Access-Control-Allow-Origin	*
Access-Control-Allow-Headers	X-Requested-With
Access-Control-Allow-Credentials	true
Access-Control-Allow-Methods	GET,POST,OPTIONS
X-Frame-Options	SAMEORIGIN
X-Via	1.1 shxian202:1 (Cdn Cache Server V2.0), 1.1 PSbjsjqwtpd85:2 (Cdn Cache Server V2.0)
Transfer-Encoding	chunked
Connection	Keep-alive
````

这里并没有太多的额外数据，这些表头也都看不太懂。。。 不确定有没有比较有价值的数据

### Response Body

该软件的第一个请求接口返回的数据皆为 jSON 数据，分为 head 以及 body 两个部分。其中 head 告知了客户端本次请求的情况。body 则包含了数据

````js
{
	"head": { // 返回 head
		"retFlag": "00000",
		"retMsg": "处理成功"
	},
	"body": { // 返回 body
	}
}
````

## 用钱宝


### SSL pinning 处理

其请求没有进行`SSL Pinning`处理，在中间人攻击中，可以成功的获取到数据。

### Request Header

该软件使用 header 传递了很多信息，其header 如下

````ruby
POST /api/v5/loan/card HTTP/1.1
X-Tingyun-Id	h--YAsd90cs;c=2;r=861021530 ## 听云 国内专业的应用性能监控平台
Host	www.yongqianbao.com
AuthCode ## 认证 Code
Version	5.2.1 ## 软件的版本
Accept	*/*
Channel	app-store ## 渠道
Accept-Language	zh-Hans-CN;q=1, en-US;q=0.9, bo-CN;q=0.8
Accept-Encoding	br, gzip, deflate
Content-Type	application/x-www-form-urlencoded
SystemInfo	iOS12.1.2 ## 系统版本
ApiKey	0vT4R7BF7ziw2xs5DfO5BD9d5LO9GuIBJ7F851Ve898 ## api key？？？自己请求自家的api 还需要 key？
SessionID ## Session ID？
DeviceId	34675DCC-539B-43CC-9EDD-C9603C0CED08 ## 设备唯一表示 从形式上来看，符合 idfa的 结构
User-Agent	YongQianBao/5.2.1 (iPhone; iOS 12.1.2; Scale/3.00) ## 其 ua 就是一般的ua
AnubisDeviceId	34675dcc-539b-43cc-9edd-c9603c0ced08-1101 ## 不清楚该ID的作用 但是其格式 就是 deviceId 后面 叫一个 1101？ 暂时不清楚 这个 1101为什么东西
Content-Length	27
Connection	keep-alive
Sign	b00bccb5f03001a0bdd64b508ce83860 ## 针对此次请求的签名。每个请求该值都不一样，类似于 比特币 签名一样，针对自己传输的数据，进行一次签名。保证自己的请求数据未被篡改
````

#### cookie

在软件 进行了了 `https://www.yongqianbao.com/api/v5/index` 请求之后，返回的中，设置了两个 cookie

````ruby
Permanent Cookies
acw_tc	276aedea15470192569088448e6f041fe012bea8a6529fa449c1f444f2716f
Max Age	2678401
Path	/
Http Only	true
Session Cookies
aliyungf_tc	AQAAAEFRzlKYVgsApuTZ3ZN2ICGjdWi8
Path	/
Http Only	true
````

其中， `acw_tc` 不会因为重启软件进行重新设置。并且在 index 请求中，依然会返回 set Cookie 字段，只是该字段与之前传递返回的 `acw_tc` 一致。

`aliyungf_tc`，从名称上来看，应该是阿里云高防塞的,从网上找到一些只言片语

### Request Body

该软件的传输参数的方式均为 `application/x-www-form-urlencoded`，并且没有对隐私数据进行加密。也许是因为别人篡改不了，所以就不怕给别人看？

### Response Header

没有任何异常，除了偶尔的 `Set Cookie`

### Response Body

该软件返回的数据，都是 json 格式，格式基本一致，如下：
````js
{
	"Message": "", // 本次请求结果的描述
	"Code": 0, // 本次请求结果 code
	"Data": { // 本次请求返回的数据
	}
}
````

## 立即贷

### SSL pinning 处理

其请求没有进行`SSL Pinning`处理，在中间人攻击中，可以成功的获取到数据。

### Request Header

该软件没有使用 cookie

该软件，对于 header的利用，简直了....... 其软件内有多个请求

````
viphy.2345.com
v7799.com
wsdaikuan.2345.com
riskdaikuan.2345.com
````

本次我们主要分析后三个，第一个为网页获取等数据接口。

**wsdaikuan** 以及 **v7799** 一致

````ruby
POST /gateway/mine/tabbar HTTP/1.1
Host	wsdaikuan.2345.com
User-Agent	JiKeLoan/9.3.0 (iPhone; iOS 12.1.2; Scale/3.00)34675DCC-539B-43CC-9EDD-C9603C0CED08 ## 从这里 ua 我们已经可以看到，它将 idfa 放置在了最后位置，并不明白此举的好处
terminalId	2 ## 团队？ ID
X-Idfa	34675DCC-539B-43CC-9EDD-C9603C0CED08 ## IDFA
systemVersion	12.1.2 ## 系统版本
X-DeviceToken	34675DCC-539B-43CC-9EDD-C9603C0CED08 ## 设备 token 唯一表示，他们将 idfa 作为了 唯一表示。
channel	jkd-appstorejkj_fr_liuj ## 渠道
groupId	2 ## 分组 id 并不清楚这个 分组的含义？
version	9.3.0 ## 软件版本
os	iOS ## 操作因其高
Content-Length	11
app-bundle-id	me.ImmediatelyLoan.app ## 上下一致
bundleId	me.ImmediatelyLoan.app ## 上下一致 结合我们之前的ios防御战，也许有一个是系统获取，另一个是自己的私有方法。
uid	34675DCC-539B-43CC-9EDD-C9603C0CED08 ## 用户的id？
X-Ip	192.168.31.27 ## ip地址
manufacture	apple ## 品牌 手机拍品
Authorization	Basic c3VpeGluZGFpOjFxYXohQCMk ## 用户的认证信息  
Accept-Language	zh-Hans-CN;q=1, en-US;q=0.9, bo-CN;q=0.8
model	iPhone11,6 ## 设备 model 类型
productId	10002 ## 产品 id
X-DeviceNo ## 设备 no？ 在开始的请求中，并没有纸，但是在后续的请求中已经出现了值。我更愿意觉得它是设备指纹，没有值是还在手机讯息？
pid	10002 ## 与 producid 一致？不明白其含义
operators	CTCC ## 当前的手机的移动卡的 为 ctcc 电信
Content-Type	application/x-www-form-urlencoded
Accept	*/*
requestTime	1547020256.844606 ## 请求时间
Accept-Encoding	br, gzip, deflate
Connection	keep-alive
````

其中 author 参数,为 随心贷？

````
Server
Basic Authentication
User ID	suixindai
Password	1qaz!@#$
````

再看看，**riskdaikuan** 的header
````ruby
GET /lake-app/app/conf HTTP/1.1
Host	riskdaikuan.2345.com
ts	1547020256951
User-Agent	JiKeLoan/9.3.0 (iPhone; iOS 12.1.2; Scale/3.00)34675DCC-539B-43CC-9EDD-C9603C0CED08
X-Idfa	34675DCC-539B-43CC-9EDD-C9603C0CED08
X-DeviceToken	34675DCC-539B-43CC-9EDD-C9603C0CED08
appIdentify	3
version	9.3.0
os	iOS
sign	569f453f3e277fbe4a187cf71b167e65
app-bundle-id	me.ImmediatelyLoan.app
X-DeviceNo	34675DCC-539B-43CC-9EDD-C9603C0CED08
X-Lng	0
X-Ip	192.168.31.27
Authorization	Basic c3VpeGluZGFpOjFxYXohQCMk
Accept-Language	zh-Hans-CN;q=1, en-US;q=0.9, bo-CN;q=0.8
Connection	keep-alive
user-id
pid	10002
Accept	*/*
X-Token	F009C4485DA784B22BF1A9A470FCF9DB7FBF4A9E44822C5FC133636E4B80118D
Accept-Encoding	br, gzip, deflate
customer-id	default
X-Lat	0
````

其实大同小异，其中 多了，sign 也就是签名？针对此次传入的数据的签名吗？
以及 多了 `lat - lon` 经纬度的传入。 从请求的host字面意思看，这是 风险 系统，所以要保证传入的信息的安全。以及多了位置的参数。


### Request Body

该软件的传参数为 `application/x-www-form-urlencoded` ，数据并没有进行加密，例如登录请求。

````
phone	15313571545
````

### response Header

该软件的请求返回结果header并没有什么值得说的额

### Response Body

该软件返回均为 `application/json;charset=UTF-8` 。

其数据结构均为

其中 v7799 为

````js
{
	"result": { // 请求结果
		"registered": "990889856616955",
		"inWhiteList": "6521315364",
		"pwdHasSet": "2768395827768"
	},
	"error": null // 错误信息
}
````

2345.com

````js
{
	"result": {},
	"code": "success", // 多了一个 code
	"error": {
		"message": ""
	}
}
````

## 信用钱包

### SSL pinning 处理

其请求没有进行`SSL Pinning`处理，在中间人攻击中，可以成功的获取到数据。

### Request Header

````ruby
GET /api/tab/loan/home/v3 HTTP/1.1
Host	sappbackend.q-gp.com
Authorization ## 认证信息 空白
channel	214 ## 渠道
Content-Encoding	gzip
appName	xinyongqianbao ## 项目名称
Accept	*/*
source	0
Accept-Language	zh-Hans-CN;q=1, en-US;q=0.9, bo-CN;q=0.8
Accept-Encoding	gzip
version	6.3.88 ## 软件版本
User-Agent	CreditWallet/6.3.88 (iPhone; iOS 12.1.2; Scale/3.00)
Connection	keep-alive
device_id	34675DCC-539B-43CC-9EDD-C9603C0CED08 ## 设备id 直接食用的 idfa当作的 设备唯一表示
appchannel	AppStore ## 软件 渠道
````

### Request Body

该软件的请求参数有的采用 `application/x-www-form-urlencoded` 数据传输。例如，其请求验证图形验证码的接口

````ruby
captchaId	8ca0e5e2-9986-4b1b-8c3a-0eeb5e4ff8e7
captchaValue	1012
phone	15315491878
registerFrom	214
usage	3
````

有的则采用了，query String 方式传输参数。例如 用户的手机验证码验证参数？

````
https://sappbackend.q-gp.com/api/tab/loan/submit/unregisteredinfo?appOs=iPhone12.1.2&carrierOperator=%E4%B8%AD%E5%9B%BD%E7%94%B5%E4%BF%A1&currentGps=0%2C0&deviceid=34675DCC-539B-43CC-9EDD-C9603C0CED08&phone=15315491878&phoneDeviceType=iPhone11%2C6&phoneRegistrationLocation=

appOs	iPhone12.1.2
carrierOperator	中国电信
currentGps	0,0
deviceid	34675DCC-539B-43CC-9EDD-C9603C0CED08
phone	15315491878
phoneDeviceType	iPhone11,6
phoneRegistrationLocation
````

### Response header

没啥好说的

### Response Body

该软件的定义的请求返回结构非常随意。

例如，请求图形验证码接口直接返回结构，直接就是数据，用户根据 response status code 来判断是否完成。
````
{
	"message": "",
	"image": "data:image/png;base64,iVBORw0KG...",
	"imageId": "8ca0e5e2-9986-4b1b-8c3a-0eeb5e4ff8e7"
}
````

而提交手机验证码接口返回的数据却有了 code ，以及 message
````
{
	"code": 0,
	"message": "SUCCESS"
}
````

## 招联金融

### SSL pinning 处理

其请求没有进行`SSL Pinning`处理，在中间人攻击中，可以成功的获取到数据。

### Request Header

该软件也是将关于设备的信息都放置在 header，但是它的区别在于，它是放置在一个下面，并且为json格式

````
POST /guapai/query.json?_s=765683a2mpvx3pu19c57f81f HTTP/1.1
Host	mgr.api.mucfc.com
Content-Type	application/x-www-form-urlencoded
EnvParams --------- 数据在此！
Connection	keep-alive
Accept	*/*
User-Agent	MUAPP/5.1.1 (iPhone; iOS 12.1.2; Scale/3.00)
Accept-Language	zh-Hans-CN;q=1, en-US;q=0.9, bo-CN;q=0.8
Accept-Encoding	br, gzip, deflate
Content-Length	0
````

在这里我们来看看 这个json的格式

````js
{
    "osVersion":"12.1.2", /// 系统版本
    "ip":"fe80::8ad9:c0bf:a446:8896", // ip 获取的是 ipv6de
    "appType":"iOS", // 应用 类型
    "imsi":"", // imsi 国际移动用户识别码（IMSI：International Mobile Subscriber Identification Number）
    "deviceId":"36CA5DADE7434FB386B50E8CAC6BBCAC", // 设备唯一标示 自己生成的？
    "coordinateSystem":"BD-09", // 手机的陀螺仪位置 坐标
    "phoneModel":"iPhone11,6", // 设备 model
    "publish":"APPSTORE", // 设备的来源
    "imei":"", // imei 国际移动设备识别码（International Mobile Equipment Identity，IMEI）
    "channel":"0APP", // ；
    "appVersion":"5.1.1", // 应用版本
    "latitude":"-999", // 纬度
    "callingTag":"0", // 不清楚
    "resolution":"1242x2688", // 分辨率
    "os":"iOS", // 设备型号
    "internetType":"WIFI", // 联网方式
    "manufacturer":"APPLE", // 品牌
    "mac":"", // mac 地址
    "appName":"MUAPP", // 应用名称
    "longitude":"-999", // 京都
    "token":"T9PwdCq0Ha-NdseBIMHQjAfwPJQUWbXjQ121100100", // token
    "idfv":"3951BAB4-1D9F-479E-9649-6ACE8BAF95F8", // idfv
    "isEmulator":"false", // 是不是 模拟器
    "merchant":"", // 商人？不确定
    "idfa":"34675DCC-539B-43CC-9EDD-C9603C0CED08" // idfa
}
````

这个是目前来说，手机的信息最全的软件了...

该软件的 cookie 包含了很多信息，主要为
````
MUSESSIONID	C7019D5861B9F39EDAFA818E68185305.API1
mtagc	30037.35.03
````

session 会话ID吗？ 不确定/

mtagc 不确定该参数为什么？

### Request Body

该软件的请求也是采用了多种方式。大多数为 `application/x-www-form-urlencoded` ，在大多数的请其中，无论其是不是以何种方式传输，其 queryString中，都会包含一个
````
_s	e3d15df8ey4686fdae2e60bb
````
结合之前的经验来看，该字段很有可能是针对此次请求参数的签名。

其 通过 form 表单传输的字段均没有加密。当然，密码的加密是应该的所以，所以也算在没加密之内。

该软件也会有一些请求接口完全使用 query String 来进行参数请求。

### Response Header

没有啥可说的

### Response Body

该软件的基本请求返回结构都为json，结构如下

````js
{
	"ret": "1", // code？
	"errMsg": "", // 错误原因
	"errCode": "APIAUTH20043", // 错误码
	"data": {}, // 返回的数据
	"tips": { // 弹出狂的
		"content": "", // 弹出框的内容
		"title": "", // 标题
		"button": "确定", // 按钮
		"type": "confirm" // 弹出框的类型 toast ？ confirm
	}
}
````

例如 登录密码错误返回结果如下

````
{
	"ret": "1",
	"errMsg": "您输入的账号或密码错误,请重新输入",
	"errCode": "APIAUTH20043",
	"data": {},
	"tips": {
		"content": "您输入的账号或密码错误,请重新输入",
		"title": "",
		"button": "确定",
		"type": "confirm"
	}
}
````

请求正常的结果如下

````
{
	"ret": "0",
	"errMsg": null,
	"errCode": null,
	"data": {
		"ZLShoppingMall": null
	},
	"tips": {
		"content": null,
		"title": null,
		"button": null,
		"type": "default"
	}
}
````

## 有钱花

### SSL pinning 处理

其请求没有进行`SSL Pinning`处理，在中间人攻击中，可以成功的获取到数据。

### Request Header

并没有太多的参数。

但是该软件大多数都存在以下 cookie

````
Permanent Cookies
BAIDUID	64EC8FDF03A930D6832DA74A1BD93FC0:FG=1
Expires	Thu, 09-Jan-20 08:36:52 GMT
Max Age	31536000
Domain	.baidu.com
Path	/
Other attributes
version	1
BAIDUID	86FB80D5899AF3FBA751E3B42CEEB7D1:FG=1
Expires	Thu, 09-Jan-20 08:36:52 GMT
Max Age	31536000
Domain	.baidu.com
Path	/
Other attributes
version	1
AB_EXPERIMENT	%7B%22NA_STOKEN%22%3A%22%22%2C%22sdk_card_list_aibank_entrance%22%3A%22%22%2C%22getSpPayTypeInfo%22%3A%22ON%22%2C%22ODP_AUTH_SWITCH%22%3A%22%22%2C%22uc_app_conf%22%3A%22ON%22%2C%22CREDIT_NCIIC_MAIN_SWITCH%22%3A%22%22%2C%22PAYPHP_RET_TYPE_SWITCH%22%3A%22ON%22%2C%22group_smallflow%22%3A%22%22%2C%22group_umoney%22%3A%22%22%2C%22wallet_encrypt_payphp%22%3A%22ON%22%2C%22rccIfSupportChannel%22%3A%22ON%22%2C%22order_center%22%3A%22ON%22%2C%22WALLETSP_IP_CHECK%22%3A%22ON%22%2C%22ifNewAuthorizeServer%22%3A%22ON%22%2C%22getChannelInfoPayphp%22%3A%22ON%22%2C%22wallet_encrypt%22%3A%22ON%22%2C%22wap_auth_home_ocr%22%3A%22%22%2C%22UC_FORCE_API_IP_CHECK%22%3A%22ON%22%2C%22ifDoCrypt%22%3A%22ON%22%2C%22ORDER_CENTER_OUTER%22%3A%22ON%22%2C%22getChannelInfo%22%3A%22ON%22%2C%22group_smallflow_uri%22%3A%22%22%2C%22cancelAllAgreement%22%3A%22ON%22%2C%22PC_SESSION_COOKIE_SWITCH%22%3A%22ON%22%2C%22bind_and_auth_new%22%3A%22%22%2C%22verify_pass_mobile%22%3A%22%22%2C%22rccRouteByChannel%22%3A%22%22%2C%22REGET_TYPE_STOKEN%22%3A%22ON%22%2C%22JUMP_TO_PASS_LOGIN_SWITCH%22%3A%22ON%22%2C%22NEW_BALANCE_DETAIL_SWITCH%22%3A%22ON%22%7D
Max Age	60
Path	/
Http Only	true
BAIDUID	41EBF05D2AB4085B5A88B256137FA544:FG=1
Expires	Thu, 09-Jan-20 08:36:52 GMT
Max Age	31536000
Domain	.baifubao.com
Path	/
Other attributes
version	1
__bsi	7382618478205985619_00_9_R_N_176_0303_c02f_Y
Max Age	3600
Domain	www.baifubao.com
Path	/
````

````ruby
BAIDUID	FCC417DF0E349CC9CF074210CA82379B:FG=1 ### baidu 用户id？
__bsi	7735807095066314684_00_16_N_N_18_0303_c02f_Y ## 不明白是什么
AB_EXPERIMENT 	%7B%22NA_STOKEN%22%3A%22%22%2C%22sdk_card_list_aibank_entrance%22%3A%22%22%2C%22getSpPayTypeInfo%22%3A%22ON%22%2C%22ODP_AUTH_SWITCH%22%3A%22%22%2C%22uc_app_conf%22%3A%22ON%22%2C%22CREDIT_NCIIC_MAIN_SWITCH%22%3A%22%22%2C%22PAYPHP_RET_TYPE_SWITCH%22%3A%22ON%22%2C%22group_smallflow%22%3A%22%22%2C%22group_umoney%22%3A%22%22%2C%22wallet_encrypt_payphp%22%3A%22ON%22%2C%22rccIfSupportChannel%22%3A%22ON%22%2C%22order_center%22%3A%22ON%22%2C%22WALLETSP_IP_CHECK%22%3A%22ON%22%2C%22ifNewAuthorizeServer%22%3A%22ON%22%2C%22getChannelInfoPayphp%22%3A%22ON%22%2C%22wallet_encrypt%22%3A%22ON%22%2C%22wap_auth_home_ocr%22%3A%22%22%2C%22UC_FORCE_API_IP_CHECK%22%3A%22ON%22%2C%22ifDoCrypt%22%3A%22ON%22%2C%22ORDER_CENTER_OUTER%22%3A%22ON%22%2C%22getChannelInfo%22%3A%22ON%22%2C%22group_smallflow_uri%22%3A%22%22%2C%22cancelAllAgreement%22%3A%22ON%22%2C%22PC_SESSION_COOKIE_SWITCH%22%3A%22ON%22%2C%22bind_and_auth_new%22%3A%22%22%2C%22verify_pass_mobile%22%3A%22%22%2C%22rccRouteByChannel%22%3A%22%22%2C%22REGET_TYPE_STOKEN%22%3A%22ON%22%2C%22JUMP_TO_PASS_LOGIN_SWITCH%22%3A%22ON%22%2C%22NEW_BALANCE_DETAIL_SWITCH%22%3A%22ON%22%7D
````

其中 `AB_EXPERIMENT` 字段 url encode 解码之后得到

````js
{
    "NA_STOKEN":"",
    "sdk_card_list_aibank_entrance":"",
    "getSpPayTypeInfo":"ON",
    "ODP_AUTH_SWITCH":"",
    "uc_app_conf":"ON",
    "CREDIT_NCIIC_MAIN_SWITCH":"",
    "PAYPHP_RET_TYPE_SWITCH":"ON",
    "group_smallflow":"",
    "group_umoney":"",
    "wallet_encrypt_payphp":"ON",
    "rccIfSupportChannel":"ON",
    "order_center":"ON",
    "WALLETSP_IP_CHECK":"ON",
    "ifNewAuthorizeServer":"ON",
    "getChannelInfoPayphp":"ON",
    "wallet_encrypt":"ON",
    "wap_auth_home_ocr":"",
    "UC_FORCE_API_IP_CHECK":"ON",
    "ifDoCrypt":"ON",
    "ORDER_CENTER_OUTER":"ON",
    "getChannelInfo":"ON",
    "group_smallflow_uri":"",
    "cancelAllAgreement":"ON",
    "PC_SESSION_COOKIE_SWITCH":"ON",
    "bind_and_auth_new":"",
    "verify_pass_mobile":"",
    "rccRouteByChannel":"",
    "REGET_TYPE_STOKEN":"ON",
    "JUMP_TO_PASS_LOGIN_SWITCH":"ON",
    "NEW_BALANCE_DETAIL_SWITCH":"ON"
}
````
这一大长串哟。。。。

### Request Body

该软件传输的参数也是 form 以及 query 都有的。

````
ua	BaiduWalletUmoney-3.3.0-IOS-bdyouqianhuapro_1125_2436_iPhone_12.1.2_12.1.2_appstore
wcp	ewogICJjdWlkXzEiIDogIktBQUFBQUFBQUFBMlBrXC9JdUw2M1RWNVFFanE4N3RWWGFLVGRZa3doVnVvcVVNekhXMks5REtGYmU2ZU9ZUml1bVlPVVFnRTZzZTQ9IiwKICAiZnBpZSIgOiAiQlFBQUFBQUFBQUNNSTdhVEdcL1wvM2hld0ZBbGNaRTVcLzAiLAogICJ3bG9jIiA6ICJFUUFBQUFBQUFBQ25WXC9xd1QySG5sWWhrMUtIU0puMnhQTVk2SHdMMjQ1bWNOQjlFT2V1ajJnPT0iLAogICJ3aWJrIiA6ICJCUUFBQUFBQUFBQ01JN2FUR1wvXC8zaGV3RkFsY1pFNVwvMCIsCiAgImFwcG5hbWUiIDogIkNRQUFBQUFBQUFCOGNybGx1N3B0SkJsTTh4STdFeTRDIiwKICAiaWRmYSIgOiAiSkFBQUFBQUFBQUIwM0VWZExPTTlNUlFKcVJxem51Tno1d3Z6b0hvWWt1UDZhTjFtYjI1MVFBU0orUGJIeVppU2JSQmZFQmJOOU9jPSIsCiAgImJ1bmRsZSIgOiAiRkFBQUFBQUFBQUNuT0dFWit4NjVKUWVLd2s5TFk4b2xLenhGVVR6c2JCMWFVU2FcL1hlc3lPQT09IiwKICAic2FwaV9jdWlkIiA6ICJJQUFBQUFBQUFBQnJWXC9WR05iQno4OGE5OFZNYTRKVUlqMWJDbGJ5NmRzc1pNTVU2MkYxdnN3V1NkTXcwRzhSK0hkUnd5NEZuTzRBPSIsCiAgInRlcm10eXBlIiA6ICJDZ0FBQUFBQUFBQzkzOHk3aUJmbnNyenB5aSs0UHZpeiIsCiAgIm9wZXJhdG9yIiA6ICJCZ0FBQUFBQUFBQU0xMm9MbW5ZZGVHSVZsMDV0TXVMQyIsCiAgIm5ldHR5cGUiIDogIkJBQUFBQUFBQUFEdUdTYXV3SWtzSEJCc1A5cXc0MU94IiwKICAiY3VpZF8yIiA6ICJKQUFBQUFBQUFBQjAzRVZkTE9NOU1SUUpxUnF6bnVOejV3dnpvSG9Za3VQNmFOMW1iMjUxUUFTSitQYkh5WmlTYlJCZkVCYk45T2M9IiwKICAid21pcCIgOiAiRFFBQUFBQUFBQURVc05PeGdCcm1jNkF5VldHN21pWXYiCn0=
key	odRKzR+CGxI4ScBp9EEpXzZuT9xP80G1e4jPgmHH1b65TmqiRNU4o3Jjy4+ht5+CG9S5ZpDCj7mBSxhCBaeI/FmKa5lotbi4RI5cwxiX6IWyFBQ0CDds+6Y2ydnxlIUH71RyyvjDEWCr+zMfDQ18rLyoNBGW46ohZ8OaZtGS6sz36MwegjcDeTZyx6RE/0Fb+7tW1alzeyed01T4/n+KSCnga909GmMoUJwm0T52dEEoToL36NolEz+JvNERFWVfl5RDledWX1XYHlSB93AbYGHbUdGJ6aVAu99NwVqhdPMw3IYQla5nyOA4LuEO7oLcxHjptFwzOJtoyeC7HUiWVA==
cuid_1	KAAAAAAAAAA2Pk/IuL63TV5QEjq87tVXaKTdYkwhVuoqUMzHW2K9DKFbe6eOYRiumYOUQgE6se4=
cuid_2	JAAAAAAAAAB03EVdLOM9MRQJqRqznuNz5wvzoHoYkuP6aN1mb251QASJ+PbHyZiSbRBfEBbN9Oc=
````

其数据根据参数的重要程度，有的进行了加密，而有些没有加密，比如其在上传使用用户又没有使用自己家的软件的时候，只是是明文。

````
app_list	{
  "walletapp" : "N",
  "walletapppro" : "N",
  "bdyouqianhuapro" : "Y",
  "bdyouqianhua" : "N"
}
````

### Response Header

没有太多锁说的额，除了一些 设置 cookie

### Response Body

该软件的返回结构为json，基本结构为

````js
{
	"ret": 0, // 结果
	"msg": "OK", // 消息
  "signature": "", // 签名 - 一般没有 重要接口 会增加加密
  "mdAlgorithm": "", // 算法名称
	"content": { // 内容
	}
}
````

有些返回结果，会加密而有些不进行加密。加密的如下

````json
{
	"ret": 0,
	"msg": "OK",
	"content": "eyJtZDUiOiIifQ==",
	"signature": "AuIEcsfCs4AFmILD4k5QzVYNGKH\/Bd0uie7DfFt71igopEIaPSkj8MmuJt1tbIDHrhR2NqiRyGF6xH4spca9yw6jPHMrOUDI57wusxBghoT7x4oUM3p6frMl72yM6PU0G\/p4STNLHx+LB7NNBHn5E4bcj0GFOKWCXTe9qz7RigADPL\/NaBBgPcvmx6yTUoHTLXveasxBJL2xmnUjheoV63SIczGjYLLol\/pvUPMyI5379d88XfUAcK+Q9kjj92q\/cqxOsihCtiKnxow3SfNRCGNVuuXDdrcf8QSxh5gt\/4FHSmRzTNmtEQP1nilLFBWKOrFzDjK+qqJMqdrar2eKXA==",
	"mdAlgorithm": "MD5"
}
````

没有加密的如下。

````json
{
	"ret": 0,
	"msg": "OK",
	"content": {
		"is_login": "0",
		"changed_sign": "7b5965e13e1d0f1c9ebb173e14f1d451",
		"personal_center": []
	}
}
````
## 拍拍贷

### SSL pinning 处理

其请求没有进行`SSL Pinning`处理，在中间人攻击中，可以成功的获取到数据。

### Request Header

还软件把很多信息都放置在 header 中。

````ruby
POST /loanapp/HomepageServiceNoLogin/queryHomeCard?cp=YXBwaWQ9MTAwODAwMDMmY2hhbm5lbD1BcHBTdG9yZSZkdWlkPUE3NkRCRDAzNUUzRkU0MkM5N0EzMTRBQTk4MUZEOUFDJmVuPWllJTQwaWYlNDBvcyU0MHVjJmllPVFRJTJGVEtIT0VuSmJia2RFZ0N3VVF1ZyUzRCUzRCZpZj0lMkZjV21DaDdvbUphOFlQMkZaUVJhbkpwY1ElMkZiNUdHM2RVaEhIM3ZHdlFjV1NwTmhpb0xob2UxS1NzWWx3WGU3OCZvcz1VSmZSeTV2YjhYZldNNUU2MG5xQkhCcG81MldWazRHOG1ESTFDNFNBMWRJJTNEJnBpZD1QUERMb2FuQXBwJnVjPXhKWDElMkZ6ZmIzM1lnU3ZOdTNvek5LV3JLQ0htVWJXOGJsN2ZyaVZkWTBJayUzRCZ2ZXI9MQ%3D%3D HTTP/1.1
Host	wirelessgateway.ppdai.com
X-PPD-SIGNVERSION	1 ## 信号符号？
Accept	*/*
X-PPD-NEWSIGN	f9Q4rIDSVPsVVWkWO0Bdhye8IMXPYJxs2wOIsDkrjborRvBruCcIhgVo3OL0C9NfMfbmr80zdSX2nHReKtDSZinf/+fmeiO7OX1fneWzDAXZcr5F6H50QGiA7TwOhLvaTr2+/b2rmmDYtTCS+O0kztw3odh/sS4EEOMgf5mpMM8= ## 新的签名
X-PPD-APPID	10080003 ## app id
X-PPD-DEVICEID	A7F1D8F9-0E30-4F91-91DA-91C3B3BBBA29 ## 设备 标示
Accept-Language	zh-Hans-CN;q=1, en-US;q=0.9, bo-CN;q=0.8
X-PPD-TIMESTAMP	1547024311 ## 设备 时间戳
X-PPD-KEYVERSION	1 ## key version
X-PPD-APPVERSION	7.0.1 ## 应用 版本
X-PPD-APPOS	1 ## app os系统
User-Agent	PPDLoanApp/7.0.1 (AppID/10080003;appstore)(apple;iPhone11,6;A76DBD035E3FE42C97A314AA981FD9AC;iOS/12.1.2) ## ua
X-PPD-KEY	tc-002 ## key
Content-Length	51
Accept-Encoding	br, gzip, deflate
X-PPD-SIGN	KtnVYcVuhAikBzdoY64XndH77N89tbG9o5pzv9LZOWX3lUI9zJz89JjgSBKYVDsksOk005UC0taFhrl9Fo5jUyGZ9QpdaIjEhFUezAN9tW9IU7kqJlORC555BHTti2xKxS/cfbyCUm9Ib7N/+y3o6XUASPDHilYK/NUyQwUM0I0= ## 老的签名
Connection	keep-alive
Content-Type	application/json
````

其中 cookie为

````
aliyungf_tc	AQAAAKtPzhRpbA4ApuTZ3WAIFVMBF9Z1
````

咱们之前说过了，这是阿里云放置阻塞的。

### Request Body

该软件的传输参数基本都是以 `application/json` 传输的参数。其中大部分的请求，都会加一个 queryString 参数。

````
cp	YXBwaWQ9MTAwODAwMDMmY2hhbm5lbD1BcHBTdG9yZSZkdWlkPUE3NkRCRDAzNUUzRkU0MkM5N0EzMTRBQTk4MUZEOUFDJmVuPWllJTQwaWYlNDBvcyU0MHVjJmllPVFRJTJGVEtIT0VuSmJia2RFZ0N3VVF1ZyUzRCUzRCZpZj0lMkZjV21DaDdvbUphOFlQMkZaUVJhbkpwY1ElMkZiNUdHM2RVaEhIM3ZHdlFjV1NwTmhpb0xob2UxS1NzWWx3WGU3OCZvcz1VSmZSeTV2YjhYZldNNUU2MG5xQkhCcG81MldWazRHOG1ESTFDNFNBMWRJJTNEJnBpZD1QUERMb2FuQXBwJnVjPXhKWDElMkZ6ZmIzM1lnU3ZOdTNvek5LV3JLQ0htVWJXOGJsN2ZyaVZkWTBJayUzRCZ2ZXI9MQ==
````
其中 cp，每次请求都不会发生变化，并且重启软件也不会发生变化。不清楚这个参数是干什么的？

### Response Header

该软件返回header，增加了一个 `X-PPD-TIMESTAMP` ,用于返回服务器的时间，其实Date 也可以啊？

另外增加了一个 cookie

````ruby
HTTP/1.1 200
Date	Wed, 09 Jan 2019 09:08:23 GMT
Content-Type	application/json;charset=utf-8
Content-Length	14
Set-Cookie	aliyungf_tc=AQAAAGpy53658wsApuTZ3R0VlmlA6kTR; Path=/; HttpOnly
X-PPD-TIMESTAMP	1547024903 ## 服务器 时间
Connection	Keep-alive
````

### Response Body

该软件的基本返回结果都是 json，基本结构都为

````js
{
	"Content": {}, // 数据
	"Result": 0, // 返回 结果 code
	"ResultMessage": "响应成功" // 返回 结果 数据
}
````

该软件涉及到一些机密的接口，返回的数据会进行加密,例如，应用的配置接口 `/pssApollo/apolloService/config`

````json
{
	"Content": {
		"tracker.device": "k6/nTMseHybDt+q.........",
		"showAppStore": "Uw99AVddBFwn9EnfI/KLGw==",
		"PPDTracker_switch": "XyW/F0HUNupW/qitSmZ42A==",
		"whitelist.webui.common": "LzMBmnc9GiZ7uzyO+k0lMdnWPKc5...........",
		"whitelist.webui.auth": "LzMBmnc9GiZ7uzyO+k0lMZMN18H/............"
	},
	"Result": 0,
	"ResultMessage": "响应成功"
}
````

这个接口的数据就是加密的。也有没有加密的，例如，版本升级接口 `/loanhome/AppService/getUpdateVersion`

````js
{
	"Content": {
		"latestVersion": "6.2.0",
		"minVersion": "6.2.0",
		"url": "https://itunes.apple.com/us/app/id983488107?l=zh&ls=1&mt=8"
	},
	"Result": 200
}
````

## 拉卡拉

不清楚这个软件怎么做到的 但是它的请求和失败就和为微信一样？  请求和返回都处于加密状态,不可读？  如果使用 `ssl pinning` 直接是不请求，但是他这种不仅可以避免中间人攻击，并且加密。。。还可以正常请求。。。。


## 设备的唯一标识

1. idfa(Identifier for Advertising)
2. idfv(identifier For Vendor)
3. keyChain
4. udid(Unique Device Identifier) - ios7以上废弃
5. mac address - ios7以上废弃
6. open UDID - 废弃
7. push token - 不推荐使用
8. imei - 国际移动设备识别码（International Mobile Equipment Identity） - 废弃
9. imsi - 国际移动用户识别码（International Mobile Subscriber Identification Number

### idfa

是苹果封禁了`mac` 以及 `UDID` 之后，给用户提供的一个唯一标示的选择。他在设备上对于所有应用都是唯一的。

但是他很有可能会没有，并且有可能会改变。

关闭IDFA获取权限操作：
设置 → 隐私 → 广告 → 选择禁止获取IDFA值

重新生成IDFA操作：
操作一：设置程序 → 通用 → 还原 → 还原位置与隐私
操作二：设置程序 → 通用 → 关于本机 → 广告 → 还原广告标示符

### idfv

是给Vendor标识用户用的，每个设备在所属同一个Vender的应用里，都有相同的值。

对于 IDFV 来说，只有在厂商所有app都被删除后，才会发生改变。

如何判断是否同一个厂商？ 网上有说法

> 就是通过BundleID的反转的前两部分进行匹配，如果相同就是同一个Vender，共享同一个IDFV的值。

但是我觉得，不太可能！ 这样实在是太不严谨了！

### keyChain

iOS整个系统有一个KeyChain，每个程序都可以往KeyChain中记录数据，而且只能读取到自己程序记录在KeyChain中的数据。而且就算我们程序删除掉，系统经过升级以后再安装回来，依旧可以获取到与之前一致的UDID（系统还原、刷机除外）。因此我们可以将UUID的字符串存储到KeyChain中，然后下次直接从KeyChain获取UUID字符串。

### udid

iOS7之前的使用了的app如果在iOS7上运行，它不会返回设备的UDID，而是会返回一串字符串，以FFFFFFFF开头，跟着identifierForVendor的十六进制值。

获取：[[UIDevice currentDevice] uniqueIdentifier]

### mac address

MAC地址在网络上用来区分设备的唯一性，接入网络的设备都有一个MAC地址，他们肯定都是不同的，是唯一的。一部iPhone上可能有多个MAC地址，包括WIFI的、SIM的等，但是iTouch和iPad上就有一个WIFI的，因此只需获取WIFI的MAC地址就好了，也就是en0的地址。MAC地址就如同我们身份证上的身份证号码，具有全球唯一性。但在iOS7之后，如果请求Mac地址都会返回一个固定值。

### open UDID

OpenUDID利用了一个非常巧妙的方法在不同程序间存储标示符 — 在粘贴板中用了一个特殊的名称来存储标示符。通过这种方法，别的程序（同样使用了OpenUDID）知道去什么地方获取已经生成的标示符（而不用再生成一个新的）。而且根据贡献者的代码和方法，和一些开发者的经验，如果把使用了OpenUDID方案的应用全部都删除，再重新获取OpenUDID，此时的OpenUDID就跟以前的不一样。可见，这种方法还是不保险。 
但是OpenUDID库早已经弃用了, 在其官方的博客中也指明了, 停止维护OpenUDID的原因是为了更好的向苹果的举措靠拢, 还指明了MAC Address不是一个好的选择。

### push token

apple push token保证设备唯一，但必须有网络情况下才能工作，该方法并不是依赖于设备本身，而是依赖于apple push机制，所以当苹果push做出改变时, 你获取所谓的唯一标识也就随之失效了。所以此方法还是不可取的。

### imei

手机用户可以在手机中查到自己手机的IMEI码。因为隐私问题，苹果用户在iOS5以后不能再获取IMEI的值了。

如果开发的App不上架苹果商店，又想获取IMEI值，可使用[私有方法](https://stackoverflow.com/questions/16667988/how-to-get-imei-on-iphone-5/16677043#16677043)，获取IMEI值。  

### imsi

IMSI分为两部分：

一部分叫MCC（Mobile Country Code移动国家码），MCC的资源由国际电联(ITU)统一分配，唯一识别移动用户所属的国家，MCC共3位，中国地区的MCC为460；

另一部分叫MNC（Mobile Network Code 移动网络号码），MNC用于识别移动客户所属的移动网络运营商。MNC由二到三个十进制数组成，例如中国移动MNC为00、02、07，中国联通的MNC为01、06、09，中国电信的MNC为03、05、11。


## 总结

总的来说，如果真要说要写一个比较安全的小贷软件的话，其实可以采取各家之长，比如

1. 使用SSL PINNing 方式。当然有盾就有矛，该方式，会在证书之间进行校验，完全可以通过`hook`的方式，保证这个验证会通过。我们可以通过使用 越狱以及防止hook的方式，阻止这种方法。
2. 针对请求返回数据进行加密，例如百度有钱花，或者其他软件加密某些参数，都可以。
3. 如果可以的话，最好可以知道 拉卡拉的实现方式，即使在可以请求的状态下仍然完成请求，并且可以实现保密。
4. 针对请求的进行签名，保证即使被抓取，也不会被篡改... 当然，只有有大毅力，直接逆向hook，这些方法的安全性也就有待商榷了

事实上，从来就不存在不能被破解的软件，只有鸡肋，食之无味弃之可惜。让想破解者，花费的比他得到的要多。
