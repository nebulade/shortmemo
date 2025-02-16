const St = imports.gi.St;
const Main = imports.ui.main;
const Lang = imports.lang;
const PanelMenu = imports.ui.panelMenu;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Settings = Me.imports.settings;

function ShortMemo() {
    this._init();
}

ShortMemo.prototype = {
    __proto__: PanelMenu.Button.prototype,

    _init: function() {
        PanelMenu.Button.prototype._init.call(this, St.Align.START);
        this._settings = Settings.getSettings();
        this._buildUI();
        this._refresh();
    },

    _buildUI: function() {
        this.message = new St.Label({
        });
        this.actor.add_actor(this.message);

        if (this.mainBox != null)
            this.mainBox.destroy();
        this.mainBox = new St.BoxLayout();
        this.mainBox.set_vertical(true);

        let hint = new St.Label({
            name: "hint",
            text:_("New message:"),
        });
        this.mainBox.add_actor(hint);

        this.newMessage = new St.Entry({
            name: "newMessage",
            track_hover: true,
            can_focus: true,
        });
        this.newMessage.clutter_text.connect(
                'key-press-event',
                Lang.bind(this, function(o, e) {
                    if (e.get_key_symbol() == 65293) {
                        let newText = this.newMessage.get_text();
                        this._save(newText);
                        this._refresh();
                    }
                }));
        this.mainBox.add_actor(this.newMessage);

        this.menu.box.add(this.mainBox);
    },

    _refresh: function() {
        let text = this._load();
        this.message.set_text(text);
        this.newMessage.set_text(text);
        this.menu.close();
    },

    _save: function(text) {
        this._settings.set_string(Settings.MESSAGE_KEY, text);
    },

    _load: function() {
        return this._settings.get_string(Settings.MESSAGE_KEY);
    },
};

let shortMemo;

function init() {
}

function enable() {
    shortMemo = new ShortMemo();
    Main.panel.addToStatusArea('shortmemo', shortMemo);
}

function disable() {
    shortMemo.destroy();
    shortMemo = null;
}
