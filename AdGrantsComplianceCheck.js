/*
* @name Ad Grants Compliance Check
* 
* @overview This script is meant to keep the account in line with Ad Grant policy.
* This is accomplished by first checking if the account's overall click-through-rate (CTR) is below 5%
* and if so pausing keywords that are below a certain threshold of CTR and Quality Score (QS).
* If you would like to change the CTR and/or QS thresholds, simply updated the variables below.
* 
* @author Bjorn Commers
*
* @changelog 
* - version 1.0
*  - Initial version created 6/3/2019
*/

function main() {
  
  // Change these two numbers to adjust the thresholds below which the keyword is paused
  // Note that the keyword is paused only if it falls below both the CTR and QS threshold
  // 	during the previous calendar month.
  // CTR is currently set to 3% and QS to 3.
  var CTR_THRESHOLD = 0.03;
  var QS_THRESHOLD = 3;
 
  
  // Calculates the overall account CTR
  var campaignIterator = AdsApp.campaigns().get();
  var totalClicks = 0;
  var totalImpressions = 0;
  
  while(campaignIterator.hasNext()){
   	var campaign = campaignIterator.next();
    totalClicks += campaign.getStatsFor("LAST_MONTH").getClicks();
    totalImpressions += campaign.getStatsFor("LAST_MONTH").getImpressions();
  }
  
  var accountCTR = totalClicks / totalImpressions;
  Logger.log("Clicks is "+totalClicks);
  Logger.log("Impressions is "+totalImpressions);
  Logger.log("Account CTR is " + accountCTR);
  
  // If the account's overall CTR is less than the required 5%...
  if(accountCTR < 0.05){
    
    //Get all the keywords that have CTR less than 3% AND quality score <= 3
    var keywordIterator = AdsApp.keywords()
    						.withCondition("Ctr < " + CTR_THRESHOLD)
    						.withCondition("QualityScore <= " + QS_THRESHOLD)
    						.withCondition("Status = ENABLED")
    						.forDateRange("LAST_MONTH")
    						.get();
    
    //Pause each of those keywords
    while (keywordIterator.hasNext()){
      var keyword = keywordIterator.next();
      Logger.log("Pausing keyword: "+keyword.getText());
      keyword.pause();
    }
  }
}