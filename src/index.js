/* ДЗ 3 - работа с массивами и объеектами */

/*
 Задача 1:
 Напишите аналог встроенного метода forEach для работы с массивами
 */
function forEach(array, fn) {
    for (var i=0; i<array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задача 2:
 Напишите аналог встроенного метода map для работы с массивами
 */
function map(array, fn) {
    
    var newAr = [];
    
    for (var i=0; i<array.length; i++) {
        newAr[i] = fn(array[i], i, array);
    }

    return newAr;
}

/*
 Задача 3:
 Напишите аналог встроенного метода reduce для работы с массивами
 */
function reduce(array, fn, initial) {

    var prev, i;

    if (initial === undefined) {
        prev = array[0];
        i = 1;
    } else {
        prev = initial;
        i = 0;
    }
    for (i; i<array.length; i++) {
        
        prev = fn(prev, array[i], i, array);
    }

    return prev;
}

/*
 Задача 4:
 Функция принимает объект и имя свойства, которое необходиом удалить из объекта
 Функция должна удалить указанное свойство из указанного объекта
 */
function deleteProperty(obj, prop) {
    delete obj[prop];
}

/*
 Задача 5:
 Функция принимает объект и имя свойства и возвращает true или false
 Функция должна проверить существует ли укзаанное свойство в указанном объекте
 */
function hasProperty(obj, prop) {
    if (prop in obj) {
        return true;
    } else {
        return false;
    }
}

/*
 Задача 6:
 Функция должна получить все перечисляемые свойства объекта и вернуть их в виде массива
 */
function getEnumProps(obj) {
    return Object.keys(obj);
}

/*
 Задача 7:
 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистра и вернуть в виде массива
 */
function upperProps(obj) {
    var result = [];

    for (var prop in obj) {

        result.push(prop.toUpperCase());
    }

    return result;
}

/*
 Задача 8 *:
 Напишите аналог встроенного метода slice для работы с массивами
 */
function slice(array, from = 0, to = array.length) {
    var newArr = [];

    if (array.length + from < 0) {
        from = 0;
    }

    if (array.length - to < 0) {
        to = array.length;
    }

    if (from < 0) {
        from = array.length + from + 1;
    }
    if (to < 0) {
        to = array.length + to;
    }

    for (var i=from; i<to; i++) {
        newArr.push(array[i]);
    }

    return newArr;
}

/*
 Задача 9 *:
 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    return new Proxy( obj, {
        set(target, prop, value) { 
            target[prop] = value*value;

            return true;
        } 
    } );
}

export {
    forEach,
    map,
    reduce,
    deleteProperty,
    hasProperty,
    getEnumProps,
    upperProps,
    slice,
    createProxy
};
