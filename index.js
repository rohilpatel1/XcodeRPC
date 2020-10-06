const { execString } = require('applescript');
const { updatePresence } = require('discord-rich-presence')('754460701522788550');
const { app, BrowserWindow } = require('electron');

let scpt = {
	system:
		'tell application "System Events" to (name of processes) contains "Xcode"',
	getextension: 'tell application "Xcode" to get the name of the front window',
	getworkspace:
		'tell application "Xcode" to get the name of the active workspace document'
};

let { system, getextension, getworkspace } = scpt;

let config = {
	details: 'Workspace: {project}',
	state: 'Editing {file}',
	showDetails: true,
	showState: true
};

let startTime = Date.now();

function createWindow() {
	const win = new BrowserWindow({
		width: 0,
		height: 0,
		webPreferences: {
			nodeIntegration: true
		}
	});
	win.loadFile('index.html');
}
app.whenReady().then(createWindow);

function update() {
	execString(system, (err, res) => {
		if (!res) {
			console.log('Xcode not open');
			return;
		}

		execString(getextension, (err, res) => {
			execString(getworkspace, (err, project) => {
				let workspace, fileExtension;

				if (project) workspace = project.replace('.xcodeproj', '');
				if (res)
					fileExtension = res.match(/\.(.+)/g)
						? res.match(/\.(.+)/g)[0]
						: 'unknown';

				let state = config.state.replace(/{file}/g, res);
				let details = config.details.replace(/{project}/g, workspace);

				updatePresence({
					state: config.showState ? (!res ? undefined : state) : undefined,
					details: config.showDetails
						? !workspace
							? 'Idling'
							: details
						: undefined,
					startTimestamp: !res ? undefined : startTime,
					largeImageKey: 'xcode',
					largeImageText: 'Editing in Xcode',
					smallImageKey: fileExtension
						? fileExtension === '.swift'
							? 'swift'
							: fileExtension === '.plist'
								? 'plist'
								: 'unknown'
						: undefined,
					smallImageText: fileExtension
						? `Editing a ${fileExtension} file`
						: undefined,
					instance: true
				});
			});
		});
	});
}
update();

setInterval(update, 5000);
