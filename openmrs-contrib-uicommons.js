import angular from 'angular';

import openmrsUicommonsStylesheet from "./src/scss/sass/openmrs-refapp.scss";

import openmrsUicommonsHeader from './angular/openmrs-header/openmrs-header.component.js';
import openmrUicommonsBreadcrumbs from './angular/openmrs-breadcrumbs/openmrs-breadcrumbs.component.js';
import openmrsUicommonsConceptAutocomplete from './angular/openmrs-conceptAutocomplete/openmrs-conceptAutocomplete.component.js';
import openmrUicommonsRest from './angular/openmrs-rest/openmrs-rest.js';
import openmrsUicommonsList from './angular/openmrs-list/openmrs-list.component.js';
import openmrsUicommonsDeleteAlert from './angular/openmrs-alertDialog/openmrs-alert-dialog.component.js';
import openmrsUicommonsNotification from './angular/openmrs-notification/openmrs-notification.service.js';
import openmrsUicommonsTransalteApp from './angular/openmrs-translate/openmrs-translate.module.js';
import openmrsUicommonsChooseLanguage from './angular/openmrs-chooseLangage/openmrs-chooseLanguage';

let dependencies = [
	'openmrs-contrib-uicommons.header',
	'openmrs-contrib-uicommons.breadcrumbs',
	'openmrs-contrib-uicommons.rest',
	'openmrs-contrib-uicommons.concept-autoComplete',
	'openmrs-contrib-uicommons.alert-dialog',
	'openmrs-contrib-uicommons.list',
	'openmrs-contrib-uicommons.notification',
	'openmrs-contrib-uicommons.translate',
	'openmrs-contrib-uicommons.choose-language'
];

try {
	 let customUicommons = angular.module('openmrs-contrib-uicommons-customized').name;
	dependencies.push(customUicommons);
} catch(err) {
	console.log('openmrs-contrib-uicommons-customized is not available');
}


export default angular.module('openmrs-contrib-uicommons', dependencies);
