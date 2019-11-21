/**
 * @module typedefs
 */
 
/**
 * Check Point Management API standard-details host object format 
 * @typedef {Object} uid_obj
 * @property {string} uid Object unique identifier.
 * @memberof typedefs
 */

/**
 * Check Point Management API standard-details host object format 
 * @typedef {Object} host_obj
 * @property {string} name Object name. Should be unique in the domain.
 * @property {string} uid Object unique identifier.
 * @property {string} type Type of the object.
 * @memberof typedefs
 */

 /**
 * Check Point Management API standard-details host object format from 'show hosts' (contains example of standard-details)
 * @typedef {Object} host_std
 * @property {string} name Object name. Should be unique in the domain.
 * @property {string} uid Object unique identifier.
 * @property {string} type Type of the object.
 * @property {domain_obj} domain Information about the domain the object belongs to.
 * @property {string} ipv4-address IPv4 host address.
 * @property {string} ipv6-address IPv6 host address.
 * @memberof typedefs
 */

 /**
 * Check Point Management API full-details host object format from 'show host'
 * @typedef {Object} host_full
 * @property {string} name Object name. Should be unique in the domain.
 * @property {string} uid Object unique identifier.
 * @property {string} type Type of the object.
 * @property {domain_obj} domain Information about the domain the object belongs to.
 * @property {group_std[]} groups How much details are returned depends on the details-level field of the request.
 * @property {string} icon Object icon.
 * @property {interfaces[]} interfaces Host interfaces.
 * @property {string} ipv4-address IPv4 host address.
 * @property {string} ipv6-address IPv6 host address.
 * @property {meta_info} meta-info Object metadata.
 * @property {nat_settings} nat-settings NAT settings.
 * @property {boolean} read-only Indicates  whether the object is read-only.
 * @property {tag_std[]} tags Collection of tag objects identified by the name or UID
 * @property {host_servers} host-servers Servers Configuration.
 * @property {string} color Color of the object. Should be one of existing colors.
 * @property {string} comments Comments string.
 * @memberof typedefs
 */

 /**
 * Check Point Management API standard-details ranges object format from 'show hosts'
 * @typedef {Object} show_host_std
 * @property {number} from From which element number the query was done.
 * @property {host_std[]} objects List of objects in the range
 * @property {number} to To which element number the query was done.
 * @property {number} total Total number of elements returned by the query.
 * @memberof typedefs
 */ 

  /**
 * Check Point Management API full-details ranges object format from 'show hosts'
 * @typedef {Object} show_host_full
 * @property {number} from From which element number the query was done.
 * @property {host_full[]} objects List of objects in the range
 * @property {number} to To which element number the query was done.
 * @property {number} total Total number of elements returned by the query.
 * @memberof typedefs
 */ 

 /**
 * Check Point Management API standard-details ranges object format from 'show hosts'
 * @typedef {Object} show_hosts_std
 * @property {number} from From which element number the query was done.
 * @property {host_std[]} objects List of objects in the range
 * @property {number} to To which element number the query was done.
 * @property {number} total Total number of elements returned by the query.
 * @memberof typedefs
 */ 

  /**
 * Check Point Management API full-details ranges object format from 'show hosts'
 * @typedef {Object} show_hosts_full
 * @property {number} from From which element number the query was done.
 * @property {host_full[]} objects List of objects in the range
 * @property {number} to To which element number the query was done.
 * @property {number} total Total number of elements returned by the query.
 * @memberof typedefs
 */ 

 /**
 * Check Point Management API base level domain object
 * @typedef {Object} domain_obj
 * @property {string} name Object name. Should be unique in the domain.
 * @property {string} uid Object unique identifier.
 * @property {string} domain-type Domain type. Optional arguments: mds, data domain, domain, global domain
 * @memberof typedefs
 */

  /**
 * Check Point Management API web-server-config object format
 * @typedef {Object} web_srv_conf
 * @property {string[]} additional-ports Server additional ports.
 * @property {string[]} additional-engines Application engines of this web server.
 * @property {boolean} listen-standard-port Whether server listens to standard port.
 * @property {string} operating-system Optional arguments: sparc linux, windows, other, x86 linux, sparc solaris
 * @property {string} protected-by Network object which protects this server identified by the name or UID.
 * @property {number} standard-port-number Server standard port number.
 * @memberof typedefs
 */

