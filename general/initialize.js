/* The code in this file is basic house keeping. */

// Gets a gui object as part of nw and retrievs the window from it.
var gui = require('nw.gui');
var win = gui.Window.get();

// Sets the width and height of the window.
if (win.width == 718 && win.height == 497) {
	win.width = 1280;
	win.height = 720;
}

// Global
var playerID = -1;