'use strict';
var UserName="User";
var ListOfID=[];
var uniqueId = function() {
	var date = Date.now();
	var random = Math.random() * Math.random();

	return Math.floor(date * random).toString();
};

var theMessage = function(text,nick) {
	return {
		description:text,
		id: uniqueId(),
		user:nick
	};
};

var appState = {
	mainUrl : 'http://localhost:999/chat',
	messageList:[],
	token : 'TN11EN'
};

function run() {
	document.addEventListener('click', delegateEvent);
	var image=document.getElementById("myImage");
	image.src="https://pp.vk.me/c624221/v624221487/2bec6/xx-inBV91h0.jpg";
			
	restore();

}
function delegateEvent(evtObj) {
	if(evtObj.type === 'click'
		&& evtObj.target.classList.contains('button'))
		changeLogin();
	if(evtObj.type === 'click'
		&& evtObj.target.classList.contains('button6'))
		if(MyID>=0){
			addChangedMessage(MyID);
			MyID=-1;
		}
		else
		    onAddButtonClick();
}
 function changeLogin()
 {
      var text2;
	  UserName=document.getElementById("login").value;
	  if(UserName!=""){
	      text2="Welcome to SweetChat, "+UserName+"!";
	      document.getElementById("loginChanged").innerHTML=text2;
	  }
 }
function createAllMessages(allMessages) {
	for(var i = 0; i < allMessages.length; i++)
		addMailInternal(allMessages[i]);
}
function onAddButtonClick(){
	var mailText = document.getElementById('mailText');
	var newMessage = theMessage(mailText.value,UserName);

	if(mailText.value == '')
		return;

	mailText.value = '';
	addMail(newMessage, function() {
	});
} 
function addMail(message, continueWith) {
	post(appState.mainUrl, JSON.stringify(message), function(){
		restore();
	});
}

function addMailInternal(message) {
	var item = createItem(message);
	var items = document.getElementsByClassName('items')[0];
	var messageList = appState.messageList;

	messageList.push(message);
	items.appendChild(item);
	items.scrollTop = items.scrollHeight;
}

function createItem(mes){
    var message = document.createElement('div');
	message.innerHTML = '<table><tr><td style="width:25%"><b>' + mes.user + ':</b></td>                      <td width=70% style="word-wrap: break-word" >' + mes.description + '</td>                      <td style="padding-left: 5px">                                            <img src="http://www.defaulticon.com/sites/default/files/styles/icon-front-page-32x32-preview/public/field/image/edit.png?itok=nb2eY85A" onClick="editMessage()" style="cursor: pointer"></img>                      <img src="http://www.defaulticon.com/sites/default/files/styles/icon-front-page-32x32-preview/public/field/image/eraser.png?itok=ohy0hMWI" onClick="deleteMessage()" style="cursor: pointer"</img>                      </td></tr></table>';
	//'<div class="item strikeout" data-task-id="идентификатор">'+'описание задачи</div>'
	message=message.firstChild;
   // updateItem(message, mes);
     message.setAttribute('data-task-id', mes.id);
	return message;
}
function updateItem(divItem, mes){
    divItem.classList.remove('strikeout');
	divItem.firstChild.checked = false;
	divItem.setAttribute('data-task-id', mes.id);
	divItem.lastChild.textContent = mes.description;
}
function deleteMessage()
{
	var toDelete = event.target;
	toDelete = toDelete.parentNode.parentNode.parentNode.parentNode;
	var items = document.getElementsByClassName('items')[0];
	var a = toDelete.attributes['data-task-id'].value;
	var ml = [];
	
	
	for(var i = 0; i < appState.messageList.length; i++) 
		{	
			if(appState.messageList[i].id == a){
				var m=theMessage(appState.messageList[i].description,appState.messageList[i].user);
				m.id=appState.messageList[i].id;
			}
		}
		var str=JSON.stringify("{id:"+m.id+"}");
		var url = appState.mainUrl + '?id=' + m.id;//достаём 
		erase(url, JSON.stringify(m),function(){
			var items = document.getElementsByClassName('items')[0];
			a = toDelete.attributes['data-task-id'].value;
			for(var i = 0; i < appState.messageList.length; i++) 
		    {
            if(appState.messageList.length!=0)				
			if(appState.messageList[i].id == a){
		     	items.removeChild(items.children[i]);
				appState.messageList.splice(i,1);//удаление элемента из массива
				//ListOfID.splice(i);
				i--;
			}
		    }
			});

}
var MyID=-1;
function editMessage()
{
	
	var toEdit = event.target;
	toEdit = toEdit.parentNode;
	var MyDivItem=toEdit;//.previousElementSibling 
	toEdit=toEdit.parentNode.parentNode.parentNode;
	MyID=toEdit.attributes['data-task-id'].value;
	for(var i = 0; i < appState.messageList.length; i++) {
		if(appState.messageList[i].id == MyID){
			document.getElementById('mailText').value=appState.messageList[i].description;
			MyID=i;
			//document.getElementById('mailText').value=MyID;
		}
	}
	
}
function addChangedMessage(id)
{
	var items = document.getElementsByClassName('items')[0];
	var m=theMessage(document.getElementById('mailText').value,appState.messageList[appState.messageList.length-1].user);
	m.id=appState.messageList[id].id;
	var item=createItem(m);
	//items.appendChild(item);
    items.children[id].innerHTML='<table><tr><td style="width:25%"><b>' + m.user + ':</b></td>                      <td width=70% style="word-wrap: break-word" >' + m.description + '</td>                      <td style="padding-left: 5px">                                            <img src="http://www.defaulticon.com/sites/default/files/styles/icon-front-page-32x32-preview/public/field/image/edit.png?itok=nb2eY85A" onClick="editMessage()" style="cursor: pointer"></img>                      <img src="http://www.defaulticon.com/sites/default/files/styles/icon-front-page-32x32-preview/public/field/image/eraser.png?itok=ohy0hMWI" onClick="deleteMessage()" style="cursor: pointer"</img>                      </td></tr></table>';	//items.replaceChilditems(items.children[id],items.children[items.children.length-1]);
	//items.removeChild(items.children[items.children.length-1]);
	document.getElementById('mailText').value="";
	put(appState.mainUrl, JSON.stringify(m), function(){
		//restore();
	});
}
function restore(continueWith) {
	var url = appState.mainUrl + '?token=' + appState.token;//достаём юрл (нужен для передачи в функции аджакс)

	get(url, function(responseText) {//достаём джейсон, хранящийся на сервере, после этого будет выполняться function(responseText)
		console.assert(responseText != null);
        //var theMes=TheMessage("");
		var response = JSON.parse(responseText);//парсируем джейсон
        var newList=[];
		appState.token = response.token;//респонс хранит два поля - токен и массив строк мэссиджис(строковое представление структуры TheMessage)
		var n=response.messages.length;
		for(var i=0;i<n;i++){
		var json=response.messages[i];//обращаемся к каждой строке из массива
		
		var w=json.split('"');//делим её на подстроки(в итоге получаем массив подстрок w)
		if(w[11])//по индексу 7 в w хранится description сообщения, по индексу 11 - имя, по индексу 3 - id
		    var mess=theMessage(w[7],w[11]);//создаём объект структуры
	    else
			var mess=theMessage(w[7],"");
		mess.id=w[3];
		var t=0;
		for(var j=0;j<ListOfID.length;++j)
		{
			if(mess.id==ListOfID[j]){
				t++;
			}
		}
		if(t==0){
		   newList.push(mess);//теперь вместо бывшего строкого представления ставим в массив структуру
		   ListOfID.push(mess.id);
		}
		}
		createAllMessages(newList);//вызываем функцию построения всех сообщений
        var text2;
		if(newList.length!=0){
	    UserName=newList[newList.length-1].user;//для логина
	    if(UserName!=""){
	      text2="Welcome to SweetChat, "+UserName+"!";
	      document.getElementById("loginChanged").innerHTML=text2;
	    }
		}
		continueWith && continueWith();
	});
}
function defaultErrorHandler(message) {
	console.error(message);
}

