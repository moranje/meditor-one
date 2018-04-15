# Stuff to add

## FIX

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
* Set-up keyboard shortcuts (`CMD` + `SHIFT` + `P` for menu, selected text formatting snippets) https://microsoft.github.io/monaco-editor/playground.html#interacting-with-the-editor-adding-an-action-to-an-editor-instance
* Build in a compile step for inserting snippets into other snippets
* Build in render step to allow for calculations and other functions, should not immediately execute
* Connect TM_VARS to the editor, perhaps allow setting global VARS (supervisor etc.)
* Break open editor to see where snippet variables are stored
* Check out VSCode's [snippet implementation](https://github.com/Microsoft/vscode/tree/d89ca728f6f55705b5579df89baf5e0316699534/src/vs/workbench/parts/snippets/electron-browser)

## Maybe's

* Create custom dictionary, loop over words in dic file and run `wordforms dictionary.aff dictionary.dic word` then merge with siblime medical word list and [recompile](http://www.suares.com/index.php?page_id=25&news_id=233) into a dict file with hunspell
