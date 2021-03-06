/*===================================================================
// Script Number: 096
// Script Name: PMT_AssessResidentialBuildingPermitFee
// Script Developer: Kevin Ford
// Script Agency: Accela
// Script Description: 
// Script Run Event: WTUA
// Script Parents:
// WUTA:Permits!Residential!~!~
// WTUA:Permits!Online!~!~
//
===================================================================*/

// Under this line create the function that will need to run at script runtime.
// the function will be called in the event ("AppSubmitAfter") major event.
var tNumInsp = 0;
var valuationASI = 0;
var feeAmount = 0;
var typeOfWork = AInfo["Type of Work"];
// Residential Type of Work Check
var residential = ["Single Family (Detached)", "Single Family (Attached)", "Two-Family Duplex", "Guesthouse",
                   "Remodeling With Addition", "Renovations/Remodels", "Additions", "Garage/Carport", "Non-Structural",
                   "Fire Sprinklers", "Fire Alarms", "Mechanical", "Plumbing", "Electrical", "Storage Shed/Barn"];
// Mobile Home Type of Work Check
var mobileHome = ["Mobile Home Other Addition", "Park Model Other Addition", "Park Model Rebuild"];
// Online Type of Work Check.
var Online = ["Residential Electrical 200a or smaller", "Residential Electrical Repair (like for Like)", "Residential Gas Pressure","Residential Gas line repair/replace"];
if(appTypeArray[1]=='Online' && wfTask == "Application Submittal" && wfStatus == "Ready to Issue" && exsits(typeOfWork,mobleHome))
{
	// Get the value for the total number of inspections
	tNumInsp = AInfo["Required Number of Inspections"];
	feeAmount = 90; // Base Fee
	feeAmount = feeAmount + (90 * tNumInsp);
	if(feeAmount > 0){
		//addFee(fcode, fsched, fperiod, fqty, finvoice)
		aa.print("Adding fee: "+feeAmount);
		addFee("RDIF170","PMT_ONL", "FINAL",  feeAmount, "Y");
	}
}
else if (appTypeArray[1] == 'Residential' && wfTask == "Plans Coordination" && wfStatus == "Ready to Issue"){
	// Get the value for the total number of inspections (ASI)
	// this could be one of two ASI values so we need to be careful about this.
	tNumInsp += AInfo["Estimated Number of Inspections"];
	tNumInsp += AInfo["Required No. of Inspections"];
	valuationASI += AInfo["Total Valuation"]; // This is on "Mobile Home" and "Residential/NA/NA"
	// Get the Valuation as well (ASI)
	if(valuationASI <25000){
		feeAmount = 90; // Base Fee
		feeAmount = feeAmount + (90 * tNumInsp);
	}
	else if (valuationASI >= 25000 && valuationASI <=200000){
		feeAmount = 500;  // Base Fee
		tNumInsp = Math.ceil((valuationASI - 25000)/1000);
		feeAmount = feeAmount + (6*tNumInsp);
	}
	else if (valuationASI > 200000 && valuationASI <=500000){
		feeAmount = 1550;  // Base Fee
		tNumInsp = Math.ceil((valuationASI - 200000)/1000);
		feeAmount = feeAmount + (9*tNumInsp);
	}
	else if (valuationASI > 500000 && valuationASI <=2000000){
		feeAmount = 4250;  // Base Fee
		tNumInsp = Math.ceil((valuationASI - 500000)/1000);
		feeAmount = feeAmount + (6*tNumInsp);
	}
	else if (valuationASI > 2000000){
		feeAmount = 13250;  // Base Fee
		tNumInsp = Math.ceil((valuationASI - 2000000)/1000);
		feeAmount = feeAmount + (3*tNumInsp);
	}
	//==========================
	// Process Fees
	// Residential/NA/NA First
	// Before the amount for Residential/NA/NA can be fully calculated we must
	// get the amount that had been put on deposit and paid.
	if(feeAmount > 0 && appTypeArray[2]=='NA' && exists(typeOfWork,residential)){
		//addFee(fcode, fsched, fperiod, fqty, finvoice)
		var prePay = 0;
		// Get all feeitems on the record
		var feeResult=aa.fee.getFeeItems(capId);
		if (feeResult.getSuccess())
			{ var feeObjArr = feeResult.getOutput(); }
		else
			{ logDebug( "**ERROR: getting fee items: " + capContResult.getErrorMessage());}
		// Parse each fee item.
		for (i in feeObjArr){
			feeItem = feeObjArr[i];
			varFCod = feeItem.getFeeCod();
			varFSched = feeItem.getF4FeeItemModel().getFeeSchudle();
			varFAmnt = feeItem.getFee();
			varFStatus = feeItem.getFeeitemStatus();
			if(varFSched == "PMT_RES" && varFCod =="RES010" && varFStatus == "INVOICED"){
				prePay = prePay + varFAmnt;
			}
		}
		// Calculate the difference
		feeAmount = feeAmount - prePay;
		aa.print("Adding fee: "+feeAmount);
		addFee("RES060","PMT_RES", "FINAL",feeAmount, "Y");
	}
	else if (feeAmount > 0 && appTypeArray[2]=='Mobile Home' && exists(typeOfWork,mobileHome)){
		aa.print("Adding fee: "+feeAmount);
		addFee("MH180", "PMT_MOBILE HOME", "FINAL",feeAmount, "Y");
	}
	//*/
}