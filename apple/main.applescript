tell application "Xcode"
    set CurrentActiveDocument to document 1 whose name ends with (word -1 of (get name of   window 1))
    set WhatYouWant to path of CurrentActiveDocument
end tell