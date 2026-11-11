// React Native 0.82+ custom share view.
// Add this file to the share extension instead of ReactShareViewController.swift.

import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import RNShareMenu

private class ShareReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index.share")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}

class ReactShareViewController: ShareViewController, ReactShareViewDelegate {
  // The factory holds its delegate weakly, so both must live as long as the view.
  private let reactNativeDelegate = ShareReactNativeDelegate()
  private var reactNativeFactory: RCTReactNativeFactory?

  override func viewDidLoad() {
    super.viewDidLoad()

    reactNativeDelegate.dependencyProvider = RCTAppDependencyProvider()
    let factory = RCTReactNativeFactory(delegate: reactNativeDelegate)
    reactNativeFactory = factory
    let rootView = factory.rootViewFactory.view(withModuleName: "ShareMenuModuleComponent")

    rootView.backgroundColor = UIColor(red: 1, green: 1, blue: 1, alpha: 1)
    backgroundColorSetup: if let backgroundColorConfig = Bundle.main.infoDictionary?[REACT_SHARE_VIEW_BACKGROUND_COLOR_KEY] as? [String:Any] {
      if let transparent = backgroundColorConfig[COLOR_TRANSPARENT_KEY] as? Bool, transparent {
        rootView.backgroundColor = nil
        break backgroundColorSetup
      }

      let red = backgroundColorConfig[COLOR_RED_KEY] as? Float ?? 1
      let green = backgroundColorConfig[COLOR_GREEN_KEY] as? Float ?? 1
      let blue = backgroundColorConfig[COLOR_BLUE_KEY] as? Float ?? 1
      let alpha = backgroundColorConfig[COLOR_ALPHA_KEY] as? Float ?? 1

      rootView.backgroundColor = UIColor(red: CGFloat(red), green: CGFloat(green), blue: CGFloat(blue), alpha: CGFloat(alpha))
    }

    self.view = rootView
    ShareMenuReactView.attachViewDelegate(self)
  }

  override func viewDidDisappear(_ animated: Bool) {
    cancel()
    ShareMenuReactView.detachViewDelegate()
  }

  func loadExtensionContext() -> NSExtensionContext {
    return extensionContext!
  }

  func openApp() {
    self.openHostApp()
  }

  func continueInApp(with items: [NSExtensionItem], and extraData: [String:Any]?) {
    handlePost(items, extraData: extraData)
  }
}
