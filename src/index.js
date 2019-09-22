/* eslint-disable guard-for-in */
/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

// Модель куки
let cookie = getCookie ();

// Первичная отрисовака таблицы
renderCookie(cookie);

function isMatching(full, chunk) {
    if (chunk === '') {
        return false;
    }

    full = full.toLowerCase();
    chunk = chunk.toLowerCase();

    return full.includes(chunk);
}

// Перегон реальных куки в объект
function getCookie () {
    let cookies = document.cookie;

    return cookies.split('; ').reduce( (prev, current) => {
        const [name, value] = current.split('=');
        
        prev[name] = value;
    
        return prev;
    }, {})
}

// Рендер таблицы куки
function renderCookie (cookie) {
    let fragment = document.createDocumentFragment();
    
    for (let oneCookie in cookie) {
    
        let tr = document.createElement('tr');
        let tdName = document.createElement('td');
        let tdValue = document.createElement('td');
        let tdBtn = document.createElement('td');
        
        tdName.innerText = oneCookie;
        tdValue.innerText = cookie[oneCookie];
        tdBtn.innerHTML = `<button class='delCookieBtn' id='${oneCookie}=${cookie[oneCookie]}'>удалить</button>`;

        tr.appendChild(tdName);
        tr.appendChild(tdValue);
        tr.appendChild(tdBtn);
    
        fragment.appendChild(tr);
    }
    listTable.innerHTML = '';
    listTable.appendChild(fragment);
}

function filterCookie () {
    let cookieFiltred = {};

    cookieFiltred = Object.keys(cookie).filter( cookieOne =>  
        (isMatching(cookieOne, filterNameInput.value) || 
        isMatching(cookie[cookieOne], filterNameInput.value))
    
    ).reduce( (prev, current) => {
        prev[current] = cookie[current];
        
        return prev;
    }, {})

    if ( Object.keys(cookieFiltred).length > 0) {
        renderCookie(cookieFiltred);
    } else {
        renderCookie(cookie);
    }
}

// Фильтрация куки
filterNameInput.addEventListener('keyup', function() {
    filterCookie();
});

// Добавление куки
addButton.addEventListener('click', () => {
    document.cookie = `${addNameInput.value}=${addValueInput.value}`;
    cookie = getCookie(); // обновляем модель
    filterCookie();

    addNameInput.value = '';
    addValueInput.value = '';
});

// Удаление куки
listTable.addEventListener('click', (e) => {
    if (e.target.className === 'delCookieBtn') {
        document.cookie = `${e.target.id}; max-age=0`;
        cookie = getCookie(); // обновляем модель
        renderCookie(cookie);
    }
});

