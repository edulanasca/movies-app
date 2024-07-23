'use client';
import { ApolloProvider } from "@apollo/client";
import client from "movieapp/lib/apollo-client";
import { PropsWithChildren } from "react";

export default function Providers({ children }: PropsWithChildren) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}