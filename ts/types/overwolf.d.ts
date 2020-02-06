/* ******************************************************************************** */
// IMPORTANT NOTICE
// Currently, the Overwolf SDK is written in javascript. This file holds type definitions
// for the SDK methods overwolf offers. We are constantly working on improving our SDK and
// this file will be released as a proper stand-alone package in the future.
/* ******************************************************************************** */

declare namespace overwolf {
  const version: string;

  enum ResultStatusTypes {
    Success = "success",
    Error = "error"
  }

  interface Result {
    /**
     * Whether the method executed successfully or not.
     */
    success: boolean;
    /**
     * Information regarding the error (if an error occured)
     */
    error?: string;
  }

  interface Event<T> {
    /**
     * Registers a listener to an event. When the event occurs, all registered
     * listeners are called.
     * @param callback The callback function to call when the event occurs.
     */
    addListener(callback: (event: T) => void): void;
    /**
     * Unregister a listener to an event.
     * @param callback The callback should be the same function that was passed
     * to addListener(). If an anonymous function was passed, it cannot be
     * removed.
     */
    removeListener(callback: (event: T) => void): void;
  }

  interface Dictionary<T> {
    [key: string]: T;
  }

  type CallbackFunction<T extends Result> = (result: T) => void;
}

declare namespace overwolf.io {
  namespace enums {
    const enum eEncoding {
      UTF8 = "UTF8",
      UTF8BOM = "UTF8DOM",
      Unicode = "UNICODE",
      UnicodeBOM = "UnicodeBOM",
      ASCII = "ASCII"
    }
  }

  interface FileExistsResult extends Result {
    found?: boolean;
  }

  interface ReadFileContentsResult extends Result {
    content?: string;
  }

  /**
   * Checks for the existance of the file in the given path.
   * @param filePath The path to check for.
   * @param callback Returns with the result.
   */
  function fileExists(
    filePath: string,
    callback: CallbackFunction<FileExistsResult>
  ): void;

  /**
   * Writes the content to the target file. If the file doesn't exist, it will
   * be created, along with any needed directories along the path. Otherwise,
   * the file's content will be overwritten.
   * @param filePath The full path of the file to write to.
   * @param content The content to write.
   * @param encoding The encoding to use, see more at
   * @param triggerUacIfRequired If additional permissions are required, allows
   * the triggering of the Windows UAC dialog.
   * @param callback Called with the status of the request.
   */
  function writeFileContents(
    filePath: string,
    content: string,
    encoding: enums.eEncoding,
    triggerUacIfRequired: boolean,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Read the content to the target file.
   * @param filePath The full path of the file to write to.
   * @param encoding The encoding to use, see more at
   * @param callback Called with the status of the request and the file contect.
   */
  function readFileContents(
    filePath: string,
    encoding: enums.eEncoding,
    callback: CallbackFunction<ReadFileContentsResult>
  ): void;

  /**
   * Copy a file from the local extension directory to a destination on the
   * localmachine.
   * @param src a relative (to the root of your extension's folder) file path or
   * a full overwolf-extension:// URI to the source file to be copied
   * @param dst The destination path (including filename) to copy to.
   * @param overrideFile true if you want an existing file to be overriden,
   * false otherwise.
   * @param reserved for future use.
   * @param callback result callback.
   */
  function copyFile(
    src: string,
    dst: string,
    overrideFile: boolean,
    reserved: boolean,
    callback: CallbackFunction<Result>
  ): void;
}

declare namespace overwolf.media {
  namespace enums {
    /**
     * Media type for the Media Event.
     */
    const enum eMediaType {
      Video = "Video",
      Image = "Image"
    }
  }

  interface RescaleParams {
    width: number;
    height: number;
  }

  interface CropParams {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  interface MemoryScreenshotParams {
    roundAwayFromZero: boolean;
    rescale: RescaleParams;
    crop: CropParams;
  }

  interface FileResult extends Result {
    url?: string;
    path?: string;
  }

  interface GetAppVideoCaptureFolderSizeResult extends Result {
    totalVideosSizeMB?: number;
  }

  interface GetAppScreenCaptureFolderSizeResult extends Result {
    screenCaptureSizeMB?: number;
  }

  interface ScreenshotTakenEvent {
    url: string;
  }

  interface GifGenerationErrorEvent {
    reason: string;
  }

  /**
   * Takes a screenshot and calls the callback with the success status and the
   * screenshot URL. The screenshot is saved to the screenshots folder.
   * @param callback A function called after the screenshot was taken.
   */
  function takeScreenshot(callback: CallbackFunction<FileResult>): void;

  /**
   * Takes a screenshot and calls the callback with the success status and the
   * screenshot URL. The screenshot is saved to the screenshots folder.
   * @param targetFolder Target screen shot folder path.
   * @param callback A function called after the screenshot was taken.
   */
  function takeScreenshot(
    targetFolder: string,
    callback: CallbackFunction<FileResult>
  ): void;

  /**
   * Takes a window screenshot and calls the callback with the success status
   * and the screenshot URL. The screenshot is saved to the screenshots folder.
   * @param windowHandle The window Name
   * @param postMediaEvent set true to posr media event (onMediaEvent)
   * @param targetFolder set target folder path to screen shot
   * @param callback A function called after the screenshot was taken.
   */
  function takeWindowsScreenshotByHandle(
    windowHandle: number,
    postMediaEvent: boolean,
    targetFolder: string,
    callback: CallbackFunction<FileResult>
  ): void;

  /**
   * Takes a window screenshot and calls the callback with the success status
   * and the screenshot URL. The screenshot is saved to the screenshots folder.
   * @param windowHandle The window Name
   * @param postMediaEvent set true to posr media event (onMediaEvent)
   * @param callback A function called after the screenshot was taken.
   */
  function takeWindowsScreenshotByHandle(
    windowHandle: number,
    postMediaEvent: boolean,
    callback: CallbackFunction<FileResult>
  ): void;

  /**
   * Takes a window screenshot and calls the callback with the success status
   * and the screenshot URL. The screenshot is saved to the screenshots folder.
   * @param windowName The window Name
   * @param postMediaEvent set true to posr media event (onMediaEvent)
   * @param targetFolder set target folder path to screen shot
   * @param callback A function called after the screenshot was taken.
   */
  function takeWindowsScreenshotByName(
    windowName: string,
    postMediaEvent: boolean,
    targetFolder: string,
    callback: CallbackFunction<FileResult>
  ): void;

  /**
   * Takes a window screenshot and calls the callback with the success status
   * and the screenshot URL. The screenshot is saved to the screenshots folder.
   * @param windowName The window Name
   * @param postMediaEvent set true to posr media event (onMediaEvent)
   * @param callback A function called after the screenshot was taken.
   */
  function takeWindowsScreenshotByName(
    windowName: string,
    postMediaEvent: boolean,
    callback: CallbackFunction<FileResult>
  ): void;

  /**
   * Takes a memory screenshot and calls the callback with the success status
   * and the screenshot URL. The screenshot will only be placed in the memory
   * and will not be saved to a file (better performance). Can only be used
   * while in a game.
   * @param screenshotParams A JSON containing the parameters of the screenshot.
   * @param callback A function called after the screenshot was taken.
   */
  function getScreenshotUrl(
    screenshotParams: MemoryScreenshotParams,
    callback: CallbackFunction<FileResult>
  ): void;

