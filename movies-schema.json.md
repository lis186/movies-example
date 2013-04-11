# Supporting a Modeless UI

This file is part of a series of examples which starts with a
[basic&nbsp;modal&nbsp;application][schema-modal].  This example builds on that; the UI incorporates
changes to be modeless, but no changes are required to this file.  You can find more information
about this example in the [companion&nbsp;tutorial][tutorial-modeless].  A
[second&nbsp;version][source-cast] of the modeless UI does include changes in this configuration
file.

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

            { prefix: "/search",
              search: {
                categories: {
                  actors: {terms: actorTerms, result: actorSummary},
                  movies: {terms: movieTerms, result: movieSummary}}}}
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

[schema-modal]: https://github.com/Treode/movies-example/blob/modal/master/movies-schema.json.md "Schema for modal example"
[schema-cast]: https://github.com/Treode/movies-example/blob/cast/master/movies-schema.json.md "Schema for cast example"
[source-cast]: https://github.com/Treode/movies-example/tree/cast/master "Source for cast example"
[tutorial-modeless]: http://treode.com/tutorial/modeless.html "Tutorial for modeless example"
