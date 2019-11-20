/** 
 * cprest client access for API 
 * @module index
 * @requires fs
 * @requires https
 * @requires ip-utils From NMPJS.org
 * @requires ./auth/mycpapi.json A local config file
 * @requires ./auth./mycpsite.json A local config file
 * */
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
'use strict'
const https = require('https')
const fs = require('fs');
const ipUtil = require('ip-utils')

/**
 * Traverse object collected in object
 * @param {String[]} getProps - Get object proerties and values with arry of filters
 * @param {Object[]} usedobj - Used objects returned in an array of
 * @example
 * collect an array of objects that match search: 
 * myres = myres.concat(get([uid, '0', 'used-directly', '0', 'objects'], usedobj))
 * myres = myres.concat(get([uid, '0', 'used-directly', '0', 'access-conrol-rules'], usedobj))
 * Or get a specific value, like the total count from the API:
 * myval = get([uid, '0', 'used-directly', '0', 'total'], usedobj)
 */ 
const get = (p, o) =>
  p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o)

/**
 * Variable required from auth/mycpapi.json file
 * @param {Object[]} myapisite - Setup API hostname
 * @param {Object} myapisite.apihost - mycpapi.json
 * @example
 * create auth/mycpapi.json file
 * {
 *	"chkp": {
 *		"host": "SET.YOUR.HOSTNAME",
 *		"port": "443",
 *		"path": "/web_api",
 *		"method": "POST",
 *		"headers": {
 *			"Content-Type": "application/json"
 *		}
 *	}
 * }
 */
const myapisite = require('./auth/mycpapi')

/**
 * Variable required from auth/mycpauth.json
 * @params {Object} credentials - auth/mycpauth.json
 * @example 
 * create auth/mycpauth.json file
 * {
 *		"user": "apiuser",
 *		"password": "PASSWORD"
 * }
 */
const mycred = require('./auth/mycpauth')

/**
 * Class Method for API callout builder
 * @class
 *
 */
const CpApiClass = require('./cpclass')
const toApi = new CpApiClass(myapisite.chkp)

var details = 'uid'

//var objarr = []
//var objdata = {}

var usedobj = {}
var cleanobj = {}
var allobjs = {}
var mygroups = 'group'
allobjs[mygroups] = []
var myuids = 'object'
allobjs[myuids] = []
var myrules = 'access-rule'
allobjs[myrules] = []

var cleangroups = []
//var myuids = []
//var myrules = []
//var myres = {}
//const objdata = {}

var limit = '500'
var runcmd = 'show-objects'

var sessionid = {}
var myfilename = 'dump'

var nodata = {}
/**
 * Perform a check against the command line arguments passed to the application
 * Must be a list of 3 arguments with a quad-octet formatted IPv4 address
 * @function checkArgs
 */
function checkArgs() {
	try {
		if (process.argv[2] && process.argv.length == 3) {	//Arguments must of length 3
			ip = process.argv[2]			//Grab the third argument
			if (ipUtil.isValidIpv4(ip)) {	//Check for valid IPv4 quad-octet
				nodata.filter = ip			//Set the string value of filter as the IP address
				myfilename = ip				//Filenaming for json output
				nodata['ip-only'] = true	//Set ip-only flag to true
				nodata.type = 'host'		//Set object type to "host" only
				usedobj[ip] = []	
				main()						//Run the app
			}
			else throw new Error("FAILURE: Not a quad-octet IPv4 address")
		} else throw new Error("FAILURE: Application arguments list must be of length 3")
	} catch (err) {
		console.log(err.message)
		console.log(process.argv)
		console.log('\nUSAGE INSTRUCTIONS\n\t$> node index a.b.c.d')
		process.exit(1)
	}
}
checkArgs()
//.then(admins)

/**
 * Post parameter checks, run the program
 * @function main
 */
