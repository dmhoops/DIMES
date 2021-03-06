/*===================================================================
// Script Number: 176
// Script Name: PMT_PlanReviewHoursFee.js
// Script Developer: Bryan de Jesus
// Script Agency: Woolpert
// Script Description: When a  workflow status of “Approved”, “Approved w/ Comments”, or “Revisions Required” at wf task “Plan Review” When a value is entered into the “Hours Spent” field within the wf “process form” on the “Plan Review” task, assess the “Plan Review Fee” with the entered value.
// Script Run Event: WTUA
// Script Parents:
//            WTUA;Permits!Master Plan!NA!NA
/*==================================================================*/
showDebug = true;

if (wfTask == "Planning Review" || 
		wfTask == "Building Review" || 
		wfTask == "Fire Review" || 
		wfTask == "Civil Engineering Review"){
	if (wfStatus == "Approved" || 
			wfStatus == "Approved w/Comments" || 
			wfStatus == "Revisions Required"){
		if (!!wfHours && wfHours > 0){
			if (AInfo["Expedite"] == "Expedite"){
				if (feeExists("MST040", "INVOICED")) voidRemoveFee("MST040");
				updateFee("MST040", "PMT_MST", "FINAL", wfHours, "N");				
			} else if (AInfo["Expedite"] == "Super Expedite"){
				if (feeExists("MST050", "INVOICED")) voidRemoveFee("MST050");
				updateFee("MST050", "PMT_MST", "FINAL", wfHours, "N");				
			} else {
				if (feeExists("MST040", "NEW", "INVOICED")) voidRemoveFee("MST040");
				if (feeExists("MST050", "NEW", "INVOICED")) voidRemoveFee("MST050");
			}
		}
	}	
} 