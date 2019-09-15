/* ДЗ 6 - Асинхронность и работа с сетью */

/*
 Задание 1:

 Функция должна возвращать Promise, который должен быть разрешен через указанное количество секунду

 Пример:
   delayPromise(3) // вернет promise, который будет разрешен через 3 секунды
 */
function delayPromise(seconds) {
    let promise = new Promise(function(resolve, reject) {
        setTimeout(() => resolve('done'), seconds * 1000);
    });

    return promise;
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
    let promise = new Promise( function(resolve, reject) {
        let url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';
        
        var req = new XMLHttpRequest();

        req.open('GET', url, true);
        req.responseType = 'json';
        req.send();
        req.onload = function() {
            let cityes = req.response;
            
            cityes.sort((a, b) => {
                let nameA = a.name.toLowerCase(), 
                    nameB = b.name.toLowerCase();

                // eslint-disable-next-line no-nested-ternary
                return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
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
