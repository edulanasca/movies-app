import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { GET_FAVS, GET_TRENDING } from "movieapp/lib/queries";
import { TrendingUnion } from "movieapp/types/Trending";
import AuthModal from "./AuthModal";

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

export default function MediaElement({ media }: { media: TrendingUnion }) {
    const router = useRouter();
    const [addFavorite] = useMutation(ADD_FAV);
    const [removeFavorite] = useMutation(REMOVE_FAV);
    const [showAuthModal, setShowAuthModal] = useState(false);

    function viewDetailsHandler(id: number, media_type: string) {
        router.push(`/${media_type}/${id}`);
    }

    async function addToFavoritesHandler(e: React.MouseEvent, id: number, media_type: string) {
        e.stopPropagation();
        try {
            await addFavorite({
                variables: { mediaId: id, mediaType: media_type },
                refetchQueries: [{ query: GET_TRENDING }, { query: GET_FAVS }]
            });
        } catch (error) {
            if (error instanceof ApolloError) {
                if (error.message.includes("401")) {
                    setShowAuthModal(true);
                } else {
                    console.error("Error adding favorite:", error.message);
                }
            } else {
                console.error("Unexpected error:", error);
            }
        }
    }

    function removeFromFavoritesHandler(e: React.MouseEvent, id: number) {
        e.stopPropagation();
        try {
            removeFavorite({ variables: { mediaId: id }, refetchQueries: [{ query: GET_TRENDING }, { query: GET_FAVS }] });
        } catch (error: unknown) {
            // @ts-expect-error error returned by apollo client
            if ((error as ApolloError).graphQLErrors[0].extensions?.originalError?.message?.includes("Not authenticated")) {
                setShowAuthModal(true);
            } else {
                console.error("Error adding favorite:", error);
            }
        }
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            viewDetailsHandler(media.id, media.media_type);
        }
    }

    function cancelAuthModal() {
        setShowAuthModal(false);
    }

    return (
        <>
            <li className="list-none w-full">
                <div
                    role="button"
                    tabIndex={0}
                    className="flex flex-col sm:flex-row p-4 border rounded-lg cursor-pointer hover:shadow-lg relative focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-400"
                    onClick={() => viewDetailsHandler(media.id, media.media_type)}
                    onKeyDown={handleKeyDown}
                >
                    {media.poster_path && (
                        <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6 sm:w-48">
                            <Image
                                src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                                alt={media.title ?? media.original_title ?? media.name ?? media.original_name ?? "title"}
                                width={192}
                                height={288}
                                className="rounded-lg w-full h-auto"
                            />
                        </div>
                    )}
                    <div className="flex-grow flex flex-col">
                        <div className="flex justify-between items-start">
                            <h2 className="text-lg font-bold pr-8 break-words mb-2">
                                {media.title ?? media.original_title ?? media.name ?? media.original_name}
                            </h2>
                            <button
                                className="flex-shrink-0 bg-transparent border-none p-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    media.isFav ? removeFromFavoritesHandler(e, media.id) : addToFavoritesHandler(e, media.id, media.media_type);
                                }}
                                aria-label={media.isFav ? "Remove from favorites" : "Add to favorites"}
                            >
                                <FaStar className={`cursor-pointer h-[1.5em] w-[1.5em] ${media.isFav ? 'text-yellow-500' : 'text-gray-500'}`} />
                            </button>
                        </div>
                        <p className="text-sm font-medium">Rating: {media.vote_average}</p>
                        <p className="text-sm text-gray-500 mb-2">
                            {media.release_date ? `Release Date: ${media.release_date}` : `First Air Date: ${media.first_air_date}`}
                        </p>
                    </div>
                </div>
            </li>

            {showAuthModal && <AuthModal onCancel={cancelAuthModal} />}
        </>
    );
}