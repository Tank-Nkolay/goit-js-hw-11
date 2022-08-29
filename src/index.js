// Libraries imports
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// Dev imports
import ImageApiService from './js/pixabay-api-service';
import {
  makeImageCardsMarkup,
  renderImages,
  renderMoreImages,
} from './js/gallery-render';

const refs = {
  searchForm: document.querySelector('.search-form'),
  imageGallery: document.querySelector('.gallery'),
  searchInput: document.querySelector('input[name="searchQuery"]'),
};

// Declaring variable for Intersection observer disconnection on form resubmit
let formJustSubmitted = false;
// Creating instances for working with API and SimpleLightBox Gallery
const imageService = new ImageApiService();
const simpeLightBoxGallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// Adding event listner for search query
refs.searchForm.addEventListener('submit', onSearch);

// Search query handler
async function onSearch(e) {
  e.preventDefault();
  formJustSubmitted = true;
  // Reseting imageService parameters on new query
  imageService.resetPage();
  refs.imageGallery.innerHTML = '';
  // Reseting end of results variable

  // Checking if user typed something
  const query = e.currentTarget.elements.searchQuery.value.trim();
  if (!query) {
    Notify.warning('You should type something...');
    return;
  }
  imageService.query = query;

  try {
    const response = await imageService.fetchImage();
    const data = response.data;
    if (data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    const markup = makeImageCardsMarkup(data);

    renderImages(markup, refs.imageGallery);
    // Adding IntersectionObserver for infinite srcroll
    formJustSubmitted = false;
    addGalleryScrollObserver();
    // Refreshing SimpleLightBoxGallery after new items rendered
    simpeLightBoxGallery.refresh();

    Notify.success(`Hooray! We found ${data.totalHits} images`);
  } catch (error) {
    console.log(error);
  }
}

// Loading more images function
async function onLoadMore() {
  try {
    const response = await imageService.fetchImage();
    const data = response.data;

    // Checking for end of query results
    const totalPages = Math.ceil(data.totalHits / imageService.perPage);
    if (imageService.page - 1 === totalPages + 1) {
      Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );

      return;
    }

    const markup = makeImageCardsMarkup(data);
    renderMoreImages(markup, refs.imageGallery);
    // Refreshing SimpleLightBoxGallery after new items rendered
    simpeLightBoxGallery.refresh();
    // Smooth scrolling when loading more content
    scrollWhenLoaded();
    addGalleryScrollObserver();
  } catch (error) {
    console.log(error);
    return 'error';
  }
}
// Smooth scrolling when loading more content
function scrollWhenLoaded() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
// Creating gallery scroll observer for loading more content onScroll
function addGalleryScrollObserver() {
  const callback = entries => {
    entries.forEach(entry => {
      if (formJustSubmitted) {
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

  observer.observe(refs.imageGallery);
}
