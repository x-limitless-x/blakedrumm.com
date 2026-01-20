---
layout: post
title:  "Azure Communication Services (ACS) — Custom IAM Roles Are Not Supported"
date:   '2026-01-20 16:00:00 -0500'
categories: azure guides communication-services acs troubleshooting
author: blakedrumm
thumbnail: /assets/img/posts/acs-custom-iam-roles-not-supported.png
toc: true

summary: 'Customers often attempt to create custom IAM roles for Azure Communication Services to follow least-privilege best practices. However, ACS does not currently support custom IAM roles. This post explains the limitation, why it exists, and which built-in role must be used instead.'

keywords: azure, communication services, acs, iam, rbac, custom roles, identity, security
permalink: /blog/acs-custom-iam-roles-not-supported/
---

## 💡 Introduction

When deploying or securing Azure Communication Services (ACS), it’s natural to want to follow least-privilege access principles by creating custom IAM (RBAC) roles.

This is especially common when customers want to:
- Separate operational access from administrative access  
- Grant narrowly scoped permissions to applications or automation  
- Avoid over-assigning built-in roles  

However, Azure Communication Services behaves differently than many other Azure resource providers, and this often leads to confusion during role design.

---

## 🔐 The Issue

A customer attempted to create and assign a custom IAM role for an Azure Communication Services resource.

The goal was to grant limited permissions for managing or interacting with ACS without assigning a broad built-in role.

Despite the role being created successfully in Azure, it did not function as expected when assigned to users or service principals.

---

## 🔍 The Root Cause

Custom IAM roles are not supported for Azure Communication Services.

While Azure allows you to define custom roles at a subscription or resource scope, ACS does not honor custom role definitions, even if the permissions appear valid.

This means:
- Custom roles may assign successfully  
- Role assignments appear correct in the portal  
- Access attempts still fail at runtime  

This is not a configuration issue or a customer mistake. It is a platform limitation.

---

## ✅ The Resolution

To manage or interact with Azure Communication Services, you must use a predefined built-in role.

### ✔ Required Built-In Role

Communication and Email Service Owner

This role provides the permissions required to:
- Manage ACS resources  
- Access keys and endpoints  
- Configure calling, SMS, email, and related features  

At this time, there is no supported alternative that allows partial or custom permission sets for ACS.

---

## ⚠️ Important Notes About ACS RBAC

Here are a few important behaviors to be aware of when working with ACS permissions:

- ACS does not support custom RBAC roles  
- DataActions are not exposed or configurable for ACS  
- Least-privilege designs are limited to built-in roles only  
- Role assignments must be validated using real API calls, not just portal visibility  

This can be surprising if you're used to other Azure services that fully support custom role definitions.

---

## 🧭 Design Guidance

If you need separation of duties or reduced blast radius, consider these alternatives:

- Use separate ACS resources per environment or workload  
- Assign the built-in role only to dedicated service principals  
- Scope access tightly at the resource level, not subscription-wide  
- Use Azure Monitor and diagnostics to audit usage instead of restricting permissions  

While not ideal, these approaches align with the current ACS security model.

---

## 🧠 Final Thoughts

Azure Communication Services has a powerful feature set, but its RBAC model is intentionally constrained today. Attempting to use custom IAM roles will lead to confusing access failures that are difficult to troubleshoot unless this limitation is known upfront.

If you encounter authorization issues with ACS:
- Verify the role is **Communication and Email Service Owner**  
- Do not rely on custom role definitions  
- Validate access using real SDK or REST calls  

If this behavior changes in the future, it will require a platform update from the ACS product group.

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/acs-custom-iam-roles-not-supported/)