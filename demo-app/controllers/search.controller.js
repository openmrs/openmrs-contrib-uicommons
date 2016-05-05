ListController.$inject = [];

export default function ListController(){
	var vm = this;
    vm.type = "table";
    vm.resource = "conceptreferenceterm";
    vm.limit = 5; //Default value
    vm.columns= [
        {
            "property": "code",
            "label": "Code"
        },
        {
            "property": "name",
            "label": "Name"
        },
        {
            "property": "conceptSource.display",
            "label": "Source"
        }];
    vm.actions = [
        {
            "action":"edit",
            "label":"Edit"
        },
        {
            "action":"retire",
            "label":"Retire",
            "link" : "#/reference/{uuid}"
        },
        {
            "action":"unretire",
            "label":"unretire"
        },
        {
            "action":"purge",
            "label":"Delete"
        }];
}