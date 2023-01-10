declare module "react-big-calendar/lib/Toolbar" {
  const Toolbar: React.FC = () => any;
  export default Toolbar;
}

declare module "virtual:pwa-register/react" {
  // @ts-expect-error ignore when react is not installed
  import type { Dispatch, SetStateAction } from "react";

  export interface RegisterSWOptions {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (
      registration: ServiceWorkerRegistration | undefined
    ) => void;
    onRegisterError?: (error: any) => void;
  }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [boolean, Dispatch<SetStateAction<boolean>>];
    offlineReady: [boolean, Dispatch<SetStateAction<boolean>>];
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  };
}


interface Window {
  NDEFMessage: NDEFMessage
}
declare class NDEFMessage {
  constructor(messageInit: NDEFMessageInit)
  records: ReadonlyArray<NDEFRecord>
}
declare interface NDEFMessageInit {
  records: NDEFRecordInit[]
}

declare type NDEFRecordDataSource = string | BufferSource | NDEFMessageInit

interface Window {
  NDEFRecord: NDEFRecord
}
declare class NDEFRecord {
  constructor(recordInit: NDEFRecordInit)
  readonly recordType: string
  readonly mediaType?: string
  readonly id?: string
  readonly data?: DataView
  readonly encoding?: string
  readonly lang?: string
  toRecords?: () => NDEFRecord[]
}
declare interface NDEFRecordInit {
  recordType: string
  mediaType?: string
  id?: string
  encoding?: string
  lang?: string
  data?: NDEFRecordDataSource
}

declare type NDEFMessageSource = string | BufferSource | NDEFMessageInit

interface Window {
  NDEFReader: NDEFReader
}
declare class NDEFReader extends EventTarget {
  constructor()
  onreading: (this: this, event: NDEFReadingEvent) => any
  onreadingerror: (this: this, error: Event) => any
  scan: (options?: NDEFScanOptions) => Promise<void>
  write: (
    message: NDEFMessageSource,
    options?: NDEFWriteOptions
  ) => Promise<void>
  makeReadOnly: (options?: NDEFMakeReadOnlyOptions) => Promise<void>
}

interface Window {
  NDEFReadingEvent: NDEFReadingEvent
}
declare class NDEFReadingEvent extends Event {
  constructor(type: string, readingEventInitDict: NDEFReadingEventInit)
  serialNumber: string
  message: NDEFMessage
}
interface NDEFReadingEventInit extends EventInit {
  serialNumber?: string
  message: NDEFMessageInit
}

interface NDEFWriteOptions {
  overwrite?: boolean
  signal?: AbortSignal
}
interface NDEFMakeReadOnlyOptions {
  signal?: AbortSignal
}
interface NDEFScanOptions {
  signal: AbortSignal
}