export function numberPadStart(num: number, targetLength: number, fillString: string = '0') {
  return num.toString().padStart(targetLength, fillString)
}

export function getEpisodeKey(episode: { season_number: number, episode_number: number }) {
  return `S${numberPadStart(episode.season_number, 2)}E${numberPadStart(episode.episode_number, 2)}`
}
