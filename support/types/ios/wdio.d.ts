declare namespace WebdriverIO {
  interface MultiRemoteBrowser {
    UserA: WebdriverIO.Browser;
    UserB: WebdriverIO.Browser;
    [key: string]: WebdriverIO.Browser;
  }
}

declare global {
  var driver: WebdriverIO.MultiRemoteBrowser;
}
