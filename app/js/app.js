document.addEventListener("DOMContentLoaded", function () {
  // Обрезание текста
  function kitcut(text, limit) {
    text = text.trim();
    if (text.length <= limit) return text;

    text = text.slice(0, limit);

    return text.trim() + "...";
  }

  // Шаблон отзыва
  function createFeedback(name, instagram_username, text) {
    const feedbackTemplate = `
    <div class="intro__item">
    <div class="intro__content">
      <h2 class="intro__title no-md">
        ${kitcut(text, 241)}
      </h2>

      <h2 class="intro__title no-xl md">
        ${kitcut(text, 186)}
      </h2>

      <div class="intro__info">
        <span class="intro__name">
          ${name}
          <span class="intro__symbol no-md">
            ,
          </span>
        </span>
        ${instagram_username}
      </div>
    </div>
  </div>
      `;

    const introList = document.querySelector("#introSlider");
    introList.insertAdjacentHTML("beforeend", feedbackTemplate);
  }

  // Получение данных и отрисовка отзывов
  async function fetchFeedbacks() {
    const response = await fetch("/feedback_data.json");

    if (response.ok) {
      const feedbackPlaceholder = document.querySelector(
        ".intro__item--placeholder"
      );
      feedbackPlaceholder.remove();

      const feedbacks = await response.json(); // прочитать тело ответа как текст

      feedbacks.forEach(function (feedback) {
        createFeedback(
          feedback.name,
          feedback.instagram_username,
          feedback.text
        );
      });

      // Подключаем слайдер
      $("#introSlider")
        .not(".slick-initialized")
        .slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplaySpeed: 2000,
          nextArrow: $("#introNext"),
          prevArrow: $("#introPrev"),
        });
    } else {
      console.log("Ошибка HTTP: " + response.status);
    }
  }
  fetchFeedbacks();

  // Шаблон новости
  function createNew(title, url) {
    const newTemplate = `
    <a href="${url}" class="news__item" target="_blank">
    <div class="news__item__wrapper">
        <img src="./images/dest/desktop/img3@3x.png" alt="NewsName" class="news__img" />
      <div class="news__item__box">
        <h3 class="news__item__title">
          ${title}
        </h3>
      </div>
    </div>
  </a>
        `;

    const newsist = document.querySelector(".news__list");
    newsist.insertAdjacentHTML("beforeend", newTemplate);
  }

  // Получение данных и отрисовка новостей
  async function fetchNews() {
    const response = await fetch("/blog_posts.json");

    if (response.ok) {
      const news = await response.json(); // прочитать тело ответа как текст

      // Сортировка по дате (от новых к старым)
      news.sort(function (a, b) {
        var dateA = new Date(a.date),
          dateB = new Date(b.date);
        return dateB - dateA;
      });

      news.forEach(function (newItem) {
        createNew(newItem.title, newItem.url);
      });
    } else {
      console.log("Ошибка HTTP: " + response.status);
    }
  }

  const newsmore = document.querySelector(".news__more");
  newsmore.addEventListener("click", (evt) => {
    evt.preventDefault();
    newsmore.classList.add("news__more--hide");

    fetchNews();
  });
});
