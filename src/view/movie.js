/* Copyright 2013 Treode, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

angular.module ("movies")

  .controller ("MovieCtrl", [
    "$scope", "$location", "$routeParams", "Movie", "Cast",
    function ($scope, $location, $routeParams, Movie, Cast) {

      var noop = angular.noop;

      var removed = function (response) {
        $location.url ("/");
      };

      var error = function (response) {
        $scope.$emit ("raiseAlert", {response: response});
      };

      $scope.newCast = {};
      $scope.newCastActorId = "";

      $scope.movie = Movie.get ({movieId: $routeParams.movieId}, noop, error);

      $scope.remove = function() {
        Movie.remove ({movieId: $scope.movie.id}, removed, error (true));
      };

      $scope.suggestActor = function (index) {
        return {
          placeholder: "Actor",
          minimumInputLength: 3,
          ajax: {
            url: store + "/actor",
            data: function (term, page) {
              return {q: term};
            },
            results: function (data, page) {
              return {
                results: data.actors || []
              };
            }},
          formatResult: function (data, element, query) {
            return data.name;
          },
          formatSelection: function (data, element) {
            var cast = index == -1 ? $scope.newCast : $scope.movie.cast [index];
            cast.actorId = data.actorId || data.id;
            cast.name = data.name;
            return data.name;
          },
          initSelection: function (element, callback) {
            callback ($scope.movie.cast [index]);
          }};
      };

      $scope.changeTitle = function() {
        Movie.put ({movieId: $scope.movie.id}, {title: $scope.movie.title}, noop, error);
      };

      $scope.addCast = function() {
        var c = $scope.newCast;
        Cast.put (
          {movieId: $scope.movie.id, actorId: c.actorId},
          {role: c.role},
          noop,
          error);
        $scope.movie.cast.push (c);
        $scope.newCast = {};
        $scope.newCastActorId = "";
      };

      $scope.gotoCastActor = function (index) {
        var c = $scope.movie.cast [index];
        $location.url ("/actor/" + c.actorId);
      };

      $scope.changeCastActor = function (index) {
        return function (previous) {
          var c = $scope.movie.cast [index];
          Cast.put (
            {movieId: $scope.movie.id, actorId: previous},
            {actorId: c.actorId, role: c.role},
            noop,
            error);
        };
      };

      $scope.changeCastRole = function (index) {
        var c = $scope.movie.cast [index];
        Cast.put (
          {movieId: $scope.movie.id, actorId: c.actorId},
          {role: c.role},
          noop,
          error);
      };

      $scope.removeCast = function (index) {
        var c = $scope.movie.cast [index];
        Cast.remove (
          {movieId: $scope.movie.id, actorId: c.actorId},
          noop,
          error);
        $scope.movie.cast.splice (index, 1);
      };
    }]);
