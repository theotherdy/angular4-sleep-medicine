//Site id: c58f1a8c-b9a6-4757-8ee0-bac6b3816c26
/*
 * getCurrentUser()
 * Gets data about the current logged in user
 * If user has access role (or no role is defined), hides toolMenu, navigation etc
 * If user has maintain/contribute role, add toggle for toolMenu
 * If user is Oxford user, show their My Workspace Resources (My Portfolio)
 * If user not a non-Oxford user, hide the My Portfolio section
 */
//var overlayRequests = 0;
var msdlt_eid = 0;
var msdlt_longid = '';
var topLevelFolderName = 'My Stuff';

//Function for obtaining information about user
//If user has a role in the main BMS site, setup the site based on that role (i.e. don't show full screen for maintainers/contributors)
function setupUserContent() {
	$.getJSON('/direct/user/current.json', function(data) {
		//Find out what this user's role in the main site is
		$.ajax({
			  url: '/direct/membership/' + data.id + '::site:' + config.siteId + '.json',
			  dataType: 'json',
			  cache: false,
			  success: function(data) {
					//data was returned, so update display based on members role
					updateDisplay(data.memberRole);
			  },
			  error: function() {
				  //use doesn't have a role within this site, so update on the basis of them being an access user
				  updateDisplay("access");
			  }
		});
		
		getYear(data.id, data.displayId);	//Get the user's year, and then proceed with page setup
		msdlt_eid = parseInt(data.eid, 10);
		if(isNaN(msdlt_eid)) {
			msdlt_eid = data.eid;
		}
		msdlt_longid = data.id;
		show_portfolio();	//call show_portfolio function - will display workspace documents if user is an Oxford user
	});
}

//Function for setting up page layout
function updateDisplay(myRole){		
	//Deals with whether to show full screen or within WebLearn frames 
	//Get membership info for this user in this site
	if (!(myRole == "maintain" || myRole == "contribute")){	//Role is access or nothing
		//VERY OLD VERSION - PRE SAKAI 10
		//expand iFrame and place on top
		//$('.portletMainIframe:first',window.top.document).css('position','absolute');
		//$('.portletMainIframe:first',window.top.document).css('left','0');
		//$('.portletMainIframe:first',window.top.document).css('top','0');
		//$('.portletMainIframe:first',window.top.document).css('z-index','3000');
		//$('.portletMainIframe:first',window.top.document).css('width','100%');
		
		//$('#loginLinks',window.top.document).appendTo('#headerlinks');	//Bring user's name and logout link into header
		
		//OLD VERSION - SAKAI 10
		//$('.portletTitleWrap', window.top.document).hide();	//Hide page title
		//$('#toolMenuWrap', window.top.document).hide();	//Hide left hand menu
		//$('#togglebar', window.top.document).hide();	//Hide left hand menu toggle
		
		//Fix widths, padding and margins of outer frame so it is 100% width with no margins/padding, and the margins are defined by the inner content 
		//$('#content', window.top.document).css('padding', 0);
		//$('#col1', window.top.document).css('padding-right', 0);
		//$('#col1 .portletMainWrap', window.top.document).css('width', '100%');
		//$('#col1 .portletBody', window.top.document).css('margin-left', 0);
		
		//NEW VERSION - SAKAI 11
		$('.Mrphs-toolTitleNav', window.top.document).hide();	//Hide Site info display nav
		$('#toolMenuWrap', window.top.document).hide();	//Hide left hand menu
		
		//Fix widths, padding and margins of outer frame so it is 100% width with no margins/padding, and the margins are defined by the inner content 
		$('#content', window.top.document).css('padding', 0);
		$('#col1of2', window.top.document).css('padding-right', 0);
		$('#col1of2', window.top.document).css('width', '100%');
		$('#col1of2', window.top.document).css('margin-left', 0);
		
		$('#col2of2', window.top.document).hide();	//Hide column 2
		
		//$('li.Mrphs-skipNav__menuitem--worksite').clone().removeClass('Mrphs-skipNav__menuitem').removeClass('Mrphs-skipNav__menuitem--worksite').prependTo('#quickLinks');
		$('.view-all-sites-btn', window.top.document).css('display', 'inline-block');
		$('#skipNav', window.top.document).hide();
		$('.Mrphs-siteHierarchy', window.top.document).hide();
		$('#content', window.top.document).css('margin-top', '0');
		$('div.portletBody', window.top.document).css('margin-top', '0').css('padding', '2px');
		var width = $('body', window.top.document).width();
		if(width < 784) {
			$('#selectSiteModal', window.top.document).css('margin-top', '-34px');
		}
	}
}

//Function for getting the user's year
//Currently assumes memebership of year 3 and, but then tries each year in turn, before defaulting to 3
function getYear(sakaiId, displayId) {
	var year = 3;	//Default to year 3
	
	//Which year is the user a member of
	//Try year 3
	$.ajax({
		  url: '/direct/membership/' + sakaiId + '::site:' + config.year3Id + '.json',
		  dataType: 'json',
		  cache: false,
		  success: function(data) {
				//data was returned, so user is in year 2
				year = 3;
				setupSiteContent(year, displayId);
		  },
		  error: function() {
			//Try year 2
			$.ajax({
				  url: '/direct/membership/' + sakaiId + '::site:' + config.year2Id + '.json',
				  dataType: 'json',
				  cache: false,
				  success: function(data) {
						//data was returned, so user is in year 2
						year = 2;
						setupSiteContent(year, displayId);
				  },
				  error: function() {
						//Try year 1
						$.ajax({
							  url: '/direct/membership/' + sakaiId + '::site:' + config.year1Id + '.json',
							  dataType: 'json',
							  cache: false,
							  success: function(data) {
									//data was returned, so user is in year 1
									year = 1;
									setupSiteContent(year, displayId);
							  },
							  error: function() {
									//Assume year 3
									year = 3;
									setupSiteContent(year, displayId);
							  }
						});
				  }
			});
		}
	});
}

function setupSiteContent(year, displayId) {
	//Initialise variables
	//var chatUrl = "";
	var calendarURL = "";	//Url for the calendar iframe
	var iCalURL = "";	//iCal feed URL
	var pdfCalURL = "";	//Calendar PDF URL
	//var yearId = "";
	
	showAnnouncements(true);	//Show all of user's announcements (not just BMS-related ones)
	
	if(year === 1) {
		//Hide unnecessary year tabs in docs
		$('#year2tab').remove();
		$('#year3tab').remove();
		$('#year3docs').remove();
		$('#year2docs').remove();
		
		//Set variables
		calendarURL = config.year1CalendarURL;	
		iCalURL = config.year1iCalURL;
		pdfCalURL = config.year1pdfCalURL;
		//chatUrl = config.year1Chat;
	}
	else if(year === 2) {
		//Hide unnecessary year tabs in docs
		$('#year3tab').remove();			
		$('#year3docs').remove();

		//Set variables
		calendarURL = config.year2CalendarURLBase + displayId;	
		iCalURL = config.year2iCalURLBase + displayId;
		//chatUrl = config.year2Chat;
		pdfCalURL = config.year2pdfCalURL;
	}
	else if(year === 3) {
		//Set variables
		calendarURL = config.year3CalendarURLBase + displayId;	
		iCalURL = config.year3iCalURLBase + displayId;
		pdfCalURL = config.year3pdfCalURL;
	}
	$("ul.tabs").tabs("div.panes > div");	//Create resources tabs

	showCalendar(calendarURL,iCalURL,pdfCalURL, displayId); //show Calendar div
	showBookshelf(year, displayId);	//Show the Course Documents - pass year and displayId
	//showChat(chatUrl); //JHM 3-2-12 Chat removed
} //End setupSiteContent function


