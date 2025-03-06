(function ($) {
    // Ensure Kendo UI and jQuery are available
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget;
    // Define the custom widget
    var StateCityWidget = Widget.extend({
        // Default options (properties)
        options: {
            name: "StateCityWidget",
            states: [], // List of states
            cities: [], // List of cities (for selected state)
            selectedState: "", // Initially selected state
            selectedCity: "", // Initially selected city
            stateLabelKey: "name", // Default key for state label
            stateValueKey: "id", // Default key for state value
            cityLabelKey: "name", // Default key for city label
            cityValueKey: "id" // Default key for city value
        },// Constructor (initialization function)
        init: function (element, options) {
            // Call the base class constructor
            kendo.ui.Widget.fn.init.call(this, element, options);
            // Reference to the element
            this.element = $(element);
            // Create the widget's HTML structure
            this._create();
        },
        // Method to create widget's HTML
        _create: function () {
            // Create container for state dropdown
            var stateDropdown = $("<div class='state-dropdown'></div>").appendTo(this.element);
            stateDropdown.html("<label for='state'>State: </label><input id='state' class='k-dropdown' />");
            // Create container for city dropdown
            var cityDropdown = $("<div class='city-dropdown'></div>").appendTo(this.element);
            cityDropdown.html("<label for='city'>City: </label><input id='city' class='k-dropdown' />");
            // Populate the state dropdown
            this._populateStates();
            // Initialize the Kendo DropDownLists
            this._initializeDropDowns();// Bind change event for state dropdown to update cities
            this._bindEvents();
        },
        // Method to populate states dropdown
        _populateStates: function () {
            var stateSelect = this.element.find("#state");
            var statesData = [{
                text: "Select State", // Default label for the state dropdown
                value: "", // Value for "Select State" is empty
            }].concat(this.options.states.map(function (state) {
                return {
                    text: state[this.options.stateLabelKey],
                    value: state[this.options.stateValueKey]
                };
            }, this));
            // Set the options data to populate the dropdown
            stateSelect.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: statesData
            });
        },// Initialize Kendo DropDownLists for both state and city dropdowns
        _initializeDropDowns: function () {
            // Initialize Kendo DropDown for city, but it will be updated later based on state selection
            var citySelect = this.element.find("#city");
            citySelect.kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: [{
                    text: "Select City", // Default label for the city dropdown
                    value: "" // Value for "Select City" is empty
                }],
                enabled: false // Initially disable the city dropdown
            });
        },
        // Method to update cities dropdown based on selected state
        // Method to update cities dropdown based on selected state
        _updateCities: function () {
            var selectedStateId = this.element.find("#state").data("kendoDropDownList").value();
            var citySelect = this.element.find("#city").data("kendoDropDownList");

            // Reset and disable city dropdown initially
            citySelect.setDataSource([{ text: "Select City", value: "" }]);
            citySelect.value(""); // Set default value as "Select City"
            citySelect.enable(false);

            if (!selectedStateId) {
                return;
            }

            console.log(selectedStateId);
            // AJAX call to get cities based on selected state
            $.ajax({
                url: "/Home/GetMeCities?stateid=" + selectedStateId,
                type: "GET",
                success: function (response) {
                    console.log("Cities:", response);
                    var cities = response.map(function (city) {
                        return {
                            text: city.cityName, // Match cityLabelKey
                            value: city.cityId  // Match cityValueKey
                        };
                    });

                    // Update the cities dropdown data source
                    citySelect.setDataSource([{ text: "Select City", value: "" }].concat(cities));
                    citySelect.value(""); // Ensure "Select City" remains selected
                    citySelect.enable(true);
                },
                error: function (xhr) {
                    console.error("Error fetching cities:", xhr.responseText);
                }
            });
        },
        // Get cities based on selected state ID (just a mock data example)
        _getCitiesByState: function (stateId) {
            // Example of mock data (you can replace this with a dynamic call to your backend)
            return this.options.cities[stateId] || [];
        },
        // Method to bind events like changes in state dropdown
        _bindEvents: function () {
            var self = this;
            // When state changes, update cities dropdown
            this.element.find("#state").data("kendoDropDownList").bind("change", function () {
                self._updateCities();
            });
        },
        // Destroy method (clean-up)
        destroy: function () {
            this.element.empty(); // Remove the widget's content
            // Call the base class destroy method
            kendo.ui.Widget.fn.destroy.call(this);
        }
    });
    // **Crucial Step**: Register the widget in Kendo UI's plugin system
    kendo.ui.plugin(StateCityWidget);
})(jQuery);