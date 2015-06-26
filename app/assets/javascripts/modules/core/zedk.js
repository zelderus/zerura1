


this.zedk = this.zedk || {};


/************************************
*									*
*		Общие для сайта модули		*
*									*
************************************/




zedk.About = function() {
	zedk.ConsoleGreen("ZEDK modules");
};


/*
*	Console
*/
zedk.Console = function(msg, style) {
	if (!style) style = 'background: #F22; color: #FFFF66; padding: 0 4px;';
 	console.log("%c" + msg, style);
};
zedk.ConsoleRed = function(msg) {
	zedk.Console(msg, 'background: #F22; color: #FFFF66; padding: 0 4px;');
};
zedk.ConsoleGreen = function(msg) {
	zedk.Console(msg, 'background: #ECF8EC; color: #339933; padding: 0 4px;');
};
zedk.ConsoleYellow = function(msg) {
	zedk.Console(msg, 'background: #FFFAE5; color: #FF7B24; padding: 0 4px;');
};


/*
*	Debug
*/
zedk._debugIsEnabled = false;
zedk.DebugEnable = function () { zedk._debugIsEnabled = true; }
zedk.DebugMsg = function(msg) { if (zedk._debugIsEnabled) zedk.ConsoleYellow("-> " + msg); };





