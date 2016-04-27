/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
var template = require('./retire-alert.html');

export default angular.module('openmrs-contrib-uicommons.retire-alert', []).component('retireAlert', {
    template: template,
    controller: RetireAlertController,
    controllerAs: 'vm',
    bindings: {
        onUpdate: '&'
    }
}).name;

export default function RetireAlertController(){
    var vm = this;

    vm.isConfirmed = false;
    vm.retireReason ='';

    vm.confirm = confirm;

    function confirm(isConfirmed) {
        vm.isConfirmed = isConfirmed;
        vm.onUpdate(
            {
                retireReason : vm.retireReason,
                isConfirmed : vm.isConfirmed
            }
        );
    }
}