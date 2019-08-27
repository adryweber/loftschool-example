/* ДЗ 2 - работа с массивами и объектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */
function forEach(array, fn) {
    let result = [];
    
    for (let i=0; i < array.length; i++ ) {
        result.push(fn(array[i], i, array));
    }

    // return result;
}

/*
 Задание 2:

 Напишите аналог встроенного метода map для работы с массивами
 Посмотрите как работает map и повторите это поведение для массива, который будет передан в параметре array
 */
function map(array, fn) {
    let result = [];
    
    for (let i=0; i < array.length; i++ ) {
        result.push(fn(array[i], i, array));
    }

    return result;
}

/*
 Задание 3:

 Напишите аналог встроенного метода reduce для работы с массивами
 Посмотрите как работает reduce и повторите это поведение для массива, который будет передан в параметре array
 */
function reduce(array, fn, initial) {
    let previousValue, start;

    if (initial !== undefined) {
        previousValue = initial;
        start = 0;
    } else {
        previousValue = array[0];
        start = 1;
    }

    for (let i=start; i < array.length; i++) {
        let current = fn(previousValue, array[i], i, array);

        previousValue = current;
    }

    return previousValue;
}

/*
 Задание 4:

 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистр и вернуть в виде массива

 Пример:
   upperProps({ name: 'Сергей', lastName: 'Петров' }) вернет ['NAME', 'LASTNAME']
 */
function upperProps(obj) {
    return Object.keys(obj).map( (item) => item.toUpperCase() );
}

// /*
//  Задание 5 *:

//  Напишите аналог встроенного метода slice для работы с массивами
//  Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
//  */
// function slice(array, from, to) {
// }

// /*
//  Задание 6 *:

//  Функция принимает объект и должна вернуть Proxy для этого объекта
//  Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
//  */
// function createProxy(obj) {
// }

export {
    forEach,
    map,
    reduce,
    upperProps,
    // slice,
    // createProxy
};
