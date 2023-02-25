/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Webcast = {
    /**
     * Type of webcast, typically descriptive of the streaming provider.
     */
    type: Webcast.type;
    /**
     * Type specific channel information. May be the YouTube stream, or Twitch channel name. In the case of iframe types, contains HTML to embed the stream in an HTML iframe.
     */
    channel: string;
    /**
     * The date for the webcast in `yyyy-mm-dd` format. May be null.
     */
    date?: string;
    /**
     * File identification as may be required for some types. May be null.
     */
    file?: string;
};

export namespace Webcast {

    /**
     * Type of webcast, typically descriptive of the streaming provider.
     */
    export enum type {
        YOUTUBE = 'youtube',
        TWITCH = 'twitch',
        USTREAM = 'ustream',
        IFRAME = 'iframe',
        HTML5 = 'html5',
        RTMP = 'rtmp',
        LIVESTREAM = 'livestream',
        DIRECT_LINK = 'direct_link',
        MMS = 'mms',
        JUSTIN = 'justin',
        STEMTV = 'stemtv',
        DACAST = 'dacast',
    }


}

