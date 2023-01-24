---
layout: post
title:  "SCOM SDK Crashing - Cannot Generate SSPI Context"
date:   '2023-01-24 16:17:10 -0500'
categories: troubleshooting guides operationsManager
author: blakedrumm
thumbnail: /assets/img/scom-agent-esent-error.png
toc: true

summary: >- # this means to ignore newlines
  This article shows how to resolve an issue my customer experienced for SCOM SDK crashing due to being unable to generate SSPI context. The customer was running SCOM 2022.

keywords: scom sspi context, scom sdk crashing, scom console error, scom 2022 sdk crashing, opsmgr sdk crash
permalink: /blog/cannot-generate-sspi-context/
---

## :book: Introduction
I had a case recently for a customer that is having issues when opening the SCOM Console. Ultimately this was due to the SCOM SDK Service crashing, with the following Event in the Operations Manager Event Log:
```
Log Name:      Operations Manager
Source:        OpsMgr Management Configuration
Date:          1/24/2023 12:11:06 PM
Event ID:      29112
Task Category: None
Level:         Error
User:          N/A
Computer:      MS01.contoso.com
Description:
OpsMgr Management Configuration Service failed to execute bootstrap work item 'ConfigurationDataProviderInitializeWorkItem' due to the following exception



System.Data.SqlClient.SqlException (0x80131904): The target principal name is incorrect.  Cannot generate SSPI context.
   at System.Data.SqlClient.SqlInternalConnectionTds..ctor(DbConnectionPoolIdentity identity, SqlConnectionString connectionOptions, SqlCredential credential, Object providerInfo, String newPassword, SecureString newSecurePassword, Boolean redirectedUserInstance, SqlConnectionString userConnectionOptions, SessionData reconnectSessionData, DbConnectionPool pool, String accessToken, Boolean applyTransientFaultHandling, SqlAuthenticationProviderManager sqlAuthProviderManager)
   at System.Data.SqlClient.SqlConnectionFactory.CreateConnection(DbConnectionOptions options, DbConnectionPoolKey poolKey, Object poolGroupProviderInfo, DbConnectionPool pool, DbConnection owningConnection, DbConnectionOptions userOptions)
   at System.Data.ProviderBase.DbConnectionFactory.CreatePooledConnection(DbConnectionPool pool, DbConnection owningObject, DbConnectionOptions options, DbConnectionPoolKey poolKey, DbConnectionOptions userOptions)
   at System.Data.ProviderBase.DbConnectionPool.CreateObject(DbConnection owningObject, DbConnectionOptions userOptions, DbConnectionInternal oldConnection)
   at System.Data.ProviderBase.DbConnectionPool.UserCreateRequest(DbConnection owningObject, DbConnectionOptions userOptions, DbConnectionInternal oldConnection)
   at System.Data.ProviderBase.DbConnectionPool.TryGetConnection(DbConnection owningObject, UInt32 waitForMultipleObjectsTimeout, Boolean allowCreate, Boolean onlyOneCheckConnection, DbConnectionOptions userOptions, DbConnectionInternal& connection)
   at System.Data.ProviderBase.DbConnectionPool.TryGetConnection(DbConnection owningObject, TaskCompletionSource`1 retry, DbConnectionOptions userOptions, DbConnectionInternal& connection)
   at System.Data.ProviderBase.DbConnectionFactory.TryGetConnection(DbConnection owningConnection, TaskCompletionSource`1 retry, DbConnectionOptions userOptions, DbConnectionInternal oldConnection, DbConnectionInternal& connection)
   at System.Data.ProviderBase.DbConnectionInternal.TryOpenConnectionInternal(DbConnection outerConnection, DbConnectionFactory connectionFactory, TaskCompletionSource`1 retry, DbConnectionOptions userOptions)
   at System.Data.SqlClient.SqlConnection.TryOpenInner(TaskCompletionSource`1 retry)
   at System.Data.SqlClient.SqlConnection.TryOpen(TaskCompletionSource`1 retry)
   at System.Data.SqlClient.SqlConnection.Open()
   at Microsoft.EnterpriseManagement.ManagementConfiguration.DataAccessLayer.ConnectionManagementOperation.Execute()
   at Microsoft.EnterpriseManagement.ManagementConfiguration.DataAccessLayer.DataAccessOperation.ExecuteSynchronously(Int32 timeoutSeconds, WaitHandle stopWaitHandle)
   at Microsoft.EnterpriseManagement.ManagementConfiguration.CmdbOperations.CmdbDataProvider.Initialize()
   at Microsoft.EnterpriseManagement.ManagementConfiguration.Engine.ConfigurationDataProviderInitializeWorkItem.ExecuteWorkItem()
   at Microsoft.EnterpriseManagement.ManagementConfiguration.Interop.ConfigServiceEngineWorkItem.Execute()
ClientConnectionId:c0z7eb24-124d-46ed-xe78-36q2ba9f7949
```

## :page_with_curl: How to fix
In order to resolve this issue for my customer, we had to verify the user account running the Operations Manager SDK Service has AES Attributes enabled. Navigate to the user object in Active Directory and verify that the Account options have the following:

 - Check This account supports Kerberos AES 128 bit encryption.
 - Check This account supports Kerberos AES 256 bit encryption.

![Attributes for SCOM Account](/assets/img/posts/attributes-domain-controller.png)

We were no longer having an issue with the SDK Service crashing after this change.

Relevant Article: [https://learn.microsoft.com/system-center/scom/install-with-rc4-disabled#configure-the-encryption-types-allowed-for-kerberos](https://learn.microsoft.com/system-center/scom/install-with-rc4-disabled#configure-the-encryption-types-allowed-for-kerberos)

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/cannot-generate-sspi-context/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
