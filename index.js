const applescript = require('applescript');
const Path = require('path');
const fs = require('fs');
const client = require('discord-rich-presence')('754460701522788550');
const { app, BrowserWindow } = require('electron');

let readData = fs.readFileSync(Path.join(__dirname, '.', 'main.applescript'), 'utf8');

console.log(Path.join(__dirname, 'main.applescript'));
let linesArr = readData.split(/\r?\n/);


let config = {
  "details": "Workspace: {project}",
  "state": "Editing {file}",
  "showDetails": true,
  "showState": true
}

let startTime = Date.now();


function createWindow () {
  const win = new BrowserWindow({
    width: 0,
    height: 0,
    webPreferences: {
      nodeIntegration: true
    }
  });
  
  // and load the index.html of the app.
  win.loadFile('index.html')
}
app.whenReady().then(createWindow)



function update() { //system
	applescript.execString(linesArr[0], (err, res) => {
	  
		if (res == false) {
			console.log('Xcode not open');
			return;
		}
		
		applescript.execString(linesArr[1], (err, res) => { //getextension
		  applescript.execString(linesArr[2], (err, project) => {//getworkspace
		    let workspace, fileExtension;
		    
		    if (project) workspace = project.replace('.xcodeproj', '');
		    if (res) fileExtension = res.match(/\.(.+)/g) ? res.match(/\.(.+)/g)[0] : 'unknown';
		    
        var state = config.state.replace(/{file}/g, res);
        var details = config.details.replace(/{project}/g, workspace);


        client.updatePresence({
          state: config.showState ? !res ? undefined : state : undefined,
          details: config.showDetails ? !workspace ? 'Idling' : details : undefined,
          startTimestamp: !res ? undefined : startTime,
          largeImageKey: 'xcode',
          largeImageText: 'Editing in Xcode',
          smallImageKey: fileExtension ? fileExtension === '.swift' ? 'swift' : fileExtension === '.plist' ? 'plist' : 'unknown' : undefined,
          smallImageText: fileExtension ? `Editing a ${fileExtension} file` : undefined,
          instance: true,
        });
		  });
		});
	});
};
update();

setInterval(update, 1000);
