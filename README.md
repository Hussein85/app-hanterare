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



### Before you start the project
Run webpack --config webpack.config.vendor.js from command line at the root of the project where the webpack.config.js file is located. If you don’t have the webpack tool installed, you’ll need to run npm install -g webpack first.

### How to start the project
Press F5 (or the play button labelled IIS Express) to launch the project. 


### Running tests


### Directory Structure
<pre>
|-- Properties
|-- References
|-- wwwroot
|-- Dependencies
|-- ClientApp
|    |-- app
|    |    |-- components
|    |    |-- models
|    |    |-- pipes
|    |    |-- services
|    |    |-- validators
|    |    |-- app.module.ts
|    |    |-- app.routing.ts
|    |    |-- auth.guard.ts
|    |-- i18n
|    |-- dist
|    |-- test   // Here we write our unit tests
|    |-- index.html
|-- Controllers
|-- Models
|-- Views
|-- appsettings.json
|-- CacheClient.cs
|-- Dockerfile
|-- DocumentDbRepository.cs
|-- package.json
|-- Program.cs
|-- project.json
|-- README.md
|-- Startup.cs
|-- web.config
|-- webpack.config.js
</pre>


 For more information see: http://blog.stevensanderson.com/2016/10/04/angular2-template-for-visual-studio/ 

