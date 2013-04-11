# Handling a Composite Key of References

This file is part of a series of examples which starts with a
[basic&nbsp;modal&nbsp;application][schema-modal].  This example builds on that, adding a resource
that uses a complex key.  More information about this example can be found in the
[companion&nbsp;tutorial][tutorial-cast].  We assume you are already familiar with the modal
application, and we jump straight to the differences between this depot schema and that one.  The
tables and many of the documents are the same; nothing changes until we introduce documents for the
cast table below.

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
            id: {handle: hFD81, columns: [actor, movie]}}}},

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

Our goal is to expose a row of the cast table as a resource of its own.  We need a mapping for the
body of the HTTP requests and responses, and we need a mapping to assist with extracting key values
from the URL that will name the root row.  The first mapping is for the body; it includes the role
since we will want to pass that as part of PUT data.  The second mapping is nearly the same, but it
leaves the role out since that does not appear in the key or URL.

Both these expressions yield flat objects, that is fields are all primitive values and there are no
nested objects or arrays.  The detail mapping just happens to be this way, but the key mapping needs
to be this way.  The key template in the resource descriptor does not have any structure, just
names, so the key mapping must also.  It is not ordinary to URL encode JSON objects or arrays in
URLs, and Treode will not allow it, so the fields may take only primitive values.

The key mapping is essential to using references in Treode.  Both the `actor` and `movie` column of
the cast table are references to other tables, but Treode does not directly expose references in any
way.  The keys of the target tables are primitives that do have a representation though, so the URL
can use those key values to identify the rows and thereby identify the references.

        castDetail:
          "with cast
          resolve actor by id
          resolve movie by id {
            movieId: movie.id;
            actorId: actor.id;
            role: role;
          }",

        castKey:
          "with cast
          resolve actor by id
          resolve movie by id {
            movieId: movie.id;
            actorId: actor.id;
          }"
      },

      hosts: {

        movies.store.localhost: {

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

We add a resource descriptor for the cast entity, which is much like the resource descriptors above,
however this resource only supports PUT and DELETE.  PUT will allow the client to update the role
name, and DELETE will allow the client to remove the actor from the movie and simultaneously remove
the role from the actor.  Also different from the two resources above, the key template here names
two fields, and it's no accident that those names match the fields of the key mapping from above.

            { prefix: "/cast",
              table: cast,
              document: castDetail,
              key: {name: id, document: castKey, template: "/<movieId>:<actorId>"},
              put: {},
              delete: {}
            },

            { prefix: "/search",
              search: {
                categories: {
                  actors: {terms: actorTerms, result: actorSummary},
                  movies: {terms: movieTerms, result: movieSummary}}}}
          ]}
      }}

[schema-modal]: https://github.com/Treode/movies-example/blob/modal/master/movies-schema.json.md
[tutorial-cast]: http://treode.com/tutorial/modeless.html#cast
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
