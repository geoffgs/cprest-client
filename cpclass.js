/**
 * Class Method for API callout builder to prepare GET, POST, and DELETE HTTP functions
 * @module cpclass
 * @class ApiCall
 */
module.exports = class ApiCall {
	/**
	 * Creates an instance of the ApiCall object to interact with the Check Point Management API
	 * @constructor
	 * @param {*} base Options and path of the function to the Check Point Manageemnt API
	 * @exampe const toApi = new CpApiClass(myapisite.chkp)
	 */
	constructor (base) {
		this.options = base			//Options for the Check Point Management API
		this.rootpath = base.path	//Path to the API function
	} 
	/**
	 * Log the options and data to console for debugging
	 * @function showOpt
	 */
	showOpt () {
		if (this.options) 
			console.log(this)
		if (this.data) 
			console.log(this.data)
	}
	/**
	 * Given data to be delivered and application function path prepare the POST structure
	 * @function doPost
	 * @param {json} data List of options to be included in the HTTP POST
	 * @param {json} appfunc API function to be called 
	 * @return Its own object reference
	 */
	doPost (data, appfunc) {
		this.postData = JSON.stringify(data)
		this.options.method = 'POST'
		this.options.headers['Content-Length'] = this.postData.length
		if (appfunc)
			this.options.path = this.rootpath + '/' + appfunc
		else 
			this.options.path = this.rootpath
		return this
	}
	/**
	 * Set the 'x-chkp-sid' token field to the current session token
	 * @function setToken
	 * @param {*} mysession Session to be set
	 * @return Its own object reference
	 */
	setToken (mysession) {
		this.options.headers['x-chkp-sid'] = mysession.sid
		return this
	}
	/**
	 * Prepare an HTTP GET for the given API function
	 * @param {json} appfunc API function to be called 
	 * @return Its own object reference
	 */
	doGet (appfunc) {
		this.options.method = 'GET'
		if (appfunc)
			this.options.path = this.rootpath + '/' + appfunc
		else
			this.options.path = this.rootpath
		if (this.postData) 
			delete this.postData
		if (this.options.headers['Content-Length']) 
			delete this.options.headers['Content-Length']
		return this
	}
	/**
	 * Prepare an HTTP DELETE for the given APU function
	 * @param {json} appfunc API function to be called 
	 * @return Its own object reference
	 */
	doDelete (appfunc) {
		this.options.method = 'DELETE'
		if (appfunc)
			this.options.path = this.rootpath + '/' + appfunc
		else
			this.options.path = this.rootpath
		if (this.postData)
			delete this.postData
		if (this.options.headers['Content-Length'])
			delete this.options.headers['Content-Length']
		return this
	}
}