/**
 * Check Point Management API host-server-config object format
 * @typedef {Object} host_servers
 * @property {boolean} dns-server Gets True if this server is a DNS Server.
 * @property {boolean} mail-server Gets True if this server is a Mail Server.
 * @property {boolean} web-server Gets True if this server is a Web Server.
 * @property {web_srv_conf} Web Server configuration.
 * @memberof typedefs
 */

 /**
 * Check Point Management API standard-details groups object format from 'show group'
 * @typedef {Object} show_group_std
 * @property {string} name Object name. Should be unique in the domain.
 * @property {string} uid Object unique identifier.
 * @property {string} type Type of the object.
 * @property {domain_obj} domain Information about the domain the object belongs to.
 * @property {group_std[]} groups How much details are returned depends on the details-level field of the request.
 * @property {string} icon Object icon.
 * @property {std_obj[]} members Collection of network objects identified by the name or UID
 * @property {meta_info} meta-info Object metadata.
 * @property {Object} ranges Displays the group's matched content as ranges of IP addresses, in case 'show-as-ranges' is set to true. In this case, the 'members' parameter is omitted.
 * @property {boolean} read-only Indicates whether the object is read-only.
 * @property {tag_std[]} tags Collection of tag objects identified by the name or UID.
 * @property {string} color Color of the object. Should be one of existing colors.
 * @property {string} comments Comments string.
 * @memberof typedefs
 */

 /**
 * Check Point Management API standard-details groups object format from 'show group'
 * @typedef {Object} show_group_full
 * @property {string} name Object name. Should be unique in the domain.
 * @property {string} uid Object unique identifier.
 * @property {string} type Type of the object.
 * @property {domain_obj} domain Information about the domain the object belongs to.
 * @property {group_full[]} groups How much details are returned depends on the details-level field of the request.
 * @property {string} icon Object icon.
 * @property {std_obj[]} members Collection of network objects identified by the name or UID
 * @property {meta_info} meta-info Object metadata.
 * @property {ranges_full} ranges Displays the group's matched content as ranges of IP addresses, in case 'show-as-ranges' is set to true. In this case, the 'members' parameter is omitted.
 * @property {boolean} read-only Indicates whether the object is read-only.
 * @property {tag_full[]} tags Collection of tag objects identified by the name or UID.
 * @property {string} color Color of the object. Should be one of existing colors.
 * @property {string} comments Comments string.
 * @memberof typedefs
 */

 /**
 * Check Point Management API standard-details ranges object format from 'show groups'
 * @typedef {Object} show_groups_std
 * @property {number} from From which element number the query was done.
 * @property {group_std[]} objects List of objects in the range
 * @property {number} to To which element number the query was done.
 * @property {number} total Total number of elements returned by the query.
 * @memberof typedefs
 */

/**
 * Check Point Management API full-details ranges object format from 'show groups'
 * @typedef {Object} show_groups_full
 * @property {number} from From which element number the query was done.
 * @property {group_full[]} objects List of objects in the range
 * @property {number} to To which element number the query was done.
 * @property {number} total Total number of elements returned by the query.
 * @memberof typedefs
 */

 /**
 * Check Point Management API standard-details ranges object format from 'show address-ranges'
 * @typedef {Object} show_ranges_std
 * @property {number} from From which element number the query was done.
 * @property {range_std[]} objects List of objects in the range
 * @property {number} to To which element number the query was done.
 * @property {number} total Total number of elements returned by the query.
 * @memberof typedefs
 */

/**
 * Check Point Management API full-details ranges object format from 'show address-ranges'
 * @typedef {Object} show_ranges_full
 * @property {number} from From which element number the query was done.
 * @property {range_full[]} objects List of objects in the range
 * @property {number} to To which element number the query was done.
 * @property {number} total Total number of elements returned by the query.
 * @memberof typedefs
 */

/**
 * Check Point Management API standard-details range object format from 'show address-ranges' 
 * @typedef {Object} range_base_std
 * @property {ip_base} ipv4 Range of IPv4 addresses that match in the given rule.
 * @property {ip_base} ipv6 Range of IPv6 addresses that match in the given rule.
 * @memberof typedefs
 */

/**
 * Check Point Management API basic ip object; "start" and "end" addresses. Can be the same values for single address
 * @typedef {json} ip_base
 * @property {string} start First address in range
 * @property {string} end Last address in range
 */

