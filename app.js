var App = function() {
	var app = this;

	app.run = function() {
		app.getRate();
	};

	// returns per second average rate
	app.getRate = function() {
		var request = new XMLHttpRequest();
		var proxyURL = "https://cors-anywhere.herokuapp.com/";
		
		var currentDate = new Date();
		
		/*
			Variables are "returned" from the method like this
			because the onload function down below causes problems
			when trying to actually return things in this function.
			
			I blame JavaScript.
		*/
		
		var startDate = app.getStartDate(currentDate);
		var endDate = app.getCurrentDate(currentDate);
		
		var requestURL = "https://www.treasurydirect.gov/NP_WS/debt/search?startdate=" 
			+ startDate + "&enddate=" + endDate + "&format=json";
	
		request.open("GET", proxyURL + requestURL);
		request.responseType = "json";
		request.send();
		
		/*
			Is the only way to make sure the program is waiting 
			for the request to finish) is having the rest of the 
			functions be executed in this function?
			
			Using this.request did not work, kept getting
			"this.request is undefined" errors.
		*/
		request.onload = function() {
			var data = request.response;
			
			var entriesLength = data["entries"].length;
			var latestDebt = data["entries"][0]["totalDebt"];
			var latestDebtDate = ["entries"][0]["effectiveDate"];
			
			var initialDebt = data["entries"][entriesLength-1]["totalDebt"];
			
			var secRate = (latestDebt - initialDebt)/(entriesLength * 86400);
			
			console.log("requestURL: " + requestURL);
			console.log("latestDebt: " + latestDebt);
			console.log("latestDebtDate: " + latestDebtDate);
			console.log("initialDebt: " + initialDebt);
			console.log("entriesLength: " + entriesLength);
			console.log("secRate: " + secRate);
			console.log("requestStatus: " + request.status);
			
			app.showDebt(latestDebt, latestDebtDate, secRate);
		}
	};
	
	app.showDebt = function(latestDebt, latestDebtDate, secRate) {
		
	};
	
	app.getStartDate = function(currentDate) {
		if((currentDate.getMonth()+1) <= 9 && currentDate.getDate() <= 31) {
			return (currentDate.getFullYear()-1) + "-" + "10" + "-" + "1";
		}
		
		else {
			return currentDate.getFullYear() + "-" + "10" + "-" + "1";
		}
		
		return "";
	};
	
	app.getCurrentDate = function(currentDate) {
		return currentDate.getFullYear() + "-" + (currentDate.getMonth()+1)
			+ "-" + currentDate.getDate();
	};
};

var app = new App();
window.onload = app.run();