async function main() {
	startSession(mycred)
		.then(sessiontoken => setSession(sessiontoken))
		.then(() => showObjects(nodata, runcmd))
		.then(objid => checkObject(objid))
		.then(clean => whereUsed(clean))
		.then(myuse => doParse(myuse))
		.then(inuse => parseObjectUse(inuse))
		.then(tagit => tagObjects(tagit))
		.then(() => parseRuleUse(cleanobj))
		.then(myout => writeJson(myout))
		.then(() => endSession())
		.then(exitstat => console.log(exitstat))
		//.then(thindat => console.log(thindat))
	.catch(endSession)
}

async function admins() {
	mycred.domain = 'System Data'
	details = 'standard'
	runcmd = 'show-administrators'
	myfilename = 'admins'
	nodata = {}
	startSession(mycred)
	.then(sessiontoken => setSession(sessiontoken))
	.then(() => showObjects(nodata, runcmd))
	.then(myout => writeJson(myout))
	.then(thindat => console.log(thindat))
	.then(() => endSession())
	.catch(endSession)
}

/** 
 * Check against the Check Point Management API for host object usage of a specific quad octet IPv4 address 
 * @function showObjects
 * @param {String} ip - IP address to search 
 * @returns {uid[]} UIDs of direct and indirect object usage
 */

async function showObjects(mydata, mycmd) {
	try {
		var objdata = {}
		var objarr = []
		var cleanarr = []
		mydata.offset = 0
		mydata['details-level'] = details
		mydata.limit = limit
		console.log('showing session')
		var setit = toApi.doPost(mydata, mycmd)
		//toApi.showOpt()
		objdata = await callOut(setit.options, setit.postData)
		objarr = objarr.concat(objdata.objects)
		if (objdata.total > objdata.to) {
			while (objdata.total >= mydata.offset) {
				console.log('From ' + objdata.from + ' to ' + objdata.to + ' of ' + objdata.total + ' indexed')
				mydata.offset = Number(objdata.to)
				setit = toApi.doPost(mydata, mycmd)
				objdata = await callOut(setit.options, setit.postData)
				objarr = objarr.concat(objdata.objects)
			}
		}
		return objarr
	} catch (err) {
			console.log('error in showObjects : ' + err)
	}
}

/** 
 * Object verify IP matches filter
 * @function checkObject
 * @param {String[]} uid - UID to verify IP address filter
 * @returns {uid[]} -  array of safe UID's to verify usage against
 */
async function checkObject(objarr) {
	try {
		var mydata = {}
		var mytagged = []
		mycmd = 'show-object'
		//mydata['details-level'] = details
		for (var x in objarr) {
			let myobj = objarr[x]
			mydata.uid = myobj
			var setit = toApi.doPost(mydata, mycmd)
			let indat = await callOut(setit.options, setit.postData)
			if (indat.object['ipv4-address'] === ip) {
				console.log(indat.object.uid)
				mytagged = mytagged.concat(indat.object)
				allobjs[myuids] = allobjs[myuids].concat(indat.object.uid)
			} else {
				throw new Error(indat.object.uid + ' object IP ' + indat.object['ipv4-address'] + ' does not match filter : ' + ip)
			}
		}
		let tagdata = await tagObjects(mytagged)
		return allobjs[myuids]
	} catch (err) {
		console.log('error in checkObject : ' + err)
	}
}

