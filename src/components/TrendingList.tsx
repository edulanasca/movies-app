import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_SEARCH, GET_TRENDING } from "movieapp/lib/queries";
import MediaElement from "./MediaElement";
import { TrendingUnion } from "movieapp/types/Trending";
import { useEffect } from "react";

export default function TrendingList({ debouncedTerm }: { debouncedTerm?: string }) {
  const { loading: trendingLoading, error: trendingError, data: trendingData } = useQuery(GET_TRENDING);
  const [executeSearch, { loading: searchLoading, error: searchError, data: searchData }] = useLazyQuery(GET_SEARCH);

  useEffect(() => {
    if (debouncedTerm && debouncedTerm.trim() !== '') {
      executeSearch({ variables: { term: debouncedTerm } });
    }
  }, [debouncedTerm, executeSearch]);

  if (trendingLoading || searchLoading) return <p>Loading...</p>;
  if (trendingError || searchError) return <p>Error: {trendingError?.message ?? searchError?.message}</p>;

  const displayData = debouncedTerm ? searchData?.search : trendingData?.trending;

  return (
    <div className="p-4">
      {debouncedTerm ? <h1 className="text-2xl font-bold mb-4">Results found...</h1> : <h1 className="text-2xl font-bold mb-4">Trending Movies</h1>}
      <ul className="space-y-4">
        {displayData
          ?.filter((e: TrendingUnion) => e.media_type !== 'person')
          .map((movie: TrendingUnion) => (<MediaElement key={movie.id} media={movie} />))
        }
      </ul>
    </div>
  );
}