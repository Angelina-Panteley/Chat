var index=-1;
function run(){

}
function changeLogin()
 {
      var text, text2;
	  text=document.getElementById("login").value;
	  if(text!=""){
	      text2="Welcome to SweetChat, "+text+"!";
	      document.getElementById("loginChanged").innerHTML=text2;
	  }
 }

  function addRow() {
          
   var myName = document.getElementById("mail");
   var table = document.getElementById("myTableData");
   if(document.getElementById('login').value=="")
{
	 document.getElementById('login').value="User";
}
 if(index<0)
    {      
   	 var rowCount = table.rows.length;
   	 var row = table.insertRow(rowCount);
	 row.insertCell(0).innerHTML= '<input class="button5" type="submit" value ="" onClick="Javacsript:deleteRow(this)" title="Удалить сообщение" style="background: url(https://pp.vk.me/c625319/v625319210/200a2/rdrQ1BSBNVw.jpg) center center no-repeat;"></input>';//<input type="button" value = "Delete" onClick="Javacsript:deleteRow(this)">';
  	 row.insertCell(1).innerHTML= '<input class="button5" onClick="Javacsript:editRow(this)" type="submit" title="Редактировать сообщение" value="" style="background: url(http://www.defaulticon.com/sites/default/files/styles/icon-front-page-32x32-preview/public/field/image/edit.png?itok=nb2eY85A) center center no-repeat;"></input>';//<input type="button" value = "Edit" onClick="Javacsript:editRow(this)">';
	 row.insertCell(2).innerHTML = document.getElementById('login').value+":";
 	 row.insertCell(3).innerHTML = myName.value;  
}
    if(index>-1)
    {
	table.deleteRow(index);   
	var row = table.insertRow(index);
	row.insertCell(0).innerHTML= '<input class="button5" type="submit" value ="" onClick="Javacsript:deleteRow(this)" title="Удалить сообщение" style="background: url(http://www.defaulticon.com/sites/default/files/styles/icon-front-page-32x32-preview/public/field/image/eraser.png?itok=ohy0hMWI) center center no-repeat;"></input>';//<input type="button" value = "Delete" onClick="Javacsript:deleteRow(this)">';
	row.insertCell(1).innerHTML= '<input class="button5" onClick="Javacsript:editRow(this)" type="submit" title="Редактировать выделенное сообщение" value="" style="background: url(http://www.defaulticon.com/sites/default/files/styles/icon-front-page-32x32-preview/public/field/image/edit.png?itok=nb2eY85A) center center no-repeat;"></input>';//<input type="button" value = "Edit" onClick="Javacsript:editRow(this)">';  
	row.insertCell(2).innerHTML = document.getElementById('login').value+":";
	row.insertCell(3).innerHTML = myName.value;
index=-1;
    }
 
 //var myMail = document.getElementById("mail");
 
 //var tableContent="<tr>";
 //tableContent+="<td width=60% valign='bottom'>"+'<p align="right"><input class="button5" type="submit" value ="" onClick="Javacsript:deleteRow(this)" title="Удалить сообщение" style="background: url(http://www.defaulticon.com/sites/default/files/styles/icon-front-page-32x32-preview/public/field/image/eraser.png?itok=ohy0hMWI) center center no-repeat;"></input><input class="button5" type="submit" title="Редактировать выделенное сообщение" value="" style="background: url(http://www.defaulticon.com/sites/default/files/styles/icon-front-page-32x32-preview/public/field/image/edit.png?itok=nb2eY85A) center center no-repeat;"></input></p>'+"</td>";
 //if(document.getElementById('login').value=="")
 //{
//	 document.getElementById('login').value="User";
 //}
// tableContent+="<td width=40% >"+"<font color='black' align='right' size=4px style='vertical-align:'top';'>"+"<b>"+document.getElementById('login').value+":"+"</b>"+"</font>"+"<br>"+myMail.value+"</td>";
// myTableData.innerHTML+=tableContent;
 document.getElementById('mail').value='';
}
 
function deleteRow(obj) {
      
    var index = obj.parentNode.parentNode.rowIndex;
    var table = document.getElementById("myTableData");
    table.deleteRow(index);
    
}
 function editRow(obj) {
    index = obj.parentNode.parentNode.rowIndex;
    var table = document.getElementById("myTableData");
    document.getElementById("mail").value=table.rows[index].cells[3].innerHTML;
}
function load() {
    //changeLogin();
    console.log("Page load finished");
    
}
