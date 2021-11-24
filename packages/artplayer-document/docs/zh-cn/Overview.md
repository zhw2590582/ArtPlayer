---
title: 前言
sidebar_position: 1
slug: /zh-cn
---

## 必读

- 在生产环境发布前前，请先通过测试环境调试完所有接口及流程后待我方确认无误方可上生产环境

- 在开发过程中，可以使用接口调试工具来在线调试某些接口。

- 在开发出现问题时，可以通过接口调用的返回码查看失败原因或联系我方技术支持人员

- 所有接口都采用POST方式（包括查询接口）

- 请求和响应的数据都为JSON格式。注：请设置Header的Content-Type为application/json，采用UTF-8字符编码

- 所有的接口必须进行接口签名

## 更新日志

| 版本 | 日期 | 项目负责人 | 描述   |
| ------- | ---------- | ------- | ------- |
| 1.0.0   | 2019.06.03 | 吕志博   | 初始版本 |

## 接口说明

| **接口名称** | **描述** |
| -----------------| --------------- |
| user registration| <p>接口提供方: AWDA</p><p>接口调用方 : 合作方 </p><p>是否必须对接 : 是</p><p>接口描述 : 用户创建，必须先创建用户成功后才能调用其他接口</p>|
| Authorization list inquiry| <p>接口提供方: AWDA</p><p>接口调用方 : 合作方 </p><p>是否必须对接 : 否</p><p>接口描述 : 获取授权列表及用户个人授权状态</p>|
| Get the authorization detail page| <p>接口提供方: AWDA</p><p>接口调用方 : 合作方 </p><p>是否必须对接 : 否</p><p>接口描述 : 授权第三方授权页面地址</p>
| Call back for authorization status| <p>接口提供方: AWDA</p><p>接口调用方 : 合作方 </p><p>是否必须对接 : 否</p><p>接口描述 : 通知授权结果</p>|
| Bank card inquiry| <p>接口提供方: AWDA</p><p>接口调用方 : 合作方 </p><p>是否必须对接 : 是</p><p>接口描述 : 查询绑卡信息</p>|
| Get bank list| <p>接口提供方: AWDA</p><p>接口调用方 : 合作方 </p><p>是否必须对接 : 是</p><p>接口描述 : 获取支持绑卡的银行列表</p>|
| Bank card verification| <p>接口提供方: AWDA</p><p>接口调用方 : 合作方 </p><p>是否必须对接 : 是</p><p>接口描述 : 用户绑定用于接收平台放款的银行卡</p>|
| Submit loan| <p>接口提供方: AWDA</p><p>接口调用方 : 合作方 </p><p>是否必须对接 : 是</p><p>接口描述 : 提交进件信息，进件信息包含（用户个人信息、身份信息、工作信息、紧急联系人信息）</p> |
| Loan agreement inquiry| <p>接口提供方: AWDA</p><p>接口调用方 : 合作方 </p><p>是否必须对接 : 是</p><p>接口描述 : 查看贷款合同</p>|
| Sign agreement| <p>接口提供方: AWDA</p><p>接口调用方 : 合作方 </p><p>是否必须对接 : 是</p><p>接口描述 : 合同签约（确认放款）</p>|
| Get loan information| <p>接口提供方: AWDA</p><p>接口调用方 : 合作方 </p><p>是否必须对接 : 是</p><p>接口描述 : 根据贷款编号查询贷款当前信息（如已放款则包含还款计划）</p> |
| Get repayment VA| <p>接口提供方: AWDA</p><p>接口调用方 : 合作方 </p><p>是否必须对接 : 是</p><p>接口描述 : 用户还款虚拟账号查询</p>|
| Push notification| <p>Provider: Third party </p><p>User : AWDA</p><p>是否必须对接: 否</p><p>接口描述 : 推送贷款状态变更消息</p>|
| Eligible Check| <p>接口提供方: AWDA</p><p>接口调用方 : 合作方 </p><p>是否必须对接 : 是</p><p>接口描述 : Verify Customer</p>|
| Get the token for uploading image| <p>接口提供方: AWDA</p><p>接口调用方 : 合作方 </p><p>是否必须对接 : 否</p><p>接口描述 : To get the token which used for api Upload Image (1)</p>|
| Upload Image (1)| <p>接口提供方: AWDA</p><p>接口调用方 : 合作方 </p><p>是否必须对接 : 否</p><p>接口描述 : By sending file stream with token</p>|
| Upload Image (2)| <p>接口提供方: AWDA</p><p>接口调用方 : 合作方 </p><p>是否必须对接 : 否</p><p>接口描述 : By sending base64 or url format</p>|
| Get the redirect url<br/>(For H5 pages of Digital Signature, Loan detail and Repayment detail) | <p>接口提供方: AWDA</p><p>接口调用方 : 合作方 </p><p>是否必须对接 : 否</p><p>接口描述 : Redirect to the specific H5 pages</p>|

## 环境地址说明

测试环境域名：`https://sea-staging.wolaidai.com`

生产环境域名：`https://japi.maucash.id`

注：所有接口调用真实地址为 `环境域名+接口地址`

## 全局状态码说明

| 返回码| 描述| 
| ----|----|
| 0	|请求成功| 
| 100| 	系统繁忙| 
| 300| 	请求超时| 
| 400| 	参数错误| 
| 404| 	网络异常| 
| 600| 	数据不存在| 
| 999| 	其他未知错误| 
| 1001| 重复请求| 
| 1002| 无效的token| 
| 1003| 时间戳有误或已失效（仅处理60S内的请求）| 
| 1004| 签名校验不通过| 
| 1005| 商户号错误| 
| 1006| 参数不能为空| 
| 1007| 参数有误| 
| 1008| 用户已存在| 
| 1009| 用户不存在| 
| 1010| 订单不存在| 
| 1011| 系统繁忙| 
| 1012| 授权信息获取失败| 