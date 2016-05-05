ListController.$inject = [];

export default function ListController(){
    var vm = this;

    //Properties for list component
    vm.resource = "conceptsource";
    vm.redirectionParam = "source";
    vm.columns= [
        {
            "property": "name",
            "label": "Name"
        },
        {
            "property": "hl7Code",
            "label":"HL7 Code"
        },
        {
            "property": "description",
            "label":"Description"
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