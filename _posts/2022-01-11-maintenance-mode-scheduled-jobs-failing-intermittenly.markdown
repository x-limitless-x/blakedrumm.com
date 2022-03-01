---
layout: post
title:  "Maintenance Schedule Failing Intermittently"
date:   '2022-01-11 16:46:00 -0500'
categories: troubleshooting guides operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/maintenance-mode-schedule.png

summary: I recently had a case where my customer was experiencing an issue with Scheduled Maintenance Mode failing to put objects into maintenance mode intermittently. SCOM 2019 Management Group.

keywords: maintenance mode failing, scheduled maintenance mode failing, maintenance mode issue, maintenance mode not running automatically, maintenance schedules issue, maintenance schedules not running
permalink: /blog/maintenance-mode-scheduled-jobs-failing-intermittently/
---
The customer had setup Maintenance Scheduled Jobs that were to run Daily against a group of servers. This Maintenance Schedule would work as intended for a while (up to a week), but would stop working intermittently. The “Next Run” date/time for the Maintenance Mode Scheduled Job would be empty and to fix this we would need to change, "The schedule is effective beginning” date, to today. Or recreate the maintenance schedule job.

![Maintenance Mode Scheduled Job Properties](/assets/img/posts/maintenance-mode-schedule-properties.png){:class="img-fluid"}

__In order to resolve this issue we had to run the SCOM Console as the SDK (System Center Data Access Service) Account and recreate the Maintenance Scheduled Jobs. This allowed the Maintenance Mode Scheduled jobs to run without any issues.__

## Conclusion
So the issue was due to the users' personal Active Directory account being locked out when setting up the Maintenance Schedule. To resolve we just need to run as the Data Access Service (SDK) Account.

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/maintenance-mode-scheduled-jobs-failing-intermittently/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.
-->
