import { useQuery } from "@apollo/client";
import Image from "next/image";
import { GET_CAST } from "movieapp/lib/queries";
import { CastModel } from "movieapp/types/Cast";

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
                        <Image
                            src={member.profile_path ? `https://image.tmdb.org/t/p/w500${member.profile_path}` : 'data:image/jpeg;base64,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'}
                            alt={member.name}
                            width={128}
                            height={180}
                            className="rounded-lg"
                        />
                    }
                    <p className="text-center mt-2">{member.name}</p>
                    <p className="text-center mt-2">{member.character}</p>
                </div>
            ))}
        </div>
    );
}