Techne
======
Techne is a modeller for Minecraft written in TypeScript and in use over at http://techne.zeux.me

Usage
=====
There is an example implementation of the editor in /example

Building from source
====================
Requirements
------------
* Typescript Compiler
  download at http://www.typescriptlang.org/#Download

Run one of the commands below and you will find the compiled file in ./build
##Viewer
``tsc @build-viewer``

Editor
--------
``tsc @build-editor``

Contributing
============
If you wish to contribute, please create a fork and submit a pull-request.
Also, I'd appreciate it if you follow the code standard in use.

* Write a comment for every fuction (at least public ones)
* No implicit typing on function arguments and return values
* No implicit typing on fields and properties
* Preferably, write tests for your changes and make sure existing ones don't fail

Getting help
============
You can get help by either createing an issue or joining #techne on irc.esper.net.

Dependencies
============
The viewer and editor have different dependencies.
##Viewer
* JQuery
* three.js

Editor
------
* all of the above
* knockout.js
* pixi.js (for the texturemapper)

License
=======
This projects is licensed under the [Apache 2.0 license](http://www.apache.org/licenses/LICENSE-2.0.html)
Short version:

* You modify, distribute and sublicense
* You cannot hold the developers liable for anything you do with the software
* You must retain the original copyright, state changes and include the full license text in modified software

There's also a nice overview over at [tl;drLegal](https://tldrlegal.com/license/apache-license-2.0-(apache-2.0)#summary)
 
