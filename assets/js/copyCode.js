// Automatically inject code headers before code blocks
document.addEventListener('DOMContentLoaded', () => {
  const codeBlocks = document.querySelectorAll('div.highlighter-rouge');
  const MAX_LINES = 100; // Maximum lines to show when collapsed
  
  codeBlocks.forEach((codeBlock) => {
    // Skip if code header already exists
    if (codeBlock.querySelector('.code-header')) {
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
      
      // Check if Clipboard API is available
      if (!navigator.clipboard) {
        console.error('Clipboard API not available');
        return;
      }
      
      navigator.clipboard.writeText(code).then(() => {
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
    
    // Assemble and insert - insert inside the code block as first child
    codeHeader.appendChild(copyButton);
    codeBlock.insertBefore(codeHeader, codeBlock.firstChild);
    
    // Check if code block is long and add expand/collapse functionality
    const preElement = codeBlock.querySelector('pre');
    if (preElement) {
      const codeElement = preElement.querySelector('code');
      if (codeElement) {
        const lines = codeElement.textContent.split('\n');
        
        if (lines.length > MAX_LINES) {
          // Add collapsed class initially
          codeBlock.classList.add('code-block-collapsed');
          
          // Create expand button
          const expandButton = document.createElement('button');
          expandButton.className = 'expand-code-button';
          expandButton.setAttribute('type', 'button');
          
          // Create icon and text elements separately for security
          const createButtonContent = (isExpanded) => {
            // Clear existing content
            expandButton.textContent = '';
            
            const icon = document.createElement('span');
            icon.className = 'expand-icon';
            icon.textContent = isExpanded ? '▲' : '▼';
            
            const text = document.createTextNode(isExpanded ? ' Collapse code' : ` Show full code (${lines.length} lines)`);
            
            expandButton.appendChild(icon);
            expandButton.appendChild(text);
          };
          
          // Set initial button content
          createButtonContent(false);
          
          // Add click event to expand button
          expandButton.addEventListener('click', () => {
            if (codeBlock.classList.contains('code-block-collapsed')) {
              codeBlock.classList.remove('code-block-collapsed');
              codeBlock.classList.add('code-block-expanded');
              createButtonContent(true);
            } else {
              codeBlock.classList.add('code-block-collapsed');
              codeBlock.classList.remove('code-block-expanded');
              createButtonContent(false);
              // Scroll to the top of the code block when collapsing
              codeBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          });
          
          // Insert expand button after the code block
          codeBlock.parentNode.insertBefore(expandButton, codeBlock.nextSibling);
        }
      }
    }
  });
});