function showAnnouncements(siteMember){
	var announcementsUrl = "";
	if(siteMember) {
		//User is a member of a site, so show all of their announcements, which will include those for the site(s) of which they are a member
		announcementsUrl = '/direct/announcement/user.json?n=20&d=60';
	}
	else {
		//User is not a member of a year site, so default to showing them the year 1 announcements
		announcementsUrl = '/direct/announcement/site/91037ab0-41f0-495f-b14e-cf7e5171bb44.json?d=60&n=20';
	}
	//Get announcements
	$.ajaxSetup({ cache: false });	//Disable caching for ajax requests
	$.getJSON(announcementsUrl, function(data) {
		if($(data["announcement_collection"]).size() === 0) {
			$('#announcements').append("<div class=\"box_note\">There are no recent Announcements</div>");
		}
		else {
			$(data["announcement_collection"]).each(function(){
				date = new Date(this["createdOn"]);//*1000);
				//date_time = date.getHours()+":"+date.getMinutes()+ " " + date.getDate() + "/"+ (date.getMonth()+1) + "/"+ date.getFullYear();// create a new javascript Date object based on the timestamp
				date_time = date.getHours()+":"+date.getMinutes()+ " " + date.getDate() + "/"+ (date.getMonth()+1) + "/"+ date.getFullYear();// create a new javascript Date object based on the timestamp
				announcement = '<h3 class="accordion_head"><a href="#">'+this["entityTitle"]+' <span class="accordion_head_details">('+this["createdByDisplayName"]+ ' - '+date_time+')</span></a></h3><div class="accordion_body">'+this["body"];
				//Add any attachments to the bottom of the announcements 
				if(this["attachments"].length > 0) {
					$(this["attachments"]).each(function() {
						announcement += '<br /><br /><div><a href="' + this["url"] + '" target="_blank">' + this["name"] + '</a></div>';
					});
				}
				announcement += '</div>';
				$('#announcements').append(announcement);
			});
		}
		//This snippet ws supposed to deal with double click problems. Initially seemed to work, but then stopped working, not sure why
		/*$('.accordion .accordion_head').bind('dblclick',function(e){
		    e.preventDefault();
		});*/
		$('.accordion .accordion_head').next().hide();	//Hide announcement content divs
		bindClick();	//Toggle content divs on click on header, and prevent double clicks
		
		//Original accordion function
		/*$('.accordion .accordion_head').click(function(){
			$(this).toggleClass('accordion_head_active').next().toggle('blind');
			return false;
		}).next().hide();*/
	});
}

function bindClick() {
	$('.accordion .accordion_head').click(function(){
		$('.accordion .accordion_head').unbind('click');	//Unbind once clicked - prevents double click
		$(this).toggleClass('accordion_head_active').next().toggle('blind', function() { bindClick(); });	//Show content then rebind click event to header
		return false;
	});
}

function showChat(chatUrl){
	var chatContent = '<a href="'+chatUrl+'" target="_top">Please visit the Chat Room</a> to join in.<br/><br /><em>Please ensure that your messages are appropriate for a discussion which will involve course tutors and will be recorded.</em>';
	$(chatContent).appendTo('#mychat');
}

function showCalendar(calendarURL,iCalURL,pdfCalURL,displayId){
	//Load the appropriate calendar  (defined in bms_config.js)
	
	//Google Calendar
	//var calendarFrame = '<iframe scrolling="no" height="300" frameborder="0" width="100%" style="border: 0pt none;" src="' + calendarURL + '"></iframe>';
	
	//Our Calendar
	var calendarFrame = '<iframe scrolling="no" height="300" frameborder="0" width="100%" style="border: 0pt none;" src="' + calendarURL + '"></iframe>';
	$(calendarFrame).appendTo('#calendar');
	
	//Get the link for the iCal feed for the above calendar (defined in bms_config.js)
	$('a.ical_link').each(function() {
		$(this).attr('href', iCalURL);	//Add ical link 
	});
	$('a.ical_link').click(function(e) {
		e.preventDefault();	//stop default of downloading ics file
		//When iCal link is clicked, popup instruction box
		var parentWidth = parseInt($("#ical_link_overlay").parent('div.box').css('width').replace('px', ''));	//Get the width of the calendar box
		var overlayWidth = (parentWidth - 40) + 'px';	
		$("#ical_link_overlay").css('width', overlayWidth);
		
		//$("#ical_link_https").attr('href', iCalURL).text(iCalURL);
		$("#ical_link_https").val(iCalURL);
		var webcalsUrl = iCalURL.replace('https', 'webcals');
		$("#ical_link_webcals").attr('href', webcalsUrl).text(webcalsUrl);
		
		$("#ical_link_overlay").overlay({
			closeOnClick: true,
			load: true,
			top: 360,
			mask: {
		    	color: '#fff',
		    	loadSpeed: 200,
			    opacity: 0.7
		    }
	    }).load();
	});
	$('a.pdfcal_link').each(function() {
		$(this).attr('href', pdfCalURL);	//Add ical link 
	});
}