/**
 * where-used returned data format
 * @typedef {Object[]} uid - Array of Host objects by UID
 * @property {Object} used-directly - Direct use of object
 * @property {Number} used-directly.total - Total count of usage
 * @property {Object[]} used-directly.objects - Array of object dependencies
 * @property {Object[]} used-directly.access-control-rules - Array of access rule dependencies
 * @property {Object[]} used-directly.nat-rules - Array of nat rule dependencies
 * @property {Object[]} used-directly.threat-prevention-rules - Array of threat inspection rules
 * @property {Object} used-indirectly - Indirect or nested use of object
 * @property {Number} used-indirectly.total - Total count of indirect use
 * @property {Object[]} used-indirectly.objects - Array of object references
 * @property {Object[]} used-indirectly.access-control-rules - Array of nested access rule 
 * @property {Object[]} used-indirectly.nat-rules - Array of indirect nat rules
 * @property {Object[]} used-indirectly.threat-prevention-rules - Array of nested threat rules
 * @example 
 * { ip: [
 *        {
 *          uid: [
 *          	  { 
 * 	          used-directly: {
 * 	       			  total: 0,
 * 	        		  access-control-rules[],
 * 	        		  nat-rules[],
 * 	        		  threat-prevention-rules[],
 * 	        		  objects[]
 * 	        		  },
 * 	      	  used-indirectly: {
 * 	       			  total: 0,
 * 	        		  access-control-rules[],
 * 	        		  nat-rules[],
 * 	        		  threat-prevention-rules[],
 * 	        		  objects[]
 * 	        		  }
 *              }
 *           ] 
 *        }
 *     ]
 *  }
 */

 /**
  * Determine where a set of objects is used in Check Point policies
  * @function whereUsed
  * @param {Object[]} objarr Any array of objects containing filter values by UID
  * @return {Object[]} An array of objects where the parameter values were found in policy
  */ 
async function whereUsed(objarr) {
	try {
		var mydata = {}
		mycmd = 'where-used'
                mydata['details-level'] = details
                mydata.indirect = true
		for (var x in objarr) {
			let myreturn = {}
			mydata.uid = objarr[x]
                	var setit = toApi.doPost(mydata, mycmd)
                	myreturn[objarr[x]] = await callOut(setit.options, setit.postData)
                	usedobj[ip] = usedobj[ip].concat(myreturn)
		}
                //usedobj[ip] = usedobj[ip].concat(myreturn)
		return usedobj
	} catch (err) {
		console.log('error in whereUsed : ' + err)
	}
}

/**
 * For a given set of Check Point objects, search for direct object usage and parse group membership
 * @function parseObjectUse
 * @param {Object[]} objdat Array of Check Point objects
 * @return {Object[]} An array of Check Point objects per given UIDs 
 */
async function parseObjectUse(objdat) {
	try {
		var myres = []
		var myret = []
		Object.keys(objdat).forEach(uid => {	//For each UID, concatenate a response of all reference of used-directly
			//myres = myres.concat(get([uid, '0', 'used-directly', '0', 'objects'], usedobj[ip][uid]))
			myres = myres.concat(get([uid, '0', 'used-directly', '0', 'objects'], objdat))
			//myres['access'] = myres['access'].concat(get([uid, '0', 'used-directly', '1', 'access-control-rules', '0'], objdat))
			//myres = myres.concat(objdat)
		});
		//let unique = [...new Set(myres)]
		myres = [...new Set(myres)]
		for (var x in myres) {	
			let mychk = await getType(myres[x])
			if (mychk.type === 'group') {	//If object returned is a group, must parse through group membership
				let mygrp = {}
				mygrp.type = mychk.type
				mygrp.uid = mychk.uid
				myret = myret.concat(mygrp)
				let memarr = []
				Object.values(mychk.members).forEach(gmem => {	//For every group member identified	
					memarr = memarr.concat(gmem.uid)			//Concatenate all members' UIDs into the array
				});
				let smembers = memarr.filter(x => allobjs[myuids].includes(x))	
				let members = {}
				members.remove = smembers.join()
				mygrp.members = members
				allobjs[mygroups] = allobjs[mygroups].concat(mygrp)
				//let smembers = mychk.members.filter(x => allobjs[myuids].includes(x))
				//if (mychk.length > 0) {
					//console.log(mychk)
				//}
			}
		}
		return myret
	} catch (err) {
		console.log('error in parseObjectUse : ' + err)
	}
}