/**
 * Check Point Management API standard-details range object format from 'show address-ranges' 
 * @typedef {Object} range_base_uid
 * @property {string} uid Object unique identifier.
 * @memberof typedefs
 */ 

/**
 * Check Point Management API standard-details range object format from 'show address-ranges' 
 * @typedef {Object} range_std
 * @property {string} name Object name. Should be unique in the domain.
 * @property {string} uid Object unique identifier.
 * @property {string} type Type of the object.
 * @property {domain_obj} domain Information about the domain the object belongs to.
 * @property {string} ipv4-address-first First IPv4 address in the range.
 * @property {string} ipv4-address-last Last IPv4 address in the range.
 * @property {string} ipv6-address-first First IPv6 address in the range.
 * @property {string} ipv6-address-last Last IPv9 address in the range.
 * @memberof typedefs
 */

/**
 * Check Point Management API full-details range object format from 'show address-range'
 * @typedef {Object} range_full
 * @property {string} name Object name. Should be unique in the domain.
 * @property {string} uid Object unique identifier.
 * @property {string} type Type of the object.
 * @property {domain_obj} domain Information about the domain the object belongs to.
 * @property {group_full[]} groups How much details are returned depends on the details-level field of the request.
 * @property {string} icon Object icon.
 * @property {string} ipv4-address-first First IPv4 address in the range.
 * @property {string} ipv4-address-last Last IPv4 address in the range.
 * @property {string} ipv6-address-first First IPv6 address in the range.
 * @property {string} ipv6-address-last Last IPv9 address in the range.
 * @property {meta_info} meta-info Object metadata.
 * @property {nat_settings} nat-settings NAT Settings
 * @property {boolean} read-only Indicates whether the object is read-only.
 * @property {tag_full[]} tags Collection of tag objects identified by the name or UID.
 * @property {string} color Color of the object. Should be one of existing colors.
 * @property {string} comments Comments string.
 * @memberof typedefs
 */

 /**
 * Check Point Management API nat-settings object format 
 * @typedef {Object} nat_settings 
 * @property {boolean} auto-rule Whether to add automatic address translation rules.
 * @property {string} hide-behind Hide behind method. This parameter is not required in case "method" parameter is "static". Optional values: gateway, ip-address
 * @property {string} install-on Which gateway should apply the NAT translation.
 * @property {string} ipv4-address IPv4 host address.
 * @property {string} ipv6-address IPv6 host address.
 * @property {string} method NAT translation method. Optional values: hide, static
 * @memberof typedefs
 */

/**
 * Check Point Management API meta-info object format 
 * @typedef {Object} meta_info 
 * @property {timestamp} creation-time
 * @property {string} creator
 * @property {string} last-modifier N
 * @property {timestamp} last-modify-time 
 * @property {string} lock Object lock state. It's not allowed to edit objects locked by other session.
 * @property {string} validation-state Oprtional arguments of: ok, info, warning, error
 * @memberof typedefs
 */

/**
 * Check Point Management API timestamp object format
 * @typedef {Object} timestamp 
 * @property {string} iso-8601 Date and time represented in international ISO 8601 format.
 * @property {number} posix Number of milliseconds that have elapsed since 00:00:00, 1 January 1970.
 * @memberof typedefs
 */

 /**
 * Check Point Management API members object format 
 * @typedef {Object} std_obj
 * @property {string} name Object name. Should be unique in the domain.
 * @property {string} uid Object unique identifier.
 * @property {string} type Type of the object.
 * @property {domain_obj} domain Information about the domain the object belongs to.
 * @memberof typedefs
 */

/**
 * Check Point Management API members object format 
 * @typedef {std_obj} group_std
 * @memberof typedefs
 */

 /**
 * Check Point Management API standard-details interfaces object format 
 * @typedef {Object} interfaces_std
 * @property {string} name Object name. Should be unique in the domain.
 * @property {string} subnet4 IPv4 network address.
 * @property {string} subnet6 IPv6 network address.
 * @property {string} uid Object unique identifier.
 * @property {number} mask-length4 IPv4 network mask length.
 * @property {number} mask-length6 IPv6 network mask length.
 * @property {string} type Type of the object.
 * @property {domain_obj} domain Information about the domain the object belongs to.
 * @property {string} icon Object icon.
 * @property {meta_info} meta-info Object metadata.
 * @property {boolean} read-only Indicates whether the object is read-only.
 * @property {tag_std[]} tags Collection of tag objects identified by the name or UID.
 * @memberof typedefs
 */

 /**
 * Check Point Management API full-details interfaces object format 
 * @typedef {Object} interfaces_full
 * @property {string} name Object name. Should be unique in the domain.
 * @property {string} subnet4 IPv4 network address.
 * @property {string} subnet6 IPv6 network address.
 * @property {string} uid Object unique identifier.
 * @property {number} mask-length4 IPv4 network mask length.
 * @property {number} mask-length6 IPv6 network mask length.
 * @property {string} type Type of the object.
 * @property {domain_obj} domain Information about the domain the object belongs to.
 * @property {string} icon Object icon.
 * @property {meta_info} meta-info Object metadata.
 * @property {boolean} read-only Indicates whether the object is read-only.
 * @property {tag_full[]} tags Collection of tag objects identified by the name or UID.
 * @memberof typedefs
 */

