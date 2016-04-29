/*===================================================================
// Script Number: 007
// Script Name: Create License Record
// Script Developer: Kevin Ford
// Script Agency: Accela
// Script Description: Create the license record when the "Issue License"
			task on the application record is set to a status of "Issued".
			Convert to contact of type "Applicant" to "Licensee". Set the
			expiration status to Active and the expiration date according
			to the expiration code. Copy info from application to license
			according to standard choice EMSE:ASI Copy Exceptions.  
// Script Run Event: Workflow Task Update After
// Script Parents:
//            WTUA;Licenses!General!~!Application.js
/*==================================================================*/

// When WFTask "Issue License" is set to "Issued"
if (wfTask.equals("Issue License") && wfStatus.equals("Issued"))
{
	aa.print("Creating License Record");
	// Create a child record of type License/*/*/License (where the record type and subtype are the same as the parent application record)
	// Need to get the type and sub-type broken out, the following format can be used appTypeArray[1]
	license = createChild(appTypeArray[0],appTypeArray[1],appTypeArray[2],"License","License");
	// Convert the Contact of type "Applicant" (This should be "License Applicant")
	// to "Licensee" ("Licensee" is in configuration and should be no issue.)
	var capContactResult = aa.people.getCapContactByCapID(license);
	if (capContactResult.getSuccess()) {
		var Contacts = capContactResult.getOutput();
		
		for (aContact in Contacts) {
			var updateContact = Contacts[aContact].getCapContactModel();
			var newPeople = updateContact.getPeople();
			var cType = newPeople.getContactType();
			if( (cType == "License Applicant") || (cType == "Applicant")) {
				var ContactName = newPeople.getContactName();
				var businessName = newPeople.getBusinessName();
				//ContactName += " "+newPeople.businessName();
				aa.print("Updating Contact "+ContactName+" "+businessName);
				newPeople.setContactType("Licensee");
			}
			else {
				newPeople.setContactType(cType);
			}
		}
	}
	
	//
	newLicIdString = license.getCustomID(); 
	aa.print("newLicIdString" + newLicIdString);
	lic = new licenseObject(newLicIdString,license) ; 	
	
	// Set the expiration status to Active and the expiration date according to the expiration code. 
	// all the expiration_interval_unit are set to either one year or 12 months so using 365 days
	lic.setStatus("Active");		
	lic.setExpiration(dateAdd(null,365));

	
	// Copy info from application to "License" according to standard choice EMSE:ASI Copy Exceptions.
	// 	EMSE:ASI Copy Exceptions – contains the record type (in the “Standard Choices Value” field)
	//	along with a “|” delimited list ASI fields to exclude when copying the ASI (in the “Value Desc” field).
	
	var ignore = lookup("EMSE:ASI Copy Exceptions",appTypeString); 
	var ignoreArr = new Array(); 
	if(ignore != null) ignoreArr = ignore.split("|"); 
	copyAppSpecific(license,ignoreArr);
	copyASITables(capId,license);
	
		
}