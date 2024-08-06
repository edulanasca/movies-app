import { useQuery } from "@apollo/client";
import { GET_MOVIE } from "movieapp/lib/queries";
import Image from "next/image";
import Cast from "./Cast";

export default function MovieDetails({ id }: { id: number }) {
    const { loading, error, data } = useQuery(GET_MOVIE, {
        variables: { id },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="p-4 md:p-10">
            <div className="flex flex-col md:flex-row">
                {data.movie.poster_path && (
                    <div className="flex-shrink-0 mb-4 md:mb-0">
                        <Image
                            src={`https://image.tmdb.org/t/p/w500${data.movie.poster_path}`}
                            alt={data.movie.title}
                            width={300}
                            height={450}
                            className="rounded-lg mx-auto md:mx-0"
                        />
                    </div>
                )}
                <div className="p-7 md:ml-4 flex-grow">
                    <h1 className="text-2xl font-bold mb-2">{data.movie.title}</h1>
                    <p className="text-sm text-gray-500 mb-2">Release Date: {data.movie.release_date}</p>
                    <p className="text-sm text-gray-500 mb-2">Rating: {data.movie.vote_average}</p>
                    <p className="sm:text-lg text-justify">{data.movie.overview}</p>
                </div>
            </div>
            <h2 className="text-xl font-bold mt-8 mb-4">Cast</h2>
            <Cast id={id} type="movie" />
        </div>
    );
}