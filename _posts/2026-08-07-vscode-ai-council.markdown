---
layout: post
title: "An Adaptive Multi-Model GitHub Copilot Workflow - VS Code AI Council"
date:   '2026-08-07 12:00:00 -0500'
categories: powershell projects guides ai
author: blakedrumm
thumbnail: /assets/img/posts/vscode-ai-council-main.png
toc: true

summary: >- # this means to ignore newlines
  VS Code AI Council installs an adaptive multi-model GitHub Copilot agent workflow for Visual Studio Code. A coordinator chooses the least expensive useful strategy, delegates focused work to model-specific experts, and can request bounded peer review for difficult engineering decisions.

keywords: vscode ai council, vs code ai council, github copilot, custom agents, multi-model agents, ai coding workflow, powershell, visual studio code, subagents, agent orchestration, multi-model engineering council, blake drumm
permalink: /blog/vscode-ai-council/
---

## :bulb: Introduction

I created **VS Code AI Council** to make multi-model engineering useful without making every request a multi-agent event. It installs a custom GitHub Copilot agent system in Visual Studio Code with one visible coordinator, hidden model-specific experts, and bounded leaf reviewers.

The coordinator starts with the smallest strategy that can produce a defensible result. Most requests can be handled directly. Larger requests can be delegated to one expert, two focused experts in parallel, an adversarial review, or a full team of configured models.

The result is a single entry point for day-to-day work while still making multiple model perspectives available when the task warrants the additional time and cost.

Project Detail | Value |
------------- | ----------- |
Author | Blake Drumm ([blakedrumm@microsoft.com](mailto:blakedrumm@microsoft.com)) |
Version | 5.0.0 |
Date Created | August 6th, 2026 |
Last Modified | August 8th, 2026 |
License | MIT License |
PowerShell Compatibility | Windows PowerShell 5.1 and PowerShell 7+ |
{: .table .table-hover .table-text .d-block .overflow-auto }

---

## :white_check_mark: Requirements

Before running the installer, make sure the following are available:

- Windows with Windows PowerShell 5.1 or PowerShell 7+.
- Visual Studio Code.
- GitHub Copilot and GitHub Copilot Chat/Agent support.
- Access to each model you plan to configure.
- A workspace path when using workspace scope.

The current installer is Windows-specific because model discovery and settings resolution use Windows SQLite and `%APPDATA%` paths.

---

## :arrow_down: Install the Council

The source package contains two equivalent distributions:

