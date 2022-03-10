---
layout: post
title:  "Create your own offline Certificate Request for SCOM Off-Domain Server"
date:   '2021-12-29 12:03:42 -0500'
categories: troubleshooting guides operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/local-machine-certificate.png

summary: >- # this means to ignore newlines
  Generate a certificate request with an .inf file. This will allow you to specify all the settings that are required and give you more control over your certificate request.
  
keywords: certificate request, from scratch certificate request, how to create certificate request, how to make cert request, scom certificate request, certificate for scom, scom gateway certificate, scom agent certificate, scom workgroup certificate, how to create scom certificate, How to monitor untrusted servers in SCOM, How do I create a SCOM client certificate
permalink: /blog/request-offline-certificate-for-off-domain-server/
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
; CertificateTemplate="SystemCenterOperationsManager"

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

  > ### Note
  > The server where you run the above `Certreq` command will be where the Certificate Private Key will be stored.

Upload the above (IIS-2019-CertRequest.req) file to your Certificate Authority. \
... \
Once you receive back your signed certificate, import the Certificate into the Local Computer Personal Certificate Store:
```
certlm.msc
```

* Run this Powershell script to check the certificate you imported: \
[https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Start-SCOMCertificateChecker.ps1](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Start-SCOMCertificateChecker.ps1) \
 \
Run it like this:
  ```
  .\Start-SCOMCertificateChecker.ps1 -All
  ```
You can also copy/paste the script to an Powershell ISE (Running as Administrator), you just need to edit line [730](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Start-SCOMCertificateChecker.ps1#L730) to include the arguments you want to run.

On a side note. If you run the SCOM Certificate Checker script above and it shows an output that looks like this: \
![Certificate Checker Script Missing Private Key](/assets/img/posts/scom-cert-checker-missingkey.png){:class="img-fluid"}

You may also notice that the Private Key for the Certificate is missing: \
![Certificate Private Key Missing](/assets/img/posts/certificate-private-key-notpresent.png){:class="img-fluid"}

It is possible you may need to run the following command in an Administrator Command Prompt to restore the Keyspec and Private Key (replace the numbers & letters after __my__ with the serial number of your Certificate):
```
certutil -repairstore my 1f00000008c694dac94bcfdc4a000000000008
```

![certutil Repair Store - Command Output](/assets/img/posts/certutil-output.png){:class="img-fluid"}

After you run the `certutil` command above, you will notice the Certificate is now showing a Private Key (notice the key icon): \
![Certificate Private Key Present](/assets/img/posts/certificate-private-key-present.png){:class="img-fluid"}

You should now see this when you run the SCOM Certificate Checker Powershell Script: \
![Certificate Checker Script Successful](/assets/img/posts/scom-cert-checker-successful.png){:class="img-fluid"}

Now you just need to import the Certificate with MOMCertImport (located on the SCOM Installation Media): \
![MOMCertImport Location](/assets/img/posts/momcertimport-file.png){:class="img-fluid"}

Right Click and Run the Program as Administrator, select the certificate you imported: \
![Confirm Certificate in MOMCertImport](/assets/img/posts/momcertimport-certificate.png){:class="img-fluid"}

Lastly, you will need to restart the Microsoft Monitoring Agent (HealthService). You can do this via Powershell with this command:
```powershell
Restart-Service HealthService
```

After restarting the Microsoft Monitoring Agent (HealthService). You will wait until you see the following Event ID in the Operations Manager Event Log (20053) confirming that the certificate has been loaded:
```
Log Name: Operations Manager
Source: OpsMgr Connector
Date: 2/28/2022 10:35:36 AM
Event ID: 20053
Task Category: None
Level: Information
Keywords: Classic
User: N/A
Computer: IIS-2019.contoso.com
Description:
The OpsMgr Connector has loaded the specified authentication certificate successfully.
```

> **Don't forget the Management Server:** \
> The Management Server also needs to have a certificate requested for itself, and imported into the Personal Store in the Local Machine Certificates. Otherwise the communication between the Management Server and the Agent or Gateway Server will not work via certificates.

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/request-offline-certificate-for-off-domain-server/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.
-->
