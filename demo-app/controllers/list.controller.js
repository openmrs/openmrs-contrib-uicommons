ListController.$inject = [];

export default function ListController(){
	var vm= this;
	vm.resource = "conceptclass";
    vm.redirectionParam = "class";
    vm.limit = 10; //Default value
    vm.columns= [
        {
            "property": "name",
            "label": "Name"
        },
        {
            "property": "description",
            "label":"Description"
        }];
    vm.actions = [
        {
            "action":"edit",
            "label":"Edit",
            "icon":"icon-pencil edit-action left"
        },
        {
            "action":"retire",
            "label":"Retire",
            "icon":"icon-remove delete-action"
        },
        {
            "action":"unretire",
            "label":"unretire",
            "icon":"icon-reply edit-action"
        },
        {
            "action":"purge",
            "label":"Delete",
            "icon":"icon-trash delete-action right"
        }
    ];
}