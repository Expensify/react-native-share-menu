import { NativeEventEmitter, NativeModules } from "react-native";

const { ShareMenu } = NativeModules;

const EventEmitter = new NativeEventEmitter(ShareMenu);

const NEW_SHARE_EVENT_NAME = "NewShareEvent";

export const ShareMenuReactView = {
  continueInApp(extraData = null) {
    NativeModules.ShareMenuReactView.continueInApp(extraData);
  },
  data() {
    return NativeModules.ShareMenuReactView.data();
  },
  dismissExtension(error = null) {
    NativeModules.ShareMenuReactView.dismissExtension(error);
  },
  isExtension: !!(
    NativeModules.ShareMenuReactView &&
    NativeModules.ShareMenuReactView.isExtension
  ),
  openApp() {
    NativeModules.ShareMenuReactView.openApp();
  },
};

export default {
  /**
   * @deprecated Use `getInitialShare` instead. This is here for backwards compatibility.
   */
  getSharedText(callback) {
    this.getInitialShare(callback);
  },
  getInitialShare(callback) {
    ShareMenu.getSharedText(callback);
  },
  addNewShareListener(callback) {
    const subscription = EventEmitter.addListener(
      NEW_SHARE_EVENT_NAME,
      callback
    );

    return subscription;
  },
};
