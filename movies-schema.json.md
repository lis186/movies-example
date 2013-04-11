# Authenticating Users and Authorizing Requests

This file is part of a series of examples which starts with a
[basic&nbsp;modal&nbsp;application][schema-modal].  This example builds on that by adding properties
to support authenticating users and authorizing requests.  You can find more information about this
example in the [companion&nbsp;tutorial][tutorial-auth].  We assume you are already familiar with
the modal application, and we jump straight to the differences between this depot schema and that
one, starting with the user table below.

This example logs a user into the application user his or her existing account with Facebook or
Google by using the [OAuth2&nbsp;protocol][oauth2].  Both [Facebook][facebook-login] and
[Google][google-login] support this protocol, and to use it you will need to setup an application
through the [Facebook&nbsp;Apps&nbsp;page][facebook-apps] or the
[Google&nbsp;API&nbsp;console][google-apis].  When the client runs through the OAuth2 protocol, it
will obtain a token which it then places in the HTTP `Authorization` header.  This token has an
expiration, and the client must refresh it periodically.

    {

      name: "Movies",

      keep: false,

      tables: {

        actor: {
          handle: hE4F1,

          columns: {
            id:   {handle: hA282, type: id64, nullable: false, modifiable: false, default: =id64},
            name: {handle: hE178, type: string, nullable: false}},

          keys: {
            id: {handle: hE29E, columns: [id]}}},

        movie: {
          handle: h7D46,

          columns: {
            id: {handle: h3E43, type: id64, nullable: false, modifiable: false, default: =id64},
            title: {handle: hABB8, type: string, nullable: false}},

          keys: {
            id: {handle: hBC09, columns: [id]}}},

        cast: {
          handle: h7606,

          columns: {
            actor: {handle: h0310, type: actor, nullable: false},
            movie:  {handle: h85AA, type: movie, nullable: false},
            role:   {handle: h20AA, type: string, nullable: false}},

          keys: {
            id: {handle: hFD81, columns: [actor, movie]}}},

We have expanded the user table.  The new columns for `email`, `firstName` and `lastName` use
special handles.  Treode recognizes these handles, and fills them in with information from Facebook
or Google.  Every time Treode sees a new access token for the user, and they expire periodically so
Treode will see a new one often, it checks these values with the provider and updates them locally
if necessary.

We have also added the column `isEditor`.  This column is an ordinary column as far as the Treode
server is concerned, but the UI uses it to enable or disable "Add" and "Edit" buttons appropriately.
Also, resource descriptors below use the column to authorize requests.

        user: {
          handle: user,

          columns: {
            id: {handle: id, type: user.identity, nullable: false, modifiable: false},
            email: {handle: email, type: string},
            firstName: {handle: firstName, type: string},
            lastName: {handle: lastName, type: string},
            isEditor: {handle: h5C8C, type: boolean, nullable: false, default: true}},

          keys: {
            id: {handle: id, columns: [id]}}}},

      documents: {

        actorDetail:
          "with actor {
            id: id;
            name: name;
            roles: [
              cast on actor by id
              resolve movie by id {
                movieId: movie.id;
                title: movie.title;
                role: role;
              }]; }",

        actorKey:
          "with actor {
            id: id;
          }",

        actorTerms:
          "(F413) with actor {
            name: name;
          }",

        actorSummary:
          "with actor {
            id: id;
            name: name;
          }",

        movieDetail:
          "with movie {
            id: id;
            title: title;
            cast: [
              cast on movie by id
              resolve actor by id {
                actorId: actor.id;
                name: actor.name;
                role: role;
              }]; }",

        movieKey:
          "with movie {
            id: id;
          }",

        movieTerms:
          "(CA60) with movie {
            title: title;
          }",

        movieSummary:
          "with movie {
            id: id;
            title: title;
          }",

The `userDetail` document exposes the user's properties for the UI's use.  The UI can display the
user name in the top navigation bar to signal that the user is logged in, and it can use the
`isEditor` field to enable or disable editing buttons.

        userDetail:
          "with user {
            id: id;
            email: email;
            firstName: firstName;
            lastName: lastName;
            isEditor: isEditor;
          }",

        userKey:
          "with user {
            id: id;
          }",

        userTerms:
          "(CA38) with user {
            email: email;
            firstName: firstName;
            lastName: lastName;
            isEditor: isEditor;
          }"
      },

      hosts: {

        movies.store.localhost: {

In the modal application, we omitted the `allow` predicate to use its default of `"true"`, which
granted any user, authenticated or not, access to the resources.  We will still use that default for
this application, so that it is inherited by `get` and `search`.  However, we will set the `write`
predicate to `"user.isEditor"` so that only users with that flag can update data.

          write: "user.isEditor",

When you create a Facebook App you get an "App ID/API Key", and when you create a Google API Client,
you get a "Client ID". Those values are placed here so that the Treode server can verify that an
access token belongs to your application&mdash;we would not want the user to login to a different
application and then allow that appllication to use its token to access your resources.

          trust: {
            facebook: ["173056026179982"],
            google: ["1068154921504.apps.googleusercontent.com"]
          },

          resources: [

            { prefix: "/movie",
              table: movie,
              document: movieDetail,
              key: {name: id, document: movieKey, template: "/<id>"},
              get: {},
              search: {
                categories: {
                  movies: {terms: movieTerms, result: movieSummary}}},
              post: {},
              put: {},
              delete: {}
            },

            { prefix: "/actor",
              table: actor,
              document: actorDetail,
              key: {name: id, document: actorKey, template: "/<id>"},
              get: {},
              search: {
                categories: {
                  actors: {terms: actorTerms, result: actorSummary}}},
              post: {},
              put: {},
              delete: {}
            },

            { prefix: "/search",
              search: {
                categories: {
                  actors: {terms: actorTerms, result: actorSummary},
                  movies: {terms: movieTerms, result: movieSummary}}}},

Finally, we add an endpoint for users.  This resource will respond to HTTP requests like

> GET /user?q=&lt;terms&gt;<br/>
> GET /user/&lt;id&gt;<br/>
> PUT /user/&lt;id&gt;<br/>
> GET /user/me<br/>
> DELETE /user/me

When a resource is rooted on the user table, Treode will recognize the special URL suffix `/me`.
The client may use this to obtain or update the properties for the currently authenticated user.
Treode also extracts key values from the URL as it would any other resource, and a client may use
this in an UI that permits an administrator to update user accounts.

            { prefix: "/user",
              table: user,
              document: userDetail,
              key: {name: id, document: userKey, template: "/<id>", pattern: "/(?<id>.+)$"},
              allow: "user.isEditor",
              get: {},
              getme: {},
              search: {
                categories: {
                  users: {terms: userTerms, result: userDetail}}},
              put: {},
              deleteme: {}
            }
          ]}
      }}

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

[facebook-apps]: https://developers.facebook.com/apps "Facebook Apps"
[facebook-login]: https://developers.facebook.com/docs/technical-guides/login/ "Facebook Login"
[google-apis]: https://code.google.com/apis/console "Google APIs Console"
[google-login]: https://developers.google.com/accounts/docs/OAuth2Login "Google Login"
[oauth2]: http://oauth.net/2/ "OAuth2"
[schema-modal]: https://github.com/Treode/movies-example/blob/modal/master/movies-schema.json.md "Schema for modal example"
[tutorial-auth]: http://treode.com/tutorial/authorize.html "Tutorial for authorization example"