function showBookshelf(year, displayId){
	//Show shared documents for all users 
	var sharedUrl = config.sharedDocsURL;
	$.getJSON(sharedUrl, function(data) {
		var output = "";
		for(var folder in data.content_collection) {
			output += processFolder(data.content_collection[folder]);
		}
		create_jstree("#shareddocs", output);
	});

	//Show careers/postgrad documents for all users 
	var careersPostgradURL = config.careersPostgradURL;
	$.getJSON(careersPostgradURL, function(data) {
		var output = "";
		for(var folder in data.content_collection) {
			output += processFolder(data.content_collection[folder]);
		}
		create_jstree("#careersdocs", output);
	});
	
	//Show year 1 docs for all users
	var year1Resources = '/direct/content/resources/group/' + config.year1Id + '.json?depth=1';
	$.ajaxSetup({ cache: false });	//Disable caching for ajax requests
	$.getJSON(year1Resources, function(data) {
		var output = "";
		//Process the top level folder
		for(var folder in data.content_collection) {
			output += processFolder(data.content_collection[folder]);
		}
		create_jstree("#year1docs", output);
	});

	if(year >= 2) {	//If user is in year 2 or above, need to figure out what reousrces they should see in the Year 2 tab
		//open csv file containing options/practical choices and get options for user
		$.ajaxSetup({ cache: false });	//Disable caching for ajax requests
		$.get(config.year2OptionChoices, function(data) {
			var lines = data.split(/\r\n|\n/);
			var humanHeaders = lines[0];
			var typeHeaders = lines[1].split(',');
			var headersSplit = lines[2].split(',');

			//Work out which options and practicals the user is taking
			var y2optsTaking = [];
			var y2pracsTaking = [];
			var y2optsNotTaking = [];
			var y2pracsNotTaking = [];
			var y2optsTakingPaths = [];
			var y2pracsTakingPaths = [];
			var y2optsNotTakingPaths = [];
			var y2pracsNotTakingPaths = [];
			for(var i=3; i < lines.length; i++) {	//Loop through lines, starting at the fourth line
				var userId = lines[i].split(',',1);	//Get user id
				if(userId[0] == displayId) {	//Is this line for the current user?
					var lineSplit = lines[i].split(',');	//Split the line at commas
					for(var j = 1; j < lineSplit.length; j++) {	//Look through columns
						if(lineSplit[j] == '1') {	//If option/practical is 'on' for this user, they are taking the option
							if(typeHeaders[j] == "Option") {	//if this is an option, add to optsTaking array
								y2optsTaking.push(headersSplit[j]);
								y2optsTakingPaths.push('/group/' + config.year2Id + '/' + config.year2OptsSubfolder + '/' + headersSplit[j] + '/');
							}
							else if(typeHeaders[j] == "Practical") {	//if this is an practical, add to pracsTaking array
								y2pracsTaking.push(headersSplit[j]);
								y2pracsTakingPaths.push('/group/' + config.year2Id + '/' + config.year2PracsSubfolder + '/' + headersSplit[j] + '/');
							}
						}
						else {	//user is not taking this option
							if(typeHeaders[j] == "Option") {	//if this is an option, add to optsNotTaking array
								y2optsNotTaking.push(headersSplit[j]);
								y2optsNotTakingPaths.push('/group/' + config.year2Id + '/' + config.year2OptsSubfolder + '/' + headersSplit[j] + '/');
							}
							else if(typeHeaders[j] == "Practical") {	//if this is an practical, add to pracsNotTaking array
								y2pracsNotTaking.push(headersSplit[j]);
								y2pracsNotTakingPaths.push('/group/' + config.year2Id + '/' + config.year2PracsSubfolder + '/' + headersSplit[j] + '/');
							}
						}
					}
					break;	//We found the current user, so don't loop through any more lines
				}
			}
			
			//Headers for folders that will contain the options/practicals that the user is not doing
			var otherOptsHeader = "Other Options";
			var otherPracsHeader = "Other Practicals";
			
			//If user is taking all pracs and all options, or no options/pracs details have been found (i.e. notTaking arrays are empty), show all of the options under options/practicals headers
			if(y2optsNotTaking.length === 0 && y2pracsNotTaking.length === 0) {	
				y2optsTaking.length = 0;	//Empty optsTaking
				y2pracsTaking.length = 0;	//Empty pracsTaking
				y2optsNotTaking.length = 0;	//Empty optsNotTaking
				y2pracsNotTaking.length = 0;	//Empty pracsNotTaking
				otherOptsHeader = "Options";
				otherPracsHeader = "Practicals";
				//Add all opts/pracs to notTaking arrays
				for(var j = 1; j < headersSplit.length; j++) {	//Look through columns
					if(typeHeaders[j] == "Option") {	//if this is an option, add to optsNotTaking array
						y2optsTaking.push(headersSplit[j]);
						y2optsTakingPaths.push('/group/' + config.year2Id + '/' + config.year2OptsSubfolder + '/' + headersSplit[j] + '/');
					}
					else if(typeHeaders[j] == "Practical") {	//if this is an practical, add to pracsNotTaking array
						y2pracsTaking.push(headersSplit[j]);
						y2pracsTakingPaths.push('/group/' + config.year2Id + '/' + config.year2PracsSubfolder + '/' + headersSplit[j] + '/');
					}
				}
			}

			var year2Resources = '/direct/content/resources/group/' + config.year2Id + '.json?depth=1';
			$.getJSON(year2Resources, function(data) {
				var output = "";
				
				var output = "";
				
				//Define which folders should be shown before the options folder - Course Info and Timetables Only
				var topSubfoldersToDisplay = [
					'/group/' + config.year2Id + '/' + config.year2InfoSubfolder + '/',
					'/group/' + config.year2Id + '/' + config.year2TimetableSubfolder + '/'
				];
				
				//Process the top level folder, adding only folders that this user should see
				for(var folder in data.content_collection) {
					output += processFolder(data.content_collection[folder], topSubfoldersToDisplay, true, false);
				}
								
				//Add options folders for options that the user is taking
				var optsUrl = '/direct/content/resources/group/' + config.year2Id + '/' + config.year2OptsSubfolder + '.json?depth=1';
				//var nonEPOptsBase = '/direct/content/resources/group/' + config.year2Id + '/' + config.year2OptsSubfolder + '/';
				//var nonEPOptsBase = '/direct/content/resources';
				
				var optsTakingOutputs = [];	//array for outputs for options that the user is taking
				var optsNotTakingOutputs = [];	//array for outputs for options that the user is not taking
				var pracsTakingOutputs = [];	//array for outputs for options that the user is taking
				var pracsNotTakingOutputs = [];	//array for outputs for options that the user is not taking
				var optionsProcessed = 0;
				
				for(var i = 0; i < config.year2OptsPracs.length; i++) {
					var opt = config.year2OptsPracs[i];
					var optionUrl = '/direct/content/resources/group/';
					if(typeof(config.year2OptsUrls[opt]) !== "undefined") {	//EP options
						optionUrl += config.year2OptsUrls[opt] + '.json?depth=1';
					}
					else {	//Other options and practicals
						if($.inArray(opt,config.year2Pracs) > -1) {
							optionUrl += config.year2Id + '/' + config.year2PracsSubfolder + '/' + opt + '.json?depth=1';
						}
						else {
							optionUrl += config.year2Id + '/' + config.year2OptsSubfolder + '/' + opt + '.json?depth=1';
						}
					}
					
					$.getJSON(optionUrl, function(optdata) {
						for(var folder in optdata.content_collection) {
							var resourceId = optdata.content_collection[folder].resourceId;
							var siteId = resourceId.substring(7,resourceId.length-1);
							//Work out where in the order (based on the order as specified in the config file) this option is - all options are AJAX together, so need to specify the position, rather than just adding them in the order the requests are completed
							//Get the option from year3OptsUrls, using the site ID, if possible (i.e. if an EP option)
							for(var tempOpt in config.year2OptsUrls) {
								if(config.year2OptsUrls[tempOpt] == siteId) {
									var opt = tempOpt;
									break;
								}
							}
							if(typeof(opt) == "undefined") {	//If opt is not defined, it must be a non EP option, so get the option from the end of the siteId
								var opt = siteId.substr(-3).replace("/","");
								
							}
							var position = $.inArray(opt,config.year2OptsPracs);
							if(position === -1) {	//If opt was not found in the OptsPracs array, just add it to the end
								position = i++;
							}
							
							//Generate HTML for the option
							var optionOutput = "<li class=\"jstree-closed\" id=\"" + resourceId + "\"><a href=\"javascript: void(0);\" class=\"folder_link\">" + optdata.content_collection[folder].name + "</a>";
							optionOutput += processFolder(optdata.content_collection[folder], null, true, true);
							optionOutput += "</li>";
							
							//Add the option HTML to the appropriate array, in the appropriate position
							if($.inArray(opt,y2optsTaking) > -1) {	//If option is in y2optsTaking array
								optsTakingOutputs[position] = optionOutput;	//Add folders to optsTakingOutputs array
							}
							else if($.inArray(opt,y2optsNotTaking) > -1) {	//If option is in y2optsNotTaking array
								optsNotTakingOutputs[position] = optionOutput;	//Add folders to optsNotTakingOutputs array
							}
							else if($.inArray(opt,y2pracsTaking) > -1) {	//If option is in y2pracsTaking array
								pracsTakingOutputs[position] = optionOutput;	//Add folders to pracsTakingOutputs array
							}
							else if($.inArray(opt,y2pracsNotTaking) > -1) {	//If option is in y2pracsNotTaking array
								pracsNotTakingOutputs[position] = optionOutput;	//Add folders to pracsNotTakingOutputs array
							}
						}
						optionsProcessed++;	//Increment the optionsProcessed counter
						if(optionsProcessed == config.year2OptsPracs.length) {	//Have we processed all of the options?
							show_y2_tree(data, output, optsTakingOutputs, optsNotTakingOutputs, pracsTakingOutputs, pracsNotTakingOutputs);	//create the tree
						}
					})
					.fail(function(optdata) {
						optionsProcessed++;	//Increment the optionsProcessed counter
						if(optionsProcessed == config.year2OptsPracs.length) {	//Have we processed all of the options?
							show_y2_tree(data, output, optsTakingOutputs, optsNotTakingOutputs, pracsTakingOutputs, pracsNotTakingOutputs);	//create the tree
						}
					});
				}
				
				/*
				$.getJSON(optsUrl, function(data) {	//Get options top level folder
					for(var folder in data.content_collection) {
						output += processFolder(data.content_collection[folder], y2optsTakingPaths, false, false);	//Add folders in optsTaking to output
					}
					
					//Add practicals folders for practicals that the user is taking
					var pracsUrl = '/direct/content/resources/group/' + config.year2Id + '/' + config.year2PracsSubfolder + '.json?depth=1';
					$.getJSON(pracsUrl, function(data) {	//Get practicals top level folder
						for(var folder in data.content_collection) {
							output += processFolder(data.content_collection[folder], y2pracsTakingPaths, false, false);	//Add folders in pracsTaking to output
						}
	
						//Get contents of folders for options that user is not taking
						output += "<li class=\"jstree-closed\" id=\"pracs_not_taking\"><a href=\"javascript: void(0);\">" + otherOptsHeader + "</a>";

						$.getJSON(optsUrl, function(data) {	//Get options top level folder
							for(var folder in data.content_collection) {
								output += processFolder(data.content_collection[folder], y2optsNotTakingPaths, true, true);	//Add folders in optsNotTaking to output
							}
							output += "</li>";
							
							//Get contents of folders for practicals that user is not taking
							output += "<li class=\"jstree-closed\" id=\"opts_not_taking\"><a href=\"javascript: void(0);\">" + otherPracsHeader + "</a>";
							$.getJSON(pracsUrl, function(data) {	//Get practicals top level folder
								for(var folder in data.content_collection) {
									output += processFolder(data.content_collection[folder], y2pracsNotTakingPaths, true, true);	//Add folders in pracsNotTaking to output
								}
								output += "</li></ul>";	//Finish list
								create_jstree("#year2docs", output);	//Create tree using output list
							});
						});
					});
				});*/
			});		
		});
	}
		
	if(year === 3) {	//If user is in year 3 
		//if(msdlt_eid == 82957 || msdlt_eid == 'jon@jonmase.co.uk') {
		//open csv file containing options/practical choices and get options for user
		$.ajaxSetup({ cache: false });	//Disable caching for ajax requests
		$.get(config.year3OptionChoices, function(data) {
			var lines = data.split(/\r\n|\n/);
			var humanHeaders = lines[0];
			var headersSplit = lines[2].split(',');

			//Work out which options the user is taking
			var y3optsTaking = [];
			var y3optsNotTaking = [];
			for(var i=3; i < lines.length; i++) {	//Loop through lines, starting at the fourth line
				var userId = lines[i].split(',',1);	//Get user id
				if(userId[0] == displayId) {	//Is this line for the current user?
					var lineSplit = lines[i].split(',');	//Split the line at commas
					for(var j = 1; j < lineSplit.length; j++) {	//Look through columns
						if(lineSplit[j] == '1') {	//If option/practical is 'on' for this user, they are taking the option
							y3optsTaking.push(headersSplit[j]);
						}
						else {	//user is not taking this option
							y3optsNotTaking.push(headersSplit[j]);
						}
					}
					break;
				}
			}
			
			var otherOptsHeader = "Other Options";
			//If user is taking all options, or no options details have been found (i.e. notTaking array is empty), show all options as if user is taking them all
			if(y3optsNotTaking.length === 0) {	
				//Add all opts/pracs to notTaking arrays
				for(var j = 1; j < headersSplit.length; j++) {	//Look through columns
					y3optsTaking.push(headersSplit[j]);
				}
				y3optsNotTaking.length = 0;	//Empty optsTaking
			}

			var year3Resources = '/direct/content/resources/group/' + config.year3Id + '.json?depth=1';
			$.getJSON(year3Resources, function(data) {
				var output = "";
				
				//Define which folders should be shown before the options folder - Course Info Only
				var topSubfoldersToDisplay = [
					'/group/' + config.year3Id + '/' + config.year3InfoSubfolder + '/',
					'/group/' + config.year3Id + '/' + config.year3TimetableSubfolder + '/'
				];
								
				//Process the top level folder, adding only folders that this user should see
				for(var folder in data.content_collection) {
					output += processFolder(data.content_collection[folder], topSubfoldersToDisplay, true, false);
				}
				
				//Add options folders
				var optsTakingOutputs = [];	//array for outputs for options that the user is taking
				var optsNotTakingOutputs = [];	//array for outputs for options that the user is not taking
				var optionsProcessed = 0;
				var linkOnlyOptions = 0;
				
				for(var i = 0; i < config.year3Opts.length; i++) {	//Loop through all options
					var optId = config.year3Opts[i];
					var optionUrlInConfig = config.year3OptsUrls[optId];
					if(optionUrlInConfig.substr(0, 4) === 'http') {
						linkOnlyOptions++;
						var optionOutput = "<li><a href=\"" + optionUrlInConfig + "\" target=\"_blank\" title=\"" + config.year3OptsNames[optId] + "\">" + config.year3OptsNames[optId] + "</a></li>";
						
						//Work out where in the order (based on the order as specified in the config file) this option is
						var position = $.inArray(optId,config.year3Opts);
						if(typeof(position) == "undefined") {	//If order is not defined, just add it to the end
							var position = i++;
						}
								
						//Add the option HTML to the appropriate array, in the appropriate position
						if($.inArray(optId,y3optsTaking) > -1) {	//If option is in y3optsTaking array
							optsTakingOutputs[position] = optionOutput;	//Add folders to optsTakingOutputs array
						}
						else {
							optsNotTakingOutputs[position] = optionOutput;	//Add folder to optsNotTakingOutputs array
						}
					}
					else {
						var optionUrl = '/direct/content/resources/group/' + optionUrlInConfig + '.json?depth=1';
						$.getJSON(optionUrl, function(optdata) {	//Get options top level folder
							for(var folder in optdata.content_collection) {
								var resourceId = optdata.content_collection[folder].resourceId;
								var siteId = resourceId.substring(7,resourceId.length-1);
								
								//Generate HTML for the option
								var optionOutput = "<li class=\"jstree-closed\" id=\"" + resourceId + "\"><a href=\"javascript: void(0);\" class=\"folder_link\">" + optdata.content_collection[folder].name + "</a>";
								optionOutput += processFolder(optdata.content_collection[folder], null, true, true);
								optionOutput += "</li>";
								
								//Work out where in the order (based on the order as specified in the config file) this option is - all options are AJAX together, so need to specify the position, rather than just adding them in the order the requests are completed
								for(var opt in config.year3OptsUrls) {
									if(config.year3OptsUrls[opt] == siteId) {
										var position = $.inArray(opt,config.year3Opts);
										break;
									}
								}
								if(typeof(position) == "undefined") {	//If order is not defined, just add it to the end
									var position = i++;
								}
								
								//Add the option HTML to the appropriate array, in the appropriate position
								if($.inArray(opt,y3optsTaking) > -1) {	//If option is in y3optsTaking array
									optsTakingOutputs[position] = optionOutput;	//Add folders to optsTakingOutputs array
								}
								else {
									optsNotTakingOutputs[position] = optionOutput;	//Add folder to optsNotTakingOutputs array
								}
							}
							optionsProcessed++;	//Increment the optionsProcessed counter
							if(optionsProcessed == (config.year3Opts.length-linkOnlyOptions)) {	//Have we processed all of the options?
								show_y3_tree(data, output, optsTakingOutputs, optsNotTakingOutputs);	//create the tree
							}
						})
						.fail(function(optdata) {
							optionsProcessed++;	//Increment the optionsProcessed counter
							if(optionsProcessed == (config.year3Opts.length-linkOnlyOptions)) {	//Have we processed all of the options?
								show_y3_tree(data, output, optsTakingOutputs, optsNotTakingOutputs);	//create the tree
							}
						});
					}
				}
			});		
		});
		//}
		//else {
		 //Old code that just gets everything in the Year 3 Resources folder
		/*	var year3Resources = '/direct/content/resources/group/' + config.year3Id + '.json?depth=1';
			$.getJSON(year3Resources, function(data) {
				var output = "";
				//Process the top level folder
				for(var folder in data.content_collection) {
					output += processFolder(data.content_collection[folder]);
				}
				create_jstree("#year3docs", output);
			});*/
		//}
	}
	//setupOverlays("bookshelf");
}

