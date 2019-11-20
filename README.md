## Classes

<dl>
<dt><a href="#CpApiClass">CpApiClass</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#myapisite">myapisite</a></dt>
<dd><p>Variable required from auth/mycpapi.json file</p>
</dd>
<dt><a href="#mycred">mycred</a></dt>
<dd><p>Variable required from auth/mycpauth.json</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#get">get(getProps, usedobj)</a></dt>
<dd><p>Traverse object collected in object</p>
</dd>
<dt><a href="#checkArgs">checkArgs()</a></dt>
<dd><p>Perform a validation check against the command line arguments passed to the application.</p>
</dd>
<dt><a href="#main">main()</a></dt>
<dd><p>Post parameter checks, run the program</p>
</dd>
<dt><a href="#showObjects">showObjects(ip)</a> ⇒ <code><a href="#uid">Array.&lt;uid&gt;</a></code></dt>
<dd><p>Check against the Check Point Management API for host object usage of a specific quad octet IPv4 address</p>
</dd>
<dt><a href="#checkObject">checkObject(uid)</a> ⇒ <code><a href="#uid">Array.&lt;uid&gt;</a></code></dt>
<dd><p>Object verify IP matches filter</p>
</dd>
<dt><a href="#whereUsed">whereUsed(objarr)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Determine where a set of objects is used in Check Point policies</p>
</dd>
<dt><a href="#parseObjectUse">parseObjectUse(objdat)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>For a given set of Check Point objects, search for direct object usage and parse group membership</p>
</dd>
<dt><a href="#getObjectUse">getObjectUse(isused)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Determine where a set of objects is used in Check Point policies</p>
</dd>
<dt><a href="#getUsedObject">getUsedObject(objarr)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Recursively discover the use of a host object against Check Point policy</p>
</dd>
<dt><a href="#getType">getType(myobj)</a> ⇒</dt>
<dd><p>Given a Check Point UID, return the full set of object details via &#39;show-object&#39;</p>
</dd>
<dt><a href="#getRule">getRule(myobj)</a> ⇒</dt>
<dd><p>For a given Check Point host object, call out to the API via &#39;show-access-rule&#39;</p>
</dd>
<dt><a href="#tagObjects">tagObjects(myobj)</a> ⇒ <code>Object</code></dt>
<dd><p>For a given array of Check Point objects, tag the objects for deletion and POST to the API</p>
</dd>
<dt><a href="#doParse">doParse(objdat)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Given a set of objects returns by the Check Point Management API,</p>
</dd>
<dt><a href="#showJson">showJson(obj)</a> ⇒ <code>json</code></dt>
<dd><p>Colored version of the json output</p>
</dd>
<dt><a href="#startSession">startSession(myauth)</a> ⇒ <code>Object</code></dt>
<dd><p>Create an authenticated session with the Check Point Management API</p>
</dd>
<dt><a href="#setSession">setSession(mysession)</a> ⇒</dt>
<dd><p>Set the session token to the headeer for a Check Point Management API connection</p>
</dd>
<dt><a href="#pubSession">pubSession()</a> ⇒ <code>Object</code></dt>
<dd><p>Publish data to the Check Point Management API via a callout to HTTP POST</p>
</dd>
<dt><a href="#endSession">endSession()</a> ⇒ <code>Object</code></dt>
<dd><p>Safely logout from the Check Point Management API, ending the session and expiring the token from header</p>
</dd>
<dt><a href="#callOut">callOut(options, postData)</a> ⇒ <code>*</code></dt>
<dd><p>With given options and HTTP POST data, continue HTTPS requests/resolve until the final response object is reached</p>
</dd>
<dt><a href="#writeJson">writeJson(content)</a></dt>
<dd><p>Write json data passed out to file with a file named by given IP address :a.b.c.d.json&quot;</p>
</dd>
<dt><a href="#sleep">sleep(ms)</a> ⇒ <code>Object</code></dt>
<dd><p>Promise&#39;d sleep function to account for API round trip delays</p>
</dd>
<dt><a href="#countOf">countOf(obj)</a> ⇒ <code>int</code></dt>
<dd><p>Counts the number of keys in use for a given object</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#uid">uid</a> : <code>Array.&lt;Object&gt;</code></dt>
<dd><p>where-used returned data format</p>
</dd>
</dl>

