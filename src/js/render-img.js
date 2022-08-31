function makeImageCardsMarkup(result) {
  const imagesArr = result.hits;
  return imagesArr
    .map(
      image =>
        `<div class="photo-card">
  <a href="${image.largeImageURL}"><img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes </b>${image.likes}
    </p>
    <p class="info-item">
      <b>Views </b>${image.views}
    </p>
    <p class="info-item">
      <b>Comments </b>${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads </b>${image.downloads}
    </p>
  </div>
</div>`
    )
    .join('');
}

function renderImages(markup, parentEl) {
  parentEl.innerHTML = markup;
}

function renderMoreImages(markup, parentEl) {
  parentEl.insertAdjacentHTML('beforeend', markup);
}

export { renderImages, makeImageCardsMarkup, renderMoreImages };