async function parseRuleUse(objdat) {
	try {
		var myres = []
		Object.keys(objdat).forEach(uid => {
			//myres = myres.concat(get([uid, '0', 'used-directly', '0', 'objects'], usedobj[ip][uid]))
			myres = myres.concat(get([uid, '0', 'used-directly', '1', 'access-control-rules'], objdat))
			//myres['access'] = myres['access'].concat(get([uid, '0', 'used-directly', '1', 'access-control-rules', '0'], objdat))
			//myres = myres.concat(objdat)
		});
		//let unique = [...new Set(myres)]
		//myres = [...new Set(myres)]
		for (var x of myres) {
			if (x) {
				let rule = {}
				rule.uid = x.rule
				rule.layer = x.layer
				let ruleobj = await getRule(rule)
				//console.log(drule.uid)
				//console.log(cleangroups)
				let rulechk = {}
				rulechk.uid = ruleobj.uid
				rulechk.layer = ruleobj.layer
				//rulechk.name = ruleobj.name
				let sremove = ruleobj.source.filter(x => allobjs[myuids].includes(x))
				if (sremove.length > 0) {
					console.log(sremove + ' src remove ' + sremove.length)
					let source = {}
					source.remove = sremove.join()
					rulechk.source = source
				}
				//rulechk.source = remove
				//rulechk.oldsource = ruleobj.source
				let dremove = ruleobj.destination.filter(x => allobjs[myuids].includes(x))
				if (dremove.length > 0) {
					console.log(dremove + ' dst remove ' + dremove.length)
					let destination = {}
					destination.remove = dremove.join()
					rulechk.destination = destination
				}
				//rulechk.olddestination = ruleobj.destination
				allobjs[myrules] = allobjs[myrules].concat(rulechk)
			}
		}
		//	let mychk = await getType(myres[x])
		//	if (mychk.type === 'group') {
				//let mygrp = {}
				//mygrp.type = mychk.type
		//		mygrp.uid = mychk.uid
		//		myret = myret.concat(myres[x])
		//}
		return allobjs
	} catch (err) {
		console.log('error in parseRuleUse : ' + err)
	}
}

 /**
  * Determine where a set of objects is used in Check Point policies
  * @function getObjectUse 
  * @param {Object[]} isused An Check Point host object array prepared by doParse
  * @return {Object[]} An array of objects where the parameter values were found in policy
  */
async function getObjectUse(isused) {
	try {
		var myres = []
		const myid = {}
		var myuse = []
		Object.keys(isused).forEach(uid => {
			myres = myres.concat(get([uid, '0', 'used-directly', '0', 'objects'], isused))
		});
		let unique = [...new Set(myres)]
		myuse = myuse.concat(await getUsedObject(unique))
		let tagdata = await tagObject(myuse)
		return myuse
	} catch (err) {
		console.log('error in getObjectUse : ' + err)
	}
}

 /**
  * Recursively discover the use of a host object against Check Point policy
  * @function getUsedObject 
  * @param {Object[]} objarr An Check Point object 
  * @return {Object[]} An array of objects where the parameter values were found in policy
  */
async function getUsedObject(objarr) {
	try {
		var mydata = {}
		var myreturn = []
		mycmd = 'show-object'
                //mydata['details-level'] = details
		for (var x in objarr) {
			let myobj = objarr[x]
			mydata.uid = myobj
			var setit = toApi.doPost(mydata, mycmd)
			let indat = await callOut(setit.options, setit.postData)
			//console.log(indat.object.type)
			myreturn = myreturn.concat(indat.object)
		}
		return myreturn
	} catch (err) {
		console.log('error in getUsedObject : ' + err)
	}
}

/**
 * Given a Check Point UID, return the full set of object details via 'show-object'
 * @function getType
 * @param {uid} myobj 
 * @return The full details version of the Check Point object returned from the API call out
 */
async function getType(myobj) {
	try {
		var mydata = {}
		mycmd = 'show-object'
        mydata['details-level'] = 'full'	//Modify details level to full
		mydata.uid = myobj
        var setit = toApi.doPost(mydata, mycmd)
        let indat = await callOut(setit.options, setit.postData)
		//console.log(indat.object.type)
		return await indat.object
	} catch (err) {
		console.log('error in getType : ' + err)
	}
}

