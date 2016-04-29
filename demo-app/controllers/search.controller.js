ListController.$inject = [];

export default function ListController(){
	var vm = this;
    vm.type = "list";
	vm.resource = "concept";
    vm.redirectionParam = "concept";
    vm.columnsMain= [
        {
            "property": "display",
            "label": "Display"
        }];
    vm.columnsDetails= [
        {
            "property": "uuid", //TODO: Find way to pass "property in property"
            "label": "UUID"
        }];
}