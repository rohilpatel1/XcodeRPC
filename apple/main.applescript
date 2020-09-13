on run {input, parameters}

    set current_document_path to ""

    tell application "Xcode"
        set last_word_in_main_window to (word -1 of (get name of window 1))
        if (last_word_in_main_window is "Edited") then
            display notification "Please save the current document and try again"
            -- eventually we could automatically save the document when this becomes annoying
        else
            set current_document to document 1 whose name ends with last_word_in_main_window
            set current_document_path to path of current_document
        end if
    end tell

    tell application "MacVim"
        if (current_document_path is not "") then
            activate
            open current_document_path
        end if
    end tell

    return input
end run