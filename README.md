# jQuery fullscreen plugin for all browsers

Allows to display given element or whole `document` in fullscreen mode by using [requestFullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Element.requestFullScreen).

Gracefully degrades to fake fullscreen (div covering whole viewport) when requestFullscreen is not supported at all. Plugin is written to make use all of the vendor implementations (currently all major browsers use vendor prefixes).

## Usage

In order to work plugin must be called on **real click or keyboard event**.

### Simple example

Check [live editable example of jquery-fullscreen](http://jsbin.com/tizikefefa/2/) or `demo` directory.

```javascript
 $('a').click(function() {
   $('div').fullscreen().request();
 }
```

Code above will open given element in Fullscreen mode after clicking on a link. Simple, right?

### Available methods

* `request()` open given element or document in Fullscreen mode
* `cancel()` close
* `isActive()` return `true` or `false` basing on whether full page is in fullscreen mode
* `toggle()` toggle between fullscreen mode on and off (useful when you want just one button)

### Events

When using any of switching methods (`request()`, `cancel()` or `toggle()`) `fullScreenChange` event is sent on `document` element.

Example:

```javascript
 $(document).on('fullScreenChange', function() {
   console.log('Full screen toggled!'); 
 });
```

## Browser support

Since plugin will gracefully degrade for users without [requestFullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Element.requestFullScreen) it's not a big deal.

According to [caniuse.com usage statistics](http://caniuse.com/#feat=fullscreen) native Fullscreen API is supported in **67%** of global browsers.

## Are there any tests ?

Unfortunately no, mostly because of browser limitation (no fake clicks). However, if you have an idea how to overcome this in simple manner please let me know.

## License

MIT

## Contributing 

Fork, make your feature/bugfix branch and create pull request. 

## Development plans

* Make plugin UMD compatible
* Prepare bower package
* Prepare minimized, distribution ready version using gulp workflow
* Investigate and describe usage with iframes 






