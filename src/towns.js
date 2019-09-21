/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загрузки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
const loadingBlock = homeworkContainer.querySelector('#loading-block');
const filterBlock = homeworkContainer.querySelector('#filter-block');
const filterInput = homeworkContainer.querySelector('#filter-input');
const filterResult = homeworkContainer.querySelector('#filter-result');


/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
    let promise = new Promise( function(resolve, reject) {
        let url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';
        
        var req = new XMLHttpRequest();

        req.responseType = 'json';
        req.open('GET', url, true);

        req.onload = function() {
            if (req.status !== 200) {
                reject(new Error('Ошибка загрузки списка городов'));
            }

            let towns = req.response;
                
            towns.sort((a, b) => {
                return (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1;
            })
            resolve(towns);
        };

        req.send();
        // setTimeout(()=> req.send(), 1000); // имитация задержки ответа сервера
    })
    
    return promise;
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    if (chunk === '') {
        return false;
    }

    full = full.toLowerCase();
    chunk = chunk.toLowerCase();

    return full.includes(chunk);
}

let townsListLoaded = loadTowns();
let townsList = [];

townsListLoaded
    .then(
        result => {
            loadingBlock.style.display = 'none';
            filterBlock.style.display = 'block';
            townsList = result;
        });

filterInput.addEventListener('keyup', function(event) {
    let suggestList = [];

    suggestList = townsList.filter(
        item => isMatching(item.name, event.target.value)
    );
    
    filterResult.innerText = '';

    if (suggestList.length > 0) {
        let fragment = document.createDocumentFragment();

        suggestList.forEach(item => {
            const div = document.createElement('div');

            div.innerText = item.name;
            fragment.appendChild(div);
        });

        filterResult.appendChild(fragment);
    }

});

export {
    loadTowns,
    isMatching
};