<a name="CpApiClass"></a>

## CpApiClass
**Kind**: global class  
<a name="new_CpApiClass_new"></a>

### new CpApiClass()
Class Method for API callout builder

<a name="myapisite"></a>

## myapisite
Variable required from auth/mycpapi.json file

**Kind**: global constant  

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
<a name="mycred"></a>

## mycred
Variable required from auth/mycpauth.json

**Kind**: global constant  
**Params**: <code>Object</code> credentials - auth/mycpauth.json  
**Example**  
```js
create auth/mycpauth.json file
{
		"user": "apiuser",
		"password": "PASSWORD"
}
```
<a name="get"></a>

## get(getProps, usedobj)
Traverse object collected in object

**Kind**: global function  

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
<a name="checkArgs"></a>

## checkArgs()
Perform a validation check against the command line arguments passed to the application.

**Kind**: global function  
**Example**  
```js
Must be a list of three arguments with a quad-octet formatted IPv4 address
$> node index 1.2.3.4
```
<a name="main"></a>

## main()
Post parameter checks, run the program

**Kind**: global function  
<a name="showObjects"></a>

## showObjects(ip) ⇒ [<code>Array.&lt;uid&gt;</code>](#uid)
Check against the Check Point Management API for host object usage of a specific quad octet IPv4 address

