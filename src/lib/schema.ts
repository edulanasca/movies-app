import { createSchema } from 'graphql-yoga';
import axios from 'axios';
import { Trending } from 'movieapp/types/Trending';
import { Context } from 'movieapp/app/api/graphql/types';
import { db } from './postgresClient';
import { GraphQLError } from 'graphql';

const API_KEY = process.env.TMDB_API_KEY;
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key_here';

const typeDefs = `
    type Query {
      movie(id: Int!): Movie
      tvseries(id: Int!): TVSeries
      trending: [TrendingResultUnion]
      search(keyword: String): [TrendingResultUnion]
      credits(id: Int!, type: String!): [Cast]
      me: User
      favorites: [TrendingResultUnion]
    }
  
    type Mutation {
      addFavorite(id: Int!, type: String!): Favorite
      removeFavorite(id: Int!): Boolean
    }
  
    type User {
      id: ID
      username: String
    }
  
    type Favorite {
      id: Int!
      type: String!
    }
  
    type Trending {
      page: Int
      results: [TrendingResultUnion!]!
      total_pages: Int
      total_results: Int
    }
    
    union TrendingResultUnion = Movie | TVSeries
  
    type Movie {
      id: Int
      adult: Boolean
      backdrop_path: String
      belongs_to_collection: String
      budget: Int
      genres: [Genre!]!
      homepage: String
      imdb_id: String
      original_language: String
      original_title: String
      overview: String
      popularity: Float
      poster_path: String
      production_companies: [ProductionCompany!]!
      production_countries: [ProductionCountry!]!
      release_date: String
      revenue: Int
      runtime: Int
      spoken_languages: [SpokenLanguage!]!
      status: String
      tagline: String
      title: String
      video: Boolean
      vote_average: Float
      vote_count: Int
      media_type: String
      isFav: Boolean
    }
    
    type Genre {
      id: Int
      name: String
    }
    
    type ProductionCompany {
      id: Int
      logo_path: String
      name: String
      origin_country: String
    }
    
    type ProductionCountry {
      iso_3166_1: String
      name: String
    }
    
    type SpokenLanguage {
      english_name: String
      iso_639_1: String
      name: String
    }
  
    type TVSeries {
      adult: Boolean
      backdrop_path: String
      created_by: [Creator!]!
      episode_run_time: [Int!]!
      first_air_date: String
      genres: [Genre!]!
      homepage: String
      id: Int
      in_production: Boolean
      languages: [String!]!
      last_air_date: String
      last_episode_to_air: Episode
      next_episode_to_air: String
      networks: [Network!]!
      number_of_episodes: Int
      number_of_seasons: Int
      origin_country: [String!]!
      original_language: String
      name: String
      original_name: String
      overview: String
      popularity: Float
      poster_path: String
      production_companies: [ProductionCompany!]!
      production_countries: [ProductionCountry!]!
      seasons: [Season!]!
      spoken_languages: [SpokenLanguage!]!
      status: String
      tagline: String
      title: String
      type: String
      vote_average: Float
      vote_count: Int
      media_type: String
      isFav: Boolean
    }
    
    type Creator {
      id: Int
      credit_id: String
      name: String
      gender: Int
      profile_path: String
    }
    
    type Episode {
      id: Int
      name: String
      overview: String
      vote_average: Float
      vote_count: Int
      air_date: String
      episode_number: Int
      production_code: String
      runtime: Int
      season_number: Int
      show_id: Int
      still_path: String
    }
    
    type Network {
      id: Int
      logo_path: String
      name: String
      origin_country: String
    }
    
    type Season {
      air_date: String
      episode_count: Int
      id: Int
      name: String
      overview: String
      poster_path: String
      season_number: Int
      vote_average: Float
    }
  
    type Cast {
      adult: Boolean
      gender: Int
      id: Int
      known_for_department: String
      name: String
      original_name: String
      popularity: Float
      profile_path: String
      character: String
      credit_id: String
      order: Int
    }

    type Error {
      message: String!
      code: String!
    }
  `;

function createError(message: string, code: string, statusCode: number): GraphQLError {
  return new GraphQLError(message, {
    extensions: {
      code,
      http: { status: statusCode },
    },
  });
}

const resolvers = {
  Query: {
    movie: async (_: unknown, { id }: { id: number }) => {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
      return response.data;
    },
    tvseries: async (_: unknown, { id }: { id: number }) => {
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`);
      return response.data;
    },
    trending: async (_: unknown, __: unknown, context: Context) => {
      const response = await axios.get<Trending>(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`);
      return context.user !== undefined ?
        response.data.results.map(it => ({ ...it, __typename: it.media_type === 'movie' ? 'Movie' : 'TVSeries', isFav: context.user ? context.user.favorites.some(fav => fav.id === it.id) : false })) :
        response.data.results.map(it => ({ ...it, __typename: it.media_type === 'movie' ? 'Movie' : 'TVSeries' }));
    },
    search: async (_: unknown, { keyword }: { keyword: string }, context: Context) => {
      const response = await axios.get<Trending>(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${keyword}&include_adult=false&language=en-US&page=1`);
      return context.user !== undefined ?
        response.data.results.map(it => ({ ...it, __typename: it.media_type === 'movie' ? 'Movie' : 'TVSeries', isFav: context.user ? context.user.favorites.some(fav => fav.id === it.id) : false })) :
        response.data.results.map(it => ({ ...it, __typename: it.media_type === 'movie' ? 'Movie' : 'TVSeries' }));
    },
    credits: async (_: unknown, { id, type }: { id: number; type: string }) => {
      const response = await axios.get(`https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${API_KEY}`);
      return response.data.cast;
    },
    favorites: async (_: unknown, __: unknown, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      const selectedFavs = await db.selectFrom('favorites').selectAll().where('username', '=', context.user.username).execute();
      const favs = [];

      for (const fav of selectedFavs) {
        const response = await axios.get(`https://api.themoviedb.org/3/${fav.type}/${fav.id}?api_key=${API_KEY}`);
        favs.push({ ...response.data, __typename: fav.type === 'movie' ? 'Movie' : 'TVSeries', media_type: fav.type, isFav: true });
      }
      return favs;
    },
    me: async (_: unknown, __: unknown, context: Context) => {
      if (!context.user) {
        return null;
      }
      const user = await db.selectFrom('users').selectAll().where('username', '=', context.user.username).executeTakeFirst();
      return user;
    },
  },
  Mutation: {
    addFavorite: async (_: unknown, { id, type }: { id: number; type: string }, context: Context) => {
      if (!context.user) {
        throw createError('Not authenticated', 'NOT_AUTHENTICATED', 401);
      }
      await db.insertInto('favorites').values({ username: context.user.username, id, type }).execute();
      return { id, type };
    },
    removeFavorite: async (_: unknown, { id }: { id: number }, context: Context) => {
      if (!context.user) {
        throw createError('Not authenticated', 'NOT_AUTHENTICATED', 401);
      }
      await db.deleteFrom('favorites').where('username', '=', context.user.username).where('id', '=', id).execute();
      return true;
    },
  },
};

const schema = createSchema({
  typeDefs,
  resolvers
});

export { schema, resolvers, SECRET_KEY };