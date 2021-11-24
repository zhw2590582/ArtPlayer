---
title: Overview
sidebar_position: 1
slug: /
---

## Integration Guides

- Require confirmation from AWDA to implement to production after complete UAT for all services.

- You can use API tools to test some services during your development。

- You can check the response code or contact us when you have problems during the testing

- All services using POST method to send request（Including Inquiry）

- All requests and responses are JSON format. NOTE: Header Content-Type -> application/json UTF-8 encoding

- All requests require signature

## Document Change Control

| Version | Date       | Authors | Summary of changes   |
| ------- | ---------- | ------- | -------------------- |
| 1.0.0   | 2019.06.03 | ZHIBO   | Thumbnails image url |

## API Summary

| **Service name** | **Description** |
| -----------------| --------------- |
| user registration| <p>Provider : AWDA</p><p>User : Third party </p><p>Mandatory : YES</p><p>Description : All other services can be used only after user registration success</p>|
| Authorization list inquiry| <p>Provider : AWDA</p><p>User : Third party </p><p>Mandatory : NO</p><p>Description : Get the authorization list and check the authorization status</p>|
| Get the authorization detail page| <p>Provider : AWDA</p><p>User : Third party </p><p>Mandatory : NO</p><p>Description : Customer complete the authorization in the pages</p>
| Call back for authorization status| <p>Provider : AWDA</p><p>User : Third party </p><p>Mandatory : NO</p><p>Description : To receive the authorization status</p>|
| Bank card inquiry| <p>Provider : AWDA</p><p>User : Third party </p><p>Mandatory : YES</p><p>Description : To inquiry bank card status</p>|
| Get bank list| <p>Provider : AWDA</p><p>User : Third party </p><p>Mandatory : YES</p><p>Description : Get the bank list for bank card input</p>|
| Bank card verification| <p>Provider : AWDA</p><p>User : Third party </p><p>Mandatory : YES</p><p>Description : Verify and submit bank card</p>|
| Submit loan| <p>Provider : AWDA</p><p>User : Third party </p><p>Mandatory : YES</p><p>Description : Submit loan info, including (personal info, work info and emergency contact)</p> |
| Loan agreement inquiry| <p>Provider : AWDA</p><p>User : Third party </p><p>Mandatory : YES</p><p>Description : Get loan agreement</p>|
| Sign agreement| <p>Provider : AWDA</p><p>User : Third party </p><p>Mandatory : YES</p><p>Description : Sign agreement (Confirm disbursement)</p>|
| Get loan information| <p>Provider : AWDA</p><p>User : Third party </p><p>Mandatory : YES</p><p>Description : Get loan info based on loan number (include repayment schedule if disbursed)</p> |
| Get repayment VA| <p>Provider : AWDA</p><p>User : Third party </p><p>Mandatory : YES</p><p>Description : Get the repayment VA</p>|
| Push notification| <p>Provider: Third party </p><p>User : AWDA</p><p>Mandatory: NO</p><p>Description : Push the loan status update to Third party </p>|
| Eligible Check| <p>Provider : AWDA</p><p>User : Third party </p><p>Mandatory : YES</p><p>Description : Verify Customer</p>|
| Get the token for uploading image| <p>Provider : AWDA</p><p>User : Third party </p><p>Mandatory : NO</p><p>Description : To get the token which used for api Upload Image (1)</p>|
| Upload Image (1)| <p>Provider : AWDA</p><p>User : Third party </p><p>Mandatory : NO</p><p>Description : By sending file stream with token</p>|
| Upload Image (2)| <p>Provider : AWDA</p><p>User : Third party </p><p>Mandatory : NO</p><p>Description : By sending base64 or url format</p>|
| Get the redirect url<br/>(For H5 pages of Digital Signature, Loan detail and Repayment detail) | <p>Provider : AWDA</p><p>User : Third party </p><p>Mandatory : NO</p><p>Description : Redirect to the specific H5 pages</p>|

## Environment information

- Testing environment：`https://sea-staging.wolaidai.com`
- Production environment：`https://japi.maucash.id`
- Note: All APIs URL will be environment `url` + `service url`

## List Of Response Code

| Code|Description| 
| ----|----|
| 0	  | Success| 
| 1000| System is busy| 
| 1001| Repeat request| 
| 1002| Unvalid token| 
| 1003| Timestamp error or expired (only valid within 60s)| 
| 1004| Signature error| 
| 1005| appId invalid| 
| 1006| Parameters cannot be empty| 
| 1007| Parameters error| 
| 1008| User already existed| 
| 1009| User not found| 
| 1010| Loan not found| 
| 1012| Authorization info not found| 