**Kind**: global function  
**Returns**: [<code>Array.&lt;uid&gt;</code>](#uid) - UIDs of direct and indirect object usage  

| Param | Type | Description |
| --- | --- | --- |
| ip | <code>String</code> | IP address to search |

<a name="checkObject"></a>

## checkObject(uid) ⇒ [<code>Array.&lt;uid&gt;</code>](#uid)
Object verify IP matches filter

**Kind**: global function  
**Returns**: [<code>Array.&lt;uid&gt;</code>](#uid) - -  array of safe UID's to verify usage against  

| Param | Type | Description |
| --- | --- | --- |
| uid | <code>Array.&lt;String&gt;</code> | UID to verify IP address filter |

<a name="whereUsed"></a>

## whereUsed(objarr) ⇒ <code>Array.&lt;Object&gt;</code>
Determine where a set of objects is used in Check Point policies

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - An array of objects where the parameter values were found in policy  

| Param | Type | Description |
| --- | --- | --- |
| objarr | <code>Array.&lt;Object&gt;</code> | Any array of objects containing filter values by UID |

<a name="parseObjectUse"></a>

## parseObjectUse(objdat) ⇒ <code>Array.&lt;Object&gt;</code>
For a given set of Check Point objects, search for direct object usage and parse group membership

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - An array of Check Point objects per given UIDs  

| Param | Type | Description |
| --- | --- | --- |
| objdat | <code>Array.&lt;Object&gt;</code> | Array of Check Point objects |

<a name="getObjectUse"></a>

## getObjectUse(isused) ⇒ <code>Array.&lt;Object&gt;</code>
Determine where a set of objects is used in Check Point policies

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - An array of objects where the parameter values were found in policy  

| Param | Type | Description |
| --- | --- | --- |
| isused | <code>Array.&lt;Object&gt;</code> | An Check Point host object array prepared by doParse |

<a name="getUsedObject"></a>

## getUsedObject(objarr) ⇒ <code>Array.&lt;Object&gt;</code>
Recursively discover the use of a host object against Check Point policy

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - An array of objects where the parameter values were found in policy  

| Param | Type | Description |
| --- | --- | --- |
| objarr | <code>Array.&lt;Object&gt;</code> | An Check Point object |

<a name="getType"></a>

## getType(myobj) ⇒
Given a Check Point UID, return the full set of object details via 'show-object'

**Kind**: global function  
**Returns**: The full details version of the Check Point object returned from the API call out  

| Param | Type |
| --- | --- |
| myobj | [<code>uid</code>](#uid) | 

<a name="getRule"></a>

## getRule(myobj) ⇒
For a given Check Point host object, call out to the API via 'show-access-rule'

**Kind**: global function  
**Returns**: The returned set of objects from the doPost callouts to the Check Point Management API  

| Param | Type |
| --- | --- |
| myobj | <code>json</code> | 

<a name="tagObjects"></a>

## tagObjects(myobj) ⇒ <code>Object</code>
For a given array of Check Point objects, tag the objects for deletion and POST to the API

**Kind**: global function  
**Returns**: <code>Object</code> - Returns the session handler after tagging operations are concluded  

| Param | Type | Description |
| --- | --- | --- |
| myobj | <code>Array.&lt;Object&gt;</code> | An array of tags to be added to a Check Point host object |

<a name="doParse"></a>

## doParse(objdat) ⇒ <code>Array.&lt;Object&gt;</code>
Given a set of objects returns by the Check Point Management API,

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - The parsed and prepared Check Point host object array  

| Param | Type | Description |
| --- | --- | --- |
| objdat | <code>\*</code> | An array of objects where the parameter values were already found in policy |

<a name="showJson"></a>

## showJson(obj) ⇒ <code>json</code>
Colored version of the json output

**Kind**: global function  
**Returns**: <code>json</code> - A prettifed version of the json object using prettyjson library  

| Param | Type |
| --- | --- |
| obj | <code>json</code> | 

<a name="startSession"></a>

## startSession(myauth) ⇒ <code>Object</code>
Create an authenticated session with the Check Point Management API

**Kind**: global function  
**Returns**: <code>Object</code> - The prepared session handler  

| Param | Type | Description |
| --- | --- | --- |
| myauth | <code>json</code> | Credentials used for API access |

<a name="setSession"></a>

## setSession(mysession) ⇒
Set the session token to the headeer for a Check Point Management API connection

**Kind**: global function  
**Returns**: No value, returning instruction pointer back to the caller  

| Param | Type | Description |
| --- | --- | --- |
| mysession | <code>Object</code> | A Check Point Management API session handler |

<a name="pubSession"></a>

## pubSession() ⇒ <code>Object</code>
Publish data to the Check Point Management API via a callout to HTTP POST

**Kind**: global function  
**Returns**: <code>Object</code> - mysession A Check Point Management API session handler  
<a name="endSession"></a>

## endSession() ⇒ <code>Object</code>
Safely logout from the Check Point Management API, ending the session and expiring the token from header

**Kind**: global function  
**Returns**: <code>Object</code> - The completed Check Point Management API session handler  
<a name="callOut"></a>

## callOut(options, postData) ⇒ <code>\*</code>
With given options and HTTP POST data, continue HTTPS requests/resolve until the final response object is reached

**Kind**: global function  
**Returns**: <code>\*</code> - Promised version of the data collected from the HTTPS callouts i.e. API object data  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>json</code> | JSON-formatted options to be sent to the Check Point Management API |
| postData | <code>\*</code> | Data to be POST'd against the API |

<a name="writeJson"></a>

## writeJson(content)
Write json data passed out to file with a file named by given IP address :a.b.c.d.json"

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>json</code> | JSON-formatted data to write to file |

<a name="sleep"></a>

## sleep(ms) ⇒ <code>Object</code>
Promise'd sleep function to account for API round trip delays

**Kind**: global function  
**Returns**: <code>Object</code> - The completed promise after x time has passed  

| Param | Type | Description |
| --- | --- | --- |
| ms | <code>int</code> | Number of milliseconds to sleep  by |

<a name="countOf"></a>

## countOf(obj) ⇒ <code>int</code>
Counts the number of keys in use for a given object

**Kind**: global function  
**Returns**: <code>int</code> - The number of keys in use  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The object to be checked |

<a name="uid"></a>

## uid : <code>Array.&lt;Object&gt;</code>
where-used returned data format

**Kind**: global typedef  
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
