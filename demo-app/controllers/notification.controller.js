NotificationController.$inject = ['openmrsNotification'];

export default function NotificationController(openmrsNotification){
	var vm = this;
	vm.title = "";
	vm.content = "";
	
	vm.success = function(){
		openmrsNotification.success(vm.content, vm.title);
	}
	vm.error = function(){
		openmrsNotification.error(vm.content, vm.title);
	}
	vm.warning = function(){
		openmrsNotification.warning(vm.content, vm.title);
	}
	vm.info = function(){
		openmrsNotification.info(vm.content, vm.title);
	}
}