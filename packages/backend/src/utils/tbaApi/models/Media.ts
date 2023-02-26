/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * The `Media` object contains a reference for most any media associated with a team or event on TBA.
 */
export type Media = {
    /**
     * String type of the media element.
     */
    type: Media.type;
    /**
     * The key used to identify this media on the media site.
     */
    foreign_key: string;
    /**
     * If required, a JSON dict of additional media information.
     */
    details?: any;
    /**
     * True if the media is of high quality.
     */
    preferred?: boolean;
    /**
     * Direct URL to the media.
     */
    direct_url?: string;
    /**
     * The URL that leads to the full web page for the media, if one exists.
     */
    view_url?: string;
};

export namespace Media {

    /**
     * String type of the media element.
     */
    export enum type {
        YOUTUBE = 'youtube',
        CDPHOTOTHREAD = 'cdphotothread',
        IMGUR = 'imgur',
        FACEBOOK_PROFILE = 'facebook-profile',
        YOUTUBE_CHANNEL = 'youtube-channel',
        TWITTER_PROFILE = 'twitter-profile',
        GITHUB_PROFILE = 'github-profile',
        INSTAGRAM_PROFILE = 'instagram-profile',
        PERISCOPE_PROFILE = 'periscope-profile',
        GRABCAD = 'grabcad',
        INSTAGRAM_IMAGE = 'instagram-image',
        EXTERNAL_LINK = 'external-link',
        AVATAR = 'avatar',
    }


}

