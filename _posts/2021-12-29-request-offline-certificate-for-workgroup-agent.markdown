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
You can also copy/paste the script to an Powershell ISE (Running as Administrator), you just need to edit line [1103](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/blob/master/Powershell/Start-SCOMCertificateChecker.ps1#L1103) to include the arguments you want to run.

On a side note. If you run the SCOM Certificate Checker script above and it shows an output that looks like this: \
![Certificate Checker Script Missing Private Key](/assets/img/posts/scom-cert-checker-missingkey.png)

You may also notice that the Private Key for the Certificate is missing: \
![Certificate Private Key Missing](/assets/img/posts/certificate-private-key-notpresent.png)

It is possible you may need to run the following command in an Administrator Command Prompt to restore the Keyspec and Private Key (replace the numbers & letters after __my__ with the serial number of your Certificate):
```
certutil -repairstore my 1f00000008c694dac94bcfdc4a000000000008
```

![certutil Repair Store - Command Output](/assets/img/posts/certutil-output.png)

After you run the `certutil` command above, you will notice the Certificate is now showing a Private Key (notice the key icon): \
![Certificate Private Key Present](/assets/img/posts/certificate-private-key-present.png)

You should now see this when you run the SCOM Certificate Checker Powershell Script: \
![Certificate Checker Script Successful](/assets/img/posts/scom-cert-checker-successful.png)

Now you just need to import the Certificate with MOMCertImport (located on the SCOM Installation Media): \
![MOMCertImport Location](/assets/img/posts/momcertimport-file.png)

Right Click and Run the Program as Administrator, select the certificate you imported: \
![Confirm Certificate in MOMCertImport](/assets/img/posts/momcertimport-certificate.png)

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/request-offline-certificate-for-workgroup-agent)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.
-->
