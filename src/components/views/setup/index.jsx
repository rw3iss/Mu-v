import { h, Component } from 'preact';
import { Link, hashHistory } from 'react-router';
import Animate from 'rc-animate';
const {dialog} = require('electron').remote;
import { appStore } from 'lib/data/stores'
import View from 'components/shared/view';
import style from './style';
import fs from 'fs';  
var mime = require('mime-types')

// Set initial state

export default class Setup extends View {
  constructor(props) {
    super(props);

    this.setState({ files: [], importing: false });

    // Start a config if one isn't
    appStore.ensureSetup();
  }

  handlePickFile() {
    var self = this;
    dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']}, (dir) => {
      self.handleAddFile(dir);
    });
  }

  handleAddFile(file) {
    var self = this;

    function dirExists(d) {
      for (let test of self.state.files) {
        if (test === d) {
          return true;
        }
      }
      return false;
    }

    if (file instanceof Array) {
      file.forEach((d) => {
        if (!dirExists(d) && typeof d != 'undefined')
          this.state.files.push(d);
      });
    } else {
      if (!dirExists(dir) && typeof d != 'undefined')
        this.state.files.push(dir);
    }

    this.forceUpdate();
  }

  handleRemoveFile(dir) {
    let i;
    for (i=0; i<this.state.files.length; i++) {
      if (this.state.files[i] === dir) {
        this.state.files.splice(i,1);
        this.forceUpdate();
        break;
      }
    }
  }

  handleImportFiles() {
    let self = this;
    let _videos = [];
    let _videoTypes = ['video/mp4', 'video/off', 'video/webm'];
    let _imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/tiff', 'image/ief', 'image/bmp',  ]

    this.setState({ importing: true });

    const extractVideosFromDirectory = function(allFiles) {
      cl("extractVideos", allFiles);
      allFiles.map((el) => {
        if(_videoTypes.includes(mime.lookup(el))) {
          _videos.push(el);
        }
      })
    }

    const importVideos = function(videoFiles) {
      if (_videos.length == 0) {
        alert("No videos were found. You can skip and add them later.");
      } 

      if (!confirm("Found " + _videos.length + " video files. Proceed with importing them?")) {
        self.setState({ importing: false });
        return;
      }

      var waits = _videos.length;
      _videos.forEach((videoFile) => {
        // see if there an image file in this directory
        var imageFile = null;
        var videoDir = videoFile.replace(/[^\/]*$/, '');
        fs.readdir(videoDir, function(err, list) {
          waits--;

          for (var f of list) {
            if(_imageTypes.includes(mime.lookup(f))) {
              imageFile = videoDir + '/' + f;
              break;
            }
          }

          appStore.addMovieFile(videoFile, imageFile);

          if (waits == 0) {
            appStore.save();
            hashHistory.push('library');
          }
        });
      });

    }

    const getAllFiles = function(dir, done) {
      var results = [];
      fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
          var file = list[i++];
          if (!file) return done(null, results);
          file = dir + '/' + file;
          fs.stat(file, function(err, stat) {
            if (stat && stat.isDirectory()) {
              getAllFiles(file, function(err, res) {
                results = results.concat(res);
                next();
              });
            } else {
              results.push(file);
              next();
            }
          });
        })();
      });
    };

    var waits = this.state.files.length;
    this.state.files.forEach((file) => {
      getAllFiles(file, (err, result) => {
        waits--;
        extractVideosFromDirectory(result);

        if (waits == 0) {
          importVideos();
        }
      });
    });
  }

  skip() {
    hashHistory.push('library');
  }

  render() {
    var self = this;

    return (
       <Animate 
        component=""
        transitionAppear={true}
        transitionLeave={true}
        transitionName="content-transition">

        <div id="setup" class="view" key="setup">

          <div class="wizard">

            <h1>Setup</h1>
            <div class="content">
              <span class="instruction">Add files or directories of any movies you want to import and organize with μv. 
              All directories will be recursively searched, and any video files will be added.</span>

              <div class="file-select">
                <input type="file" ref={ (ref) => this.dirPicker = ref } style="display: none;" multiple 
                  onchange={this.handleAddFile.bind(this)} />
                <div class="btn btn-default" onclick={this.handlePickFile.bind(this)}>+ Add</div>
              </div>

              { (this.state.files.length != 0) && 
                <div class="files">
                  <ul>
                    {
                      this.state.files.map(function(dir) {
                      return <li>
                          <div class="name">{dir}</div>
                          <div class="controls" flex="center"><i class="btn btn-small remove" onclick={self.handleRemoveFile.bind(self,dir)}>x</i></div>
                        </li>;
                    })}
                  </ul>
                </div> 
              }

              { this.state.importing && 
                <h4>Looking for movies...</h4>
              }

              <div class="actions">
                <div class={'btn' + (this.state.files.length == 0 ? ' disabled' : '')} onclick={this.handleImportFiles.bind(this)}>Continue</div>
                <div class="btn" onclick={() => appStore.clearAllData() }>Clear All Data</div>
                <div class="btn" onclick={() => appStore.clearMovieData() }>Clear Movie Data</div>
                <div class="btn" onclick={() => this.skip() }>Skip</div>
              </div>
            </div>
          </div>

        </div>

      </Animate>
    );
  }
}