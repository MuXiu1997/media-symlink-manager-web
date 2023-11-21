export interface TvListItem {
  tmdb_id: number
  name: string
  year: number
  created_at: string
}

export interface Tv {
  tmdb_id: number
  name: string
  year: number
  tmdb_tv: TmdbTv
  tmdb_seasons: Array<TmdbSeason>
  filepath_mapping: {
    base_dir: string
    mappings: Record<string, string>
    locked_keys: Array<string>
  }
  created_at: string
}

export interface TmdbSeasonEpisode {
  name: string
  season_number: number
  episode_number: number
}

export interface TmdbSeason {
  name: string
  season_number: number
  episodes: Array<TmdbSeasonEpisode>
}

export interface TmdbTv {
  id: number
  name: string
  overview: string
  first_air_date: string // yyyy-mm-dd
  poster_path?: string | null
}

export interface FSItem {
  name: string
  abs_path: string
  is_dir: boolean
}
