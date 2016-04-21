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
            "property": "description"
        }];
    vm.actions = [
        {
            "action":"edit",
            "label":"Edit"
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
            "label":"Delete"
        }
    ];
}