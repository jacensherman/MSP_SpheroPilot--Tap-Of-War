/* The code in this file is basic house keeping. */

// Gets a gui object as part of nw and retrievs the window from it.
var gui = require('nw.gui');
var win = gui.Window.get();

// Sets the width and height of the window.
win.width = 1280;
win.height = 720;