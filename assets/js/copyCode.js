// Gzip compress and base64 encode a string (for Azure query URL parameters)
async function gzipBase64Encode(text) {
  var encoder = new TextEncoder();
  var data = encoder.encode(text);
  var cs = new CompressionStream('gzip');
  var writer = cs.writable.getWriter();
  writer.write(data);
  writer.close();
  var reader = cs.readable.getReader();
  var chunks = [];
  while (true) {
    var result = await reader.read();
    if (result.done) break;
    chunks.push(result.value);
  }
  var totalLength = chunks.reduce(function(sum, chunk) { return sum + chunk.length; }, 0);
  var compressed = new Uint8Array(totalLength);
  var offset = 0;
  for (var i = 0; i < chunks.length; i++) {
    compressed.set(chunks[i], offset);
    offset += chunks[i].length;
  }
  var binary = '';
  for (var j = 0; j < compressed.length; j++) {
    binary += String.fromCharCode(compressed[j]);
  }
  return btoa(binary);
}

// Azure service configurations for KQL "Try in Azure" button
// Supported services: "dataexplorer", "loganalytics", "sentinel"
// Set per code block with: data-azure-service="<service>" on wrapper div or via Kramdown IAL
function buildLogAnalyticsUrl(encoded) {
  return 'https://portal.azure.com/#blade/Microsoft_Azure_Monitoring_Logs/DemoLogsBlade/resourceId/%2FDemo/source/LogsBlade.AnalyticsShareLinkToQuery/q/' + encodeURIComponent(encoded) + '/openedFromBlade/LogsBlade';
}
const AZURE_SERVICES = {
  dataexplorer: {
    label: 'Try in Azure Data Explorer',
    buildUrl: function(encoded) {
      return 'https://dataexplorer.azure.com/clusters/help/databases/Samples?query=' + encodeURIComponent(encoded);
    }
  },
  loganalytics: {
    label: 'Try in Log Analytics',
    buildUrl: buildLogAnalyticsUrl
  },
  sentinel: {
    label: 'Try in Sentinel',
    buildUrl: buildLogAnalyticsUrl
  }
};
const DEFAULT_AZURE_SERVICE = 'loganalytics';

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
    
    // Extract language from the code element's class or the wrapper div's class
    // Jekyll/Rouge puts "language-xxx" on the wrapper div (e.g., "language-kql highlighter-rouge")
    // but the inner <code> element may not have a language class
    const codeElement = codeBlock.querySelector('code[class*="language-"]');
    let language = null;
    let langMatch = null;
    if (codeElement) {
      langMatch = codeElement.className.match(/language-(\S+)/);
    }
    if (!langMatch) {
      langMatch = codeBlock.className.match(/language-(\S+)/);
    }
    if (langMatch && langMatch[1].toLowerCase() !== 'plaintext') {
      language = langMatch[1].toLowerCase();
      const langLabel = document.createElement('span');
      langLabel.className = 'code-lang-label';
      langLabel.textContent = langMatch[1];
      codeHeader.appendChild(langLabel);
    }

    // Create button actions container
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'code-header-actions';

    // Add "Try in Azure" button for KQL/Kusto code blocks
    if (language === 'kql' || language === 'kusto') {
      // Determine which Azure service to use:
      // 1. Check data-azure-service on this element or closest ancestor (via Kramdown IAL or wrapper div)
      // 2. Fall back to DEFAULT_AZURE_SERVICE
      // Supported values: "dataexplorer", "loganalytics", "sentinel"
      const serviceEl = codeBlock.closest('[data-azure-service]');
      const serviceKey = (serviceEl ? serviceEl.getAttribute('data-azure-service') : DEFAULT_AZURE_SERVICE).toLowerCase();
      const service = AZURE_SERVICES[serviceKey] || AZURE_SERVICES[DEFAULT_AZURE_SERVICE];

      const tryAzureButton = document.createElement('button');
      tryAzureButton.className = 'try-azure-button';
      tryAzureButton.setAttribute('type', 'button');
      tryAzureButton.setAttribute('aria-label', service.label);

      const iconSpan = document.createElement('i');
      iconSpan.className = 'fas fa-external-link-alt';
      iconSpan.setAttribute('aria-hidden', 'true');

      const btnText = document.createTextNode(' ' + service.label);
      tryAzureButton.appendChild(iconSpan);
      tryAzureButton.appendChild(btnText);

      tryAzureButton.addEventListener('click', async () => {
        const codeContent = codeBlock.querySelector('pre code');
        const code = codeContent ? codeContent.textContent : '';
        let url;
        try {
          const encoded = await gzipBase64Encode(code);
          url = service.buildUrl(encoded);
        } catch (err) {
          url = service.buildUrl(encodeURIComponent(code));
        }
        window.open(url, '_blank', 'noopener,noreferrer');
      });

      actionsContainer.appendChild(tryAzureButton);
    }
    
    // Create copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-button fas fa-copy';
    copyButton.setAttribute('aria-label', 'Copy code to clipboard');
    copyButton.setAttribute('type', 'button');
    
    // Add click event to copy button
    copyButton.addEventListener('click', () => {
      const codeContent = codeBlock.querySelector('pre code');
      const code = codeContent ? codeContent.textContent : codeBlock.innerText;
      
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
    actionsContainer.appendChild(copyButton);
    codeHeader.appendChild(actionsContainer);
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
