
/**
 * The Model. Model stores items and notifies
 * observers about changes.
 */
function ListModel(items) {
    this._items = items;
    this._selectedIndex = -1;

    this.itemAdded = new Event(this);
    this.itemRemoved = new Event(this);
    this.selectedIndexChanged = new Event(this);
}

ListModel.prototype = {
    getItems: function () {
        return [].concat(this._items);
    },

    addItem: function (item) {
        this._items.push(item);
        this.itemAdded.notify({
            item: item
        });
    },

    removeItemAt: function (index) {
        var item;

        item = this._items[index];
        this._items.splice(index, 1);
        this.itemRemoved.notify({
            item: item
        });
        if (index === this._selectedIndex) {
            this.setSelectedIndex(-1);
        }
    },

    getSelectedIndex: function () {
        return this._selectedIndex;
    },

    setSelectedIndex: function (index) {
        var previousIndex;

        previousIndex = this._selectedIndex;
        this._selectedIndex = index;
        this.selectedIndexChanged.notify({
            previous: previousIndex
        });
    }
};

/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */
function ListView(model, elements) {
    this._model = model;
    this._elements = elements;

    this.listModified = new Event(this);
    this.addButtonClicked = new Event(this);
    this.delButtonClicked = new Event(this);

    var _this = this;

    // attach model listeners
    this._model.itemAdded.attach(function () {
        _this.rebuildList();
    });
    this._model.itemRemoved.attach(function () {
        _this.rebuildList();
    });

    // attach listeners to HTML controls
    this._elements.list.change(function (e) {
        _this.listModified.notify({
            index: e.target.selectedIndex
        });
    });
    this._elements.addButton.click(function () {
        _this.addButtonClicked.notify();
    });
    this._elements.delButton.click(function () {
        _this.delButtonClicked.notify();
    });
}

ListView.prototype = {
    show: function () {
        this.rebuildList();
    },

    rebuildList: function () {
        var list, items, key;

        list = this._elements.list;
        list.html('');

        items = this._model.getItems();
        for (key in items) {
            if (items.hasOwnProperty(key)) {
                list.append($('<option>' + items[key] + '</option>'));
            }
        }
        this._model.setSelectedIndex(-1);
    }
};

/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */
function ListController(model, view) {
    this._model = model;
    this._view = view;

    var _this = this;

    this._view.listModified.attach(function (sender, args) {
        _this.updateSelected(args.index);
    });

    this._view.addButtonClicked.attach(function () {
        _this.addItem();
    });

    this._view.delButtonClicked.attach(function () {
        _this.delItem();
    });
}

ListController.prototype = {
    addItem: function () {
        var item = window.prompt('Add item:', '');
        if (item) {
            this._model.addItem(item);
        }
    },

    delItem: function () {
        var index;

        index = this._model.getSelectedIndex();
        if (index !== -1) {
            this._model.removeItemAt(this._model.getSelectedIndex());
        }
    },

    updateSelected: function (index) {
        this._model.setSelectedIndex(index);
    }
};

$(function () {
    var model = new ListModel(['PHP', 'JavaScript']),
        view = new ListView(model, {
            'list': $('#list'),
            'addButton': $('#plusBtn'),
            'delButton': $('#minusBtn')
        }),
        controller = new ListController(model, view);

    view.show();
});



