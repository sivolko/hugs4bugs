---
title: Progressive WebApp.
date: 2021-11-02 23:04:08 Z
categories:
- webapps
tags:
- WebApps
- PWA
- Progressive WebApp
layout: post
subtitle: Code Once,Install Everywhere.
description: How you ever seen add to home screen or install popup on .
image: https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80
optimized_image: https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80
author: Shubhendu Shubham
paginate: true
---

## What are Progressive WebApps?

In a straight forward way, Progressive WebApps are a new way to install web apps on mobile devices and are the just the next step in the evolution of the web.

Web apps can reach anyone,anywhere, on any device with a single codebase.When it comes to the platform specific applications, PWA are known for being incredibly rich and reliable.They're present, on home screens, on the home screens, docks and the taskbars. They work regardless of network connection.They can launch in their standalone experience,can read & write files from the local file system,access hardware connected via USB,serial or bluetooth, and even interact with data stored on your device, like contacts,calendar,photos,music,videos,etc.

![Capability vs Reach Platform](https://web-dev.imgix.net/image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1DKtUFjXLJbiiruKA9P1.svg)

PWA are built and enhanched with modern APIs to deliver enhanced capabilities,reliability,and installability while reaching anyone, anywhere,on any device with a single codebase.

**Three Pillars of PWA**

Three Pillars of Progressive WebApps are

1. Capable
2. Reliable
3. Installable

## What makes a good Progessive WebApp?

Here comes the core progressive WebApp checklist

The Progressive WebAPP checklist describes what makes an app installable and usable by all users, regardless of size and input type.

- Starts fast,stays fast

Performance palys a significant role in the success of any online experience,because high performing sites engages and retain users better than poorly performing ones. Sites should focus on optimizing for user-centric performance metrics.

- Works in any browser

User can use any browser they choose to access your web app before it's installed.

- Responsive to any screen size

User can use your PWA on any screen size and all of the content is available at any viewport size

- Provides a custom offline page

When users are offline,keeping them in your PWA provides a more seamless experience than dropping back to the default browser offline page.

- Installable

Users who install or add apps to their device tend to engage with those apps more than those who don't.

**Optimal Progressive Web App checklist**

To create a truly great Progressive Web App, one that feels like a best-in -class app, you need more than just the core checklist.The optimal Progressive Web App checklist is about making your PWA feel like it's part of the device it's running on while taking advantage of what makes the web powerful.

**Provides an offline experience**

Where connectivity isn't strictly required, users can still access your app's content.

**Fully accessible**

All user interaction pass [WCAG 2.0](https://www.w3.org/WAI/WCAG20/) accessibility requirements.

**Can be discovered through search**

Your PWA can be easily discovered through search.

**Works with any input type**

Your PWA is equally usable with a mouse, a keyboard, a stylus, or a touchscreen.

**Provides context for permission request**

When asking permission to use powerful APIs, Provides context ans ask only when the API is needed.

**Follows best practices for healthy code**

Keeping your codebase healthy makes it easier to meet your goals and deliver new features.

## What makes PWA installable?

Progressive Web Apps (PWAs) are modern, high quality applications built using web technology. PWAs offer similar capabilities to iOS/Android/desktop apps, they are reliable even in unstable network conditions, and are installable making it easier for users to find and use them.

Most users are familiar with installing applications, and the benefits of an installed experience. Installed applications appear on operating system launch surfaces, such as the Applications folder on Mac OS X, the Start menu on Windows, and the homescreen on Android and iOS. Installed applications also show up in the activity switcher, device search engines such as Spotlight and in content sharing sheets.

Most browsers indicate to the user that your Progressive Web App (PWA) is installable when it meets certain criteria. Example indicators include an Install button in the address bar, or an Install menu item in the overflow menu.

![Installable](https://web-dev.imgix.net/image/tcFciHGuF3MxnTr1y5ue01OGLBn2/O9KXz4aQXm3ZOzPo98uT.png?auto=format&w=845)

![Installble2](https://web-dev.imgix.net/image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bolh05TCEeT7xni4eUTG.png?auto=format&w=845)

**Installtion criteria**

In chrome, your progressive Web App must the following criteria before it will fire the _beforeinstallprompt_ event and show the in-browser install prompt.

- The Web App is not already installed
- Meets a user engaquement heuristic
- Be served over [HTTPS](https://www.bing.com/search?q=https&cvid=7fe87ebe7f9140b787e17a93bac7331b&aqs=edge..69i57j0j69i60l3j69i65l3j69i60.2041j0j4&FORM=ANAB01&PC=U531)
- Must includes a [web APP manifest](https://developers.google.com/web/fundamentals/web-app-manifest/) that includes:-
  - short_name or name
  - icons -must include a 192px and a 512px icon
  - start_url
  - display - must be one of _fullsecreen_ ,_standalone_ or _minimal-ui_
  - prefer_related_applications - must be false

**Adding a web App manifest**

The web app manifest is a JSON file that tells the browser about your Progressive Web App and how it should behave when installed on the user's desktop or mobile device. A typical manifest file includes the app name, the icons the app should use, and the URL that should be opened when the app is launched.

Manifest files are supported in Chrome, Edge, Firefox, UC Browser, Opera, and the Samsung browser. Safari has partial support.

**Creating a manifest file**

The manifest file can have any name, but is commonly named manifest.json and served from the root (your website's top-level directory). The specification suggests the extension should be .webmanifest, but browsers also support .json extensions, which is may be easier for developers to understand.

```Manifest.json

{
  "short_name": "Weather",
  "name": "Weather: Do I need an umbrella?",
  "icons": [
    {
      "src": "/images/icons-vector.svg",
      "type": "image/svg+xml",
      "sizes": "512x512"
    },
    {
      "src": "/images/icons-192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "/images/icons-512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": "/?source=pwa",
  "background_color": "#3367D6",
  "display": "standalone",
  "scope": "/",
  "theme_color": "#3367D6",
  "shortcuts": [
    {
      "name": "How's weather today?",
      "short_name": "Today",
      "description": "View weather information for today",
      "url": "/today?source=pwa",
      "icons": [{ "src": "/images/today.png", "sizes": "192x192" }]
    },
    {
      "name": "How's weather tomorrow?",
      "short_name": "Tomorrow",
      "description": "View weather information for tomorrow",
      "url": "/tomorrow?source=pwa",
      "icons": [{ "src": "/images/tomorrow.png", "sizes": "192x192" }]
    }
  ],
  "description": "Weather forecast information",
  "screenshots": [
    {
      "src": "/images/screenshot1.png",
      "type": "image/png",
      "sizes": "540x720"
    },
    {
      "src": "/images/screenshot2.jpg",
      "type": "image/jpg",
      "sizes": "540x720"
    }
  ]
}
```

**Key manifest properties**

_short_name and/or name_

You must provide at least the short_name or name property. If both are provided, short_name is used on the user's home screen, launcher, or other places where space may be limited. name is used when the app is installed.

_Icons_

When a user installs your PWA, you can define a set of icons for the browser to use on the home screen, app launcher, task switcher, splash screen, and so on.

The icons property is an array of image objects. Each object must include the src, a sizes property, and the type of image. To use maskable icons, sometimes referred to as adaptive icons on Android, you'll also need to add "purpose": "any maskable" to the icon property.

For Chromium, you must provide at least a 192x192 pixel icon, and a 512x512 pixel icon. If only those two icon sizes are provided, Chrome will automatically scale the icons to fit the device. If you'd prefer to scale your own icons, and adjust them for pixel-perfection, provide icons in increments of 48dp.

_start_url_

The start_url is required and tells the browser where your application should start when it is launched, and prevents the app from starting on whatever page the user was on when they added your app to their home screen.

Your start_url should direct the user straight into your app, rather than a product landing page. Think about what the user will want to do once they open your app, and place them there.

_background_color_
The background_color property is used on the splash screen when the application is first launched on mobile.

_display_

You can customize what browser UI is shown when your app is launched. For example, you can hide the address bar and browser chrome. Games can even be made to launch full screen.

| Property | Use |
| Fullscreen| fullscreen Opens the web application without any browser UI and takes up the entirety of the available display area.|
| Standalone| standalone Opens the web application in a standalone window.|

![standalone](https://web-dev.imgix.net/image/tcFciHGuF3MxnTr1y5ue01OGLBn2/XdBsDeRZozIyXyiXA59n.png?auto=format&w=845)

| Minimal-ui| minimal-ui Hides the browser UI, such as the address bar and the browser chrome.|
![minimal-ui](https://web-dev.imgix.net/image/tcFciHGuF3MxnTr1y5ue01OGLBn2/trPwjcMio7tBKGBNoT9u.png?auto=format&w=845)

| Browser | A standard browser experience.|

_display_override_

Web apps can choose how they are displayed by setting a display mode in their manifest as explained above. Browsers are not required to support all display modes, but they are required to support the spec-defined fallback chain ("fullscreen" → "standalone" → "minimal-ui" → "browser"). If they don't support a given mode, they fall back to the next display mode in the chain. This inflexible behavior can be problematic in rare cases, for example, a developer cannot request "minimal-ui" without being forced back into the "browser" display mode when "minimal-ui" is not supported. Another problem is that the current behavior makes it impossible to introduce new display modes in a backward compatible way, since explorations like tabbed application mode don't have a natural place in the fallback chain.

These problems are solved by the display_override property, which the browser considers before the display property. Its value is a sequence of strings that are considered in the listed order, and the first supported display mode is applied. If none are supported, the browser falls back to evaluating the display field.

In the example below, the display mode fallback chain would be as follows. (The details of "window-control-overlay" are out-of-scope for this article.)

"window-control-overlay" (First, look at display_override.)
"minimal-ui"
"standalone" (When display_override is exhausted, evaluate display.)
"minimal-ui" (Finally, use the display fallback chain.)
"browser"

```
{
  "display_override": ["window-control-overlay", "minimal-ui"],
  "display": "standalone",
}
```

_Scope_

The scope defines the set of URLs that the browser considers to be within your app, and is used to decide when the user has left the app. The scope controls the URL structure that encompasses all the entry and exit points in your web app. Your start_url must reside within the scope.

A few other notes on scope:

If you don't include a scope in your manifest, then the default implied scope is the directory that your web app manifest is served from.
The scope attribute can be a relative path (../), or any higher level path (/) which would allow for an increase in coverage of navigations in your web app.
The start_url must be in the scope.
The start_url is relative to the path defined in the scope attribute.
A start_url starting with / will always be the root of the origin.

_theme_color_

SHARE
Add a web app manifest
Nov 5, 2018 • Updated Oct 21, 2021
Appears in: Progressive Web Apps
Pete LePage
Pete LePage
Twitter
GitHub
Glitch
Blog
François Beaufort
François Beaufort
GitHub
Thomas Steiner
Thomas Steiner
Twitter
GitHub
Glitch
Blog
The web app manifest is a JSON file that tells the browser about your Progressive Web App and how it should behave when installed on the user's desktop or mobile device. A typical manifest file includes the app name, the icons the app should use, and the URL that should be opened when the app is launched.

Manifest files are supported in Chrome, Edge, Firefox, UC Browser, Opera, and the Samsung browser. Safari has partial support.

Create the manifest file #
The manifest file can have any name, but is commonly named manifest.json and served from the root (your website's top-level directory). The specification suggests the extension should be .webmanifest, but browsers also support .json extensions, which is may be easier for developers to understand.

{
"short_name": "Weather",
"name": "Weather: Do I need an umbrella?",
"icons": [
{
"src": "/images/icons-vector.svg",
"type": "image/svg+xml",
"sizes": "512x512"
},
{
"src": "/images/icons-192.png",
"type": "image/png",
"sizes": "192x192"
},
{
"src": "/images/icons-512.png",
"type": "image/png",
"sizes": "512x512"
}
],
"start_url": "/?source=pwa",
"background_color": "#3367D6",
"display": "standalone",
"scope": "/",
"theme_color": "#3367D6",
"shortcuts": [
{
"name": "How's weather today?",
"short_name": "Today",
"description": "View weather information for today",
"url": "/today?source=pwa",
"icons": [{ "src": "/images/today.png", "sizes": "192x192" }]
},
{
"name": "How's weather tomorrow?",
"short_name": "Tomorrow",
"description": "View weather information for tomorrow",
"url": "/tomorrow?source=pwa",
"icons": [{ "src": "/images/tomorrow.png", "sizes": "192x192" }]
}
],
"description": "Weather forecast information",
"screenshots": [
{
"src": "/images/screenshot1.png",
"type": "image/png",
"sizes": "540x720"
},
{
"src": "/images/screenshot2.jpg",
"type": "image/jpg",
"sizes": "540x720"
}
]
}
Key manifest properties #
short_name and/or name #
You must provide at least the short_name or name property. If both are provided, short_name is used on the user's home screen, launcher, or other places where space may be limited. name is used when the app is installed.

Operating systems usually expect to have a title for each app window. This title is displayed in various window-switching surfaces such as alt+tab, overview mode, and the shelf window list.

For PWAs running in standalone mode, Chromium will prepend the short_name (or, if short_name is not set, alternatively the name) to what is specified in the <title> of the HTML document to prevent disguies attacks where standalone apps might try to be mistaken, for example, for operating system dialogs.

In consequence, developers shoould not repeat the application name in the <title> when the app is running in standalone mode.

icons #
When a user installs your PWA, you can define a set of icons for the browser to use on the home screen, app launcher, task switcher, splash screen, and so on.

The icons property is an array of image objects. Each object must include the src, a sizes property, and the type of image. To use maskable icons, sometimes referred to as adaptive icons on Android, you'll also need to add "purpose": "any maskable" to the icon property.

For Chromium, you must provide at least a 192x192 pixel icon, and a 512x512 pixel icon. If only those two icon sizes are provided, Chrome will automatically scale the icons to fit the device. If you'd prefer to scale your own icons, and adjust them for pixel-perfection, provide icons in increments of 48dp.

Chromium-based browsers also support SVG icons that can be scaled arbitrarily without looking pixelated and that support advanced features like being responsive to prefers-color-scheme, with the important caveat that the icons do not update live, but remain in the state they were in at install time.

To be on the safe side, you should always specify a rasterized icon as a fallback for browsers that do not support SVG icons.

start_url #
The start_url is required and tells the browser where your application should start when it is launched, and prevents the app from starting on whatever page the user was on when they added your app to their home screen.

Your start_url should direct the user straight into your app, rather than a product landing page. Think about what the user will want to do once they open your app, and place them there.

background_color #
The background_color property is used on the splash screen when the application is first launched on mobile.

display #
You can customize what browser UI is shown when your app is launched. For example, you can hide the address bar and browser chrome. Games can even be made to launch full screen.

Property Use
fullscreen Opens the web application without any browser UI and takes up the entirety of the available display area.
standalone Opens the web app to look and feel like a standalone app. The app runs in its own window, separate from the browser, and hides standard browser UI elements like the URL bar.
An example of a PWA window with standalone display.
minimal-ui This mode is similar to standalone, but provides the user a minimal set of UI elements for controlling navigation (such as back and reload).
An example of a PWA window with minimal-ui display.
browser A standard browser experience.
display_override #
Web apps can choose how they are displayed by setting a display mode in their manifest as explained above. Browsers are not required to support all display modes, but they are required to support the spec-defined fallback chain ("fullscreen" → "standalone" → "minimal-ui" → "browser"). If they don't support a given mode, they fall back to the next display mode in the chain. This inflexible behavior can be problematic in rare cases, for example, a developer cannot request "minimal-ui" without being forced back into the "browser" display mode when "minimal-ui" is not supported. Another problem is that the current behavior makes it impossible to introduce new display modes in a backward compatible way, since explorations like tabbed application mode don't have a natural place in the fallback chain.

These problems are solved by the display_override property, which the browser considers before the display property. Its value is a sequence of strings that are considered in the listed order, and the first supported display mode is applied. If none are supported, the browser falls back to evaluating the display field.

In the example below, the display mode fallback chain would be as follows. (The details of "window-control-overlay" are out-of-scope for this article.)

"window-control-overlay" (First, look at display_override.)
"minimal-ui"
"standalone" (When display_override is exhausted, evaluate display.)
"minimal-ui" (Finally, use the display fallback chain.)
"browser"

{
"display_override": ["window-control-overlay", "minimal-ui"],
"display": "standalone",
}
The browser will not consider display_override unless display is also present.

scope #
The scope defines the set of URLs that the browser considers to be within your app, and is used to decide when the user has left the app. The scope controls the URL structure that encompasses all the entry and exit points in your web app. Your start_url must reside within the scope.

Caution: If the user clicks a link in your app that navigates outside of the scope, the link will open and render within the existing PWA window. If you want the link to open in a browser tab, you must add target="\_blank" to the <a> tag. On Android, links with target="\_blank" will open in a Chrome Custom Tab.

A few other notes on scope:

If you don't include a scope in your manifest, then the default implied scope is the directory that your web app manifest is served from.
The scope attribute can be a relative path (../), or any higher level path (/) which would allow for an increase in coverage of navigations in your web app.
The start_url must be in the scope.
The start_url is relative to the path defined in the scope attribute.
A start_url starting with / will always be the root of the origin.
theme_color #
The theme_color sets the color of the tool bar, and may be reflected in the app's preview in task switchers. The theme_color should match the meta theme color specified in your document head

```code

<meta name="theme-color" media="(prefers-color-scheme: light)" content="white">
<meta name="theme-color" media="(prefers-color-scheme: dark)"  content="black">
```

_shortcuts_

The shortcuts property is an array of app shortcut objects whose goal is to provide quick access to key tasks within your app. Each member is a dictionary that contains at least a name and a url.

_description_

The description property describes the purpose of your app.

_screenshots_

The screenshots property is an array of image objects, representing your app in common usage scenarios. Each object must include the src, a sizes property, and the type of image.

In Chrome, the image must respond to certain criteria:

Width and height must be at least 320px and at most 3840px.
The maximum dimension can't be more than 2.3 times as long as the minimum dimension.
Screenshots must have the same aspect ratio.
Only JPEG and PNG image formats are supported.

_Add the web app manifest to your pages_

After creating the manifest, add a <link> tag to all the pages of your Progressive Web App. For example:

```
<link rel="manifest" href="/manifest.json">
```
