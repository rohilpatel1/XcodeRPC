-- AppleScript Used to Get Local Data --

-- Gets the response --
tell application "System Events" to (name of processes) contains "Xcode"

-- Get Xcode File Extension --
tell application "Xcode" to get the name of the front window

-- Get Xcode file name
tell application "Xcode" to get the name of the active workspace document