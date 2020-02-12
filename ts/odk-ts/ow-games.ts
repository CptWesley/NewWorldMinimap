type GetGameDBInfoResult = overwolf.games.GetGameDBInfoResult
type RunningGameInfo = overwolf.games.RunningGameInfo

export class OWGames {
	public static getRunningGameInfo(): Promise<RunningGameInfo> {
    return new Promise<RunningGameInfo>((resolve) => {
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
    Promise<GetGameDBInfoResult> {

    return new Promise<GetGameDBInfoResult>((resolve) => {
      overwolf.games.getGameDBInfo(gameClassId, resolve);
    });
  }
}