/**
 * Check Point Management API standard-details tags object format from 'show tag'
 * @typedef {std_obj} tag_std
 * @memberof typedefs
 */

/**
 * Check Point Management API full-details tags object format from 'show tag'
 * @typedef {std_obj} tag_full
 * @property {string} name Object name. Should be unique in the domain.
 * @property {string} uid Object unique identifier.
 * @property {string} type Type of the object.
 * @property {domain_obj} domain Information about the domain the object belongs to.
 * @property {string} icon Object icon.
 * @property {meta_info} meta-info Object metadata.
 * @property {boolean} read-only Indicates whether the object is read-only.
 * @property {tag_std[]} tags Collection of tag objects identified by the name or UID.
 * @property {string} color Color of the object. Should be one of existing colors.
 * @property {string} comments Comments string.
 * @memberof typedefs
 */

/**
* Check Point Management API standard-details access-role object format from 'show tags'
* @typedef {Object} show_tags_std
* @property {number} from From which element number the query was done.
* @property {tag_std[]} objects Array of tag objects 
* @property {number} to To which element number the query was done.
* @property {number} total Total number of elements returned by the query.
* @memberof typedefs
*/ 

/**
* Check Point Management API standard-details access-role object format from 'show tags'
* @typedef {Object} show_tags_std
* @property {number} from From which element number the query was done.
* @property {tag_std[]} objects Array of tag objects 
* @property {number} to To which element number the query was done.
* @property {number} total Total number of elements returned by the query.
* @memberof typedefs
*/ 

/**
 * Check Point Management API standard-details access-role object format from 'show access-roles'
 * @typedef {Object} access_roles_std
 * @property {number} from From which element number the query was done.
 * @property {access_role_std[]} objects List of objects in the range
 * @property {number} to To which element number the query was done.
 * @property {number} total Total number of elements returned by the query.
 * @memberof typedefs
 */

/**
 * Check Point Management API full-details access-role object format from 'show access-roles'
 * @typedef {Object} access_roles_full
 * @property {number} from From which element number the query was done.
 * @property {access_role_full[]} objects List of objects in the range
 * @property {number} to To which element number the query was done.
 * @property {number} total Total number of elements returned by the query.
 * @memberof typedefs
 */


/**
 * Check Point Management API full-details access-role object format from 'show access-role'
 * @typedef {std_obj} access_role_std
 * @property {string} name Object name. Should be unique in the domain.
 * @property {string} uid Object unique identifier.
 * @property {string} type Type of the object.
 * @property {domain_obj} domain Information about the domain the object belongs to.
 * @property {string} icon Object icon.
 * @property {std_obj[]} machines Machines that can access the system.
 * @property {meta_info} meta-info Object metadata.
 * @property {std_obj[]} networks Collection of Network objects identified by the name or UID that can access the system.
 * @property {boolean} read-only Indicates whether the object is read-only.
 * @property {std_obj} remote-access-client Remote access clients identified by name or UID.
 * @property {tag_std[]} tags Collection of tag objects identified by the name or UID.
 * @property {std_obj[]} users Users that can access the system. 
 * @property {string} color Color of the object. Should be one of existing colors.
 * @property {string} comments Comments string.
 * @memberof typedefs
 */

