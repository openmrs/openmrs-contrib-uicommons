<img src="https://cloud.githubusercontent.com/assets/668093/12567089/0ac42774-c372-11e5-97eb-00baf0fccc37.jpg" alt="OpenMRS"/>
# OpenMRS Reference Application UI Library

This repository contains the Reference Application UI library.

It contains common utilities for developing OpenMRS UI. 

## Quick Start

To get this library You can: 
- Clone the repo: `git clone https://github.com/PawelGutkowski/openmrs-contrib-refapp-ui-lib/tree/v0.1.5`.
- Install with Bower: `bower install openmrs-contrib-refapp-ui-lib --save`.
- Install with npm: `npm install openmrs-contrib-refapp-ui-lib`.

## What's included

At the moment, release contains only CSS stylesheets and precompiled SCSS files for them.

You can find OpenMRS Reference Application styleguide [here](http://devtest01.openmrs.org:8080/openmrs/uicommons/styleGuide.page).

## Production Build

You can compile .css files by yourself. You will need NodeJS 4+ and Compass installed to do this. See the install instructions for [NodeJS](https://nodejs.org/en/download/package-manager/) and [Compass](http://compass-style.org/install/).

Once you have NodeJS and Compass installed, you need to install Gulp and Bower (first time only) as follows:
````
npm install -g gulp bower
````

Install the dependencies (first time only):

```
npm install && bower install
```

Build the distributable using [Gulp](http://gulpjs.com/) as follows:

````
gulp
````

This will create a `dist` directory, which will contain Your compiled CSS stylesheets.

## License

[MPL 2.0 w/ HD](http://openmrs.org/license/) © [OpenMRS Inc.](http://www.openmrs.org/)
