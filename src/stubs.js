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

angular.module ('movies')

  .config (['TreodeAuthorizationProvider', function (Auth) {

    Auth.clientIds.stub = 'stub';

    Auth.authorities.stub = {

      displayName: 'Stub',
      prefix: 'stub',

      authorizeUri: function (id, nonce, reauthorize) {
        return '/authstub.html?' + $.param ({
          redirect_uri: '/oauth.html?state=' + nonce
        });
      }};
  }]);
