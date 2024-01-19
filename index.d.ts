type ExtraData = Record<string, any> | null;

export type SharedItem = {
  /** The mime type of the shared data */
  mimeType: string;
  /** Either the shared text, or the location of the shared file */
  data: string;
  /** Can be null. Any optional extra data your Share Extension React View opened the app with */
  extraData: ExtraData;
};

export interface ShareMenuReactView {
  /**
   * Dismisses the open Share Extension. Send an error message as a parameter to notify the system that the share action was canceled.
   */
  dismissExtension(error?: string): void;

  /**
   * Opens the App from the Share Extension.
   */
  openApp(): void;

  /**
   * Defers the handling of this share action to the main App. You can send any object as a parameter if you need more context to handle the share in-app.
   */
  continueInApp(extraData?: ExtraData): void;

  /**
   * Gets the shared data this Share Extension was opened with.
   */
  data(): Promise<SharedItem>;
}
export interface ShareMenuModule {
  /**
   * Gets the shared item the app was opened with, if any.
   */
  getInitialShare(callback: (item: SharedItem | null) => void): void;

  /**
   * Adds a listener for receiving shared data from other apps. Call `listener.remove()` to remove it on unmount.
   * @param callback Callback function to handle the shared item
   * @returns Object with a remove method to unregister the listener
   */
  addNewShareListener(callback: (item: SharedItem) => void): { remove(): void };
}

export declare const ShareMenuReactView: ShareMenuReactView;
declare const ShareMenu: ShareMenuModule;

export default ShareMenu;
