---
layout: post
title: "Test Copy Button"
date: '2026-02-10 12:00:00 -0500'
categories: test
author: blakedrumm
summary: Test post for copy button issue

keywords: test
permalink: /blog/test-copy-button/
---

## Inline code test

This is inline code: `Test-WebConnection` and this is another: `Get-Process`.

The path is `C:\Windows\System32` and the command is `dir /s`.

## Fenced code block test

```powershell
Get-Process | Where-Object { $_.CPU -gt 100 }
```

Another inline: `code here` should not have a copy button.

```bash
echo "Hello World"
```

End of test.
