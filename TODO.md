# Stuff to add

## FIX

* Authentication session lost
* Logical file tree component

## Features

### UI

* Create a usefull statusbar (number of words, column:row)
* Style the editor and context menu's in accordance with theme styles
* Add a search function that filters snippets inside the sidebar
* Find a new location for document route button (Home button (tab style), next to main menu)

### Functional

* Create [Monaco syntax](https://microsoft.github.io/monaco-editor/monarch.html) file
* Allow for status specific styled words, _warning_ and _emphasized_
* Look into menu entries
* Set-up keyboard shortcuts (`CMD` + `SHIFT` + `P` for menu)
* Build in a compile step for inserting snippets into other snippets
* Build in render step to allow for calculations and other functions
* Connect TM_VARS to the editor, perhaps allow setting global VARS (supervisor etc.)
* Break open editor to see where snippet variables are stored

## Maybe's

* Create custom dictionary, loop over words in dic file and run `wordforms dictionary.aff dictionary.dic word` then merge with siblime medical word list and [recompile](http://www.suares.com/index.php?page_id=25&news_id=233) into a dict file with hunspell
