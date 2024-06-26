---
layout: post
title:  "How to create a Certificate Template for Operations Manager"
date:   '2022-02-28 12:12:46 -0500'
categories: troubleshooting guides operationsManager certificates
author: blakedrumm
thumbnail: /assets/img/posts/certificate-authority-template-guide/certificate-authority.png
toc: true

summary: >- # this means to ignore newlines
  This is a guide on how to create your own certificate template for System Center Operations Manager on an Enterprise Certificate Authority server.

keywords: certificate template scom, certificate for scom, scom gateway certificate, scom agent certificate, scom workgroup certificate, how to create scom certificate, How to monitor untrusted servers in SCOM, How do I create a SCOM client certificate
permalink: /blog/create-operations-manager-certificate-template/
---
## Steps to Create Certificate Template
### Step 1
Open the Certificate Authority Tool: \
![Open the Certificate Authority Tool](/assets/img/posts/certificate-authority-template-guide/step-1.png){:class="img-fluid"}

### Step 2
Expand the tree on the left and Right Click on **Certificate Templates** and select **Manage**: \
![Open the Manage Certificate Templates Snap-In](/assets/img/posts/certificate-authority-template-guide/step-2.png){:class="img-fluid"}

### Step 3
Right Click on the **IPSec (Offline request)** template display name, and select Duplicate Template: \
![Select Duplicate Template on the IPSec (Offline request) template](/assets/img/posts/certificate-authority-template-guide/step-3.png){:class="img-fluid"}

### Step 4
Confirm the **Compatibility** tab: \
![Confirm Compatibility Tab](/assets/img/posts/certificate-authority-template-guide/step-4.png){:class="img-fluid"}

### Step 5
Confirm you have modified the following in the **General** tab:
 - **Template Display Name:** \
   `System Center Operations Manager`
 - **Validity period:** \
   `5 years` (change this per your security policy)
 - Check `Publish certificate in Active Directory`

![Confirm General Tab](/assets/img/posts/certificate-authority-template-guide/step-5.png){:class="img-fluid"}

### Step 6
Confirm you have modified the following in the **Request Handling** tab:
 - Check **Allow private key to be exportable** (this is required for Server Authentication)

![Confirm Request Handling Tab](/assets/img/posts/certificate-authority-template-guide/step-6.png){:class="img-fluid"}

### Step 7
Confirm you have modified the following in the **Cryptography** tab: 
  - Verify **Microsoft RSA SChannel Cryptographic Provider** is Checked
  - Under **Providers** Check **Microsoft Enhanced Cryptographic Provider v1.0** and move it to below **Microsoft RSA SChannel Cryptographic Provider**
  - Verify **Minimum key size** is set to `2048` or `1024` (2048 adds CPU overhead)

![Confirm Cryptography Tab](/assets/img/posts/certificate-authority-template-guide/step-7.png){:class="img-fluid"}

### Step 8
Confirm that **None** is selected for the **Key Attestation** tab: \
![Confirm Key Attestation Tab](/assets/img/posts/certificate-authority-template-guide/step-8.png){:class="img-fluid"}

### Step 9
Confirm you have modified the following in the **Extensions** tab: \
![Confirm Extensions Tab](/assets/img/posts/certificate-authority-template-guide/step-9.png){:class="img-fluid"}

  - Click on **Application Policies** and **Edit**
    - Remove **IP security IKE intermediate** \
    ![Confirm Extensions Tab - Application Policies Extension Removal](/assets/img/posts/certificate-authority-template-guide/step-9-1.png){:class="img-fluid"}
    - Add:
      - **Client Authentication**
      - **Server Authentication** \
    ![Confirm Extensions Tab - Application Policies Extension Adding](/assets/img/posts/certificate-authority-template-guide/step-9-2.png){:class="img-fluid"}
        - Click **OK**
  - Click on **Key Usage** and **Edit**
    - Confirm you have checked:
      -  **Make this extension critical**
      - Click **OK** \
    ![Confirm Extensions Tab - Key Usage Extension Adding](/assets/img/posts/certificate-authority-template-guide/step-9-3.png){:class="img-fluid"}

### Step 10
Confirm you have modified the following in the **Security** tab:
  - You can add multiple types of objects here: Users, Computers, Service Accounts, Groups, or Built-in security principals. \
  For simplicity I will keep the defaults and **only** add the following permissions on **Authenticated Users**:
    -  **Read**
    -  **Enroll** \
    ![Confirm Security Tab](/assets/img/posts/certificate-authority-template-guide/step-10.png){:class="img-fluid"}
      - Click **OK** to confirm / create the Certificate Template \
      ![Certificate Template Created](/assets/img/posts/certificate-authority-template-guide/step-10-1.png){:class="img-fluid"}