//Function for creating and displaying the year 3 tree, once all of the option requests have been completed
function show_y2_tree(data, output, optsTakingOutputs, optsNotTakingOutputs, pracsTakingOutputs, pracsNotTakingOutputs) {
	output += "<li class=\"jstree-closed folder_link\" id=\"options\"><a href=\"javascript: void(0);\" class=\"folder_link\">Options</a><ul>";	//Create Options folder
	output += optsTakingOutputs.join('');	//Add folders for options user is taking
	if(optsNotTakingOutputs.length > 0) {	//If there are any options the user is not taking, create a folder for them and add them
		output += "<li class=\"jstree-closed folder_link\" id=\"other_options\"><a href=\"javascript: void(0);\" class=\"folder_link\">Other Options</a><ul>";	//Add folder for other options
		output += optsNotTakingOutputs.join('');	//Add folder for options user is not tkaing
		output += "</ul></li>";	//Finish Other Options sublist and folder list item
	}
	output += "</ul></li>"; 	//Finish Options sublist and folder list item
	
	output += "<li class=\"jstree-closed folder_link\" id=\"practicals\"><a href=\"javascript: void(0);\" class=\"folder_link\">Practicals</a><ul>";	//Create Practicals folder
	output += pracsTakingOutputs.join('');	//Add folders for Practicals user is taking
	if(pracsNotTakingOutputs.length > 0) {	//If there are any Practicals the user is not taking, create a folder for them and add them
		output += "<li class=\"jstree-closed folder_link\" id=\"other_practicals\"><a href=\"javascript: void(0);\" class=\"folder_link\">Other Practicals</a><ul>";	//Add folder for other options
		output += pracsNotTakingOutputs.join('');	//Add folder for Practicals user is not tkaing
		output += "</ul></li>";	//Finish Other Practicals sublist and folder list item
	}
	output += "</ul></li>"; 	//Finish Practicals sublist and folder list item

	//Work out which top level folders to display, i.e. everything but the Opts/Pracs folders and the Info folder
	var topSubfoldersToDisplay = [];
	for(var folder in data.content_collection) {
		for(var child in data.content_collection[folder].resourceChildren) {
			//If folder is not opts/pracs umbrella folder, show it
			if(data.content_collection[folder].resourceChildren[child].resourceId !== '/group/' + config.year2Id + '/' + config.year2OptsSubfolder + '/' && data.content_collection[folder].resourceChildren[child].resourceId !== '/group/' + config.year2Id + '/' + config.year2PracsSubfolder + '/' && data.content_collection[folder].resourceChildren[child].resourceId !== '/group/' + config.year2Id + '/' + config.year2InfoSubfolder + '/' && data.content_collection[folder].resourceChildren[child].resourceId !== '/group/' + config.year2Id + '/' + config.year2TimetableSubfolder + '/') {
				topSubfoldersToDisplay.push(data.content_collection[folder].resourceChildren[child].resourceId);
			}
		}
	}
				
	
	//Process the top level folder, adding only the folders specified above
	for(var folder in data.content_collection) {
		output += processFolder(data.content_collection[folder], topSubfoldersToDisplay, false, false);
	}
	
	output += "</ul>";	//Finish top level list
	create_jstree("#year2docs", output);	//Create tree using output list
}

