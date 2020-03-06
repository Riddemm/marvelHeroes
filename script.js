document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const filmsSelect = document.getElementById('films');
  filmsSelect.style.cssText = `
    margin-bottom: 20px;
    width: 100%;
    font-size: 20px;
    padding: 10px`;

  let cards = [];

  const getData = (file) => {

    const request = new XMLHttpRequest();
    request.open('GET', file);
    request.setRequestHeader('Content-type', 'application/json');

    request.addEventListener('readystatechange', () => {

      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {

        const data = JSON.parse(request.responseText);

        let filmSet = new Set();

        data.forEach(item => {

          // Формирование карточек
          const card = document.createElement('div');
          card.classList.add('card');
          document.body.append(card);
          card.style.cssText = `
            display: flex;
            align-items: center;
            border: 1px solid black;
            background-color: lightyellow;
            margin-bottom: 20px;
            padding: 10px 30px;`;

          const photoWrapper = document.createElement('div');
          photoWrapper.style.marginRight = '50px';
          card.append(photoWrapper);
          cards.push(card);

          const textWrapper = document.createElement('div');
          card.append(textWrapper);

          for (let key in item) {
            if (key === 'photo') {
              const photo = document.createElement('img');
              photo.setAttribute('src', item[key]);
              photo.style.width = '200px';
              photo.style.display = 'block';
              photoWrapper.append(photo);
            } else {
              const text = document.createElement('p');
              if (key === 'movies') {
                text.textContent = key + ': ' + item[key].join(', ');
              } else {
                text.textContent = key + ': ' + item[key];
              }

              textWrapper.append(text);
            }
          }

          // Добавление фильмов в коллекцию filmSet
          if (item.movies) {
            item.movies.forEach(movie => {
              filmSet.add(movie);
            });
          }
        });

        filmSet.forEach(film => {
          let newOption = new Option(film, film);
          filmsSelect.append(newOption);
        });

        filmsSelect.addEventListener('change', () => {

          let selectedOption;
          filmsSelect.childNodes.forEach(option => {
            if (option.selected) {
              selectedOption = option;
            }
          });

          let dataObjIndexes = [];

          data.forEach((item, index) => {
            if (item.movies && item.movies.includes(selectedOption.value)) {
              dataObjIndexes.push(index);
            }
          });

          cards.forEach((card, index) => {

            if (!dataObjIndexes.includes(index)) {
              card.style.display = 'none';
            } else {
              card.style.display = 'flex';
            }

            // Если выбран option "Выберите фильм"
            if (dataObjIndexes.length === 0) {
              card.style.display = 'flex';
            }
          })

        });

      } else {
        output.textContent = 'Произошла ошибка';
      }
    });

    request.send();
  }

  getData('dbHeroes.json');

});