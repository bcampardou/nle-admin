(function(parent){
    document.addEventListener('DOMContentLoaded',function(){
        [].slice.call(document.querySelectorAll('[data-lipsum]'))
            .forEach(function(element){
                element.innerHTML=parent.generate();
            });
    });
})(lipsumjs);