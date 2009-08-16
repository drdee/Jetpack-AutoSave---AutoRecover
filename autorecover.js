// Simple AutoRecovery Jetpack for Web 2.0 Applications.
// Version 1.0, August 15, 2009 written by Diederik van Liere (www.network-labs.org)
// This Jetpack continuously stores the entered data in the first <textarea> element it finds
// Data is locally stored and the url of the page is the key to retrieve in case of accidently
// navigating away from the webpage, which has happened to me too often :)

// Future release might contain a dictionary with as key the url and value which textarea to autosave, only useful for webpages with multiple textarea fields. 
// or alternatively, just figure out which textarea has focus and autosave that field.

//$('body').prepend("Test form 0 <form name='wjkejwklt23t'> <textarea>dgjadklfgjadkljfgakl;</textarea></form>");
//$('body').prepend("<br>Test form 1<form name='22222'><textarea>111111111</textarea></form>");


// Has function retrieved from http://rick.measham.id.au/javascript/hash.htm
function Hash(){
				for( var i=0; i < arguments.length; i++ )
					for( n in arguments[i] )
						if( arguments[i].hasOwnProperty(n) )
							this[n] = arguments[i][n];
			}

				// Hash.version = 1.00;	// Original version
				// Hash.version = 1.01;	// Added ability to initialize in the constructor
				// Hash.version = 1.02;	// Fixed document bug that showed a non-working example (thanks mareks)
				//Hash.version = 1.03;	// Removed returning this from the constructor (thanks em-dash)
				Hash.version = 1.04;	// Missed some 'var' declarations (thanks Twey)


				Hash.prototype = new Object();

				Hash.prototype.keys = function(){
					var rv = [];
					for( var n in this )
						if( this.hasOwnProperty(n) )
							rv.push(n);
					return rv;
				}

				Hash.prototype.length = function(){
					return this.keys().length();
				}

				Hash.prototype.values = function(){
					var rv = [];
					for( var n in this )
						if( this.hasOwnProperty(n) )
							rv.push(this[n]);
					return rv;
				}

				Hash.prototype.slice = function(){
					var rv = [];
					for( var i = 0; i < arguments.length; i++ )
						rv.push(
							( this.hasOwnProperty( arguments[i] ) )
								? this[arguments[i]]
								: undefined
						);
					return rv;
				}

				Hash.prototype.concat = function(){
					for( var i = 0; i < arguments.length; i++ )
						for( var n in arguments[i] )
							if( arguments[i].hasOwnProperty(n) )
								this[n] = arguments[i][n];
					return this;
				}


jetpack.future.import("storage.simple");
var storage = jetpack.storage.simple;

var key = '';
var val = '';
var index = null;
var backup = new Array();
var prev_backup = new Array();
var values = new Hash();

jetpack.statusBar.append({ 
  html: "AutoRecover", 
  width: 90, 
  onReady: function(widget){ 
    $(widget).click(function(){ 
      jetpack.notifications.show("AutoRecovering!");
      AutoRecover();  
    }); 
  } 
});

jetpack.tabs.onReady(function() {	
  var doc = jetpack.tabs.focused.contentDocument;
  $('textarea', doc).bind('click', function(e) {
        index = $('textarea', doc).index(this);
        //console.log(index);

  });
	StartAutosaving();
	
});

function StartAutosaving() {
	setInterval(AutoSave, 1000);
}


function AutoSave() {
  var doc = jetpack.tabs.focused.contentDocument;
  val = $('textarea:eq('+index+')', doc).val();
  key = doc.location.href + '--'+ index; 
  backup[index] = val;
  // These checks make sure that the AutoRecover will exist, will not be empty and will contain lots of data
  if (val !== undefined && val !== '' && backup[index] !== prev_backup[index] ) {
    values[key] = val;
    storage.keys = values;
    prev_backup[index] = val;
    //console.log('succesful autosave');
  } else {
  	//console.log('did not autosave');
  }
} 

function AutoRecover() {
	var doc = jetpack.tabs.focused.contentDocument;
  	key = doc.location.href + '--'+ index; 
  	var restore = storage.keys;
  	val = restore[key];
  	$('textarea:eq('+index+')', doc).val(val);
}