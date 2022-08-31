import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import {
  makeImageCardsMarkup,
  renderImages,
  renderMoreImages,
} from './js/render-img';
import ImgApiService from './js/pixabay-api-service';

// слушаем
const refs = {
  searchForm: document.querySelector('.search-form'),
  imgGallery: document.querySelector('.gallery'),
  searchInput: document.querySelector('input[name="searchQuery"]'),
};

// константы и переменные
let formSubm = false;
const imageService = new ImgApiService();
const simpeLightBoxGallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 300,
});

// обработка запроса
refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();
  formSubm = true;

  imageService.resetPage();
  refs.imgGallery.innerHTML = '';

  const query = e.currentTarget.elements.searchQuery.value.trim();
  if (!query) {
    Notify.warning('No data to search. Please enter');
    return;
  }
  imageService.query = query;

  try {
    const response = await imageService.fetchImg();
    const data = response.data;
    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    const markup = makeImageCardsMarkup(data);
    renderImages(markup, refs.imgGallery);
    formSubm = false;
    addGalleryScrollObserver();

    simpeLightBoxGallery.refresh();

    Notify.success(`Hooray! We found ${data.totalHits} images`);
  } catch (error) {
    console.log(error);
  }
}

// загрузка фото
async function onLoadMore() {
  try {
    const response = await imageService.fetchImg();
    const data = response.data;

    const totalPages = Math.ceil(data.totalHits / imageService.perPage);
    if (imageService.page - 1 === totalPages + 1) {
      Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );

      return;
    }

    const markup = makeImageCardsMarkup(data);
    renderMoreImages(markup, refs.imgGallery);

    simpeLightBoxGallery.refresh();

    scrollWhenLoaded();
    addGalleryScrollObserver();
  } catch (error) {
    console.log(error);
    return 'error';
  }
}
// плавная прокрутка
function scrollWhenLoaded() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function addGalleryScrollObserver() {
  const callback = entries => {
    entries.forEach(entry => {
      if (formSubm) {
        observer.disconnect();
        return;
      }
      if (!entry.isIntersecting) {
        onLoadMore();
        observer.disconnect();
      }
    });
  };

  const options = {
    rootMargin: '-100% 0% 0% 0%',
  };

  const observer = new IntersectionObserver(callback, options);
  observer.observe(refs.imgGallery);
}
