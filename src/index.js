/* ДЗ 6 - Асинхронность и работа с сетью */

/*
 Задание 1:

 Функция должна возвращать Promise, который должен быть разрешен через указанное количество секунду

 Пример:
   delayPromise(3) // вернет promise, который будет разрешен через 3 секунды
 */
function delayPromise(seconds) {
    return new Promise(function(resolve) {
        setTimeout(() => resolve('done'), seconds * 1000);
    });
}

/*
 Задание 2:

 2.1: Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов можно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json

 2.2: Элементы полученного массива должны быть отсортированы по имени города

 Пример:
   loadAndSortTowns().then(towns => console.log(towns)) // должна вывести в консоль отсортированный массив городов
 */
function loadAndSortTowns() {
    let promise = new Promise( function(resolve) {
        let url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';
        
        var req = new XMLHttpRequest();

        req.open('GET', url, true);
        req.responseType = 'json';
        req.send();
        req.onload = function() {
            let cityes = req.response;
            
            cityes.sort((a, b) => {
                return (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1;
            })

            resolve(cityes);
        };
    })

    return promise;
}

export {
    delayPromise,
    loadAndSortTowns
};
