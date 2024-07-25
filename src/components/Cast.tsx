import { useQuery } from "@apollo/client";
import Image from "next/image";
import { GET_CAST } from "movieapp/lib/queries";
import { CastModel } from "movieapp/models/Cast";

export default function Cast({ id, type }: { id: number; type: string }) {
    const { data, loading, error } = useQuery(GET_CAST, {
        variables: { id, type },
        skip: !id || !type,
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="flex space-x-4 overflow-x-auto">
            {data && data.credits.map((member: CastModel) => (
                <div key={member.id} className="flex-shrink-0 w-32">
                    {
                        member.profile_path && (
                            <Image
                                src={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                                alt={member.name}
                                width={128}
                                height={192}
                                className="rounded-lg"
                            />
                        )
                    }
                    <p className="text-center mt-2">{member.name}</p>
                    <p className="text-center mt-2">{member.character}</p>
                </div>
            ))}
        </div>
    );
}