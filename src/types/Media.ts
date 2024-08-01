export interface Movie {
    id: number;
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: string;
    budget: number;
    genres: Genre[];
    homepage: string;
    imdb_id: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: SpokenLanguage[];
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    media_type: string;
    isFav: boolean;
  }
  
  interface Genre {
    id: number;
    name: string;
  }
  
  interface ProductionCompany {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }
  
  interface ProductionCountry {
    iso_3166_1: string;
    name: string;
  }
  
  interface SpokenLanguage {
    english_name: string;
    iso_639_1: string;
    name: string;
  }
  
  export interface TVSeries {
    adult: boolean;
    backdrop_path: string;
    created_by: Creator[];
    episode_run_time: number[];
    first_air_date: string;
    genres: Genre[];
    homepage: string;
    id: number;
    in_production: boolean;
    languages: string[];
    last_air_date: string;
    last_episode_to_air: Episode;
    next_episode_to_air: string;
    networks: Network[];
    number_of_episodes: number;
    number_of_seasons: number;
    origin_country: string[];
    original_language: string;
    name: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    seasons: Season[];
    spoken_languages: SpokenLanguage[];
    status: string;
    tagline: string;
    title: string;
    type: string;
    vote_average: number;
    vote_count: number;
    media_type: string;
    isFav: boolean;
  }
  
  interface Creator {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string;
  }
  
  interface Episode {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string;
  }
  
  interface Network {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }
  
  interface Season {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    vote_average: number;
  }