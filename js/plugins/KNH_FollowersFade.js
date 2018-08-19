//=============================================================================
// KNH_FollowersFade.js
//=============================================================================

/*:
 * @plugindesc 集合中の隊列メンバーを透明化するプラグイン
 * @author こんにちは
 *
 * @version 1.0.0 2017/10/29 公開
 *
 * @help 集合中の隊列メンバーを透明化するプラグインです。
 * 隊列メンバーが集合中、表示が被ってしまうのを防ぐことが出来ます。
 *
 * ●詳細な仕様
 *
 * 場所移動直後などで集合している状態のとき、隊列メンバーを消します。
 * その後、先頭のキャラが一歩動くたび、一人ずつニュッと表示されていきます。
 * イベントコマンド「隊列メンバーの集合」を行うと、再度消えていきます。
 *
 * ●プラグインコマンド
 *  【】内を入力してください。
 *
 * 【集合中隊列メンバー透明化 OFF】  上記の機能を OFF にします。
 * 【集合中隊列メンバー透明化 ON】   上記の機能を再度 ON にします。
 *
 * ●他プラグインとの併用について
 *
 * ・半歩移動プラグイン HalfMove (トリアコンタン様)
 * ・アナログムーブ  SAN_AnalogMove (サンシロ様)
 * と併用可能であることを確認しております。
 *
 * ●利用規約
 *   特に無いです。
 */

(function() {
    'use strict';
    var pluginName = 'KNH_FollowersFade';
    
    var getBoolean = function(text) {
        return (applyCharacters(text) || '').toUpperCase() === 'ON';
    };
    
    var applyCharacters = function(text) {
        if (text === null) text = '';
        text = '' + text;
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1], 10) >= 1 ? $gameActors.actor(parseInt(arguments[1], 10)) : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1], 10) >= 1 ? $gameParty.members()[parseInt(arguments[1], 10) - 1] : null;
            return actor ? actor.name() : '';
        }.bind(this));
        if ($dataSystem) text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };
    
    var getChDistance = function(ch) {
        return Math.abs(ch._realX - ch._x) || Math.abs(ch._realY - ch._y);
    };
    
    //-----------------------------------------------------------------------------
    // プラグインコマンドの追加
    //-----------------------------------------------------------------------------
    
    var _Game_Interpreter_pluginCommand      = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        try {
            this.pluginCommandFollowersFade(command, args);
        } catch (e) {
            if ($gameTemp.isPlaytest() && Utils.isNwjs()) {
                var window = require('nw.gui').Window.get();
                if (!window.isDevToolsOpen()) {
                    var devTool = window.showDevTools();
                    devTool.moveTo(0, 0);
                    devTool.resizeTo(Graphics.width, Graphics.height);
                    window.focus();
                }
            }
            console.log('プラグインコマンドの実行中にエラーが発生しました。');
            console.log('- コマンド名 　: ' + command);
            console.log('- コマンド引数 : ' + args);
            console.log('- エラー原因   : ' + e.toString());
        }
    };
    
    Game_Interpreter.prototype.pluginCommandFollowersFade = function(command, args) {
        var text;
        switch (command) {
            case '集合中隊列メンバー透明化':
                $gameSystem.followersFade().followersFade = getBoolean(args[0]);
                break;
        }
    };

    //-----------------------------------------------------------------------------
    // Game_System
    //-----------------------------------------------------------------------------
    
    Game_System.prototype.followersFade = function() {
        if (!this._followersFade) this._followersFade = {followersFade : true};
        return this._followersFade;
    };
    
    //-----------------------------------------------------------------------------
    // Game_Follower
    //-----------------------------------------------------------------------------
    
    var _Game_Follower_update = Game_Follower.prototype.update;
    Game_Follower.prototype.update = function() {
        _Game_Follower_update.apply(this, arguments);
        if ($gameSystem.followersFade().followersFade) this.updateGatheringOpacity();
    };
    
    Game_Follower.prototype.updateGatheringOpacity = function() {
        var opa = this._opacity;
        if ($gamePlayer.areFollowersGathered()) {
            opa = 0;
            this.__inVisiable = true;
        } else if ($gamePlayer.areFollowersGathering() && this.pos($gamePlayer._x, $gamePlayer._y)) {
            opa = getChDistance(this) * opa;
        } else if (this.__inVisiable) {
            var ch = $gamePlayer.followers().follower(this._memberIndex - 2) || $gamePlayer;
            opa = ch.isMoving() ? (1 - getChDistance(ch)) * opa : 0;
            if (opa >= (1 - ch.distancePerFrame()) * $gamePlayer._opacity - 1) this.__inVisiable = false;
        }
        this.setOpacity(opa);
    };
    
})();
