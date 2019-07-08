function update() {
	var request = new XMLHttpRequest();
	var proxyURL = "https://cors-anywhere.herokuapp.com/";
	var requestURL = "https://www.treasurydirect.gov/NP_WS/debt/current?format=json";
	
	request.open("GET", proxyURL + requestURL);
	request.responseType = "json";
	request.send();
	
	request.onload = function() {
		var data = request.response;
		var debtValue = data["totalDebt"].toString();
		
		var formattedDebtValue = debtValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
		
		var debtValueHTML = document.getElementById("debtValue");
		
		debtValueHTML.innerHTML = "$" + formattedDebtValue;
		
		console.log("effectiveDate: " + data["effectiveDate"]);
		console.log("totalDebt: " + data["totalDebt"]);
	}
}
