<img src="https://cloud.githubusercontent.com/assets/668093/12567089/0ac42774-c372-11e5-97eb-00baf0fccc37.jpg" alt="OpenMRS"/>
# OpenMRS Reference Application UI Library

[![Build Status](https://travis-ci.org/PawelGutkowski/openmrs-contrib-uicommons.svg?branch=master)](https://travis-ci.org/PawelGutkowski/openmrs-contrib-uicommons)[![Codacy Badge](https://api.codacy.com/project/badge/grade/29072e64c3ca4a9c9b0338c3cb5b272a)](https://www.codacy.com/app/pawel-gutkowski-1993/openmrs-contrib-uicommons)

This repository contains the Reference Application UI library.

It contains common utilities for developing OpenMRS UI. 

## Quick Start

To get this library You can: 
- Clone the repo: `git clone https://github.com/PawelGutkowski/openmrs-contrib-refapp-ui-lib/tree/v0.1.5`.
- Install with Bower: `bower install openmrs-contrib-refapp-ui-lib --save`.
- Install with npm: `npm install openmrs-contrib-refapp-ui-lib`.

## What's included

Release contains CSS stylesheets, precompiled SCSS files for them and angular reusable components.

### Stylesheets

OpenMRS css stylesheets are automatically linked to Your html file, when You import bundle javascript file.

You can find OpenMRS Reference Application styleguide [here](http://devtest01.openmrs.org:8080/openmrs/uicommons/styleGuide.page).

### Angular

To use components, make sure You have Angular 1 version v1.5.2 or higher

#### Header Component

Header component adds default OpenMRS header to Your web page. To use it, You have to inject it's module in Your module, as follows:

````
angular.module('YourAngularModule',['openmrs-contrib-uicommons.header']);
````

create variable in Your controller, which will hold title of Your application:

````
angular.module('YourAngularModule').controller('controller', controller);

function controller() {
	var vm = this;
	vm.appTitle = "Your app title";
}
````

And insert component in html file, binding appTitle variable to it:

````
<html ng-app="conceptDictionaryApp">
  	<div ng-controller="controller as vm">
		<openmrs-header title="vm.appTitle"></openmrs-header>
	</div>
</html>
````

#### Breadcrumbs Component

Breadcrumbs component adds Reference Application-styled breadcrumbs to Your web page. To use it, You have to inject it's module in Your module, as follows:

````
angular.module('YourAngularModule',['openmrs-contrib-uicommons.breadcrumbs']);
````

create variable in Your controller, which will hold map of Your links and labels:

````
angular.module('YourAngularModule').controller('controller', controller);

function controller() {
	var vm = this;
    vm.links = {};
    vm.links["label1"] = "link1/";
    vm.links["label2"] = "link1/link2/";
}
````

And insert component in html file, binding links variable to it:

````
<html ng-app="conceptDictionaryApp">
  	<div ng-controller="controller as vm">
		<openmrs-breadcrumbs links="vm.links"></openmrs-breadcrumbs>
	</div>
</html>
````

## Production Build

You can compile .css files by yourself. You will need NodeJS 4+ and Compass installed to do this. See the install instructions for [NodeJS](https://nodejs.org/en/download/package-manager/) and [Compass](http://compass-style.org/install/).

Once you have NodeJS and Compass installed, you need to install Bower (first time only) as follows:
````
npm install -g bower
````

Install the dependencies (first time only):

```
npm install && bower install
```

Build the distributable using webpack as follows:

````
npm run build
````

This will create a `lib` directory, which will contain Your bundled library files.

## License

[MPL 2.0 w/ HD](http://openmrs.org/license/) © [OpenMRS Inc.](http://www.openmrs.org/)
