(function() {
  if('ontouchstart' in window || window.navigator.msMaxTouchPoints) {
    // touch devices only

    // https://css-tricks.com/snippets/javascript/get-url-variables/
    function getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
      }
      return(false);
    }

    var head = document.getElementsByTagName('head')[0];
    var body = document.getElementsByTagName('body')[0];

    // set viewport
    if(getQueryVariable('w')) {
      var viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=' + getQueryVariable('w');
      head.appendChild(viewport);
    }

    // add the mobile back button
    var n = getQueryVariable('n');
    var uri = 'http://infographics.economist.com/';

    // mobile stylesheet insertion
    var stylesheetLink = document.createElement('link');
    stylesheetLink.setAttribute('rel', 'stylesheet');
    stylesheetLink.setAttribute('href', uri + '/css_libraries/infographic_mobile.css');
    stylesheetLink.setAttribute('type', 'text/css');
    head.appendChild(stylesheetLink);

    // back button insertion
    var buttonContainer = document.createElement('div');
    buttonContainer.setAttribute('class', 'infographic-placeholder');
    var backLink = document.createElement('a');
    backLink.setAttribute('href',
      n ? 'http://www.economist.com/node/' + n :
      document.referrer ? document.referrer : 'http://www.economist.com/blogs/graphicdetail'
    );
    buttonContainer.appendChild(backLink);
    var backButton = document.createElement('button');
    backButton.setAttribute('type', 'button');
    backButton.setAttribute('value', '');
    backButton.innerHTML = 'Back to article';
    backLink.appendChild(backButton);
    body.appendChild(buttonContainer);

    // footer insertion
    var framelessFooter = document.createElement('div');
    framelessFooter.setAttribute('class', 'frameless-footer');
    framelessFooter.innerHTML = 'Economist.com';
    body.appendChild(framelessFooter);

    // end touch devices only
  }
})();