/** 
 * Check Point Management API full-details access-role object format from 'show security-zone'
 * @typedef {Object} security_zone_std
 * @property {string} name Object name. Should be unique in the domain.
 * @property {string} uid Object unique identifier.
 * @property {string} type Type of the object.
 * @property {domain_obj} domain Information about the domain the object belongs to.
 * @property {string} icon Object icon.
 * @property {meta_info} meta-info Object metadata.
 * @property {nat_settings} nat-settings NAT settings.
 * @property {boolean} read-only Indicates  whether the object is read-only.
 * @property {tag_std[]} tags Collection of tag objects identified by the name or UID
 * @property {string} color Color of the object. Should be one of existing colors.
 * @property {string} comments Comments string.
 * @memberof typedefs
 */

 /**
 * Check Point Management API standard-details access-role object format from 'show security-zones'
 * @typedef {Object} security_zones_std
 * @property {number} from From which element number the query was done.
 * @property {security_zone_std[]} objects List of objects in the range
 * @property {number} to To which element number the query was done.
 * @property {number} total Total number of elements returned by the query.
 * @memberof typedefs
 */

/** 
 * Check Point Management API standard-details access-layer object format from 'show access-layer'
 * @typedef {Object} access_layer_std
 * @property {string} name Object name. Should be unique in the domain.
 * @property {string} uid Object unique identifier.
 * @property {string} type Type of the object.
 * @property {boolean} applications-and-url-filtering Whether Applications & URL Filtering blade is enabled on this layer. 
 * @property {boolean} content-awareness Whether Content Awareness blade is enabled on this layer.
 * @property {boolean} detect-using-x-forwarded-for Whether X-Forward-For HTTP header is been used.
 * @property {domain_obj} domain Information about the domain the object belongs to.
 * @property {boolean} firewall Whether Firewall blade is enabled on this layer.
 * @property {string} icon Object icon.
 * @property {string} implicit-cleanup-action The default "catch-all" action for traffic that does not match any explicit or implied rules in the layer. Optional arguments: drop, accept
 * @property {meta_info} meta-info Object metadata.
 * @property {boolean} mobile-access Whether Mobile Access blade is enabled on this layer.
 * @property {string} parent-layer Object icon.
 * @property {boolean} read-only Whether this layer is shared.
 * @property {boolean} shared Indicates  whether the object is read-only. * 
 * @property {tag_std[]} tags Collection of tag objects identified by the name or UID
 * @property {string} color Color of the object. Should be one of existing colors.
 * @property {string} comments Comments string.
 * @memberof typedefs
 */

 /**
 * Check Point Management API standard-details access-role object format from 'show access-layers'
 * @typedef {Object} access_layers_std
 * @property {number} from From which element number the query was done.
 * @property {access_layer_std[]} objects List of objects in the range
 * @property {number} to To which element number the query was done.
 * @property {number} total Total number of elements returned by the query.
 * @memberof typedefs
 */

 /**
 * Check Point Management API basic message object
 * @typedef {Object} msg_obj
 * @property {boolean} current-session Validation related to the current session.
 * @property {string} message Validation message.
 * @memberof typedefs
  */

/**
 * Check Point Management API basic failure return object
 * @typedef {Object} fail_obj
 * @property {string} message Operations status.
 * @property {msg_obj} warnings Validations warnings.
 * @property {msg_obj} errors Validation Errors warnings.
 * @property {msg_obj} blocking-errors Blocking validation errors.
 * @property {string} code Error code, includes optional arguments relating to specific error
 * @memberof typedefs
 */

 /**
 * Check Point Management API validations return object from 'show validations'
 * @typedef {Object} validations
 * @property {msg_obj} warnings Validations warnings.
 * @property {number} warnings-total Total number of warning validations.
 * @property {msg_obj} errors Validation Errors warnings.
 * @property {number} errors-total Total number of error validations.
 * @property {msg_obj} blocking-errors Blocking validation errors.
 * @property {number} warnings-total Total number of blocking error validations.
 * @memberof typedefs
 */

/** 
 * Check Point Management API basic rule return object standard-details
 * @typedef {Object} rule_obj_std
 * @property {number} total Total number of elements returned by the query.
 * @property {std_obj[]} objects Usage in objects.
 * @property {std_obj[]} access-control-rules Usage in objects.
 * @property {std_obj[]} nat-rules Usage in objects.
 * @property {std_obj[]} threat-prevention-rules Usage in objects.
 * @memberof typedefs
 */

 /** 
 * Check Point Management API basic rule return object uid-details
 * @typedef {Object} rule_obj_uid
 * @property {number} total Total number of elements returned by the query.
 * @property {uid_obj[]} objects Usage in objects.
 * @property {uid_obj[]} access-control-rules Usage in objects.
 * @property {uid_obj[]} nat-rules Usage in objects.
 * @property {uid_obj[]} threat-prevention-rules Usage in objects.
 * @memberof typedefs
 */

