import throttle from 'lodash.throttle';

export default function backToTop() {
  const shownOnPx = 100;
  const backToTopBtn = document.querySelector('.back-to-top.hidden');
  const scrollContainer = document.documentElement;

  document.addEventListener(
    'scroll',
    throttle(() => {
      if (scrollContainer.scrollTop > shownOnPx) {
        backToTopBtn.classList.remove('hidden');
        backToTopBtn.addEventListener('click', () => {
          document.body.scrollIntoView({
            behavior: 'smooth',
          });
        });
      } else {
        backToTopBtn.classList.add('hidden');
      }
    }, 300)
  );
}
backToTop();
