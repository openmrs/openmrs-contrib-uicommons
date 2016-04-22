<img src="https://cloud.githubusercontent.com/assets/668093/12567089/0ac42774-c372-11e5-97eb-00baf0fccc37.jpg" alt="OpenMRS"/>
# OpenMRS Reference Application UI Library

[![Build Status](https://travis-ci.org/PawelGutkowski/openmrs-contrib-uicommons.svg?branch=master)](https://travis-ci.org/PawelGutkowski/openmrs-contrib-uicommons)[![Codacy Badge](https://api.codacy.com/project/badge/grade/29072e64c3ca4a9c9b0338c3cb5b272a)](https://www.codacy.com/app/pawel-gutkowski-1993/openmrs-contrib-uicommons)

This repository contains the Reference Application UI library.

It contains common utilities for developing OpenMRS UI. 

## Menu

* [Quick Start](https://github.com/PawelGutkowski/openmrs-contrib-uicommons#quick-start)
* [What's Included](https://github.com/PawelGutkowski/openmrs-contrib-uicommons#whats-included)
* [Stylesheets](https://github.com/PawelGutkowski/openmrs-contrib-uicommons#stylesheets)
* [Angular](https://github.com/PawelGutkowski/openmrs-contrib-uicommons#angular)
* [OpenMRS Rest Module](https://github.com/PawelGutkowski/openmrs-contrib-uicommons#openmrs-rest-module)
* [Header Component](https://github.com/PawelGutkowski/openmrs-contrib-uicommons#header-component)
* [Breadcrumbs Component](https://github.com/PawelGutkowski/openmrs-contrib-uicommons#breadcrumbs-component)
* [Concept Autocomplete Component](https://github.com/PawelGutkowski/openmrs-contrib-uicommons#concept-autocomplete-component)
* [List Component](https://github.com/PawelGutkowski/openmrs-contrib-uicommons#list-component)
* [Production Build](https://github.com/PawelGutkowski/openmrs-contrib-uicommons#production-build)
* [Development](https://github.com/PawelGutkowski/openmrs-contrib-uicommons#development)
* [License](https://github.com/PawelGutkowski/openmrs-contrib-uicommons#license)

## Quick Start

To get this library You can: 
- Clone the repo: `git clone https://github.com/PawelGutkowski/openmrs-contrib-refapp-ui-lib/tree/v0.1.5`.
- Install with Bower: `bower install openmrs-contrib-uicommons --save`.
- Install with npm: `npm install openmrs-contrib-uicommons --save`.

## What's included

Release contains CSS stylesheets, precompiled SCSS files for them and angular reusable components.

### Stylesheets

OpenMRS css stylesheets are automatically linked to Your html file, when You import bundle javascript file.

You can find OpenMRS Reference Application styleguide [here](http://devtest01.openmrs.org:8080/openmrs/uicommons/styleGuide.page).

### Angular

To use components, make sure You use Angular 1 version v1.5.2 or higher. You can inject all partial modules at once, by injecting openmrs-contrib-uicommons module as follows: 

````javascript
angular.module('YourAngularModule',['openmrs-contrib-uicommons']);
````

#### OpenMRS Rest Module

OpenMRS Rest module allows You to make requests to Your server Rest API super fast and easy. First You have to inject its module to Your module, and controller where You want to use it

````javascript
angular.module('YourAngularModule',['openmrs-contrib-uicommons.header']).controller('controller', controller);

controller.$inject = ['openmrsRest']
function controller(openmrsRest) {
	var vm = this;
	vm.items;
	vm.resourceName = "class" //name of resource You want to make request at
	vm.params = {includeAll: true} //request params
	openmrsRest.listFull(vm.resourceName, vm.params).then(function(response)(
		vm.items = response.results; //store response in variable
	));
}
````
OpenMRS Rest API returns multiple objects wrapped in single "results" object. There are multiple functions avalaible: `list`, `listFull`, `listRef`, `get`, `getFull`, `getRef`, `create`, `update`, `remove`, `retire`, `unretire`, `purge`.

For further information, check OpenMRS Rest API docs [here](https://psbrandt.io/openmrs-refapp-docker/#operation--conceptreferenceterm--uuid--delete).

#### Header Component

Header component adds default OpenMRS header to Your web page. To use it, You have to inject it's module in Your module, as follows:

````javascript
angular.module('YourAngularModule',['openmrs-contrib-uicommons.header']);
````

create variable in Your controller, which will hold title of Your application:

````javascript
angular.module('YourAngularModule').controller('controller', controller);

function controller() {
	var vm = this;
	vm.appTitle = "Your app title";
}
````

And insert component in html file, binding appTitle variable to it:

````html
<html ng-app="YourAngularModule">
  	<div ng-controller="controller as vm">
		<openmrs-header title="vm.appTitle"></openmrs-header>
	</div>
</html>
````

#### Breadcrumbs Component

Breadcrumbs component adds Reference Application-styled breadcrumbs to Your web page. To use it, You have to inject it's module in Your module, as follows:

````javascript
angular.module('YourAngularModule',['openmrs-contrib-uicommons.breadcrumbs']);
````

create variable in Your controller, which will hold map of Your links and labels:

````javascript
angular.module('YourAngularModule').controller('controller', controller);

function controller() {
	var vm = this;
    vm.links = {};
    vm.links["label1"] = "link1/";
    vm.links["label2"] = "link1/link2/";
}
````

And insert component in html file, binding links variable to it:

````html
<html ng-app="YourAngularModule">
  	<div ng-controller="controller as vm">
		<openmrs-breadcrumbs links="vm.links"></openmrs-breadcrumbs>
	</div>
</html>
````

#### Concept Autocomplete Component

Concept autocomplete component adds concept input box to Your page. It suggests names of existing concepts by current user input, allows user to choose one of sugestions, and shows warning message, when query doesn't match any concept. You can choose if it searches drug concepts, or any concepts. To use it, You have to inject it's module in Your module, as follows:

````javascript
angular.module('YourAngularModule',['openmrs-contrib-uicommons.concept-autoComplete']);
````

create variables in Your controller:

````javascript
angular.module('YourAngularModule').controller('controller', controller);

function controller() {
	var vm = this; 
	vm.required = false; //if truthy, input box will be required
	vm.limitToDrugs = false; //if truthy, component will search only drug concepts
	vm.isConceptCorrect;	//flag, if current query matches any concept name
	vm.updateConcept = updateConcept;
	//item is object with property "display", which is passed to component at activation (make it empty if there has to be no initial state)
	vm.item = {
			display: 'ItemName'
	}
	//function, which will be invoked at any change of component model, in this example it
	function updateConcept(isCorrect, concept) {
	    vm.isConceptCorrect = isCorrect;
	    vm.item = concept;
	 };
}
````

And insert component in html file, binding variables to it:

````html
<html ng-app="YourAngularModule">
  	<div ng-controller="controller as vm">
		<concept-auto-complete required='vm.required' concept='vm.item' limit-to-drugs='vm.limitToDrugs' on-update='vm.updateConcept(isCorrect, concept)'>
		</concept-auto-complete>
	</div>
</html>
````

#### List Component

Breadcrumbs component adds Reference Application-styled breadcrumbs to Your web page. To use it, You have to inject it's module in Your module, as follows:

````javascript
angular.module('YourAngularModule',['openmrs-contrib-uicommons.openmrs-list']);
````

create variables in Your controller:

````javascript
angular.module('YourAngularModule').controller('controller', controller);

function controller() {
	var vm= this;
	vm.resource = "conceptclass"; //name of resource You want to display
    	vm.redirectionParam = "class"; //link to page where You placed the list, eg. "class" for 'index.html#/class'
    	vm.limit = 10; //number of results shown on single page
    	vm.columns= [ //array of columns
        {
            "property": "description", //name of property of resource You want to display
            "label":"Description" //label of column
        }];
	 vm.actions = [{ //array of allowed actions
            "action":"edit", // pick one of [view/edit/retire/unretire/purge]. component will redirect user/send appropriate request to server
            "label":"Edit", //label of action icon
            "icon":"icon-pencil edit-action left" //displayed
        }];
}
````

And insert component in html file, binding variables to it:

````html
<html ng-app="YourAngularModule">
  	<div ng-controller="controller as vm">
		<openmrs-list resource="vm.resource" columns="vm.columns" actions="vm.actions" redirection-param="vm.redirectionParam" limit="vm.limit"></openmrs-list>
	</div>
</html>
````

## Production Build

You can compile .css files by yourself. You will need NodeJS 4+ and Compass installed to do this. See the install instructions for [NodeJS](https://nodejs.org/en/download/package-manager/).

Once you have NodeJS installed, install the dependencies (first time only):

```
npm install
```

Build the distributable using webpack as follows:

````
npm run build
````

This will create a `lib` directory, which will contain Your bundled library files.

##Development

To create development environment, first You have to install dependencies as described in [Production Build](https://github.com/PawelGutkowski/openmrs-contrib-uicommons#production-build). Project contains demo app, where You can see components and modules in action. To use it, You have to run OpenMRS server locally with Open Web Apps and Webservices modules. You can find how to do that [here](https://github.com/rkorytkowski/openmrs-owa-conceptdictionary#setup-openmrs-server).

To deploy directly to your local Open Web Apps directory, run:

````sh
npm run build:deploy
````

This will build and deploy the app to directory specified in `LOCAL_OWA_FOLDER` value in `./config.json`, created by dev. If `config.json` is absent, app will be deployed to `/dist` directory.

It is also possible to configure the project so that whenever a file is changed it is deployed to a server and a
browser is refreshed. First please make sure the APP_ENTRY_POINT is set in config.json as follows:

````js
{
  "LOCAL_OWA_FOLDER": "C:\\\\Users\\\\rafal\\\\openmrs\\\\serverName\\\\owa\\\\",
  "APP_ENTRY_POINT":"http://localhost:8080/openmrs/owa/openmrs-contrib-uicommons/index.html"
}
````

Next run:
````sh
npm run watch
````

While it runs, it watches all files for changes and automatically updates your browser.


## License

[MPL 2.0 w/ HD](http://openmrs.org/license/) © [OpenMRS Inc.](http://www.openmrs.org/)
