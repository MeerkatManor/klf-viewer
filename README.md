klf-viewer
==========

## Overview

On startup, app.js reads the files in public/images/klf. The list of filenames is kept in a list. The player names are extracted from the filenames.

app.js watches public/images/klf to changes to the files. As KLF dumps screenshots to public/images/klf, the file list and player list are updated.

The global file and player lists are used to build the views.

## To do

* REST API
* Smart gallery (client-driven using REST)
* Database for files and users
