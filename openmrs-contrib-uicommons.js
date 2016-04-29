import stylesheet from "./src/scss/sass/openmrs-refapp.scss";

import header from './angular/openmrs-header/openmrs-header.component.js';
import breadcrumbs from './angular/openmrs-breadcrumbs/openmrs-breadcrumbs.component.js';
import conceptAutocomplete from './angular/openmrs-conceptAutocomplete/openmrs-conceptAutocomplete.component.js';
import openmrsRest from './angular/openmrs-rest/openmrs-rest.js';
import openmrsList from './angular/openmrs-list/openmrs-list.component.js';
import openmrsSearch from './angular/openmrs-search/openmrs-search.component.js';
import deleteAlert from './angular/openmrs-deleteAlert/delete-alert.component.js';
import retireAlert from './angular/openmrs-retireAlert/retire-alert.component';


var lib = angular.module('openmrs-contrib-uicommons',
				[
					'openmrs-contrib-uicommons.header',
					'openmrs-contrib-uicommons.breadcrumbs', 
					'openmrs-contrib-uicommons.rest',
					'openmrs-contrib-uicommons.concept-autoComplete',
					'openmrs-contrib-uicommons.delete-alert',
					'openmrs-contrib-uicommons.retire-alert',
					'openmrs-contrib-uicommons.list',
					'openmrs-contrib-uicommons.search'
                ]);

module.exports = {
	stylesheet : stylesheet,
	header : header,
	breadcrumbs : breadcrumbs,
	conceptautocomplete : conceptAutocomplete,
	openmrsRest : openmrsRest,
	openmrsList : openmrsList,
	openmrsSearch : openmrsSearch,
	deleteAlert : deleteAlert,
	retireAlert : retireAlert,
	lib : lib
};