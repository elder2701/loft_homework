/* ДЗ 6.1 - Асинхронность и работа с сетью */

/**
 * Функция должна создавать Promise, который должен быть resolved через seconds секунду после создания
 *
 * @param {number} seconds - количество секунд, через которое Promise должен быть resolved
 * @return {Promise}
 */
function delayPromise(seconds) {
    return new Promise((resolve) => 
        setTimeout(() => resolve(), seconds*1000));
}

/**
 * Функция должна вернуть Promise, который должен быть разрешен массивом городов, загруженным из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * Элементы полученного массива должны быть отсортированы по имени города
 *
 * @return {Promise<Array<{name: String}>>}
 */
function loadAndSortTowns() {
    function sortName(item1, item2) {
        if (item1.name > item2.name) return 1;
        if (item1.name < item2.name) return -1;
        return 0;
    }
    let promise = new Promise(function(resolve){
        let url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';
        let req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.onload = function() {
            let arr = JSON.parse(req.response);
            resolve(arr.sort(sortName));
        };
        req.send();
    });
    
    return promise
}

export {
    delayPromise,
    loadAndSortTowns
};
