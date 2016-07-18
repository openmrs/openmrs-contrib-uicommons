ListController.$inject = [];

export default function ListController(){
	var vm = this;
    vm.type = "list";
    vm.resource = "concept";
    vm.limit = 10; //Default value
    vm.columns= [
        {
            "property": "name.name",
            "label": "Concept.name"
        },
        {
            "property": "conceptClass.name",
            "label":"class"
        },
        {
            "property": "uuid",
            "label":"uuid"
        }];
    vm.actions = [
        {
            "action":"view",
            "label":"View",
            "link" : "#/concept/{uuid}"
        }
    ];
}