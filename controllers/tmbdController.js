const axios = require("axios");

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

exports.getTrending = async (req, res) => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${API_KEY}`
    );
    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch trending movies",
    });
  }
};

exports.searchMovies = async (req, res) => {
  const { query, genre, year, rating, page = 1 } = req.query;
  console.log("Searching for:", query);

  try {

    const url = query
      ? `${TMDB_BASE_URL}/search/movie`
      : `${TMDB_BASE_URL}/discover/movie`;

    const params = {
      api_key: API_KEY,
      language: "en-US",
      include_adult: false,
      page,
    };

   
    if (query) params.query = query;
    if (genre) params.with_genres = genre; 
    if (year) params.primary_release_year = year;
    if (rating) params["vote_average.gte"] = rating;

    const response = await axios.get(url, { params });
     console.log("Movies fetched:", response.data.results);

    res.json(response.data);
  } catch (error) {
    console.error("TMDb Search Error:", error.message);
    res.status(500).json({ message: "Failed to fetch movies" });
  }
};

exports.getMovieDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos,credits",
      },
    });

    const movie = response.data;

    const videos = movie.videos?.results || [];
    const credits = movie.credits?.cast || [];
const castWithImages = credits.length > 0
  ? credits.slice(0, 5).map((actor) => ({
      name: actor.name,
      character: actor.character,
      profileImage: actor.profile_path
        ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
        : "/placeholder-profile.jpg", // Fallback image
  }))
  : [];

res.json({
  id: movie.id,
  title: movie.title,
  overview: movie.overview,
  genres: movie.genres,
  release_date: movie.release_date,
  rating: movie.vote_average,
  poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  trailer: getTrailerUrl(videos),
  cast: castWithImages,  // Ensure cast is always an array
});


  } catch (err) {
    console.error("TMDb error:", err.response?.data || err.message);

    res.status(500).json({
      message: "Failed to get movie details",
    });
  }
};

function getTrailerUrl(videos) {
  const trailer = videos.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
}
