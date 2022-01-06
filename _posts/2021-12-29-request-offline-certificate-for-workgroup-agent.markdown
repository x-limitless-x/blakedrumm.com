---
layout: post
title:  "Create your own offline Certificate Request for Workgroup Server"
date:   2021-12-29 12:03:42 -0500
categories: troubleshooting guides
author: blakedrumm
thumbnail: /assets/img/posts/local-machine-certificate.png
title: Create your own offline Certificate Request for SCOM Workgroup Server
summary: >- # this means to ignore newlines
  Generate a certificate request with an .inf file. This will allow you to specify all the settings that are required and make things easier.

keywords: certificate request, from scratch certificate request, how to make certificate request, how to make cert request
permalink: /blog/request-offline-certificate-for-workgroup-agent/
---
In the below example we are assuming your machine is named **IIS-2019**.

Create a new file on your machine and name it:
> IIS-2019-CertReq.inf

Edit the file to include something similar to the following:
```
[NewRequest]
Subject="CN=IIS-2019,OU=Servers,O=Support Team,L=Charlotte,S=North Carolina,C=US"
Exportable=TRUE ; Private key is exportable
KeyLength=2048
KeySpec=1 ; Key Exchange – Required for encryption
KeyUsage=0xf0 ; Digital Signature, Key Encipherment
MachineKeySet=TRUE

; Optionally include the Certificate Template
; [RequestAttributes]
; CertificateTemplate="OperationsManager"

[EnhancedKeyUsageExtension]
OID=1.3.6.1.5.5.7.3.1 ; Server Authentication
OID=1.3.6.1.5.5.7.3.2  ; Client Authentication

[Extensions]
2.5.29.17 = "{text}" ; SAN - Subject Alternative Name
_continue_ = "dns=IIS-2019.contoso.com&"
```
Open an Administrator Command Prompt and navigate to where you saved the above file. \
Run the following:
```
Certreq -New -f IIS-2019-CertReq.inf IIS-2019-CertRequest.req
```

Upload the above (IIS-2019-CertRequest.req) file to your Certificate Authority. \
... \
Once you receive back your signed certificate, import the Certificate into the Computer Certificate Store:
```
certlm.msc
```

* Run this script to check the certificate you imported: \
[https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Start-SCOMCertificateChecker.ps1](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Start-SCOMCertificateChecker.ps1) \
 \
Run it like this:
  ```
  .\Start-SCOMCertificateChecker.ps1 -All
  ```

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/request-offline-certificate-for-workgroup-agent)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.
-->
