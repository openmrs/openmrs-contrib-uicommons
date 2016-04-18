import stylesheet from "./src/scss/sass/openmrs-refapp.scss";

import header from './angular/openmrs-header/openmrs-header.component.js';
import breadcrumbs from './angular/openmrs-breadcrumbs/openmrs-breadcrumbs.component.js';
import conceptAutocomplete from './angular/openmrs-conceptAutocomplete/openmrs-conceptAutocomplete.component.js';
import openmrsRest from './angular/openmrs-rest/openmrs-rest.js';

var lib = angular.module('openmrs-contrib-uicommons',
				[
					'openmrs-contrib-uicommons.header',
					'openmrs-contrib-uicommons.breadcrumbs', 
					'openmrs-contrib-uicommons.rest',
					'openmrs-contrib-uicommons.concept-autoComplete'
                ])

module.exports = {
	stylesheet : stylesheet,
	header : header,
	breadcrumbs : breadcrumbs,
	conceptautocomplete : conceptAutocomplete,
	openmrsRest : openmrsRest,
	lib : lib
}