//Function for creating and displaying the year 3 tree, once all of the option requests have been completed
function show_y3_tree(data, output, optsTakingOutputs, optsNotTakingOutputs) {
	output += "<li class=\"jstree-closed folder_link\" id=\"options\"><a href=\"javascript: void(0);\" class=\"folder_link\">FHS Options and Teaching</a><ul>";	//Create Options and Teaching folder
	output += optsTakingOutputs.join('');	//Add folders for options user is taking
	if(optsNotTakingOutputs.length > 0) {	//If there are any options the user is not taking, create a folder for them and add them
		output += "<li class=\"jstree-closed folder_link\" id=\"other_options\"><a href=\"javascript: void(0);\" class=\"folder_link\">Other Options</a><ul>";	//Add folder for other options
		output += optsNotTakingOutputs.join('');	//Add folder for options user is not tkaing
		output += "</ul></li>";	//Finish Other Options sublist and folder list item
	}
	output += "</ul></li>"; 	//Finish FHS Options and Teaching sublist and folder list item
	
	//Work out which top level folders to display after the options, i.e. everything but the Opts folder and Course Info
	var topSubfoldersToDisplay = [];
	for(var folder in data.content_collection) {
		for(var child in data.content_collection[folder].resourceChildren) {
			//If folder is not opts/pracs umbrella folder, show it
			if(data.content_collection[folder].resourceChildren[child].resourceId !== '/group/' + config.year3Id + '/' + config.year3InfoSubfolder + '/') {
			//if(data.content_collection[folder].resourceChildren[child].resourceId !== '/group/' + config.year3Id + '/' + config.year3OptsSubfolder + '/' && data.content_collection[folder].resourceChildren[child].resourceId !== '/group/' + config.year3Id + '/' + config.year3InfoSubfolder + '/' && data.content_collection[folder].resourceChildren[child].resourceId !== '/group/' + config.year3Id + '/' + config.year3TimetableSubfolder + '/') {
				topSubfoldersToDisplay.push(data.content_collection[folder].resourceChildren[child].resourceId);
			}
		}
	}
	
	//Process the top level folder, adding only the folders specified above
	for(var folder in data.content_collection) {
		output += processFolder(data.content_collection[folder], topSubfoldersToDisplay, false, false);
	}
	
	output += "</ul>";	//Finish top level list
	create_jstree("#year3docs", output);	//Create tree using output list
}

/*** My Portfolio Section ***/
//Variables for keeping track of the files that are being uploaded
var uploadFiles = [];
var uploadFileCount = 0;

