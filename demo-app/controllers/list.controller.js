ListController.$inject = [];

export default function ListController(){
    var vm = this;

    //Properties for list component
    vm.resource = "conceptsource";
    vm.columns= [
        {
            "property": "name",
            "label": "Concept.name"
        },
        {
            "property": "hl7Code",
            "label": "ConceptSource.hl7Code"
        },
        {
            "property": "description",
            "label":"Description"
        }];
    vm.actions = [
        {
            "action":"edit",
            "label":"Edit",
            "link":"#/source/{uuid}"
        },
        {
            "action":"retire",
            "label":"Retire"
        },
        {
            "action":"unretire",
            "label":"Unretire"
        },
        {
            "action":"purge",
            "label":"Delete"
        }
    ];
}