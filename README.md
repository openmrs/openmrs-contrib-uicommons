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
	* [Demo Application](https://github.com/PawelGutkowski/openmrs-contrib-uicommons#demo-application)
	* [External Client Application](https://github.com/PawelGutkowski/openmrs-contrib-uicommons#external-client-application)
* [Release Procedure](https://github.com/PawelGutkowski/openmrs-contrib-uicommons#release-procedure)
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
	vm.limitToClass = 'Drug'; //component will search only drug concepts
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
		<concept-auto-complete required='vm.required' concept='vm.item' limit-to-class='vm.limitToClass' on-update='vm.updateConcept(isCorrect, concept)'>
		</concept-auto-complete>
	</div>
</html>
````

#### List Component

List Component is used to insert lists and tables filled with specified OpenMRS REST resources.

````javascript
angular.module('YourAngularModule',['openmrs-contrib-uicommons.openmrs-list']);
````

<p>To configure attributes of this components, its recommended
to pass values from controller to component attributes placed in `<openmrs-list>` tags.</p>
<p>List Component attributes documentation:</p>

- `resource="<String>"` - Resource name for REST Service.<br>
Example: "conceptsource" or "conceptclass" (see REST WS API Documentation)
- `columns="<Object>"` - Object that tells component how to divide columns of table/list and which label/property should it use.<br>
Example:
````javascript
vm.columns= [
        {
            "property": "name", // Name of variable that is contained inside all resource objects placed in table
            "label": "Name" // Label of column header for specified property (its possible to pass translate value here)
        },
        {
            "property": "hl7Code",
            "label":"HL7 Code"
        },
        {
            "property": "description",
            "label":"Description"
        }];
````

- `type="<String>"` - Default `'table'`, defines if component should look like `'list'` (i.e. like conceptSearch view) or `'table'` (i.e. like referenceSearch view).
- `actions="<Object>"` - Default `[{"action":"view", "label":"View"}]`, defines which actions can be performed on object via list/table. <br>
Example:
````javascript
vm.actions = [
        {
            "action":"edit", //Action name, possible values: 'edit', 'view', 'retire', 'unretire' and 'purge'.
            "label":"Edit", //Label that is shown when user hovers action button, when not defined it takes action name value.
            "link":"#/source/{uuid}" //Link pattern that is used to redirect to proper 'edit' or 'view' page ({uuid} is automaticly replaced with specific uuid)
        },
        {
            "action":"retire", //Retire action needs to be implemented along with unretire action
            "label":"Retire"
        },
        {
            "action":"unretire",
            "label":"unretire"
        },
        {
            "action":"purge",
            "label":"Delete",
            "icon":"icon-trash delete-action" // Icon from OpenMRS CSS (See http://demo.openmrs.org/openmrs/uicommons/icons.page for more). Has default values for all actions, 'delete-action' means that it will be red-colored when hovering button.
        }
    ];
````
- `enable-search="<boolean>"` - Default `false`, defines if there should be search panel instead of table/list only. <br>
Example: type `true` for `referenceSearch`-like panel or type `false` for `sourceList`-like panel
- `limit="<int>"`- Default `10`, defines how many entries should be seen per page of list/table (Note that navigation buttons aren't visible when all entries fits in one page)
- `list-all="<boolean>"` - Default `false`, defines if there should be retired entries visible on table/list

<br>
Example controller:

````javascript
angular.module('YourAngularModule').controller('controller', controller);

function controller() {
	var vm= this;
	vm.resource = "conceptsource";
        vm.columns= [
            {
                "property": "name",
                "label": "Name"
            },
            {
                "property": "hl7Code",
                "label":"HL7 Code"
            },
            {
                "property": "description",
                "label":"Description"
            }];
        vm.actions = [
            {
                "action":"edit",
                "label":"Edit",
                "link":"#/source/{uuid}"
            },
            {
                "action":"retire",
                "label":"Retire"
            },
            {
                "action":"unretire",
                "label":"unretire"
            },
            {
                "action":"purge",
                "label":"Delete",
                "icon":"icon-thumbs-down delete-action"
            }
        ];
}
````
Passing example values to component:
````html
<html ng-app="YourAngularModule">
  	<div ng-controller="controller as vm">
				<openmrs-list resource="vm.resource" columns="vm.columns" actions="vm.actions" list-all="true"></openmrs-list>
	</div>
</html>
````

#### Notification service

Notification service is wrapper for [angular-toastr](https://github.com/Foxandxss/angular-toastr), with adjusted stylesheets and managed dependencies. To use it, inject it's module to Your module:

````javascript
angular.module('YourAngularModule',['openmrs-contrib-uicommons.notification']);
````

inject openmrsNotification service to Your controller:

````javascript
angular.module('YourAngularModule').controller('controller', controller);

controller.$inject('openmrsNotifiation');
function controller(openmrsNotification) {
	var vm = this;
	//...
}
````
to show toast message, call from Your controller one of methods - `info`, `error`, `warning`, `success`, eg.
````js
//shows info message
openmrsNotification.info(content, title);
````
It's allowed to pass only content parameter to show message without title.

## Production Build

You need to have NodeJS in version 5.3.x installed. We recommend using [nvm](https://github.com/creationix/nvm#installation) or [nvm-windows](https://github.com/coreybutler/nvm-windows) to install and manage different versions of Node.

Once you have NodeJS installed, install the dependencies (first time only):

```
npm install
```

Build the distributable using webpack as follows:

````
npm run build
````

This will create a `lib` directory, which will contain Your bundled library files.

## Development

### Demo Application

The easiest way to develop components is to use the demo application. 

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

### External Client Application

You can develop and test Openmrs-contrib-uicommons in other application, using npm [link feature](https://docs.npmjs.com/cli/link). In order to do this, You just need to run  
````sh
npm link
````
in Your openmrs-contrib-uicommons directory. Npm will add link to this package to its global node_modules. Then run
````sh
npm link openmrs-contrib-uicommons
````
in Your client application directory. From now on, every change You make in uicommons will be reflected in client application node_modules. Remember to build openmrs-contrib-uicommons, as client code use bundle from lib/ directory and then build Your application.


To break the link, in client directory run
````sh
npm unlink openmrs-contrib-uicommons
````
To unlink openmrs-contrib uicommons, in its directory run
````sh
npm unlink
````

## Release Procedure

To release new version of Openmrs-contrib-uicommons, run from master branch:
````sh
npm version patch
````
It will automatically increment package version in package.json file, create git release commit and tag with names corresponding to current version. Then push tags:
````sh
git push remote_repo_name master
git push --tags remote_repo_name
````
where 'remote_repo_name' refers to https://github.com/PawelGutkowski/openmrs-contrib-uicommons.git.

Tag will be automatically built on Travis-CI and deployed to npm.

## License

[MPL 2.0 w/ HD](http://openmrs.org/license/) © [OpenMRS Inc.](http://www.openmrs.org/)
