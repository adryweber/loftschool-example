/* eslint-disable no-nested-ternary */
/* ДЗ 2 - работа с массивами и объектами */

/*
 Задание 1:

 Напишите аналог встроенного метода forEach для работы с массивами
 Посмотрите как работает forEach и повторите это поведение для массива, который будет передан в параметре array
 */
function forEach(array, fn) {
    // let result = [];
    
    for (let i=0; i < array.length; i++ ) {
        fn(array[i], i, array)
        // result.push(fn(array[i], i, array));
    }
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

/*
 Задание 5 *:

 Напишите аналог встроенного метода slice для работы с массивами
 Посмотрите как работает slice и повторите это поведение для массива, который будет передан в параметре array
 */
function slice(array, from = 0, to) {

    let length = array.length;
    
    // Для положит.: 
    // 1) Cтарт больше, чем конец или 
    // 2) Старт больше, чем длинна массива. Улетаем.
    if (((from + to) > 0 && from > to) || (from > 0 && from > length)) { 
        return [];
    }
    
    // 3) Если старт отриц. Если он больше длинны по модулю. Начинаем с нуля.
    // 4) Если старт отриц., пересчитываем с конца
    from = (from < 0 && Math.abs(from) > length) ? 0 : 
        (from < 0) ? (length + from) : 
            from;

    // 5) Конец не задан (дефолт конца), приводим к длинне
    // 6) Конец по модулю больше длинны - приводим к длинне по модулю
    // 7) Если правый конец отрицательный, пересчитываем с конца массива
    to = (to === undefined) ? length :
        (Math.abs(to) > length) ? (Math.sign(to) * length) :
            (to < 0) ? (length + to) : 
                to;

    let arrResult = [];

    for (let i = from; i < to; i++) {
        arrResult.push(array[i]);
    }

    return arrResult;
}

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
    slice,
    // createProxy
};
