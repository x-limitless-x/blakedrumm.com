---
layout: post
title:  "Unix / Linux System Center Operations Manager Agents Troubleshooting Tips"
date:   '2022-01-26 12:21:52 -0500'
categories: troubleshooting linux operationsManager
author: blakedrumm
thumbnail: /assets/img/posts/prerequisite-software-unix-linux.png

summary: Tips and Tricks for troubleshooting SCOM Unix / Linux Agent issues.

keywords: unix linux troubleshooting, scom linux agent, scom solaris agent, scom redhat agent, scom unix agent, operations manager linux, scom troubleshooting, scom linux ciphers, scom linux cipher suite, scom management server ciphers, ciphers, openssl ciphers, ssl ciphers, redhat troubleshooting, solaris troubleshooting, scom troubleshooting
permalink: /blog/scom-unix-linux-troubleshooting-tips/
---
<sub>This post was last updated on October 12th, 2022</sub>
## Build list containing the SCOM Linux Agent versions
The following url contains the versions of the SCX Agent: [https://docs.microsoft.com/system-center/scom/release-build-versions](https://docs.microsoft.com/system-center/scom/release-build-versions)


## Verify the versions for all prerequisite software
You can run the following command on a monitored and not monitored server to compare the software installed, or verify with the official list [https://docs.microsoft.com/system-center/scom/plan-supported-crossplat-os](https://docs.microsoft.com/system-center/scom/plan-supported-crossplat-os):
```shell
rpm -qa | egrep "^glibc|^openssl|^pam|^scx|^omi"
```
<div class="responsive-table">
<table>
      <thead>
        <tr>
          <th scope="col">Agent Version</th>
          <th scope="col">Version</th>
          <th scope="col">Management Group Version</th>
          <th scope="col">Release Date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>scx-1.5.1-242.e16.x86_64</td>
          <td>7.5.1068.0</td>
          <td>SCOM 2012 R2 UR12</td>
          <td>01/27/2017</td>
        </tr>
      </tbody>
    </table>
    </div>

&nbsp;
    
__Working Example:__ \
![Example 2 - Prerequisite Software](/assets/img/posts/prerequisite-software-unix-linux-example2.png){:class="img-fluid"}

__Non-working Example:__ \
![Example 3 - Prerequisite Software](/assets/img/posts/prerequisite-software-unix-linux-example3-notworking.png){:class="img-fluid"}

&nbsp;

___

&nbsp;

## Clearing the System Security Services Daemon (SSSD) Cache
The System Security Services Daemon (SSSD) provides access to identity and authentication providers. Basically rather than relying on locally configured authentication, SSSD is used to lookup its local cache. The entries within this cache may come from different remote identity providers, such as an LDAP directory, Kerberos, or Active Directory for example.

SSSD caches the results of users and credentials from these remote locations so that if the identity provider goes offline, the user credentials are still available and users can still login. This helps to improve performance and facilitates scalability with a single user that can login over many systems, rather than using local accounts everywhere.

The cached results can potentially be problematic if the stored records become stale and are no longer in sync with the identity provider, so it is important to know how to flush the SSSD cache to fix various problems and update the cache.

> ### :notebook: Note
> It’s recommend to only clear the sssd cache if the identity provider servers performing the authentication within the domain are available, otherwise users will not be able to log in once the sssd cache has been flushed.

### Stop SSSD Service
```
Service sssd stop; 
```

### Clear SSSD Cache
```
rm -rf /var/lib/sss/db/*; 
```

### Start SSSD Service
```
service sssd start
```

SSSD should now start up correctly with an empty cache, any user login will now first go directly to the defined identity provider for authentication, and then be cached locally afterwards.

&nbsp;

___

&nbsp;

## Tail the Logs
### Enable Verbose SCX Logs
Use the below command to enable verbose logging for the SCX Provider:
```shell
scxadmin -log-set all verbose
```

### Enable Verbose logging for OMI Server
Use the below command to modify the omiserver.conf file. Change loglevel to one of the following valid options, verbose being highest:
**ERROR, WARNING, INFO, DEBUG, VERBOSE**
```shell
sudo vim /etc/opt/omi/conf/omiserver.conf
```

If loglevel does not exist in the file you can add the following lines to the file and change the loglevel value
```shell
##
## loglevel -- set the loggiing options for OMI server
##   Valid options are: ERROR, WARNING, INFO, DEBUG, VERBOSE (debug build)
##   If commented out, then default value is: WARNING
##
loglevel = INFO
```

After saving and quitting vim, restart the service with below command for logging to be enabled
```shell
sudo /opt/omi/bin/service_control restart
```

### Secure Log
You can run the following command to show current log data pertaining to authentication and authorization privileges:
```shell
tail -f /var/log/secure
```

### Messages Log
You can run the following command to show all the global system messages, including the messages that are logged during system startup:
```shell
tail -f /var/log/messages
```

### OMI
#### Server Log
```shell
tail -f /var/opt/microsoft/scx/log/omiserver.log
```

#### Agent Log
```shell
tail -f /var/opt/microsoft/scx/log/omiagent.root.root.log
```

### SCX
#### Agent Log
```shell
tail -f /var/opt/microsoft/scx/log/scx.log
```

&nbsp;

___

&nbsp;

## Verify OpenSSL s_client
The OpenSSL s_client command is a helpful test client for troubleshooting remote SSL or TLS connections:
```shell
openssl s_client -connect server.domain.com:1270
openssl s_client -connect server.domain.com:1270 -tls1
openssl s_client -connect server.domain.com:1270 -ssl3
```

&nbsp;

___

&nbsp;

## Get MB / GB size of file
Run the following command to gather the MB / GB size of a file:
```shell
du -sh /var/opt/microsoft/scx/log/scx.log
```

&nbsp;

___

&nbsp;

## WinRM Enumerate SCX Agent
From the Management Server(s) in the Unix/Linux Resource Pool, verify that the following command resolves correctly:

### Basic Authentication
```cmd
winrm enumerate http://schemas.microsoft.com/wbem/wscim/1/cim-schema/2/SCX_Agent?__cimnamespace=root/scx -username:<username> -password:<password> -r:https://<LINUXSERVERFQDN>:1270/wsman -auth:basic -skipCAcheck -skipCNcheck -skipRevocationcheck -encoding:utf-8
```

### Kerberos Authentication
```cmd
winrm e http://schemas.microsoft.com/wbem/wscim/1/cim-schema/2/SCX_Agent?__cimnamespace=root/scx -r:https://<LINUXSERVERFQDN>:1270 -u:<username@contoso.com> -p:<password> -auth:Kerberos -skipcacheck -skipcncheck -encoding:utf-8

```

> ### :notebook: Note
> Verify that you have enabled Kerberos via the Management Server Registry on each Management Server in the resource pool you are using to monitor the Unix/Linux agents: [https://docs.microsoft.com/system-center/scom/manage-linux-kerberos-auth](https://docs.microsoft.com/system-center/scom/manage-linux-kerberos-auth)

#### Example 1
##### Issue
You may experience an error that contains the following when running the above Commands:
```
WSManFault
    Message = The server certificate on the destination computer (<LINUXSERVERFQDN>:1270) has the following errors:
Encountered an internal error in the SSL library.
Error number:  -2147012721 0x80072F8F
A security error occurred
```
or this error via the Discovery Wizard:
```
Agent verification failed. Error detail: The server certificate on the destination computer (<LINUXSERVERFQDN>:1270) has the following errors:
Encountered an internal error in the SSL library.
It is possible that:
   1. The destination certificate is signed by another certificate authority not trusted by the management server.
   2. The destination has an invalid certificate, e.g., its common name (CN) does not match the fully qualified domain name (FQDN) used for the connection.  The FQDN used for the connection is: <LINUXSERVERFQDN>.
   3. The servers in the resource pool have not been configured to trust certificates signed by other servers in the pool.
The server certificate on the destination computer (<LINUXSERVERFQDN>:1270) has the following errors:
Encountered an internal error in the SSL library.
It is possible that:
   1. The destination certificate is signed by another certificate authority not trusted by the management server.
   2. The destination has an invalid certificate, e.g., its common name (CN) does not match the fully qualified domain name (FQDN) used for the connection.  The FQDN used for the connection is: <LINUXSERVERFQDN>.
   3. The servers in the resource pool have not been configured to trust certificates signed by other servers in the pool.
```

##### Resolution
You could potentially import (**Merge**) the below known working ciphers by copying the text to a new file on your server called `example.reg`, right click and Merge the file into your registry:
```
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Cryptography\Configuration\SSL\00010002]
"Functions"="TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384_P256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384_P384,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384_P521,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256_P256,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256_P384,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256_P521,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA_P256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA_P384,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA_P521,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA_P256,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA_P384,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA_P521,TLS_DHE_RSA_WITH_AES_256_GCM_SHA384,TLS_DHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384_P384,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384_P521,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256_P256,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256_P384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256_P521,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384_P384,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384_P521,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256_P256,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256_P384,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256_P521,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA_P256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA_P384,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA_P521,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA_P256,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA_P384,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA_P521,TLS_DHE_RSA_WITH_AES_256_CBC_SHA,TLS_DHE_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA256,TLS_RSA_WITH_AES_128_CBC_SHA256"
```

> ### :notebook: Note
> Be sure to verify if the Linux agent supports the same ciphers as the Management Server / Gateway.
> List of Ciphers Supported for Linux / Unix SCOM Agents: [https://docs.microsoft.com/system-center/scom/manage-security-crossplat-config-sslcipher#cipher-suite-support-matrix](https://docs.microsoft.com/system-center/scom/manage-security-crossplat-config-sslcipher#cipher-suite-support-matrix)

&nbsp;

___

&nbsp;

## Certificate Troubleshooting

> ### UNIX/Linux Certificate
> #### Check Certificate
> ```
> openssl x509 -in /etc/opt/omi/ssl/omi.pem -text -noout
> ```
> #### Generate Certificate with custom name
> ```
> /opt/microsoft/scx/bin/tools/scxsslconfig -f -d contoso.com -h redhat
> ```
> #### Generate Certificate
> ```
> /opt/microsoft/scx/bin/tools/scxsslconfig -f
> ```
> #### Remove Old Certificate
> ```
> rm /etc/opt/omi/ssl/omikey.pem --force
> ```

&nbsp;

> ### Configure the Xplat certificates (export/import) for each management server in the resource pool
> The below steps show how to configure Xplat certificates easily for Management Servers with Powershell. You can automate this process for as many management servers as you need!
> #### Windows Management Server Commands
> ##### Export Certificate On MS1 (Admin Powershell Prompt)
> ```
> & 'C:\Program Files\Microsoft System Center\Operations Manager\Server\scxcertconfig.exe' -export \\MS2\c$\MS1.cer
> ```
> ##### Export Certificate On MS2 (Admin Powershell Prompt)
> ```
> & 'C:\Program Files\Microsoft System Center\Operations Manager\Server\scxcertconfig.exe' -export \\MS1\c$\MS2.cer
> ```
> &nbsp;
> ##### Import Certificate On MS1 (Admin Powershell Prompt)
> ```
> & 'C:\Program Files\Microsoft System Center\Operations Manager\Server\scxcertconfig.exe' -import \\MS1\c$\MS2.cer
> ```
> ##### Import Certificate On MS2 (Admin Powershell Prompt)
> ```
> & 'C:\Program Files\Microsoft System Center\Operations Manager\Server\scxcertconfig.exe' -import \\MS2\c$\MS1.cer
> ```

&nbsp;

> ### Location for Certificates
> #### SCOM 2012 Linux Agent:
> ```
> /etc/opt/microsoft/scx/ssl/scx.pem
> /etc/opt/microsoft/scx/ssl/scx-host-<HostName>.pem
> ```
> &nbsp;
> #### SCOM 2016 Linux Agent and newer:
> ```
> /etc/opt/omi/ssl/omi.pem
> /etc/opt/omi/ssl/omi-host-<HostName>.pem
> ```

&nbsp;

___

&nbsp;

## Linux Agent Certificate Hostname Detection steps during initial Installation
The following steps are what happens (from a high level) during initial installation of the Linux / Unix Agent to generate a Certificate for the Agent.
1. Try `hostname -f` (this will fail on some Linux systems)
2. Attempt to obtain the domain name from `/etc/resolve.conf`
3. Attempt to obtain long hostname with `nslookup` command

&nbsp;

___

&nbsp;

## Purge SCX Agent Installation
On the Unix/Linux Machine run the following command to uninstall and purge the SCOM Linux Agent installation:
```shell
sh ./scx-<version>.<type>.<version>.<arch>.sh --purge --force
```

![Page Views](https://counter.blakedrumm.com/count/tag.svg?url=blakedrumm.com/blog/scom-unix-linux-troubleshooting-tips/)

<!--
Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

Tip:
To add auto-size pictures:
![/assets/img/posts/example.jpg](/assets/img/posts/example.jpg){:class="img-fluid"}
-->