- [Install-VSCodeCopilotCouncil-v5.ps1](https://files.blakedrumm.com/Install-VSCodeCopilotCouncil-v5.ps1){:target="_blank"} - The executable PowerShell script.
- [Install-VSCodeCopilotCouncil-v5.txt](https://files.blakedrumm.com/Install-VSCodeCopilotCouncil-v5.txt){:target="_blank"} - An identical text-format copy for environments that block `.ps1` downloads.

Open PowerShell in the folder containing the script and run:

```powershell
.\Install-VSCodeCopilotCouncil-v5.ps1
```

The interactive flow displays the discovered models, accepts one to five selections, asks which selected model should coordinate, shows the resolved paths, and validates the generated files.

After installation:

1. Return to Visual Studio Code.
2. Run **Developer: Reload Window** from the Command Palette.
3. Open Copilot Chat or the Agents window.
4. Select **Multi-Model Engineering Council**.

![Selecting Multi-Model Engineering Council from the Visual Studio Code agent menu](/assets/img/posts/vscode-ai-council-agent-picker.png){:class="img-fluid"}

The installed coordinator appears alongside the standard **Agent**, **Ask**, and **Plan** options. Hover over it to see the adaptive tier description before selecting it.

---

## :art: Agent Workflow Overview

![VS Code Copilot Multi-Model Agent Workflow](/assets/img/posts/vscode-ai-council.png){:class="img-fluid"}

The diagram is a conceptual overview of coordinator-led planning, specialist analysis, review, repository work, and a final result. The implementation is deliberately more selective: specialists do not run for every request, and peer review uses separate leaf reviewer agents only when the selected tier allows it.

---

## :dart: Why I Built It

A single model can be excellent at implementation and still miss a regression, an architectural consequence, or an operational concern. Running every available model on every prompt addresses that blind spot, but it creates a different problem: duplicated investigation, higher latency, and unnecessary model usage.

VS Code AI Council takes an adaptive approach:

- Use no subagent when the coordinator can answer directly.
- Assign each model a distinct engineering lens so parallel work does not overlap.
- Delegate with concrete goals, known evidence, file paths, and explicit boundaries.
- Resolve disagreements with source code, tests, runtime behavior, and documentation instead of model voting.
- Keep nested review bounded by giving reviewers no subagent capability of their own.

The PowerShell script is an installer, not a long-running service. It generates the custom agent files, configures the required VS Code setting, validates the installation, and then exits.

---

## :building_construction: What Gets Installed

The installer creates three agent roles:

Role | Count | Purpose |
------------- | ----------- | ----------- |
Multi-Model Engineering Council | One | User-selectable coordinator that chooses a tier, delegates work, owns repository edits, validates results, and returns one answer. |
Model Expert | One per selected model | Hidden worker with a distinct engineering lens. Experts investigate and propose; they do not edit shared files. |
Model Reviewer | One per selected model | Hidden leaf reviewer that challenges an expert's assumptions. Reviewers cannot invoke more agents. |
{: .table .table-hover .table-text .d-block .overflow-auto }

Only the coordinator receives edit and execute tools. Experts and reviewers are intentionally limited to investigation tools, while experts also receive access to their permitted reviewer list.

The generated files use these names:

```plaintext
multi-model-engineering-council.agent.md
mm-expert-<model-slug>.agent.md
mm-reviewer-<model-slug>.agent.md
```

With user scope, the files are installed under:

```plaintext
~/.copilot/agents
```

With workspace scope, they are installed under:

```plaintext
<WorkspacePath>/.github/agents
```

---

## :level_slider: The Five Decision Tiers

The coordinator selects the lowest tier that can produce a correct, defensible answer.

Tier | Strategy | Typical Use |
------------- | ----------- | ----------- |
Tier&nbsp;0 | Direct answer, no subagents | Known facts, syntax questions, lookups, and trivial local changes. |
Tier&nbsp;1 | One expert | A focused task that fits one engineering lens. |
Tier&nbsp;2 | Two experts in parallel | Shared behavior or a real decision spanning two non-overlapping lenses. |
Tier&nbsp;3 | Adversarial debate with bounded peer review | Explicit debate requests, unresolved disagreement, or a hard-to-reverse decision that tools cannot settle. |
Tier&nbsp;4 | One expert per configured model in parallel | Genuinely independent subsystems, an explicitly requested full team, or a difficult bug that survived a smaller council. |
{: .table .table-hover .table-text .d-block .overflow-auto }

Tier 0 is intentionally the default for most questions. Tiers 3 and 4 are exceptions, not a ceremony applied to every prompt.

The tier rules are coordinator instructions rather than a billing or quota system. The structural limit is at the reviewer layer: reviewer agents have no agent tool and no subagent list, so they cannot continue the chain.

---

## :mag: Five Engineering Lenses

Each selected model receives one primary lens based on its position in the model list:

1. **Implementation and correctness** - Root cause, code paths, API behavior, edge cases, and compatibility.
2. **Architecture and maintainability** - Boundaries, coupling, integration design, readability, and long-term cost.
3. **Security and reliability** - Trust boundaries, input validation, credentials, failure isolation, and unsafe defaults.
4. **Testing and regression risk** - Coverage gaps, boundaries, rollback paths, concurrency, idempotency, and exact validation commands.
5. **Performance and operations** - Allocation and I/O cost, latency, limits, observability, deployment, and degradation behavior.

This assignment gives parallel experts distinct jobs. The coordinator also tells each expert what has already been verified so model calls are not spent repeating the same investigation.

---

## :arrows_counterclockwise: Controlled Cross-Model Review

When two or more models are configured, an expert may be given access to reviewers backed by the other selected models. For a Tier 3 branch, the coordinator can authorize one nested review and ask the reviewer to attack the expert's strongest assumption.

The reviewer returns a focused critique to the expert. The expert then accepts evidence-backed corrections, rejects unsupported criticism, and sends a revised conclusion to the coordinator. Raw subagent transcripts are not presented as the final result; the coordinator synthesizes one answer.

With only one configured model, the installer still creates the same shape, but it clearly reports that independent cross-model review is unavailable. A same-model reviewer can provide a fresh-context blind-spot check, not independent model evidence.

---

## :gear: How the Installer Works

### 1. Discover agent-capable models

The script reads the live model cache used by Visual Studio Code instead of assuming that every account has the same model list.

On Windows, VS Code stores this state in:

```plaintext
%APPDATA%\Code\User\globalStorage\state.vscdb
```

The database is normally open while VS Code is running. The installer copies the database and its `-wal` and `-shm` sidecars to a temporary path, opens the copy read-only through Windows `winsqlite3.dll`, and queries these keys:

```plaintext
chat.cachedLanguageModels.v2
chat.cachedLanguageModels
```

It keeps models that belong to GitHub Copilot, are user-selectable, and support agent mode. If discovery is unavailable, the installer falls back to a built-in suggestion list and still allows a custom model name.

### 2. Validate the selection

You can select from one to five models. Model names are validated before they are written into YAML front matter, and duplicate names are removed. Model matching is case-sensitive in VS Code, so names should match the model picker exactly.

The script warns when `Auto` is selected as an expert. `Auto` is a router, so multiple experts could be routed to the same underlying model and lose the independence that the council is meant to provide. `Auto` is appropriate for the coordinator when you want VS Code to choose the orchestration model.

### 3. Back up existing files

Before changing an existing agent file or VS Code settings file, the installer creates a timestamped backup under:

```plaintext
~/.copilot/agent-backups/v5_<timestamp>
```

### 4. Enable nested subagents

Unless `-SkipVSCodeSetting` is specified, the script enables:

```json
"chat.subagents.allowInvocationsFromSubagents": true
```

The settings editor accounts for JSON with comments. It masks comments while preserving character positions, updates or inserts the setting, parses the result, and verifies that the final value is `true`.

### 5. Generate and validate every agent

The installer writes the coordinator, expert, and reviewer files, then validates their names, models, visibility, and allowed agent lists. It also verifies that leaf reviewers cannot delegate and that an expert does not receive its own reviewer when multiple models are configured.

Generated expert and reviewer files left behind by an earlier configuration are backed up and removed from the current target directory.

---

## :wrench: Parameters

Parameter | Description |
------------- | ----------- |
`-Scope` | Install for `User` or `Workspace`. Defaults to `User`. |
`-WorkspacePath` | Workspace root used with `-Scope Workspace`. |
`-Models` | One to five exact model names. When omitted, the installer prompts when possible. |
`-CoordinatorModel` | Model used by the coordinator. Defaults to the first selected model. |
`-ModelCatalog` | Override model discovery with an explicit list for the interactive picker. |
`-VSCodeSettingsPath` | Use an explicit VS Code `settings.json` path. |
`-SkipVSCodeSetting` | Do not update the nested-subagent VS Code setting. |
`-NonInteractive` | Suppress prompts. Uses the supplied models or the built-in default pair. |
`-OpenInVSCode` | Open the installed coordinator and settings files after installation when the `code` CLI is available. |
{: .table .table-hover .table-text .d-block .overflow-auto }

---

## :computer: Examples

### Choose models interactively

```powershell
.\Install-VSCodeCopilotCouncil-v5.ps1
```

### Install a two-model council

```powershell
.\Install-VSCodeCopilotCouncil-v5.ps1 `
    -Models 'GPT-5.6 Sol', 'Claude Opus 5'
```

### Select a separate coordinator model

```powershell
.\Install-VSCodeCopilotCouncil-v5.ps1 `
    -Models 'GPT-5.6 Sol', 'Claude Opus 5', 'Gemini 3 Pro' `
    -CoordinatorModel 'Claude Opus 5' `
    -OpenInVSCode
```

### Install agents for one workspace

```powershell
.\Install-VSCodeCopilotCouncil-v5.ps1 `
    -Scope Workspace `
    -WorkspacePath 'C:\GitHub\MyProject' `
    -NonInteractive
```

### Avoid changing VS Code settings

```powershell
.\Install-VSCodeCopilotCouncil-v5.ps1 `
    -Models 'GPT-5.6 Sol', 'Claude Opus 5' `
    -SkipVSCodeSetting
```

Use the last option only when the nested-subagent setting is already managed another way. Without that setting, expert-to-reviewer calls may not be available.

---

## :shield: Safety and Validation

The installer includes several controls intended to keep the workflow understandable and recoverable:

- Existing generated agents and VS Code settings are backed up before modification.
- The script does not enable global tool auto-approval.
- Reviewer agents have no subagent tool, which caps the delegation depth.
- Experts cannot edit the repository; the coordinator owns shared changes and validation.
- Model names are checked before being inserted into generated YAML.
- The JSON settings update is parsed and verified after it is written.
- Every generated agent is checked after installation.
- Stale council agents in the selected target directory are backed up before removal.
- The final output lists installed agents, reviewer relationships, settings, backup paths, and next steps.

The council uses repository source, reproducible tests, runtime behavior, official documentation, and diagnostics to settle technical questions. Agreement between models is not treated as evidence by itself.

---

## :warning: Important Limitations

- The installer is currently Windows-specific.
- Tier selection and the one-review-per-expert rule are prompt instructions; the no-further-delegation reviewer boundary is the structural control.
- Model availability varies by GitHub Copilot account and VS Code version.
- Model names must match the VS Code model picker, including capitalization.
- `-NonInteractive` without `-Models` uses a built-in default pair that may not be available to every account.
- Changing from user scope to workspace scope, or the reverse, does not remove files from the old scope.
- The installer adds no automatic commit, push, or pull-request behavior and does not enable global terminal auto-approval.
- The script does not collect telemetry or calculate token savings.

Review the generated files and VS Code settings before using the council in a sensitive repository.

---

## :speech_balloon: Using It Day to Day

For normal work, select **Multi-Model Engineering Council** and ask your engineering question as usual. The coordinator states its selected tier in one short line and then proceeds.

![Five VS Code AI Council experts reviewing a project in parallel](/assets/img/posts/vscode-ai-council-experts-running.png){:class="img-fluid"}

This Tier 4 example shows five configured experts investigating separate concerns in parallel: security, correctness, architecture, testing, and operations. Smaller tasks use fewer experts or no subagents at all.

You can also request a specific workflow when needed:

```plaintext
Debate this design and give me the evidence-based verdict.
```

```plaintext
Run the full team. Assign security, testing, architecture, implementation,
and operations separate scopes, then return one recommendation.
```

```plaintext
Use one testing expert to review the regression risk in this change.
```

The goal is not to maximize the number of agents. It is to use the smallest group that can materially improve the answer.

---

## :page_facing_up: License

VS Code AI Council version 5.0.0 is released under the **MIT License**. The complete license grant and warranty disclaimer are included in the `.NOTES` section of both the `.ps1` and `.txt` distributions.

---

## :checkered_flag: Conclusion

VS Code AI Council turns multiple GitHub Copilot models into an adaptive engineering workflow instead of a permanent panel. Simple work stays simple, complex work can receive focused parallel analysis, and difficult decisions can receive bounded cross-model review.

The installer keeps that structure visible: one coordinator, distinct expert lenses, leaf reviewers, explicit backups, post-install validation, and no unrestricted recursion. That balance is what makes the council useful for regular repository work rather than only for demonstrations.

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/vscode-ai-council/)
