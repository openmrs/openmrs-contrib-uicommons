ListController.$inject = [];

export default function ListController(){
    var vm = this;

    //Properties for list component
    vm.resource = "conceptstopword";
        vm.limit = 10; //Default
        vm.columns= [
            {
                "property": "display",
                "label": "Word"
            },
            {
                "property": "locale",
                "label":"Locale"
            }];
        vm.actions = [
            {
                "action":"purge",
                "label":"Delete",
                "link":"#/stopword/{uuid}"
            }
        ];
}