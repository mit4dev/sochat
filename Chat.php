<html>
<head>
    <link rel="stylesheet" href=".\style\css\style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.js"></script>

    <script type="text/javascript" language="JavaScript">

        var socket = io('http://192.168.1.21:8000');

        socket.on('connect', function () {
            appendMessage('You have been connected to the Chat!. Please write!');
            document.getElementById('sendButton').disabled = false;
        });

        socket.on('message', function (data) {
            console.log(data);
            appendMessage('<span style="color:' + data.color + '">' + data.uname + '</span>' + ' : ' + data.message);
            scrollToBottom();
        });

        socket.on('disconnect', function () {
            appendMessage('You have disconnected from the chat.');
            document.getElementById('sendButton').disabled = true;
        });

        socket.on('reconnecting', function () {
            appendMessage('...Trying to reconnect...');
            scrollToBottom();
            document.getElementById('sendButton').disabled = true;
        });

        socket.on('reconnect',function () {
            appendMessage('Reconnected!');
            document.getElementById('sendButton').disabled = false;
        });


        function sendMessage() {
            if (socket.connected) {
                var username = document.getElementById('username');
                var userMessage = document.getElementById('userMessage');
                if (username.value == "" || userMessage.value == "") {
                    alert('Username or Message can not be EMPTY. Please FILL them!');
                    console.log('invalid username or userMessage!');
                    return;
                }
                socket.emit('new message', {uname: username.value, message: userMessage.value, color: ucolor});
                appendMessage('<span style="color:' + ucolor + '">' + username.value + '</span>' + '(You): ' + userMessage.value);
                userMessage.value = "";

                scrollToBottom();
            }
        }


    </script>

    <script>

        function appendMessage(message) {
            var table = document.getElementById('ChatBoard');
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            td.innerHTML = message;
            tr.appendChild(td);
            table.appendChild(tr);
        }

        function generateRandomColor() {
            var keys = "123456789ABCDEF";
            var color = "#";
            for (i = 0; i < 6; i++) {
                color += keys[Math.floor((Math.random() * keys.length))];
            }
//            console.log(color);
            return color;
        }

        function scrollToBottom(){
            var objDiv = document.getElementById("ChatBoardWrapper");
            objDiv.scrollTop = objDiv.scrollHeight;
        }

//        setInterval("scrollToBottom()",1000);

        var ucolor = generateRandomColor();

    </script>

</head>


<body>


<div id="ChatBoardWrapper" style="overflow-y: scroll; height: 40%; width: 40%; margin: auto; border:2px dashed black;">
    <table id="ChatBoard">

    </table>
</div>
<div style="margin: auto;width: 40%; text-align: right">
    <input type="text" id="username" value="">
    <input style="width:60%;" type="text" id="userMessage" value="" onkeypress="handle(event)">
    <button id="sendButton" onclick="sendMessage();">Send message</button>

    <script>
        function handle(event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                sendMessage();
            }
        }
    </script>
</div>
</body>
</html>
