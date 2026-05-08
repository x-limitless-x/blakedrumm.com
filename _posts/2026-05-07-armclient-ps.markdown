---
layout: post
date:   '2026-05-07 21:00:00 -0500'
title: "ArmClient-PS - A Single-Script Azure Resource Manager Support Tool"
categories: azure powershell projects arm troubleshooting
author: blakedrumm
thumbnail: /assets/img/posts/armclient-ps.png
toc: true

summary: >- # this means to ignore newlines
  ArmClient-PS is a single-script Azure Resource Manager support utility designed for redistribution. It recreates the core ARMClient experience by using `Invoke-AzRestMethod` and a locally bundled `Modules` folder, so support engineers can ship a zip-friendly package that runs in restricted environments without installing anything from the PowerShell Gallery.

keywords: armclient, armclient-ps, azure resource manager, arm rest api, invoke-azrestmethod, powershell, azure support tool, az powershell, bundled modules, sovereign cloud, azure us government, azure stack, blakedrumm
permalink: /blog/armclient-ps/
---

## :book: Introduction

Welcome to the official page for **ArmClient-PS** — a single-script Azure Resource Manager (ARM) support utility designed for redistribution.

ArmClient-PS recreates the core [ARMClient](https://github.com/projectkudu/ARMClient) workflow by using `Invoke-AzRestMethod` and a locally bundled `Modules` folder, instead of requiring runtime installation from the PowerShell Gallery. It is intentionally built to be a **zip-friendly support package** that an engineer can hand off, extract, and run — without internet access to the Gallery and without polluting the user's installed module list.

It supports the standard ARM verbs (**GET**, **POST**, **PUT**, **PATCH**, **DELETE**), ships with a built-in catalog of common ARM operation presets, polls long-running ARM operations to completion, validates its own packaged files before use, and prefers secure, process-scoped authentication behavior by default.

>#### :spiral_notepad: Note
> ArmClient-PS is compatible with **Windows PowerShell 5.1** and **PowerShell 7.x**, and supports all Azure cloud environments — `AzureCloud`, `AzureUSGovernment`, `AzureChinaCloud`, `AzureUSNat`, `AzureUSSec`, and any custom environment registered with `Add-AzEnvironment` (such as Azure Stack Hub).

---

## :arrow_down_small: Source Code
[![License](https://img.shields.io/github/license/blakedrumm/AzArmClient-PS)](https://github.com/blakedrumm/AzArmClient-PS/blob/main/LICENSE){:class="img-shields-io"} \
[![Last Commit](https://img.shields.io/github/last-commit/blakedrumm/AzArmClient-PS?style=for-the-badge&color=brightgreen)](https://github.com/blakedrumm/AzArmClient-PS/commits/main){:class="img-shields-io"} \
[![Repo Size](https://img.shields.io/github/repo-size/blakedrumm/AzArmClient-PS?style=for-the-badge&color=blue)](https://github.com/blakedrumm/AzArmClient-PS){:class="img-shields-io"}

Source code is hosted on GitHub: [https://github.com/blakedrumm/AzArmClient-PS](https://github.com/blakedrumm/AzArmClient-PS)

To get started, clone the repository or download the latest source as a ZIP from the **Code** button on GitHub.

<a href="https://github.com/blakedrumm/AzArmClient-PS" target="_"><button class="btn btn-primary navbar-btn">View on GitHub</button></a>

---

## :dart: Goals

- Ship as a **zip-friendly support package**.
- Prefer **secure, process-scoped authentication** behavior.
- **Validate packaged files** before use.
- Support ARM **GET, POST, PUT, PATCH, and DELETE** operations.
- Allow **newer valid locally installed modules** when they are safer or more current than the bundled version.
- Provide a **catalog of ARM operation presets** so engineers don't have to remember API versions and path templates.
- **Poll long-running ARM operations** automatically until they reach a terminal state.

---

## :package: Package Layout

The tool ships as a self-contained folder structure:

```plaintext
.
├── ArmClient-PS.ps1
├── Build-BundledModules.ps1
├── Modules\
├── Manifest\
│   ├── Files.sha256.json
│   └── Versions.json
├── Logs\
└── Output\
```

>#### :spiral_notepad: Note
> `Logs\` and `Output\` are runtime folders and are not intended for source control. They are created and populated as the script executes.

---

## :sparkles: Key Features

- **Single-file PowerShell script** — `ArmClient-PS.ps1` is the entire runtime.
- **Bundled `Az.Accounts` and dependencies** loaded from a sibling `Modules` folder.
- **TLS 1.2 enforced** for every HTTPS call before any request leaves the host.
- **Process-scoped authentication** — `Disable-AzContextAutosave -Scope Process` runs at startup so credentials never persist past the session.
- **SHA-256 manifest validation** of every packaged file with line-ending normalization so hashes match across Windows and non-Windows hosts.
- **Optional Authenticode signature validation** through `-EnforceSignatureValidation`.
- **Token and credential redaction** in all log output (Bearer tokens, secrets, cookies, and assertions).
- **Built-in operation preset catalog** spanning ARM core, resources, deployments, governance, and Azure Communication Services email.
- **Automatic long-running operation polling** that honors the `Azure-AsyncOperation`, `Operation-Location`, `Location`, and `Retry-After` headers.
- **Interactive tenant and subscription selection** when ARM cannot resolve them automatically (with friendly numbered menus).
- **Custom header support** with a deny-list for dangerous headers (`Authorization`, `Cookie`, `Host`, etc.) and CRLF-injection protection.
- **JSON body validation** for both inline `-Body` and `-BodyFile` payloads before the request is sent.
- **Built-in self-test** that validates folders, manifests, hashes, module resolution, and Az context.

---

## :page_with_curl: Runtime Usage

### Show context

Display the currently resolved Azure context the script will use:

```powershell
.\ArmClient-PS.ps1 -ShowContext
```

### Run a GET request

Issue a standard ARM GET against any resource path:

```powershell
.\ArmClient-PS.ps1 `
  -Method GET `
  -RelativePath "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>" `
  -ApiVersion "2021-04-01"
```

### Save a response to disk

Pipe the response body straight into a file under the `Output\` folder:

```powershell
.\ArmClient-PS.ps1 `
  -Method GET `
  -RelativePath "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>" `
  -ApiVersion "2021-04-01" `
  -OutputFile "resource-group.json"
```

### Send a request body (PUT/PATCH/POST)

Either supply inline JSON with `-Body` or point at a file with `-BodyFile`:

```powershell
.\ArmClient-PS.ps1 `
  -Method PUT `
  -RelativePath "/subscriptions/<subscriptionId>/resourceGroups/rg-example" `
  -ApiVersion "2021-04-01" `
  -Body '{"location":"eastus","tags":{"environment":"dev"}}'
```

### Use a sovereign cloud

```powershell
.\ArmClient-PS.ps1 `
  -Environment AzureUSGovernment `
  -Method GET `
  -RelativePath "/subscriptions/<subscriptionId>" `
  -ApiVersion "2022-12-01"
```

### Inspect resolved module versions

See exactly which `Az.*` module versions the script will load — bundled vs. installed:

```powershell
.\ArmClient-PS.ps1 -ShowResolvedModuleVersions
```

### Run the built-in package self-test

Validate folder layout, file hashes, manifests, module resolution, and the current Az context:

```powershell
.\ArmClient-PS.ps1 -SelfTest
```

---

## :compass: Operation Presets

To remove the friction of remembering ARM paths and API versions, ArmClient-PS ships with a curated catalog of **operation presets**. Each preset bundles an HTTP method, a parameterized path template, a default API version, a list of known good API versions, and (for write operations) an example request body.

The catalog covers:

- **ARM core** — providers, subscriptions
- **ARM resources** — resource groups (list/get/create/delete), resources by group
- **ARM deployments** — list, get, validate, what-if, create-or-update
- **ARM governance** — policy assignments and management locks at subscription and resource-group scope
- **Azure Communication Services email** — email services and email domains, including `initiateVerification` and `cancelVerification` for `Domain`, `SPF`, `DKIM`, `DKIM2`, and `DMARC`

### List all operation presets

```powershell
.\ArmClient-PS.ps1 -ListOperations
```

### Show full details for one preset

```powershell
.\ArmClient-PS.ps1 -Operation ArmResourceGroupGet -ShowOperationDetails
```

### Show known API versions for a preset

```powershell
.\ArmClient-PS.ps1 -Operation AcsEmailDomainGet -ApiVersions
```

### Run an operation preset

```powershell
.\ArmClient-PS.ps1 `
  -Operation ArmResourceGroupGet `
  -OperationParameters @{
      subscriptionId    = '<subscription-id>'
      resourceGroupName = 'rg-example'
  }
```

For presets that require a JSON body (such as `AcsEmailDomainInitiateVerification`), the script will auto-build the body from `-OperationParameters` if `-Body` and `-BodyFile` are both omitted:

```powershell
.\ArmClient-PS.ps1 `
  -Operation AcsEmailDomainInitiateVerification `
  -OperationParameters @{
      subscriptionId    = '<subscription-id>'
      resourceGroupName = 'rg-example'
      emailServiceName  = 'mailsvc1'
      domainName        = 'contoso.com'
      verificationType  = 'DKIM2'
  }
```

---

## :clock3: Long-Running Operations

Many ARM operations (resource group deletes, deployments, ACS domain verification, etc.) return `202 Accepted` and complete asynchronously. ArmClient-PS handles this for you automatically:

- Detects `Azure-AsyncOperation` and `Operation-Location` response headers.
- Honors `Retry-After` for service-friendly polling intervals.
- Tracks operation state through both the `status` field and `properties.provisioningState`.
- Throws on `Failed` / `Canceled` with the parsed ARM error code and message.
- On success, re-`GET`s the original resource (except for `DELETE`) so you receive the final resource state, not just the operation status.
- Times out after 30 minutes by default to avoid runaway waits.

---

## :lock: Security Notes

ArmClient-PS is intended to be safe to drop onto a support engineer's machine:

- **TLS 1.2 is enforced** at process startup before any HTTPS call.
- Runtime execution **disables Az context autosave** for the current process.
- **Runtime SHA-256 hash validation** is enabled by default and re-runs immediately before each bundled module import.
- **Authenticode signature validation** is available through `-EnforceSignatureValidation`.
- **Tokens, secrets, and cookies are redacted** from log output (Bearer tokens, `Authorization`, `access_token`, `refresh_token`, `id_token`, `client_secret`, `password`, `assertion`, `Cookie`, `Set-Cookie`).
- **Dangerous custom headers are blocked** — `Authorization`, `Proxy-Authorization`, `Cookie`, `Set-Cookie`, `Content-Length`, `Host`, `Connection`, `Transfer-Encoding`.
- **CRLF injection protection** for all custom headers.
- **JSON validation** for every inline body and body file before the request is sent.
- **`-NoLogin`** lets you reuse an existing process context without triggering a new sign-in.
- **`-ClearContextOnExit`** disconnects and clears the Az context when the script finishes.
- `Logs\` and `Output\` are runtime folders and are not intended for source control.

---

## :gear: Module Resolution Behavior

Default behavior is deterministic and predictable:

- Use a **bundled module** when no newer valid installed version is available.
- Prefer a **newer installed version** when it is valid and importable.
- Use `-PreferBundledModules` to **force bundled content**.
- Use `-PreferInstalledModules` to make the **installed-module preference explicit**.

Module dependencies are resolved depth-first based on each manifest's `RequiredModules`, and circular references are surfaced as a clean error rather than an infinite loop. This means the same package behaves consistently across engineer workstations, even when their local `Az.*` versions drift.

---

## :hammer_and_wrench: Maintainer Build Workflow

If you maintain or fork the tool, the build script regenerates the bundled modules and manifests for you.

Rebuild bundled modules and manifests:

```powershell
.\Build-BundledModules.ps1 -ToolVersion 1.0.0 -Clean -Force
```

Optional signing flow (recommended for redistribution inside an organization):

```powershell
.\Build-BundledModules.ps1 `
  -ToolVersion 1.0.0 `
  -Clean `
  -Force `
  -CodeSigningThumbprint "<thumbprint>"
```

---

## :outbox_tray: Distribution Guidance

Before distributing the package to other engineers or customers:

1. Run `Build-BundledModules.ps1` on a maintainer machine.
2. Confirm `Manifest\Files.sha256.json` and `Manifest\Versions.json` were regenerated.
3. Run `.\ArmClient-PS.ps1 -SelfTest` from the packaged folder.
4. Zip the entire folder structure **without removing** the `Modules` or `Manifest` folders.

Following this flow guarantees that the package on the receiving end will pass its own self-test on first run.

---

## :speech_balloon: Final Thoughts

ARMClient has been a staple troubleshooting tool for years, but installing it (and the Az modules it depends on) isn't always practical in restricted or sovereign environments. ArmClient-PS is my answer to that — a single, validated, redistributable PowerShell script that lets you make ARM calls the same way, with bundled dependencies, process-scoped auth, automatic long-running operation polling, and a curated set of operation presets for the calls support engineers reach for most often.

> :octocat: **Source code & releases:** [https://github.com/blakedrumm/AzArmClient-PS](https://github.com/blakedrumm/AzArmClient-PS)

If you have ideas, run into issues, or want to extend the operation catalog for your own workflows, feel free to reach out — I'm always happy to help troubleshoot or share lessons learned.

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/armclient-ps/)
