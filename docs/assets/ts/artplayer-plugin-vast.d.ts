// Generated from the package public declaration by yarn build:ts. Do not edit.
/* eslint-disable ts/no-redeclare -- Callable and public type namespace intentionally merge. */
/* eslint-disable ts/method-signature-style, ts/consistent-type-definitions -- Preserve upstream SDK declaration shapes. */
declare namespace artplayerPluginVastDefinitions {
  export namespace google {
    /**
     * The Google IMA SDK for HTML5 V3 allows developers to request and track VAST ads in a HTML5 video environment. For platform compatibility information and a detailed list of the video ad features supported by each of the IMA SDKs, see Support and Compatibility.
     *
     * Download the code samples to assist with implementing the IMA HTML5 SDK.
     */
    namespace ima {
      /**
       * An ad class that's extended by classes representing different ad types.
       */
      interface Ad {
        /**
         * Ad ID is used to synchronize master ad and companion ads.
         * @returns The ID of the ad, or the empty string if this information is unavailable.
         */
        getAdId(): string
        /**
         * Returns the ad's pod information.
         * @returns The ad's pod information.
         */
        getAdPodInfo(): AdPodInfo
        /**
         * The source ad server information included in the ad response.
         * @returns The source ad server of the ad, or the empty string if this information is unavailable.
         */
        getAdSystem(): string
        /**
         * The advertiser name as defined by the serving party.
         * @returns The advertiser name, or the empty string if this information is unavailable.
         */
        getAdvertiserName(): string
        /**
         * Identifies the API needed to execute the ad. This corresponds with the apiFramework specified in vast.
         * @returns The API framework need to execute the ad, or null if this information is unavailable.
         */
        getApiFramework(): string | null
        /**
         * Gets the companion ads for this ad based on companion ad slot size. Optionally, advanced selection settings are accepted. Note that this method will only return non-empty array for ad instances acquired on or after STARTED event. Specifically, ads from the LOADED event will return an empty array.
         * @param adSlotWidth Width of the companion ad slot.
         * @param adSlotHeight Height of the companion ad slot.
         * @param settings The selection settings for companion ads.
         * @returns Array of companion ads that matches the settings and the slot size.
         */
        getCompanionAds(adSlotWidth: number, adSlotHeight: number, settings?: CompanionAdSelectionSettings): CompanionAd[]
        /**
         * Returns the content type of the currently selected creative, or empty string if no creative is selected or the content type is unavailable. For linear ads, the content type is only going to be available after the START event, when the media file is selected.
         * @returns The content type, empty string if not available.
         */
        getContentType(): string
        /**
         * Returns the ISCI (Industry Standard Commercial Identifier) code for an ad, or empty string if the code is unavailable. This is the Ad-ID of the creative in the VAST response.
         */
        getCreativeAdId(): string
        /**
         * Retrieves the ID of the selected creative for the ad.
         * @returns The ID of the selected creative for the ad, or the empty string if this information is unavailable.
         */
        getCreativeId(): string
        /**
         * Returns the first deal ID present in the wrapper chain for the current ad, starting from the top. Returns the empty string if unavailable.
         */
        getDealId(): string
        /**
         * Returns the description of this ad from the VAST response.
         * @returns The description, empty if not specified.
         */
        getDescription(): string
        /**
         * Returns the duration of the selected creative, or -1 for non-linear creatives.
         * @returns The selected creative duration in seconds, -1 if non-linear.
         */
        getDuration(): number
        /**
         * Returns the height of the selected non-linear creative.
         * @returns The height of the selected non-linear creative or 0 for a linear creative.
         */
        getHeight(): number
        /**
         * Returns the URL of the media file chosen from the ad based on the media selection settings currently in use. Returns null if this information is unavailable. Available on STARTED event.
         */
        getMediaUrl(): string | null
        /**
         * Returns the minimum suggested duration in seconds that the nonlinear creative should be displayed. Returns -2 if the minimum suggested duration is unknown. For linear creative it returns the entire duration of the ad.
         * @returns The minimum suggested duration in seconds that a creative should be displayed.
         */
        getMinSuggestedDuration(): number
        /**
         * The number of seconds of playback before the ad becomes skippable. -1 is returned for non skippable ads or if this is unavailable.
         * @returns The offset in seconds, or -1.
         */
        getSkipTimeOffset(): number
        /**
         * Returns the URL associated with the survey for the given ad. Returns null if unavailable.
         */
        getSurveyUrl(): string | null
        /**
         * Returns the title of this ad from the VAST response.
         * @returns The title, empty if not specified.
         */
        getTitle(): string
        /**
         * Gets custom parameters associated with the ad at the time of ad trafficking.
         * @returns A mapping of trafficking keys to their values, or the empty Object if this information is not available.
         */
        getTraffickingParameters(): any
        /**
         * Gets custom parameters associated with the ad at the time of ad trafficking. Returns a raw string version of the parsed parameters from getTraffickingParameters.
         * @returns Trafficking parameters, or the empty string if this information is not available.
         */
        getTraffickingParametersString(): string
        /**
         * Returns the UI elements that are being displayed when this ad is played. Refer to UiElements for possible elements of the array returned.
         * @returns The UI elements being displayed.
         */
        getUiElements(): UiElements[]
        /**
         * The registry associated with cataloging the UniversalAdId of the selected creative for the ad.
         * @returns Returns the registry value, or "unknown" if unavailable.
         */
        getUniversalAdIdRegistry(): string
        /**
         * The UniversalAdId of the selected creative for the ad.
         * @returns Returns the id value or "unknown" if unavailable.
         */
        getUniversalAdIdValue(): string
        /**
         * Returns the VAST media height of the selected creative.
         * @returns The VAST media height of the selected creative or 0 if none is selected.
         */
        getVastMediaHeight(): number
        /**
         * Returns the VAST media width of the selected creative.
         * @returns The VAST media width of the selected creative or 0 if none is selected.
         */
        getVastMediaWidth(): number
        /**
         * Returns the width of the selected creative.
         * @returns The width of the selected non-linear creative or 0 for a linear creative.
         */
        getWidth(): number
        /**
         * Ad IDs used for wrapper ads. The IDs returned starts at the inline ad (innermost) and traverses to the outermost wrapper ad. An empty array is returned if there are no wrapper ads.
         * @returns The IDs of the ads, starting at the inline ad, or an empty array if there are no wrapper ads.
         */
        getWrapperAdIds(): string[]
        /**
         * Ad systems used for wrapper ads. The ad systems returned starts at the inline ad and traverses to the outermost wrapper ad. An empty array is returned if there are no wrapper ads.
         * @returns The ad systems of the ads, starting at the inline ad, or an empty array if there are no wrapper ads.
         */
        getWrapperAdSystems(): string[]
        /**
         * Selected creative IDs used for wrapper ads. The creative IDs returned starts at the inline ad and traverses to the outermost wrapper ad. An empty array is returned if there are no wrapper ads.
         * @returns The IDs of the ads' creatives, starting at the inline ad, or an empty array if there are no wrapper ads.
         */
        getWrapperCreativeIds(): string[]
        /**
         * Indicates whether the ad’s current mode of operation is linear or non-linear. If the value is true, it indicates that the ad is in linear playback mode; if false, it indicates non-linear mode. The player checks the linear property and updates its state according to the details of the ad placement. While the ad is in linear mode, the player pauses the content video. If linear is true initially, and the ad is a pre-roll (defined externally), the player may choose to delay loading the content video until near the end of the ad playback.
         * @returns True if the ad is linear, false otherwise.
         */
        isLinear(): boolean
      }
      /**
       * This class represents a container for displaying ads. The SDK will automatically create structures inside the containerElement parameter to house video and overlay ads.
       *
       * When an instance of this class is created, it creates an IFRAME in the containerElement and loads the SDK core. This IFRAME must be preserved in order for the SDK to function properly. Once all ads have been played and the SDK is no longer needed, use the destroy() method to unload the SDK.
       *
       * The containerElement parameter must be an element that is part of the DOM. It is necessary to correctly position the containerElement in order for the ads to be displayed correctly. It is recommended to position it above the content video player and size it to cover the whole video player. Please refer to the SDK documentation for details about recommended implementations.
       */
      class AdDisplayContainer {
        /**
         *
         * @param containerElement The element to display the ads in. The element must be inserted into the DOM before creating ima.AdDisplayContainer.
         * @param videoElement Specifies the alternative video ad playback element. We recommend always passing in your content video player. Refer to Custom Ad Playback for more information.
         * @param clickTrackingElement Specifies the alternative video ad click element. Leave this null to let the SDK handle clicks. Even if supplied, the SDK will only use the custom click tracking element when non-AdSense/AdX creatives are displayed in environments that do not support UI elements overlaying a video player (e.g. iPhone or pre-4.0 Android). The custom click tracking element should never be rendered over the video player because it can intercept clicks to UI elements that the SDK renders. Also note that the SDK will not modify the visibility of the custom click tracking element. This means that if a custom click tracking element is supplied, it must be properly displayed when the linear ad is played. You can check ima.AdsManager.isCustomClickTrackingUsed when the google.ima.AdEvent.Type.STARTED event is fired to determine whether or not to display your custom click tracking element. If appropriate for your UI, you should hide the click tracking element when the google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED event fires.
         */
        constructor(containerElement: HTMLElement, videoElement?: HTMLVideoElement, clickTrackingElement?: HTMLElement)
        /**
         * Destroys internal state and previously created DOM elements. The IMA SDK will be unloaded and no further calls to any APIs should be made.
         */
        public destroy(): void
        /**
         * Initializes the video playback. On mobile platforms, including iOS and Android browsers, first interaction with video playback is only allowed within a user action (a click or tap) to prevent unexpected bandwidth costs. Call this method as a direct result of a user action before starting the ad playback. This method has no effect on desktop platforms and when custom video playback is used.
         */
        public initialize(): void
      }
      /**
       * AdError surfaces information to the user about whether a failure occurred during ad loading or playing. The errorType accessor provides information about whether the error occurred during ad loading or ad playing.
       */
      class AdError extends Error {
        /**
         * Constructs the ad error based on the error data.
         * @param data The ad error message data.
         * @returns The constructed ad error object.
         */
        public static deserialize(data: any): AdError
        /**
         * @returns The error code, as defined in google.ima.AdError.ErrorCode.
         */
        public getErrorCode(): AdError.ErrorCode
        /**
         * Returns the Error that caused this one.
         * @returns Inner error that occurred during processing, or null if this information is unavailable. This error may either be a native error or an google.ima.AdError, a subclass of a native error. This may return null if the error that caused this one is not available.
         */
        public getInnerError(): Error | null
        /**
         * @returns The message for this error.
         */
        public getMessage(): string
        /**
         * @returns The type of this error, as defined in google.ima.AdError.Type.
         */
        public getType(): string
        /**
         * @returns If VAST error code is available, returns it, otherwise returns ima.AdError.ErrorCode.UNKNOWN_ERROR.
         */
        public getVastErrorCode(): number
        /**
         * Serializes an ad to JSON-friendly object for channel transmission.
         * @returns The transmittable ad error.
         */
        public serialize(): any
        public toString(): string
      }
      namespace AdError {
        /**
         * The possible error codes raised while loading or playing ads.
         */
        enum ErrorCode {
          /**
           * There was a problem requesting ads from the server. VAST error code 1012
           */
          ADS_REQUEST_NETWORK_ERROR = 1012,
          /**
           * There was an error with asset fallback. VAST error code 1021
           */
          ASSET_FALLBACK_FAILED = 1021,
          /**
           * The browser prevented playback initiated without user interaction. VAST error code 1205
           */
          AUTOPLAY_DISALLOWED = 1205,
          /**
           * A companion ad failed to load or render. VAST error code 603
           */
          COMPANION_AD_LOADING_FAILED = 603,
          /**
           * Unable to display one or more required companions. The master ad is discarded since the required companions could not be displayed. VAST error code 602
           */
          COMPANION_REQUIRED_ERROR = 602,
          /**
           * There was a problem requesting ads from the server. VAST error code 1005
           */
          FAILED_TO_REQUEST_ADS = 1005,
          /**
           * The ad tag url specified was invalid. It needs to be properly encoded. VAST error code 1013
           */
          INVALID_AD_TAG = 1013,
          /**
           * An invalid AdX extension was found. VAST error code 1105
           */
          INVALID_ADX_EXTENSION = 1105,
          /**
           * Invalid arguments were provided to SDK methods. VAST error code 1101
           */
          INVALID_ARGUMENTS = 1101,
          /**
           * Unable to display NonLinear ad because creative dimensions do not align with creative display area (i.e. creative dimension too large). VAST error code 501
           */
          NONLINEAR_DIMENSIONS_ERROR = 501,
          /**
           * An overlay ad failed to load. VAST error code 502
           */
          OVERLAY_AD_LOADING_FAILED = 502,
          /**
           * An overlay ad failed to render. VAST error code 500
           */
          OVERLAY_AD_PLAYING_FAILED = 500,
          /**
           * There was an error with stream initialization during server side ad insertion. VAST error code 1020
           */
          STREAM_INITIALIZATION_FAILED = 1020,
          /**
           * The ad response was not understood and cannot be parsed. VAST error code 1010
           */
          UNKNOWN_AD_RESPONSE = 1010,
          /**
           * An unexpected error occurred and the cause is not known. Refer to the inner error for more information. VAST error code 900
           */
          UNKNOWN_ERROR = 900,
          /**
           * Locale specified for the SDK is not supported. VAST error code 1011
           */
          UNSUPPORTED_LOCALE = 1011,
          /**
           * No assets were found in the VAST ad response. VAST error code 1007
           */
          VAST_ASSET_NOT_FOUND = 1007,
          /**
           * Empty VAST response. VAST error code 1009
           */
          VAST_EMPTY_RESPONSE = 1009,
          /**
           * Assets were found in the VAST ad response for linear ad, but none of them matched the video player's capabilities. VAST error code 403
           */
          VAST_LINEAR_ASSET_MISMATCH = 403,
          /**
           * The VAST URI provided, or a VAST URI provided in a subsequent wrapper element, was either unavailable or reached a timeout, as defined by the video player. The timeout is 5 seconds for initial VAST requests and each subsequent wrapper. VAST error code 301
           */
          VAST_LOAD_TIMEOUT = 301,
          /**
           * The ad response was not recognized as a valid VAST ad. VAST error code 100
           */
          VAST_MALFORMED_RESPONSE = 100,
          /**
           * Failed to load media assets from a VAST response. The default timeout for media loading is 8 seconds. VAST error code 402
           */
          VAST_MEDIA_LOAD_TIMEOUT = 402,
          /**
           * No Ads VAST response after one or more wrappers. VAST error code 303
           */
          VAST_NO_ADS_AFTER_WRAPPER = 303,
          /**
           * Assets were found in the VAST ad response for nonlinear ad, but none of them matched the video player's capabilities. VAST error code 503
           */
          VAST_NONLINEAR_ASSET_MISMATCH = 503,
          /**
           * Problem displaying MediaFile. Currently used if video playback is stopped due to poor playback quality. VAST error code 405
           */
          VAST_PROBLEM_DISPLAYING_MEDIA_FILE = 405,
          /**
           * VAST schema validation error. VAST error code 101
           */
          VAST_SCHEMA_VALIDATION_ERROR = 101,
          /**
           * The maximum number of VAST wrapper redirects has been reached. VAST error code 302
           */
          VAST_TOO_MANY_REDIRECTS = 302,
          /**
           * Trafficking error. Video player received an ad type that it was not expecting and/or cannot display. VAST error code 200
           */
          VAST_TRAFFICKING_ERROR = 200,
          /**
           * VAST duration is different from the actual media file duration. VAST error code 202
           */
          VAST_UNEXPECTED_DURATION_ERROR = 202,
          /**
           * Ad linearity is different from what the video player is expecting. VAST error code 201
           */
          VAST_UNEXPECTED_LINEARITY = 201,
          /**
           * The ad response contained an unsupported VAST version. VAST error code 102
           */
          VAST_UNSUPPORTED_VERSION = 102,
          /**
           * General VAST wrapper error. VAST error code 300
           */
          VAST_WRAPPER_ERROR = 300,
          /**
           * There was an error playing the video ad. VAST error code 400
           */
          VIDEO_PLAY_ERROR = 400,
          /**
           * A VPAID error occurred. Refer to the inner error for more information. VAST error code 901
           */
          VPAID_ERROR = 901,
        }
        /**
         * The possible error types for ad loading and playing.
         */
        enum Type {
          /**
           * Indicates that the error was encountered when the ad was being loaded. Possible causes: there was no response from the ad server, malformed ad response was returned, or ad request parameters failed to pass validation.
           */
          AD_LOAD = 'adLoadError',
          /**
           * Indicates that the error was encountered after the ad loaded, during ad play. Possible causes: ad assets could not be loaded, etc.
           */
          AD_PLAY = 'adPlayError',
        }
      }
      /**
       * This event is raised when an error occurs when loading an ad from the Google or DoubleClick servers. The types on which you can register for the event are AdsLoader and AdsManager.
       */
      class AdErrorEvent {
        /**
         * @returns The AdError that caused this event.
         */
        public getError(): AdError
        /**
         * During ads load request it is possible to provide an object that is available once the ads load is complete or fails. One possible use case: relate ads response to a specific request and use user request content object as the key for identifying the response. If an error occurred during ads load, you can find out which request caused this failure.
         * @returns Object that was provided during ads request.
         */
        public getUserRequestContext(): any
      }
      namespace AdErrorEvent {
        /**
         * Types of AdErrorEvents
         */
        enum Type {
          /**
           * Fired when an error occurred while the ad was loading or playing.
           */
          AD_ERROR = 'adError',
        }
        type Listener = (event: AdErrorEvent) => void
      }
      /**
       * This event type is raised by the ad as a notification when the ad state changes and when users interact with the ad. For example, when the ad starts playing, is clicked on, etc. You can register for the various state changed events on AdsManager.
       */
      class AdEvent {
        /**
         * Get the current ad that is playing or just played.
         * @returns The ad associated with the event, or null if there is no relevant ad.
         */
        public getAd(): Ad | null
        /**
         * Allows extra data to be passed from the ad.
         * @returns Extra data for the event. Log events raised for error carry object of type 'google.ima.AdError' which can be accessed using 'adError' key.
         */
        public getAdData(): any
      }
      namespace AdEvent {
        /**
         * Types of AdEvents
         */
        enum Type {
          /**
           * Fired when an ad rule or a VMAP ad break would have played if autoPlayAdBreaks is false.
           */
          AD_BREAK_READY = 'adBreakReady',
          /**
           * Fired when the ad has stalled playback to buffer.
           */
          AD_BUFFERING = 'adBuffering',
          /**
           * Fired when an ads list is loaded.
           */
          AD_METADATA = 'adMetadata',
          /**
           * Fired when the ad's current time value changes. Calling getAdData() on this event will return an AdProgressData object.
           */
          AD_PROGRESS = 'adProgress',
          /**
           * Fired when the ads manager is done playing all the ads.
           */
          ALL_ADS_COMPLETED = 'allAdsCompleted',
          /**
           * Fired when the ad is clicked.
           */
          CLICK = 'click',
          /**
           * Fired when the ad completes playing.
           */
          COMPLETE = 'complete',
          /**
           * Fired when content should be paused. This usually happens right before an ad is about to cover the content.
           */
          CONTENT_PAUSE_REQUESTED = 'contentPauseRequested',
          /**
           * Fired when content should be resumed. This usually happens when an ad finishes or collapses.
           */
          CONTENT_RESUME_REQUESTED = 'contentResumeRequested',
          /**
           * Fired when the ad's duration changes.
           */
          DURATION_CHANGE = 'durationChange',
          /**
           * Fired when the ad playhead crosses first quartile.
           */
          FIRST_QUARTILE = 'firstQuartile',
          /**
           * Fired when the impression URL has been pinged.
           */
          IMPRESSION = 'impression',
          /**
           * Fired when an ad triggers the interaction callback. Ad interactions contain an interaction ID string in the ad data.
           */
          INTERACTION = 'interaction',
          /**
           * Fired when the displayed ad changes from linear to nonlinear, or vice versa.
           */
          LINEAR_CHANGED = 'linearChanged',
          /**
           * Fired when ad data is available.
           */
          LOADED = 'loaded',
          /**
           * Fired when a non-fatal error is encountered. The user need not take any action since the SDK will continue with the same or next ad playback depending on the error situation.
           */
          LOG = 'log',
          /**
           * Fired when the ad playhead crosses midpoint.
           */
          MIDPOINT = 'midpoint',
          /**
           * Fired when the ad is paused.
           */
          PAUSED = 'pause',
          /**
           * Fired when the ad is resumed.
           */
          RESUMED = 'resume',
          /**
           * Fired when the displayed ads skippable state is changed.
           */
          SKIPPABLE_STATE_CHANGED = 'skippableStateChanged',
          /**
           * Fired when the ad is skipped by the user.
           */
          SKIPPED = 'skip',
          /**
           * Fired when the ad starts playing.
           */
          STARTED = 'start',
          /**
           * Fired when the ad playhead crosses third quartile.
           */
          THIRD_QUARTILE = 'thirdQuartile',
          /**
           * Fired when the ad is closed by the user.
           */
          USER_CLOSE = 'userClose',
          /**
           * Fired when the ad volume has changed.
           */
          VOLUME_CHANGED = 'volumeChange',
          /**
           * Fired when the ad volume has been muted.
           */
          VOLUME_MUTED = 'mute',
        }
        type Listener = (event: AdEvent) => void
      }
      /**
       * An ad may be part of a pod of ads. This object exposes metadata related to that pod, such as the number of ads in the pod and ad position within the pod.
       *
       * The getTotalAds API contained within this object is often correct, but in certain scenarios, it represents the SDK's best guess. See that method's documentation for more information.
       */
      interface AdPodInfo {
        /**
         * Returns the position of the ad.
         * @returns The position of the ad within the pod. The value returned is one-based, i.e. 1 of 2, 2 of 2, etc.
         */
        getAdPosition(): number
        /**
         * Returns true if the ad is a bumper ad. Bumper ads are short linear ads that can indicate to a user when the user is entering into or exiting from an ad break.
         * @returns Whether the ad is a bumper ad.
         */
        getIsBumper(): boolean
        /**
         * The maximum duration of the pod in seconds. For unknown duration, -1 is returned.
         * @returns The maximum duration of the ads in this pod in seconds.
         */
        getMaxDuration(): number
        /**
         * Returns the index of the ad pod.
         *
         * For preroll pod, 0 is returned. For midrolls, 1, 2, ... N is returned. For postroll, -1 is returned.
         *
         * For pods in VOD streams with dynamically inserted ads, 0...N is returned regardless of whether the ad is a pre-, mid-, or post-roll.
         *
         * Defaults to 0 if this ad is not part of a pod, or the pod is not part of an ad playlist.
         *
         * @returns The index of the pod in the ad playlist.
         */
        getPodIndex(): number
        /**
         * Returns the content time offset at which the current ad pod was scheduled. For pods in VOD streams with dynamically inserted ads, stream time is returned.
         *
         * For preroll pod, 0 is returned. For midrolls, the scheduled time is returned. For postroll, -1 is returned.
         *
         * Defaults to 0 if this ad is not part of a pod, or the pod is not part of an ad playlist.
         *
         * @returns The time offset for the current ad pod.
         */
        getTimeOffset(): number
        /**
         * The total number of ads contained within this pod, including bumpers. Bumper ads are short linear ads that can indicate to a user when the user is entering into or exiting from an ad break.
         *
         * Defaults to 1 if this ad is not part of a pod.
         *
         * In certain scenarios, the SDK does not know for sure how many ads are contained within this ad pod. These scenarios include ad pods, which are multiple ads within a single ad tag. In these scenarios, the first few AdEvents fired (AD_METADATA, LOADED, etc.) may have just the total number of ad tags from the playlist response. We recommend using the STARTED event as the event in which publishers pull information from this object and update the visual elements of the player, if any.
         *
         * @returns Total number of ads in the pod.
         */
        getTotalAds(): number
      }
      /**
       * AdsLoader allows clients to request ads from ad servers. To do so, users must register for the AdsManagerLoadedEvent event and then request ads.
       */
      class AdsLoader {
        /**
         * @param container The display container for ads.
         */
        constructor(container: AdDisplayContainer)
        /**
         * Adds an event listener for the specified type.
         * @param type The event type to listen to.
         * @param listener The function to call when the event is triggered.
         * @param useCapture Optional
         */
        public addEventListener(type: AdsManagerLoadedEvent.Type, listener: AdsManagerLoadedEvent.Listener, useCapture?: boolean): void
        /**
         * Adds an event listener for the specified type.
         * @param type The event type to listen to.
         * @param listener The function to call when the event is triggered.
         * @param useCapture Optional
         */
        public addEventListener(type: AdErrorEvent.Type, listener: AdErrorEvent.Listener, useCapture?: boolean): void
        /**
         * Removes an event listener for the specified type.
         * @param type The event type for which to remove an event listener.
         * @param listener The function of the event handler to remove from the event target.
         * @param useCapture Optional
         */
        public removeEventListener(type: AdsManagerLoadedEvent.Type, listener: AdsManagerLoadedEvent.Listener, useCapture?: boolean): void
        /**
         * Removes an event listener for the specified type.
         * @param type The event type for which to remove an event listener.
         * @param listener The function of the event handler to remove from the event target.
         * @param useCapture Optional
         */
        public removeEventListener(type: AdErrorEvent.Type, listener: AdErrorEvent.Listener, useCapture?: boolean): void
        /**
         * Signals to the SDK that the content is finished. This will allow the SDK to play post-roll ads, if any are loaded via ad rules.
         */
        public contentComplete(): void
        /**
         * Cleans up the internal state.
         */
        public destroy(): void
        /**
         * Returns the IMA SDK settings instance. To change the settings, just call the methods on the instance. The changes will apply for all the ad requests made with this ads loader.
         * @returns The settings instance.
         */
        public getSettings(): ImaSdkSettings
        /**
         * Request ads from a server.
         * @param adsRequest AdsRequest instance containing data for the ads request.
         * @param userRequestContext User-provided object that is associated with the ads request. It can be retrieved when the ads are loaded.
         */
        public requestAds(adsRequest: AdsRequest, userRequestContext?: any): void
      }
      /**
       * This class is responsible for playing ads.
       */
      interface AdsManager {
        /**
         * Adds an event listener for the specified type.
         * @param type The event type to listen to
         * @param listener The function to call when the event is triggered
         * @param useCapture Optional
         */
        addEventListener(type: AdEvent.Type, listener: AdEvent.Listener, useCapture?: boolean): void
        /**
         * Adds an event listener for the specified type.
         * @param type The event type to listen to
         * @param listener The function to call when the event is triggered
         * @param useCapture Optional
         */
        addEventListener(type: AdErrorEvent.Type, listener: AdErrorEvent.Listener, useCapture?: boolean): void
        /**
         * Removes an event listener for the specified type.
         * @param type The event type for which to remove an event listener.
         * @param listener The function of the event handler to remove from the event target.
         * @param useCapture Optional
         */
        removeEventListener(type: AdEvent.Type, listener: AdEvent.Listener, useCapture?: boolean): void
        /**
         * Removes an event listener for the specified type.
         * @param type The event type for which to remove an event listener.
         * @param listener The function of the event handler to remove from the event target.
         * @param useCapture Optional
         */
        removeEventListener(type: AdErrorEvent.Type, listener: AdErrorEvent.Listener, useCapture?: boolean): void
        /**
         * Collapse the current ad. This is no-op for HTML5 SDK.
         */
        collapse(): void
        /**
         * Removes ad assets loaded at runtime that need to be properly removed at the time of ad completion and stops the ad and all tracking.
         */
        destroy(): void
        /**
         * If an ad break is currently playing, discard it and resume content. Otherwise, ignore the next scheduled ad break. For example, this can be called immediately after the ads manager loads to ignore a preroll without losing future midrolls or postrolls. This is a no-op unless the ad request returned a playlist or VMAP response.
         */
        discardAdBreak(): void
        /**
         * Expand the current ad. This is no-op for HTML5 SDK.
         */
        expand(): void
        /**
         * Returns true if the ad can currently be skipped. When this value changes, the AdsManager fires an AdEvent.SKIPPABLE_STATE_CHANGED event.
         * @returns True if the ad can currently be skipped, false otherwise.
         */
        getAdSkippableState(): boolean
        /**
         * Returns an array of offsets in seconds indicating when a scheduled ad break will play. A preroll is represented by 0, and a postroll is represented by -1. An empty array indicates the ad or ad pod has no schedule and can be played at any time.
         * @returns List of time offsets in seconds.
         */
        getCuePoints(): number[]
        /**
         * Get the remaining time of the current ad that is playing. If the ad is not loaded yet or has finished playing, the API would return -1.
         * @returns Returns the time remaining for current ad. If the remaining time is undefined for the current ad (for example custom ads), the value returns -1.
         */
        getRemainingTime(): number
        /**
         * Get the volume for the current ad.
         * @returns The volume of the current ad, from 0 (muted) to 1 (loudest).
         */
        getVolume(): number
        /**
         * Call init to initialize the ad experience on the ads manager.
         * @param width The desired width of the ad.
         * @param height The desired height of the ad.
         * @param viewMode The desired view mode.
         * @param videoElement The video element for custom playback. This video element overrides the one provided in the AdDisplayContainer constructor. Only use this property if absolutely necessary - otherwise we recommend specifying this video element while creating the AdDisplayContainer.
         */
        init(width: number, height: number, viewMode: ViewMode, videoElement?: HTMLVideoElement): void
        /**
         * Returns true if a custom click tracking element is being used for click tracking on the current ad. Custom click tracking is only used when an optional click tracking element is provided to the AdDisplayContainer, custom playback is used, and the current ad is not an AdSense/AdX ad.
         * @returns Whether custom click tracking is used.
         */
        isCustomClickTrackingUsed(): boolean
        /**
         * Returns true if a custom video element is being used to play the current ad. Custom playback occurs when an optional video element is provided to the AdDisplayContainer on platforms where a custom video element would provide a more seamless ad viewing experience.
         * @returns Whether custom playback is used.
         */
        isCustomPlaybackUsed(): boolean
        /**
         * Pauses the current ad that is playing. This function will be no-op when a static overlay is being shown or if the ad is not loaded yet or is done playing.
         */
        pause(): void
        /**
         * Resizes the current ad.
         * @param width New ad slot width.
         * @param height New ad slot height.
         * @param viewMode The new view mode.
         */
        resize(width: number, height: number, viewMode: ViewMode): void
        /**
         * Resumes the current ad that is loaded and paused. This function will be no-op when a static overlay is being shown or if the ad is not loaded yet or is done playing.
         */
        resume(): void
        /**
         * Set the volume for the current ad.
         * @param volume The volume to set, from 0 (muted) to 1 (loudest).
         */
        setVolume(volume: number): void
        /**
         * Skips the current ad when AdsManager.getAdSkippableState() is true. When called under other circumstances, skip has no effect. After the skip is completed the AdsManager fires an AdEvent.SKIPPED event.
         */
        skip(): void
        /**
         * Start playing the ads.
         */
        start(): void
        /**
         * Stop playing the ads. Calling this will get publisher back to the content.
         */
        stop(): void
        /**
         * Updates the ads rendering settings. This should be used specifically for VMAP use cases between ad breaks when ads rendering settings such as bitrate need to be updated.
         * @param adsRenderingSettings The updated ads rendering settings.
         */
        updateAdsRenderingSettings(adsRenderingSettings: Partial<AdsRenderingSettings>): void
      }
      /**
       * This event is raised when ads are successfully loaded from the Google or DoubleClick ad servers via an AdsLoader. You can register for this event on AdsLoader.
       */
      class AdsManagerLoadedEvent {
        /**
         * After ads are loaded from the Google or DoubleClick ad servers, the publisher needs to play these ads either in their own video player or in the Google-provided video player. This method returns an AdsManager object. The AdsManager supports playing ads and allows the publisher to subscribe to various events during ad playback.
         * @param contentPlayback Player that plays back publisher's content. This must be an object that contains the property currentTime, which allows the SDK to query playhead position to properly display midrolls in case ad server responds with an ad rule, and the duration property. The HMTL5 video element fulfills these requirements. You may optionally implement your own playhead tracker, as long as it fulfills the above requirements.
         * @param adsRenderingSettings Optional settings to control the rendering of ads.
         * @returns AdsManager that manages and plays ads.
         */
        public getAdsManager(contentPlayback: {
          currentTime: number
          duration: number
        }, adsRenderingSettings?: Partial<AdsRenderingSettings>): AdsManager
        /**
         * @returns During ads load request it is possible to provide an object that is available once the ads load is complete. One possible use case: relate ads response to a specific request and use user request content object as a key for identifying the response.
         */
        public getUserRequestContext(): any
      }
      namespace AdsManagerLoadedEvent {
        /**
         * Types of AdsManagerLoadedEvents.
         */
        enum Type {
          /**
           * Fired when the ads have been loaded and an AdsManager is available.
           */
          ADS_MANAGER_LOADED = 'adsManagerLoaded',
        }
        type Listener = (event: AdsManagerLoadedEvent) => void
      }
      /**
       * Defines parameters that control the rendering of ads.
       */
      class AdsRenderingSettings {
        /**
         * Set to false if you wish to have fine grained control over the positioning of all non-linear ads. If this value is true, the ad is positioned in the bottom center. If this value is false, the ad is positioned in the top left corner. The default value is true.
         */
        public autoAlign: boolean
        /**
         * Maximum recommended bitrate. The value is in kbit/s. The SDK will pick media with bitrate below the specified max, or the closest bitrate if there is no media with lower bitrate found. Default value, -1, means the bitrate will be selected by the SDK.
         */
        public bitrate: number
        /**
         * Enables preloading of video assets. For more info see our guide to preloading media.
         */
        public enablePreloading: boolean
        /**
         * Timeout (in milliseconds) when loading a video ad media file. If loading takes longer than this timeout, the ad playback is canceled and the next ad in the pod plays, if available. Use -1 for the default of 8 seconds.
         */
        public loadVideoTimeout: number
        /**
         * Only supported for linear video mime types. If specified, the SDK will include media that matches the MIME type(s) specified in the list and exclude media that does not match the specified MIME type(s). The format is a list of strings, e.g., [ 'video/mp4', 'video/webm', ... ] If not specified, the SDK will pick the media based on player capabilities.
         */
        public mimeTypes: string[]
        /**
         * For VMAP and ad rules playlists, only play ad breaks scheduled after this time (in seconds). This setting is strictly after - e.g. setting playAdsAfterTime to 15 will cause IMA to ignore an ad break scheduled to play at 15s.
         */
        public playAdsAfterTime: number
        /**
         * Specifies whether or not the SDK should restore the custom playback state after an ad break completes. This is setting is used primarily when the publisher passes in its content player to use for custom ad playback.
         */
        public restoreCustomPlaybackStateOnAdBreakComplete: boolean
        /**
         * Specifies whether the UI elements that should be displayed. The elements in this array are ignored for AdSense/AdX ads.
         */
        public uiElements: UiElements[]
        /**
         * Render linear ads with full UI styling. This setting does not apply to AdSense/AdX ads or ads played in a mobile context that already use full UI styling by default.
         */
        public useStyledLinearAds: boolean
        /**
         * Render non-linear ads with a close and recall button.
         */
        public useStyledNonLinearAds: boolean
      }
      /**
       * A class for specifying properties of the ad request.
       */
      class AdsRequest {
        /**
         * Specifies a VAST 2.0 document to be used as the ads response instead of making a request via an ad tag url. This can be useful for debugging and other situations where a VAST response is already available.
         *
         * This parameter is optional.
         */
        public adsResponse?: string
        /**
         * Specifies the ad tag url that is requested from the ad server. For details on constructing the ad tag url, see Create a master video tag manually.
         *
         * This parameter is required.
         */
        public adTagUrl: string
        /**
         * Specifies the duration of the content in seconds to be shown. Used in AdX requests.
         *
         * This parameter is optional.
         */
        public contentDuration?: number
        /**
         * Specifies the keywords used to describe the content to be shown. Used in AdX requests.
         *
         * This parameter is optional.
         */
        public contentKeywords?: string[]
        /**
         * Specifies the title of the content to be shown. Used in AdX requests.
         *
         * This parameter is optional.
         */
        public contentTitle?: string
        /**
         * Forces non-linear AdSense ads to render as linear fullslot. If set, the content video will be paused and the non-linear text or image ad will be rendered as fullslot. The content video will resume once the ad has been skipped or closed.
         */
        public forceNonLinearFullSlot?: boolean
        /**
         * Specifies the height of the rectangular area within which a linear ad is displayed. This value is used as one of the criteria for ads selection. This value does not need to match actual ad's height.
         *
         * This parameter is required.
         */
        public linearAdSlotHeight: number
        /**
         * Specifies the width of the rectangular area within which a linear ad is displayed. This value is used as one of the criteria for ads selection. This value does not need to match actual ad's width.
         *
         * This parameter is required.
         */
        public linearAdSlotWidth: number
        /**
         * Specifies the maximum amount of time to wait in seconds, after calling requestAds, before requesting the ad tag URL. This can be used to stagger requests during a live-stream event, in order to mitigate spikes in the number of requests.
         */
        public liveStreamPrefetchSeconds?: number
        /**
         * Specifies the height of the rectangular area within which a non linear ad is displayed. This value is used as one of the criteria for ads selection. This value does not need to match actual ad's height.
         *
         * This parameter is required.
         */
        public nonLinearAdSlotHeight: number
        /**
         * Specifies the width of the rectangular area within which a non linear ad is displayed. This value is used as one of the criteria for ads selection. This value does not need to match actual ad's width.
         *
         * This parameter is required.
         */
        public nonLinearAdSlotWidth: number
        /**
         * Specifies the full url of the page that will be included in the Google ad request for targeting purposes. The url needs to be a valid url. If specified, this value will be used for the [PAGEURL] VAST macro.
         *
         * This parameter is optional.
         */
        public pageUrl?: string
        /**
         * Override for default VAST load timeout in milliseconds for a single wrapper. The default timeout is 5000ms.
         *
         * This parameter is optional.
         */
        public vastLoadTimeout?: number
        /**
         * Notifies the SDK whether the player intends to start the content and ad in response to a user action or whether it will be automatically played. Changing this setting will have no impact on ad playback.
         * @param autoPlay Whether the content and the ad will be autoplayed or whether it will be started by a user action.
         */
        public setAdWillAutoPlay(autoPlay: boolean): void
        /**
         * Notifies the SDK whether the player intends to start ad while muted. Changing this setting will have no impact on ad playback, but will send the appropriate signal in the ad request to allow buyers to bid on muted inventory.
         * @param muted Whether the ad will be played while muted.
         */
        public setAdWillPlayMuted(muted: boolean): void
        /**
         * Notifies the SDK whether the player intends to continuously play the content videos one after another similar to TV broadcast. Changing this setting will have no impact on the ad playback, but will send the appropriate signal in this ad request to allow buyers to bid on the type of ad inventory.
         * @param continuousPlayback Whether the content video is played one after another continuously.
         */
        public setContinuousPlayback(continuousPlayback: boolean): void
      }
      /**
       * A companion ad class that is extended by companion ads of different ad types.
       */
      interface CompanionAd {
        /**
         * @returns Returns the ad slot id for this companion.
         */
        getAdSlotId(): string
        /**
         * Returns the HTML content for the companion ad that can be added to the publisher page.
         * @returns The HTML content.
         */
        getContent(): string
        /**
         * @returns The content type of the Companion Ad. This may return null if the content type is not known (such as in the case of a VAST HTMLResource or IFrameResource).
         */
        getContentType(): string | null
        /**
         * @returns Returns the height of the companion in pixels.
         */
        getHeight(): number
        /**
         * @returns Returns the width of the companion in pixels.
         */
        getWidth(): number
      }
      /**
       * CompanionAdSelectionSettings object is used to define the selection criteria when calling the ima.Ad.getCompanionAds function.
       */
      class CompanionAdSelectionSettings {
        /**
         * The companion ad slot ids to be used for matching set by the user.
         */
        public adSlotIds: string[]
        /**
         * Creative type setting set by the user.
         */
        public creativeType: CompanionAdSelectionSettings.CreativeType
        /**
         * The near fit percent set by the user.
         */
        public nearMatchPercent: number
        /**
         * Resource type setting set by the user.
         */
        public resourceType: CompanionAdSelectionSettings.ResourceType
        /**
         * Size criteria setting set by the user.
         */
        public sizeCriteria: CompanionAdSelectionSettings.SizeCriteria
      }
      namespace CompanionAdSelectionSettings {
        /**
         * Available choices for creative type of a companion ad. The user can specify any of these choices as a criterion for selecting companion ads.
         */
        enum CreativeType {
          /**
           * Specifies all creative types.
           */
          ALL = 'All',
          /**
           * Specifies Flash creatives.
           */
          FLASH = 'Flash',
          /**
           * Specifies image creatives (such as JPEG, PNG, GIF, etc).
           */
          IMAGE = 'Image',
        }
        /**
         * Available choices for resource type of a companion ad. The user can specify any of these choices as a criterion for selecting companion ads.
         */
        enum ResourceType {
          /**
           * Specifies that the resource can be any type of resource.
           */
          ALL = 'All',
          /**
           * Specifies that the resource should be an HTML snippet.
           */
          HTML = 'Html',
          /**
           * Specifies that the resource should be a URL that should be used as the source of an iframe.
           */
          IFRAME = 'IFrame',
          /**
           * Specifies that the resource should be a static file (usually the URL of an image of SWF).
           */
          STATIC = 'Static',
        }
        /**
         * Available choices for size selection criteria. The user can specify any of these choices for selecting companion ads.
         */
        enum SizeCriteria {
          /**
           * Specifies that size should be ignored when choosing companions.
           */
          IGNORE = 'IgnoreSize',
          /**
           * Specifies that only companions that match the size of the companion ad slot exactly should be chosen.
           */
          SELECT_EXACT_MATCH = 'SelectExactMatch',
          /**
           * Specifies that any companion close to the size of the companion ad slot should be chosen.
           */
          SELECT_NEAR_MATCH = 'SelectNearMatch',
        }
      }
      /**
       * This class contains SDK-wide settings.
       */
      class ImaSdkSettings {
        /**
         * Returns the current companion backfill mode.
         * @returns The current value.
         */
        public getCompanionBackfill(): ImaSdkSettings.CompanionBackfillMode
        /**
         * Gets whether to disable custom playback on iOS 10+ browsers. The default value is false.
         */
        public getDisableCustomPlaybackForIOS10Plus(): boolean
        /**
         * @returns Whether flash ads should be disabled.
         */
        public getDisableFlashAds(): boolean
        /**
         * Returns the publisher provided locale.
         * @returns Publisher provided locale.
         */
        public getLocale(): string
        /**
         * Returns the maximum number of redirects for subsequent redirects will be denied.
         * @returns The maximum number of redirects.
         */
        public getNumRedirects(): number
        /**
         * Returns the partner provided player type.
         * @returns Partner player type.
         */
        public getPlayerType(): string
        /**
         * Returns the partner provided player version.
         * @returns Partner player version.
         */
        public getPlayerVersion(): string
        /**
         * Returns the publisher provided id.
         * @returns Publisher provided id.
         */
        public getPpid(): string
        /**
         * Sets whether VMAP and ad rules ad breaks are automatically played
         * @param autoPlayAdBreaks Whether to autoPlay the ad breaks.
         */
        public setAutoPlayAdBreaks(autoPlayAdBreaks: boolean): void
        /**
         * Sets the companion backfill mode. Please see the various modes available in google.ima.ImaSdkSettings.CompanionBackfillMode.
         *
         * The default mode is ima.ImaSdkSettings.CompanionBackfillMode.ALWAYS.
         *
         * @param mode The desired companion backfill mode.
         */
        public setCompanionBackfill(mode: ImaSdkSettings.CompanionBackfillMode): void
        /**
         * Sets whether to disable custom playback on iOS 10+ browsers. If true, ads will play inline if the content video is inline. This enables TrueView skippable ads. However, the ad will stay inline and not support iOS's native fullscreen. When false, ads will play in the same player as your content. The value set here when an AdDisplayContainer is created is used for the lifetime of the container. The default value is false.
         * @param disable Whether or not to disable custom playback.
         */
        public setDisableCustomPlaybackForIOS10Plus(disable: boolean): void
        /**
         * Sets whether flash ads should be disabled.
         * @param disableFlashAds Whether flash ads should be disabled.
         */
        public setDisableFlashAds(disableFlashAds: boolean): void
        /**
         * Sets the publisher provided locale. Must be called before creating AdsLoader or AdDisplayContainer. The locale specifies the language in which to display UI elements and can be any two-letter ISO 639-1 code.
         * @param locale Publisher-provided locale.
         */
        public setLocale(locale: string): void
        /**
         * Specifies the maximum number of redirects before the subsequent redirects will be denied, and the ad load aborted. The number of redirects directly affects latency and thus user experience. This applies to all VAST wrapper ads.
         * @param numRedirects The maximum number of redirects.
         */
        public setNumRedirects(numRedirects: number): void
        /**
         * Sets the partner provided player type. This setting should be used to specify the name of the player being integrated with the SDK. Player type greater than 20 characters will be truncated. The player type specified should be short and unique. This is an optional setting used to improve SDK usability by tracking player types.
         * @param playerType The type of the partner player.
         */
        public setPlayerType(playerType: string): void
        /**
         * Sets the partner provided player version. This setting should be used to specify the version of the partner player being integrated with the SDK. Player versions greater than 20 characters will be truncated. This is an optional setting used to improve SDK usability by tracking player version.
         * @param playerVersion The version of the partner player.
         */
        public setPlayerVersion(playerVersion: string): void
        /**
         * Sets the publisher provided id.
         * @param ppid Publisher provided id.
         */
        public setPpid(ppid: string): void
        /**
         * Sets whether VPAID creatives are allowed.
         * @param allowVpaid Whether to allow VPAID creatives.
         * @deprecated Please use setVpaidMode.
         */
        public setVpaidAllowed(allowVpaid: boolean): void
        /**
         * Sets VPAID playback mode.
         * @param vpaidMode Sets how VPAID ads will be played. Default is to not allow VPAID ads.
         */
        public setVpaidMode(vpaidMode: ImaSdkSettings.VpaidMode): void
      }
      namespace ImaSdkSettings {
        /**
         * Defines a set of constants for the companion backfill setting. This setting indicates whether companions should be backfilled in various scenarios.
         *
         * The default value is ALWAYS.
         *
         * Note that client-side companion backfill requires tagging your companions properly with a Google Publisher Tag (GPT).
         */
        enum CompanionBackfillMode {
          /**
           * If the value is ALWAYS, companion backfill will be attempted in all situations, even when there is no master ad returned.
           */
          ALWAYS = 'always',
          /**
           * If the value is ON_MASTER_AD, companion backfill will be attempted if there is a master ad with fewer companions than there are companion slots. The missing companions will be backfilled.
           */
          ON_MASTER_AD = 'on_master_ad',
        }
        /**
         * A set of constants for enabling VPAID functionality.
         */
        enum VpaidMode {
          /**
           * VPAID ads will not play and an error will be returned.
           */
          DISABLED = 0,
          /**
           * VPAID ads are enabled using a cross domain iframe. The VPAID ad cannot access the site. VPAID ads that depend on friendly iframe access may error. This is the default.
           */
          ENABLED = 1,
          /**
           * VPAID ads are enabled using a friendly iframe. This allows the ad access to the site via JavaScript.
           */
          INSECURE = 2,
        }
      }
      /**
       * Enum specifying different UI elements that can be configured to be displayed or hidden. These settings may be ignored for AdSense and ADX ads.
       */
      enum UiElements {
        /**
         * Displays the "Ad" text in the ad UI. Must be present to show the countdown timer.
         */
        AD_ATTRIBUTION = 'adAttribution',
        /**
         * Ad attribution is required for a countdown timer to be displayed. Both UiElements.COUNTDOWN and UiElements.AD_ATTRIBUTION must be present in AdsRenderingSettings.uiElements.
         */
        COUNTDOWN = 'countdown',
      }
      /**
       * Enum specifying different VPAID view modes for ads.
       */
      enum ViewMode {
        /**
         * Fullscreen ad view mode. Indicates to the ads manager that the publisher considers the current AdDisplayContainer arrangement as fullscreen (i.e. simulated fullscreen). This does not cause the ads manager to enter fullscreen.
         */
        FULLSCREEN = 'fullscreen',
        /**
         * Normal ad view mode.
         */
        NORMAL = 'normal',
      }
      /**
       * A string containing the full version of the SDK.
       */
      const VERSION: string
      /**
       * Settings for the Google IMA SDK.
       */
      const settings: ImaSdkSettings
    }
  }
  export type ImaSdk = typeof google.ima
  export class DelegatedEventTarget implements EventTarget {
    private delegate
    addEventListener(...args: any): void
    dispatchEvent(...args: any): boolean
    removeEventListener(...args: any): void
  }
  export class PlayerOptions {
    /** Sets whether to disable custom playback on iOS 10+ browsers. If true, ads will play inline if the content video is inline. This enables TrueView skippable ads. However, the ad will stay inline and not support iOS's native fullscreen. */
    disableCustomPlaybackForIOS10Plus: boolean
    /** Enables or disables auto resizing of adsManager. If enabled it also resizes non-linear ads. */
    autoResize: boolean
    /** Allows to have a separate 'Learn More' click tracking element on mobile. */
    clickTrackingElement?: HTMLElement
  }
  export type StartAd = {
    start: () => void
    startWithoutReset: () => void
    ad?: google.ima.Ad
    adBreakTime?: number
  }
  export type StartAdCallback = (startAd: StartAd) => void
  /**
   * Convenience player wrapper for the Google IMA HTML5 SDK
   */
  export class Player extends DelegatedEventTarget {
    #private
    constructor(ima: ImaSdk, mediaElement: HTMLVideoElement, adElement: HTMLElement, adsRenderingSettings?: google.ima.AdsRenderingSettings, options?: PlayerOptions)
    /**
     * This allows synchronous activation of the media element
     * and the Google IMA ad-display-container. Useful when you
     * have to do async work before calling "playAds".
     */
    activate(): void
    /**
     * This is the entry point to start ad playback. It can be used
     * as such:
     *
     * - With a single VAST at the beginning to play a preroll
     * - Anyhwere during content playback with a single VAST
     * - With a single VMAP at the beginning
     */
    playAds(adsRequest: google.ima.AdsRequest): void
    /**
     * Similar to "playAds" method but with the difference
     * that it allows to first load the ad and start it separately
     * within the given callback.
     *
     * When a VAST or a VMAP ad break is given the callback is called
     * with a "start" method which either starts playing the individual
     * VAST ad or starts the VMAP ad break. If "start" method is not called
     * it won't play the ad.
     */
    loadAds(adsRequest: google.ima.AdsRequest, startAdCallback: StartAdCallback): void
    private _mediaElementPlay
    private _requestAds
    private _setupIma
    skipAd(): void
    discardAdBreak(): void
    /**
     * Starts playback of either content or ad element.
     */
    play(): void
    /**
     * Pauses playback of either content or ad element.
     */
    pause(): void
    /**
     * Sets volume of either content or ad element.
     */
    set volume(volume: number)
    /**
     * Returns volume of either content or ad element.
     */
    get volume(): number
    /**
     * Sets muted state on either content or ad element.
     */
    set muted(muted: boolean)
    /**
     * Returns muted state of either content or ad element.
     */
    get muted(): boolean
    /**
     * Sets current time of content element when not in ad playback mode.
     */
    set currentTime(currentTime: number)
    /**
     * Returns current playhead time of either content or ad element.
     */
    get currentTime(): number
    /**
     * Returns current duration of either content or ad element.
     */
    get duration(): number
    /**
     * Returns list of ad break cue points that weren't played yet.
     * Only available after "AdMetadata" event when VMAP is passed in playAds.
     */
    get cuePoints(): number[]
    private _setCuePoints
    /**
     * Remove already played cuepoints
     *
     * @param timeOffset offset in seconds as defined in VMAP or 0 for preroll and -1 for postroll
     */
    private _adjustCuePoints
    /**
     * Allows resizing the ad element. Useful when options.autoResize = false.
     */
    resizeAd(width: number, height: number): void
    /**
     * Cleans up current ad and ad manager session or the complete IMA (via force).
     *
     * Externally call this function with "force = true" when you want to switch
     * the content source or move the player to another DOM node before doing
     * another "playAds" or "loadAds", so that it does a full cleanup.
     *
     * @param force - enforce a full cleanup
     * @returns a promise which resolves after all the cleanup work is done
     */
    reset(force?: boolean): void
    private _resetIma
    /**
     * Completely destroys this instance. It is unusable after that.
     */
    destroy(): void
    isCustomPlaybackUsed(): boolean
    private _resetAd
    private _handleMediaElementEvents
    private _handleAdsManagerEvents
    private _onAdsLoaderError
    private _onAdsManagerLoaded
    private _startAdsManager
    private _mediaStop
    private _resizeObserverCallback
    private _resizeAdsManager
    private _getViewMode
    private _playContent
    private _createPlayerErrorFromImaErrorEvent
    private _onAdError
  }
}
/* eslint-enable ts/method-signature-style, ts/consistent-type-definitions */
declare global {
  interface Window {
    artplayerPluginVast?: typeof artplayerPluginVast
  }
}
declare namespace artplayerPluginVastDefinitions {
  export type PlayUrlFn = (url: string, config?: any) => void
  export type PlayResFn = (res: string, config?: any) => void
  export interface VastPluginContext {
    art: Artplayer
    ima: any
    imaPlayer: Player | null
    playUrl: PlayUrlFn
    playRes: PlayResFn
    init: () => Player
    adsRenderingSettings: any
    playerOptions: PlayerOptions
    container: HTMLDivElement | null
  }
  export type ArtplayerPluginVastOption = (params: VastPluginContext) => void | Promise<void>
  export interface ArtplayerPluginVastInstance {
    name: 'artplayerPluginVast'
    destroy?: () => void
  }
  export function artplayerPluginVast(option: ArtplayerPluginVastOption): (art: Artplayer) => ArtplayerPluginVastInstance
}
declare const artplayerPluginVast: typeof artplayerPluginVastDefinitions.artplayerPluginVast
declare namespace artplayerPluginVast {
  export type ArtplayerPluginVastOption = artplayerPluginVastDefinitions.ArtplayerPluginVastOption
  export type ArtplayerPluginVastInstance = artplayerPluginVastDefinitions.ArtplayerPluginVastInstance
}
export = artplayerPluginVast
export as namespace artplayerPluginVast;
