# The Movies Tutorial for the Treode Service

This HTML/JS application, written using [Jade][jade] and [AngularJS][angular], illustrates the use
of the [Treode][treode] storage service.  This application allows the user to navigate and edit
movies and actors in a simple online movie database.  The Treode service is an online database that
is easy to configure with a relational model and RESTful/JSON endpoints.

## Configuring the Treode Service

The configuration data for Treode is a JSON object which does not allow for comments.  We have used
[lilp][lilp] to process [literate&nbsp;JSON][schema-literate], suitable for consumption by humans,
and produce [raw&nbsp;JSON][schema-json] for the machines.  Although unusual in general practice, we
have checked the generated file into this repository so that you may use it without the extra steps
of installing and running lilp.

The configuration file uses the hostname `movies.store.localhost`.  To use this configuration
yourself, you'll need to change it to one of your authorized hostnames.  Log into the [Depot
Dashboard] [dashboard] and check your profile for your authorized hostnames.  Having changed the
hostname in the schema, you can then upload it to Treode.  These steps are shown in the [preface of
the reference guide] [reference].  With the depot configured, you can already try it out using curl.

## Building the Application

To try out this application, you'll need to change the hostname in Gruntfiles.js.  Change
`movies.store.treode.com` to your selected hostname.

If you haven't already, you'll need to install [NPM&nbsp;from&nbsp;node.js][nodejs-install] and
[grunt][grunt-start].  Now building is as easy as:

    npm -install
    grunt

Grunt leaves the result in the directory `dist`.

## Getting Help

Undoubtedly you'll have questions.  You can head over to StackOverflow and use the tag `treode` to
[check if it's already answered] [stackoverflow-answered] or [ask your question]
[stackoverflow-ask].  If you prefer, you can use the [online forum on Google groups] [google-group].

## The Branches of this Repository

There are several versions of this example that show how Treode can support different features in
the user interface:

* Basic Modal Application

  The basic modal application is on the [modal branch][source-modal].  This UI presents a movie or
  actor in read mode, and offers and "Edit" button to switch to an edit mode.  Information about the
  RESTful/JSON interface exported by the Treode storage service is available in the
  [modal&nbsp;tutorial][tutorial-modal].  We recommend starting the series of tutorials with this
  application.

* Modeless Application, V1

  The modeless application is on the [modeless branch][source-modeless].  This UI always presents
  movies and actors in an edit mode.  The Treode configuration for this application is identical to
  that for the modal application; additional information about the RESTful/JSON interface exported
  by the Treode storage service is available in the [modeless&nbsp;tutorial][tutorial-modeless].  We
  recommend trying this after learning about the modal application.  It might be fruitful to
  [compare this branch to the modal branch] [modeless-vs-modal], or it might not be because the UI
  changes quite a bit.  The big thing to notice is that while the UI changes so much, there's no
  change in the depot schema.

* Modeless Application, V2

  The second modeless application is on the [cast branch][source-cast].  This UI is identical to V1
  as far as the user can tell, however the Treode configuration includes an additional endpoint.
  The second half of the [modeless&nbsp;tutorial][tutorial-modeless] discusses this variation.  We
  recommend learning this after V1.  It's probably helpful to [compare this branch to the modeless
  branch] [modeless-v1-vs-v2].

* Authorizing Application *(You are currently viewing this branch)*

  The authenticating and authorizing application is on the [auth branch][source-auth].  This UI
  allows any user to navigate movies and actors.  To edit data, it requires that a user signin,
  using a Facebook or Google ID, and have the editor privilege.  The [tutorial for authorizing
  requests][tutorial-auth] discusses how to configure the Treode endpoints for this.  We recommend
  tackling this after understanding the configuration for the modal application.  It's probably
  helpful to [compare this branch to the modal branch] [auth-vs-modal].

## License

Copyright 2013 Treode, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

  [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

[angular]: http://angularjs.org/ "AngularJS"
[auth-vs-modal]: https://github.com/Treode/movies-example/compare/modal;master...auth/master "Modal vs Auth"
[dashboard]: https://dashboard.treode.com "Depot Dashboard"
[google-group]: https://groups.google.com/forum/?fromgroups#!forum/treode-users "Google Group for Treode"
[grunt-start]: http://gruntjs.com/getting-started "Getting started with grunt"
[jade]: http://jade-lang.com/ "Jade Language"
[lilp]: https://github.com/mikaa123/lilp "Lightweight Literate Programming"
[modeless-vs-modal]: https://github.com/Treode/movies-example/compare/modal;master...modeless;master "Modal vs Modeless"
[modeless-v1-vs-v2]: https://github.com/Treode/movies-example/compare/modeless;master...cast/master "Modeless V1 vs V2"
[nodejs-install]: http://nodejs.org/download/ "Install node.js and npm"
[reference]: http://treode.com/reference#upload "Uploading a Depot Schema"
[schema-json]: movies-schema.json "The JSON configuration for Treode"
[schema-literate]: movies-schema.json.md "The literate configuration for Treode"
[source-auth]: https://github.com/Treode/movies-example/tree/auth/master "Source for authenticating and authorizing example"
[source-cast]: https://github.com/Treode/movies-example/tree/cast/master "Source for cast example"
[source-modal]: https://github.com/Treode/movies-example "Source for modal example"
[source-modeless]: https://github.com/Treode/movies-example/tree/modeless/master "Source for modeless example"
[stackoverflow-answered]: http://stackoverflow.com/questions/tagged/treode "See questions about Treode on StackOverflow"
[stackoverflow-ask]: http://stackoverflow.com/questions/ask?tags=treode "Post a question about Treode on StackOverflow"
[treode]: http://treode.com "Treode"
[tutorial-auth]: http://treode.com/tutorial/authorize.html "Tutorial for authenticating and authorizing example"
[tutorial-modal]: http://treode.com/tutorial "Tutorial for modal example"
[tutorial-modeless]: http://treode.com/tutorial/modeless.html "Tutorial for modeless example"