//Function for displaying the user's My WOrkspace resources
//Code for limiting it to certain users: if(msdlt_eid == 82957) {	//Other eids:  || msdlt_eid == 21096 || msdlt_eid == 16225 || msdlt_eid == 28832 || msdlt_eid == 15728 || msdlt_eid == 41115 || msdlt_eid == 60768
function show_portfolio(firstLoad, openFolderIds){	
	if(typeof(firstLoad) == "undefined") {	//assume we are loading the portfolio for the first time unless told otherwise
		firstLoad = true;
	}
	//If workspace tree is already there, destroy the tree and remove the div
	if ($("#myworkspace").length > 0){
		$("#myworkspace").jstree('destroy').remove();
	}
	$("#myworkspace_container").html('<div id="myworkspace"></div>');	//Create the workspace div afresh
	
	//Get the top level folder
	var myurl = "/direct/content/resources/user/" + msdlt_eid + ".json?depth=1";	//Direct call to My Workspace top level folder
	$.ajax({
		url: myurl,
		dataType: 'json',
		cache: false,
		beforeSend: function(jqXHR) {	//pass a couple of variables through in the request
			jqXHR.firstLoad = firstLoad;
			jqXHR.openFolderIds = openFolderIds;
		},
		success: function(data, status, jqXHR) {
			//Call to user's workspace resources was successful, so display top level in tree
    		var output = "";
    		
			//Add the dropzone, if the browser supports it
			if (window.File && window.FileList && window.FileReader && jqXHR.firstLoad) {
				add_dropzone();
			}
			
			if(data.content_collection[0].resourceChildren.length == 0) {	//If top level folder is empty
				output += 'There\'s nothing here, but you can <a style="text-decoration: underline;" href="javascript: load_upload_overlay(\'' + data.content_collection[0].url + '\');">upload a file</a> or <a style="text-decoration: underline;" href="javascript: load_folder_overlay(\'' + data.content_collection[0].url + '\');">create a folder</a>.';
				$('#myworkspace').html(output);
			}

	    	//Process the top level folder
			for(var folder in data.content_collection) {
				output += "<ul>";
				output += "<li class=\"jstree-open jstree-top\" id=\"/user/" + msdlt_longid + "/\"><a href=\"/access/content/user/" + msdlt_longid + "/\" class=\"folder_link folder_top\">" + topLevelFolderName + "</a><ul>";
				output += processFolder(data.content_collection[folder]);
				output += "</ul></li></ul>";
			}
			create_jstree("#myworkspace", output, true, jqXHR.openFolderIds);	//Create JSTree with file actions
			//Add instructions if this is the first time we've loaded the tree
			if(jqXHR.firstLoad) {
				$('#myworkspace_info').html('<p style="margin: 0 5px;">Right click (or Cmd+Click) on a file/folder to upload a file/create a folder/rename/delete. For other actions, go to <span id="managemyportfolio_inline"></span>.<p>');
			}

			//Add link to user's workspace resources if this is the first time we've loaded the tree
			if(jqXHR.firstLoad) {
				var workspaceUrl = "/portal/site/~" + msdlt_eid;
				var resourcesUrl = workspaceUrl;
				
				//JHM 2016-09-07 Don't worry about trying to find the resources URL, just go to My Workspace site
				/*$.get(workspaceUrl, function(data) {	//Get resources page html
					var resourcesUrl = "";
					if($('div.toolMenu li a span.icon-sakai-resources', data).parent('a').attr('href') != null) {
						//Resources link exists and has an href, so resources is not selected tool, so use this href as the resources link
						resourcesUrl = $('nav#toolMenu ul li a.icon-sakai-resources', data).attr('href');
					}
					else  {
						//No resources link, or resources link has no href, so just go to My Workspace page
						resourcesUrl = workspaceUrl;
					}
					if(resourcesUrl != "") {*/
						//Add link to full Resources page in my Workspace - uses separate page and redirect to allow new window without pop-up blocker interfering
						var resourcesLink = '<a href="'+resourcesUrl+'" title="Manage files and folders in My Workspace (opens in a new window/tab)" target="_blank" id="my_workspace_link">My Workspace</a>';
						$('#managemyportfolio').html(resourcesLink);
						$('#managemyportfolio_inline').html(resourcesLink);
						$('#managemyportfolio_inline a').css('text-decoration', 'underline');
					//}
				//});
			}
    	},
		error: function(jqXHR) {
			if(jqXHR.firstLoad) {
				//AJAX call to user's resources is unsuccessful, so assume external user, and hide My Portfolio
				$('#myportfolio').hide();	//Hide entire my portfolio section
			}
		}
	});
}

//Function for adding the dropzone to the user's workspace
function add_dropzone() {
	//Stop the browser from going to the dragged file if it is dragged somewhere else on the page
	//More that could be done with this, e.g. below does not work for the calendar, but that would be tricky as the calendar page is on learntech so we presumably cannot access that page from the WebLearn page due to XSS
	$('#bms_content, #portal-header').on('drop', null, null, function(e) {
		e.preventDefault();
		return false;
	});
	$('#bms_content, #portal-header').on('dragover', null, null, function(e) {
		e.preventDefault();
		return false;
	});
	
	jQuery.event.props.push( "dataTransfer" );	//Add DataTransfer property for use with drop event
	
	if($('a.jstree-clicked').size() > 0) {	//Is a folder selected?
		var destination = $('a.jstree-clicked').parent('li').attr('id');
		alert(destination);
	}

	$('#dropzone').show();	//Show the dropzone
	
	//Set up the dropzone events
	$('#dropzone').on('dragover', null, null, function(e) {	//Add the hover class when user hovers over the dropzone
		$(this).addClass('hover');
		return false;
	});
	$('#dropzone').on('dragleave', null, null, function(e) {	//Remove the hover class when user stops hovering over the dropzone
		$(this).removeClass('hover');
		return false;
	});
	$('#dropzone').on('dragend', null, null, function(e) {	//Remove the hover class when user finishes the drag - never seems to be fired
		e.preventDefault();
		$(this).removeClass('hover');
		return false;
	});
	//DROP EVENT
	$('#dropzone').on('drop', null, null, function(e) {
		e.preventDefault();	//Stop it from just opening the file in the page
		$('#action_message').hide();	//Hide any previous action messages
		$(this).removeClass('hover');	//Remove the hover effect

		var files = e.dataTransfer.files;	//uses FileList object to get list of selected files
		upload_files(files);
		
		return false;
	});
	
	$('#dropzone div.instruction').click(function(e) {
		e.preventDefault();	//Stop it from just opening the file in the page
		$('#action_message').hide();	//Hide any previous action messages
		$(this).removeClass('hover');	//Remove the hover effect
		
		$('#portfolio_file_chooser').click();
	});	
	
	$('#portfolio_file_chooser').change(function() {
		var files = $('#portfolio_file_chooser').get(0).files;
		upload_files(files);
	});
}

