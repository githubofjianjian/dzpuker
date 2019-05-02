var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
//
// as3-msgpack (MessagePack for Actionscript3)
// Copyright (C) 2013 Lucas Teixeira (Disturbed Coder)
//
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
var org;
(function (org) {
    var msgpack;
    (function (msgpack) {
        var MsgPackFlags = (function () {
            function MsgPackFlags() {
            }
            return MsgPackFlags;
        }());
        /**
         * Flag which indicates that raw buffers must be decoded as a <code>ByteArray</code> instead of a <code>String</code>.
         * @see Factory#checkFlag()
         */
        MsgPackFlags.READ_RAW_AS_BYTE_ARRAY = 0x01;
        /**
         * Flag which indicates that little endian buffers must be accepted (MessagePack specification works only with big endian).
         * @see Factory#checkFlag()
         */
        MsgPackFlags.ACCEPT_LITTLE_ENDIAN = 0x02;
        msgpack.MsgPackFlags = MsgPackFlags;
        __reflect(MsgPackFlags.prototype, "org.msgpack.MsgPackFlags");
    })(msgpack = org.msgpack || (org.msgpack = {}));
})(org || (org = {}));
//# sourceMappingURL=MsgPackFlags.js.map