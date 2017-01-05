* Beskriv källkodsstruktur
* Beskriv hur man bygger
  * Vad behöver vara installerat 
* Beskriv hur man testar
* Andra saker som är bra att veta


[Markdown Guide](https://guides.github.com/features/mastering-markdown/)




### Prerequisites 
These prerequisites must be installed:

* Visual Studio 2015 Update 3
* .Net Core 1.0.1
* TypeScript 2.0 for Visual Studio 2015
* Node.js version 4 or later



### Building the client app
1. If you want to add third-party javascript libraries,
2. If you run the client app for the first time.


 To build the client app run webpack --config webpack.config.vendor.js from command line at the root of the project where the webpack.config.js file is located. If you don’t have the webpack tool installed, you’ll need to run npm install -g webpack first.