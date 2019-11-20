<a name="module_index"></a>

## index

* [index](#module_index)
    * [~CpApiClass](#module_index..CpApiClass)
        * [new CpApiClass()](#new_module_index..CpApiClass_new)
    * [~myapisite](#module_index..myapisite)
    * [~mycred](#module_index..mycred)
    * [~get(getProps, usedobj)](#module_index..get)
    * [~checkArgs()](#module_index..checkArgs)
    * [~main()](#module_index..main)
    * [~showObjects(ip)](#module_index..showObjects) ⇒ <code>Array.&lt;uid&gt;</code>
    * [~checkObject(uid)](#module_index..checkObject) ⇒ <code>Array.&lt;uid&gt;</code>
    * [~whereUsed(objarr)](#module_index..whereUsed) ⇒ <code>Array.&lt;Object&gt;</code>
    * [~parseObjectUse(objdat)](#module_index..parseObjectUse) ⇒ <code>Array.&lt;Object&gt;</code>
    * [~getObjectUse(isused)](#module_index..getObjectUse) ⇒ <code>Array.&lt;Object&gt;</code>
    * [~getUsedObject(objarr)](#module_index..getUsedObject) ⇒ <code>Array.&lt;Object&gt;</code>
    * [~getType(myobj)](#module_index..getType) ⇒
    * [~getRule(myobj)](#module_index..getRule) ⇒
    * [~tagObjects(myobj)](#module_index..tagObjects) ⇒ <code>Object</code>
    * [~doParse(objdat)](#module_index..doParse) ⇒ <code>Array.&lt;Object&gt;</code>
    * [~showJson(obj)](#module_index..showJson) ⇒ <code>json</code>
    * [~startSession(myauth)](#module_index..startSession) ⇒ <code>Object</code>
    * [~setSession(mysession)](#module_index..setSession) ⇒
    * [~pubSession()](#module_index..pubSession) ⇒ <code>Object</code>
    * [~endSession()](#module_index..endSession) ⇒ <code>Object</code>
    * [~callOut(options, postData)](#module_index..callOut) ⇒ <code>\*</code>
    * [~writeJson(content)](#module_index..writeJson)
    * [~sleep(ms)](#module_index..sleep) ⇒ <code>Object</code>
    * [~countOf(obj)](#module_index..countOf) ⇒ <code>int</code>
    * [~uid](#module_index..uid) : <code>Array.&lt;Object&gt;</code>

<a name="module_index..CpApiClass"></a>

### index~CpApiClass
**Kind**: inner class of [<code>index</code>](#module_index)  
<a name="new_module_index..CpApiClass_new"></a>

#### new CpApiClass()
Class Method for API callout builder

<a name="module_index..myapisite"></a>

### index~myapisite
Variable required from auth/mycpapi.json file

**Kind**: inner constant of [<code>index</code>](#module_index)  

| Param | Type | Description |
| --- | --- | --- |
| myapisite | <code>Array.&lt;Object&gt;</code> | Setup API hostname |
| myapisite.apihost | <code>Object</code> | mycpapi.json |

**Example**  
```js
create auth/mycpapi.json file
{
	"chkp": {
		"host": "SET.YOUR.HOSTNAME",
		"port": "443",
		"path": "/web_api",
		"method": "POST",
		"headers": {
			"Content-Type": "application/json"
		}
	}
}
```
<a name="module_index..mycred"></a>

### index~mycred
Variable required from auth/mycpauth.json

**Kind**: inner constant of [<code>index</code>](#module_index)  
**Params**: <code>Object</code> credentials - auth/mycpauth.json  
**Example**  
```js
create auth/mycpauth.json file
{
		"user": "apiuser",
		"password": "PASSWORD"
}
```
<a name="module_index..get"></a>

### index~get(getProps, usedobj)
Traverse object collected in object

**Kind**: inner method of [<code>index</code>](#module_index)  

| Param | Type | Description |
| --- | --- | --- |
| getProps | <code>Array.&lt;String&gt;</code> | Get object proerties and values with arry of filters |
| usedobj | <code>Array.&lt;Object&gt;</code> | Used objects returned in an array of |

**Example**  
```js
collect an array of objects that match search: 
myres = myres.concat(get([uid, '0', 'used-directly', '0', 'objects'], usedobj))
myres = myres.concat(get([uid, '0', 'used-directly', '0', 'access-conrol-rules'], usedobj))
Or get a specific value, like the total count from the API:
myval = get([uid, '0', 'used-directly', '0', 'total'], usedobj)
```
<a name="module_index..checkArgs"></a>

### index~checkArgs()
Perform a check against the command line arguments passed to the application
Must be a list of 3 arguments with a quad-octet formatted IPv4 address

**Kind**: inner method of [<code>index</code>](#module_index)  
<a name="module_index..main"></a>

### index~main()
Post parameter checks, run the program

**Kind**: inner method of [<code>index</code>](#module_index)  
<a name="module_index..showObjects"></a>

### index~showObjects(ip) ⇒ <code>Array.&lt;uid&gt;</code>
Check against the Check Point Management API for host object usage of a specific quad octet IPv4 address

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>Array.&lt;uid&gt;</code> - UIDs of direct and indirect object usage  

| Param | Type | Description |
| --- | --- | --- |
| ip | <code>String</code> | IP address to search |

<a name="module_index..checkObject"></a>

### index~checkObject(uid) ⇒ <code>Array.&lt;uid&gt;</code>
Object verify IP matches filter

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>Array.&lt;uid&gt;</code> - -  array of safe UID's to verify usage against  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>Array.&lt;String&gt;</code> | UID to verify IP address filter |

<a name="module_index..whereUsed"></a>

### index~whereUsed(objarr) ⇒ <code>Array.&lt;Object&gt;</code>
Determine where a set of objects is used in Check Point policies

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>Array.&lt;Object&gt;</code> - An array of objects where the parameter values were found in policy  

| Param | Type | Description |
| --- | --- | --- |
| objarr | <code>Array.&lt;Object&gt;</code> | Any array of objects containing filter values by UID |

<a name="module_index..parseObjectUse"></a>

### index~parseObjectUse(objdat) ⇒ <code>Array.&lt;Object&gt;</code>
For a given set of Check Point objects, search for direct object usage and parse group membership

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>Array.&lt;Object&gt;</code> - An array of Check Point objects per given UIDs  

| Param | Type | Description |
| --- | --- | --- |
| objdat | <code>Array.&lt;Object&gt;</code> | Array of Check Point objects |

<a name="module_index..getObjectUse"></a>

### index~getObjectUse(isused) ⇒ <code>Array.&lt;Object&gt;</code>
Determine where a set of objects is used in Check Point policies

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>Array.&lt;Object&gt;</code> - An array of objects where the parameter values were found in policy  

| Param | Type | Description |
| --- | --- | --- |
| isused | <code>Array.&lt;Object&gt;</code> | An Check Point host object array prepared by doParse |

<a name="module_index..getUsedObject"></a>

### index~getUsedObject(objarr) ⇒ <code>Array.&lt;Object&gt;</code>
Recursively discover the use of a host object against Check Point policy

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>Array.&lt;Object&gt;</code> - An array of objects where the parameter values were found in policy  

| Param | Type | Description |
| --- | --- | --- |
| objarr | <code>Array.&lt;Object&gt;</code> | An Check Point object |

<a name="module_index..getType"></a>

### index~getType(myobj) ⇒
Given a Check Point UID, return the full set of object details via 'show-object'

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: The full details version of the Check Point object returned from the API call out  

| Param | Type |
| --- | --- |
| myobj | <code>uid</code> | 

<a name="module_index..getRule"></a>

### index~getRule(myobj) ⇒
For a given Check Point host object, call out to the API via 'show-access-rule'

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: The returned set of objects from the doPost callouts to the Check Point Management API  

| Param | Type |
| --- | --- |
| myobj | <code>json</code> | 

<a name="module_index..tagObjects"></a>

### index~tagObjects(myobj) ⇒ <code>Object</code>
For a given array of Check Point objects, tag the objects for deletion and POST to the API

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>Object</code> - Returns the session handler after tagging operations are concluded  

| Param | Type | Description |
| --- | --- | --- |
| myobj | <code>Array.&lt;Object&gt;</code> | An array of tags to be added to a Check Point host object |

<a name="module_index..doParse"></a>

### index~doParse(objdat) ⇒ <code>Array.&lt;Object&gt;</code>
Given a set of objects returns by the Check Point Management API,

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>Array.&lt;Object&gt;</code> - The parsed and prepared Check Point host object array  

| Param | Type | Description |
| --- | --- | --- |
| objdat | <code>\*</code> | An array of objects where the parameter values were already found in policy |

<a name="module_index..showJson"></a>

### index~showJson(obj) ⇒ <code>json</code>
Colored version of the json output

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>json</code> - A prettifed version of the json object using prettyjson library  

| Param | Type |
| --- | --- |
| obj | <code>json</code> | 

<a name="module_index..startSession"></a>

### index~startSession(myauth) ⇒ <code>Object</code>
Create an authenticated session with the Check Point Management API

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>Object</code> - The prepared session handler  

| Param | Type | Description |
| --- | --- | --- |
| myauth | <code>json</code> | Credentials used for API access |

<a name="module_index..setSession"></a>

### index~setSession(mysession) ⇒
Set the session token to the headeer for a Check Point Management API connection

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: No value, returning instruction pointer back to the caller  

| Param | Type | Description |
| --- | --- | --- |
| mysession | <code>Object</code> | A Check Point Management API session handler |

<a name="module_index..pubSession"></a>

### index~pubSession() ⇒ <code>Object</code>
Publish data to the Check Point Management API via a callout to HTTP POST

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>Object</code> - mysession A Check Point Management API session handler  
<a name="module_index..endSession"></a>

### index~endSession() ⇒ <code>Object</code>
Safely logout from the Check Point Management API, ending the session and expiring the token from header

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>Object</code> - The completed Check Point Management API session handler  
<a name="module_index..callOut"></a>

### index~callOut(options, postData) ⇒ <code>\*</code>
With given options and HTTP POST data, continue HTTPS requests/resolve until the final response object is reached

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>\*</code> - Promised version of the data collected from the HTTPS callouts i.e. API object data  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>json</code> | JSON-formatted options to be sent to the Check Point Management API |
| postData | <code>\*</code> | Data to be POST'd against the API |

<a name="module_index..writeJson"></a>

### index~writeJson(content)
Write json data passed out to file with a file named by given IP address :a.b.c.d.json"

**Kind**: inner method of [<code>index</code>](#module_index)  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>json</code> | JSON-formatted data to write to file |

<a name="module_index..sleep"></a>

### index~sleep(ms) ⇒ <code>Object</code>
Promise'd sleep function to account for API round trip delays

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>Object</code> - The completed promise after x time has passed  

| Param | Type | Description |
| --- | --- | --- |
| ms | <code>int</code> | Number of milliseconds to sleep  by |

<a name="module_index..countOf"></a>

### index~countOf(obj) ⇒ <code>int</code>
Counts the number of keys in use for a given object

**Kind**: inner method of [<code>index</code>](#module_index)  
**Returns**: <code>int</code> - The number of keys in use  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The object to be checked |

<a name="module_index..uid"></a>

### index~uid : <code>Array.&lt;Object&gt;</code>
where-used returned data format

**Kind**: inner typedef of [<code>index</code>](#module_index)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| used-directly | <code>Object</code> | Direct use of object |
| used-directly.total | <code>Number</code> | Total count of usage |
| used-directly.objects | <code>Array.&lt;Object&gt;</code> | Array of object dependencies |
| used-directly.access-control-rules | <code>Array.&lt;Object&gt;</code> | Array of access rule dependencies |
| used-directly.nat-rules | <code>Array.&lt;Object&gt;</code> | Array of nat rule dependencies |
| used-directly.threat-prevention-rules | <code>Array.&lt;Object&gt;</code> | Array of threat inspection rules |
| used-indirectly | <code>Object</code> | Indirect or nested use of object |
| used-indirectly.total | <code>Number</code> | Total count of indirect use |
| used-indirectly.objects | <code>Array.&lt;Object&gt;</code> | Array of object references |
| used-indirectly.access-control-rules | <code>Array.&lt;Object&gt;</code> | Array of nested access rule |
| used-indirectly.nat-rules | <code>Array.&lt;Object&gt;</code> | Array of indirect nat rules |
| used-indirectly.threat-prevention-rules | <code>Array.&lt;Object&gt;</code> | Array of nested threat rules |

**Example**  
```js
{ ip: [
       {
         uid: [
         	  { 
	          used-directly: {
	       			  total: 0,
	        		  access-control-rules[],
	        		  nat-rules[],
	        		  threat-prevention-rules[],
	        		  objects[]
	        		  },
	      	  used-indirectly: {
	       			  total: 0,
	        		  access-control-rules[],
	        		  nat-rules[],
	        		  threat-prevention-rules[],
	        		  objects[]
	        		  }
             }
          ] 
       }
    ]
 }
```
