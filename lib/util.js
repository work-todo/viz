function require(url) {
    if(!url.endsWith('.js')){
        url += '.js';
    }
    let xhr = new XMLHttpRequest();
    xhr.open('GET',url,true);
    let _resolve = null,_reject = null;
    let promise = new Promise(function (resolve,reject) {
        _resolve = resolve;
        _reject = reject;
    });
    xhr.addEventListener('readystatechange',function () {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let text = xhr.responseText;
            let module = {
                exports:{}
            };
            try{
                let fn = Function('module','exports',text);
                fn.call(module.exports,module,module.exports);
                _resolve(module.exports);
            }catch(e){
                _reject(e);
            }
        }
    });
    xhr.send();
    return promise;
}
const nextFrame = typeof 'requestAnimationFrame' === 'function' ? requestAnimationFrame : function(f){
    return setTimeout(f,16);
};
const cancelNextFrame = typeof 'cancelAnimationFrame' === 'function' ? cancelAnimationFrame : clearTimeout;