  /**
   * Opens the social network sharing console to allow the user to share a
   * picture.
   * @param image A URL or image object to be shared.
   * @param description The description to be used when posting to social
   * networks.
   * @param callback A function called after the image was shared.
   */
  function shareImage(
    image: any,
    description: string,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Posts a media event for other apps to receive. The time info should be
   * received in UTC format.
   * @param mediaType The type of the event.
   * @param jsonInfo A json with additional info about the event.
   * @param callback A callback with the status if the call.
   */
  function postMediaEvent(
    mediaType: enums.eMediaType,
    jsonInfo: any,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Deletes all gifs created by this app with an option to keep the newest X
   * GBs (use with care).
   * @param keepNewestXGbs Keep the newest X GBs of gifs. Pass 0 to delete all
   * gifs.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function deleteOldGifs(
    keepNewestXGbs: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Returns the total size of the gif files created by this app in gigabytes.
   * @param callback A callback with the gifs size.
   */
  function getGifsSize(callback: CallbackFunction<Result>): void;

  /**
   * Returns the total size of the video capture folder created by the app. This
   * includes all video/thumbnail and other filesthat are under the apps video
   * folder - which is locatedinside the configured Overwolf video capture
   * folder. NOTE: this function can take a long time to return if the folder
   * contains a large amount of files (on some computers) - therefore,try to
   * reduce the amount of times you call it.
   * @param callback A callback with the size in MB.
   */
  function getAppVideoCaptureFolderSize(
    callback: CallbackFunction<GetAppVideoCaptureFolderSizeResult>
  ): void;

  /**
   * Similar to |getAppVideoCaptureFolderSize| but looks at the appsscreen
   * capture folder.
   * @param callback A callback with the size in MB.
   */
  function getAppScreenCaptureFolderSize(
    callback: CallbackFunction<GetAppScreenCaptureFolderSizeResult>
  ): void;

  /**
   * Fired when a media event has been posted.
   */
  const onMediaEvent: Event<any>;

  /**
   * Fired when a screenshot was taken.
   */
  const onScreenshotTaken: Event<ScreenshotTakenEvent>;

  /**
   * Fired when there's an error with the gif generation buffer.
   */
  const onGifGenerationError: Event<GifGenerationErrorEvent>;
}

declare namespace overwolf.media.audio {
  type PlayState = "playing" | "stopped" | "paused";

  interface CreateResult extends Result {
    id?: string;
  }

  interface PlayStateChangedEvent {
    id: string;
    playback_state: PlayState;
  }

  /**
   * Creates an audio file from local path, extension local path or a remote
   * Url.
   * @param url The path of a local audio file, a url to a remote one or an
   * extension url (overwolf-extension://app-id/file). Notice that if the url
   * doesn't contain a file extension, mp3 will be assumed as the extension.
   * @param callback A callback function which will be called with the ID of the
   * created audio file.
   */
  function create(url: string, callback: CallbackFunction<CreateResult>): void;

  /**
   * Plays the audio file matching the supplied ID.
   * @param id The ID of the audio file to be played.
   * @param callback A callback function which will be called with the status of
   * the play request.
   */
  function play(id: string, callback: CallbackFunction<Result>): void;

  /**
   * Stops the playback.
   * @param callback A callback function which will be called with the status of
   * the stop request.
   */
  function stop(callback: CallbackFunction<Result>): void;

  /**
   * Stops the playback.
   * @param id The ID of the audio file.
   * @param callback A callback function which will be called with the status of
   * the stop request.
   */
  function stopById(id: string, callback: CallbackFunction<Result>): void;

  /**
   * Pauses the playback.
   * @param callback A callback function which will be called with the status of
   * the pause request.
   */
  function pause(callback: CallbackFunction<Result>): void;

  /**
   * Pauses the playback of a specific sound.
   * @param id The ID of the audio file.
   * @param callback A callback function which will be called with the status of
   * the pause request.
   */
  function pauseById(id: string, callback: CallbackFunction<Result>): void;

  /**
   * Resumes the playback.
   * @param callback A callback function which will be called with the status of
   * the resume request.
   */
  function resume(callback: CallbackFunction<Result>): void;

  /**
   * Resumes the playback of a specific file.
   * @param id The ID of the audio file.
   * @param callback A callback function which will be called with the status of
   * the resume request.
   */
  function resumeById(id: string, callback: CallbackFunction<Result>): void;

  /**
   * Sets the playback volume.
   * @param volume The desired volume. The volume range is 0 - 100 where a
   * volume of 0 means mute.
   * @param callback A callback function which will be called with the status of
   * the stop request.
   */
  function setVolume(volume: number, callback: CallbackFunction<Result>): void;

  /**
   * Sets the playback volume of a specific file.
   * @param id The ID of the audio file.
   * @param volume The desired volume. The volume range is 0 - 100 where a
   * volume of 0 means mute.
   * @param callback A callback function which will be called with the status of
   * the stop request.
   */
  function setVolumeById(
    id: string,
    volume: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Fired when the state of the playback is changed.
   */
  const onPlayStateChanged: Event<PlayStateChangedEvent>;
}

declare namespace overwolf.media.videos {
  interface VideoCompositionSegment {
    startTime: number;
    endTime: number;
  }

  interface GetVideosResult extends Result {
    videos?: string[];
  }

  interface GetVideosSizeResult extends Result {
    totalSizeGbs?: number;
  }

  /**
   * Creates a compilation video out of a source video and a list of segments.
   * @param sourceVideoUrl The url of the source video in an overwolf://media
   * form.
   * @param segments A JSON containing a list of segments, each segment has a
   * start time and an end time in milliseconds. The segments must be sorted in
   * acsending order. Example:
   * {
   *   "segments": [
   *     { "startTime": 2000, "endTime": 4000 },
   *     { "startTime": 8000, "endTime": 10000 },
   *     { "startTime": 14000, "endTime": 18000 }
   *   ]
   * }
   * @param callback A callback function which will be called with the status of
   * the request and the url to the target video.
   */
  function createVideoComposition(
    sourceVideoUrl: string,
    segments: { segments: VideoCompositionSegment[] },
    callback: CallbackFunction<FileResult>
  ): void;

  /**
   * Creates a compilation video out of a source video and a list of segments.
   * @param files list of files to ccomposit to output video file
   * (overwolf://media form. or file:///)
   * @param outputFile the file output name
   * @param callback A callback function which will be called with the status of
   * the request and the url to the target video.
   */
  function createVideoCompositionFiles(
    files: string[],
    outputFile: string,
    callback: CallbackFunction<FileResult>
  ): void;

  /**
   * Gets a list of all of the videos created by this app.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function getVideos(callback: CallbackFunction<GetVideosResult>): void;

  /**
   * Returns the total size of the video files created by this app in gigabytes.
   * @param callback A callback with the videos size.
   */
  function getVideosSize(callback: CallbackFunction<GetVideosSizeResult>): void;

  /**
   * Deletes all videos created by this app with an option to keep the newest X
   * GBs (use with care).
   * @param keepNewestXGbs Keep the newest X GBs of videos. Pass 0 to delete all
   * videos.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function deleteOldVideos(
    keepNewestXGbs: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Deletes a specific video created by this app.
   * @param videoUrl The Overwolf URL of the video to delete.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function deleteVideo(
    videoUrl: string,
    callback: CallbackFunction<Result>
  ): void;
}

declare namespace overwolf.media.replays {
  namespace enums {
    const enum ReplayType {
      Video = "Video",
      Gif = "Gif"
    }
  }

  /**
   * Replays settings container.
   */
  interface ReplaysSettings extends streaming.StreamSettings {
    /**
     * Auto highlights configuration.
     */
    highlights: ReplayHighlightsSetting;
  }

  /**
   * Auto highlights settings.
   */
  interface ReplayHighlightsSetting {
    /**
     * Enable auto Highlights recording.
     */
    enable: boolean;
    /**
     * Array of requested highlights.
     * use ["*"] to register all features.
     */
    requireHighlights: string;
  }

  interface TurnOffResult extends Result {
    description?: string;
    metadata?: string;
    osVersion?: string;
    osBuild?: string;
  }

  interface TurnOnResult extends Result {
    description?: string;
    metadata?: string;
    mediaFolder?: string;
    osVersion?: string;
    osBuild?: string;
  }

  interface GetStateResult extends Result {
    isOn?: boolean;
  }

  interface ReplayResult extends Result {
    url?: string;
    path?: string;
    encodedPath?: string;
    duration?: number;
    thumbnail_url?: string;
    thumbnail_path?: string;
    thumbnail_encoded_path?: string;
    start_time?: number;
  }

  interface CaptureErrorEvent {
    error: string;
    reason: string;
    additionalInfo: string;
  }

  interface CaptureStoppedEvent {
    status: string;
    reason: string;
    metaData: string;
    osVersion: string;
    osBuild: string;
  }

  interface CaptureWarningEvent {
    warning: string;
    reason: string;
  }

  interface ReplayServicesStartedEvent {
    extensions: string[];
  }

  interface onHighlightsCapturedEvent {
    game_id: number;
    match_id: string;
    match_internal_id: string;
    session_id: string;
    session_start_time: string;
    match_start_time: string;
    start_time: string;
    duration: string;
    events: string[];
    raw_events: raw_events[];
    media_url: string;
    media_path_encoded: string;
    thumbnail_url: string;
    thumbnail_encoded_path: string;
    replay_video_start_time: number;
  }

  interface raw_events {
    type: string;
    time: number;
  }

  /**
   * Turns off background replay capturing. Call this as soon as you no longer
   * interesting in capturing, in order to free up resources.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function turnOff(callback: CallbackFunction<TurnOffResult>): void;

  /**
   * Turns on background replay capturing. Without calling it first, you will
   * not be able to create video replays. Notice that turning on replay
   * capturing will consume system resources so use it wisely.buffer_length
   * defines the amount of time in milliseconds to have captured in the memory
   * at all times.
   * @param settings The video capture settings.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function turnOn(
    settings: ReplaysSettings,
    callback: CallbackFunction<TurnOnResult>
  ): void;

  /**
   * Returns whether replay capturing is turned on or off.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function getState(callback: CallbackFunction<GetStateResult>): void;

  /**
   * Returns whether replay capturing is turned on or off.
   * @param replayType The type of replay to get state for.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function getState(
    replayType: replays.enums.ReplayType,
    callback: CallbackFunction<GetStateResult>
  ): void;

  /**
   * Starts capturing a replay to a file. A replay id will be returned in the
   * callback which is needed to finish capturing the replay. You can only call
   * this method if replay mode is on and no other replay is currently being
   * captured to a file.
   * @param pastDuration The replay lengh, in milliseconds to include prior to
   * the time of this call.
   * @param futureDuration The replay lengh, in milliseconds to include after
   * the time of this call. To ignore it, simply give it a non-positive value
   * @param captureFinishedCallback A callback function which will be called
   * when capturing is finished, at the end of the future duration supplied to
   * this call.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function capture(
    pastDuration: number,
    futureDuration: number,
    captureFinishedCallback: CallbackFunction<ReplayResult>,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Starts capturing a replay to a file. A replay id will be returned in the
   * callback which is needed to finish capturing the replay. You can only call
   * this method if replay mode is on and no other replay is currently being
   * captured to a file.
   * @param replayType The type of replay to capture.
   * @param pastDuration The replay lengh, in milliseconds to include prior to
   * the time of this call.
   * @param futureDuration The replay lengh, in milliseconds to include after
   * the time of this call. To ignore it, simply give it a non-positive value
   * @param captureFinishedCallback A callback function which will be called
   * when capturing is finished, at the end of the future duration supplied to
   * this call.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function capture(
    replayType: replays.enums.ReplayType,
    pastDuration: number,
    futureDuration: number,
    captureFinishedCallback: CallbackFunction<ReplayResult>,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Starts capturing a replay to a file. A replay id will be returned in the
   * callback which is needed to finish capturing the replay. You can only call
   * this method if replay mode is on and no other replay is currently being
   * captured to a file.
   * @param pastDuration The video lengh, in milliseconds to include prior to
   * the time of this call.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function startCapture(
    pastDuration: number,
    callback: CallbackFunction<FileResult>
  ): void;

  /**
   * Starts capturing a replay to a file. A replay id will be returned in the
   * callback which is needed to finish capturing the replay. You can only call
   * this method if replay mode is on and no other replay is currently being
   * captured to a file.
   * @param replayType The type of replay to capture.
   * @param pastDuration The video lengh, in milliseconds to include prior to
   * the time of this call.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function startCapture(
    replayType: replays.enums.ReplayType,
    pastDuration: number,
    callback: CallbackFunction<FileResult>
  ): void;

  /**
   * Finishes capturing a replay and returns a url to the created video file.
   * You can only call this method if replay mode is on and using a valid id of
   * a replay being captured to a file.
   * @param replayId The id of the replay you want to finish capturing.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function stopCapture(
    replayId: string,
    callback: CallbackFunction<ReplayResult>
  ): void;

  /**
   * Finishes capturing a replay and returns a url to the created video file.
   * You can only call this method if replay mode is on and using a valid id of
   * a replay being captured to a file.
   * @param replayType The type of replay to stop capture.
   * @param replayId The id of the replay you want to finish capturing.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function stopCapture(
    replayType: replays.enums.ReplayType,
    replayId: string,
    callback: CallbackFunction<FileResult>
  ): void;

  /**
   * change target sub folder of current running replay provider
   * @param replayType The type of replay to stop capture.
   * @param subFolderName the new sub folder name
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function setReplaysSubFolder(
    replayType: replays.enums.ReplayType,
    subFolderName: string,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Fired when an error has occurred with the capturing.
   */
  const onCaptureError: Event<CaptureErrorEvent>;

  /**
   * Fired when replay service is stopped.
   */
  const onCaptureStopped: Event<CaptureStoppedEvent>;

  /**
   * Fired on capture service warning.
   */
  const onCaptureWarning: Event<CaptureWarningEvent>;

  /**
   * Fired when an replay serive is on (any other app);
   */
  const onReplayServicesStarted: Event<ReplayServicesStartedEvent>;

  /**
   * Fired when a new Replay highlight recorded (when highlightsSetting is enabled).
   */
  const onHighlightsCapturedEvent: Event<onHighlightsCapturedEvent>;

}

declare namespace overwolf.profile {
  const enum ConnectionState {
    Unknown = "Unknown",
    Offline = "Offline",
    Connecting = "Connecting",
    Online = "Online",
    Disconnecting = "Disconnecting"
  }

  interface GetCurrentUserResult extends Result {
    avatar?: string;
    channel?: string;
    machineId?: string;
    partnerId?: number;
    userId?: string;
    username?: string;
    parameters?: Dictionary<string>;
    installParams?: any;
  }

  interface LoginStateChangedEvent {
    status: string;
    connectionState: ConnectionState;
    username: string;
  }

  /**
   * Calls the given callback with the currently logged-in Overwolf user.
   * @param callback A function called with the current user, or an error.
   */
  function getCurrentUser(
    callback: CallbackFunction<GetCurrentUserResult>
  ): void;

  /**
   * Opens the login dialog.
   */
  function openLoginDialog(): void;

  /**
   * Fired when a user logged in or logged out.
   */
  const onLoginStateChanged: Event<LoginStateChangedEvent>;
}

declare namespace overwolf.profile.subscriptions {

  const enum eState {
    Active = 0,
    Cancelled = 1,
    Revoked = 2
  }

  interface Info {
    title: string;
    description: string;
    periodMonths: number;
    price: number;
  }

  interface Subscription {
    id: number;
    pid: number;
    uid: string;
    extid: string;
    muid: string;
    exp: number;
    grc: number;
    state: eState;
    planInfo: Info;
    expired: boolean;
  }

  interface GetActivePlansResult extends Result {
    plans?: number[];
  }

  interface SubscriptionChangedEvent {
    plans?: number[];
  }

  /**
   * Returns active subscriptions for the calling extension via callback.
   * @param callback Returns an array of plan IDs, or an error.
   */
  function getActivePlans(
    callback: CallbackFunction<GetActivePlansResult>
  ): void;

  /**
   * Fired when current extension subscription has changed.
   */
  const onSubscriptionChanged: Event<SubscriptionChangedEvent>;
}

declare namespace overwolf.windows {
  namespace enums {
    const enum WindowStyle {
      InputPassThrough = "InputPassThrough"
    }

    const enum WindowDragEdge {
      None = "None",
      Left = "Left",
      Right = "Right",
      Top = "Top",
      Bottom = "Bottom",
      TopLeft = "TopLeft",
      TopRight = "TopRight",
      BottomLeft = "BottomLeft",
      BottomRight = "BottomRight"
    }

    const enum MessagePromptIcon {
      None = "None",
      QuestionMark = "QuestionMark",
      ExclamationMark = "ExclamationMark"
    }
  }

  interface WindowInfo {
    name: string;
    id: string;
    state: string;
    stateEx: "closed" | "minimized" | "hidden" | "normal" | "maximized";
    isVisible: boolean;
    left: number;
    top: number;
    width: number;
    height: number;
  }

  interface WindowProperties {
    nativeWindow: boolean;
    enablePopupBlocker: boolean;
  }

  interface ODKRect {
    top: number;
    left: number;
    width: number;
    height: number;
  }

  interface SetWindowPositionProperties {
    relativeTo: { processName: string; windowTitle: string };
    insertAbove: boolean;
  }

  interface MessageBoxParams {
    message_title: string;
    message_body: string;
    confirm_button_text: string;
    cancel_button_text: string;
    message_box_icon: windows.enums.MessagePromptIcon;
  }

  interface WindowResult extends Result {
    window: WindowInfo;
  }

  interface DragResizeResult extends Result {
    id?: string;
    width?: number;
    height?: number;
  }

  interface WindowIdResult extends Result {
    window_id?: string;
  }

  interface GetWindowStateResult extends Result {
    window_id?: string;
    window_state?: WindowState;
  }

  const enum WindowState {
    CLOSED = 'closed',
    MAXIMIZED = 'maximized',
    MINIMIZED = 'minimized',
    HIDDEN = 'hidden',
    NORMAL = 'normal',
    DOES_NOT_EXIST = 'does not exist'
  }

  interface GetWindowsStatesResult extends Result {
    result: Dictionary<WindowState>;
  }

  interface IsMutedResult extends Result {
    muted: boolean;
  }

  interface IsWindowVisibleToUserResult extends Result {
    visible: "hidden" | "full" | "partial";
  }

  interface IsAccelreatedOSRResult extends WindowIdResult {
    accelerated?: boolean;
    supported?: boolean;
    optimized?: boolean;
  }

  interface WindowStateChangedEvent {
    window_id: string;
    window_state: string;
    window_previous_state: string;
    window_state_ex: string;
    wondow_previous_state_ex: string;
    app_id: string;
    window_name: string;
  }

  interface MessageReceivedEvent {
    id: string;
    content: any;
  }

  interface IsolatedIframeProcessCrashedEvent {
    id: string;
    error: string;
  }

  interface AltF4BlockedEvent {
    id: string;
  }

  /**
   * Calls the given callback function with the current window object as a
   * parameter.
   * @param callback A callback function which will be called with the current
   * window object as a parameter. See
   */
  function getCurrentWindow(callback: CallbackFunction<WindowResult>): void;

  /**
   * Creates or returns a window by the window name that was declared in the
   * manifest.
   * @param windowName The name of the window that was declared in the
   * data.windows section in the manifest.
   * @param overrideSetting Override manifest settings
   * @param callback A callback function which will be called with the requested
   * window as a parameter. See
   */
  function obtainDeclaredWindow(
    windowName: string,
    overrideSetting: WindowProperties,
    callback: CallbackFunction<WindowResult>
  ): void;

  /**
   * Creates or returns a window by the window name that was declared in the
   * manifest.
   * @param windowName The name of the window that was declared in the
   * data.windows section in the manifest.
   * @param callback A callback function which will be called with the requested
   * window as a parameter.
   */
  function obtainDeclaredWindow(
    windowName: string,
    callback: CallbackFunction<WindowResult>
  ): void;

  /**
   * Creates an instance of your window (the window’s name has to be declared
   * in the manifest.json) or returns a window by the window name.
   * @param windowName The name of the window that was declared in the
   * data.windows section in the manifest.
   * @param useDefaultSizeAndLocation Enable the manifest size and position
   * settings (default is false).
   * @param callback A callback function which will be called with the requested
   * window as a parameter.
   */
  function obtainDeclaredWindow(
    windowName: string,
    useDefaultSizeAndLocation: boolean,
    callback: CallbackFunction<WindowResult>
  ): void;

  /**
   * Start dragging a window.
   * @param windowId The id or name of the window to drag.
   * @param callback A callback which is called when the drag is completed.
   */
  function dragMove(
    windowId: string,
    callback?: CallbackFunction<WindowIdResult>
  ): void;

  /**
   * Start resizing the window from a specific edge or corner.
   * @param windowId The id or name of the window to resize.
   * @param edge The edge or corner from which to resize the window.
   */
  function dragResize(
    windowId: string,
    edge: windows.enums.WindowDragEdge
  ): void;

  /**
   * Start resizing the window from a specific edge or corner.
   * @param windowId The id or name of the window to resize.
   * @param edge The edge or corner from which to resize the window.
   * @param contentRect The real content of the window (for the ingame drwing
   * resizing white area)
   */
  function dragResize(
    windowId: string,
    edge: windows.enums.WindowDragEdge,
    contentRect: ODKRect
  ): void;

  /**
   * Start resizing the window from a specific edge or corner.
   * @param windowId The id or name of the window to resize.
   * @param edge The edge or corner from which to resize the window.
   * @param callback Will be called when the resizing process is completed.
   */
  function dragResize(
    windowId: string,
    edge: windows.enums.WindowDragEdge,
    rect: ODKRect,
    callback: CallbackFunction<DragResizeResult>
  ): void;

  /**
   * Changes the window size to the new width and height, in pixels.
   * @param windowId The id or name of the window for which to change the size.
   * @param width The new window width in pixels.
   * @param height The new window height in pixels.
   * @param callback A callback which is called when the size change is
   * completed.
   */
  function changeSize(
    windowId: string,
    width: number,
    height: number,
    callback?: CallbackFunction<Result>
  ): void;

  /**
   * Changes the window position in pixels from the top left corner.
   * @param windowId The id or name of the window for which to change the
   * position.
   * @param left The new window position on the X axis in pixels from the left.
   * @param top The new window position on the Y axis in pixels from the top.
   * @param callback A callback which is called when the position change is
   * completed.
   */
  function changePosition(
    windowId: string,
    left: number,
    top: number,
    callback?: CallbackFunction<WindowIdResult>
  ): void;

  /**
   * Closes the window.
   * @param windowId The id or name of the window to close.
   * @param callback Called after the window is closed.
   */
  function close(
    windowId: string,
    callback?: CallbackFunction<WindowIdResult>
  ): void;

  /**
   * Minimizes the window.
   * @param windowId The id or name of the window to minimize.
   * @param callback Called after the window is minimized.
   */
  function minimize(
    windowId: string,
    callback?: CallbackFunction<WindowIdResult>
  ): void;

  /**
   * Hides the window.
   * @param windowId The id or name of the window to hide.
   * @param callback Called after the window is hidden.
   */
  function hide(
    windowId: string,
    callback?: CallbackFunction<WindowIdResult>
  ): void;

  /**
   * Maximizes the window.
   * @param windowId The id or name of the window to maximize.
   * @param callback Called after the window is maximized.
   */
  function maximize(
    windowId: string,
    callback?: CallbackFunction<WindowIdResult>
  ): void;

  /**
   * Restores a minimized window.
   * @param windowId The id or name of the window to restore.
   * @param callback Called after the window is restored.
   */
  function restore(
    windowId: string,
    callback?: CallbackFunction<WindowIdResult>
  ): void;

  /**
   * Returns the state of the window (normal/minimized/maximized/closed).
   * @param windowId The id or name of the window.
   * @param callback Called with the window state.
   */
  function getWindowState(
    windowId: string,
    callback: CallbackFunction<GetWindowStateResult>
  ): void;

  /**
   * Returns the state of all windows owned by the app
   * (normal/minimized/maximized/closed).
   * @param callback Called with an array containing the states of the windows.
   */
  function getWindowsStates(
    callback: CallbackFunction<GetWindowsStatesResult>
  ): void;

  /**
   * Sends a message to an open window.
   * @param windowId The id or name of the window to send the message to.
   * @param messageId A message id.
   * @param messageContent The content of the message.
   * @param callback Called with the status of the request
   */
  function sendMessage(
    windowId: string,
    messageId: string,
    messageContent: any,
    callback: CallbackFunction<WindowIdResult>
  ): void;

  /**
   * Returns an array of all open windows as objects. The objects can be
   * manipulated like anyother window.
   * @param callback A callback function which will be called with a map object
   * of (window-name, Window Object) items
   */
  function getOpenWindows(
    callback: (windows: Dictionary<Window>) => void
  ): void;

  /**
   * Returns a window object of the index page.
   */
  function getMainWindow(): Window;

  /**
   * Opens the options page specified in the manifest file. Does nothing if no
   * such page has been specified.
   * @param callback
   */
  function openOptionsPage(callback: CallbackFunction<WindowIdResult>): void;

  /**
   * Add Window In Game styling
   * @param windowId The id or name of the window to send the message to.
   * @param style The style to add : overwolf.windows.enum.WindowStyle
   * @param callback Called with the status of the request
   */
  function setWindowStyle(
    windowId: string,
    style: windows.enums.WindowStyle,
    callback: CallbackFunction<WindowIdResult>
  ): void;

  /**
   * Remove Window In Game Styling
   * @param windowId The id or name of the window to send the message to.
   * @param style The style to add : overwolf.windows.enum.WindowStyle
   * @param callback Called with the status of the request
   */
  function removeWindowStyle(
    windowId: string,
    style: windows.enums.WindowStyle,
    callback: CallbackFunction<WindowIdResult>
  ): void;

  /**
   * Sets whether the window should be injected to games or not.
   * @param windowId
   * @param shouldBeDesktopOnly
   * @param callback
   */
  function setDesktopOnly(
    windowId: string,
    shouldBeDesktopOnly: boolean,
    callback: CallbackFunction<WindowIdResult>
  ): void;

  /**
   * Sets whether the window should have minimize/restore animations while in
   * game.
   * @param windowId
   * @param shouldEnableAnimations
   * @param callback
   */
  function setRestoreAnimationsEnabled(
    windowId: string,
    shouldEnableAnimations: boolean,
    callback: CallbackFunction<WindowIdResult>
  ): void;

  /**
   * Change the window's topmost status. Handle with care as topmost windows can
   * negatively impact user experience.
   * @param windowId
   * @param shouldBeTopmost
   * @param callback
   */
  function setTopmost(
    windowId: string,
    shouldBeTopmost: boolean,
    callback: CallbackFunction<WindowIdResult>
  ): void;

  /**
   * Sends the window to the back.
   * @param windowId The id or name of the window.
   * @param callback Called with the result of the request.
   */
  function sendToBack(
    windowId: string,
    callback: CallbackFunction<WindowIdResult>
  ): void;

  /**
   * Brings the requested window to the front.
   * @param windowId The id or name of the window.
   * @param callback Called with the result of the request.
   */
  function bringToFront(
    windowId: string,
    callback: CallbackFunction<WindowIdResult>
  ): void;

  /**
   * Brings this window to the front.
   * @param callback Called with the result of the request.
   */
  function bringToFront(callback: CallbackFunction<WindowIdResult>): void;

  /**
   * Brings this window to the front.
   * @param grabFocus Window will take system focus.
   * @param callback Called with the result of the request.
   */
  function bringToFront(
    grabFocus: boolean,
    callback: CallbackFunction<WindowIdResult>
  ): void;

  /**
   * Brings the requested window to the front.
   * @param windowId The id or name of the window.
   * @param grabFocus Window will take system focus.
   * @param callback Called with the result of the request.
   */
  function bringToFront(
    windowId: string,
    grabFocus: boolean,
    callback: CallbackFunction<WindowIdResult>
  ): void;

  /**
   * Change window position (see SetWindowPositionProperties))
   * @param windowId The id or name of the window
   * @param properties where to place window
   * @param callback Called with the result of the request.
   */
  function setPosition(
    windowId: string,
    properties: SetWindowPositionProperties,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Change this window position (see SetWindowPositionProperties))
   * @param properties where to place window
   * @param callback Called with the result of the request.
   */
  function setPosition(
    properties: SetWindowPositionProperties,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Displays a customized popup message prompt.
   * @param messageParams The type and texts that the message prompt will have.
   * @param callback The user action.
   */
  function displayMessageBox(
    messageParams: MessageBoxParams,
    callback: (confirmed: boolean) => void
  ): void;

  /**
   * Set current window Mute state.
   * @param mute window mute (on\off).
   * @param callback Called with the result of the request.
   */
  function setMute(mute: boolean, callback: CallbackFunction<Result>): void;

  /**
   * Mute all sound source include all excluded white list
   * @param callback Called with the result of the request.
   */
  function muteAll(callback: CallbackFunction<Result>): void;

  /**
   * Is window muted.
   * @param callback Called with the result of the request ({"muted": nool}).
   */
  function isMuted(callback: CallbackFunction<IsMutedResult>): void;

  /**
   * Is window fully visible to user (has overlap windows)
   * @param callback Called with the result of the request:{"status": "error"
   * "reason": thereson} or{"status": "success" "visible": "hidden" | "full" |
   * "partial"}
   */
  function isWindowVisibleToUser(
    callback: CallbackFunction<IsWindowVisibleToUserResult>
  ): void;

  /**
   * For OSR window only (for other window the callback return |error| status.
   * {
   *    "status": string (|error, success|), "reason": string (error reason),
   *    "accelerated": bool, "optimized"  : bool  (for accelerated windows only
   *    and only valid in Game)
   * }
   * @param windowId The id or name of the window.
   * @param callback Called with the result of the request.
   */
  function isAccelreatedOSR(
    windowId: string,
    callback: CallbackFunction<IsAccelreatedOSRResult>
  ): void;

  /**
   * Is current window accelerated
   * @param callback Called with the result of the request.
   */
  function isAccelreatedOSR(
    callback: CallbackFunction<IsAccelreatedOSRResult>
  ): void;

  /**
   * Get Window DPI.
   * @param callback Called with the result of the request (result e.g: {dpi:
   * 120, scale: 1.25}).
   */
  function getWindowDPI(
    callback: (result: { dpi: number; scale: number }) => void
  ): void;

  /**
   * Fired when the main window is restored.
   */
  const onMainWindowRestored: Event<null>;

  /**
   * Fired when the state of a window is changed.
   */
  const onStateChanged: Event<WindowStateChangedEvent>;

  /**
   * Fired when this window received a message.
   */
  const onMessageReceived: Event<MessageReceivedEvent>;

  /**
   * Fired when out of process iframe crashed.
   */
  const onIsolatedIframeProcessCrashed: Event<
    IsolatedIframeProcessCrashedEvent
  >;

  /**
   * Fired when the user was prevented from closing a window using Alt+F4
   */
  const onAltF4Blocked: Event<AltF4BlockedEvent>;
}

declare namespace overwolf.windows.mediaPlayerElement {
  interface CreateResult extends Result {
    id?: number;
  }

  interface SetVideoResult extends Result {
    duration?: number;
  }

  interface GetProgressResult extends Result {
    progress?: number;
  }

  interface PlaybackEvent {
    id: number;
  }

  /**
   * Creates a media player a places it in the given location with given
   * dimensions.
   * @param x The top position of the player.
   * @param y The left position of the player.
   * @param width The width of the player.
   * @param height The height of the player.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function create(
    x: number,
    y: number,
    width: number,
    height: number,
    callback: CallbackFunction<CreateResult>
  ): void;

  /**
   * Remove all media players created for this window.
   */
  function removeAllPlayers(): void;

  /**
   * Relocates the media player to a given location with given dimensions.
   * @param id The id of the player.
   * @param x The top position of the player.
   * @param y The left position of the player.
   * @param width The width of the player.
   * @param height The height of the player.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function setBounds(
    id: number,
    x: number,
    y: number,
    width: number,
    height: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Sets the current video to be played.
   * @param id The id of the player.
   * @param videoUrl An url to the video.
   * @param callback A callback function which will be called with the status of
   * the request. If successful, the callback will contain the total seconds in
   * the video.
   */
  function setVideo(
    id: number,
    videoUrl: string,
    callback: CallbackFunction<SetVideoResult>
  ): void;

  /**
   * Plays the current video.
   * @param id The id of the player.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function play(id: number, callback: CallbackFunction<Result>): void;

  /**
   * Pauses the current video.
   * @param id The id of the player.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function pause(id: number, callback: CallbackFunction<Result>): void;

  /**
   * Resumes the current video.
   * @param id The id of the player.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function resume(id: number, callback: CallbackFunction<Result>): void;

  /**
   * Sets the volume.
   * @param id The id of the player.
   * @param volume A volume between 0 and 100 (inclusive).
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function setVolume(
    id: number,
    volume: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Stops the current video.
   * @param id The id of the player.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function stop(id: number, callback: CallbackFunction<Result>): void;

  /**
   * Seeks the current video to the given number of seconds.
   * @param id The id of the player.
   * @param seconds The numbers of seconds to seek to.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function seek(
    id: number,
    seconds: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Gets the current progress, in seconds, of the playback.
   * @param id The id of the player.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function getProgress(
    id: number,
    callback: CallbackFunction<GetProgressResult>
  ): void;

  /**
   * Sets the speed ratio of the playback.
   * @param id The id of the player.
   * @param speedRatio The speed ratio of the playback. A double between 0 and
   * 16 (inclusive).
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function setPlaybackSpeed(
    id: number,
    speedRatio: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Sends the media player to the front of the window.
   * @param id The id of the player.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function toFront(id: number, callback: CallbackFunction<Result>): void;

  /**
   * Sends the media player to the back of the window.
   * @param id The id of the player.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function toBack(id: number, callback: CallbackFunction<Result>): void;

  /**
   * Sets the stretch mode of the player.
   * @param id The id of the media player.
   * @param stretchMode The desired stretch mode, see
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function setStretchMode(
    id: number,
    stretchMode: any,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Fired when playback is starting/resuming.
   */
  const onPlaybackStarted: Event<PlaybackEvent>;

  /**
   * Fired when playback is paused.
   */
  const onPlaybackPaused: Event<PlaybackEvent>;

  /**
   * Fired when playback is stopped.
   */
  const onPlaybackStopped: Event<PlaybackEvent>;

  /**
   * Fired when playback ends.
   */
  const onPlaybackEnded: Event<PlaybackEvent>;

  /**
   * Fired when there was an error while trying to open a video.
   */
  const onPlaybackError: Event<PlaybackEvent>;
}

declare namespace overwolf.benchmarking {
  /**
   * Requests hardware information within a given interval. Note that this call
   * requires Overwolf to have Administrative permissions. If it does not have
   * it, the callback will return with 'Permissions Required'. You will then
   * have to ask the app user for permissions and according to the user's
   * choice, call `requestPermissions`. It is then required to call
   * `requestProcessInfo` again.
   * @param interval The desired maximal interval (in milliseconds) in which
   * events will be triggered. Minimum is 500ms.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function requestHardwareInfo(
    interval: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Requests process information within a given interval. See
   * `requestPermissions` for administrative permissions instructions.
   * @param interval The desired maximal interval (in milliseconds) in which
   * events will be triggered. Minimum is 500ms.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function requestProcessInfo(
    interval: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Requests game fps information within a given interval.
   * @param interval The desired maximal interval (in milliseconds) in which
   * events will be triggered.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function requestFpsInfo(
    interval: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Stops receiving hardware/process events. Use this when you no longer want
   * to receive events or when you close your app.
   */
  function stopRequesting(): void;

  /**
   * In case Overwolf requires administrative permissions, and after prompting
   * the user of the app to request more permissions, call this function and
   * then request your desired benchmarking information.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function requestPermissions(callback: CallbackFunction<Result>): void;

  /**
   * Fired when hardware infromation is ready with a JSON containing the
   * information.
   */
  const onHardwareInfoReady: Event<any>;

  /**
   * Fired when process infromation is ready with a JSON containing the
   * information.
   */
  const onProcessInfoReady: Event<any>;

  /**
   * Fired when fps infromation is ready with a JSON containing the information.
   */
  const onFpsInfoReady: Event<any>;
}

declare namespace overwolf.games {
  const enum GameInfoType {
    Game,
    Launcher
  }

  interface GameInfo {
    ActualDetectedRenderers: number;
    ActualGameRendererAllowsVideoCapture: boolean;
    AllowCCMix: boolean;
    AllowCursorMix: boolean;
    AllowRIMix: boolean;
    Client_GameControlMode: number;
    CommandLine?: string;
    ControlModes: number;
    CursorMode: number;
    DIT: number;
    DetectDirKey?: string;
    DetectDirKeys?: string[];
    DisableActionMixed: boolean;
    DisableActivityInfo: boolean;
    DisableAeroOnDX11: boolean;
    DisableBlockChain: boolean;
    DisableD3d9Ex: boolean;
    DisableDIAquire: boolean;
    DisableEXHandle: boolean;
    DisableEternalEnum: boolean;
    DisableExclusiveModeUI: boolean;
    DisableFeature_TS3: boolean;
    DisableFeature_VideoCapture: boolean;
    DisableMultipleInjections: boolean;
    DisableOWGestures: boolean;
    DisableRenderAI: boolean;
    DisableResizeRelease: boolean;
    DisableSmartMixMode: boolean;
    DisplayName?: string;
    EnableClockGesture: boolean;
    EnableFocusOnAnyClick: boolean;
    EnableMTCursor: boolean;
    EnableRawInput: boolean;
    EnableSmartDIFocus: boolean;
    EnableSmartDIFocus2: boolean;
    EnableSmartFocus: boolean;
    EnableTXR: boolean;
    ExecutedMoreThan: boolean;
    FIGVTH: boolean;
    FPSIndicationThreshold: number;
    FirstGameResolutionHeight: number;
    FirstGameResolutionWidth: number;
    FixActionFocus: boolean;
    FixCC: boolean;
    FixCOEx: boolean;
    FixCVCursor: boolean;
    FixCursorOffset: boolean;
    FixDIBlock: boolean;
    FixDIFocus: boolean;
    FixDXThreadSafe: boolean;
    FixFSTB: boolean;
    FixHotkeyRI: boolean;
    FixInputBlock: boolean;
    FixInvisibleCursorCR: boolean;
    FixMixModeCursor: boolean;
    FixModifierMixMode: boolean;
    FixMouseDIExclusive: boolean;
    FixRCEx: boolean;
    FixResolutionChange: boolean;
    FixRestoreSWL: boolean;
    FixSWL: boolean;
    FixSWLW: boolean;
    ForceCaptureChangeRehook: boolean;
    ForceControlRehook: boolean;
    ForceGBB: boolean;
    GameGenres?: string;
    GameLinkURL?: string;
    GameNotes?: string;
    GameRenderers: number;
    GameTitle?: string;
    GenericProcessName: boolean;
    GroupTitle?: string;
    ID: number;
    IconFile?: string;
    IgnoreMultipleDevices: boolean;
    IgnoreRelease: boolean;
    ImGuiRendering: boolean;
    InjectionDecision: number;
    Input: number;
    InstallHint?: string;
    IsConflictingWithControlHotkey: boolean;
    IsNew: boolean;
    IsSteamGame: boolean;
    KeepInGameOnLostFocus: boolean;
    Label?: string;
    LastInjectionDecision: number;
    LastKnownExecutionPath?: string;
    LaunchParams?: string;
    Launchable: boolean;
    LauncherDirectoryRegistryKey?: string;
    LauncherDirectoryRegistryKeys?: string[];
    LauncherGameClassId: number;
    LauncherNames?: string[];
    ModifierStatus: number;
    NativeID: number;
    PassThruBoundsOffsetPixel: number;
    PressToClickThrough: number;
    ProcessCommandLine?: string;
    ProcessID: number;
    ProcessNames: string[];
    RecreateSB: boolean;
    ReleaseKBInOverlayFocus: boolean;
    ResizeNotifyResolution: boolean;
    RestoreBB: boolean;
    RestoreRT: boolean;
    RunElevated: boolean;
    SendHotkeyRI: boolean;
    SetDIInExclusive: boolean;
    ShortTitle?: string;
    SkipGameProc: boolean;
    SmartReleaseKBInOverlayFocus: boolean;
    StableFPSThreshold: number;
    StuckInTrans_Margin: number;
    StuckInTrans_MouseMoveGap?: number;
    SupportedScheme?: string;
    SupportedVersion?: string;
    TCModes: number;
    TerminateOnWindowClose: boolean;
    Type: number;
    TypeString?: string;
    UnsupportedScheme?: string;
    UpdateCursor: boolean;
    UpdateCursorMT: boolean;
    UseAllSafeHook: boolean;
    UseEH?: string;
    UseHardwareDevice: boolean;
    UseLauncherIcon: boolean;
    UseLongHook: boolean;
    UseMCH?: string;
    UseMH: boolean;
    UseMHScheme?: string;
    UseMKLL: boolean;
    UseMW: boolean;
    UsePR: boolean;
    UseRI: boolean;
    UseRIB: boolean;
    UseSafeHook: boolean;
    UseTSHook: boolean;
    WaitRestore: boolean;
    Win7Support: number;
    Win8Support: number;
    Win10Support: number;
    XPSupport: number;
  }

  interface RunningGameInfo {
    isInFocus: boolean;
    isRunning: boolean;
    allowsVideoCapture: boolean;
    title: string;
    displayName: string;
    shortTitle: string;
    id: number;
    classId: number;
    width: number;
    height: number;
    logicalWidth: number;
    logicalHeight: number;
    renderers: string[];
    detectedRenderer: string;
    executionPath: string;
    sessionId: string;
    commandLine: string;
    type: GameInfoType;
    typeAsString: string;
  }

  interface GameInfoUpdate {
    gameInfo: RunningGameInfo;
    resolutionChanged: boolean;
    runningChanged: boolean;
    focusChanged: boolean;
    gameChanged: boolean;
  }

  interface InstalledGameInfo {
    GameInfo: GameInfo;
    GameInfoClassID?: number;
    GameInfoID?: number;
    LastTimeVerified?: Date;
    LauncherCommandLineParams?: string;
    LauncherPath?: string;
    ManuallyAdded?: boolean;
    ProcessPath?: string;
    WasAutoAddedByProcessDetection?: boolean;
  }

  interface GetGameDBInfoResult extends Result {
    gameInfo?: GameInfo;
    installedGameInfo?: InstalledGameInfo;
  }

  interface GetRecentlyPlayedResult extends Result {
    games: number[];
  }

  interface GetGameInfoResult extends Result {
    gameInfo?: InstalledGameInfo;
  }

  interface GameInfoUpdatedEvent {
    gameInfo?: RunningGameInfo;
    resolutionChanged: boolean;
    runningChanged: boolean;
    focusChanged: boolean;
    gameChanged: boolean;
  }

  interface MajorFrameRateChangeEvent {
    fps_status: "None" | "Stable" | "Drop" | "Increase";
    fps: number;
  }

  interface GameRendererDetectedEvent {
    detectedRenderer: string;
  }

  /**
   * Returns an object with information about the currently running game (or
   * active games, if more than one), or null if no game is running.
   * @param callback Called with the currently running or active game info. See
   */
  function getRunningGameInfo(callback: (info: RunningGameInfo) => void): void;

  /**
   * Returns information about a game with a given game id.Will only return
   * information if the game is detected on the local machine (i.e. installed)
   * @param gameClassId The class id of the game.
   * @param callback Called with the info about the game.
   */
  function getGameInfo(
    gameClassId: number,
    callback: CallbackFunction<GetGameInfoResult>
  ): void;

  /**
   * This is the same as `getGameDBInfo`, except that it can return two different
   * results: 1. if the game is detected as installed - then the
   * `installedGameInfo` member of the result will be set and the `gameInfo`
   * member will be null 2. if the game is NOT detected as installed, then the
   * `installedGameInfo` member of the result will be set to null and the
   * `gameInfo` member will be set NOTE: `installedGameInfo` contains `gameInfo`
   * in it.
   * @param classId The class id of the game.
   * @param callback Called with the info about the game.
   */
  function getGameDBInfo(
    classId: number,
    callback: CallbackFunction<GetGameDBInfoResult>
  ): void;

  /**
   * Returns an array of the maxNumOfGames most recently played game IDs.An
   * empty array will be returned if none have been recorded.
   * @param maxNumOfGames The maximum number of games to recieve.
   * @param callback Called with the array of game IDs.
   */
  function getRecentlyPlayedGames(
    maxNumOfGames: number,
    callback: CallbackFunction<GetRecentlyPlayedResult>
  ): void;

  /**
   * Fired when the game info is updated, including game name, game running,
   * game terminated, game changing focus, etc.
   */
  const onGameInfoUpdated: Event<GameInfoUpdatedEvent>;

  /**
   * Fired when a game is launched.
   */
  const onGameLaunched: Event<RunningGameInfo>;

  /**
   * Fired when the rendering frame rate of the currently injected game changes
   * dramatically.
   */
  const onMajorFrameRateChange: Event<MajorFrameRateChangeEvent>;

  /**
   * Fired when the rendering method of the game has been detected.
   */
  const onGameRendererDetected: Event<GameRendererDetectedEvent>;
}

declare namespace overwolf.games.launchers {
  interface LauncherInfo {
    title: string;
    id: number;
    classId: number;
    isInFocus: boolean;
    position: { height: number; left: number; top: number; width: number };
    handle: number;
    commandLine: string;
    processId: number;
    path: string;
  }

  interface UpdatedEvent {
    info: LauncherInfo;
    changeType: string[];
  }

  /**
   * Returns an object with information about the currently running launchers.
   * @param callback Called with the currently running detected launchers.
   */
  function getRunningLaunchersInfo(
    callback: (result: { launchers: LauncherInfo[] }) => void
  ): void;

  /**
   * Fired when the launcher info is updated, including game name, game running,
   * game terminated, game changing focus, etc.
   */
  const onUpdated: Event<UpdatedEvent>;

  /**
   * Fired when a game is launched.
   */
  const onLaunched: Event<LauncherInfo>;

  /**
   * Fired when a launcher is closed.
   */
  const onTerminated: Event<LauncherInfo>;
}

declare namespace overwolf.games.launchers.events {
  interface GetInfoResult extends Result {
    res: any;
  }

  interface SetRequiredFeaturesResult extends Result {
    supportedFeatures: string[];
  }

  /**
   * Sets the required features from the provider.
   * @param features A string array of features to utilize.
   * @param callback Called with success or failure state.
   */
  function setRequiredFeatures(
    launcherClassId: number,
    features: string[],
    callback: CallbackFunction<SetRequiredFeaturesResult>
  ): void;

  /**
   * Gets the current game info.
   * @param callback
   */
  function getInfo(
    launcherClassId: number,
    callback: CallbackFunction<GetInfoResult>
  ): void;

  /**
   * Fired when there are game info updates with a JSON object of the updates.
   */
  const onInfoUpdates: Event<any>;

  /**
   * Fired when there are new game events with a JSON object of the events
   * information.
   */
  const onNewEvents: Event<any>;
}

declare namespace overwolf.games.launchers.events.provider {
  interface GameEventsInfo {
    feature: string;
    category: string;
    key: string;
    value: string;
  }

  function triggerEvent(
    launcherClassId: number,
    feature: string,
    name: string,
    data?: any,
    callback?: CallbackFunction<Result>
  ): void;

  function updateInfo(
    launcherClassId: number,
    info: GameEventsInfo,
    callback?: CallbackFunction<Result>
  ): void;

  function setSupportedFeatures(
    launcherClassId: number,
    features: string[],
    callback?: CallbackFunction<Result>
  ): void;
}

declare namespace overwolf.games.events {
  type InfoUpdate = Dictionary<Dictionary<string>>;

  interface SetRequiredFeaturesResult extends Result {
    supportedFeatures?: string[];
  }

  interface GetInfoResult extends Result {
    res: InfoUpdate;
  }

  interface GameEvent {
    name: string;
    data: string;
  }

  interface NewGameEvents {
    events: GameEvent[];
  }

  interface ErrorEvent {
    reason: string;
  }

  interface InfoUpdates2Event {
    info: InfoUpdate;
  }

  /**
   * Sets the required features from the provider.
   * @param features A string array of features to utilize.
   * @param callback Called with success or failure state.
   */
  function setRequiredFeatures(
    features: string[],
    callback: CallbackFunction<SetRequiredFeaturesResult>
  ): void;

  /**
   * Gets the current game info.
   * @param callback
   */
  function getInfo(callback: CallbackFunction<GetInfoResult>): void;

  /**
   * Fired when there was an error in the game events system.
   */
  const onError: Event<ErrorEvent>;

  /**
   * Obsolete. Fired when there are game info updates with a JSON object of the
   * updates.
   */
  const onInfoUpdates: Event<any>;

  /**
   * Fired when there are game info updates with a JSON object of the updates.
   */
  const onInfoUpdates2: Event<InfoUpdates2Event>;

  /**
   * Fired when there are new game events with a JSON object of the events
   * information.
   */
  const onNewEvents: Event<NewGameEvents>;
}

declare namespace overwolf.games.events.provider {
  interface GameEventsInfo {
    feature: string;
    category: string;
    key: string;
    value: string;
  }

  function triggerEvent(feature: string, name: string, data?: any): void;

  function updateInfo(info: GameEventsInfo): void;

  function setSupportedFeatures(
    features: string[],
    callback: CallbackFunction<Result>
  ): void;
}

declare namespace overwolf.games.inputTracking {
  interface MousePosition {
    x: number;
    y: number;
    onGame: boolean;
    handle: { value: number };
  }

  interface ActivityResult extends Result {
    activity?: any;
  }

  interface GetMousePositionResult extends Result {
    mousePosition?: MousePosition;
  }

  interface KeyEvent {
    key: string;
    onGame: boolean;
  }

  interface MouseEvent {
    button: string;
    x: number;
    y: number;
    onGame: boolean;
  }

  /**
   * Returns the input activity information. The information includes presses
   * for keyboard/mouse, total session time, idle time and actions-per-minute.
   * This information resets between game executions.
   * @param callback A callback with the activity information.
   */
  function getActivityInformation(
    callback: CallbackFunction<ActivityResult>
  ): void;

  /**
   * Returns the input activity information (similar to
   * `getActivityInformation`). However, when this is supported, it will return
   * data only for the latestmatch of the current game
   * @param callback A callback with the activity information.
   */
  function getMatchActivityInformation(
    callback: CallbackFunction<ActivityResult>
  ): void;

  /**
   * Returns the eye tracking information. The information includes gaze points,
   * fixations, user presence (screen/keyboard/other) and minimap glances. This
   * information resets between game executions.
   * @param callback A callback with the eye tracking information
   */
  function getEyeTrackingInformation(
    callback: CallbackFunction<ActivityResult>
  ): void;

  /**
   * Returns the input last mouse position in game. the data includes the mouse
   * position and a boolean stating whether the keypress was on a game or on an
   * Overwolf widget (onGame).
   * @param callback A callback with the mouse position information
   */
  function getMousePosition(
    callback: CallbackFunction<GetMousePositionResult>
  ): void;

  /**
   * Eye tracking data trakcing will pause, and stop collect Eye tracking data
   * until resumeEyeTracking will be called.
   */
  function pauseEyeTracking(): void;

  /**
   * Resume collecting Eye tracking data.
   */
  function resumeEyeTracking(): void;

  /**
   * Fired when a keyboard key has been released. The event information includes
   * the virtual key code (key) and a boolean stating whether the keypress was
   * on a game or on an Overwolf widget (onGame).
   */
  const onKeyUp: Event<KeyEvent>;

  /**
   * Fired when a keyboard key has been pressed.
   * Event information is similar to `onKeyUp`.
   */
  const onKeyDown: Event<KeyEvent>;

  /**
   * Fired when a mouse key has been released. The event information includes
   * whether the left or white mouse button was clicked(button), x and y
   * coordinates (x, y) and a boolean stating whether the keypress was on a game
   * or on an Overwolf widget (onGame).
   */
  const onMouseUp: Event<MouseEvent>;

  /**
   * Fired a mouse key has been pressed.
   * Event information is similar to `onMouseUp`.
   */
  const onMouseDown: Event<MouseEvent>;
}

declare namespace overwolf.web {
  namespace enums {
    enum HttpRequestMethods {
      GET = "GET",
      HEAD = "HEAD",
      POST = "POST",
      PUT = "PUT",
      DELETE = "DELETE"
    }
  }

  interface WebSocketConnectionParams {
    secured: boolean;
    port: number;
    credentials: { username: string; password: string };
    protocols: string[];
  }

  interface WebServer {
    /**
     * Listens for requests on the given port. If the port is already in use, or
     * this instance is already listening, an error will be returned.
     * @param callback Fired with the status of the request.
     */
    listen(callback: CallbackFunction<any>): void;
    /**
     * Closes the web server. It can be re-opened again.
     */
    close(): void;
    /**
     * Fired when the web server receives an incoming request. The event
     * contains three strings: 'url', 'content' and 'contentType'.
     */
    onRequest: Event<RequestEvent>;
  }

  interface WebSocket {
    /**
     * Listens for requests on the given port.
     * @param callback
     */
    connect(callback: CallbackFunction<Result>): void;
    /**
     * Send message.
     * @param message
     * @param callback
     */
    send(message: string, callback: CallbackFunction<Result>): void;
    /**
     * Closes the websocket. It can be re-opened again.
     */
    close(): void;
    /**
     * Fired when the websocket receives an incoming message.
     */
    onMessage: Event<MessageEvent>;
    /**
     * Fired on error.
     */
    onError: Event<ErrorEvent>;
    /**
     * Fired on websocket connection Opened.
     */
    onOpen: Event<{}>;
    /**
     * Fired when connection closed.
     */
    onClosed: Event<ClosedEvent>;
  }

  interface FetchHeader {
    key: string;
    value: string;
  }

  interface CreateServerResult extends Result {
    server?: WebServer;
  }

  interface CreateWebSocketResult extends Result {
    client?: WebSocket;
  }

  interface SendHttpRequestResult extends Result {
    statusCode?: number;
    data?: string;
  }

  interface RequestEvent {
    url: string;
    content: string;
    contentType: string;
  }

  interface MessageEvent {
    message: string;
    type: "ping" | "binary" | "text";
  }

  interface ErrorEvent {
    message: string;
    exception: any;
  }

  interface ClosedEvent {
    code: number;
    reason: string;
  }

  /**
   * Creates a web server. This call returns an object with two fields: A status
   * string and a server object.
   * @param port The port to use.
   * @param callback
   */
  function createServer(
    port: number,
    callback: CallbackFunction<CreateServerResult>
  ): void;

  /**
   * Creates a WebSocket client to localhost/127.0.0.1 while by-passing a valid
   * certificate verification.
   * @param connectionParams
   * @param callback
   */
  function createWebSocket(
    connectionParams: WebSocketConnectionParams,
    callback: CallbackFunction<CreateWebSocketResult>
  ): void;

  /**
   * Send an https request (of different methods) to localhost/127.0.0.1
   * while by-passing a valid certificate verification.
   * @param url
   * @param method
   * @param headers
   * @param data
   * @param callback
   */
  function sendHttpRequest(
    url: string,
    method: enums.HttpRequestMethods,
    headers: FetchHeader[],
    data: string,
    callback: CallbackFunction<SendHttpRequestResult>
  ): void;
}

declare namespace overwolf.logitech {
  interface Device {
    name: string;
    pid: number;
    lightingId: number;
    lightingName: string;
    typeId: number;
    typeName: string;
  }

  interface GetVersionResult extends Result {
    version?: string;
  }

  interface GetDevicesResult extends Result {
    devices?: Device[];
  }

  /**
   * Gets the current version of the LGS.
   * @param callback Called with the version of LGS currently installed.
   */
  function getVersion(callback: CallbackFunction<GetVersionResult>): void;

  /**
   * Gets the currently installed Logitech devices.
   * @param callback Called with the current device information.
   */
  function getDevices(callback: CallbackFunction<GetDevicesResult>): void;
}

declare namespace overwolf.logitech.led {
  namespace enums {
    const enum KeyboardNames {
      ESC = "ESC",
      F1 = "F1",
      F2 = "F2",
      F3 = "F3",
      F4 = "F4",
      F5 = "F5",
      F6 = "F6",
      F7 = "F7",
      F8 = "F8",
      F9 = "F9",
      F10 = "F10",
      F11 = "F11",
      F12 = "F12",
      PRINT_SCREEN = "PRINT_SCREEN",
      SCROLL_LOCK = "SCROLL_LOCK",
      PAUSE_BREAK = "PAUSE_BREAK",
      TILDE = "TILDE",
      ONE = "ONE",
      TWO = "TWO",
      THREE = "THREE",
      FOUR = "FOUR",
      FIVE = "FIVE",
      SIX = "SIX",
      SEVEN = "SEVEN",
      EIGHT = "EIGHT",
      NINE = "NINE",
      ZERO = "ZERO",
      MINUS = "MINUS",
      EQUALS = "EQUALS",
      BACKSPACE = "BACKSPACE",
      INSERT = "INSERT",
      HOME = "HOME",
      PAGE_UP = "PAGE_UP",
      NUM_LOCK = "NUM_LOCK",
      NUM_SLASH = "NUM_SLASH",
      NUM_ASTERISK = "NUM_ASTERISK",
      NUM_MINUS = "NUM_MINUS",
      TAB = "TAB",
      Q = "Q",
      W = "W",
      E = "E",
      R = "R",
      T = "T",
      Y = "Y",
      U = "U",
      I = "I",
      O = "O",
      P = "P",
      OPEN_BRACKET = "OPEN_BRACKET",
      CLOSE_BRACKET = "CLOSE_BRACKET",
      BACKSLASH = "BACKSLASH",
      KEYBOARD_DELETE = "KEYBOARD_DELETE",
      END = "END",
      PAGE_DOWN = "PAGE_DOWN",
      NUM_SEVEN = "NUM_SEVEN",
      NUM_EIGHT = "NUM_EIGHT",
      NUM_NINE = "NUM_NINE",
      NUM_PLUS = "NUM_PLUS",
      CAPS_LOCK = "CAPS_LOCK",
      A = "A",
      S = "S",
      D = "D",
      F = "F",
      G = "G",
      H = "H",
      J = "J",
      K = "K",
      L = "L",
      SEMICOLON = "SEMICOLON",
      APOSTROPHE = "APOSTROPHE",
      ENTER = "ENTER",
      NUM_FOUR = "NUM_FOUR",
      NUM_FIVE = "NUM_FIVE",
      NUM_SIX = "NUM_SIX",
      LEFT_SHIFT = "LEFT_SHIFT",
      Z = "Z",
      X = "X",
      C = "C",
      V = "V",
      B = "B",
      N = "N",
      M = "M",
      COMMA = "COMMA",
      PERIOD = "PERIOD",
      FORWARD_SLASH = "FORWARD_SLASH",
      RIGHT_SHIFT = "RIGHT_SHIFT",
      ARROW_UP = "ARROW_UP",
      NUM_ONE = "NUM_ONE",
      NUM_TWO = "NUM_TWO",
      NUM_THREE = "NUM_THREE",
      NUM_ENTER = "NUM_ENTER",
      LEFT_CONTROL = "LEFT_CONTROL",
      LEFT_WINDOWS = "LEFT_WINDOWS",
      LEFT_ALT = "LEFT_ALT",
      SPACE = "SPACE",
      RIGHT_ALT = "RIGHT_ALT",
      RIGHT_WINDOWS = "RIGHT_WINDOWS",
      APPLICATION_SELECT = "APPLICATION_SELECT",
      RIGHT_CONTROL = "RIGHT_CONTROL",
      ARROW_LEFT = "ARROW_LEFT",
      ARROW_DOWN = "ARROW_DOWN",
      ARROW_RIGHT = "ARROW_RIGHT",
      NUM_ZERO = "NUM_ZERO",
      NUM_PERIOD = "NUM_PERIOD"
    }

    const enum LogitechDeviceLightingType {
      Mono = "Mono",
      RGB = "RGB",
      PerkeyRGB = "PerkeyRGB",
      All = "All"
    }
  }

  type ByteArray = Int8Array;

  /**
   * Initializes the LED API.
   * @param callback A callback with the result of the request.
   */
  function init(callback: CallbackFunction<Result>): void;

  /**
   * Sets the target devices to use.
   * @param targetDevices An array of
   * @param callback A callback with the result of the request.
   */
  function setTargetDevice(
    targetDevices: enums.LogitechDeviceLightingType[],
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Saves the current lighting.
   * @param callback A callback with the result of the request.
   */
  function saveCurrentLighting(callback: CallbackFunction<Result>): void;

  /**
   * Sets the lighting for the entire device.
   * @param redPercentage Red percentage (0 - 100)
   * @param greenPercentage Green percentage (0 - 100)
   * @param bluePercentage Blue percentage (0 - 100)
   * @param callback A callback with the result of the request.
   */
  function setLighting(
    redPercentage: number,
    greenPercentage: number,
    bluePercentage: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Restores the lightning to the last previously saved state.
   * @param callback A callback with the result of the request.
   */
  function restoreLighting(callback: CallbackFunction<Result>): void;

  /**
   * Flashes the lighting on the device.
   * @param redPercentage Red percentage (0 - 100)
   * @param greenPercentage Green percentage (0 - 100)
   * @param bluePercentage Blue percentage (0 - 100)
   * @param milliSecondsDuration The duration to flash in milliseconds.
   * @param milliSecondsInterval The interval for flashes in milliseconds.
   * @param callback A callback with the result of the request.
   */
  function flashLighting(
    redPercentage: number,
    greenPercentage: number,
    bluePercentage: number,
    milliSecondsDuration: number,
    milliSecondsInterval: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Pulses the lighting on the device.
   * @param redPercentage Red percentage (0 - 100)
   * @param greenPercentage Green percentage (0 - 100)
   * @param bluePercentage Blue percentage (0 - 100)
   * @param milliSecondsDuration The duration to flash in milliseconds.
   * @param milliSecondsInterval The interval for flashes in milliseconds.
   * @param callback A callback with the result of the request.
   */
  function pulseLighting(
    redPercentage: number,
    greenPercentage: number,
    bluePercentage: number,
    milliSecondsDuration: number,
    milliSecondsInterval: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Stops ongoing pulse/flash effects.
   * @param callback A callback with the result of the request.
   */
  function stopEffects(callback: CallbackFunction<Result>): void;

  /**
   * Sets the lighting from an overwolf-extension:// or overwolf-media:// url.
   * The file must be 21x6.
   * @param bitmapUrl The Overwolf url to add.
   * @param callback A callback with the result of the request.
   */
  function setLightingFromBitmap(
    bitmapUrl: string,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Sets the lighting from a bitmap byte array.
   * @param bitmap A byte array representing a 21x6 bitmap.
   * @param callback A callback with the result of the request.
   */
  function setLightingFromBitmap(
    bitmap: ByteArray,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Sets the lighting for a specific key by scan code.
   * @param keyCode The key scan code.
   * @param redPercentage Red percentage (0 - 100)
   * @param greenPercentage Green percentage (0 - 100)
   * @param bluePercentage Blue percentage (0 - 100)
   * @param callback A callback with the result of the request.
   */
  function setLightingForKeyWithScanCode(
    keyCode: number,
    redPercentage: number,
    greenPercentage: number,
    bluePercentage: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Sets the lighting for a specific key by HID code.
   * @param keyCode The key HID code.
   * @param redPercentage Red percentage (0 - 100)
   * @param greenPercentage Green percentage (0 - 100)
   * @param bluePercentage Blue percentage (0 - 100)
   * @param callback A callback with the result of the request.
   */
  function setLightingForKeyWithHidCode(
    keyCode: number,
    redPercentage: number,
    greenPercentage: number,
    bluePercentage: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Sets the lighting for a specific key by quartz code.
   * @param keyCode The key quartz code.
   * @param redPercentage Red percentage (0 - 100)
   * @param greenPercentage Green percentage (0 - 100)
   * @param bluePercentage Blue percentage (0 - 100)
   * @param callback A callback with the result of the request.
   */
  function setLightingForKeyWithQuartzCode(
    keyCode: number,
    redPercentage: number,
    greenPercentage: number,
    bluePercentage: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Sets the lighting for a specific key by key name.
   * @param keyName The key name. For a list of key names see
   * @param redPercentage Red percentage (0 - 100)
   * @param greenPercentage Green percentage (0 - 100)
   * @param bluePercentage Blue percentage (0 - 100)
   * @param callback A callback with the result of the request.
   */
  function setLightingForKeyWithKeyName(
    keyName: enums.KeyboardNames,
    redPercentage: number,
    greenPercentage: number,
    bluePercentage: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Saves the current lighting of a specific key.
   * @param keyName The key name. For a list of key names see
   * @param callback A callback with the result of the request.
   */
  function saveLightingForKey(
    keyName: enums.KeyboardNames,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Restores a previously saved lighting for a specific key.
   * @param keyName The key name. For a list of key names see
   * @param callback A callback with the result of the request.
   */
  function restoreLightingForKey(
    keyName: enums.KeyboardNames,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Flashes a single key.
   * @param keyName The key name. For a list of key names see
   * @param redPercentage Red percentage (0 - 100)
   * @param greenPercentage Green percentage (0 - 100)
   * @param bluePercentage Blue percentage (0 - 100)
   * @param milliSecondsDuration The duration to flash in milliseconds.
   * @param milliSecondsInterval The interval for flashes in milliseconds.
   * @param callback A callback with the result of the request.
   */
  function flashSingleKey(
    keyName: enums.KeyboardNames,
    redPercentage: number,
    greenPercentage: number,
    bluePercentage: number,
    milliSecondsDuration: number,
    milliSecondsInterval: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Pulses a single key.
   * @param keyName The key name. For a list of key names see
   * @param startRedPercentage >Red start percentage (0 - 100)
   * @param startGreenPercentage Green start percentage (0 - 100)
   * @param startBluePercentage Blue start percentage (0 - 100)
   * @param finishRedPercentage Red finish percentage (0 - 100)
   * @param finishGreenPercentage Green finish percentage (0 - 100)
   * @param finishBluePercentage Blue finish percentage (0 - 100)
   * @param milliSecondsDuration The duration to pulse in milliseconds.
   * @param isInfinite States whether the effect is infinite or not.
   * @param callback A callback with the result of the request.
   */
  function pulseSingleKey(
    keyName: enums.KeyboardNames,
    startRedPercentage: number,
    startGreenPercentage: number,
    startBluePercentage: number,
    finishRedPercentage: number,
    finishGreenPercentage: number,
    finishBluePercentage: number,
    milliSecondsDuration: number,
    isInfinite: boolean,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Stops ongoing pulse/flash effects on a specific key.
   * @param keyName The key name. For a list of key names see
   * @param callback A callback with the result of the request.
   */
  function stopEffectsOnKey(
    keyName: enums.KeyboardNames,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Shuts down the API.
   */
  function shutdown(): void;

  /**
   * Triggered when an error occurs, sent with an error code.
   */
  const onError: Event<string>;
}

declare namespace overwolf.streaming {
  namespace enums {
    const enum StreamMouseCursor {
      both = "both",
      gameOnly = "gameOnly",
      desktopOnly = "desktopOnly"
    }

    const enum ObsStreamingMode {
      OBSNoAwareness = "OBSNoAwareness",
      OBSAwareness = "OBSAwareness",
      OBSAwarenessHideFromDeskTop = "OBSAwarenessHideFromDeskTop"
    }

    const enum StreamingProvider {
      Unknown = "Unknown",
      Twitch = "Twitch",
      VideoRecorder = "VideoRecorder",
      RTMP = "RTMP"
    }

    const enum StreamingMode {
      WhenVisible = "WhenVisible",
      Always = "Always",
      Never = "Never"
    }

    const enum StreamEncoder {
      INTEL = "INTEL",
      X264 = "X264",
      NVIDIA_NVENC = "NVIDIA_NVENC",
      AMD_AMF = "AMD_AMF"
    }

    const enum StreamEncoderPreset_Intel {
      LOW = "LOW",
      MEDIUM = "MEDIUM",
      HIGH = "HIGH"
    }

    const enum StreamEncoderPreset_x264 {
      ULTRAFAST = "ULTRAFAST",
      SUPERFAST = "SUPERFAST",
      VERYFAST = "VERYFAST",
      FASTER = "FASTER",
      FAST = "FAST",
      MEDIUM = "MEDIUM",
      SLOW = "SLOW",
      SLOWER = "SLOWER",
      VERYSLOW = "VERYSLOW",
      PLACEBO = "PLACEBO"
    }

    const enum StreamEncoderPreset_AMD_AMF {
      AUTOMATIC = "AUTOMATIC",
      BALANCED = "BALANCED",
      SPEED = "SPEED",
      QUALITY = "QUALITY",
      ULTRA_LOW_LATENCY = "ULTRA_LOW_LATENCY",
      LOW_LATENCY = "LOW_LATENCY"
    }

    const enum StreamEncoderRateControl_AMD_AMF {
      RC_CBR = "RC_CBR",
      RC_CQP = "RC_CQP",
      RC_VBR = "RC_VBR",
      RC_VBR_MINQP = "RC_VBR_MINQP"
    }

    const enum StreamEncoderPreset_NVIDIA {
      AUTOMATIC = "AUTOMATIC",
      DEFAULT = "DEFAULT",
      HIGH_QUALITY = "HIGH_QUALITY",
      HIGH_PERFORMANCE = "HIGH_PERFORMANCE",
      BLURAY_DISK = "BLURAY_DISK",
      LOW_LATENCY = "LOW_LATENCY",
      HIGH_PERFORMANCE_LOW_LATENCY = "HIGH_PERFORMANCE_LOW_LATENCY",
      HIGH_QUALITY_LOW_LATENCY = "HIGH_QUALITY_LOW_LATENCY",
      LOSSLESS = "LOSSLESS",
      HIGH_PERFORMANCE_LOSSLESS = "HIGH_PERFORMANCE_LOSSLESS"
    }

    const enum StreamEncoderRateControl_NVIDIA {
      RC_CBR = "RC_CBR",
      RC_CQP = "RC_CQP",
      RC_VBR = "RC_VBR",
      RC_VBR_MINQP = "RC_VBR_MINQP",
      RC_2_PASS_QUALITY = "RC_2_PASS_QUALITY"
    }

    const enum StreamEncoderRateControl_x264 {
      RC_CBR = "RC_CBR",
      RC_CQP = "RC_CQP",
      RC_VBR = "RC_VBR",
      RC_VBR_MINQP = "RC_VBR_MINQP",
      RC_2_PASS_QUALITY = "RC_2_PASS_QUALITY"
    }
  }

  /**
   * Stream settings container.
   */
  interface StreamSettings {
    /**
     * The stream provider name.
     */
    provider?: enums.StreamingProvider;
    /**
     * The stream provider settings.
     */
    settings?: StreamParams;
  }

  /**
   * Represents the settings required to start a stream.
   */
  interface StreamParams {
    /**
     * The replay type to use.
     */
    replay_type?: media.replays.enums.ReplayType;
    /**
     * The basic stream information.
     */
    stream_info?: StreamInfo;
    /**
     * Stream authorization data.
     */
    auth?: StreamAuthParams;
    /**
     * Stream video options.
     */
    video?: StreamVideoOptions;
    /**
     * Stream audio options.
     */
    audio?: StreamAudioOptions;
    /**
     * Defines how peripherals (i.e. mouse cursor) are streamed.
     */
    peripherals?: StreamPeripheralsCaptureOptions;
    /**
     * Information on the server that is being streamed to.
     */
    ingest_server?: StreamIngestServer;
    /**
     * Create gif as Video (Gif Replay Type only).
     */
    gif_as_video: boolean;
    /**
     * Max media folder size in GB
     */
    max_quota_gb: number;
  }

  interface StreamInfo {
    /**
     * The URL where the stream can be watched.
     */
    url?: string;
    /**
     * The stream title.
     */
    title?: string;
  }

  /**
   * Stream authorization data.
   */
  interface StreamAuthParams {
    /**
     * The client id part of the authorization data. This part is usually
     * constant for each application.
     */
    client_id?: string;
    /**
     * The token part of the authorization data. This part if usually
     * user-specific, and received after login.
     */
    token?: string;
  }

  /**
   * Stream video options.
   */
  interface StreamVideoOptions {
    /**
     * Defines if to try to automatically calculate the kbps. If set to true,
     * then the max_kbps field is ignored.
     */
    auto_calc_kbps: boolean;
    /**
     * Defines the Frames Per Second for the stream.
     */
    fps: number;
    /**
     * Defines the stream width in pixels.
     */
    width: number;
    /**
     * Defines the stream height in pixels.
     */
    height: number;
    /**
     * Defines the maximum KB per second of the stream.
     */
    max_kbps: number;
    /**
     * Defines the length of the buffer to be recorded in millisenconds (max 40
     * seconds)
     */
    buffer_length: number;
    /**
     * Interval between frames when creating gifs.
     */
    frame_interval: number;
    /**
     * The interval, in milliseconds, in which to test for dropped frames.
     */
    test_drop_frames_interval: number;
    /**
     * The ratio of dropped to non-dropped frames for which to issue a
     * notification.
     */
    notify_dropped_frames_ratio: number;
    /**
     * Defines file maximum size. when video reach `max_file_size_bytes`, the
     * recorder will flash the video file and stat a new video file.
     * `onFileSpilt` event will be fired.
     */
    max_file_size_bytes: number;
    /**
     * In case `max_file_size_bytes` is on, full video will be recorded to disk,
     * parallel to splits videos.
     */
    include_full_size_video: boolean;
    /**
     * Defines Sub folder for video file path destination (Optional).
     * OverwolfVideoFolder\AppName\|sub_folder_name\|file_name| In case
     * `folder_name` is empty: OverwolfVideoFolder\AppName\\`sub_folder_name`
     */
    sub_folder_name?: string;
    /**
     * Defines the video encoder settings to use.
     */
    encoder?: StreamingVideoEncoderSettings;
    /**
     * Defines the desktop streaming options.
     */
    capture_desktop?: StreamDesktopCaptureOptions;
    /**
     * Do not use Overwolf capture setting. In case True you must provider all
     * video setting (encoder..)
     */
    override_overwolf_setting: boolean;
    /**
     * Do not start video replay service in case shared texture is not
     * supported.
     */
    disable_when_sht_not_supported: boolean;
  }

  /**
   * Defines the video encoder settings.
   */
  interface StreamingVideoEncoderSettings {
    /**
     * Defines which video encoder to use.
     */
    name?: enums.StreamEncoder;
    /**
     * Defines the settings of the specific encoder.
     */
    config?:
    | StreamingVideoEncoderNVIDIA_NVENCSettings
    | StreamingVideoEncoderIntelSettings
    | StreamingVideoEncoderx264Settings
    | StreamingVideoEncoderAMD_AMFSettings;
  }

  /**
   * Defines the configuration for the NVIDIA NVENC encoder.
   */
  interface StreamingVideoEncoderNVIDIA_NVENCSettings {
    /**
     * Defines which preset the encoder should use.
     */
    preset?: enums.StreamEncoderPreset_NVIDIA;
    /**
     * Defines the rate control mode the encoder should use.
     */
    rate_control?: enums.StreamEncoderRateControl_NVIDIA;
    /**
     * Defines the time, in seconds, after which to send a keyframe.
     */
    keyframe_interval: number;
  }

  /**
   * Defines the configuration for an Intel encoder.
   */
  interface StreamingVideoEncoderIntelSettings { }

  /**
   * Defines the configuration for an x264 encoder.
   */
  interface StreamingVideoEncoderx264Settings {
    /**
     * Defines the number of frames after which to send a keyframe.
     */
    preset?: enums.StreamEncoderPreset_x264;
    /**
     * Defines the rate control mode the encoder should use.
     */
    rate_control?: enums.StreamEncoderRateControl_x264;
    /**
     * Defines which preset the encoder should use.
     */
    keyframe_interval: number;
  }

  /**
   * Defines the configuration for the AMD AMF encoder.
   */
  interface StreamingVideoEncoderAMD_AMFSettings {
    /**
     * Defines which preset the encoder should use.
     */
    preset?: enums.StreamEncoderRateControl_AMD_AMF;
    /**
     * Defines the rate control mode the encoder should use.
     */
    rate_control?: enums.StreamEncoderRateControl_AMD_AMF;
    /**
     * Defines the time, in seconds, after which to send a keyframe.
     */
    keyframe_interval: number;
  }

  /**
   * Stream desktop capture options.
   */
  interface StreamDesktopCaptureOptions {
    /**
     * Defines if to capture the desktop while game is not running or not in
     * focus.
     */
    enable: boolean;
    /**
     * Defines which monitor to stream when streaming desktop.
     */
    monitor_id: number;
    /**
     * Defines if to force desktop streaming even when a game is in foreground.
     */
    force_capture: boolean;
  }

  /**
   * Stream audio options.
   */
  interface StreamAudioOptions {
    /**
     * Defines the microphone volume as applied to the stream.
     */
    mic?: StreamDeviceVolume;
    /**
     * Defines the game volume as applied to the stream.
     */
    game?: StreamDeviceVolume;
  }

  /**
   * Defines a device volume and enablement settings.
   */
  interface StreamDeviceVolume {
    /**
     * Defines if the device is enabled.
     */
    enable: boolean;
    /**
     * Defines the device volume in the range of 0 to 100.
     */
    volume: number;
    /**
     * Defines the device ID to use.
     */
    device_id: string;
  }

  /**
   * Stream capture options for peripheral devices.
   */
  interface StreamPeripheralsCaptureOptions {
    /**
     * Defines when to capture the mouse cursor while streaming is on.
     */
    capture_mouse_cursor: enums.StreamMouseCursor;
  }

  /**
   * Information on the server that is being streamed to.
   */
  interface StreamIngestServer {
    /**
     * The server name that is being streamed to.
     */
    name: string;
    /**
     * The server's url template. Use the token {stream_key} to specify the
     * stream key in the url.
     */
    template_url: string;
  }

  /**
   * A settings container for a stream Overwolf watermark settings.
   */
  interface WatermarkSettings {
    /**
     * Determines whether or not to display the Overwolf watermark on the
     * stream.
     */
    showWatermark: boolean;
  }

  interface EncoderData {
    name: string;
    display_name: string;
  }

  interface AudioDeviceData {
    display_name: string;
    device_id: string;
    can_record: boolean;
    can_playback: boolean;
    device_state: string;
    device_setting_id: string;
  }

  interface StreamResult extends Result {
    stream_id?: number;
    SubErrorMessage?: string;
  }

  interface GetWindowStreamingModeResult extends Result {
    streaming_mode?: string;
  }

  interface GetStreamEncodersResult extends Result {
    encoders?: EncoderData[];
  }

  interface GetAudioDevicesResult extends Result {
    devices?: AudioDeviceData[];
    default_recording_device_id?: string;
    default_playback_device_id?: string;
  }

  interface StreamingSourceImageChangedEvent {
    stream_id: number;
    old_source: string;
    new_source: string;
  }

  interface StopStreamingEvent {
    stream_id: number;
    url: string;
    file_path: string;
    duration: number;
    last_file_path: string;
    split: boolean;
    extra: string;
    osVersion: string;
    osBuild: string;
  }

  interface VideoFileSplitedEvent {
    stream_id: number;
    file_name: string;
    duration: number;
    count: number;
    next_file: string;
  }

  /**
   * Start a new stream.
   * @param settings The stream settings.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function start(
    settings: StreamSettings,
    callback: CallbackFunction<StreamResult>
  ): void;

  /**
   * Stops the given stream.
   * @param streamId The id of the stream to stop.
   * @param callback A callback function which will be called with the status of
   * the request.
   */
  function stop(
    streamId: number,
    callback?: (result: StreamResult | StopStreamingEvent) => void
  ): void;

  /**
   * Changes the volume of the stream.
   * @param streamId The id of the stream on which the volume is changed.
   * @param audioOptions The new volumes encapsulated in an object.
   * @param callback A function that will be called with success or error
   * status.
   */
  function changeVolume(
    streamId: number,
    audioOptions: any,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Sets the watermark settings.
   * @param settings The new watermark settings.
   * @param callback A callback to call when done setting the new watermark
   * settings.
   */
  function setWatermarkSettings(
    settings: WatermarkSettings,
    callback?: CallbackFunction<Result>
  ): void;

  /**
   * Gets the watermark settings.
   * @param callback A function that will be called with a JSON containing the
   * statusand the watermark settings if successful or an error message if not.
   */
  function getWatermarkSettings(
    callback: (result: WatermarkSettings) => void
  ): void;

  /**
   * Call the given callback function with the window's streaming mode as a
   * parameter.
   * @param windowId The id of the window for which to get the streaming mode.
   * @param callback The callback function to call with the window's streaming
   * mode as a parameter.
   */
  function getWindowStreamingMode(
    windowId: string,
    callback: CallbackFunction<GetWindowStreamingModeResult>
  ): void;

  /**
   * Set the window's stream mode.
   * @param windowId The id of the window for which to set the streaming mode.
   * @param streamingMode The desired streaming mode.
   * @param callback A function called after streaming mode was set indicating
   * success, or error in case of an error.
   */
  function setWindowStreamingMode(
    windowId: string,
    streamingMode: enums.StreamingMode,
    callback?: CallbackFunction<Result>
  ): void;

  /**
   * Sets the streaming mode for the window when using OBS.
   * @param windowId The id of the window for which to set the streaming mode.
   * @param obsStreamingMode The desired OBS streaming mode
   * @param callback A function called after streaming mode was set indicating
   * success, or error in case of an error.
   */
  function setWindowObsStreamingMode(
    windowId: string,
    obsStreamingMode: enums.ObsStreamingMode,
    callback?: CallbackFunction<Result>
  ): void;

  /**
   * Set a stream's Be Right Back image.
   * @param streamId The id of the stream for which to set the Be Right Back
   * image.
   * @param image The image to set, as an IMG object or a URL.
   * @param backgroundColor The color to paint the last game frame with before
   * overlaying the image.
   * @param callback A callback function to call with success or failure
   * indication.
   */
  function setBRBImage(
    streamId: number,
    image: any,
    backgroundColor: string,
    callback?: CallbackFunction<Result>
  ): void;

  /**
   * Update stream desktop capture options.
   * @param streamId The id of the stream for which to set the Be Right Back
   * image.
   * @param newOptions The updated desktop capture streaming options.
   * @param mouseCursorStreamingMethod The updated value of the mouse cursor
   * streaming method.
   * @param callback A callback function to call with success or failure
   * indication.
   */
  function updateStreamingDesktopOptions(
    streamId: number,
    newOptions: StreamDesktopCaptureOptions,
    mouseCursorStreamingMethod: enums.StreamMouseCursor,
    callback?: CallbackFunction<Result>
  ): void;

  /**
   * Returns an array of supported streaming encoders, with extra metadata for
   * each one.
   * @param callback A callback function to call with the array of encoders and
   * their metadata.
   */
  function getStreamEncoders(
    callback: CallbackFunction<GetStreamEncodersResult>
  ): void;

  /**
   * Returns an array of all audio devices that can be used.
   * @param callback A callback function to call with the array of audio devices
   * and their metadata.
   */
  function getAudioDevices(
    callback: CallbackFunction<GetAudioDevicesResult>
  ): void;

  /**
   * Return list of all running recores service (extensions ids).
   * @param callback
   */
  function getRunningRecorders(
    callback: (result: { extensions: string[] }) => void
  ): void;

  /**
   * Fired when the stream started streaming a new image source (desktop, game).
   */
  const onStreamingSourceImageChanged: Event<StreamingSourceImageChangedEvent>;

  /**
   * Fired when the stream has stopped.
   */
  const onStopStreaming: Event<StreamResult | StopStreamingEvent>;

  /**
   * Fired when the stream has stopped.
   */
  const onStartStreaming: Event<StreamResult>;

  /**
   * Fired upon an error with the stream.
   */
  const onStreamingError: Event<StreamResult>;

  /**
   * Fired upon a warning with the stream.
   */
  const onStreamingWarning: Event<StreamResult>;

  /**
   * Fired upon video file splited.
   */
  const onVideoFileSplited: Event<VideoFileSplitedEvent>;
}

declare namespace overwolf.log {
  /**
   * Writes verbose (debug) level log message to the common log.
   * @param msg The message to write to the log file.
   */
  function verbose(msg: string): void;

  /**
   * Writes info level log message to the common log.
   * @param msg The message to write to the log file.
   */
  function info(msg: string): void;

  /**
   * Writes warning level log message to the common log.
   * @param msg The message to write to the log file.
   */
  function warning(msg: string): void;

  /**
   * Writes error level log message to the common log.
   * @param msg The message to write to the log file.
   */
  function error(msg: string): void;

  /**
   * Writes error level log message to the common log.
   * @param msg The message to write to the log file.
   */
  function critical(msg: string): void;
}

declare namespace overwolf.os {

  /**
   * Returns regional information about the user.
   * @param callback Called with the region info.
   */
  function getRegionInfo(callback: CallbackFunction<GetRegionInfoResult>): void;

  interface GetRegionInfoResult extends Result {
    info: RegionInfo;
  }

  interface RegionInfo {
    date_format?: string;
    time_format?: string;
    currency_symbol?: string;
    is_metric?: boolean;
    name?: string;
  }
}

declare namespace overwolf.os.tray {

  /**
   * Create a tray icon for the calling extension with the supplied context menu object.
   * @param menu The menu object.
   * @param callback Called with the result.
   */
  function setMenu(menu: ExtensionTrayMenu, callback: CallbackFunction<Result>): void;

  interface ExtensionTrayMenu {
    menu_items: { menu_items: menu_item[] };
  }

  interface menu_item {
    label?: string;
    id?: string;
    enabled?: boolean;
    sub_items?: menu_item[];
  }

  /**
  * Fired when an item from the tray icon’s context menu is selected.
  */
  const onMenuItemClicked: Event<onMenuItemClickedEvent>;

  interface onMenuItemClickedEvent {
    item: string;
  }

  /**
   * Fired when the tray icon is left clicked.
   */
  const onTrayIconClicked: Event<any>;

  /**
   * Fired when the tray icon is double clicked.
   */
  const onTrayIconDoubleClicked: Event<any>;


}

declare namespace overwolf.extensions {
  type Permission =
    | "Camera"
    | "Microphone"
    | "Logging"
    | "Extensions"
    | "Streaming"
    | "DesktopStreaming"
    | "Profile"
    | "Clipboard"
    | "Hotkeys"
    | "Media"
    | "GameInfo"
    | "GameControl"
    | "FileSystem"
    | "LogitechLed"
    | "LogitechArx"
    | "OwWebview"
    | "VideoCaptureSettings";

  const enum ExtensionType {
    WebApp = "WebApp",
    BuiltIn = "BuiltIn",
    TCApp = "TCApp",
    Giveaway = "Giveaway",
    Store = "Store",
    Skin = "Skin",
    TSSkin = "TSSkin",
    GameEventsProvider = "GameEventsProvider",
    Unknown = "Unknown"
  }

  const enum ExtensionUpdateState {
    UpToDate = "UpToDate",
    UpdateAvailable = "UpdateAvailable",
    PendingRestart = "PendingRestart"
  }

  /**
   * Representation of manifest.json
   */
  interface Manifest {
    /**
     * Targets the manifest version you are working on. Currently there is only
     * one version, therefore this value is always "1"
     */
    manifest_version: number;
    /**
     * Declares the type of application. Can only be "WebApp"
     */
    type: ExtensionType;
    /**
     * Includes app metadata
     */
    meta: Metadata;
    UID: string;
    /**
     * 	An array of permissions that the app requires.
     */
    permissions: Permission[];
    /**
     * A list of additional meta-data on the app
     */
    data: WebAppSettings;
  }

  interface Metadata {
    /**
     * Name of your app
     */
    name: string;
    /**
     * The app's developer
     */
    author: string;
    /**
     * Up to four dot-separated integers identifying the current app version.
     */
    version: string;
    /**
     * Minimum version of the Overwolf Client with which the app is compatible.
     * The format is similar to the "version" field.
     */
    "minimum-overwolf-version": string;
    /**
     * Minimum version of the Overwolf Game Events Provider with which the app
     * is compatible. The format is similar to the "version" field.
     */
    "minimum-gep-version"?: string;
    /**
     * Minimum version of the Overwolf Game Summary with which the app is
     * compatible. The format is similar to the "version" field.
     */
    "minimum-gs-version"?: string;
    /**
     * Your app's description in the Appstore tile. Limited to 180 characters.
     */
    description: string;
    /**
     * Short name of your app. Provide a short title that will fit in the dock
     * button area – 18 chars max.
     */
    dock_button_title: string;
    /**
     * A relative path from the app folder to the icon’s png file. This is the
     * mouse-over (multi-colored) version of the icon that will be displayed on
     * the Overwolf dock. The icon dimensions should be 256×256 pixels, 72 PPI.
     * Overwolf will resize it to 37×37. Please make sure the png is smaller
     * than 30KB.
     */
    icon: string;
    /**
     * A relative path from the app folder to the icon’s png file. This
     * grayscale version of the icon is for the default state that will be
     * displayed on the Overwolf dock. The icon dimensions should be 256×256
     * pixels, 72 PPI. Overwolf will resize it to 37×37. Please make sure the
     * png is smaller than 30KB
     */
    icon_gray: string;
    /**
     * A relative path from the app folder to the desktop shortcut icon’s ico
     * file. This is a colored icon for the app’s desktop shortcut.
     */
    launcher_icon: string;
    /**
     * A relative path from the app folder to the splash image icon’s png file.
     * The image size should be 256x256px. If a this image is missing, Overwolf
     * will use the “icon” image as a splash image
     */
    splash_image: string;
    /**
     * A relative path from the app folder to the icon’s png file. This is the
     * window task bar icon \ window header. The icon dimensions should be
     * 256x256 pixels.
     */
    window_icon: string;
  }

  interface WebAppSettings {
    /**
     * An app can declare itself as targeted for one game or more.
     */
    game_targeting?: {
      /**
       * "all" – All games (e.g voice communication apps). "dedicated" –
       * Dedicated to a game or several games. "none" – No games.
       */
      type: "all" | "dedicated" | "none";
      /**
       * The game IDs that your app targets
       */
      game_ids?: number[];
    };
    /**
     * The name of the window (from the “windows” list) to initially load when
     * the app starts.
     */
    start_window: string;
    /**
     * A map from window names to window settings.
     */
    windows: Dictionary<ExtensionWindowData>;
    /**
     * Enable/Disable printing of ads log to the console. Default value is
     * “false”.
     */
    enable_top_isolated_sites_console?: boolean;
    /**
     * A definition of external URLs the web app should be able to access.
     */
    externally_connectable?: { matches: string[] };
    /**
     * Overrides the relative protocol with a preferred one.
     */
    protocol_override_domains?: Dictionary<string>;
    /**
     * Choose whether links in the app will be opened using the user’s default
     * browser or Overwolf’s browser. Possible values: "user" or "overwolf".
     */
    force_browser?: string;
    /**
     * Enable OSR/GPU acceleration if supported by this machine. Note: this flag
     * is still in Beta. It may not function as expected in some machines.
     */
    enable_osr_acceleration?: boolean;
    /**
     * A list of game ids for which game events are required.
     */
    game_events?: number[];
    /**
     * Disable the log file's 1000-line limitation. Note: Do not enable it
     * without Overwolf's approval.
     */
    disable_log_limit?: boolean;
    /**
     * Allows access to custom plugin dlls.
     */
    "extra-objects"?: Dictionary<{ file: string; class: string }>;
    /**
     * Shortcut keys that trigger an app action.
     */
    hotkeys?: {
      [hotkeyName: string]: {
        /**
         * Name of the hotkey as it will appear in the Hotkey tab in the
         * settings.
         */
        title: string;
        /**
         * Defines the behavior of the hotkey.
         */
        "action-type"?: "toggle" | "custom";
        /**
         * The default key combination.
         */
        default?: string;
        /**
         * Defines the behavior of the hotkey.
         */
        passthrough?: boolean;
      };
    };
    /**
     * A list of content scripts to be loaded for specific windows.
     */
    content_scripts?: {
      /**
       * The list of windows for which to apply this content script.
       */
      windows?: string[];
      /**
       * The list of URLs for which to apply this content script.
       */
      matches?: string[];
      /**
       * The list of CSS files to be applied in this content script.
       */
      css?: string[];
      /**
       * The list of JS files to be applied in this content script.
       */
      js?: string[];
    }[];
    /**
     * A list of events causing the app to launch.
     */
    launch_events?: {
      /**
       * The type name of the event.
       */
      event: "GameLaunch" | "AllGamesLaunch";
      /**
       * The list of game class IDs for which the app will launch.
       */
      event_data?: {
        /**
         * The list of game class IDs for which the app will launch.
         */
        game_ids: number[];
        /**
         * The app won’t start until the game’s framerate will stabilize around
         * or above the stated framerate.
         */
        wait_for_stable_framerate: number[];
      };
      /**
       * The app’s main window will start minimized.
       */
      start_minimized?: boolean;
      /**
       * The app will be launched when game launcher is detected.
       */
      include_launchers?: boolean;
    }[];
    /**
     * A custom user agent for the app to use when creating http requests. Note:
     * using ‘navigator.userAgent’ will not return the custom user agent, but
     * the default one.
     */
    user_agent?: string;
    /**
     * Disable opening of the developer tools for the app (with Ctrl+shift+I).
     * Default value – “false”
     */
    disable_dt?: boolean;
    /**
     * Hosting app flexible data.
     * If you app wants to provide some sort of service (like GS provides a
     * "tab-hosting" service for apps) - you can use this flag to set different
     * parameters that are relevant for the service provider app.
     */
    service_providers?: string;
    /**
     * Additional setting for developers.
     */
    developer?: {
      /**
       * Enable auto App reloading when detecting files changes. default is true
       */
      enable_auto_refresh: boolean;
      /**
       * 	Delay in milliseconds. When detecting file changes (for multiple
       * 	changes). default value is 1000 milliseconds (1 second)
       */
      reload_delay: number;
      /**
       * Filter files which will be tracked.e.g (.js;.html. default value is “.”
       * -> all files, but you can use several value like “.json;.html”
       */
      filter: string;
    };
  }

  interface ExtensionWindowData {
    /**
     * Points to a local HTML file to be loaded inside the window. If you wish
     * to host your app in a remote web-site, you’ll have to have a local page
     * that redirects to that remote website. In such cases, you need to make
     * sure that the block_top_window_navigation property is set to false.
     */
    file: string;
    /**
     * Define if the window is displayed in the Windows taskbar and alt-tab
     * window selection menu.
     */
    show_in_taskbar?: boolean;
    /**
     * Indicates whether the window will be transparent and borderless. Any part
     * of your window with transparent background (`"background: transparent;"`)
     * will become a see-through area that blends with the game or desktop. If
     * set to false a standard Overwolf window will be created.
     */
    transparent?: boolean;
    /**
     * Indicates whether the window’s locally saved data should be overridden
     * when the window’s size/location/opacity changes after a version update.
     */
    override_on_update?: boolean;
    /**
     * Indicates whether the window can be resized.
     */
    resizable?: boolean;
    /**
     * Indicates whether to show the window minimize button. Only relevant when
     * not in transparent mode.
     */
    show_minimize?: boolean;
    /**
     * Indicates whether the window will not receive clicks in-game, instead,
     * the clicks will be passed on to the game. To change this property at
     * runtime, use setWindowStyle().
     */
    clickthrough?: boolean;
    /**
     * When set to true, disable right clicks entirely for this window.
     */
    disable_rightclick?: boolean;
    /**
     * Indicates whether this window should always be included in recordings,
     * overriding any other setting.
     */
    forcecapture?: boolean;
    /**
     * Indicates whether this window is visible only in streams (not visible to
     * the streamer), overriding any other setting.
     */
    show_only_on_stream?: boolean;
    /**
     * Indicates whether the window will receive keyboard events or pass them on
     * to the game.
     */
    ignore_keyboard_events?: boolean;
    /**
     * Marks the window as available in-game only (Not accessible on Desktop).
     */
    in_game_only?: boolean;
    /**
     * Marks the window as available on desktop only, and not in-game. This flag
     * should be used (set to “true”) when “use_os_windowing” or “native_window”
     * flags are set to true. Note: using “desktop_only” and “native_window”
     * flags for desktop windows will dramatically improve your app’s
     * performance.
     */
    desktop_only?: boolean;
    /**
     * Indicates whether the window will animate on minimize/restore while in
     * game.
     */
    disable_restore_animation?: boolean;
    /**
     * Indicates whether the in-game window will 'steal' the keyboard focus
     * automatically from the game when it opens, or leave the keyboard focus
     * untouched. Default value is false.
     */
    grab_keyboard_focus?: boolean;
    /**
     * Indicates whether the desktop window will grab the focus automatically
     * when it opens, or leave the focus untouched. Default value is true.
     */
    grab_focus_on_desktop?: boolean;
    /**
     * Defines the size of the window in pixels when it is first opened. If your
     * window is not resizable, this will be the constant size of your window.
     * However, if your app is resizable – the app size is saved by Overwolf
     * when closed so that the next time it is opened, it will preserve it.
     */
    size?: Size;
    /**
     * Defines the minimum size of the window in pixels.
     */
    min_size?: Size;
    /**
     * Defines the maximum size of the window in pixels.
     */
    max_size?: Size;
    /**
     * The default starting position of the window counted in pixels from the
     * top left corner of the screen.
     */
    start_position?: Point;
    /**
     * Indicates whether the window will be on top of other Overwolf windows.
     * Handle with care as topmost windows can negatively impact user
     * experience.
     */
    topmost?: boolean;
    /**
     * Refrain from non _blank elements from “taking-over” the entire app’s
     * window.
     */
    block_top_window_navigation?: boolean;
    /**
     * Window location won’t be changed when game focus is changed.
     */
    keep_window_location?: boolean;
    /**
     * When set to true, allows your window to have a full-screen maximize when
     * calling the overwolf.windows.maximize function, and a real taskbar
     * minimize when calling overwolf.windows.minimize. Note: Should only be
     * used with desktop_only windows.
     */
    use_os_windowing?: boolean;
    /**
     * Enables JS engine background optimization. Default value is true.
     */
    background_optimization?: boolean;
    /**
     * Mutes sounds in window.
     */
    mute?: boolean;
    /**
     * Excludes hosts list so a stream from these hosts origins will not get
     * muted even if the window is on "mute": true.
     */
    mute_excluded_hosts?: string[];
    /**
     * 	Prevents new browser windows being opened automatically using script.
     * 	Default value is false.
     */
    popup_blocker?: boolean;
    /**
     * Enables window maximize button. Relevant only for the standard Overwolf
     * window ("transparent": false) Default value is false.
     */
    show_maximize?: boolean;
    /**
     * Causes the app’s window to never “lose focus”, so the window.onblur event
     * is never triggered. Default value is false.
     */
    disable_blur?: boolean;
    /**
     * Creates a native CEF desktop only window (which improves performance)
     * Note: Should only be used with desktop_only windows. Default value is
     * false.
     */
    native_window?: boolean;
    /**
     * This flag MUST be used with background/hidden controller windows. Note:
     * With this flag set to 'true', there's no need to set window related
     * properties such as size, focus, transparency, etc.
     */
    is_background_page?: boolean;
    /**
     * Allows you to control the behavior of an app window while in a
     * “mouse-less” game state.
     */
    focus_game_takeover?: "ReleaseOnHidden" | "ReleaseOnLostFocus";
    /**
     * 	Allow Overwolf to display your app’s hotkey combination on the screen
     * 	when the user switches to “exclusive mode”. The string value should be
     * 	the hotkey name from the hotkeys section. Relevant only if you set
     * 	focus_game_takeover=ReleaseOnHidden.
     */
    focus_game_takeover_release_hotkey?: string;
    /**
     * 	Enable iframe isolation: runs it in a different process, so if some
     * 	iframe is misbehaving (e.g. memory leak, etc.) it won’t crash your app
     * 	and will only crash the iframe process. useful with Overwolf ads that
     * 	run in an iframe. Note: Please contact us before adding it to your app.
     * 	Default value is true.
     */
    enable_top_isolation?: boolean;
    /**
     * Allows access to local files that are not located in your app’s
     * (extension) folder. Default value is false.
     */
    allow_local_file_access?: boolean;
    /**
     * 	Blocks the user from closing the window by using Alt+F4. You can
     * 	register to the onAltF4Blocked event to be noticed when a “block” was
     * 	triggered.
     */
    is_alt_f4_blocked?: boolean;
    /**
     * Opens developer tools in dedicated window.
     */
    dev_tools_window_style?: boolean;
    /**
     * For local-server debugging (like react apps). You can use this field to
     * set the localhost:port URL. Notes: You must have a local web server
     * installed on your machine. Valid only when loading unpacked extensions.
     * Valid only with "localhost" / "127.0.0.1".
     */
    debug_url: string;
    /**
     * Valid only for transparent windows. Valid only if enable_osr_acceleration
     * is on.
     */
    optimize_accelerate_rendering: boolean;
  }

  interface Size {
    width: number;
    height: number;
  }

  interface Point {
    top: number;
    left: number;
  }

  interface GetManifestResult extends Result, Manifest { }

  interface GetInfoResult extends Result {
    info: string;
  }

  interface GetRunningStateResult extends Result {
    isRunning: boolean;
  }

  interface UpdateExtensionResult extends Result {
    state?: string;
    info?: string;
    version?: string;
  }

  interface CheckForUpdateResult extends Result {
    state?: ExtensionUpdateState;
    updateVersion?: string;
  }

  interface ServiceProvidersDataResult extends Result {
    data: Dictionary<string>;
  }

  interface AppLaunchTriggeredEvent {
    origin: string;
    parameter: string;
  }

  interface ExtensionUpdatedEvent {
    version: string;
    state: ExtensionUpdateState
  }

  /**
   * The following types are related to the |onUncaughtException| event - which
   * is a different than the usual events.
   */
  type UncaughtExceptionCallback = (message: string,
    functionName: string,
    scriptName: string) => void;

  interface UncaughtExceptionEvent {
    addListener(callback: UncaughtExceptionCallback): void;
    removeListener(callback: UncaughtExceptionCallback): void;
  }

  /**
   * Launch an extension by its unique id.
   * @param uid The extension unique id.
   * @param parameter A parameter to pass to the extension. The extension may or
   * may not use this parameter.
   */
  function launch(uid: string, parameter?: any): void;

  /**
   * Sets a string for other extensions to read.
   * @param info A string to post.
   */
  function setInfo(info: any): void;

  /**
   * Gets an extension's info string.
   * @param id The id of the extension to get info for.
   * @param callback Called with the info.
   */
  function getInfo(id: string, callback: CallbackFunction<GetInfoResult>): void;

  /**
   * Requests info updates for extension. Will also be called when the extension
   * launches/closes.
   * @param id The id of the extension to get updates for.
   * @param eventsCallback A callback to receive info updates.
   * @param callback The status of the request.
   */
  function registerInfo(
    id: string,
    eventsCallback: (info: {
      status?: string;
      id?: string;
      info?: string;
      isRunning?: boolean;
    }) => void,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Stop requesting info for extension.
   * @param id The id of the extension to stop getting updates for.
   * @param callback The status of the request.
   */
  function unregisterInfo(id: string, callback: CallbackFunction<Result>): void;

  /**
   * Gets the running state of an extension.
   * @param id The id of the extension to get updates for.
   * @param callback The result of the request.
   */
  function getRunningState(
    id: string,
    callback: CallbackFunction<GetRunningStateResult>
  ): void;

  /**
   * Returns the requested extension's manifest object.
   * @param id The id of the extension to get the manifest for.
   * @param callback A function called with the manifest data.
   */
  function getManifest(
    id: string,
    callback: CallbackFunction<GetManifestResult>
  ): void;

  /**
   * The app will relaunch itself.
   */
  function relaunch(): void;

  /**
   * This functions allows apps to check and perform an update without having to
   * wait for Overwolf to do so.
   */
  function updateExtension(
    callback: CallbackFunction<UpdateExtensionResult>
  ): void;

  /**
   * Checks if an update is available for the calling extension.
   * @param callback
   */
  function checkForExtensionUpdate(
    callback: CallbackFunction<CheckForUpdateResult>
  ): void;

  /**
   * Return service providers manifest data.
   * @param callback
   */
  function getServiceConsumers(
    callback: CallbackFunction<ServiceProvidersDataResult>
  ): void;

  /**
   * Fires when the current app is launched while already running. This is
   * useful in the case where the app has custom logic for clicking its dock
   * button while it is already running. The event contaisn an 'origin'
   * string which what triggered the app launch (dock, storeapi, odk, etc...)
   */
  const onAppLaunchTriggered: Event<AppLaunchTriggeredEvent>;

  /**
   * Fires when the current app's newest version has been installed.
   * This most often means that an app relaunch is required in order for the
   * update to apply.
   */
  const onExtensionUpdated: Event<ExtensionUpdatedEvent>;

  /**
   * Called for global uncaught exceptions in a frame.
   */
  const onUncaughtException: UncaughtExceptionEvent;
}

declare namespace overwolf.extensions.current {
  interface GetExtraObject extends Result {
    object?: any;
  }

  /**
   * Retrieves an extra object (providing external APIs) registered in the
   * extension's manifest.
   * @param name The name of the object as appears in the manifest.
   * @param callback A function called with the extra object, if found, and a
   * status indicating success or failure.
   */
  function getExtraObject(
    name: string,
    callback: CallbackFunction<GetExtraObject>
  ): void;

  /**
   * Returns the current extension's manifest object.
   * @param callback A function called with the manifest data.
   */
  function getManifest(callback: CallbackFunction<GetManifestResult>): void;
}

declare namespace overwolf.extensions.sharedData {
  /**
   * Container that represent a shared data parameters.
   */
  interface SharedDataParams {
    origin?: string;
    target?: string;
  }

  interface GetResult extends Result {
    data: Dictionary<string>;
  }

  /**
   * Used by the owner app to set data for the consumer app, by appId.
   * @param appId The requested app id.
   * @param value 
   * @param callback 
   */
  function set(
    appId: string,
    value: any,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Used by the consumer app to get data set by the owner app.
   * @param param 
   * @param callback 
   */
  function get(
    param: SharedDataParams,
    callback: CallbackFunction<GetResult>
  ): void;

  interface onChangedEvent {
    origin: string;
    target: string;
    data: string;
  }
}

declare namespace overwolf.utils {
  namespace enums {
    const enum eStorePage {
      LoginPage = "LoginPage",
      OneAppPage = "OneAppPage",
      SubscriptionPage = "SubscriptionPage"
    }
  }

  interface Display {
    name: string;
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    is_primary: boolean;
  }

  interface GPUInfo {
    ChipType: string;
    Manufacturer: string;
    Name: string;
  }

  interface HardDiskInfo {
    Caption: string;
    IsSsd: boolean;
    Size: number;
  }

  interface InputDeviceInfo {
    id: number;
    type: string;
    vendor: number;
  }

  interface MonitorInfo {
    Dpix: number;
    Dpiy: number;
    IsMain: boolean;
    Location: string;
    Name: string;
    Resolution: string;
  }

  interface SystemInfo {
    AudioDevices?: string[];
    CPU?: string;
    GPUs?: GPUInfo[];
    HardDisks?: HardDiskInfo[];
    InputDevices?: InputDeviceInfo[];
    IsLaptop?: boolean;
    LogicalCPUCount?: number;
    Manufacturer?: string;
    MemorySize?: string;
    Model?: string;
    Monitors?: MonitorInfo[];
    Motherboard?: string;
    NetFramework?: string;
    NumberOfScreens?: number;
    OS?: string;
    OSBuild?: string;
    OSReleaseId?: string;
    PhysicalCPUCount?: number;
    VidEncSupport?: boolean;
  }

  interface OpenStoreParams {
    /**
     * The target app id.
     */
    uid: string;
    /**
     * Store page to open.
     */
    page: enums.eStorePage;
  }

  interface OpenFilePickerResult extends Result {
    url?: string;
  }

  interface OpenFolderPickerResult extends Result {
    path?: string;
  }

  interface GetSystemInformationResult extends Result {
    systemInfo?: SystemInfo;
  }

  interface IsTouchDeviceResult extends Result {
    isTouch?: boolean;
  }

  interface GetPeripheralsResult extends Result {
    peripherals?: { inputDevices: InputDeviceInfo[]; audioDevices: string[] };
  }

  interface IsMouseLeftButtonPressedResult extends Result {
    pressed?: boolean;
  }

  /**
   * Copies the given string to the clipboard.
   * @param data The string to be copied to the clipboard.
   */
  function placeOnClipboard(data: string): void;

  /**
   * Gets the string currently placed on the clipboard. If no string is placed
   * on the clipboard, returns null.
   * @param callback Called with the string from the clipboard.
   */
  function getFromClipboard(callback: (result: string) => void): void;

  /**
   * Returns an array with all monitors data including their display resolution,
   * bounds, and names.
   * @param callback Called with the monitors array.
   */
  function getMonitorsList(
    callback: (result: { displays: Display[] }) => void
  ): void;

  /**
   * Sends a string representing a key stroke to the game, causing a simulated
   * key stroke.
   * @param keyString The key or key combination to send, as a string. e.g.
   * "Alt+I"
   */
  function sendKeyStroke(keyString: string): void;

  /**
   * Opens a file picker dialog to browse for a file. A url to the selected file
   * will be returned.
   * @param filter A file filter. Supports wild cards (*) and seperated by
   * commas (,). Ex. myFile*.*,*.txt
   * @param callback Called with a url to the selected file.
   */
  function openFilePicker(
    filter: string,
    callback: CallbackFunction<OpenFilePickerResult>
  ): void;

  /**
   * Opens a Folder picker dialog to browse for a folder. A full path to the
   * selected folder will be returned.
   * @param initialPath The starting folder's path
   * @param callback Called with the selected folder.
   */
  function openFolderPicker(
    initialPath: string,
    callback: CallbackFunction<OpenFolderPickerResult>
  ): void;

  /**
   * Opens Windows Explorer and selects a file received as an Overwolf media
   * url.
   * @param url An overwolf media url (overwolf://media/*)
   * @param callback Called with the result of the request.
   */
  function openWindowsExplorer(
    url: string,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Returns whether the current device has touch capabilities.
   * @param callback Called with the result of the request.
   */
  function isTouchDevice(callback: CallbackFunction<IsTouchDeviceResult>): void;

  /**
   * Opens the url in the user's default browser.
   * @param url A url to open.
   */
  function openUrlInDefaultBrowser(url: string): void;

  /**
   * Opens the url in Overwolf's browser.
   * @param url A url to open.
   */
  function openUrlInOverwolfBrowser(url: string, targetTabName?: string): void;

  /**
   * Returns system information which includes information about CPU, Monitors,
   * GPU, HDD, RAM and more.
   * @param callback Called with the system information.
   */
  function getSystemInformation(
    callback: (result: GetSystemInformationResult) => void
  ): void;

  /**
   * Sends Overwolf logs to Overwolf servers for debugging.
   * @param description The reason for sending the logs.
   * @param callback A callback with the status of the request.
   */
  function sendLogs(
    description: string,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Upload Overwolf client logs to Overwolf servers for current calling app.
   * @param callback A callback with the status of the request.
   */
  function uploadClientLogs(callback: CallbackFunction<Result>): void;

  /**
   * Returns system Peripherals information.
   * @param callback Called with the system information.
   */
  function getPeripherals(callback: () => void): void;

  /**
   * Open Overwolf store one app page.
   * @param appId The requesterd app id.
   */
  function openStoreOneAppPage(appId: string): void;

  /**
   * Opens the requested app’s profile/login/subscription page in the Overwolf
   * Appstore.
   * @param param The requested store page.
   */
  function openStore(param: OpenStoreParams): void;

  /**
   * Simulate Mouse click on current mouse Position.
   * @param callback A callback with the status of the request.
   */
  function simulateMouseClick(callback: CallbackFunction<Result>): void;

  /**
   * Simulate Mouse click on {x,y} mouse Position.
   * @param x The Mouse X position.
   * @param y The Mouse Y position.
   * @param callback A callback with the status of the request.
   */
  function simulateMouseClick(
    x: number,
    y: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Is mouse left button pressed.
   * @param callback A callback with the result.
   */
  function isMouseLeftButtonPressed(
    callback: CallbackFunction<IsMouseLeftButtonPressedResult>
  ): void;
}

declare namespace overwolf.settings {
  namespace enums {
    const enum ResolutionSettings {
      Original = "Original",
      R1080p = "R1080p",
      R720p = "R720p",
      R480p = "R480p"
    }

    const enum eIndicationPosition {
      None = -1,
      TopLeftCorner = 0,
      TopRightCorner = 1,
      BottomLeftCorner = 2,
      BottomRightCorner = 3
    }
  }

  interface FpsSettings {
    offset?: { x: number; y: number };
    scale?: number;
    enabled?: boolean;
    position?: enums.eIndicationPosition;
  }

  interface GetHotKeyResult extends Result {
    hotkey: string;
    isEnabled: boolean;
  }

  interface HotKeyResult extends Result {
    featureId?: string;
  }

  interface FolderResult extends Result {
    path: string;
  }

  interface GetAudioCaptureSettingsResult extends Result {
    sound_enabled: boolean;
    microphone_enabled: boolean;
  }

  interface GetFpsSettingsResult extends Result {
    settings: FpsSettings;
  }

  interface FpsSettingsChangedEvent {
    setting: "OnScreenLocation" | "Enabled" | "Scale" | "Offset";
  }

  interface VideoCaptureSettingsChangedEvent {
    setting: "resolution" | "fps" | "unknown";
  }

  interface AudioCaptureSettingsChangedEvent {
    setting: "speakers" | "microphone" | "unknown";
  }

  interface HotKeyChangedEvent {
    source: string;
    description: string;
    hotkey: string;
  }

  /**
   * Returns the hotkey assigned to a given feature id by calling the callback.
   * @param featureId The feature id for which to get the set hotkey.
   * @param callback A function called with the result of the request which
     contains the hotkey if successful.
   */
  function getHotKey(
    featureId: string,
    callback: CallbackFunction<GetHotKeyResult>
  ): void;

  /**
   * Registers a callback for a given hotkey action. If the registration had
   * failed, the callback function will be called immediately with the status
   * "error" and another property, "error", indicating the reason for the
   * failure. Otherwise, the callback function will be called when the hotkey is
   * pressed and the status will be "success". Note that Shift can only be
   * combined with F keys.
   * @param actionId The action id for which to register the callback.
   * @param callback The function to run when the hotkey is pressed.
   */
  function registerHotKey(
    actionId: string,
    callback: CallbackFunction<HotKeyResult>
  ): void;

  /**
   * Returns the current language overwolf is set to in a two letter ISO name
   * format.
   * @param callback
   */
  function getCurrentOverwolfLanguage(
    callback: (result: { language: string }) => void
  ): void;

  /**
   * Returns the current folder overwolf uses to store screenshots (and gifs).
   * @param callback
   */
  function getOverwolfScreenshotsFolder(
    callback: CallbackFunction<FolderResult>
  ): void;

  /**
   * Sets the folder Overwolf uses to store screenshots.
   * @param path The folder to use
   * @param callback Whether the request was successful
   */
  function setOverwolfScreenshotsFolder(
    path: string,
    callback: CallbackFunction<FolderResult>
  ): void;

  /**
   * Returns the current folder overwolf uses to store videos.
   * @param callback
   */
  function getOverwolfVideosFolder(
    callback: CallbackFunction<FolderResult>
  ): void;

  /**
   * Sets the folder Overwolf uses to store videos.
   * @param path The folder to use
   * @param callback Whether the request was successful
   */
  function setOverwolfVideosFolder(
    path: string,
    callback: CallbackFunction<FolderResult>
  ): void;

  /**
   * Returns the current video capture settings.
   * @param callback
   */
  function getVideoCaptureSettings(
    callback: (result: {
      enconder: string;
      preset: string;
      fps: number;
      resolution: number;
    }) => void
  ): void;

  /**
   * Sets new video capture settings.
   * @param resolutionSettings
   * @param fps
   * @param callback
   */
  function setVideoCaptureSettings(
    resolutionSettings: enums.ResolutionSettings,
    fps: number,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Returns the current audio capture settings.
   * @param callback
   */
  function getAudioCaptureSettings(
    callback: CallbackFunction<GetAudioCaptureSettingsResult>
  ): void;

  /**
   * Sets new audio capture settings.
   * @param enableSound
   * @param enableMicrophone
   * @param callback
   */
  function setAudioCaptureSettings(
    enableSound: boolean,
    enableMicrophone: boolean,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Sets the state (on/off), position, offset (in pixels) and scale [0, 1] of
   * the Fps control.
   * @param settings
   * @param callback
   */
  function setFpsSettings(
    settings: FpsSettings,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Gets the status of the FPS control (on/off), its position, its offset (in
   * pixels) and its scale [0, 1].
   * @param callback
   */
  function getFpsSettings(
    callback: CallbackFunction<GetFpsSettingsResult>
  ): void;

  /**
   * Fired when fps settings are changed.
   */
  const onFpsSettingsChanged: Event<FpsSettingsChangedEvent>;

  /**
   * Fired when video capture settings are changed.
   */
  const OnVideoCaptureSettingsChanged: Event<VideoCaptureSettingsChangedEvent>;

  /**
   * Fired when audio capture settings are changed.
   */
  const OnAudioCaptureSettingsChanged: Event<AudioCaptureSettingsChangedEvent>;

  /**
   * Fired when a hotkey is modified. Apps will only be notified ofhotkey
   * changes that relate to them.
   */
  const OnHotKeyChanged: Event<HotKeyChangedEvent>;
}

declare namespace overwolf.settings.games {
  interface GameClassResult extends Result {
    gameClassId: number;
  }

  interface OverlayEnablementChangedEvent {
    gameId: number;
    enabled: boolean;
  }

  interface AutoLaunchEnablementChangedEvent {
    gameId: number;
    enabled: boolean;
    appId: string;
  }

  /**
   * Returns the current Overlay setting for the given game (if any exist)
   * @param gameClassId the game id for which the flag is retrieved for
   * @param callback
   */
  function getOverlayEnabled(
    gameClassId: number,
    callback: CallbackFunction<GameClassResult>
  ): void;

  /**
   * Returns the current Auto-Launch enabled setting for the calling app ina
   * given game (gameClassId)
   * @param gameClassId the game id for which the flag is retrieved for
   * @param callback
   */
  function getAutoLaunchEnabled(
    gameClassId: number,
    callback: CallbackFunction<GameClassResult>
  ): void;

  /**
   * Fired when the overlay is enabled or disabled for a game.
   */
  const onOverlayEnablementChanged: Event<OverlayEnablementChangedEvent>;

  /**
   * Fired when auto launch is enabled or disabled for a game.
   */
  const onAutoLaunchEnablementChanged: Event<AutoLaunchEnablementChangedEvent>;
}

declare namespace overwolf.social {
  interface GetUserInfoResult<T> extends Result {
    userInfo?: T;
  }

  interface LoginStateChangedEvent {
    status: "connected" | "disconnected";
  }
}

declare namespace overwolf.social.discord {
  const enum PostPermission {
    None = 0,
    Text,
    File
  }

  interface User {
    id: string;
    discriminator: number;
    username: string;
    email: string;
    avatar?: string;
    verified: boolean;
  }

  interface Guild {
    icon?: string;
    id: string;
    name: string;
    owner_id?: string;
    roles?: Role[];
  }

  interface Role {
    id: string;
    name: string;
    permissions: number;
  }

  interface Channel {
    guild_id: string;
    id: string;
    name: string;
    parent_id?: string;
    permission_overwrites: PermissionOverwrite[];
    type: number;
    user_post_permission: PostPermission;
  }

  interface PermissionOverwrite {
    id: string;
    type: string;
    allow: number;
    deny: number;
  }

  interface ShareParameters {
    file: string;
    channelId: string;
    message: string;
    trimming: media.videos.VideoCompositionSegment;
    events: string[];
    gameClassId: number;
    gameTitle: string;
    metadata: any;
  }

  interface GetGuildsResult extends Result {
    guilds?: Guild[];
  }

  interface GetChannelsResult extends Result {
    channels?: Channel[];
  }

  /**
   * Opens the login dialog. There is no callback for this method and the only
   * way to know if the user signed in is via `onLoginStateChanged`.
   */
  function performUserLogin(): void;

  /**
   * Performs a "strong" sign out of Discord, so that even if the user performs
   * a login via the Overwolf Settings / Accounts page, they will be considered
   * signed out.
   * @param callback
   */
  function performLogout(callback: CallbackFunction<Result>): void;

  /**
   * If the user is currently logged into Discord, this will return user
   * information. Otherwise, an error is returned.
   * @param callback Will contain user information or error if the request has
   * failed.
   */
  function getUserInfo(callback: CallbackFunction<GetUserInfoResult<User>>): void;

  /**
   * If the user is currently logged into Discord, this will return the guilds
   * that the user is registered to. Otherwise, an error is returned
   * @param callback Will contain guild (server) information or error if the
   * request has failed.
   */
  function getGuilds(callback: CallbackFunction<GetGuildsResult>): void;

  /**
   * If the user is currently logged into Discord, this will return the channels
   * of the given `guildId`, for which the user has privileges to share
   * images/videos to. Otherwise, an error is returned
   * @param guildId The id of the guild
   * @param callback Will contain guild (server) channels or error if the
   * request has failed.
   */
  function getChannels(
    guildId: string,
    callback: CallbackFunction<GetChannelsResult>
  ): void;

  /**
   * If the user is currently logged into Discord, this will perform the media
   * share (image or video).Possible errors that can occur:- Disconnected (user
   * isn't signed in)- MissingFile (trying to share a missing file)-
   * UnsupportedFile (trying to share an unsupported format)- ExceedsMaxSize
   * (the file is too large: > 8 MB for images, > 100 MBfor videos)
   * @param discordShareParams The share parameters. See DiscordShareParameters
   * @param callback Will contain the status of the request.
   */
  function share(
    discordShareParams: ShareParameters,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Fired when the user's login state changes.
   */
  const onLoginStateChanged: Event<LoginStateChangedEvent>;
}

declare namespace overwolf.social.gfycat {
  interface User {
    userId: string;
    email: string;
    emailVerified: boolean;
    profileImageUrl: string;
    username: string;
    canonicalUsername: string;
    views: number;
    followers: number;
    following: number;
    publishedGyfcats: number;
    totalGyfcats: number;
    url: string;
  }

  interface ShareParamaeters {
    file: string;
    trimming: media.videos.VideoCompositionSegment;
    title: string;
    privateMode: boolean;
    tags: string[];
    gameClassId: number;
    metadata: any;
  }

  /**
   * Opens the login dialog. There is no callback for this method and theonly
   * way to know if the user signed in is via `onLoginStateChanged`.
   */
  function performUserLogin(): void;

  /**
   * Performs a "strong" sign out of Gfycat, so that even if the userperforms a
   * login via the Overwolf Settings / Accounts page, he willbe considered
   * signed out.
   * @param callback
   */
  function performLogout(callback: CallbackFunction<Result>): void;

  /**
   * If the user is currently logged into Gfycat, this will return
   * userinformation:
   * https://developers.gfycat.com/api/#getting-the-authenticated-user-s-details
   * Otherwise, an error is returned.
   * @param callback Will contain user information or error if the request has
   * failed.
   */
  function getUserInfo(
    callback: CallbackFunction<GetUserInfoResult<User>>
  ): void;

  /**
   * Possible errors that can occur:- Disconnected (user isn't signed in)-
   * MissingFile (trying to share a missing file)- UnsupportedFile (trying to
   * share an unsupported format)- ExceedsMaxSize (the file is too large: > 8 MB
   * for images, > 100 MBfor videos)
   * @param gfycatShareParams The share parameters. See GfycatShareParameters
   * @param callback Will contain the status of the request.
   */
  function share(
    gfycatShareParams: ShareParamaeters,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Fired when a media event has been posted.
   */
  const onLoginStateChanged: Event<LoginStateChangedEvent>;
}

declare namespace overwolf.social.twitter {
  interface ShareParamaeters {
    file: string;
    message: string;
    trimming: media.videos.VideoCompositionSegment;
    tags: string[];
    gameClassId: number;
    gameTitle: string;
    metadata: any;
  }

  interface User {
    id: string;
    screenName: string;
    name: string;
    email: string;
    avatar: string;
  }

  /**
   * Opens the login dialog. There is no callback for this method and theonly
   * way to know if the user signed in is via `onLoginStateChanged`.
   */
  function performUserLogin(): void;

  /**
   * Performs a "strong" sign out of Twitter, so that even if the userperforms a
   * login via the Overwolf Settings / Accounts page, he will be considered
   * signed out.
   * @param callback
   */
  function performLogout(callback: CallbackFunction<Result>): void;

  /**
   * If the user is currently logged into Twitter, this will return
   * userinformation:{ avatar: "http://abs.twimg.com/sticky/...", id:
   * "111111111112222222" name: "full name" screenName:
   * "screenname123"}
   * Otherwise, an error is returned.
   * @param callback Will contain user information or error if the request has
   * failed.
   */
  function getUserInfo(
    callback: CallbackFunction<GetUserInfoResult<User>>
  ): void;

  /**
   * If the user is currently logged into Twitter, this will perform the media
   * share (image or video).
   * @param twitterShareParams The share parameters.
   * @param callback Will contain the status of the request.
   */
  function share(
    twitterShareParams: ShareParamaeters,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Fired when the user's login state changes.
   */
  const onLoginStateChanged: Event<LoginStateChangedEvent>;
}

declare namespace overwolf.social.youtube {
  const enum Privacy {
    Public = "Public",
    Unlisted = "Unlisted",
    Private = "Private"
  }

  interface ShareParamaeters {
    file: string;
    title: string;
    description: string;
    trimming: media.videos.VideoCompositionSegment;
    privacy: Privacy;
    tags: string[];
    gameClassId: number;
    gameTitle: string;
    metadata: any;
  }

  interface User {
    name: string;
    picture: string;
    id: string;
  }

  /**
   * Opens the login dialog. There is no callback for this method and the only
   * way to know if the user signed in is via `onLoginStateChanged`.
   */
  function performUserLogin(): void;

  /**
   * Performs a "strong" sign out of YouTube, so that even if the user performs
   * a login via the Overwolf Settings / Accounts page, he will be considered
   * signed out.
   * @param callback
   */
  function performLogout(callback: CallbackFunction<Result>): void;

  /**
   * If the user is currently logged into YouTube, this will return user
   * information:
   * {
   *   avatar: "http://abs.twimg.com/sticky/...", id: "111111111112222222",
   *   name: "full name", screenName: "screenname123"
   * }
   * Otherwise, an error is returned.
   * @param callback Will contain user information or error if the request has
   * failed.
   */
  function getUserInfo(
    callback: CallbackFunction<GetUserInfoResult<User>>
  ): void;

  /**
   * If the user is currently logged into YouTube, this will perform the video
   * share.
   *
   * Possible errors that can occur:
   * - Disconnected (user isn't signed in)
   * - MissingFile (trying to share a missing file)
   * - UnsupportedFile (trying to share an unsupported format)
   * @param youTubeShareParams The share parameters.
   * @param callback Will contain the status of the request.
   */
  function share(
    youTubeShareParams: ShareParamaeters,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Fired when the user's login state changes.
   */
  const onLoginStateChanged: Event<LoginStateChangedEvent>;
}

declare namespace overwolf.social.reddit {
  interface ShareParamaeters {
    /**
     * The file to share.
     */
    file: string;
    /**
     * The subreddit to which the file will be shared.
     */
    subreddit: string;
    /**
     * The shared video's title.
     */
    title: string;
    /**
     * The shared video's description.
     */
    description: string;
    /**
     * An object containing start time and end time for the desired video
     * segment.
     * Optional parameter.
     */
    trimming?: media.videos.VideoCompositionSegment;
    /**
     * An array of chronological events that occurred during the capture.
     * Optional parameter.
     */
    tags?: string[];
    /**
     * The associated game's class ID.
     * Optional parameter.
     */
    gameClassId?: number;
    /**
     * The associated game's title.
     * Optional parameter.
     */
    gameTitle?: string;
    /**
     * Extra information about the game session.
     * Optional parameter.
     */
    metadata?: any;
  }

  interface User {
    subreddit: UserSubreddit;
    name: string;
  }

  interface UserSubreddit {
    icon_img: string;
    display_name_prefixed: string;
  }

  interface Subreddit {
    numSubscribers: number;
    name: string;
    displayName: string;
    allowedPostTypes: RedditAllowedPostTypes;
    communityIcon: string;
  }

  interface RedditAllowedPostTypes {
    images: boolean;
    text: boolean;
    videos: boolean;
    links: boolean;
    spoilers: boolean;
  }

  interface SearchSubredditsResult extends Result {
    subreddits?: Subreddit[];
  }

  interface ShareFailedEvent {
    error: string;
    details?: string;
  }

  /**
   * Opens the login dialog. There is no callback for this method and the only
   * way to know if the user signed in is via `onLoginStateChanged`.
   */
  function performUserLogin(): void;

  /**
   * Performs a "strong" sign out of Reddit, so that even if the user performs
   * a login via the Overwolf Settings / Accounts page, he will be considered
   * signed out.
   * @param callback
   */
  function performLogout(callback: CallbackFunction<Result>): void;

  /**
   * If the user is currently logged into Reddit, this will return user
   * information:
   * {
   *   userInfo: {
   *     avatar: "http://abs.twimg.com/sticky/...",
   *     displayName: "u/foobar",
   *     name: "foobar"
   *   }
   * }
   * Otherwise, an error is returned.
   * @param callback Will contain user information or error if the request has
   * failed.
   */
  function getUserInfo(
    callback: CallbackFunction<GetUserInfoResult<User>>
  ): void;

  /**
   * Search for subreddits whose names begin with a substring.
   * @param query The search string.
   * @param callback Will contain an array of subreddits that match the search
   * string.
   */
  function searchSubreddits(
    query: string,
    callback: CallbackFunction<SearchSubredditsResult>
  ): void;

  /**
   * If the user is currently logged into Reddit, this will perform the video
   * share.
   *
   * Possible errors that can occur:
   * - Disconnected (user isn't signed in)
   * - MissingFile (trying to share a missing file)
   * - UnsupportedFile (trying to share an unsupported format)
   * @param youTubeShareParams The share parameters.
   * @param callback Will contain the status of the request.
   */
  function share(
    youTubeShareParams: ShareParamaeters,
    callback: CallbackFunction<Result>
  ): void;

  /**
   * Fired when the user's login state changes.
   */
  const onLoginStateChanged: Event<LoginStateChangedEvent>;

  /**
   * Fired when an error is returned from Reddit.
   */
  const onShareFailed: Event<ShareFailedEvent>;
}
