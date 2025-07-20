const MovieCard = ({ movie }) => {

  return (
    <li className="bg-gray-800 p-4 rounded-md">
      <a
        href={`https://www.youtube.com/watch?v=${movie.id.videoId}`}
        target="_blank"
        rel="noopener noreferrer"
      >

        <img
          src={movie.snippet.thumbnails.medium.url}
          alt={movie.snippet.title}
          className="rounded"
        />
        <h3 className="text-white mt-2 text-lg font-semibold">
          {movie.snippet.title}
        </h3>
        <p className="text-gray-400 text-sm">
          Channel: {movie.snippet.channelTitle}
        </p>
      </a>
    </li>
  );
};

export default MovieCard;
