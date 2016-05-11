TranslateController.$inject = ['$translate'];

export default function TranslateController($translate){
    
    var vm = this;
    vm.changeLanguage = function (langKey) {
        return $translate.use(langKey);
    };
}