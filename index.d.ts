export type SharedItem = {
  mimeType: string;
  data: string;
  extraData: any;
};

export interface ShareMenuReactView {
  dismissExtension(error?: string): void;
  openApp(): void;
  continueInApp(extraData?: any): void;
  data(): Promise<SharedItem>;
}

export interface ShareMenuModule {
  getSharedText(callback: (text: string) => void): void;
  getInitialShare(callback: (item: SharedItem | null) => void): void;
  addNewShareListener(callback: (item: SharedItem) => void): { remove(): void };
}

export declare const ShareMenuReactView: ShareMenuReactView;
declare const ShareMenu: ShareMenuModule;

export default ShareMenu;
