var util = util || {};
util.toArray = function(list) {
  return Array.prototype.slice.call(list || [], 0);
};

var Terminal = Terminal || function(cmdLineContainer, outputContainer) {
  window.URL = window.URL || window.webkitURL;
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

  var cmdLine_ = document.querySelector(cmdLineContainer);
  var output_ = document.querySelector(outputContainer);

  const CMDS_ = [
    'clear', 'clock', 'date', 'echo', 'help', 'name', 'reload', 'uname', 'whoami'
  ];
  
  var fs_ = null;
  var cwd_ = null;
  var history_ = [];
  var histpos_ = 0;
  var histtemp_ = 0;

  window.addEventListener('click', function(e) {
    cmdLine_.focus();
  }, false);

  cmdLine_.addEventListener('click', inputTextClick_, false);
  cmdLine_.addEventListener('keydown', historyHandler_, false);
  cmdLine_.addEventListener('keydown', processNewCommand_, false);

  //
  function inputTextClick_(e) {
    this.value = this.value;
  }

  //
  function historyHandler_(e) {
    if (history_.length) {
      if (e.keyCode == 38 || e.keyCode == 40) {
        if (history_[histpos_]) {
          history_[histpos_] = this.value;
        } else {
          histtemp_ = this.value;
        }
      }

      if (e.keyCode == 38) { // up
        histpos_--;
        if (histpos_ < 0) {
          histpos_ = 0;
        }
      } else if (e.keyCode == 40) { // down
        histpos_++;
        if (histpos_ > history_.length) {
          histpos_ = history_.length;
        }
      }

      if (e.keyCode == 38 || e.keyCode == 40) {
        this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
        this.value = this.value; // Sets cursor to end of input.
      }
    }
  }

  //
  function processNewCommand_(e) {

    if (e.keyCode == 9) { // tab
      e.preventDefault();
      // Implement tab suggest.
    } else if (e.keyCode == 13) { // enter
      // Save shell history.
      if (this.value) {
        history_[history_.length] = this.value;
        histpos_ = history_.length;
      }

      // Duplicate current input and append to output section.
      var line = this.parentNode.parentNode.cloneNode(true);
      line.removeAttribute('id')
      line.classList.add('line');
      var input = line.querySelector('input.cmdline');
      input.autofocus = false;
      input.readOnly = true;
      output_.appendChild(line);

      if (this.value && this.value.trim()) {
        var args = this.value.split(' ').filter(function(val, i) {
          return val;
        });
        var cmd = args[0].toLowerCase();
        args = args.splice(1); // Remove cmd from arg list.
      }

      switch (cmd) {
        case 'clear':
          output_.innerHTML = '<img align="left" src="pic.jpg" width="100" height="100" style="padding: 18.1px 10px 20px 0px"><h2 style="letter-spacing: 4px">Muhammed Shokr</h2><p>' + new Date() + '</p><p>Enter "help" for more information.</p>';
          this.value = '';
          return;
        case 'c':
          output_.innerHTML = '<img align="left" src="pic.jpg" width="100" height="100" style="padding: 18.1px 10px 20px 0px"><h2 style="letter-spacing: 4px">Muhammed Shokr</h2><p>' + new Date() + '</p><p>Enter "help" for more information.</p>';
          this.value = '';
          return;
        case 'clock':
          var appendDiv = jQuery($('.clock-container')[0].outerHTML);
          appendDiv.attr('style', 'display:inline-block');
          output_.appendChild(appendDiv[0]);
          break;
        case 'date':
          output( new Date() );
          break;
        case 'echo':
          output( args.join(' ') );
          break;
        case 'exit':
          window.close();
          break;
        case 'help':
          output('<div class="ls-files">' + CMDS_.join('<br>') + '</div>');
          break;
        case 'ls':
          output('<div class="ls-files">' + CMDS_.join('<br>') + '</div>');
          break;
        case 'name':
          output('Muhammed Shokr');
          break;
        case 'q':
          window.close();
          break;
        case 'r':
          location.reload();
        case 'reload':
          location.reload();
          break;
        case 'uname':
          output(navigator.userAgent);
          output("Connected: "+navigator.onLine);
          break;
        case 'whoami':
          output("Passionate software developer focusing on web development using Javascript, an all-round geek who loves reading and writing in technology, I've graduated from the faculty of Computers and Information Science, with Full stack web development experience.");
          output('keep in touch:- ');
          output('<a id="contact_link" href="mailto:mohammedshokr2014@gmail.com" target="_blank"> Email: mohammedshokr2014"@"gmail.com </a>');
          output('<a id="contact_link" href="https://twitter.com/imohamedshokr" target="_blank"> Twitter </a>');
          output('<a id="contact_link" href="https://www.linkedin.com/in/mohammedshokr" target="_blank"> LinkedIn </a>');
          output('<a id="contact_link" href="https://github.com/Shokr" target="_blank"> Github </a>');
          output('<a id="contact_link" href="https://www.upwork.com/o/profiles/users/_~01362bc481aba5fea8/" target="_blank"> Hire Me ! </a>');
          break;
        default:
          if (cmd) {
            output(cmd + ': command not found');
          }
      };

      window.scrollTo(0, getDocHeight_());
      this.value = ''; // Clear/setup line for next input.
    }
  }

  //
  function formatColumns_(entries) {
    var maxName = entries[0].name;
    util.toArray(entries).forEach(function(entry, i) {
      if (entry.name.length > maxName.length) {
        maxName = entry.name;
      }
    });

    var height = entries.length <= 3 ?
        'height: ' + (entries.length * 15) + 'px;' : '';

    // 12px monospace font yields ~7px screen width.
    var colWidth = maxName.length * 7;

    return ['<div class="ls-files" style="-webkit-column-width:',
            colWidth, 'px;', height, '">'];
  }

  //
  function output(html) {
    output_.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
  }

  // Cross-browser impl to get document's height.
  function getDocHeight_() {
    var d = document;
    return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
    );
  }

  //
  return {
    init: function() {
      output('<img align="left" src="pic.jpg" width="100" height="100" style="padding: 0px 10px 20px 0px"><h2 style="letter-spacing: 4px">Mohammed Shokr</h2><p>' + new Date() + '</p><p>Enter "help" for more information.</p>');
    },
    output: output
  }
};