/**
 * For a given Check Point host object, call out to the API via 'show-access-rule'
 * @function getRule
 * @param {json} myobj 
 * @return The returned set of objects from the doPost callouts to the Check Point Management API
 */
async function getRule(myobj) {
	try {
		mycmd = 'show-access-rule'
        myobj['details-level'] = details
        var setit = toApi.doPost(myobj, mycmd)		
        //let indat = await callOut(setit.options, setit.postData)
		//console.log(indat.object.type)
		//return await indat
		return await callOut(setit.options, setit.postData)
	} catch (err) {
		console.log('error in getRule : ' + err)
	}
}

/** 
 * For a given array of Check Point objects, tag the objects for deletion and POST to the API
 * @function tagObjects 
 * @param {Object[]} myobj An array of tags to be added to a Check Point host object
 * @return {Object} Returns the session handler after tagging operations are concluded
 */
async function tagObjects(myobj) {
	try {
		var tags = {}
		tags.add = 'DELETE'
		var mydata = {}
		var myreturn = []
        //mydata['details-level'] = details
		for (var x in myobj) {	//For each object to be tagged
			mydata.uid = myobj[x].uid
			mydata.tags = tags
			mycmd = 'set-' + myobj[x].type
			var setit = toApi.doPost(mydata, mycmd)
			let indat = await callOut(setit.options, setit.postData)
			//console.log(mycmd)
			//console.log(mydata)
			myreturn = myreturn.concat(indat)
		}
		let mypub = await pubSession()
		return mypub
	} catch (err) {
		console.log('error in tagObject : ' + err)
	}
}

/**
 * Given a set of objects returns by the Check Point Management API, 
 * @function doParse 
 * @param {*} objdat An array of objects where the parameter values were already found in policy
 * @return {Object[]} The parsed and prepared Check Point host object array
 */
async function doParse(objdat) {
	try {
		//const myres = {}
		console.log('Doing Search of IP : ' + ip)
		console.log('Number of host objects: ' + Object.values(objdat[ip]).length)
		Object.keys(objdat[ip]).forEach(uid => {
			Object.keys(objdat[ip][uid]).forEach(usetype => {
				console.log(usetype)
				cleanobj[usetype] = []
				Object.keys(objdat[ip][uid][usetype]).forEach(used => {
					var myres = {}
					myres[used] = []
					//console.log(used + ' : ')
					if (objdat[ip][uid][usetype][used]['total'] > 0) {
						mytotal = objdat[ip][uid][usetype][used]['total']
						console.log(used + ' : ' + objdat[ip][uid][usetype][used]['total'])
						Object.keys(objdat[ip][uid][usetype][used]).forEach(arrs => {
							//console.log(arrs + ' ' + Object.keys(objdat[ip][uid][usetype][used][arrs]).length)
							if (Object.keys(objdat[ip][uid][usetype][used][arrs]).length > 0) {
								let myarrs = {}
								myarrs[arrs] = []
								let mycnt = Object.keys(objdat[ip][uid][usetype][used][arrs]).length
								//console.log(Object.keys(objdat[ip][uid][usetype][used][arrs]))
								//console.log(objdat[ip][uid][usetype][used][arrs])
								console.log(mycnt + ' ' + arrs )
								myarrs[arrs] = myarrs[arrs].concat(objdat[ip][uid][usetype][used][arrs])
								myres[used] = myres[used].concat(myarrs)
							}
						});
						cleanobj[usetype] = cleanobj[usetype].concat(myres)
					}
				});
			});
			console.log('---')
		});
		console.log('returning object data')
		return cleanobj
	} catch (err) {
		console.log('error in doParse : ' + err)
	}
}
/** 
 * Colored version of the json output
 * @function showJson
 * @param {json} obj 
 * @return {json} A prettifed version of the json object using prettyjson library
 */
async function showJson(obj) {
    return (showpretty.render(obj, {
              keysColor: 'blue',
              dashColor: 'white',
              stringColor: 'green'
    }));
}

