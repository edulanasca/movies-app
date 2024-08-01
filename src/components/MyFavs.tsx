'use client';

import { useQuery } from "@apollo/client";
import { GET_FAVS } from "movieapp/lib/queries";
import MediaElement from "./MediaElement";
import { TrendingUnion } from "movieapp/types/Trending";

export default function MyFavs() {
    const { loading, error, data } = useQuery(GET_FAVS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error?.message}</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">My Favorites</h1>
            <ul className="space-y-4">
                {
                    data.favorites.map((element: TrendingUnion) => (<MediaElement key={element.id} media={element} />))
                }
            </ul>
        </div>
    );
}