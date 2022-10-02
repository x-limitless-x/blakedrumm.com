---
layout: post
date:   '2022-08-17 16:08:58 -0500'
title: "SCOM Uptime Availability Report"
categories: guides operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/uptime-availability-report.png

summary: >- # this means to ignore newlines
  One of my customers needed the uptime report for SCOM Agents in their environment. I couldn't find any good guides so I wrote this one.

keywords: scom, uptime report, operationsmanager, agent uptime report, report uptime, scom agent uptime 
permalink: /blog/scom-uptime-availability-report/
---
In order to properly report on the uptime of a machine, you will need to target the Health Service Watcher object class. This class will allow you to return the availability of the machine itself, and not all of the rollup monitors underneath that may affect the report accuracy.

---

![Open Availability Report](/assets/img/posts/open-availability-report.png){:class="img-fluid"}

1. Open SCOM Console, Click on the *Reporting* tab
2. Click on **Microsoft Generic Report Library**
3. Open the **Availability** Report
4. Add Object: \
![Add object to report](/assets/img/posts/add-object-report.png){:class="img-fluid"}
5. Click on **Options...** -> Click on **Add** -> Type **Health Service Watcher** in the search field -> Add **Health Service Watcher**: \
![Add Health Service Watcher Object Class](/assets/img/posts/add-object-hsw-class.png){:class="img-fluid"}
6. Click OK on the Options Window: \
![Options - Health Service Watcher](/assets/img/posts/health-service-watcher-options.png){:class="img-fluid"}
7. Type in the machines you want to discover (or you can just press search and it will return all related items): \
![Select Health Service Watcher Computer Objects](/assets/img/posts/select-hsw-agentwatcher-objects.png){:class="img-fluid"}
8. Modify the time range and run the report.
9. Resulting output: \
![Availability Report Results](/assets/img/posts/availability-report-output.png){:class="img-fluid"}

> ### :notebook: Note
> Quick tip, you can modify the parameters for the report at any time with the Show or Hide Parameter Area button: \
> ![Show and Hide Parameter in Reports](/assets/img/posts/show-hide-parameter-area-reporting.png){:class="img-fluid"}

---

## Dynamic Agent Health Service Watcher Group

If you would like to make it easier to run the report again, you can create a group for the Health Service Watchers. Just create a group in **Authoring** -> **Groups**, with the following Dynamic Member Rule: \
![Dynamic Member Rule](/assets/img/posts/scom-agent-hsw-group.png){:class="img-fluid"}

**Membership Result:** \
![Membership Result](/assets/img/posts/all-agent-hsw-objects-group.png){:class="img-fluid"}

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/scom-uptime-availability-report/)

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
