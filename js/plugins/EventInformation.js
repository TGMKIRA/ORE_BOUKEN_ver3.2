//===================================================================
//EventInformation.js
//イベントの頭上に文字を表示するプラグイン
//===================================================================
//Copyright (c) 2018 蔦森くいな
//Released under the MIT license.
//http://opensource.org/licenses/mit-license.php
//-------------------------------------------------------------------
//blog   : http://paradre.com/
//Twitter: https://twitter.com/Kuina_T
//===================================================================
//＜更新情報＞
//  ver1.0.0 2018/01/13 初版
//===================================================================

/*:
 * @plugindesc イベントの頭上に文字を表示したい時に使います
 * @author 蔦森くいな
 *
 * @help このプラグインはイベントのページ毎に異なる設定が可能です。
 * 設定したいイベントページの実行内容１行目に
 * 「注釈」コマンドを設定し、以下のように入力します。
 * 
 * info:ハロルド
 * 
 * これでイベントの頭上に「ハロルド」と表示されます。
 * また、以下のように入力すると文字の大きさを変更できます。
 * 
 * info:ハロルド,40
 * 
 * さらに、行を変えて以下のように入力すると
 * 文字を表示する位置を調整できます
 * 
 * info:ハロルド,40
 * infoMove:50,-20
 * 
 * ※infoMoveは１つ目の数字がX座標、２つ目がY座標を調整します。
 * ※infoMoveは必ずinfoより後に入力する必要があります。
 * ※行を変えずにスペースで区切ってもOKです。
 * ※仕様上、表示する文字列に「：」や「　」は含められません
 * 
 *
 * 利用規約：
 * このプラグインは商用・非商用を問わず無料でご利用いただけます。
 * 使用報告やクレジット表記も必要ありません。
 * どのようなゲームに使っても、どのように加工していただいても構いません。
 * MIT Licenseにつき著作権表示とライセンスURLは残しておいて下さい。
 */

(function() {
    'use strict';
    
    Game_Event.prototype.pd_EI_initialize = function() {
        if(this.__pd_EI_sprite && this.__pd_EI_sprite.parent){
            this.__pd_EI_sprite.parent.removeChild(this.__pd_EI_sprite);
        }
        this.__pd_EI_sprite = null;
    };
    
    Game_Event.prototype.pd_EI_setInformation = function(text, fontSize) {
        var charCount = 0;
        for (var i = 0, len = text.length; i < len; i++) {
            var code = text.charCodeAt(i);
            if((code >= 0x0 && code < 0x81) || (code == 0xf8f0) || (code >= 0xff61 && code < 0xffa0) || (code >= 0xf8f1 && code < 0xf8f4)){
                charCount += 1;
            }else{
                charCount += 2;
            }
        }
        fontSize = fontSize ? fontSize : 21;
        var infoWidth = (charCount+1) * Math.ceil(fontSize/2);
        var infoHeight = fontSize + 2;
        this.__pd_EI_sprite = new Sprite(new Bitmap(infoWidth, infoHeight));
        this.__pd_EI_sprite.anchor = new Point(0.5, 1);
        this.__pd_EI_sprite.move(0, -48);
        var bitmap = this.__pd_EI_sprite.bitmap;
        bitmap.fillRect(0, 0, infoWidth, infoHeight, 'rgba(0,0,0,0.5)');
        bitmap.fontSize = fontSize;
        bitmap.drawText(text, 0, 0, infoWidth, infoHeight, 'center');
        if(SceneManager._scene._spriteset){
            var events = $gameMap.events();
            for(var i = 0, len = events.length; i < len; i++){
                if(events[i] === this){
                    SceneManager._scene._spriteset._characterSprites[i].addChild(this.__pd_EI_sprite);
                }
            }
        }
    };
    
    var pd_EI_Game_Event_clearPageSettings = Game_Event.prototype.clearPageSettings;
    Game_Event.prototype.clearPageSettings = function() {
        pd_EI_Game_Event_clearPageSettings.call(this);
        this.pd_EI_initialize();
    };
    
    var pd_EI_Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function() {
        pd_EI_Game_Event_setupPageSettings.call(this);
        this.pd_EI_initialize();
        var list = this.page().list;
        var index = 0;
        while(list[index].code === 108 || list[index].code === 408){
            var command = list[index].parameters[0].toLowerCase().replace(/　/g," ").split(' ');
            for(var i = 0, len = command.length; i < len; i++){
                var param = command[i].replace(/:/g,',').replace(/：/g,',').split(',');
                switch(param[0]){
                    case 'info':
                        this.pd_EI_setInformation(param[1], parseInt(param[2]));
                        break;
                    case 'infomove':
                        if(this.__pd_EI_sprite){
                            this.__pd_EI_sprite.x += parseInt(param[1]);
                            this.__pd_EI_sprite.y += parseInt(param[2]);
                        }
                        break;
                }
            }
            index = index + 1;
        }
    };
    
    var pd_EI_Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters;
    Spriteset_Map.prototype.createCharacters = function() {
        pd_EI_Spriteset_Map_createCharacters.call(this);
        var events = $gameMap.events();
        for(var i = 0, len = events.length; i < len; i++){
            if(events[i].__pd_EI_sprite !== null){
                this._characterSprites[i].addChild(events[i].__pd_EI_sprite);
            }
        }
    };
    
})();