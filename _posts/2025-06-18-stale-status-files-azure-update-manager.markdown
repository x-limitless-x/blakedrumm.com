---
layout: post
title:  "Cleaning Orphaned WindowsPatchExtension Status Files - Azure Update Manager"
date:   '2025-06-18 10:50:00 -0500'
categories: azure guides updateManager troubleshooting 
author: blakedrumm
thumbnail: /assets/img/posts/windows-patch-extension-status-cleanup.png
toc: true

summary: 'Learn how to identify and clean up orphaned .status files left behind by the WindowsPatchExtension when using Azure Update Manager. This guide explains why these files exist, their impact, and provides a PowerShell script to clean them safely.'

keywords: azure, update manager, automation, patching, windows, cleanup, status files, extension
permalink: /blog/azure-update-manager-status-cleanup/
---

## :bulb: Introduction

While helping customers troubleshoot patching issues with **Azure Update Manager**, I ran into a recurring problem—leftover `.status` files from the **WindowsPatchExtension**.

These orphaned files can confuse log analysis and clutter VMs over time. This blog post explains how they get there, why they matter, and how to clean them up using a simple PowerShell script.

---

## :mag: The Problem — Orphaned `.status` Files

When the `WindowsPatchExtension` runs, it generates `.settings` and `.status` files in the following directories:

- **Settings Path**  
  `C:\Packages\Plugins\Microsoft.CPlat.Core.WindowsPatchExtension\<version>\RuntimeSettings`

- **Status Path**  
  `C:\Packages\Plugins\Microsoft.CPlat.Core.WindowsPatchExtension\<version>\status`

Under normal conditions, these files are created and removed together. But if patching is interrupted, retried, or a new version of the extension is installed, some `.status` files may remain—even if they no longer correspond to a `.settings` file.

### :warning: Real-World Scenario

In a recent case, the customer deployed VMs from a **custom image** that already had the `WindowsPatchExtension` installed. The image unknowingly **included stale `.status` files**, which then propagated to every new VM built from that image.

This mismatch between `.settings` and `.status` files caused confusion during patch runs, where the extension logs no longer lined up with the expected state.

---

## :thinking: Why This Matters

These orphaned `.status` files:

- ❌ Do **not** represent the current patch status  
- 🤔 Can cause confusion when checking plugin behavior  
- 🧹 Accumulate over time and clutter the file system

While they don’t break the extension’s functionality, they make troubleshooting harder—especially when using automation or analyzing logs across many VMs.

---

## :wrench: The Fix — Compare and Clean with PowerShell

To resolve this, I wrote a [PowerShell script](https://gist.github.com/blakedrumm/62a572ddc786963136641b2c52894211){:target="_blank"} that compares `.status` and `.settings` file indexes and deletes any `.status` files that don’t match.

### What It Does

1. Finds the highest-index `.settings` file in the RuntimeSettings folder
2. Deletes any `.status` files with a **higher index**

This keeps only the relevant `.status` files and ensures consistency.

---

## :floppy_disk: How to Use the Script

> 🔗 **Script Link**: [PowerShell Gist - Cleanup Status Files](https://gist.github.com/blakedrumm/62a572ddc786963136641b2c52894211){:target="_blank"}

> **Disclaimer**: Always test in a development environment before applying to production.

### 1. Save the Script Locally

Save the content of the Gist above as a `.ps1` file on your VM:

```powershell
Remove-UpdateManagerOldStatusFiles.ps1
```

### 2. Run PowerShell as Administrator

Because the script accesses protected directories, you must run it with admin rights.

- Right-click **PowerShell** → **Run as Administrator**

### 3. Execute the Script

Navigate to the script location and run:

```powershell
.\Remove-UpdateManagerOldStatusFiles.ps1
```

The script will:

- Detect the latest version of the `WindowsPatchExtension`
- Find the highest `.settings` file
- Remove `.status` files with a **higher index**

You’ll get output confirming what (if anything) was removed.

---

## :speech_balloon: Share Your Experience

Have you encountered similar cleanup scenarios with the WindowsPatchExtension or Update Manager?  
Did you solve it a different way?

Let me know! I’m always interested in how others handle extension state management at scale.

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/azure-update-manager-status-cleanup/)
