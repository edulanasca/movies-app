'use client';

import { useQuery } from "@apollo/client";
import { GET_FAVS } from "movieapp/lib/queries";
import MediaElement from "./MediaElement";
import { useEffect } from "react";

export default function MyFavs() {
    const { loading, error, data, refetch } = useQuery(GET_FAVS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error?.message}</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">My Favorites</h1>
            <ul className="space-y-4">
                {
                    data.favorites.map((element: any) => (<MediaElement key={element.id} media={element} />))
                }
            </ul>
        </div>
    );
}