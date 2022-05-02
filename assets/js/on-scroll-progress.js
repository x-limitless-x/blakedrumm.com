document.addEventListener('scroll', _ => {
  var docElem = document.documentElement;
  var docBody = document.body;
  var scrollTop = (docBody.scrollTop || docElem.scrollTop);
  var height = docElem.scrollHeight - docElem.clientHeight;

  progress = scrollTop / height * 100;

  // only run if the element exists to be updated
  if ( progress > 0 && document.querySelector('#progress-bar') !== null ) {
    progressBar = document.querySelector('#progress-bar');
    progressBar.style.setProperty('--progress', progress + '%');
  } else {
    progressBar.style.setProperty('--progress', '0%');
  }
});
