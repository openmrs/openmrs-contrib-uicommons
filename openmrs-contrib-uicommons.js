import angular from 'angular';

import openmrsUicommonsStylesheet from "./src/scss/sass/openmrs-refapp.scss";

import openmrsUicommonsHeader from './angular/openmrs-header/openmrs-header.component.js';
import openmrUicommonsBreadcrumbs from './angular/openmrs-breadcrumbs/openmrs-breadcrumbs.component.js';
import openmrsUicommonsConceptAutocomplete from './angular/openmrs-conceptAutocomplete/openmrs-conceptAutocomplete.component.js';
import openmrUicommonsRest from './angular/openmrs-rest/openmrs-rest.js';
import openmrsUicommonsList from './angular/openmrs-list/openmrs-list.component.js';
import openmrsUicommonsDeleteAlert from './angular/openmrs-deleteAlert/delete-alert.component.js';
import openmrsUicommonsRetireAlert from './angular/openmrs-retireAlert/retire-alert.component.js';
import openmrsUicommonsNotification from './angular/openmrs-notification/openmrs-notification.service.js';


export default angular.module('openmrs-contrib-uicommons',
				[
					'openmrs-contrib-uicommons.header',
					'openmrs-contrib-uicommons.breadcrumbs', 
					'openmrs-contrib-uicommons.rest',
					'openmrs-contrib-uicommons.concept-autoComplete',
					'openmrs-contrib-uicommons.delete-alert',
					'openmrs-contrib-uicommons.retire-alert',
					'openmrs-contrib-uicommons.list',
					'openmrs-contrib-uicommons.notification'
                ]);