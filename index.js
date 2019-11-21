/** 
 * cprest client access for API 
 */

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
'use strict'
const https = require('https')
const fs = require('fs');
const ipUtil = require('ip-utils')
import * as cp_objects from './typedefs'

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
var myuids = 'hosts'
allobjs[myuids] = []
var myrules = 'access-rule'
allobjs[myrules] = []
var garbage = 'garbage'
allobjs[garbage] = []
var backup = 'backup'
allobjs[backup] = []
var restore = 'restore'
allobjs[restore] = []

var limit = '500'	//
var runcmd = 'show-objects'	//Initial command

var sessionid = {}
var myfilename = 'dump'
/**
 * Perform a validation check against the command line arguments passed to the application. 
 * @function checkArgs
 * @example Must be a list of three arguments with a quad-octet formatted IPv4 address
 * $> node index 1.2.3.4
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
 * After parameter checks, run the program
 * @function main
 */
async function main() {
	startSession(mycred)
		.then(sessiontoken => setSession(sessiontoken))
		.then(() => showObjects(nodata, runcmd))
		.then(objid => checkObjects(objid))
		.then(() => whereUsed(allobjs[myuids]))
		.then(myuse => doParse(myuse))
		//.then(myout => writeJson(myout))
		//.then(() => parseObjectUse(allobj[myuids]))
		//.then(tagit => tagObjects(tagit))
		//.then(() => parseRuleUse(cleanobj))
		//.then(() => parseNatUse(cleanobj))
		//.then(() => parseThreatUse(cleanobj))
		.then(() => writeJson(allobjs))
		.then(() => endSession())
		.then(exitstat => console.log(exitstat))
		//.then(() => console.dir(cleanobj))
		//.then(thindat => console.log(thindat))
	.catch(endSession)
}

/**
 * Administrative functionality for safety checking
 * @function admins
 */
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
 * Given a string of object data, POST to the 'show object' function
 * @function showObjects
 * @param {string} mydata 
 * @param {string} mycmd Command for mgmt API
 * @returns {cp_objects.show_objects_uid[]} UIDs of direct and indirect object usage
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
			console.log('ERROR: error in showObjects(mydata,mycmd)')
			console.log(err)
	}
}

/** 
 * Given the return values from showObjects
 * @function checkObjects
 * @param {cp_objects.show_objects_uid} uid - UID to verify IP address filter
 * @returns {cp_objects.show_objects_uid[]} An Array of objects that match the filter
 */
async function checkObjects(objarr) {
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
			if (indat.object['ipv4-address'] === ip) {		//Matches IP filter, do the work
				console.log(indat.object.uid)
				mytagged = mytagged.concat(indat.object)	//Add to mytagged
				allobjs[myuids] = allobjs[myuids].concat(indat.object.uid)	//Prep UIDs array
				allobjs[backup] = allobjs[backup].concat(indat.object.name) //Prep Names array
				let myback = {}
				myback.name = indat.object.name
				myback['ipv4-address'] = indat.object['ipv4-address']
				myback.cmd = 'add-host'						//Command needed to restore
				myback['ignore-warnings'] = true			//Experience
				allobjs[restore] = allobjs[restore].concat(myback)		//Add to full restore list
			} else {
				throw new Error(indat.object.uid + ' object IP ' + indat.object['ipv4-address'] + ' does not match filter : ' + ip)
			}
		}
		//let tagdata = await tagObjects(mytagged)
		return allobjs[myuids]
	} catch (err) {
		console.log('ERROR: error in checkObjects(objArr)')
		console.log(err)
	}
}

 /**
  * Determine where a set of objects is used in Check Point policies
  * @function whereUsed
  * @param {cp_objects.uid_obj[]} objarr Any array of objects containing filter values by UID
  * @return {cp_objects.where_used_uid[]} An array of objects where the parameter values were found in policy
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
		console.log('ERROR: in whereUsed(objarr)')
		console.logt(err)
	}
}

/**
 * For a given set of Check Point objects, search for direct object usage and parse group membership
 * @function parseObjectUse
 * @param {cp_objects.show_objects_uid[]} objdat Array of objects that match the filter} objdat Array of Check Point objects
 * @return {Object[]} An array of Check Point objects per given UIDs including garbage, groups, members, and restore commands 
 */
