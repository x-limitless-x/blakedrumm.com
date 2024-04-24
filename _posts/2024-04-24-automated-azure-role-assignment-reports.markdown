---
layout: post
title:  "Automated Azure Role Assignment Reports via Email - Azure Automation"
date:   '2024-04-23 22:28:02 -0500'
categories: azure powershell guides
author: blakedrumm
thumbnail: /assets/img/posts/azure-role-assignments-email.png
toc: true

summary: >-
  Managing Azure role assignments can be complex. This PowerShell script simplifies the process by generating detailed reports on Azure users, groups, and roles and automatically emailing these reports.

keywords: azure, powershell, email report, azure automation, azure roles, azure groups, azure users
permalink: /blog/azure-automation-automated-azure-role-assignment-reports/
---

## :book: Introduction
Azure cloud services management often requires monitoring and auditing user roles and group memberships. This script automates the generation and email distribution of detailed Azure subscription role assignments. It utilizes managed identity for Azure login, fetches role assignments, and compiles them into a comprehensive report sent via email.

## How to get it
You can download the script from the following links:
- [Get-AzRoleAssignmentReport.ps1](https://gist.github.com/blakedrumm/8f73e82f78b675bea2968117b70fd83e) :arrow_left: **Direct Download Link**
- [Personal File Server - Get-AzRoleAssignmentReport.ps1](https://files.blakedrumm.com/Get-AzRoleAssignmentReport.ps1) :arrow_left: **Alternative Download Link**
- [Personal File Server - Get-AzRoleAssignmentReport.txt](https://files.blakedrumm.com/Get-AzRoleAssignmentReport.txt) :arrow_left: **Text Format Alternative Download Link**

## :classical_building: Argument List

| Parameter       | Alias | ValueFromPipeline | Type   | Description                                                                                                                                                                |
|-----------------|-------|-------------------|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| EmailUsername   |       |                   | String | The username used to authenticate with the SMTP server.                                                                                                                    |
| EmailPassword   |       |                   | SecureString | The secure password used for SMTP authentication.                                                                                                                    |
| From            |       |                   | String | The email address from which the report will be sent.                                                                                                                      |
| To              |       |                   | Array  | Array of recipient email addresses to whom the report will be sent.                                                                                                        |
| Cc              |       |                   | Array  | Array of CC recipient email addresses.                                                                                                                                     |
| Subject         |       |                   | String | The subject line of the email.                                                                                                                                             |
| Body            |       |                   | String | The body text of the email, describing the contents of the report. Can be HTML or plain text.                                                                              |
| SMTPServer      |       |                   | String | The SMTP server used for sending the email.                                                                                                                                |
| SubscriptionIds |       |                   | Array  | Array of Azure subscription IDs to be included in the report.                                                                                                              |
| WhatIf          |       |                   | Switch | A switch to simulate the script execution for testing purposes without performing any actual operations.                                                                   |

## :key: Configuring Permissions for Managed Identity

To enable the PowerShell script to retrieve detailed user information, such as ObjectType and DisplayName from Azure Active Directory, the UserManagedIdentity needs the "Directory Readers" permission. This role-based access control (RBAC) is assigned at the Microsoft Entra ID level (formerly known as Azure Active Directory), not at the subscription level. Follow these steps to assign this permission:

1. **Identify the Object ID:**
   a. **System Assigned Identity**
     - Navigate to your Azure Automation Account -> Identity, Select System assigned tab. Copy the Object ID of the System Assigned identity.
     ![Copy the System assigned Identity Object ID](/assets/img/posts/system-assigned-identity.png)

   b. **User Assigned Identity**
     - Navigate to your Azure Automation Account -> Identity, Select User assigned tab. Click on the name of the user assigned identity you want to gather the id from. Copy the Object ID of the System Assigned identity.
     ![Copy the System assigned Identity Object ID](/assets/img/posts/user-assigned-identity.png) \
     ![Gather the Object ID from the User Managed Identity](/assets/img/posts/user-assigned-identity-object-id.png)

2. **Set Azure role assignments**
   - Select **Azure role assignments**
   - Select **Add role assignment**
   - Set the scope to: **Subscription**
   - Select the subscription.
   - Set the role to (use what your company allows here, this is just what I used in my testing): **Reader** \
     ![Subscription reader RBAC permission](/assets/img/posts/add-role-assignments-subscription-reader.png)

3. **Assign the Role:**
   - Open Microsoft Entra Id -> Roles and Administrators. \
     [Link to ](https://portal.azure.com/#view/Microsoft_AAD_IAM/RolesManagementMenuBlade/~/AllRoles/adminUnitObjectId//resourceScope/)
   - In the roles list, find and click on "Directory Readers". \
     ![Where to click for Add assignments](/assets/img/posts/add-directory-reader-assignment.png)
   - Click "+ Add Assignments" to start the role assignment process.

4. **Add Managed Identity to Role:**
   - In the assignment interface, you might not see app registrations or managed identities by default.
   - Paste the Object ID (from step 1) into the search field. This should display the name and ID of your Azure Automation Account.
   - Select your account and confirm the assignment. \
     ![How to add a object id for assignment](/assets/img/posts/add-directory-reader-assignment-object-id.png)

5. **Verify Permissions:**
   - Once the "Directory Readers" permission is assigned, the script will be able to pull the Object Type and DisplayName along with other outputs from `Get-AzRoleAssignment`.

**This configuration is essential for the script to function correctly and securely access the necessary Azure AD data!**

## :page_with_curl: How to use it
>#### Example 1
>Generate and email an Azure roles report for specified subscriptions:
>```powershell
>.\Get-AzRoleAssignmentReport.ps1 -EmailUsername 'admin@example.com' -EmailPassword (ConvertTo-SecureString 'Secure123' -AsPlainText -Force) -SMTPServer 'smtp.example.com' -From 'noreply@example.com' -To 'user1@example.com','user2@example.com' -Cc 'manager@example.com' -Subject 'Monthly Azure Report' -Body 'Attached is the monthly Azure usage report.' -SubscriptionIds 'sub1','sub2'
>```
>#### Example 2
>Generate a report and email with custom HTML content in the body:
>```powershell
>$SecurePwd = ConvertTo-SecureString 'YourSecurePassword' -AsPlainText -Force
>.\Get-AzRoleAssignmentReport.ps1 -EmailUsername 'admin@example.com' -EmailPassword $SecurePwd -From 'report@example.com' -To 'team@example.com' -Subject 'Detailed Azure Report' -Body '<html><body><h1>Azure Report</h1><p>Please check the attached detailed report.</p></body></html>' -SMTPServer 'smtp.example.com' -SubscriptionIds 'sub1','sub2','sub3'
>```
>#### Example 3
>Run the script in WhatIf mode to simulate the process without sending emails:
>```powershell
>.\Get-AzRoleAssignmentReport.ps1 -WhatIf
>```

Leave some feedback if this helped you! :v:

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/azure-automation-automated-azure-role-assignment-reports/)
