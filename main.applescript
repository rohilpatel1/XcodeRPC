tell application "System Events" to (name of processes) contains "Xcode"
tell application "Xcode" to get the name of the front window
tell application "Xcode" to get the name of the active workspace document