async function parseObjectUse(objdat) {
	try {
		var myret = []
		objdat = [...new Set(objdat)]
		for (var x of objdat) {
			let mychk = await getType(x)
			if (mychk.type === 'group') {
				let mygrp = {}
				let mygrpback = {}
				mygrp.uid = mychk.uid
				mygrpback.name = mychk.name
				mygrpback.cmd = 'set-group'
				//myret = myret.concat(mygrp)
				let memarr = []
				let memarrback = []
				Object.values(mychk.members).forEach(gmem => {
					memarr = memarr.concat(gmem.uid)
					memarrback = memarrback.concat(gmem.name)
				});
				let smembers = memarr.filter(x => allobjs[myuids].includes(x))
				let members = {}
				let members2 = {}
				members.remove = smembers
				mygrp.members = members
				allobjs[mygroups] = allobjs[mygroups].concat(mygrp)
				let bmembers = memarrback.filter(x => allobjs[backup].includes(x))
				//['members']add = bmembers
				members2.add = bmembers
				mygrpback.members = members2
				//delete mygrpback.members.remove
				allobjs[restore] = allobjs[restore].concat(mygrpback)
				//let smembers = mychk.members.filter(x => allobjs[myuids].includes(x))
				//if (mychk.length > 0) {
					//console.log(mychk)
				//}
			} else {
				let badobj = {}
				if (!mychk.type) {
					mychk.type = 'NULL TYPE'
				}
				badobj.type = mychk.type
				badobj.uid = mychk.uid
				badobj.name = mychk.name
				allobjs[garbage] = allobjs[garbage].concat(badobj)
			}
		}
		return allobjs
	} catch (err) {
		console.log('ERROR: in parseObjectUse(onjdat)')
		console.log(err)
	}
}
/**
 * For a given set of Check Point host objects, search for their use in the rulebase from 'show access-rule'
 * @function parseRuleUse
 * @param {cp_objects.show_objects_uid[]} objdat Array of objects that match the filter} objdat Array of Check Point objects
 * @return {Object[]} The global array of all Check Point objects, now with access-rule restore commands for direct and indirect use
 */
async function parseRuleUse(objdat) {
	try {
		//let unique = [...new Set(myres)]
		//myres = [...new Set(myres)]
		for (var x of objdat) {
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
					source.remove = sremove
					rulechk.source = source
				}
				//rulechk.source = remove
				//rulechk.oldsource = ruleobj.source
				let dremove = ruleobj.destination.filter(x => allobjs[myuids].includes(x))
				if (dremove.length > 0) {
					console.log(dremove + ' dst remove ' + dremove.length)
					let destination = {}
					destination.remove = dremove
					rulechk.destination = destination
				}
				//rulechk.olddestination = ruleobj.destination
				allobjs[myrules] = allobjs[myrules].concat(rulechk)
			}
		}
		// run backup of myrules changes
		//console.log(allobjs[myrules])
		//	let mychk = await getType(myres[x])
		//	if (mychk.type === 'group') {
				//let mygrp = {}
				//mygrp.type = mychk.type
		//		mygrp.uid = mychk.uid
		//		myret = myret.concat(myres[x])
		//}
		for (var x of allobjs[myrules]) {
			//let source = {}
			let asource = []
			let adest = []
			let rulechk = {}
			if (x.source) {
				rulechk.uid = x.uid
				rulechk.layer = x.layer
				rulechk.cmd = 'set-access-rule'
				for (var y of x.source.remove) {
					let theobj = await getType(y)
					asource = asource.concat(theobj.name)
					console.log(theobj.name)
					//console.log(x)
				}
				let source = {}
				source.add = asource
				rulechk.source = source
			} 
			if (x.destination) {
				rulechk.uid = x.uid
				rulechk.layer = x.layer
				rulechk.cmd = 'set-access-rule'
				for (var y of x.destination.remove) {
					let theobj = await getType(y)
					adest = adest.concat(theobj.name)
					console.log(theobj.name)
					//console.log(x)
				}
				let destination = {}
				destination.add = adest
				rulechk.destination = destination
			}
			allobjs[restore] = allobjs[restore].concat(rulechk)
		}
		return allobjs
	} catch (err) {
		console.log('error in parseRuleUse : ' + err)
	}
}

/**
 * Any host object in a NAT rule is consdiered out-of-scope, mark these rules as "garbage"
 * @function parseNatUse 
 * @param {Object[]} objdat The parsed and prepared Check Point host object array
 * @return {Object[]} The global array of all Check Point objects
 */
async function parseNatUse(objdat) {
	try {
		for (var x of objdat) {
			if (x) {
				x.type = 'nat-rule'
				allobjs[garbage] = allobjs[garbage].concat(x)
				//console.log(x)
			}
		}
		return allobjs
	} catch (err) {
		console.log('ERROR: error in parseNatUse(objdat)')
		console.log(err)
	}
}
/**
 * Any host object in a Threat Prevention rule is consdiered out-of-scope, mark these rules as "garbage"
 * @function parseThreatUse 
 * @param {Object[]} objdat The parsed and prepared Check Point host object array
 * @return {Object[]} The global array of all Check Point objects
 */
