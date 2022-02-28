---
layout: post
title:  "How to create a Certificate Template for Operations Manager in the Certificate Authority"
date:   '2022-02-28 12:12:46 -0500'
categories: troubleshooting guides operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/certificate-authority-template-guide/certificate-authority.png
image: {{ post.thumbnail }}
summary: >- # this means to ignore newlines
  This is a guide on how to create your own certificate template for System Center Operations Manager on the Certificate Authority server.

description: {{ post.summary }}

keywords: certificate template scom, certificate for scom, scom gateway certificate, scom agent certificate, scom workgroup certificate, how to create scom certificate, How to monitor untrusted servers in SCOM, How do I create a SCOM client certificate
permalink: /blog/create-operations-manager-certificate-template/
---
# Steps to Create Certificate Template
## Step 1
Open the Certificate Authority Tool: \
![Open the Certificate Authority Tool](/assets/img/posts/certificate-authority-template-guide/step-1.png){:class="img-fluid"}

## Step 2
Expand the tree on the left and Right Click on **Certificate Templates** and select **Manage**: \
![Open the Manage Certificate Templates Snap-In](/assets/img/posts/certificate-authority-template-guide/step-2.png){:class="img-fluid"}

## Step 3
Right Click on the **IPSec (Offline request)** template display name, and select Duplicate Template: \
![Select Duplicate Template on the IPSec (Offline request) template](/assets/img/posts/certificate-authority-template-guide/step-3.png){:class="img-fluid"}

## Step 4
Confirm the **Compatibility** tab: \
![Confirm Compatibility Tab](/assets/img/posts/certificate-authority-template-guide/step-4.png){:class="img-fluid"}

## Step 5
Confirm you have modified the following in the **General** Tab:
 - **Template Display Name:** \
   `System Center Operations Manager`
 - **Validity period:** \
   `5 years` (change this per your security policy)
 - Check `Publish certificate in Active Directory`

![Confirm General Tab](/assets/img/posts/certificate-authority-template-guide/step-5.png){:class="img-fluid"}

## Step 6
Confirm you have modified the following in the **Request Handling Tab**:
 - Check **Allow private key to be exportable**

![Confirm Request Handling Tab](/assets/img/posts/certificate-authority-template-guide/step-6.png){:class="img-fluid"}

## Step 7
Confirm you have modified the following in the **Cryptography Tab**: 
  - Under **Providers** Check **Microsoft Enhanced Cryptographic Provider v1.0** and move it to below **Microsoft RSA SChannel Cryptographic Provider**
  - Verify **Minimum key size** is set to `2048`

![Confirm Cryptography Tab](/assets/img/posts/certificate-authority-template-guide/step-7.png){:class="img-fluid"}

## Step 8
Confirm that **None** is selected for the **Key Attestation Tab**: \
![Confirm Key Attestation Tab](/assets/img/posts/certificate-authority-template-guide/step-8.png){:class="img-fluid"}

## Step 9
Confirm you have modified the following in the **Extensions Tab**:
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

## Step 10
Confirm you have modified the following in the **Security Tab**:
  - You can add multiple types of objects here: Users, Computers, Service Accounts, Groups, or Built-in security principals. \
  For simplicity I will keep the defaults and **only** add the following permissions on **Authenticated Users**:
    -  **Read**
    -  **Enroll** \
    ![Confirm Security Tab](/assets/img/posts/certificate-authority-template-guide/step-10.png){:class="img-fluid"}
      - Click **OK** to confirm / create the Certificate Template \
      ![Certificate Template Created](/assets/img/posts/certificate-authority-template-guide/step-10-1.png){:class="img-fluid"}

## Step 11
Close the certificate templates Console.
 - In the Certificate Authority tool, right click on **Certificate Templates**
   - Hover over **New** -> Select **Certificate Template to Issue**
  ![Deploy with Certificate Template to Issue](/assets/img/posts/certificate-authority-template-guide/step-11.png){:class="img-fluid"}
   - Select the Certificate Template Display Name you created in Step 5:
  ![Select Certificate Template you Created](/assets/img/posts/certificate-authority-template-guide/step-11-1.png){:class="img-fluid"}
     - Click **OK**

# Step 12
Verify you are seeing the Certificate Template on your Management Server.
  - Open Local Machine Certificate Store: `certlm.msc`
  - Open Personal -> Certificates
  - Right Click Certificates and hover over **All Tasks** -> Select **Request New Certificate...**
  ![Select Request New Certificate on Management Server](/assets/img/posts/certificate-authority-template-guide/step-12.png){:class="img-fluid"}
    - Skip through the first screen
      - Click **Next**
    - Verify that you have selected **Active Directory Enrollment Policy**
      - Click **Next**
    - Select the checkbox  next to the Certificate Template you created and click on the Warning sign below the Certificate Template, it says **click here to configure settings.**
    ![Request Certificate from Management Server](/assets/img/posts/certificate-authority-template-guide/step-12.png){:class="img-fluid"}

    - You will notice that the Management Server can see the Certificate Template \
    ![Certificate Template showing up on Management Server](/assets/img/posts/certificate-authority-template-guide/step-12-1.png){:class="img-fluid"}

    - Example of how to configure the certificate to be used by a Management Server \
    ![Configure Certificate](/assets/img/posts/certificate-authority-template-guide/step-12-2.png){:class="img-fluid"}
      - Click **OK**

    - Click on **Enroll** \
    ![Configure Certificate](/assets/img/posts/certificate-authority-template-guide/step-12-3.png){:class="img-fluid"}

## Step 13
In order to use certificates with System Center Operations Manager you will need to generate / perform run the MOMCertImport tool on atleast one of the Management Servers, and any servers that will communicate via Certificates (DMZ servers, Workgroup Machines, etc.).
  - `MOMCertImport.exe` is located in your System Center Operations Manager Installation Media inside of `SupportTools\AMD64`.
    - Right Click on `MOMCertImport.exe` and select **Run as administrator**
      - Select the certificate you generated via the System Center Operations Manager Certificate Template.

## Step 14
Restart the Microsoft Monitoring Agent with the following Powershell Command:
```powershell
Restart-Service HealthService -Force
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
Computer: IIS-2019.contoso.com
Description:
The OpsMgr Connector has loaded the specified authentication certificate successfully.
```

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/create-operations-manager-certificate-template/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.
-->
