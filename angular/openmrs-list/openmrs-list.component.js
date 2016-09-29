/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import css from './list.css';
var template = require('./openmrs-list.html');
var openmrs = require('../../src/scss/images/inprogress.gif');
import openmrsRest from './../openmrs-rest/openmrs-rest.js';
import openmrsNotification from './../openmrs-notification/openmrs-notification.service.js'

export default angular.module('openmrs-contrib-uicommons.list', ['openmrs-contrib-uicommons.rest', 'openmrs-contrib-uicommons.notification'])
    .component('openmrsList', {
        template: template,
        controller: openmrsList,
        controllerAs: 'vm',
        bindings: {
            onUpdate: '&',
            resource: '<',
            columns: '<',
            type: '<',
            actions: '<',
            enableSearch: '<',
            limit: '<',
            listAll: '<',
            disableLinks: '<',
            customParams: '<',
            noDataNotification: '<'
        }
    }).name;

openmrsList.$inject = ['openmrsRest', 'openmrsNotification', '$scope', '$location'];

function openmrsList(openmrsRest, openmrsNotification, $scope, $location) {
    var vm = this;

    //Variable that describes how many letters does search panel need to start searching
    vm.minimumQueryLength = 3;
    vm.minimumSourceLength = 2;

    //Initial loading logo
    vm.logo = openmrs;

    //Initial data and query
    vm.data = [];
    vm.noResults = false;
    vm.query = '';

    //Default value for show retired checkbox
    vm.showRetired = false;
    
    // Advanced Search exclusive mode for conceptSearch and conceptReferenceTermSearch
    vm.isAdvancedSearchPossible = isAdvancedSearchPossible;
    vm.advancedSearchResource = resolveAdvancedSearchResource();
    vm.isAdvancedSearchModeOn = isAdvancedSearchModeOn;
    vm.selectedAdvancedSearchDataUuid = null;
    vm.advancedSearchResourceLabel = '';

    vm.advancedSearchData = [{}];

    function isAdvancedSearchModeOn() {
        return vm.advancedSearchData != null && vm.selectedAdvancedSearchDataUuid != null;
    }

    function isAdvancedSearchPossible() {
        return vm.resource === "concept" || vm.resource === "conceptreferenceterm"
    }
    
    function resolveAdvancedSearchResource() {
        if (vm.isAdvancedSearchPossible()) {
            if (vm.resource === "concept") {
                vm.advancedSearchResourceLabel = "class";
                return "conceptclass"
            }
            else if (vm.resource === "conceptreferenceterm") {
                vm.advancedSearchResourceLabel = "source";
                return "conceptsource"
            }
        }
        else {
            return '';
        }
    }
    resolveAdvancedSearchResource();
    
    function resolveAdvancedSearchFilterData() {
        openmrsRest.list(vm.advancedSearchResource).then(function (resp) {
            vm.advancedSearchData = resp.results;
        })
    }
    resolveAdvancedSearchFilterData();

    function resolveDefaultEntriesPerPage() {
        if (angular.isDefined(vm.limit)) {
            vm.entriesPerPage = {value: vm.limit};
            vm.entriesPerPageOptions = [{value : vm.limit}, {value : 25}, {value : 50}];
        }
        else {
            vm.entriesPerPage = {value : 10};
            vm.entriesPerPageOptions = [{value : 10}, {value : 25}, {value : 50}];
        }
    }
    resolveDefaultEntriesPerPage();

    function resolveNoDataNotification() {
        if (angular.isUndefined(vm.noDataNotification)) {
            vm.noDataNotification = 'No data'
        }
    }
    resolveNoDataNotification();

    //Default icon values
    vm.icon =
    {
        edit : "icon-pencil edit-action",
        retire : "icon-remove delete-action",
        unretire : "icon-reply edit-action",
        purge  : "icon-trash delete-action",
        view : "icon-eye-open edit-action"
    };

    function resolveDefaultAttributes() {
        vm.getType = getType;
        function getType() {
            if (angular.isUndefined(vm.type)) {
                return 'table'
            }
            else {
                return vm.type;
            }
        }

        vm.getActions = getActions;
        function getActions() {
            if (angular.isUndefined(vm.actions)) {
                return [{"action":"view", "label":"View"}]
            }
            else {
                return vm.actions;
            }
        }
        vm.actionsBackup = vm.getActions();
        vm.getSearchPanel = getSearchPanel;
        function getSearchPanel() {
            if (angular.isUndefined(vm.enableSearch)) {
                return false;
            }
            else {
                return vm.enableSearch;
            }
        }
        vm.getLimit = getLimit;
        function getLimit() {
            if (angular.isUndefined(vm.limit)) {
                return 10;
            }
            else {
                return vm.limit;
            }
        }
        vm.entriesPerPage.value = vm.getLimit();

        vm.getListAll = getListAll;
        function getListAll() {
            if (angular.isUndefined(vm.listAll)) {
                return false;
            }
            else {
                return vm.listAll;
            }
        }
    }
    resolveDefaultAttributes();

    vm.isTextClickable = false;
    vm.nextPagePossible = false;
    vm.resolveDefaultClickLink = resolveDefaultClickLink;

    function resolveDefaultClickLink() {
         var dataSet = vm.getActions();
            for(var i = 0; i < dataSet.length; i++) {
                if (dataSet[i].action === 'view') {
                    vm.isTextClickable = !vm.disableLinks;
                    if (angular.isDefined(dataSet[i].link)) {
                        vm.link = dataSet[i].link;
                    }
                    else {
                        vm.link = '#/' + vm.resource + '/';
                    }
                }
                else if (dataSet[i].action === 'edit') {
                    vm.isTextClickable = !vm.disableLinks;
                    if (angular.isDefined(dataSet[i].link)) {
                        vm.link = dataSet[i].link;
                    }
                    else {
                        vm.link = '#/' + vm.resource + '/edit/';
                    }
                }
            }
    }
    resolveDefaultClickLink();

    //Resolves default redirect links to edit/view pages
    vm.resolveRedirectLinks = resolveRedirectLinks;
    function resolveRedirectLinks(item) {
        if (angular.isDefined(vm.link)) {
            if (vm.link.indexOf('{uuid}') > -1) {
                return vm.link.replace('{uuid}', item.uuid)
            }
            else {
                return vm.link + item.uuid
            }
        }
    }

    //Manage custom icons and labels values
    function resolveCustomIcons() {
        if (angular.isDefined(vm.actions)) {
            for (var i = 0; i < vm.actions.length; i++) {
                if (angular.isDefined(vm.actions[i].icon)) {
                    vm.icon[vm.actions[i].action] = vm.actions[i].icon;
                }
            }
        }
    }
    function resolveCustomLabels() {
        if (angular.isDefined(vm.columns)) {
            for (var i = 0; i < vm.columns.length; i++) {
                if (angular.isUndefined(vm.columns[i].label)) {
                    vm.columns[i].label = vm.columns[i].property;
                }
            }
        }
    }
    resolveCustomIcons();
    resolveCustomLabels();

    vm.synonymOf = synonymOf;

    function synonymOf(word, data) {
        if (vm.resource == 'concept') {

            if (data.display.toLowerCase().indexOf(word.toLowerCase()) > -1) {
                return false;
            }
            else {
                for (var i = 1; i < data.names.length; i++) {
                    if (data.names[i].display.toLowerCase().indexOf(word.toLowerCase()) > -1) {
                        return data.names[i].display;
                    }
                }
                return false;
            }
        }
    }

    //Find out which action button to put - retire or unretire
    vm.resolveRetireButtons = function(object, activity) {
        return !((object.retired && activity === 'retire')
        || (!object.retired && activity === 'unretire'));
    };

    //Button onClicks
    vm.performAction = function(object, action) {
        vm.clickedObject = object;
        switch (action.action) {
            case 'edit' :
                edit(object);
                break;
            case 'view' :
                edit(object);
                break;
            case 'retire' :
                showRetireAlert(object);
                break;
            case 'unretire' :
                unretire(object);
                break;
            case 'purge' :
                showDeleteAlert(object);
                break;
            case 'custom' :
                showCustomAlert(object, action);
                break;
            default:
                console.log('There is no action for activity  \"' + action.action + '\"')
        }
    };

    //Direct REST calls for actions
    function retire(item, retireReason) {
        openmrsRest.retire(vm.resource, item, retireReason).then(function(success) {
            var notificationInfo = item.display + ' has been retired';
            openmrsNotification.success(notificationInfo);
            getPage();
        }, function (exception) {
            var notificationInfo = item.display + ' couldn\'t be retired';
            openmrsNotification.error(notificationInfo);
        });
    }
    function unretire(item) {
        openmrsRest.unretire(vm.resource, item).then(function(success) {
            var notificationInfo = item.display + ' has been unretired';
            openmrsNotification.success(notificationInfo);
            getPage();
        }, function (exception) {
            var notificationInfo = item.display + ' couldn\'t be unretired';
            openmrsNotification.error(notificationInfo);
        });
    }
    function purge(item) {
        openmrsRest.purge(vm.resource, {uuid: item.uuid}).then(function(success) {
            var notificationInfo = item.display + ' has been deleted forever';
            openmrsNotification.success(notificationInfo);
            getPage();
        }, function (exception) {
            var notificationInfo = item.display + ' couldn\'t be deleted forever';
            openmrsNotification.error(notificationInfo);
        });
    }
    function edit(item) {
        //Slice is to delete hash ($location.path handles it)
        $location.path(resolveRedirectLinks(item).slice(2));
    }

    //Delete and retire alerts logic
    vm.updateDeleteConfirmation = function updateDeleteConfirmation(isConfirmed) {
        if (isConfirmed) {
            purge(vm.deleteItem);
        }
        vm.deleteClicked = false;
    };
    vm.updateRetireConfirmation = function updateDeleteConfirmation(retireReason, isConfirmed) {
        if (isConfirmed) {
            retire(vm.retireItem, retireReason);
        }
        vm.retireClicked = false;
    };
    
    vm.updateCustomConfirmation = updateCustomConfirmation;
    function updateCustomConfirmation(isConfirmed) {
        if (isConfirmed) {
            vm.onUpdate({selectedItem: vm.selectedItem});
        }
        vm.customActionClicked = false;
    }

    function showDeleteAlert(item) {
        vm.deleteItem = item;
        if (angular.isDefined(item.display)) {
            vm.message = "Are you sure that you want to delete " + item.display + " forever?";
        }
        else if (angular.isDefined(item.name)) {
            vm.message = "Are you sure that you want to delete " + item.name + " forever?";
        }
        else {
            vm.message = "Are you sure that you want to delete this item forever?";
        }        
        vm.deleteClicked = true;
    }
    function showRetireAlert(item) {
        vm.retireItem = item;
        if (angular.isDefined(item.display)) {
            vm.message = "Are you sure that you want to retire " + item.display + "?";
        }
        else if (angular.isDefined(item.name)) {
            vm.message = "Are you sure that you want to retire " + item.name + "?";
        }
        else {
            vm.message = "Are you sure that you want to retire this item?";
        }
        vm.retireClicked = true;
    }

    function showCustomAlert(item, actionObject) {
        vm.selectedItem = item;
        var selectedName;

        if (angular.isDefined(item.display)) {
            selectedName = item.display;
        }
        else if (angular.isDefined(item.name)) {
            selectedName = item.name;
        }

        if (angular.isDefined(selectedName) && angular.isDefined(actionObject.message)) {
            vm.message = actionObject.message.replace(/%s/g, selectedName);
        }
        else {
            vm.message = "Are You sure?"
        }

        vm.customActionClicked = true;
    }

    // Method used to prevent app from querying server with every letter input into search query panel
    vm.timeoutRefresh = timeoutRefresh;
    var timeout = null;
    function timeoutRefresh() {
        clearTimeout(timeout);
        vm.isUserTyping = true;
        timeout = setTimeout(function () {
            sendNewQuery()
        }, 250);
    }

    vm.getPage = getPage;
    
    function getPage() {

        vm.isLoadingMorePages = true;

        var params = {
            limit: vm.entriesPerPage.value,
            includeAll: vm.getListAll(),
            startIndex: vm.entriesPerPage.value * vm.page - vm.entriesPerPage.value
        };

        if (angular.isDefined(vm.customParams)) {
            for (var i = 0; i < vm.customParams.length; i++) {
                params[vm.customParams[i].property] = vm.customParams[i].value;
            }
        }

        if ((vm.query.indexOf(':') >= vm.minimumSourceLength && !vm.isAdvancedSearchModeOn())
            && (vm.resource == "concept" || vm.resource == "conceptreferenceterm")) {
            var parts = vm.query.split(':');
            params['source'] = parts[0];
            
            if (vm.resource == "conceptreferenceterm") {
                params['searchType'] = 'alike';
                params['codeOrName'] = parts[1];
            } else {
                params['code'] = parts[1];
            }
        }
        else if (vm.query.length >= vm.minimumQueryLength && !vm.isAdvancedSearchModeOn()) {
            params['q'] = vm.query;
        }
        //Exclusive concept search filter (See RA-1148 for details)
        else if (vm.isAdvancedSearchModeOn()) {
            if (vm.resource == "concept") {
                if (!vm.selectedAdvancedSearchDataUuid) {
                    params['q'] = vm.query;
                }
                else {
                    params['class'] = vm.selectedAdvancedSearchDataUuid;
                    params['name'] = vm.query;
                    params['searchType'] = 'fuzzy';
                }
            }
            else if (vm.resource == "conceptreferenceterm") {
                if (!vm.selectedAdvancedSearchDataUuid) {
                    params['q'] = vm.query;
                }
                else {
                    params['source'] = vm.selectedAdvancedSearchDataUuid;
                    params['codeOrName'] = vm.query;
                    params['searchType'] = 'alike';
                }
            }
        }

        if (vm.query.length >= vm.minimumQueryLength || !vm.getSearchPanel() || (vm.isAdvancedSearchModeOn() && vm.query.length >= vm.minimumQueryLength)) {
            openmrsRest.listFull(vm.resource, params).then(function (firstResp) {
                vm.data = firstResp.results;
                vm.pageNotFull = vm.data.length < vm.entriesPerPage.value;
                resolveComplexProperties();
                vm.isLoadingInitialPage = false;

                if (firstResp.hasNext()) {
                    vm.nextPagePossible = true;
                }
                else {
                    vm.nextPagePossible = false;
                }
                vm.isLoadingInitialPage = false;
                vm.isLoadingMorePages = false;
                vm.isUserTyping = false;
            })
        }
        else {
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply(function () {
                    vm.data = '';
                    vm.isUserTyping = false;
                });
            }
        }
    }

    vm.sendNewQuery = sendNewQuery;
    function sendNewQuery() {
        firstPage();
        getPage();
    }


    function getInitialData() {
        if (vm.getSearchPanel() == false) {
            getPage();
        }
    }
    getInitialData();

    /**
     * That method solves problem where column got "property in property" value
     * i.e. vm.columns = [{"property" : "names.name"}]
     */
    function resolveComplexProperties() {
        vm.items = [];
        for (var k = 0; k < vm.data.length; k++) {
            vm.items.push({"uuid": vm.data[k].uuid});
            for (var j = 0; j < vm.columns.length; j++) {
                var properties = vm.columns[j].property.split(".");
                var propertyValue = vm.data[k][properties[0]];
                for (var i = 1; i < properties.length; i++) {
                    propertyValue = propertyValue[properties[i]];
                }
                vm.items[k][vm.columns[j].property] = propertyValue;
            }
            vm.items[k].retired = vm.data[k].retired;
        }

        if (vm.resource === 'concept') {
            for (var i = 0; i < vm.data.length; i++) {
                vm.items[i]['names']=(vm.data[i].names);
                vm.items[i]['display']=(vm.data[i].display);
            }
        }
    }

    //Paging logic:
    vm.page = 1;
    vm.nextPage = nextPage;
    vm.prevPage = prevPage;
    vm.firstPage = firstPage;
    vm.pageRange = pageRange;
    vm.goToPage = goToPage;
    
    function goToPage(pageNum) {
        vm.page = pageNum;
        getPage();
    }
    function nextPage() {
        vm.page++;
        getPage();
    }
    function prevPage() {
        vm.page--;
        getPage();
    }
    function firstPage() {
        vm.page = 1;
        getPage();
    }

    function pageRange() {
        var range = [];

        for (var i = vm.page - 1; i < vm.page + 2; i++) {
            if (i > 0 && vm.isNextPagePossible()) {
                range.push(i);
            }
            else if (i > 0 && !vm.isNextPagePossible() && i <= vm.page) {
                range.push(i);
            }
        }
        return range;
    }

    //ng-disabled logic
    vm.isPrevPagePossible = isPrevPagePossible;
    vm.isNextPagePossible = isNextPagePossible;
    vm.isFirstPagePossible = isFirstPagePossible;

    function isPrevPagePossible() {
        return vm.page > 1;
    }
    function isNextPagePossible() {
        return vm.nextPagePossible;
    }
    function isFirstPagePossible() {
        return vm.page > 1
    }

    //ng-show logic
    vm.isLoadingInitialPage = true;
    vm.isLoadingMorePages = false;
    vm.isSearchPanelVisible = isSearchPanelVisible;
    vm.isWholeNavigationPanelVisible = isWholeNavigationPanelVisible;
    vm.isInitialLoaderImageNotificationVisible = isInitialLoaderImageNotificationVisible;
    vm.isButtonPanelVisible = isButtonPanelVisible;
    vm.notificationEmptyQuery = notificationEmptyQuery;
    vm.notificationNoEntriesFound = notificationNoEntriesFound;
    vm.notificationLoading = notificationLoading;
    vm.showTableContent = showTableContent;
    vm.showTable = showTable;
    vm.showList = showList;
    vm.isThereRetireAction = isThereRetireAction;
    vm.showNoDataNotification = showNoDataNotification;
    vm.showRetireCheckbox = showRetireCheckbox;

    function isThereRetireAction() {
        for (var i = 0; i < vm.actions.length; i++) {
            if (vm.actions[i].action === 'retire' || vm.actions[i].action === 'unretire') {
                return true;
            }
        }
        return false;
    }

    function showList() {
        return vm.getType() == 'list'
            && vm.data.length > 0
            && vm.query.length >= vm.minimumQueryLength
            || vm.getSearchPanel() == false
            && vm.getType() == 'list'
            && vm.data.length > 0
            || vm.isAdvancedSearchModeOn() && vm.resource === "concept"
            && vm.data.length > 0;
    }
    function showTable(){
        return vm.getType() == 'table'
            && vm.data.length > 0;
    }
    function showTableContent() {
        return !vm.isLoadingInitialPage;
    }
    function notificationLoading() {
        return vm.isUserTyping
            && vm.query.length >= vm.minimumQueryLength;
    }
    function notificationNoEntriesFound() {
        return vm.query.length >= vm.minimumQueryLength
            && vm.data.length == 0
            && !vm.isUserTyping;
    }
    function notificationEmptyQuery() {
        return vm.query.length < vm.minimumQueryLength
            && vm.getSearchPanel()
            || !vm.isAdvancedSearchModeOn() && vm.selectedAdvancedSearchDataUuid === '' && vm.getSearchPanel() && vm.query.length < vm.minimumQueryLength;
    }
    function isSearchPanelVisible() {
        return vm.getSearchPanel();
    }
    function isWholeNavigationPanelVisible() {
        return !vm.isLoadingInitialPage;
    }
    function isInitialLoaderImageNotificationVisible() {
        return vm.isLoadingInitialPage;
    }
    function isButtonPanelVisible() {
        return !isInitialLoaderImageNotificationVisible()
            && vm.data.length > 0;
    }
    function isLoadingMorePages() {
        return vm.isLoadingMorePages;
    }
    function showNoDataNotification() {
        return vm.data.length == 0 && !vm.getSearchPanel();
    }
    function showRetireCheckbox() {
        return vm.isThereRetireAction() && ((vm.isSearchPanelVisible() && vm.data.length > 0) || (!vm.isSearchPanelVisible()))
    }
}