async function parseThreatUse(objdat) {
	try {
		for (var x of objdat) {
			if (x) {
				x.type = 'threat-prevention'
				allobjs[garbage] = allobjs[garbage].concat(x)
				//console.log(x)
			}
		}
		return allobjs
	} catch (err) {
		console.log('ERROR: error in parseThreatUse(objdat)')
		console.log(err)
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
		console.log('ERROR: error in getObjectUse(isused)')
		console.log(err)
	}
}

 /**
  * Recursively discover the use of a host object against Check Point policy
  * @function getUsedObject 
  * @param {Object[]} objarr An array of Check Point object 
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
		console.log('ERROR: error in getUsedObject(objarr)')
		console.log(err)
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
		console.log('ERROR: error in getType(myobj)')
		console.log(err)
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
		console.log('ERROR: error in getRule(myobj)')
		console.log(err)
	}
}

/** 
 * For a given array of Check Point objects, tag the objects for deletion and POST to the API
 * @function tagObjects 
 * @param {cp_objects.tag_std[]} myobj An array of tags to be added to a Check Point host object
 * @return {Object} Returns the session handler after tagging operations are concluded and the pubSession() completes
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
		console.log('ERROR: error in tagObjects(myobj)')
		console.log(err)
	}
}

/**
 * Given a set of objects returns by the Check Point Management API, create the array of host objects elligible for deleition
 * @function doParse 
 * @param {cp_objects.where_used_uid[]} objdat An array of objects where the parameter values were already found in policy
 * @return {Object[]} The parsed and prepared Check Point host object array
 */
async function doParse(objdat) {
	try {
		//const myres = {}
		console.log('Doing Search of IP : ' + ip)
		console.log('Number of host objects: ' + Object.values(objdat[ip]).length)
		Object.keys(objdat[ip]).forEach(uid => {	//For every IP objects
			Object.keys(objdat[ip][uid]).forEach(usetype => {	//For every UID
				console.log(usetype)
				cleanobj[usetype] = []
				Object.keys(objdat[ip][uid][usetype]).forEach(used => {	//For every use type
					var myres = {}
					myres[used] = []
					//console.log(used + ' : ')
					if (objdat[ip][uid][usetype][used]['total'] > 0) {	//If the object is used in 1 or more rules
						mytotal = objdat[ip][uid][usetype][used]['total']
						console.log(used + ' : ' + objdat[ip][uid][usetype][used]['total'])
						Object.keys(objdat[ip][uid][usetype][used]).forEach(arrs => {	//For each rule that this host object exists in
							//console.log(arrs + ' ' + Object.keys(objdat[ip][uid][usetype][used][arrs]).length)
							if (Object.keys(objdat[ip][uid][usetype][used][arrs]).length > 0) {		//If the object is used in 1 or more rules
								let myarrs = {}
								myarrs[arrs] = []
								let mycnt = Object.keys(objdat[ip][uid][usetype][used][arrs]).length
								//console.log(Object.keys(objdat[ip][uid][usetype][used][arrs]))
								//console.log(objdat[ip][uid][usetype][used][arrs])
								console.log(mycnt + ' ' + arrs )
								myarrs[arrs] = myarrs[arrs].concat(objdat[ip][uid][usetype][used][arrs])	
								myres[used] = myres[used].concat(myarrs)	//Concatenate known values to myres
							}
						});
						cleanobj[usetype] = cleanobj[usetype].concat(myres)	//Add to the prepared array for return
					}
				});
			});
			console.log('---')
		});
		console.log('returning object data')
		return cleanobj
	} catch (err) {
		console.log('ERROR: error in doParse(objdat)')
		console.log(err)
	}
}
/** 
 * Colored version of the json output
 * @function showJson
 * @param {json} obj 
 * @return {Object} A prettifed version of the json object using prettyjson library
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
			console.log('ERROR: Failed to startSession(), ')
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
		console.log('ERROR: Failed to setSession(), bad token?')
		console.log(err)
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
		console.log('ERROR: Failed to pubSession()')
		console.log(err)
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
		console.log('ERROR: Failed to endSession()')
		console.log(err)
	}
}

/**
 * With given options and HTTP POST data, continue HTTPS requests/resolve until the final response object is reached
 * @function callOut
 * @param {cp_objects.json} options JSON-formatted options to be sent to the Check Point Management API
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
 * @param {cp_objects.json} content JSON-formatted data to write to file
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
		console.log("ERROR: Failing writing to disk writeJson(content)")
		console.log(err)
	}
}

/**
 * Promise'd sleep function to account for API round trip delays
 * @function sleep 
 * @param {Number} ms Number of milliseconds to sleep  by
 * @return {Object} The completed promise after x time has passed
 */
function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Counts the number of keys in use for a given object
 * @function countOf 
 * @param {Object} obj The object to be checked
 * @return {Number} The number of keys in use
 */
function countOf(obj) {
	return Object.keys(obj).length
}
