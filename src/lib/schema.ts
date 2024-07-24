import { createSchema } from 'graphql-yoga';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Trending } from 'movieapp/models/Trending';
import { Context } from 'movieapp/app/api/graphql/types';
import { getDbConnection } from 'movieapp/lib/db';

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
      register(username: String!, password: String!): String
      login(username: String!, password: String!): String
      logout: Boolean
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
  `;

const resolvers = {
    Query: {
        movie: async (_: any, { id }: { id: number }) => {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
            return response.data;
        },
        tvseries: async (_: any, { id }: { id: number }) => {
            const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`);
            return response.data;
        },
        trending: async (_: any, __: any, context: Context) => {
            const response = await axios.get<Trending>(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`);
            return context.user !== undefined ?
                response.data.results.map(it => ({ ...it, __typename: it.media_type === 'movie' ? 'Movie' : 'TVSeries', isFav: context.user ? context.user.favorites.some(fav => fav.id === it.id) : false })) :
                response.data.results.map(it => ({ ...it, __typename: it.media_type === 'movie' ? 'Movie' : 'TVSeries' }));
        },
        search: async (_: any, { keyword }: { keyword: string }, context: Context) => {
            const response = await axios.get<Trending>(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${keyword}&include_adult=false&language=en-US&page=1`);
            return context.user !== undefined ?
                response.data.results.map(it => ({ ...it, __typename: it.media_type === 'movie' ? 'Movie' : 'TVSeries', isFav: context.user ? context.user.favorites.some(fav => fav.id === it.id) : false })) :
                response.data.results.map(it => ({ ...it, __typename: it.media_type === 'movie' ? 'Movie' : 'TVSeries' }));
        },
        credits: async (_: any, { id, type }: { id: number; type: string }) => {
            const response = await axios.get(`https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${API_KEY}`);
            return response.data.cast;
        },
        favorites: async (_: any, __: any, context: Context) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            const db = await getDbConnection();
            const favorites = await db.all('SELECT * FROM favorites WHERE username = ?', context.user.username);
            const favs = [];

            for (const fav of favorites) {
                const response = await axios.get(`https://api.themoviedb.org/3/${fav.type}/${fav.id}?api_key=${API_KEY}`);
                favs.push({ ...response.data, __typename: fav.type === 'movie' ? 'Movie' : 'TVSeries', media_type: fav.type, isFav: true });
            }
            await db.close();
            return favs;
        },
        me: async (_: any, __: any, context: Context) => {
            if (!context.user) {
                return null;
            }
            const db = await getDbConnection();
            const user = await db.get('SELECT username FROM users WHERE username = ?', context.user.username);
            await db.close();
            return user;
        },
    },
    Mutation: {
        register: async (_: any, { username, password }: { username: string; password: string }, context: Context) => {
            const db = await getDbConnection();
            const existingUser = await db.get('SELECT * FROM users WHERE username = ?', username);
            if (existingUser) {
                await db.close();
                throw new Error('User already exists');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.run('INSERT INTO users (username, password) VALUES (?, ?)', username, hashedPassword);
            await db.close();

            const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
            context.setCookie('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000,
            });

            return 'User registered successfully';
        },
        login: async (_: any, { username, password }: { username: string; password: string }, context: Context) => {
            const db = await getDbConnection();
            const user = await db.get('SELECT * FROM users WHERE username = ?', username);
            await db.close();

            if (!user) {
                throw new Error('User does not exist');
            }
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                throw new Error('Invalid password');
            }
            const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

            context.setCookie('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000,
            });

            return 'Login successful';
        },
        logout: async (_: any, __: any, context: Context) => {
            context.clearCookie('auth_token');
            return true;
        },
        addFavorite: async (_: any, { id, type }: { id: number; type: string }, context: Context) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            const db = await getDbConnection();
            await db.run('INSERT INTO favorites (username, id, type) VALUES (?, ?, ?)', context.user.username, id, type);
            await db.close();
            return { id, type };
        },
        removeFavorite: async (_: any, { id }: { id: number }, context: Context) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            const db = await getDbConnection();
            const result = await db.run('DELETE FROM favorites WHERE username = ? AND id = ?', context.user.username, id);
            await db.close();
            return result.changes && result.changes > 0;
        },
    },
};

const schema = createSchema({
    typeDefs,
    resolvers
});

export { schema, resolvers, SECRET_KEY };