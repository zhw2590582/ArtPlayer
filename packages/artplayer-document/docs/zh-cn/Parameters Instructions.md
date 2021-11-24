---
title: 入参及出参说明
sidebar_position: 3
---

### API请求参数说明

:::note
注：所有的API接口都包含如下参数（不同的接口只是参数body值不一样），以下具体接口只针对body进行描述若接口，当没有业务参数的时候, body需要赋值为空字符串,即body: ""
:::

| 参数名称  | 描述            | 类型   | 必填 | 备注                 |
| --------- | --------------- | ------ | ---- | -------------------- |
| body      | 业务参数        | Object | 否   | 具体接口决定是否必传 |
| timestamp | 时间戳          | Long   | 是   | 精确到秒             |
| appId     | 平台分配的appId | String | 是   |
| v         | 接口版本号      | String | 否   | 默认1.0              |
| signature | 签名            | String | 是   | 见签名生成           |

例: 

```json
{
    "body": "1111",
    "timestamp": 1488363493,
    "signature": "B3C14758F4AF52AE8AA0D4CD1493B137",
    "appId": "111",
    "v":"1.0"
}
```

### 接口签名规则

签名生成的通用步骤如下：

- 第一步：将参与签名的参数按照键值(key)进行字典排序
- 第二步：将排序过后的参数，进行key和value字符串拼接
- 第三步：将拼接后的字符串末尾加上secret秘钥，合成签名字符串
- 第四步：对签名字符串进行MD5加密，生成32位的字符串转换为大写

### 签名生成过程

第一步：将参与签名的参数按照键值(key)进行字典排序

例如：将上述请求参数中的body、timestamp、appId、v 进行字典排序。结果为：appId、body、timestamp (精确到秒)、v

第二步：将排序过后的参数，进行key和value字符串拼接

将参数中的key和value按照key的顺序进行字符串拼接。若body为对象的话转成JSON字符串进行签名即可

例：appId:123456body:{"orderNo":"1234567"}timestamp:1558923813v:1.0

第三步：将拼接后的字符串尾部加上secret秘钥，合成签名字符串

将第二步的字符窜首尾拼接上secret。结果为：appId:123456body:{"orderNo":"1234567"}timestamp:1558923813v:1.0yousecret

第四步：对签名字符串进行MD5加密，生成32位的字符串,并转换大写

对生成签名字符串进行MD5加密。结果为：B6F6E3F9ADF4D7558F54BC8B7D9869CC

### Java 签名代码

```java
String[] keys = new String[map.size()];
int i = 0;
for (Map.Entry<String, Object> entry : map.entrySet()) {
    keys[i++] = entry.getKey();
}
Arrays.sort(keys);
StringBuilder stringBuilder = new StringBuilder();
for (String key : keys) {
    stringBuilder.append(key);
    stringBuilder.append(":");
    stringBuilder.append(map.get(key));
}
stringBuilder.append(secret);
String str=stringBuilder.toString();
String encodeStr = DigestUtils.md5Hex(str).toUpperCase();
return encodeStr ;
```

### API响应结果说明

| 参数名称 | 描述     | 类型    | 必填 | 备注                                                |
| -------- | -------- | ------- | ---- | --------------------------------------------------- |
| code     | 状态码   | Integer | 是   | <p>0：执行成功</p><p>其他编码均为失败，详见码表</p> |
| message  | 状态描述 | String  | 是   | 用于描述code                                        |
| result   | 详细信息 | Object  | 否   | 当code为0时 result为返回的业务数据。                |

正确响应的JSON  - 例：

```json
{
  "code": 0,
  "message": "Permintaan berhasil",
  "result": {
    "state": true
  }
}
```