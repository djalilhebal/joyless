# Joyless YTS: Yet To See

Demo: https://joyless-yts.netlify.app

**Features:**

- Filter by **Genre** and **Minimum Rating**.

- Automatically sort by downloads count.

- [ ] Filter by year range

  * YTS API does not expose this filter.

- "Show hidden movies" toggle.


## Problem

## Idea: Cuckoo filter

[Cuckoo filter | Wikipedia](https://en.wikipedia.org/wiki/Cuckoo_filter)

A Cuckoo filter is like a probabilistic set. It answers the question "Is this element in the set?" with either **No** (certain) or **Probably Yes**.
Meaning, there may be false positives.
For our use-case, we can set adjust the error rate (**false positive rate**) to 1%.
Plus, this is a non-critical app, so false positives are fine. In the worst case scenario, we simply hide a great movie that should've been shown.
In a more serious scenario, we might need to double check the database to be certain, or just not use probabilistic data structures altogether.

### Example

Our set is the list of movies I have already watched. Suppose they are exported my IMDb's account.

Now, we can ask questions like:

Have I seen [_One Flew Over the Cuckoo's Nest_](https://www.imdb.com/title/tt0073486/)? Probably yes. Hide it.

Have I seen [_Jack et la mécanique du coeur_ (aka _Jack and the Cuckoo-Clock Heart_)](https://www.imdb.com/title/tt1181840/)? Probably yes. Hide it.

Have I seen [_The Godfather_](https://www.imdb.com/title/tt0068646/)? Certainly no. Display it. I want to watch it.

---

When looking to discover new movies, I usually search for:
- Genre: Animation.
- Rating: Very high. 6+.
- Sort by downloads count.

Web:
https://yts.mx/browse-movies/0/all/animation/8/downloads/0/all

API:
https://yts.mx/api/v2/list_movies.json?genre=animation&limit=50&minimum_rating=8&sort_by=download_count


## Implementation

- [`npm:bloom-filters`](https://github.com/Callidon/bloom-filters) provies the Cuckoo filter implementation.
  * [`npm:buffer`](https://github.com/feross/buffer) to polyfill `Buffer` in the browser.
  * 🟥 Cuckoo filter is buggy: It returns false negatives, which is totally unacceptable (but it's ok for this demo).
    We will need to [wait for the issue to be fixed](https://github.com/Callidon/bloom-filters/issues/68) or use something else.
  * 🟩 Supports JSON serialization.
- [ ] [`npm:cuckoo-filter`](https://github.com/vijayee/cuckoo-filter)
  * 🟩 Supports JSON serialization.

- [YTS API](https://yts.mx/api) to list movies.
- [ ] TMDb API

- Vue

- ~~[Reka UI](https://github.com/unovue/reka-ui)~~ 
  * Think: Radix UI for Vue.

- Quasar Framework


## Generating the filter

```sh
npm run generate-cuckoo

npm run generate-cuckoo -- --source json
```


## Possible questions

- Why YTS?
Simple API, requires no access token.


## TODO

- [ ] Error handling and debouncing/rate limiting

- [ ] Mobile-friendly layout

- [ ] Infinite scroll

- [ ] YTS: Search by term

- [ ] YTS: Filtering by multiple genres


## License

WTFPL
