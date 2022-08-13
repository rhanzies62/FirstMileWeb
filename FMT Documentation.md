Documentation v1.0.0
• Dashboard
	- Schedules
		Can Do
			• List all of the booking with BOOKED status and plot it in the calendar.
			• Color coded display for the booking
			• Can filter by customers
			• When user selects customers it will display a dropdown for list of projects
			• Can filter by projects
			• If being filtered by projects it will display the equipments borrowed and plot it in the calendar
			• Clicking the calendar schedule will display the booking details in modal regardless if it's filtered by customer or project
			• If the project selected is not within the current month, navigate the user to the start date of the selected project.
	- Locations
		Can Do
			• Display all of the gateway or engo equipments location, but only those equipment that's currently active on booking for the current date. 
			• Map Pins is color coded base on the booking (see color coding in schedule for validate)
			• map pins displays the following data (equipment name, company and duration)
			• clicking the zoom button will zoom in to the location and clicking zoom out button will zoom out to original place. 
			• clicking the map pin will display the details of the equipment including booking details
			• booking details should display the following details (project name, customer, booking status, duration)
			• clicking the map pin will display the current usage of the equipment IF the equipment is gateway.
			• current usage panel is displaying cell, other and total usage starting from the start date upto current date.
			• in booking details clicking the magnify button will display a modal for booking details.
	- Usages
		Can Do
			• By default the gateways should load with a default sort by of total usage and descending sort 
			• Search equipment field will display all of the gateway equipment when they start typing e.g. Ryan
			• Sort By field will sort the gateways by selected options depending on sort field if asc or desc
			• from field option has a max date of the current date
			• to field options has a min date base on the selected from field
			• changing from and to field will update the usage display of all gateways
			• view details button will display the usage breakdown details
			• view details will open the usage break down details modal for smaller screens.
			• changing the values of from and to will also update the usage breakdown panel.
			• usage breakdown detail panel will display the following
				- equipment usage summary. 
					• displays the name of the equipment and serial number.
					• usage breakdown base on the selected time frame (From and To)
					• usage breakdown automatically calculate base on the selected time frame or time range. if the user is in daily it should display the total consumption of cell, other and total usage base on the selected date range same thing when they change the start time and end time.
				- switching tabs will automatically change the graph displays from daily to hourly and vice versa.
				- Daily Usages
					• displays a graph that will display the breakdown of the equipment usage per day baseon the selected time frame (From and To)
					• graphs should display in Gb format.
				- Hourly Usages
					• select a date field default value depends on the value of from and to. 
						- if From and To is within the current date, select the current date 
						- if From and To is outside the current date, the default date should be the To Date.
						- if the selected date in Select a Date field is not current date, default the start time and end time to both 12:00 AM
						- if the selected date in Select a Date field is current date set the Start time to 12:00AM and end time to current time
					• Start Time and End Time field will determine the range of hourly usage breakdown.
						- if the end time is selected as 12:00AM it's automatically 12:00AM of the next day.
						
• Equipment
	- Grid will display the list of equipments, columns will display the following fields (ID, Name, Serial, Type, Company)
		• can change the sort if the user clicks the header of each column
		• can change the page size on the page size dropdown field
		• can select specific page or press the next or previous button to navigate in the page or click the last and first button to navigate to the last page or go back to the first page.
		• can search for equipment by name, serial, type or company
		• clicking a row will display the equipment details side panel contains 2 to 3 panels (if screen is small it will display in modal)
			- Equipment details will display the following fields
				• created by and created date
				• updated by and updated date
				• id
				• option to edit and set equipment to inactive
					- edit will display the edit equipment modal
						• modal header will display edit equipment.
						• following fields will set to the equipment value
							- service type (read only)
							- serial (if service type is gateway or engo)
							- name (read only if type is gateway or engo)
							- dejero id (read only if type is gateway or engo)
							- company (editable)
							- description (editable)
						• changing the serial will clear the name and dejero id
						• save changes button will disabled if the following fields are not provided
							- serial
							- name
							- dejero id (if service type is gateway or engo)
						• you can search for different serial but if you search for an already existing serial it will not allowed to be save
					- set equipment to inactive will display a confirmation message if you are sure to set the equipment to inactive, after that the grid will refresh and it will highlight red the inactive equipment
			 - Equipment history
				• will display the equipment booking history, each booking history will have the following fields
					- project name
					- customer name
					- status
					- duration
					- usage (if equipment is gateway)
					- view details
						• this will display a modal for the full details of the booking including the other equipment the details about the booking
			- Equipment Location (only if the equipment is gateway or engo) it will display a map and a pin where the equipment is right now.
		• New equipment button will open a modal for adding new equipment
			- service type field (requied)
				• if the service type is gateway or engo
					- it will display a searial look up 
						• it will return the name and dejero id if serial match.
						• changing the value of serial will clear the name and dejero id field
					- name field will be (readonly) (required)
					- dejero id will be added (readonly) (required)
				• if the service type is not gateway or engo name field is editable and only fields available is name (required)
			- Serial and look up (Required)
			- Name (Required)
			- Dejero Id (Required)
			- Company (Required)
			- Description (Not Required)
			- save changes button will be disabled if not all of the required fields are provided
	- Card list will display if the screen is smaller and view details button will display the details in modal