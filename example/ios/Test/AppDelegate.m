#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <React_RCTAppDelegate/RCTDefaultReactNativeFactoryDelegate.h>
#import <React_RCTAppDelegate/RCTReactNativeFactory.h>
#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>
#import <RNShareMenu/ShareMenuManager.h>

static void handleSharedURLs(NSSet<UIOpenURLContext *> *contexts)
{
  for (UIOpenURLContext *context in contexts) {
    NSMutableDictionary<UIApplicationOpenURLOptionsKey, id> *options = [NSMutableDictionary new];
    if (context.options.sourceApplication) {
      options[UIApplicationOpenURLOptionsSourceApplicationKey] = context.options.sourceApplication;
    }
    if (context.options.annotation) {
      options[UIApplicationOpenURLOptionsAnnotationKey] = context.options.annotation;
    }
    options[UIApplicationOpenURLOptionsOpenInPlaceKey] = @(context.options.openInPlace);
    [ShareMenuManager application:UIApplication.sharedApplication openURL:context.URL options:options];
  }
}

@interface SceneDelegate : RCTDefaultReactNativeFactoryDelegate <UIWindowSceneDelegate>
@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) RCTReactNativeFactory *reactNativeFactory;
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  return YES;
}

@end

@implementation SceneDelegate

- (void)scene:(UIScene *)scene
    willConnectToSession:(UISceneSession *)session
                 options:(UISceneConnectionOptions *)connectionOptions
{
  if (![scene isKindOfClass:[UIWindowScene class]]) {
    return;
  }
  self.dependencyProvider = [RCTAppDependencyProvider new];
  self.reactNativeFactory = [[RCTReactNativeFactory alloc] initWithDelegate:self];
  self.window = [[UIWindow alloc] initWithWindowScene:(UIWindowScene *)scene];
  [self.reactNativeFactory startReactNativeWithModuleName:@"example" inWindow:self.window connectionOptions:connectionOptions];
  handleSharedURLs(connectionOptions.URLContexts);
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (void)scene:(UIScene *)scene openURLContexts:(NSSet<UIOpenURLContext *> *)URLContexts
{
  [RCTLinkingManager scene:scene openURLContexts:URLContexts];
  handleSharedURLs(URLContexts);
}

@end
