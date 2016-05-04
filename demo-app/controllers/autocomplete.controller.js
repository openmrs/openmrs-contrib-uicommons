AutocompleteController.$inject = [];

export default function AutocompleteController(){
	var vm = this;
	vm.isConceptCorrect;
	vm.limitToClass = 'Drug';
	vm.updateConcept = updateConcept;
	
	vm.item = {
			display: 'ItemName'
	}
	
	function updateConcept(isCorrect, concept) {
	    vm.isConceptCorrect = isCorrect;
	    vm.item = concept;
	 };
}