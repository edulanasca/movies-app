import { useQuery } from "@apollo/client";
import { GET_TV_SERIES } from "movieapp/lib/queries";
import Image from "next/image";
import Cast from "./Cast";

export default function TvSeriesDetails({ id }: { id: number }) {
  const { loading, error, data } = useQuery(GET_TV_SERIES, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-4 md:p-10">
      <div className="flex flex-col md:flex-row">
        {data.tvseries.poster_path && (
          <div className="flex-shrink-0 mb-4 md:mb-0">
            <Image
              src={`https://image.tmdb.org/t/p/w500${data.tvseries.poster_path}`}
              alt={data.tvseries.name}
              width={300}
              height={450}
              className="rounded-lg mx-auto md:mx-0"
            />
          </div>
        )}
        <div className="p-7 md:ml-4 flex-grow">
          <h1 className="text-2xl font-bold mb-2">{data.tvseries.name}</h1>
          <p className="text-sm text-gray-500 mb-2">First Air Date: {data.tvseries.first_air_date}</p>
          <p className="text-sm text-gray-500 mb-2">Rating: {data.tvseries.vote_average}</p>
          <p className="text-sm text-gray-500 mb-2">Number of Episodes: {data.tvseries.number_of_episodes}</p>
          <p className="text-sm text-gray-500 mb-2">Number of Seasons: {data.tvseries.number_of_seasons}</p>
          <p className="sm:text-lg text-justify">{data.tvseries.overview}</p>
        </div>
      </div>
      <h2 className="text-xl font-bold mt-8 mb-4">Cast</h2>
      <Cast id={id} type="tv" />
    </div>
  )
}