function upload_files(files) {
	//Loop through files, uploading each one
	for (var i = 0; i < files.length; i++) {
		$('#dragdrop_upload_form').resetForm();
		//Create FormData element 
		var data = new FormData();

		//Add data to the form
		data.append('Filedata', files[i]);
		data.append('mode', 'create');
		data.append('actionId', '');
		data.append('type', 'org.sakaiproject.content.types.fileUpload');
		if($('a.jstree-clicked').size() > 0) {	//Is a folder selected
			if($('a.jstree-clicked').hasClass('folder_link') || $('a.jstree-clicked').hasClass('folder_top')) {	//Selected item is a folder, so upload to this folder
				var containingCollectionId = decodeURIComponent($('a.jstree-clicked').parent('li').attr('id'));	//Get the id of the collection that is selected
			}
			else {	//Selected item is not a folder, so upload to parent
				var containingCollectionId = $('a.jstree-clicked').parent('li').parent('ul').parent('li').attr('id');
			}
		}
		else {	//No folder selected so default to top level
			var containingCollectionId = '/user/' + msdlt_longid + '/';
		}
		data.append('containingCollectionId', containingCollectionId);

		//Get details of the file
		uploadFiles[uploadFileCount] = {};
		uploadFiles[uploadFileCount]['name'] = files[i]['name'];
		uploadFiles[uploadFileCount]['size'] = files[i]['size'];
		uploadFiles[uploadFileCount]['type'] = files[i]['type'];
		uploadFiles[uploadFileCount]['complete'] = 0;
		
		//Upload the file via AJAX
		$.ajax({
			url: '/direct/contentActions',
			data: data,
			contentType: false,
			processData: false,
			type: 'POST',
			beforeSend: function(jqXHR) {
				jqXHR.uploadFileCount = uploadFileCount;
				jqXHR.containingCollectionId = containingCollectionId;
			},
			xhr: function() {
				var xhr = new window.XMLHttpRequest();
				
				//Create the progress bar
				var file = uploadFiles[uploadFileCount];	//Get the current file
				var progressBarId = uploadFiles[uploadFileCount]['progressBarId'] = "dropzone_progress_" + Math.floor((Math.random()*1000000)+1);	//Generate an id for the progress bar
				uploadFileCount++;	//Increment the file count
				$('#dropzone_item_template').clone().attr('id', progressBarId).css('display', 'block').appendTo('#dropzone_list');	//Create progress bar by cloning template, giving it new id, displaying it and moving it to the dropzone_list div
				var name = file.name;
				if(name.length > 30) {	//Cut the file name down if it is too long
					name = name.slice(0, 27) + "...";
				}
				$('span.dropzone_item_name', '#' + progressBarId).html(name);	//Update file name in progress bar
				var sizekB = Math.round(file.size/1024);	//Get file size in kB
				var sizeMB = Math.round(sizekB/1024);	//Get file size in MB
				if(sizeMB < 1) {	//File is less than 1 MB
					var size = sizekB + " kB";
				}
				else {
					var size = sizeMB + " MB";
				}
				$('span.dropzone_item_size', '#' + progressBarId).html(size);	//Update file size in progress bar

				//Remove the dropzone item if the user clicks the close button
				$('span.dropzone_item_close', '#' + progressBarId).click(function(e) {
					$(this).parents('.dropzone_item').remove();
				});
				
				//Listen for upload progress and update progress bar
				xhr.upload.addEventListener("progress", function(evt){
					if (evt.lengthComputable) {
						var percentComplete = Math.round(100 * evt.loaded / evt.total);
						if(percentComplete == 100) {
							percentComplete = 99;	//Don't show it as 100% until it's confirmed (i.e. not over quota)
						}
						//Do something with upload progress
						console.log(progressBarId + ": " + percentComplete);
						$('span.dropzone_item_percent', '#' + progressBarId).html(percentComplete);
						$('div.dropzone_bar', '#' + progressBarId).width(percentComplete + '%');
					}
				}, false);
				return xhr;
			},
			success: function(responseText, textStatus, jqXHR){
				var progressBarId = uploadFiles[jqXHR.uploadFileCount]['progressBarId'];
				//Check that we don't actually have an error - this is only likely to be a problem for individual 'right-click' file uploads, as we should always get a proper error response form an XHR2 request
				if(typeof(responseText) != "undefined" && responseText.indexOf('HTTP Status') > -1 ) {
					var message = "Upload Error";
					$('span.dropzone_item_status', '#' + uploadFiles[jqXHR.uploadFileCount]['progressBarId']).html(message);
					$('span.dropzone_item_close', '#' + uploadFiles[jqXHR.uploadFileCount]['progressBarId']).show();
					$('div.dropzone_bar', '#' + uploadFiles[jqXHR.uploadFileCount]['progressBarId']).width('100%');
					$('div.dropzone_progress', '#' + uploadFiles[jqXHR.uploadFileCount]['progressBarId']).addClass('error');
					
					uploadFiles[jqXHR.uploadFileCount]['complete'] = 1;
					check_complete(uploadFiles, jqXHR.containingCollectionId);
				}
				else {	//File has been successfully uploaded
					//Update progress to 100%
					var percentComplete = '100';
					$('span.dropzone_item_status', '#' + progressBarId).html('Upload Complete');
					$('span.dropzone_item_close', '#' + uploadFiles[jqXHR.uploadFileCount]['progressBarId']).show();
					$('div.dropzone_bar', '#' + progressBarId).width('100%'); //css('background-color', '#D2ECAE');
					$('div.dropzone_progress', '#' + uploadFiles[jqXHR.uploadFileCount]['progressBarId']).addClass('complete');
					
					uploadFiles[jqXHR.uploadFileCount]['complete'] = 1;	//mark upload as completed
					check_complete(uploadFiles, jqXHR.containingCollectionId);	//Check whether all of the files have been uploaded, and refresh portfolio if they have
				}
			},
			error: function(jqXHR, status, error) {	//Something went wrong
				var message = "Upload Error";
				//Quota was exceeded
				if(typeof(jqXHR.responseText) != "undefined" && jqXHR.responseText.indexOf('exception.OverQuotaException') > -1) {
					message += ": Quota exceeded";
				}
				//File was too large
				else if (uploadFiles[jqXHR.uploadFileCount]['size']/(1024*1024) > 60) {    //If the file is larger than the 60MB limit
					//alert("file too large");
					message += ": File too large (>60 MB)";
				}
				//Other than the above 2 situations, we don't know, so don't give any more info
				
				if(message.length > 40) {
					message = message.slice(0, 37) + "...";
				}
				//Update progress bar with messages, plus change it's colour to red (error class)
				$('span.dropzone_item_status', '#' + uploadFiles[jqXHR.uploadFileCount]['progressBarId']).html(message);
				$('span.dropzone_item_close', '#' + uploadFiles[jqXHR.uploadFileCount]['progressBarId']).show();
				$('div.dropzone_bar', '#' + uploadFiles[jqXHR.uploadFileCount]['progressBarId']).width('100%');
				$('div.dropzone_progress', '#' + uploadFiles[jqXHR.uploadFileCount]['progressBarId']).addClass('error');

				uploadFiles[jqXHR.uploadFileCount]['complete'] = 1;	//mark upload as completed
				check_complete(uploadFiles, jqXHR.containingCollectionId);	//Check whether all of the files have been uploaded, and refresh portfolio if they have
			}
		});
	}
}

//Function for Checking whether all of the files have been uploaded, and refresh portfolio if they have
function check_complete(uploadFiles, containingCollectionId) {
	var uncompleted = 0;
	for(var i = 0; i < uploadFiles.length; i++) {
		if(uploadFiles[i]['complete'] == 0) {
			uncompleted = 1;
			break;
		}
	}
	
	if(!uncompleted) {	//All files have been uploaded
		//var folderPath = $.jstree._reference($('#myworkspace')).get_path($('#' + encodeURIComponent(containingCollectionId).replace(/%/g, '\\%')));
		var folderIds = get_folder_ids(containingCollectionId);	//Get the folder ids of the path to the folder the files have just been uploaded to 
		show_portfolio(false, folderIds);	//Refresh the tree
	}
}

//Function for iterating through folder structure
function processFolder(folder, childrenToDisplay, openUl, closeUl) {
	var output = "";
	if(typeof(openUl) != "undefined" && openUl) {
		output += "<ul>";
	}

	if(folder.resourceChildren.length > 0) {
		for(var child in folder.resourceChildren) {
			if(folder.resourceChildren[child].type == "org.sakaiproject.content.types.folder") {	//Resource is a folder
				//Check whether an array of folders to display has been specified
				if(typeof(childrenToDisplay) != "undefined" && childrenToDisplay != null && $.inArray(folder.resourceChildren[child].resourceId, childrenToDisplay) === -1) {
					//Array of folders to display has been specified, but this folder is not in it, so do not show it
				}
				else {
					//Add folder to output
					var description = folder.resourceChildren[child].description;
					var name = folder.resourceChildren[child].name;
					if(description == "" || description == null || description == "null") {
						//description = name;	//Show name instead of blank description, to allow name to be seen on small width screens
						description = "";
					}
					var resourceId = encodeURIComponent(folder.resourceChildren[child].resourceId);
					output += "<li class=\"jstree-closed\" id=\"" + resourceId + "\"><a href=\"" + folder.resourceChildren[child].url + "\" class=\"folder_link\" title=\"" + description + "\">" + name + "</a></li>";
				}
			}
			else {	//Resource is a file
				if(typeof(childrenToDisplay) != "undefined" && childrenToDisplay != null && $.inArray(folder.resourceChildren[child].resourceId, childrenToDisplay) === -1) {
					//Array of folders to display has been specified, but this folder is not in it, so do not show it
				}
				else {
					//Add file to output
					var description = folder.resourceChildren[child].description;
					var name = folder.resourceChildren[child].name;
					if(description == "" || description == null || description == "null") {
						//description = name;	//Show name instead of blank description, to allow name to be seen on small width screens
						description = "";
					}
					output += "<li><a href=\"" + folder.resourceChildren[child].url + "\" target=\"_blank\" title=\"" + description + "\">" + name + "</a></li>";
				}
			}
		}
	}
	else {
		//Folder is empty, so just show text saying so
		//output += "<li>This folder is empty</li>";
		output += "<li>Empty</li>";
	}
	if(typeof(closeUl) != "undefined" && closeUl) {
		output += "</ul>";
	}
	return output;
}

