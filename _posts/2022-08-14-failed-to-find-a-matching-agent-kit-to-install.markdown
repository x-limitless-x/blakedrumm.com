---
layout: post
date:   '2023-08-14 08:02:48 -0500'
title: "UNIX/Linux - Failed to find a matching agent kit to install"
categories: troubleshooting linux operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/RHEL8_unable_to_upgrade.png
toc: true

summary: >- # this means to ignore newlines
  I recently had a customer who opened a case for a problem regarding monitoring RHEL9 Linux Agents via SCOM. We were having trouble with the discovery wizard showing there were not any matching agent kits in SCOM.

keywords: scom, linux, operationsmanager, SCOM 2016, SCOM 2019, SCOM 2022, rhel, redhat, solaris, unix, scxagent, omiagent
permalink: /blog/failed-to-find-a-matching-agent-kit-to-install/
---
## What is the problem?

The latest version of the UNIX/Linux Management Pack does not include a hotfix to allow OpenSSL 3 support in RHEL 9. The KB (5028684) needs to be applied first.

### UNIX/Linux versions
**Linux Agent version:** `1.7.1-0` \
**SCOM 2022 (*10.22.1052.0*):** [https://www.microsoft.com/download/details.aspx?id=104213](https://www.microsoft.com/download/details.aspx?id=104213) \
**SCOM 2019 (*10.19.1226.0*):** [https://www.microsoft.com/download/details.aspx?id=58208](https://www.microsoft.com/download/details.aspx?id=58208) \
**SCOM 2016 (*7.6.1185.0*):** [https://www.microsoft.com/download/details.aspx?id=29696](https://www.microsoft.com/download/details.aspx?id=29696)

![Linux Agent versions](/assets/img/posts/linux-mp-1.7.1-0.png){:class="img-fluid"}

## How to fix
Download the hotfix listed here: \
[https://support.microsoft.com/kb/5028684](https://support.microsoft.com/kb/5028684)

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/failed-to-find-a-matching-agent-kit-to-install//)

<!--
## Welcome to GitHub Pages

You can use the [editor on GitHub](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/edit/master/docs/index.md) to maintain and preview the content for your website in Markdown files.

Whenever you commit to this repository, GitHub Pages will run [Jekyll](https://jekyllrb.com/) to rebuild the pages in your site, from the content in your Markdown files.

### Markdown

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/blakedrumm/SCOM-Scripts-and-SQL/settings/pages). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
