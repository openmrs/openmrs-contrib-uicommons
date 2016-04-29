import angular from 'angular';
import lib from '../openmrs-contrib-uicommons.js';

import AutocompleteController from './controllers/autocomplete.controller.js';
import HeaderController from './controllers/header.controller.js';
import BreadcrumbsController from './controllers/breadcrumbs.controller.js';
import ListController from './controllers/list.controller.js';
import SearchController from './controllers/search.controller.js';

export default angular.module('DemoApp', ['openmrs-contrib-uicommons'])
						.controller('BreadcrumbsController', BreadcrumbsController)
						.controller('AutocompleteController', AutocompleteController)
						.controller('ListController', ListController)
						.controller('HeaderController', HeaderController)
						.controller('SearchController', SearchController)
						.name;
					



