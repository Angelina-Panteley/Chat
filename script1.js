var UserName="";
var messageList = [];
function run1(){
	restore();
	document.getElementById("loginChanged").innerHTML="Welcome to SweetChat, "+UserName+"!";
	document.addEventListener('click', delegateEvent);
	var allMessages = restore() || [ ];

	createAllMessages(allMessages);
}
function changeLogin()
 {
      var text2;
	  UserName=document.getElementById("login").value;
	  if(UserName!=""){
	      text2="Welcome to SweetChat, "+UserName+"!";
	      document.getElementById("loginChanged").innerHTML=text2;
	  }
	  store(messageList);
 }
 function delegateEvent(evtObj) {
	if(evtObj.type === 'click'
		&& evtObj.target.classList.contains('button'))
		changeLogin();
	if(evtObj.type === 'click'
		&& evtObj.target.classList.contains('button6'))
		onAddButtonClick();
}
function createAllMessages(allMessages) {
	for(var i = 0; i < allMessages.length; i++)
		addMail(allMessages[i]);
}
function onAddButtonClick(){
	var mailText = document.getElementById('mailText');
	var newMessage = theMessage(mailText.value,localStorage.getItem("UserName"));

	if(mailText.value == '')
		return;

	addMail(newMessage);
	mailText.value = '';
	store(messageList);
} 
function addMail(task) {
	var item = createItem(task);
	var items = document.getElementsByClassName('items')[0];

	messageList.push(task);
	items.appendChild(item);
}

function createItem(task){
    var message = document.createElement('div');
	
	message.innerHTML = '<table><tr><td style="width:25%"><b>' + task.nickname + ':</b></td>                      <td width=70% style="word-wrap: break-word" onBlur="makeUneditable()">' + task.description + '</td>                      <td style="padding-left: 5px">                                            <img src="http://www.defaulticon.com/sites/default/files/styles/icon-front-page-32x32-preview/public/field/image/edit.png?itok=nb2eY85A" onClick="editMessage()" style="cursor: pointer"></img>                      <img src="http://www.defaulticon.com/sites/default/files/styles/icon-front-page-32x32-preview/public/field/image/eraser.png?itok=ohy0hMWI" onClick="deleteMessage()" style="cursor: pointer"</img>                      </td></tr></table>';
	
	return message.firstChild;
}

function store(listToSave) {
	if(typeof(Storage) == "undefined") {
		alert('localStorage is not accessible');
		return;
	}
	localStorage.setItem("UserName",UserName );
	localStorage.setItem("messageList", JSON.stringify(listToSave));
}
function restore() {
	var item = localStorage.getItem("messageList");
	UserName = localStorage.getItem("UserName");
	return item && JSON.parse(item);
}

var uniqueId = function() {
	var date = Date.now();
	var random = Math.random() * Math.random();

	return Math.floor(date * random).toString();
};

var theMessage = function(text, name) {
	return {
		description:text,
		nickname:name,
		id: uniqueId()
	};
};

