document.addEventListener('scroll', _ => {
  var scrollTop = (TopNav);
  var height = docElem.scrollHeight - docElem.clientHeight;

  progress = TopNav / height * 100;

  if ( progress > 0) {
    progressBar = document.querySelector('#progress-bar');
    progressBar.style.setProperty('--progress', progress + '%');
  } else {
    progressBar.style.setProperty('--progress', '0%');
  }
});

