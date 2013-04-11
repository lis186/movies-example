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

  .controller ("ActorCtrl", [
    "$scope", "$location", "$routeParams", "Actor", "Cast",
    function ($scope, $location, $routeParams, Actor, Cast) {

      var noop = angular.noop;

      var removed = function (response) {
        $location.url ("/");
      };

      var error = function (response) {
        $scope.$emit ("raiseAlert", {response: response});
      };

      $scope.newRole = {};
      $scope.newRoleMovieId = "";

      $scope.actor = Actor.get ({actorId: $routeParams.actorId}, noop, error);

      $scope.remove = function() {
        Actor.remove ({actorId: $scope.actor.id}, removed, error);
      };

      $scope.suggestMovie = function (index) {
        return {
          placeholder: "Movie",
          minimumInputLength: 3,
          ajax: {
            url: store + "/movie",
            data: function (term, page) {
              return {q: term};
            },
            results: function (data, page) {
              return {
                results: data.movies || []
              };
            }},
          formatResult: function (data, element, query) {
            return data.title;
          },
          formatSelection: function (data, element) {
            var role = index == -1 ? $scope.newRole : $scope.actor.roles [index];
            role.movieId = data.movieId || data.id;
            role.title = data.title;
            return data.title;
          },
          initSelection: function (element, callback) {
            callback ($scope.actor.roles [index]);
          }};
      };

      $scope.changeName = function() {
        Actor.put ({actorId: $scope.actor.id}, {name: $scope.actor.name}, noop, error);
      };

      $scope.addRole = function() {
        var r = $scope.newRole;
        Cast.put (
          {actorId: $scope.actor.id, movieId: r.movieId},
          {role: r.role},
          noop,
          error);
        $scope.actor.roles.push (r);
        $scope.newRole = {};
        $scope.newRoleMovieId = "";
      };

      $scope.gotoRoleMovie = function (index) {
        var r = $scope.actor.roles [index];
        $location.url ("/movie/" + r.movieId);
      };

      $scope.changeRoleMovie = function (index) {
        return function (previous) {
          var r = $scope.actor.roles [index];
          Cast.put (
            {actorId: $scope.actor.id, movieId: previous},
            {movieId: r.movieId, role: r.role},
            noop,
            error);
        };
      };

      $scope.changeRoleName = function (index) {
        var r = $scope.actor.roles [index];
        Cast.put (
          {actorId: $scope.actor.id, movieId: r.movieId},
          {role: r.role},
          noop,
          error);
      };

      $scope.removeRole = function (index) {
        var r = $scope.actor.roles [index];
        Cast.remove (
          {actorId: $scope.actor.id, movieId: r.movieId},
          noop,
          error);
        $scope.actor.roles.splice (index, 1);
      };
    }]);
