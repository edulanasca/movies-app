import { useQuery } from "@apollo/client";
import { GET_SEARCH, GET_TRENDING } from "movieapp/lib/queries";
import MediaElement from "./MediaElement";
import { TrendingUnion } from "movieapp/types/Trending";

export default function TrendingList({ term }: { term?: string }) {
  const { loading, error, data } = useQuery(GET_TRENDING);
  const { loading: searchLoading, error: searchError, data: searchData } = useQuery(GET_SEARCH, {
    variables: { term },
    skip: !term || term.trim() === '',
  });

  if (loading || searchLoading) return <p>Loading...</p>;
  if (error || searchError) return <p>Error: {error?.message ?? searchError?.message}</p>;

  return (
    <div className="p-4">
      {term ? <h1 className="text-2xl font-bold mb-4">Results found...</h1> : <h1 className="text-2xl font-bold mb-4">Trending Movies</h1>}
      <ul className="space-y-4">
        {
          (term ? searchData.search : data.trending)
            .filter((e: TrendingUnion) => e.media_type !== 'person')
            .map((movie: TrendingUnion) => (<MediaElement key={movie.id} media={movie} />))
        }
      </ul>
    </div>
  );
}