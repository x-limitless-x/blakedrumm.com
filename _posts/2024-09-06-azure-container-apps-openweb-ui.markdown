---
layout: post
title:  "Setup OpenWeb UI AI Webpage - Azure Container Apps"
date:   '2024-09-07 22:35:08 -0500'
categories: azure guides containerapps
author: blakedrumm
thumbnail: /assets/img/posts/openweb-ui-logged-in.png
toc: true

summary: 'Learn how to deploy an OpenWeb UI AI webpage using Azure Container Apps. We’ll explore the architecture’s limitations regarding scaling, discuss cost-effective hosting options, and compare Azure Container Apps to Kubernetes.'

keywords: azure, container apps, openweb ui, automation, ai, hosting, azure files, kubernetes
permalink: /blog/azure-container-apps-openweb-ui/
---

## :bulb: Introduction

Deploying OpenWeb UI on Azure allows you to host an interactive AI webpage. However, due to OpenWeb UI's architecture—where both the frontend and backend are housed in a single container—scalability is limited. This guide will walk you through setting up OpenWeb UI using Azure Container Apps, discuss its limitations regarding scaling, and compare this solution to using Kubernetes.

## :hammer: Prerequisites

Before starting, make sure you have the following:

- **Azure Account**: An active Azure subscription with permissions to create new resources.
- **OpenWeb UI Container Image**: The container image from GitHub Container Registry (`ghcr.io/open-webui/open-webui:main`).
- **OpenAI API Key**: [Optional] In order to utilize OpenAI in OpenWeb UI, you will need an OpenAI API Key. [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

## :rocket: Setting Up OpenWeb UI with Azure Container Apps

### Step-by-Step Guide (Portal)

#### 1. **Access the Azure Portal**
Log in to [Azure Portal](https://portal.azure.com/){:target="_blank"}.

#### 2. **Create a Resource Group**
- Search for **Resource groups** and create a new one named `OpenWebUI-ContainerApp-RG`.
- Select a region like **East US** be sure you are consistent with the region through this guide.

#### 3. **Create a Storage Account**
- Search for **Storage accounts**, create a new one (For example: `openwebuistorageaccount` (lowercase required)) in the `OpenWebUI-ContainerApp-RG` resource group.
  - During creation of the Storage account there are configuration changes required:

     - **<u>Basics tab</u>**
       1. **Primary service** select `Azure Files`.
       2. **Performance** you can set `Standard` unless you have a specific need for `Premium`.
       3. **Redundancy** you can set `Locally-redundant storage (LRS)` unless you have a specific need for the other options.
	
     - **<u>Networking tab</u>**
       1. **Network access** select `Enable public access from all networks` (default option) unless you have a specific need for the other options (the other options require additional configuration which will not be covered in this guide).
	
     - **<u>Other tabs</u>**
       1. Leave the defaults and create the storage account.

  - *After* the storage account is created there are additional steps required:
    1. Search for **Storage accounts**. Locate the storage account (***openwebuistorageaccount***) and select it.
    2. Expand **Data storage** and go to the **File shares** blade. Add a new file share.
       1. **Name** set to `ai-storage-file-share`.
       2. For **Access tier** select `Transaction optimized`.
       3. On the **Backup** tab I disable backup, as I do not want to incur any additional charges. But if you can afford it, keep it enabled to keep your files safe in the event of data loss.
       4. Create the file share.

#### 4. **Create a Container App**
Search for **Container Apps**, create a new container app.

  - **<u>Basics tab</u>**
    1. **Container app name** set the name to `ai-openwebcontainer`.
    2. **Deployment source** set to `Container image`.
    3. **Region** set `East US`.
    4. **Container Apps Environment** create a new container apps environment. There is additional configuration needed for the container app environment:
       1. Set the **Environment Name** to `OpenWebContainerEnvironment`.
       2. Leave the rest of the options as the defaults.
       3. Create the Container Apps Environment.
	   
          ![Example of how to setup container app basics tab](/assets/img/posts/create-container-app-basics-tab-filled-out.png)

  - Proceed to **Next: Container**.

  - **<u>Container tab</u>**
    1. **Image source** set to `Docker Hub or other registries`
    2. **Image type** set to `Public`
    3. **Registry login server** set to `ghcr.io`
    4. **Image and tag** set to `open-webui/open-webui:main`
    5. **CPU and Memory** set to what you are comfortable with, I set to `2 CPU cores, 4 Gi memory` but this can be lower if needed.
    6. Leave the rest of the options as the defaults (we will configure the environmental variables in a few steps).
		   
       ![Example of how to setup container app container tab - picture 1](/assets/img/posts/create-container-app-container-tab-filled-out.png)
    	   
  - Proceed to **Next: Bindings**.

  - **<u>Bindings tab</u>**
    1. Nothing needs to be modified on this tab.
           
  - Proceed to **Next: Ingress**.
        
  - **<u>Ingress tab</u>**
    1. Toggle **Ingress** to `Enabled`
    2. **Ingress traffic** set to `Accept traffic from anywhere: Applies if 'internal' setting is set to false on the Container Apps environment`
    3. **Ingress Type** set to `HTTP`
    4. **Target port** set to `8080`
    5. Leave the rest of the options as the defaults.

  - Select **Review + create** to create the Container App.

#### 5. **Gather data from Storage Accounts**
1. Search for **Storage accounts**, select the storage account we created **openwebuistorageaccount**.
2. Expand **Security + networking** and select **Access keys**.
3. Click show on one of the 2 keys listed, **copy one** for us to use in the next step.

#### 6. **Link Azure Files to Container Apps Environment**
   1. Search for **Container Apps Environments**.
   2. Expand **Settings**, then select **Azure Files**, we are going to Add a new file share to the container apps environment.
      1. **Name** set a name (`openwebcontainerfileshare`) for the file share in the container apps environment.
	 2. **Storage account name** set to `openwebuistorageaccount`
	 3. **Storage account key** set to the access key we copied in the previous step.
	 4. **File Share** set to `ai-storage-file-share`
	 5. **Access mode** set to `Read/Write`


#### 7. **Mount Azure File Share to Container App**
1. Search for **Container Apps**, select the container app we created **ai-openwebcontainer**
2. Expand **Application**, select **Containers**. Select **Edit and deploy**.
   - First, you will need to select the Volumes tab.
   - **<u>Volumes tab</u>**
     1. Select **+ Add**
     1. **Volume type** set to `Azure file volume`
     2. **Name** set to whatever name you would like (I used `ai-openweb-volume`).
     3. **File share** select the file share we created `openwebcontainerfileshare`
     4. **Mount options** set to `nobrl` [more information](https://learn.microsoft.com/troubleshoot/azure/azure-kubernetes/storage/mountoptions-settings-azure-files#other-useful-settings){:target="_blank"}
   - Now select the **Container** tab.
   - **<u>Container tab</u>**
     1. **Name / suffix** set the name of the revision to something you will recognize. (I used `live`)
     2. Click on the container image `ai-openwebcontainer` shown in the Container Image table
        ![Where to click, to configure the container image](/assets/img/posts/edit-container-app-revision-container-image-select.png)
     3. The **Edit a container** menu will open.
        1. In the **Basics** tab you can add your Environment variables at the bottom of the tab. Here are all the environmental variables that OpenWeb UI Supports: [https://docs.openwebui.com/getting-started/env-configuration/](https://docs.openwebui.com/getting-started/env-configuration/){:target="_blank"}
           - Add a new environmental variable ***(keep in mind this method will expose your API key in plain text. If you want security you need to save it as a secret)***:
             - **Name:** `OPENAI_API_KEY`
             - **Source:** `Manual entry`
             - **Value:** `<OpenAI-API-Key>` [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

        3. Select the **Volume mounts** tab.
        4. Select the dropdown under volume name and select the Azure file volume that we created in the Volumes tab.
           - **Volume name:** `ai-openweb-volume`
           - **Mount path:** `/app/backend/data`
           - **Sub path (optional):** Leave this empty

        5. Click save

   - Lastly, you will need to select the Scale tab.

   - **<u>Scale tab</u>**
     1. **Min replicas** set to `1` (If you want the instance to spin up on demand and deallocate when not in use, set this to `0` instead. Personally, I prefer the application to remain running, so I don't have to wait for Azure Container Apps to activate the container.)
     2. **Max replicas** set to `1` (the max cannot be more than 1 due to design of Docker container for OpenWeb UI)

   - Select **Create** to create the revision.

#### 8. **Access the Application**:
1. In the **Container App** view, expand **Application** and select **Revisions and replicas**.
2. Click the Active revision that ends with `live` (or whatever you configured your revision name to)
3. In the **Revision details** menu select the **Revision URL** this is the published URL for your container app revision. (the main URL is in the **Overview** blade of your container app. Its called the **Application Url**.)

---

## :gear: Scaling Limitations of OpenWeb UI

Due to OpenWeb UI's architecture, where both frontend and backend are housed in the same container, scaling the application horizontally (adding more replicas) is problematic. Here’s why:

1. **Single Container Design**: The combined frontend and backend make it difficult to scale individual components like you would in a decoupled architecture.
2. **Session Handling**: Without advanced session management, multiple instances of the backend can cause inconsistent behavior, as there's no mechanism to manage session persistence across replicas.
3. **Best Fit**: For now, deploying OpenWeb UI with **1 replica** in **Azure Container Apps** is the most efficient way to ensure stability.

### Possible Solutions

- **Decoupling Services**: If you want to scale, consider splitting the frontend and backend into separate containers and using Kubernetes for scaling them independently.
- **Kubernetes Deployment**: Kubernetes can help manage scaling by separating components, introducing load balancing, and handling session persistence. However, this adds complexity and cost.

## :moneybag: Cost-Effective Hosting: Container Apps vs. Kubernetes

When comparing **Azure Container Apps** and **Azure Kubernetes Service (AKS)**, here’s what you need to know about cost-effectiveness:

### Azure Container Apps

- **Serverless Pricing**: You only pay for the CPU and memory your app uses. It’s cost-efficient for small to medium workloads and apps with unpredictable traffic.
- **Low Management Overhead**: Azure manages the underlying infrastructure, so there’s no need to worry about managing virtual machines (VMs), which reduces operational costs.
- **Best Use**: Ideal for apps like OpenWeb UI that don’t require complex scaling and benefit from Azure's autoscaling features.

### Azure Kubernetes Service (AKS)

- **VM-Based Pricing**: You pay for VMs even when your app is idle. Scaling adds complexity since you need to manage pods, nodes, and networking.
- **Scalability**: While AKS offers more flexibility in scaling, the cost is higher, especially for apps that don’t need continuous scalability.
- **Best Use**: Suitable for large-scale applications that need fine-grained control over scaling and architecture.

**Conclusion**: **Azure Container Apps** is the more cost-effective solution for hosting OpenWeb UI due to its serverless pricing and minimal management requirements. AKS is better suited for complex, highly scalable applications, but it comes with a higher cost and management overhead.

## :mag: Conclusion

In this guide, we deployed OpenWeb UI using Azure Container Apps and explored its scalability limitations. For most users, sticking with a single-instance deployment in Container Apps is the most cost-effective and stable approach. If scaling is essential, consider moving to the [Kubernetes-based solution](https://docs.openwebui.com/getting-started/installation){:target="_blank"} where the frontend and backend can be decoupled.

## :thought_balloon: Feedback

Have you tried deploying OpenWeb UI on Azure? What’s your experience with its scaling capabilities? Share your insights in the comments below.