function get(url, continueWith, continueWithError) {
	ajax('GET', url, null, continueWith, continueWithError);
}

function post(url, data, continueWith, continueWithError) {
	ajax('POST', url, data, continueWith, continueWithError);	
}

function put(url, data, continueWith, continueWithError) {
	ajax('PUT', url, data, continueWith, continueWithError);	
}
function erase(url, data, continueWith, continueWithError) {
	ajax('DELETE', url, data,continueWith, continueWithError);	
}
function isError(text) {
	if(text == "")
		return false;
	
	try {
		var obj = JSON.parse(text);
	} catch(ex) {
		return true;
	}

	return !!obj.error;
}

function ajax(method, url, data, continueWith, continueWithError) {
	var xhr = new XMLHttpRequest();
    var image=document.getElementById('myImage');
	continueWithError = continueWithError || defaultErrorHandler;
	xhr.open(method || 'GET', url, true);
    var flag=0;
	xhr.onload = function () {
		if (xhr.readyState !== 4)
		{
			image.src="https://pp.vk.me/c624221/v624221487/2bebc/766bkQ9NgnM.jpg";
			++flag;
			return;
        }
		if(xhr.status != 200) {
			image.src="https://pp.vk.me/c624221/v624221487/2bebc/766bkQ9NgnM.jpg";
			continueWithError('Error on the server side, response ' + xhr.status);
			++flag;
			return;
		}

		if(isError(xhr.responseText)) {
			image.src="https://pp.vk.me/c624221/v624221487/2bebc/766bkQ9NgnM.jpg";
			
			continueWithError('Error on the server side, response ' + xhr.responseText);
			++flag;
			return;
		}

		continueWith(xhr.responseText);
	};    

    xhr.ontimeout = function () {
		image.src="https://pp.vk.me/c624221/v624221487/2bebc/766bkQ9NgnM.jpg";
		++flag;
    	continueWithError('Server timed out !');
    }

    xhr.onerror = function (e) {
		image.src="https://pp.vk.me/c624221/v624221487/2bebc/766bkQ9NgnM.jpg";
			++flag;
    	var errMsg = 'Server connection error !\n'+
    	'\n' +
    	'Check if \n'+
    	'- server is active\n'+
    	'- server sends header "Access-Control-Allow-Origin:*"';

        continueWithError(errMsg);
    };

    xhr.send(data);
	if(flag==0)
	{
	    image.src="https://pp.vk.me/c624221/v624221487/2bec6/xx-inBV91h0.jpg";
		
	}
}

window.onerror = function(err) {	
}