/** 
 * Check Point Management API standard-details where-used return object
 * @typedef {Object} where_used_std
 * @property {rule_obj_std[]} used-directly Direct usage of the object.
 * @property {rule_obj_std[]} used-indirectly Indirect usage of the object.
 * @memberof typedefs
 */

/** 
 * Check Point Management API uid-details where-used return object
 * @typedef {Object} where_used_uid
 * @property {rule_obj_uid[]} used-directly Direct usage of the object.
 * @property {rule_obj_uid[]} used-indirectly Indirect usage of the object.
 * @memberof typedefs
 * @example 
 * { ip: [
 *        {
 *          uid: [
 *             { used-directly: {
 * 	       		  total: 0,
 * 	        		  access-control-rules[],
 * 	        		  nat-rules[],
 * 	        		  threat-prevention-rules[],
 * 	        		  objects[]
 * 	        		  },
 * 	      	  used-indirectly: {
 * 	       		  total: 0,
 * 	        		  access-control-rules[],
 * 	        		  nat-rules[],
 * 	        		  threat-prevention-rules[],
 * 	        		  objects[]
 * 	        	     }
 *              }
 *           ] 
 *        }
 *     ]
 *  }
 */

/** 
 * Check Point Management API standard-details object returned from 'show object'
 * @typedef {Object} show_obj_std
 * @property {std_obj[]} object The basic, 4-field object 
 * @memberof typedefs
 */

/** 
 * Check Point Management API uid-details object returned from 'show object'
 * @typedef {Object} show_obj_uid
 * @property {uid_obj[]} object Array of UIDs
 * @memberof typedefs
 */
 
 /** 
 * Check Point Management API basic order/sorting object
 * @typedef {Object} order_obj
 * @property {string} ASC Sorts results by the given field in ascending order, by object name field
 * @property {string} DESC Sorts results by the given field in ascending order, by object name field
 * @memberof typedefs
 */

/** 
 * Check Point Management API arguments values for 'show objects' @see https://sc1.checkpoint.com/documents/latest/APIs/index.html#cli/show-objects~v1.5#ip-only
 * @typedef {Object} show_objects_arguments
 * @property {string} filter Search expression to filter objects by. The provided text should be exactly the same as it would be given in Smart Console. The logical operators in the expression ('AND', 'OR') should be provided in capital letters. By default, the search involves both a textual search and a IP search. To use IP search only, set the "ip-only" parameter to true.
 * @property {boolean} ip-only If using "filter", use this field to search objects by their IP address only, without involving the textual search.
 * @property {number} limit No more than that many results will be returned. Default:50, values: 1-500.
 * @property {number} offset Skip that many results before beginning to return them. Default: 0
 * @property {order_obj} order Sorts results by the given field. By default the results are sorted in the ascending order by name.
 * @property {string} type The objects' type, e.g.: host, service-tcp, network, address-range... Defaut: object
 * @property {boolean} dereference-group-members Indicates whether to dereference "members" field by details level for every object in reply. Default: true
 * @property {boolean} show-membership Indicates whether to dereference "members" field by details level for every object in reply. Default: true
 * @property {string} details-level The level of detail for some of the fields in the response can vary from showing only the UID value of the object to a fully detailed representation of the object. Default: true, Values: uid, standard, full
 */

 /**
 * Check Point Management API standard-details return object format from 'show objects'
 * @typedef {Object} show_objects_std
 * @property {number} from From which element number the query was done.
 * @property {show_obj_std[]} objects List of objects in the range
 * @property {number} to To which element number the query was done.
 * @property {number} total Total number of elements returned by the query.
 * @memberof typedefs
 */

/**
 * Check Point Management API standard-details return object format from 'show objects'
 * @typedef {Object} show_objects_uid
 * @property {number} from From which element number the query was done.
 * @property {show_obj_uid[]} objects List of objects in the range
 * @property {number} to To which element number the query was done.
 * @property {number} total Total number of elements returned by the query.
 * @memberof typedefs
 */


/**
*  Definition of a json object.
*  @typedef {Object} json
*  @property {string} {*}
*  @property {string} {*}
*  @memberof typedefs
*/ 
 

   exports.unused = {};