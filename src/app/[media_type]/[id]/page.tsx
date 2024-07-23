'use client';
import MovieDetails from "movieapp/components/MovieDetails";
import TvSeriesDetails from "movieapp/components/TvSeriesDetails";
import { useParams, useRouter } from 'next/navigation'

export default function Page() {
    const router = useRouter();
    const params = useParams<{ media_type: string; id: string }>()
    const { media_type, id } = params;

    return (
        <div>
            <div onClick={() => router.back()}>Go back</div>
            {
                media_type == "movie" ? <MovieDetails id={parseInt(id)} /> : <TvSeriesDetails id={parseInt(id)} />
            }
        </div>
    );
}