/**
 * Create an authenticated session with the Check Point Management API
 * @function startSession 
 * @param {json} myauth Credentials used for API access
 * @return {Object} The prepared session handler
 */
async function startSession(myauth) {
        try {
                console.log('starting session')
                var setit = toApi.doPost(myauth, 'login')
		//toApi.showOpt()
                sessionid = await callOut(setit.options, setit.postData)
                return sessionid
        } catch (err) {
                console.log('error in startSession')
                console.log(err)
        }
}

/**
 * Set the session token to the headeer for a Check Point Management API connection
 * @function setSession 
 * @param {Object} mysession A Check Point Management API session handler
 * @return No value, returning instruction pointer back to the caller
 */
async function setSession(mysession) {
	try {
		console.log('setting session')
		toApi.setToken(mysession)
		//toApi.showOpt()
		return
	} catch (err) {
		console.log('error in setSession\n' + err)
	}
}

/**
 * Publish data to the Check Point Management API via a callout to HTTP POST
 * @function pubSession 
 * @return {Object} mysession A Check Point Management API session handler
 */
async function pubSession() {
	try {
		console.log('publishing session')
		var mycmd = 'publish'	//change command to publish
		var nodata = {}
		var mysession = await callOut(toApi.doPost(nodata, mycmd).options, toApi.doPost(nodata, mycmd).postData)
		//toApi.showOpt()
		await sleep(3000)	//Self-imposed rate limiting, just wait...
		return mysession
	} catch (err) {
		console.log('error in pubSession : ' + err)
	}
}

/**
 * Safely logout from the Check Point Management API, ending the session and expiring the token from header
 * @function endSession 
 * @return {Object} The completed Check Point Management API session handler
 */
async function endSession() {
	try {
		console.log('ending session')
		var nodata = {}
		var nosession = await callOut(toApi.doPost(nodata, 'logout').options, toApi.doPost(nodata, 'logout').postData)
		//toApi.showOpt()
		return nosession
	} catch (err) {
		console.log('error in endSession : ' + err)
	}
}

/**
 * With given options and HTTP POST data, continue HTTPS requests/resolve until the final response object is reached
 * @function callOut
 * @param {json} options JSON-formatted options to be sent to the Check Point Management API
 * @param {*} postData Data to be POST'd against the API
 * @return {*} Promised version of the data collected from the HTTPS callouts i.e. API object data
 */
async function callOut(options, postData) {
    return new Promise((resolve, reject) => {
		var req = https.request(options, (res) => {
			var myret = ''
			if (res.statusCode > 200)	//Anything but HTTP 200? Write out the error for review
				process.stdout.write(res.statusCode + ' : ' + res.statusMessage + ' ' + options.path);
			res.on('data', (d) => {		//More data in response, keep adding to myret
				myret += d
			});
			res.on('end', () => {		//End of response, parse the returned data to JSON
				resolve(JSON.parse(myret))
			});
		});
		req.on('error', (e) => {
			reject(e);
		});
		if (postData)
			req.write(postData);
		req.end();
    })
}

/**
 * Write json data passed out to file with a file named by given IP address :a.b.c.d.json"
 * @function writeJson
 * @param {json} content JSON-formatted data to write to file
 */
async function writeJson (content) {
        try {
                var newfile = myfilename + '.json'
		console.log('writing file . . . ' + newfile)
		console.log(typeof content)
                const data = await fs.writeFileSync(newfile, JSON.stringify(content, undefined, 2))
                //file written successfully
		console.log(content)
                console.log('Json data written to ' + newfile)
                console.log('  --  ')
                return content
        } catch (err) {
                console.error(err)
        }
}

/**
 * Promise'd sleep function to account for API round trip delays
 * @function sleep 
 * @param {int} ms Number of milliseconds to sleep  by
 * @return {Object} The completed promise after x time has passed
 */
function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Counts the number of keys in use for a given object
 * @function countOf 
 * @param {Object} obj The object to be checked
 * @return {int} The number of keys in use
 */
function countOf(obj) {
	return Object.keys(obj).length
}
