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

The project is open source under the MIT License: [github.com/blakedrumm/VSCode-AI-Council](https://github.com/blakedrumm/VSCode-AI-Council){:target="_blank"}

Project Detail | Value |
------------- | ----------- |
Author | Blake Drumm ([blakedrumm@microsoft.com](mailto:blakedrumm@microsoft.com)) |
Source Code | [github.com/blakedrumm/VSCode-AI-Council](https://github.com/blakedrumm/VSCode-AI-Council){:target="_blank"} |
Version | 5.5.0 |
Date Created | August 6th, 2026 |
Last Modified | August 10th, 2026 |
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

The project lives on GitHub, which is the authoritative source for the current script, the changelog, and the license:

- [github.com/blakedrumm/VSCode-AI-Council](https://github.com/blakedrumm/VSCode-AI-Council){:target="_blank"}

Download it, read it, and then run it. There is deliberately no pipe-to-shell one-liner, because an unread script from the internet should never go straight into your terminal.

```powershell
Invoke-WebRequest `
    -Uri 'https://raw.githubusercontent.com/blakedrumm/VSCode-AI-Council/main/Install-VSCodeCopilotCouncil-v5.ps1' `
    -OutFile 'Install-VSCodeCopilotCouncil-v5.ps1'

Unblock-File .\Install-VSCodeCopilotCouncil-v5.ps1
```

Direct download mirrors are also available, including a text-format copy for environments that block `.ps1` downloads:

- [Install-VSCodeCopilotCouncil-v5.ps1](https://files.blakedrumm.com/Install-VSCodeCopilotCouncil-v5.ps1){:target="_blank"} - The executable PowerShell script.
- [Install-VSCodeCopilotCouncil-v5.txt](https://files.blakedrumm.com/Install-VSCodeCopilotCouncil-v5.txt){:target="_blank"} - An identical text-format copy of the same script.

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

Tier | Strategy | Expert Calls | Typical Use |
------------- | ----------- | ----------- | ----------- |
Tier&nbsp;0 | Direct answer, no subagents | 0 | Known facts, syntax questions, lookups, and trivial local changes. |
Tier&nbsp;1 | One expert | 1 | A focused task that fits one engineering lens. |
Tier&nbsp;2 | Two experts in parallel | 2 | Shared behavior or a real decision spanning two non-overlapping lenses. |
Tier&nbsp;3 | Adversarial debate with bounded peer review | About 4 | Explicit debate requests, unresolved disagreement, or a hard-to-reverse decision that tools cannot settle. |
Tier&nbsp;4 | One expert per configured model in parallel | Up to 5 | Genuinely independent subsystems, an explicitly requested full team, or a difficult bug that survived a smaller council. |
{: .table .table-hover .table-text .d-block .overflow-auto }

Tier 0 is intentionally the default for most questions. Tiers 3 and 4 are exceptions, not a ceremony applied to every prompt.

The tier rules are coordinator instructions rather than a billing or quota system. The structural limit is at the reviewer layer: reviewer agents have no agent tool and no subagent list, so they cannot continue the chain.

### Announcements and deliberation

Because subagents do the work out of sight, an unannounced fan-out can look like a frozen session. Above Tier 0, the coordinator prints the tier, the reason for it, and the one-line question given to each expert *before* it dispatches anything.

Every answer above Tier 0 also carries a **Council deliberation** section reporting what the experts agreed on, each stance, every conflict, and the specific evidence that settled it. The generated instructions explicitly forbid settling a conflict by counting votes or by naming which model won.

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

### 1. Check for a newer version

On startup the script compares its own `$ScriptVersion` against the published one and prints a link when a newer release exists. It first reads the `tag_name` of the latest GitHub release, and falls back to reading the version constant out of the published script when a repository has no release yet.

The check reads a version string and nothing else. It never downloads or executes remote code, so upgrading stays a deliberate act you perform after reading the diff. A failed or blocked check is logged and does not stop the installation, and `-SkipUpdateCheck` turns it off entirely.

### 2. Discover agent-capable models

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

### 3. Recommend a roster

The picker marks a suggested set with an asterisk and lets you accept the whole thing with `[R]`:

```plaintext
  * [6] Claude Opus 5
  * [9] Gemini 3.1 Pro (Preview)
  * [13] GPT-5.3-Codex
  * [18] GPT-5.6 Sol
  * [20] Grok 4.5
    [C] Enter a custom model name
    [R] Use the recommended set marked with *
```

The recommendation takes the newest model from each vendor that VS Code publishes as `powerful` or `versatile`. Vendor diversity comes first, because a peer review is only genuinely independent across training lineages. Models published as `lightweight` are excluded, since a reduced-size model weakens both its expert seat and its reviewer seat, and the `Auto` router is excluded as a candidate.

Two details matter here:

- Size is read from the `category` field in the model cache rather than guessed from the name. A name like `GPT-5.6 Luna` carries no size hint, and name-based guessing gets it wrong. Name-based rules remain only as a fallback for `-ModelCatalog` or an older cache.
- Version numbers are compared only within a single vendor. Claude 5.0, Gemini 3.1, and GPT 5.6 use unrelated numbering schemes, so nothing in the code claims one vendor outranks another. A vendor the script has never seen is grouped by the leading token of its name so the one-model-per-vendor rule keeps holding.

The picker prints the date the recommendation rule was last revised next to it, so a stale copy of the script is obvious.

### 4. Offer the previous configuration

When an installation already exists in the target agent directory, the installer reads the model list and coordinator model back out of the installed coordinator agent and offers to reuse them. There is no separate state file, so the offer always reflects what is actually installed. With `-NonInteractive` and no `-Models`, the previous configuration is reused automatically.

### 5. Validate the selection

You can select from one to five models. Model names are validated before they are written into YAML front matter, and duplicate names are removed case-insensitively. Model matching is case-sensitive in VS Code, so the installer prefers the catalog spelling when you type a name directly.

Before you confirm, the selection is echoed back with the lens each position will receive:

```plaintext
Selected models:
  Claude Opus 5 - lens: Implementation and correctness
  GPT-5.6 Sol - lens: Architecture and maintainability
```

The script warns when `Auto` is selected as an expert. `Auto` is a router, so multiple experts could be routed to the same underlying model and lose the independence that the council is meant to provide. `Auto` is appropriate for the coordinator when you want VS Code to choose the orchestration model.

### 6. Back up existing files

Before changing an existing agent file or VS Code settings file, the installer creates a timestamped backup under:

```plaintext
~/.copilot/agent-backups/v5_<timestamp>
```

### 7. Enable nested subagents

Unless `-SkipVSCodeSetting` is specified, the script enables:

```json
"chat.subagents.allowInvocationsFromSubagents": true
```

The settings editor accounts for JSON with comments. It masks comments while preserving character positions, updates or inserts the setting, parses the result, and verifies that the final value is `true`.

That setting is global. It enables nested subagents for every agent you use, not only for this council.

### 8. Generate and validate every agent

The installer writes the coordinator, expert, and reviewer files, then validates their names, models, visibility, and allowed agent lists. It also verifies that leaf reviewers cannot delegate and that an expert does not receive its own reviewer when multiple models are configured.

Generated expert and reviewer files left behind by an earlier configuration are backed up and removed from the current target directory.

---

## :wrench: Parameters

Parameter | Description |
------------- | ----------- |
`-Scope` | Install for `User` or `Workspace`. Defaults to `User`. |
`-WorkspacePath` | Workspace root used with `-Scope Workspace`. |
`-Models` | One to five exact model names. Order determines which lens each expert receives. When omitted, the installer prompts when possible. |
`-CoordinatorModel` | Model used by the coordinator. Defaults to the first selected model. |
`-ModelCatalog` | Override model discovery with an explicit list for the interactive picker. |
`-VSCodeSettingsPath` | Use an explicit VS Code `settings.json` path. |
`-SkipVSCodeSetting` | Do not update the nested-subagent VS Code setting. |
`-SkipUpdateCheck` | Do not contact GitHub to compare this copy against the published version. |
`-NonInteractive` | Suppress prompts. Uses the supplied models, an earlier installation in the target directory, or the built-in default pair. |
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
    -Models 'Claude Opus 5', 'Gemini 3.1 Pro (Preview)', 'GPT-5.6 Sol', 'GPT-5.3-Codex', 'Grok 4.5' `
    -CoordinatorModel 'Claude Opus 5' `
    -OpenInVSCode
```

That order assigns implementation to Claude, architecture to Gemini, security to GPT-5.6 Sol, testing to GPT-5.3-Codex, and performance to Grok.

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
- The update check reads a version string only. It never downloads or executes remote code, and a failed check does not stop the installation.
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
- `-NonInteractive` without `-Models` reuses an earlier installation in the target directory when one exists, and otherwise falls back to a built-in default pair that may not be available to every account.
- The recommended set is only as good as the catalog it was detected from. With `-ModelCatalog`, no size categories are available, so the picker falls back to weaker name-based rules.
- Changing from user scope to workspace scope, or the reverse, does not remove files from the old scope.
- The installer adds no automatic commit, push, or pull-request behavior and does not enable global terminal auto-approval.
- The script does not collect telemetry or calculate token savings.

Review the generated files and VS Code settings before using the council in a sensitive repository.

---

## :speech_balloon: Using It Day to Day

For normal work, select **Multi-Model Engineering Council** and ask your engineering question as usual. Before it dispatches anything, the coordinator prints the tier it chose, the trigger that justified it, and the one-line question each expert was given.

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

That restraint is the point of the tier gating. A Tier 4 run puts five frontier models to work in parallel, and a nested review can double a branch, so the coordinator is instructed to start at the lowest tier that can answer correctly. Hover a subagent section in the chat response to see the AI credits it actually used.

---

## :repeat: Interruption and Resume

Sending a steering message mid-run makes the coordinator yield after the tool call that is currently executing, which historically meant a half-finished fan-out was silently abandoned. The coordinator now classifies the interjection instead:

Classification | Meaning | Behavior |
------------- | ----------- | ----------- |
REDIRECT | The goal itself changed. | Outstanding work is dropped, and the coordinator states what it dropped. |
REFINEMENT | The goal stands, but the constraints changed. | Valid expert results are kept, and only the invalidated experts are re-dispatched. |
DETOUR | A genuine side question. | The question is answered, then the original work resumes. |
{: .table .table-hover .table-text .d-block .overflow-auto }

Above Tier 0, the run is tracked as a todo list with one item per dispatched expert plus one for synthesis. The list survives the interruption, so results already in the transcript are reused rather than re-dispatched, and an unfinished turn ends with an explicit outstanding-work block.

If you would rather a run finish before your next message is processed, choose **Add to Queue** from the Send dropdown, or set `chat.requestQueuing.defaultAction` to `queue`.

---

## :wastebasket: Uninstall

The installer writes agent files and one VS Code setting, so removal is manual and complete:

```powershell
Remove-Item "$HOME\.copilot\agents\multi-model-engineering-council.agent.md"
Remove-Item "$HOME\.copilot\agents\mm-expert-*.agent.md"
Remove-Item "$HOME\.copilot\agents\mm-reviewer-*.agent.md"
```

Then set `chat.subagents.allowInvocationsFromSubagents` back to `false` if you want nested subagents disabled, and reload the window. Timestamped backups remain under `~/.copilot/agent-backups` until you delete them.

---

## :page_facing_up: License

VS Code AI Council version 5.5.0 is released under the **MIT License**. The complete license grant and warranty disclaimer are included in the `.NOTES` section of both the `.ps1` and `.txt` distributions, and in [LICENSE](https://github.com/blakedrumm/VSCode-AI-Council/blob/main/LICENSE){:target="_blank"} in the repository.

---

## :checkered_flag: Conclusion

VS Code AI Council turns multiple GitHub Copilot models into an adaptive engineering workflow instead of a permanent panel. Simple work stays simple, complex work can receive focused parallel analysis, and difficult decisions can receive bounded cross-model review.

The installer keeps that structure visible: one coordinator, distinct expert lenses, leaf reviewers, explicit backups, post-install validation, and no unrestricted recursion. That balance is what makes the council useful for regular repository work rather than only for demonstrations.

The script, the changelog, and the license are all on GitHub: [github.com/blakedrumm/VSCode-AI-Council](https://github.com/blakedrumm/VSCode-AI-Council){:target="_blank"}

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/vscode-ai-council/)
