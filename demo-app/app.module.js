import angular from 'angular';
import lib from '../openmrs-contrib-uicommons.js';

import AutocompleteController from './controllers/autocomplete.controller.js';
import HeaderController from './controllers/header.controller.js';
import BreadcrumbsController from './controllers/breadcrumbs.controller.js';
import ListController from './controllers/list.controller.js';
import SearchController from './controllers/search.controller.js';
import NotificationController from './controllers/notification.controller.js';
import TranslateController from './controllers/translate.controller.js';

export default angular.module('DemoApp', ['openmrs-contrib-uicommons'])
						.controller('BreadcrumbsController', BreadcrumbsController)
						.controller('TranslateController', TranslateController)
						.controller('AutocompleteController', AutocompleteController)
						.controller('ListController', ListController)
						.controller('HeaderController', HeaderController)
						.controller('SearchController', SearchController)
						.controller('NotificationController', NotificationController)
						.name;
					



