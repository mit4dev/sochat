/**
 * Created by HP-PC on 21.02.2017.
 */


chatManager = function () {
    this.init();
};


chatManager.prototype.setName = function (name) {
    this.managerName = name;
};

chatManager.prototype.getName = function () {
    return this.managerName;
};

chatManager.prototype.addBlockedUser = function (userobj) {
    if (this.blockedUserList.indexOf(userobj) == -1) {
        this.blockedUserList.push(userobj);
    } else console.log("User object, " + userobj + ", is already blocked");
};

chatManager.prototype.deleteBlockedUser = function (userobj) {
    var index;
    if ((index = this.blockedUserList.indexOf(userobj)) !== -1) {
        this.blockedUserList.splice(index, 1);
    } else console.log("User cannot be found in blockedUserList, " + userobj);
};

//TODO: decide on the best practice upon determining itemIndex.
chatManager.prototype.addBlockedWord = function (word) {
    var index;
    if ((index = this.blockedWordList.indexOf(word)) == -1) {
        this.blockedWordList.push(word);
    }
    else console.log("Word is already blocked: " + word);
};

chatManager.prototype.deleteBlockedWord = function (word) {
    var index = getIndexOfItem(this.blockedWordList, word);
    if (index !== -1) {
        this.blockedWordList.splice(index, 1);
    }
};

function getIndexOfItem(array, item) {
    return array.indexOf(item);
};


chatManager.prototype.addChatCommand = function (commandobj) {
    this.userDefinedCommandList.push(commandobj);
};

chatManager.prototype.init = function () {
    _this = this;
    this.totalMessageCount = 0;
    this.socketUri = "192.168.1.21:8000";
    this.blockedWordList = [];
    this.blockedUserList = [];
    this.blockedMessagesList = [];
    this.builtInCommandList = [{commandName: "clearChat", commandBody: ""}];
    this.userDefinedCommandList = [];
    this.socket = io(this.socketUri);
    this.connecting = false;
    this.connected = false;
    this.disconnected = false;
    this.reconnecting = false;
    this.reconnected = false;

    this.socket.on("connect", function () {
        console.log("CM  connected to the socket!");
        _this.connected = true;
        //TODO: send appropriate handshaking message to the server.
    });

    this.socket.on("disconnect", function () {
        _this.disconnected = true;
        _this.connected = false;
        console.log("CM disconnected from the socket!");
    });

    this.socket.on("reconnect", function () {
        _this.disconnected = false;
        _this.connected = true;
        _this.reconnected = true;
    });
};

chatManager.prototype.updateSocketUri = function (socketUri) {
    this.socketUri = socketUri;
    this.socket = io(this.socketUri);
    return this.socket;
};

chatManager.prototype.getSocketUri = function () {
    console.log(this.socketUri);
    return this.socketUri;
};


chatManager.prototype.sendCommand = function (commandObj) {
    if (this.socket.connected) {
        //TODO: send a command to the server, then server will broadcast the command.
        socket.emit('cm-command', commandObj);
    }
};

//TODO: change username (string) to userID (int). Because blocking some username like r will eliminate all messages from senders that have r in their username.
chatManager.prototype.sendMessage = function (messageObj) {
    if (this.socket.connected) {
        if (this.isMessageClear(messageObj)) {
            this.socket.emit("cm-new-message", messageObj);
        }
        else {
            console.log("isMessageClear is false. Inside sendMessage. Message blocked: " + messageObj.message);
            this.blockedMessagesList.push(messageObj);
        }
    } else console.log("Cannot emit message, socket is disconnected");
};

chatManager.prototype.containsArrayElement = function (sourceString, array) {
    for (i = 0; i < array.length; i++) {
        if (sourceString.indexOf(array[i]) !== -1) {
            console.log("Source: " + sourceString + ", contains array element " + i + ": " + array[i]);
            return true;
        }
    }
    return false;
};

chatManager.prototype.isExactMatch = function (source, array) {
    for (i = 0; i < array.length; i++) {
        if (array[i] === source) {
            console.log("Source: " + source + ", contains array element " + i + ": " + array[i]);
            return true;
        }
    }
    return false;
};

chatManager.prototype.isMessageClear = function (messageObj) {
    this.totalMessageCount++;
    if (!this.containsArrayElement(messageObj.message, this.blockedWordList) && !this.isExactMatch(messageObj.username, this.blockedUserList)) {
        return true;
    }
    else {
        this.blockedMessagesList.push(messageObj);
        console.log("Processed message blocked: " + messageObj.message);
        return false;
    }
};



function instantiateCM() {
    var socketUri = "192.168.1.21:8000";
    var socket = io(socketUri);
    console.log(socket);
    socket.on('connect', function () {
        console.log('CM CONNECTED');
        socket.emit('cm connect', {data: "okokoko"});
    });
    socket.emit('cm connect', {data: "okokoko"});
    if (socket.connected) {
        socket.emit('cm connect', {});
        console.log("SOCKET EMIITED!")
    }
};





















