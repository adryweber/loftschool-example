ymaps.ready(init);

// Шаблоны верстки 

// Шаблон отображения времени
function dateStamp (d) {
    return `${d.getDate()}.${d.getMonth()}.${d.getFullYear()} ${d.getHours()}.${d.getMinutes()}`;
}

// Шаблон формы и места для списка отзывов
function formMaket(geoAdress) {
    return `
        <div class='mapReviewWrapper'>
            <div class='mapReview'>
                <div class='mapReviewHeader'>${geoAdress}</div>
                <div class='mapReviewItems'></div>
                <div class='mapReview_formWrapper'>
                    <div class='mapReviewH1'>Ваш отзыв</div>
                    <form class='mapReviewForm'>
                        <div class='form-row'><input id='name' type='text' placeholder='Ваше имя'></div>
                        <div class='form-row'><input id='point' type='text' placeholder='Место'></div>
                        <div class='form-row'><textarea id='message' placeholder='Отзыв'></textarea></div>
                        <div class='form-row'><button id='btn' class='mapReviewFormSubmit'>Отпраить</btn></div>
                    </form>
                </div>
            </div>
        </div>`;
}

// Шаблон одного отзыва в списке
// контейнер и его класс создается программно ниже по коду <div class='mapReviewItem'>
function oneReview ({ d, name, point, message }) {
    return `
        <div class='reviewText'>${message}</div>
        <div class='reviewAttr'>
            <span class='orgName'>Место: ${point}</span>
            <span class='userName'>Автор: ${name}</span>
           <span class='time'>${dateStamp(d)}</span>
        </div>
    `;
}

// Шаблон отзыва в дизайне карусели
function oneReviewOnPoint ({ name, coords, message }) {
    return `
        <div id='review'>
            <a class='linkCoords' href='javascript: void(0);' data-coords='${coords}'>${name}</a>
            <span>${message}</span>
        </div>`;
}

function init() {
    let myMap, clusterer, balloon;
    let allReviews = {};
    let count = 0;
    let d = new Date();

    myMap = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 11,
        controls: []
    });

    clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel'
    });

    myMap.geoObjects.add(clusterer);

    // + По клику на место на карте открываем кастомный баллон с формой (создание первого отзыва)
    // balloonTemp(coords);
    myMap.events.add('click', function (e) {
        if (balloon) { // здесь balloon.isOpen() не сработает, т.к. это кастомный баллон?
            balloon.close();
        }

        let coords = e.get('coords');

        balloonTemp(coords);
    });

    // + Клик на метке, что бы открыть кастомный баллон
    // balloonTemp(coords, object);
    clusterer.events.add('click', function (e) {
        let target = e.get('target');
        let coords = target.geometry._coordinates; // берем координаты объекта (метки) e.get('coords'); 
        let source = 'fromPlacemark';

        if (!target.getGeoObjects) { // отфильтровываем клик по метке кластера
            myMap.balloon.close();
            balloonTemp(coords, source);
        }
    });

    // + Клик на ссылке адреса в карусели... что бы открыть кастомный баллон
    // balloonTemp(coords, flag);
    document.addEventListener('click', function (e) {
        if (e.target.className === 'linkCoords') {
            let arrCoord = e.target.dataset.coords.split(',');
            let coords = [Number(arrCoord[0]), Number(arrCoord[1])];
            let source = 'fromCarusel';

            myMap.balloon.close(); // закрываем стандартный баллон карусели 
            balloonTemp(coords, source);
        }
    });

    // Баллон
    function balloonTemp(coords, source) {
        let reviewsInBalloon = []; // сколько отзывов в текущем баллуне нужно показать  reviewsInBalloon

        // Если был клик не на пустом месте построением баллуна наполняем reviewsInBalloon отзывами 
        // у которых координаты совпадают с объектом клика
        if (source) {
            for (let key in allReviews) {
                if (allReviews.hasOwnProperty(key) && 
                    JSON.stringify(allReviews[key].coords) === JSON.stringify(coords)) { 
                    
                    reviewsInBalloon.push(allReviews[key]);
                }
            }
        } 

        ymaps.geocode(coords).then(function(res) {
            // Первый по списку адрес из возвращаемых с того места, куда кликнули
            const geoAdress = res.geoObjects.get(0).properties.get('text');
            
            let BalloonContentLayout = ymaps.templateLayoutFactory.createClass(formMaket(geoAdress), {
                build: function () {
                    BalloonContentLayout.superclass.build.call(this);
                    
                    // Помечаем наш кастомный баллун, что бы сделать ему белый крестик
                    // eslint-disable-next-line newline-after-var
                    const balloonTmp = document.querySelector('.ymaps-2-1-74-balloon');
                    balloonTmp.classList.add('customBalloon');

                    let that = this;
                    const mapReviewItems = document.querySelector('.mapReviewItems');

                    // + Выводим уже имеющиеся отзывы (если есть) в панели над формой
                    if (reviewsInBalloon.length > 0) {
                        for (const key in reviewsInBalloon) {
                            if (reviewsInBalloon.hasOwnProperty(key)) {
                                const div = document.createElement('div');

                                div.classList.add('mapReviewItem');
                                div.innerHTML = reviewsInBalloon[key].message;
                                mapReviewItems.appendChild(div);
                            }
                        }
                    }
                    
                    // + Клик на кнопке формы создания отзыва: добавляем один отзыв
                    document.getElementById('btn').addEventListener('click', function (e) {
                        e.preventDefault();
                        const name = document.getElementById('name').value;
                        const point = document.getElementById('point').value;
                        const message = document.getElementById('message').value;

                        const div = document.createElement('div');

                        div.classList.add('mapReviewItem');
                        div.innerHTML = oneReview({ d, name, point, message });
                        mapReviewItems.appendChild(div);

                        that._addPlacemark(name, point, message);
                    })
                },

                clear: function () {
                    BalloonContentLayout.superclass.clear.call(this);
                },
                    
                // Кастомный метод, по нажатию на кнопке добавления отзыва ставится точка на карте
                _addPlacemark: function (name, point, message) {
                    // В глобальный объект добавляем запись о новой метке 
                    // (что бы потом можно было выводить имеющиеся отзывы)
                    allReviews[count++] = {
                        coords: coords,
                        name: name,
                        date: d.toString(),
                        message: oneReview ({ d, name, point, message })
                    }

                    let Placemark = new ymaps.Placemark(coords, { 
                        // Здесь формируем описание, которое будет выведено в стандартной карусели кластера
                        balloonContentHeader: `<b>${point}</b>`, 
                        balloonContentBody: oneReviewOnPoint({ name, coords, message }),
                        balloonContentFooter: dateStamp(d),
                    }, 
                    {
                        hasBalloon: false // что бы при клике на метку не открывался её стандартный баллун
                    });

                    clusterer.add(Placemark);
                }
            })

            // Наконец создаем и открываем кастомный баллун
            balloon = new ymaps.Balloon(myMap, {
                contentLayout: BalloonContentLayout,
                minHeight: 300
            });             

            balloon.options.setParent(myMap.options);
            balloon.open(coords);
        }); // end geocode

    } // end balloonTemp

} // end init

