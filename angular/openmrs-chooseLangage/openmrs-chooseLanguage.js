/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import translateModule from './../openmrs-translate/openmrs-translate.module.js';
import openmrsRest from './../openmrs-rest/openmrs-rest.js';
import openmrsTranslate from './../openmrs-translate/openmrs-translate.module';

var template = require('./openmrs-chooseLanguage.html');

export default angular.module('openmrs-contrib-uicommons.choose-language', ['openmrs-contrib-uicommons.rest', 'openmrs-contrib-uicommons.translate']).component('openmrsChooseLanguage', {
    template: template,
    controller: ChooseLanguageController,
    controllerAs: 'vm'
}).name;

ChooseLanguageController.$inject=['openmrsRest', 'openmrsTranslate'];

function ChooseLanguageController(openmrsRest, openmrsTranslate) {
    var vm = this;
    vm.changeLanguage = changeLanguage;
    vm.allowedLocales = [];

    activate();

    function activate() {
        openmrsRest.listFull('systemsetting', {q: "Locale"}).then(function (response) {
            if(response.results.length > 0){
                vm.allowedLocales = response.results[0].value.split(",");
            }
        })
    }

    function changeLanguage(locale) {
        return openmrsTranslate.changeLanguage(locale.trim());
    }
}