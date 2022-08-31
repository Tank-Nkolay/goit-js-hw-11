import axios from 'axios';

const PIXABAY_KEY = '29585906-cf8cb97233adcc9f8a9891715';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImageApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalPage = null;
    this.perPage = 40;
  }

  async fetchImage() {
    const searchParams = new URLSearchParams({
      key: PIXABAY_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.perPage,
    });

    const url = `${BASE_URL}?${searchParams}`;

    const response = await axios.get(url);

    this.page += 1;

    return response;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  resetPage() {
    this.page = 1;
  }
}
