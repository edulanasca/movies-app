import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { gql, useMutation, useQuery } from "@apollo/client";
import { GET_FAVS, GET_SEARCH, GET_TRENDING } from "movieapp/lib/queries";

const ADD_FAV = gql`
    mutation AddFavorite($mediaId: Int!, $mediaType: String!) {
        addFavorite(id: $mediaId, type: $mediaType) {
            id
        }
    }
`;

const REMOVE_FAV = gql`
    mutation RemoveFavorite($mediaId: Int!) {
        removeFavorite(id: $mediaId)
    }
`;

export default function MediaElement({ media }: { media: any }) {
    const router = useRouter();
    const [addFavorite] = useMutation(ADD_FAV);
    const [removeFavorite] = useMutation(REMOVE_FAV);
    const [showAuthModal, setShowAuthModal] = useState(false);

    function viewDetailsHandler(id: number, media_type: string) {
        router.push(`/${media_type}/${id}`);
    }

    async function addToFavoritesHandler(e: any, id: number, media_type: string) {
        e.stopPropagation();
        try {
            await addFavorite({ 
                variables: { mediaId: id, mediaType: media_type }, 
                refetchQueries: [{query:GET_TRENDING}, {query:GET_FAVS}] 
            });
        } catch (error: any) {
            if (error.message.includes("Not authenticated")) {
                setShowAuthModal(true);
            } else {
                console.error("Error adding favorite:", error);
            }
        }
    }

    function removeFromFavoritesHandler(e: any, id: number) {
        e.stopPropagation();
        removeFavorite({ variables: { mediaId: id }, refetchQueries: [{query:GET_TRENDING}, {query:GET_FAVS}] });
    }

    function handleAuthAction(action: 'login' | 'register') {
        setShowAuthModal(false);
        router.push(`/auth/${action}`);
    }

    return (
        <>
            <li
                key={media.id}
                onClick={() => viewDetailsHandler(media.id, media.media_type)}
                className="flex p-4 border rounded-lg cursor-pointer hover:shadow-lg relative"
            >
                {media.poster_path && (
                    <div className="flex-shrink-0">
                        <Image
                            src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                            alt={media.title ?? media.original_title ?? media.name ?? media.original_name}
                            width={200}
                            height={300}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <div className="ml-4 flex-grow flex flex-col">
                    <div className="flex justify-between items-start">
                        <h2 className="text-xl font-bold pr-8 break-words">
                            {media.title ?? media.original_title ?? media.name ?? media.original_name}
                        </h2>
                        <div
                            className="flex-shrink-0"
                            onClick={(e) => media.isFav ? removeFromFavoritesHandler(e, media.id) : addToFavoritesHandler(e, media.id, media.media_type)}
                            style={{ pointerEvents: 'auto' }}
                        >
                            {media.isFav ? (
                                <FaStar className="text-yellow-500 cursor-pointer h-[1.5em] w-[1.5em]" />
                            ) : (
                                <FaStar className="text-gray-500 cursor-pointer h-[1.5em] w-[1.5em]" />
                            )}
                        </div>
                    </div>
                    <p className="text-sm font-medium">Rating: {media.vote_average}</p>
                    <p className="text-sm text-gray-500 mb-2">
                        {media.release_date ? `Release Date: ${media.release_date}` : `First Air Date: ${media.first_air_date}`}
                    </p>
                </div>
            </li>

            {showAuthModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
                        <p className="mb-4">Please log in or register to add favorites.</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => handleAuthAction('login')}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => handleAuthAction('register')}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Register
                            </button>
                            <button
                                onClick={() => setShowAuthModal(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}