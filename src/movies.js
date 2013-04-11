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

angular.module ("movies", ["treode", "ui", "ui.bootstrap"])

  .config (["$routeProvider", function ($routeProvider) {

    $routeProvider.when ("/", {
      templateUrl: "view/empty.html"
    });

    $routeProvider.when ("/movie/:movieId", {
      templateUrl: "view/movie.html",
      controller: "MovieCtrl"
    });

    $routeProvider.when ("/add-movie", {
      templateUrl: "view/movie.html",
      controller: "MovieCtrl"
    });

    $routeProvider.when ("/actor/:actorId", {
      templateUrl: "view/actor.html",
      controller: "ActorCtrl"
    });

    $routeProvider.when ("/add-actor", {
      templateUrl: "view/actor.html",
      controller: "ActorCtrl"
    });

    $routeProvider.when ("/search", {
      templateUrl: "view/search.html"
    });

    $routeProvider.otherwise ({redirectTo: "/"});
  }])

  .factory ("Actor", ["TreodeResource", function (Resource) {
    return new Resource (store + "/actor", "/:actorId");
  }])

  .factory ("Movie", ["TreodeResource", function (Resource) {
    return new Resource (store + "/movie", "/:movieId");
  }])

  .factory ("Cast", ["TreodeResource", function (Resource) {
    return new Resource (store + "/cast", "/:movieId\\::actorId");
  }])

  .factory ("Search", ["TreodeResource", function (Resource) {
    return new Resource (store + "/search");
  }])

  .controller ("AlertsCtrl", [
    "$scope", "$rootScope", "$location",
    function ($scope, $rootScope, $location) {

      $scope.alerts = [];

      $rootScope.$on ("raiseAlert", function (event, args) {
        var response = args.response || {};
        var data = response.data || {};
        var type = args.type || "warn";
        var messages = [];
        if (args.messages) {
          messages = args.messages;
        } else if (args.message) {
          messages = [args.message];
        } else if (data.messages) {
          var ms = data.messages;
          for (var i = 0; i < ms.length; i++)
            messages.push (ms[i].message);
        } else if (response.status == 404) {
          messages = ["The entity was not found."];
          $location.url ("/");
        } else {
          messages = ["An unknown error occured."];
        }
        $scope.alerts.push ({messages: messages, type: type});
      });

      $scope.dismiss = function (index) {
        $scope.alerts.splice (index, 1);
      };
    }])

  .controller ("NavbarMenusCtrl", [
    "$scope", "$location", "Movie", "Actor",
    function ($scope, $location, Movie, Actor) {

      var created = function (location, response) {
        $location.url (location);
      };

      var error = function (response) {
        $scope.emit ("raiseAlert", response);
      };

      $scope.addMovie = function() {
        Movie.post ({title: "Working Title"}, created, error);
      };

      $scope.addActor = function() {
        Actor.post ({name: "Anonymous"}, created, error);
      };
    }])

  .controller ("NavbarSearchCtrl", [
    "$scope", "$location",
    function ($scope, $location) {

      $scope.query = "";

      $scope.search = function() {
        $location.url ("/search?q=" + $scope.query);
        $scope.query = "";
      };
    }])

  .controller ("SearchCtrl", [
    "$scope", "$location", "Search",
    function ($scope, $location, Search) {

      var noop = angular.noop;
      var params = $location.search();

      var error = function (response) {
        $scope.$emit ("raiseAlert", {response: response});
      };

      if (params.q)
        $scope.results = Search.search (params.q, noop, error);
      else
        $location.url ("/");
   }])

  .directive ('onBlurChange', function() {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        var save = null;
        elem.bind ('focus', function() {
          save = elem.val();
        });
        elem.bind ('blur', function() {
          if (elem.val() != save)
            scope.$apply (attrs.onBlurChange);
          save = null;
        });
      }};
    })

  .directive ("onSelect2Change", function() {
    return {
      link: function (scope, elem, attrs) {
        var save = null;
        elem.on ('open', function (event) {
          save = elem.val();
        });
        elem.on ('change', function (event) {
          scope.$apply (function () {
            scope.$eval (attrs.onSelect2Change) (save);
            save = null;
          });
        });
      }};
    });