//Function for creating jstree for course documents and workspace (portfolio/My Stuff)
function create_jstree(container, data, contextmenu, openFolderIds) {
	if(typeof(contextmenu) == "undefined") {	//If contextmenu (right click menu) is not defined, assume it shouldn't be used
		var contextmenu = false;
	}
	
	//Add contextmenu plugin, if required
	if(contextmenu) {
		//var plugins = [ "themes", "html_data", "contextmenu", "cookies", "ui" ];	//Enabling UI means that clicking on a file does not open that file
		var plugins = [ "themes", "html_data", "contextmenu", "cookies" ];
	}
	else {
		var plugins = [ "themes", "html_data", "cookies" ];
	}
	
	//Create tree setup object
	var treeSetup = { 
		"plugins" : plugins,
		"html_data": { 
			"data": data, 	//Display the top level folder initially
			"ajax": { 	//When a node is clicked, get and show the contents of the node
				"url": function(n){ 
					//Get the url, using the resourceId, which is set as the id of the LI element
					var id = decodeURIComponent($(n[0]).attr('id'));
					var url = '/direct/content/resources' + id + '.json?depth=1';
					return url; 
				},
				"cache": false,
				"success": function(dataString) { 
					//If ajax request is successful, process the resulting json and display
					var out = "";
					var data = $.parseJSON(dataString);	//parse the returned string as JSON
					for(var folder in data.content_collection) {	//Loop through entities within this folder
						out += processFolder(data.content_collection[folder]);
					}
					
					return out;	//Returned value is used to populate tree
				},
				//If there is an error with the ajax request, show an error message in the tree
				"error": function(data) { return '<ul><li><a href="javascript: void(0);">Error processing folder contents.</a></li></ul>'; }
			}
		},
		"themes" : {
			"theme" : "classic",
			"dots" : true,
			"icons" : true
		}
	};
	
	if(!contextmenu) {
		//Create the basic tree
		var myTree = $(container)
			.jstree(treeSetup)
			//If a folder is clicked on, open/close the node
			.delegate("a.folder_link", "click", function (event, data) {
				event.preventDefault();
				$.jstree._focused().toggle_node(this);	//When a folder node is clicked, open/close the node
			});
	}
	else {
		//Add contextmenu plugin options, if required
		treeSetup.contextmenu = {
			"items" : custom_menu,
			"select_node": true
		};
		/*treeSetup.ui = {
			"select_limit": 1,
		}*/
	
		//Create jstree
		var myTree = $(container)
			.jstree(treeSetup)
			.bind("loaded.jstree", function (event, data) {
				//After the tree has loaded, if a folder was previously selected, open down to that folder and select it again
				if(typeof(openFolderIds) !== "undefined") {
					open_folder(this,openFolderIds);
				}
	        })
			.delegate("a", "click", function (event, data) {	//When an item is clicked on, highlight it and update the "Upload Destination" for drag and drop
				if($(this).hasClass('folder_link') || $(this).hasClass('folder_top')) {	//If this is folder link
					event.preventDefault();
				}
				else {	//This is a file link
					var parentFolder = $(this).parent().parent().siblings('a');	//Get the parent folder
				}
				highlight_item(container, this, parentFolder);
			})
			.delegate("a", "contextmenu", function (event, data) {	//When an item is right clicked, highlight it, update the "Upload Destination" for drag and drop and show the contextmenu (done automatically)
				event.preventDefault();
				if($(this).hasClass('folder_link') || $(this).hasClass('folder_top')) {	//If this is folder link
				}
				else {	//This is a file link
					var parentFolder = $(this).parent().parent().siblings('a');	//Get the parent folder
				}
				highlight_item(container, this, parentFolder);
			});
	}
}

//Function for highlighting a tree item and updating the "Upload Destination" for drag and drop
function highlight_item(container, node, parentFolder) {
	//Get the path to the selected node
	if(typeof(parentFolder) != "undefined") {	//If parentFolder is specified (using if the selected node is a file), get the path to this folder
		var folderPath = jQuery.jstree._reference($(container)).get_path(parentFolder);
	}
	else {	//Otherwise, just get the path to the selected node
		var folderPath = jQuery.jstree._reference($(container)).get_path(node);
	}
	$('span.destination').text(folderPath.join(' / '));	//Add the folder path to the "Upload Destination" span
				
	//Highlight this file
	if(!$(node).hasClass('jstree-clicked')) {	//Check it's not already the highlighted node
		$('a.jstree-clicked').removeClass('jstree-clicked');	//Remove highlighting on all other nodes
		$(node).addClass('jstree-clicked');	//Highlight the selected nodes
		
		//Clear previously uploaded files (uploaded to a different folder) to avoid confusion about where files are
		$('#dropzone_list').empty();
	}
}

//Function for opening the tree down to the selected folder
function open_folder(tree,openFolderIds) {
	$(tree).off('after_open.jstree');	//Switch off previous after_open events
	if(openFolderIds.length > 0) {	//Check that we still have folders to open
		var id = openFolderIds.shift();	//Get the id of the next folder to open
		$(tree).jstree('open_node', $(id), null, true).on('after_open.jstree', function() {	//open the folder and bind the after_open event 
			if(openFolderIds.length == 0) {	//Have we opened the last folder? If so, highlight it
				$('a.jstree-clicked').removeClass('jstree-clicked');	//Remove highlighting on all other folders
				$(id).children('a').addClass('jstree-clicked');	//Highlight the selected folder
				var folderPath = jQuery.jstree._reference($(tree)).get_path(id);
				$('span.destination').text(folderPath.join(' / '));	//Update the "Upload Destination" span
			}
			else {
				open_folder(tree,openFolderIds);	//More folders to open, so open the next one
			}
		});	
	}
}

//Function for getting all of the folder ids for the path to a specified folder 
function get_folder_ids(id) {
	var idPath = id.split('/');	//Split the actual path at slashes
	
	//Remove the first (blank) and last (blank or filename) elements
	idPath.pop();
	idPath.shift();	
	
	var openPath = '/' + idPath.shift() + '/' + idPath.shift() + '/';	//Add first item from idPath to path (generally 'user')
	var folderIds = [];
	for(var i = 0; i < idPath.length; i++) {	//Loop through all of the folders in the path
		openPath += idPath[i] + '/';	//Add folder to the path string
		var id = '#' + encodeURIComponent(openPath).replace(/%/g, '\\%');	//Encode the path string as an id
		folderIds.push(id);	//Add the id to the array
	}
	
	return folderIds;
}

