# Configuring Treode to Serve a Movie Database

This file, known as a *depot schema*, illustrates how to configure Treode to serve a relational
model and RESTful/JSON endpoints, and it is the most basic of a series of examples.  There are other
variations of this file that explore [additional&nbsp;endpoints][schema-cast] and
[authorization][schema-auth].  More information about this example and Treode can be found in the
[companion&nbsp;tutorial][tutorial-modal].

A depot schema is a JSON object.

    {

Every depot has a name so that its schema can be navigated in the
[Depot&nbsp;Dashboard][treode-dashboard].

      name: "Movies",

This field prevents the accidental destruction of data by kittens pouncing on mice and other
hazards.  It defaults to `true`, but we set it to `false` for this tutorial so that you don't face
an unnecessary obstacle to cleaning the remains of an experiment.  If you omit this line from a
depot you want to protect, the "Remove depot" button in the Depot Dashboard will disappear.

      keep: false,

## Configuring Tables

This file proceeds bottom up: it configures tables, then documents and finally resource endpoints.
The `tables` field describes a relational schema of tables and columns.  It is an object of objects,
and those nested objects are the table descriptors; the field names serve as the table names.

      tables: {

The first table is called `actor`.  In addition to the name for your use, a table has a `handle`
which Treode uses to identify the table; the name may change from revision to revision, but the
handle must remain constant through the table's lifetime.  If you were to change the handle, the
Treode server would interpret that to mean an old table has been removed and a new table has been
created, and it would destroy the data of the original table.  We have chosen a meaningless handle
so that we are never tempted to change it later as our understanding of the table evolves.

        actor: {
          handle: hE4F1,

This table has two `columns`, one called `id` and the other `name`.  Like tables, columns have
handles.  Columns have a number of other properties.  The `id` column cannot be null or modified
once created.  It is an `id64` and defaults to a random ID; an id64 is represented by a string like
`id0123456789ABCDEF`.  The [reference&nbsp;guide][ref-tables] provides a complete list of column
properties and column datatypes.

          columns: {
            id:   {handle: hA282, type: id64, nullable: false, modifiable: false, default: =id64},
            name: {handle: hE178, type: string, nullable: false}},

The actor table has one key, named `id`, which consists of the single column `id`.  Keys enforce
that the column values in a new or updated row does not conflict with those in any existing rows.
Note that keys only enforce this for rows as they are added or updated.  When a key is added to an
existing table, rows from before then may not satisfy the constraint.  Treode works this way to
facilitate schema migration: you may strengthen a constraint to ensure that new data will satisfy
it, and take time to cleanup the old data.  If Treode were to require that existing data satisfy the
requirement before enforcing it, you would be forced to cleanup old data while users potentially add
more dirty data, and you might start to feel like you were playing a game of whack-a-mole.

          keys: {
            id: {handle: hE29E, columns: [id]}}},

The `movie` table is similar to the actor table, except that a movie has a title rather than a name.

        movie: {
          handle: h7D46,

          columns: {
            id: {handle: h3E43, type: id64, nullable: false, modifiable: false, default: =id64},
            title: {handle: hABB8, type: string, nullable: false}},

          keys: {
            id: {handle: hBC09, columns: [id]}}},

The `cast` table links movies and actors.  The columns `actor` and `movie` are references to rows of
the other tables: Their type is simply the name of the target table.  This table also has a
composite key, so an actor can star in multiple movies, and a movie can have multiple actors, but an
actor can only star in the movie as one role.  You might decide that an actor can star in multiple
roles (consider Cloud Atlas for example), or you might decide that in such cases you treat the role
string specially (see how IMDB handles Cloud Atlas for example).  Treode is flexible about the
model, and this is merely the way we've chosen to represent it for this tutorial.

        cast: {
          handle: h7606,

          columns: {
            actor: {handle: h0310, type: actor, nullable: false},
            movie:  {handle: h85AA, type: movie, nullable: false},
            role:   {handle: h20AA, type: string, nullable: false}},

          keys: {
            id: {handle: hFD81, columns: [actor, movie]}}}},

## Configuring Documents

The `documents` field describes how to map JSON objects to the relational schema.  It is a JSON
object of document mapping expressions, and the field names serve as the document names.  To some
extent we will discuss what these expressions do, and you may want to consult the
[reference&nbsp;manual][ref-documents] for deeper information.  We will also briefly discuss here
how these fit with the resource endpoints, and then we explain those in more detail below.

      documents: {

Our first mapping expression provides the details for an actor: it is a JSON object with his or her
name and an array of the roles he or she has played.  In response to an HTTP GET, the Treode server
uses this expression to compose a JSON object by reading the tables.  And it uses this to decompose
a JSON object into updates on the tables when handling POST, PUT or DELETE.

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

Notice the expression above provides the details for *an* actor.  That is, the document pertains to
a single row of the actor table, known as the root row.  The URL in a GET, PUT or DELETE must
provide details to identify that root row.  So when the server receives a request for a URL like
`/actor/<id>`, it needs to extract the ID from the URL and then match it to a single row in the
table.  This next mapping is a part of that process.  It is straightforward for the actor and movie
table, but it becomes more complex with a table that has a composite key that includes references to
other tables.  The [modeless&nbsp;tutorial][schema-cast] shows an example.

        actorKey:
          "with actor {
            id: id;
          }",

This document mapping describes what data to include in a full text search on actors.  For this
simple tutorial, we only include the name, but you could construct tables with more columns and use
a document mapping to index only some of those.  Furthermore, an expression for full text indexing
can include arrays of values drawn from related rows.  For example, we could include the character's
name of each role the actor has played.  A document mapping that is used for full text search must have a handle, and that is given at the beginning by `F413`.

        actorTerms:
          "(F413) with actor {
            name: name;
          }",

