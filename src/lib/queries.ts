import { gql } from "@apollo/client";

export const GET_TRENDING = gql`
query {
  trending {
    ... on Movie {
      id
      title
      original_title
      release_date
      poster_path
      media_type
      vote_average
      isFav
    }
    ... on TVSeries {
      id
      name
      original_name
      first_air_date
      poster_path
      media_type
      vote_average
      isFav
    }
  }
}
`;

export const GET_FAVS = gql`
query {
  favorites {
    ... on Movie {
      id
      title
      original_title
      release_date
      poster_path
      media_type
      vote_average
      isFav
    }
    ... on TVSeries {
      id
      name
      original_name
      first_air_date
      poster_path
      media_type
      vote_average
      isFav
    }
  }
}
`;

export const GET_SEARCH = gql`
query($term: String!) {
  search(keyword: $term) {
    ... on Movie {
        id
        title
        original_title
        release_date
        poster_path
        media_type
        vote_average
      }
      ... on TVSeries {
        id
        name
        original_name
        first_air_date
        poster_path
        media_type
        vote_average
      }
  }
}
`;

export const GET_MOVIE = gql`
        query GetMovie($id: Int!) {
            movie(id: $id) {
                title
                overview
                poster_path
                release_date
                vote_average
            }
        }
    `;

export const GET_CAST = gql`
query GetCast($id: Int!, $type: String!) {
    credits(id: $id, type: $type) {
      id,
      name,
      profile_path,
      character
    }
  }
`

export const GET_TV_SERIES = gql`
query GetTvSeries($id: Int!) {
    tvseries(id: $id) {
        name
        overview
        poster_path
        vote_average
        first_air_date
        number_of_episodes
        number_of_seasons
    }
}
`;

export const ME = gql`
  query Me {
    me {
      username
    }
  }
`;