var App = function() {
    var app = this;

    app.prevDebt = 0;
    
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
	  for the request to finish is having the rest of the 
	  functions be executed in this function?
	  
	  Using this.request did not work, kept getting
	  "this.request is undefined" errors.
	*/
	request.onload = function() {
	    var data = request.response;
	    
	    var entriesLength = data["entries"].length;
	    var latestDebt = data["entries"][0]["totalDebt"];
	    var latestDebtDate = data["entries"][0]["effectiveDate"];
	    
	    var initialDebt = data["entries"][entriesLength-1]["totalDebt"];
	    
	    var secRate = (latestDebt - initialDebt)/(entriesLength * 86400);
	    
	    console.log("requestURL: " + requestURL);
	    console.log("latestDebt: " + latestDebt);
	    console.log("latestDebtDate: " + latestDebtDate);
	    console.log("initialDebt: " + initialDebt);
	    console.log("entriesLength: " + entriesLength);
	    console.log("secRate: " + secRate);
	    console.log("requestStatus: " + request.status);
	    
	    app.calculateAndShowDebt(latestDebt, latestDebtDate, secRate);
	}
    };
    
    app.calculateAndShowDebt = function(latestDebt, latestDebtDate, secRate) {
	var latestDebtDateParsed = app.parseDate(latestDebtDate);
	var latestDebtDateMoment = moment(latestDebtDateParsed, "MM-DD-YYYY");
	var now = moment();
	var diff = now.diff(latestDebtDateMoment, 'seconds');
	
	console.log("latestDebtDateMoment: " + latestDebtDateMoment.format("dddd, MMMM Do YYYY, h:mm:ss a"));
	console.log("now: " + now.format("dddd, MMMM Do YYYY, h:mm:ss a"));
	console.log("diff: " + diff);

	var nowDebt = latestDebt + (secRate * diff);
	console.log("nowDebt: " + nowDebt);

	document.getElementById("debtValue").innerHTML = "$" + nowDebt.toLocaleString();

	if(app.prevDebt > 0) {
	    var prevDiff = nowDebt - app.prevDebt;

	    document.getElementById("diffValue").innerHTML = "Difference from previous: $" + prevDiff.toLocaleString();
	}
	
	app.prevDebt = nowDebt;
    };
    
    app.getStartDate = function(currentDate) {
	if(((currentDate.getMonth()+1) <= 9 && currentDate.getDate() <= 30) ||
	   (currentDate.getMonth()+1) == 10 && currentDate.getDate() == 1) {
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

    app.parseDate = function(date) {
	var dateSplit = date.split(' ');
	var monthNum = -1;
	var dayNum = dateSplit[1].substring(0, dateSplit[1].indexOf(","));
	var yearNum = dateSplit[2];
	
	switch(dateSplit[0]) {
	case "January":
	    monthNum = 1;
	    break;

	case "February":
	    monthNum = 2;
	    break;

	case "March":
	    monthNum = 3;
	    break;

	case "April":
	    monthNum = 4;
	    break;

	case "May":
	    monthNum = 5;
	    break;

	case "June":
	    monthNum = 6;
	    break;

	case "July":
	    monthNum = 7;
	    break;

	case "August":
	    monthNum = 8;
	    break;

	case "September":
	    monthNum = 9;
	    break;

	case "October":
	    monthNum = 10;
	    break;

	case "November":
	    monthNum = 11;
	    break;

	case "December":
	    monthNum = 12;
	    break;
	}

	return (monthNum + "-" + dayNum + "-" + yearNum);
    };
};

var app = new App();
window.onload = app.run();
