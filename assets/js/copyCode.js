// Automatically inject code headers before code blocks
document.addEventListener('DOMContentLoaded', () => {
  const codeBlocks = document.querySelectorAll('.highlighter-rouge');
  
  codeBlocks.forEach((codeBlock) => {
    // Skip if code header already exists
    if (codeBlock.previousElementSibling?.classList.contains('code-header')) {
      return;
    }
    
    // Create code header div
    const codeHeader = document.createElement('div');
    codeHeader.className = 'code-header';
    
    // Create copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-button fas fa-copy';
    copyButton.setAttribute('aria-label', 'Copy code to clipboard');
    copyButton.setAttribute('type', 'button');
    
    // Add click event to copy button
    copyButton.addEventListener('click', () => {
      const code = codeBlock.innerText;
      window.navigator.clipboard.writeText(code).then(() => {
        copyButton.classList.remove('fa-copy');
        copyButton.classList.add('fa-check');
        
        setTimeout(() => {
          copyButton.classList.remove('fa-check');
          copyButton.classList.add('fa-copy');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy code: ', err);
      });
    });
    
    // Assemble and insert
    codeHeader.appendChild(copyButton);
    codeBlock.parentNode.insertBefore(codeHeader, codeBlock);
  });
});
