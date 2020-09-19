const applescript = require('applescript');
const fs = require('fs');
const client = require('discord-rich-presence')('754460701522788550');
const { app, BrowserWindow } = require('electron');

const appleScriptData = fs.readFileSync('main.applescript', 'utf8');
const appleScriptLines = appleScriptData.split(/\r?\n/);

console.log(appleScriptLines)

let system = appleScriptLines[0];
let getextension = appleScriptLines[1];
let getworkspace = appleScriptLines[2];

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



function update() {
	applescript.execString(system, (err, res) => {
	  
		if (res == false) {
			console.log('Xcode not open');
			return;
		}
		
		applescript.execString(getextension, (err, res) => {
		  applescript.execString(getworkspace, (err, project) => {
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

setInterval(() => {
  update()
}, 1000)