### Step 11
Close the certificate templates Console.
 - In the Certificate Authority tool, right click on **Certificate Templates**
   - Hover over **New** -> Select **Certificate Template to Issue** \
  ![Deploy with Certificate Template to Issue](/assets/img/posts/certificate-authority-template-guide/step-11.png){:class="img-fluid"}
   - Select the Certificate Template Display Name you created in Step 5: \
  ![Select Certificate Template you Created](/assets/img/posts/certificate-authority-template-guide/step-11-1.png){:class="img-fluid"}
     - Click **OK**

### Step 12
Verify you are seeing the Certificate Template on your Management Server.
  - Open Local Machine Certificate Store: `certlm.msc`
  - Open Personal -> Certificates
  - Right Click Certificates and hover over **All Tasks** -> Select **Request New Certificate...** \
  ![Select Request New Certificate on Management Server](/assets/img/posts/certificate-authority-template-guide/step-12.png){:class="img-fluid"}
    - Skip through the first screen
      - Click **Next**
    - Verify that you have selected **Active Directory Enrollment Policy**
      - Click **Next**
      <!-- ![Request Certificate from Management Server](/assets/img/posts/certificate-authority-template-guide/step-12.png){:class="img-fluid"} -->

    - Select the checkbox  next to the Certificate Template you created and click on the Warning sign below the Certificate Template, it says **click here to configure settings.** \
    ![Certificate Template showing up on Management Server](/assets/img/posts/certificate-authority-template-guide/step-12-1.png){:class="img-fluid"}

    - Example of how to configure the certificate to be used by a Management Server \
    ![Configure Certificate](/assets/img/posts/certificate-authority-template-guide/step-12-2.png){:class="img-fluid"}
      - Click **OK**

    - Click on **Enroll** \
    ![Configure Certificate](/assets/img/posts/certificate-authority-template-guide/step-12-3.png){:class="img-fluid"}

### Step 13
In order to use certificates with System Center Operations Manager you will need to generate / perform run the MOMCertImport tool on atleast one of the Management Servers, and any servers that will communicate via Certificates (DMZ servers, Workgroup Machines, etc.).
  - `MOMCertImport.exe` is located in your System Center Operations Manager Installation Media inside of `SupportTools\AMD64`.
    - Right Click on `MOMCertImport.exe` and select **Run as administrator**
      - Select the certificate you generated via the System Center Operations Manager Certificate Template.

### Step 14
Restart the Microsoft Monitoring Agent with the following Powershell Command:
```powershell
Restart-Service HealthService
```

After restarting the Microsoft Monitoring Agent (HealthService). You will wait until you see the following Event (**Event ID:** 20053) in the Operations Manager Event Log confirming that the certificate has been loaded:
```
Log Name: Operations Manager
Source: OpsMgr Connector
Date: 2/28/2022 10:35:36 AM
Event ID: 20053
Task Category: None
Level: Information
Keywords: Classic
User: N/A
Computer: MS01-2019.contoso.com
Description:
The OpsMgr Connector has loaded the specified authentication certificate successfully.
```

> ## :bangbang: Important
> You may experience issues when a certificate Re-enrolls automatically. Operations Manager needs the certificate to be imported with MOMCertImport.exe prior to being able to be used by SCOM. Unfortunately, there is not an automated method for SCOM Certificate Management.

> ## :notebook: Note
> You may experience issues with connectivity between the remote machine and the Management Server(s), verify you have checked these things:
> 1. Ensure all SPN’s are correctly registered for Management Servers, Operations Manager & Data Warehouse Databases, and services that are utilizing them.
> 2. Event ID `20071` and `21016` on Gateway point to Firewall, SPN, or Certificate issue in most cases.
> 3. Run the Gateway Approval Tool using the SDK (Data Access Service) account OR an account with high permission level (SysAdmin privileges) to Operations Manager SQL DB.
> 4. Verify you selected the appropriate certificate when you run MOMCertImport, check the certificate properties.
>     - You may also check the following registry path: `HKEY_LOCAL_MACHINE\Software\Microsoft\Microsoft OperationsManager\3.0\Machine Settings`
>       - Check the key: `ChannelCertificateSerialNumber` this is the serial number of the certificate you imported, reversed.
> 5. Verify that there are not any other certificates in the Local Machine Personal Store that have matching Subject Names.
> 6. Operations Manager only uses the first CN name in the Subject of the Certificate.
> 7. Cryptography API Key Storage Provider ([KSP](/windows/win32/secgloss/k-gly?redirectedfrom=MSDN#_security_key_storage_provider_gly)) is not supported for Operations Manager certificates.

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/create-operations-manager-certificate-template/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