After searching for a user by name using the full text index just described, we want the search
results to include just information necessary to list them.  We certainly don't want to spend
bandwidth transferring the roles of every matching actor.  This expression describes the view of an
actor used in search results.

        actorSummary:
          "with actor {
            id: id;
            name: name;
          }",

A movie has a structure similar to the actor, and so it has document mappings that are similar.  The
differences are: a movie has a title whereas an actor has name, and a movie has a cast whereas an
actor has played roles.

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

## Configuring Resources

The `hosts` field describes virtual hosts which Treode will serve.  It is an object of objects, and
those nested objects are the host descriptors; the field names are the fully qualified domain names
of the hosts.  You are restricted to which host names you may use, and you can see your list of
authorized hosts under your profile on the [Depot&nbsp;Dashboard][treode-dashboard].  If you would
like to upload this schema to Treode, you will first need to change `movies.store.localhost` below
to one of your authorized hostnames.

      hosts: {

        movies.store.localhost: {

The `resources` field is an array of objects that describe each resource.  Part of that description
includes what paths to match, and the order of the resources in this array may be relevant.  If
multiple descriptors match a path, the first one listed here will be used.

          resources: [

First we configure a resource to handle

> GET /movie?q=&lt;terms&gt;<br/>
> POST /movie<br/>
> GET /movie/&lt;id&gt;<br/>
> PUT /movie/&lt;id&gt;<br/>
> DELETE /movie/&lt;id&gt;<br/>

This resource is rooted on the movie table as given by the `table` field.  The `key` field must
bring together a pattern to extract the ID's value from the URL, and a document to map that value to
a key of the table.  The `document` field names which document to use for composing and decomposing
the entities served on this URL.  The fields `get`, `post`, `put` and `delete` enable those HTTP
methods on this resource.

The `search` field enables `GET /movie?q=<terms>`.  It describes which full text indexes are
searched and how to construct the response.  The search object lists one or more categories; each
category has a `terms` field to name the search index, and a `result` field to name the mapping that
constructs a summary for the results array.  In response to a search on this resource, the Treode
server will search the `movieTerms` index for matches and then construct a `moviesSummary` for each
match.  It will ultimately build a JSON object of categories, just one in this case, and each
category will be an array of matches ordered by relevance.

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

Next we configure a resource for actors, and it is similar to that for movies.

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

The final resource, and final piece of configuration, describes search over both actors and movies.
It handles only URLs like

> GET /search?q=&lt;terms&gt;

It will search both the `actorTerms` and `movieTerms` indexes, and it will return a result with two
categories.  The objects listed in those categories will have a slightly different form: the actors
have names, and the movies have titles.

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

[schema-cast]: https://github.com/Treode/movies-example/blob/cast/master/movies-schema.json.md
[schema-auth]: https://github.com/Treode/movies-example/blob/auth/master/movies-schema.json.md
[treode-dashboard]: https://dashboard.treode.com
[ref-documents]: http://treode.com/reference/documents.html
[ref-tables]: http://treode.com/reference/tables.html
[tutorial-modal]: http://treode.com/tutorial
