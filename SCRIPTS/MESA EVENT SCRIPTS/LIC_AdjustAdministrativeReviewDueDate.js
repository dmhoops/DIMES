/*===================================================================
// Script Number: 008
// Script Name: LIC_AdjustAdministrativeReviewDueDate.js
// Script Developer: Mike Linscheid
// Script Agency: Woolpert
// Script Description:  When the review workflow tasks 'License Application' is set to a status of "Additional Info Received". 
* Adjust the 'Administrative Review Due' ASI date by adding the number of days between the current date (the date the info was received) 
* and the date the Workflow Task was most recently set either to 'Additional Info Requested' or 'Additional Info Needed'.
// Script Run Event: WTUA: 	Licenses!General!*!Application
/*==================================================================*/

if (wfTask == "License Application" && wfStatus == "Additional Info Received"){
	var revDate = ""+getAppSpecific("Administrative Review Due",capId);
	var newAdminRevDate = (matches(revDate,"","null","undefined")) ? new Date() : new Date(revDate)
	var statList = ["Additional Info Requested","Additional Info Needed"]
	var nDays = getDaysSinceWorkflowSetTo("License Application",statList)
	newAdminRevDate.setDate(newAdminRevDate.getDate() + nDays)
	
	editAppSpecific("Administrative Review Due",jsDateToASIDate(newAdminRevDate),capId)
}