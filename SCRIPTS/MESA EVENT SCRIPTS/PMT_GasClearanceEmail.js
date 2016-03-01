/*===================================================================
// Script Number: 102
// Script Name: PMT_GasClearanceEmail.js 
// Script Developer: Raminder Gill
// Script Agency: Accela
// Script Description: When Gas Pipe Final inspection is resulted with “Approved - Utility Clearance Required”
// …send email to Company named in Utility Service Info ASIT, Clearance To. 
// Script Run Event: IRSA
// Script Parents:
//  IRSA:Permits/Online/NA/NA
//	IRSA:Permits/Residential/NA/NA
//	IRSA:Permits/Residential/Mobile Home/NA/NA
//	IRSA:Permits/Commercial/NA/NA
/*==================================================================*/

if (inspType == "Gas Pipe Final" && inspResult == "Approved - Utl Clearance Req") {
var vEParams = aa.util.newHashtable(); 
var tmpTable = loadASITable("UTILITY SERVICE INFORMATION");  
countCityOfMesa = countASITRows(tmpTAble, "Clearance To", "City of Mesa");
countSouthwestGas = countASITRows(tmpTAble, "Clearance To", "Southwest Gas");

if (countCityOfMesa > 0 ) {
	addParameter(vEParams,"%%RECORD ID%%",capIDString);
	addParameter(vEParams,"%%CLEARANCE TO%%","City of Mesa");
	emailAddress = "rgill@accela.com";
	//emailAddress = "customerinfobillingops@mesaaz.gov";
	sendNotification("", emailAddress, "", "GAS CLEARANCE", vEParams, null, capId);
}
	if (countSouthwestGas > 0) {
		addParameter(vEParams,"%%RECORD ID%%",capIDString);
		addParameter(vEParams,"%%CLEARANCE TO%%","Southwest Gas");
		emailAddress = "rgill@accela.com";
		//emailAddress = "gasinspectiontag@swgas.com";
		sendNotification("", emailAddress, "", "GAS CLEARANCE", vEParams, null, capId);
		}
}	