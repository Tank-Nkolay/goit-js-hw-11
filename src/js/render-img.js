export { makeImgCards, renderMoreImg, renderImg };

function makeImgCards(result) {
  const imagesArr = result.hits;
  return imagesArr
    .map(
      image =>
        `<div class="box-img">
  <a href="${image.largeImageURL}"><img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${image.likes}
    </p>
    <p class="info-item">
      <b>Views</b>${image.views}
    </p>
    <p class="info-item">
      <b>Comments</b>${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${image.downloads}
    </p>
  </div>
</div>`
    )
    .join('');
}

function renderImg(markup, itemEl) {
  itemEl.innerHTML = markup;
}

function renderMoreImg(markup, itemEl) {
  itemEl.insertAdjacentHTML('beforeend', markup);
}
