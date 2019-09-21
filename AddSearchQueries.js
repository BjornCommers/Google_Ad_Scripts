/*
* @name Add Queries From Search Terms Report
* 
* @overview This script is meant to run daily and adds all the keywords from the 
* 	prior day's search terms report as positive keywords in the account while adhering to Ad Grants policy.
* 
* @author Bjorn Commers
*
* @changelog 
*  - Initial version written 6/3/2019
*  - Updated 9/16/2019 to filter out single-word keywords (per new Ad Grant policy)
*/

function main() {
  
  	// Generate the report using AWQL and create a rows iterator
	var report = AdsApp.report('SELECT Query, AdGroupId FROM SEARCH_QUERY_PERFORMANCE_REPORT DURING YESTERDAY');
	var rows = report.rows();

  	// Iterate over each row, adding that row's query as a broad-match keyword to the relevant ad group
	while(rows.hasNext()){
      var currentRow = rows.next();
      //Logger.log('query: ' + currentRow['Query']);
      
      var keywordText = currentRow['Query']
      // Only add new keyword if it contains a space
      if (keywordText.indexOf(' ') > -1){
        var adGroupId = [ currentRow['AdGroupId'] ];
        var adGroup = AdsApp.adGroups().withIds(adGroupId).get();
        var keywordOperation = adGroup.next().newKeywordBuilder().withText(keywordText).build();
      }
    }
}