---
title: Parameters Instructions
sidebar_position: 3
---

### Instructions for API request parameters

:::note
NOTE: The following parameters is included in all services (different values). If no parameters for body then pass blank, like body:””
:::

| Name|Description|Type|Mandatory|Notes|
| ----|----|----|----|----|
| body|Business parameters|Object|N|Some APIs may require body|
| timestamp|Timestamp|Long|Y|Accurate into a second|
| appId|Apply from AWDA|String|Y|
| v|Version code|String|N|Default 1.0|
| signature|Signature|String|Y|All requests need signature|

example: 

```json
{
    "body": "1111",
    "timestamp": 1488363493,
    "signature": "B3C14758F4AF52AE8AA0D4CD1493B137",
    "appId": "111",
    "v":"1.0"
}
```

### Rules for signature

Rules for signature：

- Step 1：Sort the parameters alphabetically by key name. Result will be: appId、body、timestamp、v
- Step 2：Combine key and value of all the parameters. Result will be: appId:123456body:{"orderNo":"1234567"}timestamp:1558923813v:1.0
- Step 3：Add secret to the last of the result from step 2, which will become the signature. Result will be: appId:123456body:{"orderNo":"1234567"}timestamp:1558923813v:1.0yoursecret
- Step 4：MD5 encryption of the signature string. Result will be: `B6F6E3F9ADF4D7558F54BC8B7D9869CC`


### Java Sample Codes for Signature

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

### API Response

| Parameters|DescriptionType|Mandatory|Notes| 
| ----|----|----|----|----|
| code|Status code|Integer|Y|<p>0: Success</p><p>Other codes all represent failure, find more details in Code List</p>| 
| message|Status description|String|Y|Code description| 
| result|Return data|Object|N|When code=0, there will be business data returned inside result object| 

### Sample response for success request:

```json
{
  "code": 0,
  "message": "Permintaan berhasil",
  "result": {
    "state": true
  }
}
```