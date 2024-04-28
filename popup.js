document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({}, function(tabs) {
      var ul = document.getElementById('tabUrls');
      tabs.forEach(function(tab) {
        var li = document.createElement('li');
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        var a = document.createElement('a');
        a.href = tab.url;
        a.textContent = tab.url;
        li.appendChild(checkbox);
        li.appendChild(a);
        ul.appendChild(li);
      });
    });
  
    document.getElementById('downloadButton').addEventListener('click', function() {
      chrome.tabs.query({}, function(tabs) {
        var selectedUrls = [];
        var checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function(checkbox, index) {
          if (checkbox.checked) {
            selectedUrls.push(tabs[index].url);
          }
        });
        var blob = new Blob([selectedUrls.join('\n')], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'selected_urls.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    });
  
    document.getElementById('loadButton').addEventListener('click', function() {
      var fileInput = document.getElementById('fileInput');
      fileInput.addEventListener('change', function(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function(event) {
          var urls = event.target.result.split('\n');
          urls.forEach(function(url) {
            chrome.tabs.create({ url: url });
          });
        };
        reader.readAsText(file);
      });
    });
  });
  