(function($){
    $.fn.Chat = function(s){
        var _this = this;

        this.ChaModule = function(chaAndMem){
            this._chaAndMem = chaAndMem;

            this.chaJoin = new _this.Event(this);
            this.chaLeft = new _this.Event(this);
        };

        this.ChaModule.prototype = {
            getRooms: function () {
                return [].concat(this._chaAndMem);
            },

            joinCha: function (userId, chaId) {
                for(var i=0; i<this._chaAndMem.length;i++){
                    if(this._chaAndMem[i].chaId == chaId){
                        if($.inArray(userId,this._chaAndMem[i].members) === -1){
                            this._chaAndMem[i].members.push(userId);
                        }
                        break;
                    }
                }
                this.chaJoin.notify({
                    "userId": userId,
                    "chaId" : chaId
                });
                // do some server action
            },

            leaveCha: function (userId, chaId) {
                for(var i=0; i<this._chaAndMem.length;i++){
                    if(this._chaAndMem[i].chaId == chaId){
                        var index;
                        if(index = $.inArray(userId,this._chaAndMem[i].members)){
                            this._chaAndMem[i].members.splice(index, 1);
                        }
                        break;
                    }
                }
                this.itemRemoved.notify({
                    "userId": userId,
                    "chaId" : chaId
                });

                // do some server action
            }
        };

        this.ChaView = function(){

        };

        this.ChaView.prototype = {

        };

        this.ChaController = function(){

        };

        this.ChaController.prototype = {

        };

        this.connect = function(){
            s.oVars.oSocket = io.connect(s.oVars.oToken ? ('?token=' + s.oVars.oToken) : '', { 'forceNew': true });
            console.log(s.oVars.oSocket);
            s.oVars.oSocket.on('pong', function () {
                console.log('- pong');
            }).on('time', function (data) {
                    console.log('- broadcast: ' + data);
                }).on('authenticated', function () {
                    console.log('- authenticated');
                }).on('disconnect', function () {
                    console.log('- disconnected');
                });
        };

        var savedToken = $.fn.myCookie({cName: "oToken"});
        s.oVars.oToken = (typeof savedToken === "object" && savedToken.exp < Date.now()) ? savedToken : false ;


        if(s.oVars.oToken)
        {
            s.oBinds.loginWrap.removeClass("displayNone").addClass("displayNone");
            s.oBinds.leftSite.removeClass("displayNone");
            s.oBinds.rightSide.removeClass("displayNone");
            s.oBinds.statusBar.removeClass("displayNone");
        }
        else
        {
            s.oBinds.loginWrap.removeClass("displayNone");
            s.oBinds.leftSite.removeClass("displayNone").addClass("displayNone");
            s.oBinds.rightSide.removeClass("displayNone").addClass("displayNone");
            s.oBinds.statusBar.removeClass("displayNone").addClass("displayNone");
        }

        this.connect();

        $('#ping').on('click', function () {
            console.log('- ping');
            socket.emit('ping');
        });

        s.oBinds.submit.unbind('click').bind('click', function(e){
            e.preventDefault();
            var nickName = s.oBinds.nickname.val();
            if(nickName == ""){
                alert("Please select nickname !");
                return false;
            }

            if($.inArray(nickName, s.oVars.oOptions.chGlobal.badNickNames) > -1){
                alert("Nickname Taken chose a different name !");
                return false;
            }

            s.oVars.oOptions.data.method = 'login';
            s.oVars.oOptions.data.post = 'nickname=' + nickName;
            var data = s.oFns.getData()();
            console.log(data);
            s.oVars.oToken = data.token;

            _this.connect();
            /*
             $.ajax({
             type: 'POST',
             data: {
             username: username,
             },
             url: '/login'
             }).done(function (result) {
             s.oVars.oToken = result.oToken;
             _this.connect();
             });
             */
        });


        return this;
    }
})(jQuery);

$(function() {
    var tabTitle = $( "#tab_title" ),
        tabContent = $( "#tab_content" ),
        tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>",
        tabCounter = 2;
    var tabs = $( "#tabs" ).tabs();
// modal dialog init: custom buttons and a "close" callback resetting the form inside
    var dialog = $( "#dialog" ).dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            Add: function() {
                addTab();
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
            form[ 0 ].reset();
        }
    });
// addTab form: calls addTab function on submit and closes the dialog
    var form = dialog.find( "form" ).submit(function( event ) {
        addTab();
        dialog.dialog( "close" );
        event.preventDefault();
    });
// actual addTab function: adds new tab using the input from the form above
    function addTab() {
        var label = tabTitle.val() || "Tab " + tabCounter,
            id = "tabs-" + tabCounter,
            li = $( tabTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) ),
            tabContentHtml = tabContent.val() || "Tab " + tabCounter + " content.";
        tabs.find( ".ui-tabs-nav" ).append( li );
        tabs.append( "<div id='" + id + "'><p>" + tabContentHtml + "</p></div>" );
        tabs.tabs( "refresh" );
        tabCounter++;
    }
// addTab button: just opens the dialog
    $( "#add_tab" )
        .button()
        .click(function() {
            dialog.dialog( "open" );
        });
// close icon: removing the tab on click
    tabs.delegate( "span.ui-icon-close", "click", function() {
        var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
        $( "#" + panelId ).remove();
        tabs.tabs( "refresh" );
    });
    tabs.bind( "keyup", function( event ) {
        if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
            var panelId = tabs.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
            $( "#" + panelId ).remove();
            tabs.tabs( "refresh" );
        }
    });
});


