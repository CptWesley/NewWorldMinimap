export class OWGames {
	public static getRunningGameInfo(): Promise<overwolf.games.RunningGameInfo> {
    return new Promise((resolve) => {
      overwolf.games.getRunningGameInfo(resolve);
    })
  }

  public static classIdFromGameId(gameId: number): number {
    let classId = Math.floor(gameId / 10);
    return classId;
  }

  public static async getRecentlyPlayedGames(limit: number = 3):
    Promise<number[]|null> {

    return new Promise<number[]|null>((resolve) => {
      if (!overwolf.games.getRecentlyPlayedGames) {
        return resolve(null);
      }

      overwolf.games.getRecentlyPlayedGames(limit, result => {
        resolve(result.games);
      });
    })
  }

  public static async getGameDBInfo(gameClassId: number):
    Promise<overwolf.games.GetGameDBInfoResult> {

    return new Promise<overwolf.games.GetGameDBInfoResult>((resolve) => {
      overwolf.games.getGameDBInfo(gameClassId, resolve);
    });
  }
}
