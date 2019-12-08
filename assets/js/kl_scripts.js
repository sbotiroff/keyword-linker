var newPages;
var isAttached = false;
var klInputValue;
window.onload = function () {
  var klKeywordSearch = document.getElementById('klKeywordSearch');
  klKeywordSearch.addEventListener('input', klSearchByKeyword);
  var klTableFooter = document.getElementById('klTableFooter');
  klTableFooter.innerHTML = "";

}

function klSearchByKeyword(evt) {
  newPages = [];
  var content;
  var id;
  var title;
  var url;
  if (evt.target.value != "") {
    for (var page in json) {
      id = json[page].ID;
      content = json[page].post_content;
      title = json[page].post_title;
      url = json[page].guid;
      if (json.hasOwnProperty(page)) {
        if (content.search(evt.target.value) != -1) {
          klInputValue = evt.target.value
          newPages.push({
            ID: id,
            post_content: content,
            post_title: title,
            guid: url
          });
        }
      }
    }
  } else {
    klTableBody.innerHTML = "";
  }
  klCreateTable();
}

function klCreateTable() {
  var klTableBody = document.getElementById('klTableBody');
  klTableBody.innerHTML = "";
  klTableFooter.innerHTML = "";
  if (newPages != undefined && newPages.length != 0) {
    for (var page in newPages) {
      var tbodyTr = document.createElement('tr');
      const pageTitle = newPages[page].post_title;
      const pageUrl = newPages[page].guid;
      var pageContent = newPages[page].post_content;
      var h1Count = (pageContent.match(/<h1/g) || []).length;
      var h2Count = (pageContent.match(/<h2/g) || []).length;
      var strongCount = (pageContent.match(/<strong/g) || []).length;
      pageContent = pageContent.replace(/<h1/g,'<h1 style="background-color:pink;"');
      pageContent = pageContent.replace(/<h2/g,'<h2 style="background-color:gray;color:white;"');
      pageContent = pageContent.replace(/<strong/g,'<strong style="background-color:black; color:white;"');
      pageContent = pageContent.replace(new RegExp(klInputValue,'g'),`<mark>${klInputValue}</mark>`);
      pageContent = pageContent.replace(/(\[.+\])/g, '<div class="pageSourceCode">$1</div>');
      var allTd = `
          <td>${pageTitle}</td>
          <td><a href="${pageUrl}">${pageTitle}</a></td>
          <td>
            <p style="background-color:pink;">h1 = ${h1Count+1}</p>
            <p style="background-color:gray; color:white;">h2 = ${h2Count}</p>
            <p style="background-color:black; color:white;">strong = ${strongCount}</p>
          </td>
          <td><button value="${newPages[page].ID}" onclick="showPageContent(this)">View ${pageTitle}</button>
              <div id="pageContent${newPages[page].ID}" class="kl-modal">
                <span onclick="hidePageContent(this.parentElement)" class="kl-close">&times;</span>
                <div class="kl-modal-content"><div style="display:block; border:2px solid gray; padding:10px;">
                  <p style="background-color:pink;">h1 tags are in pink background color</p>
                  <p style="background-color:gray;color:white;">h2 tags are in gray background color</p>
                  <p style="background-color:black; color:white;" >strong tags are in black background color</p>
                  <p><mark>keywords are in yellow background color</mark></p>
                  <p>Hide page source code 
                  <label class="switch">
                  <input type="checkbox" onclick="hidePageSourceCode(this)">
                  <span class="slider round"></span>
                  </label></p>
                  
                </div>
                <div style="border:2px solid gray; margin-top: 20px; padding: 5px;">
                  <h1>${pageTitle}</h1>
                  <div class ="klPageContent">${pageContent}</div>
                </div>
              </div>
              </div>
          </td>
          <td><button id="page${page}" value="${page}" onclick="onClickDeletePage(this)" >X</button></td>`;
      tbodyTr.innerHTML = allTd;
      klTableBody.appendChild(tbodyTr);
    }
    document.getElementById('klKeywordOutput').value = klInputValue;
  } else {
    document.getElementById('klKeywordOutput').value = "";
    klTableBody.innerHTML = "";
  }

}

function keywordReplacer(){
  var keyword = document.getElementById('klKeywordOutput').value;
  var replacerInput = document.getElementById('replacerInput').value;
  var keywordPosition = document.getElementById('keywordPosition').value;

  if(replacerInput !=""){
    if(keyword !="" && keyword !=" "){
      if(keywordPosition != ""){
        for (var page in newPages) {
          var link = `<a href="${replacerInput}">${keyword}</a>`;
          var pageContent = newPages[page].post_content;
          newPages[page].post_content = replaceOccurrence(
            pageContent,
            new RegExp(keyword,'g'),
            parseInt(keywordPosition),
            link);
          isAttached = true;
        }
        console.log(newPages);
        console.log(keywordPosition);
        console.log(replaceOccurrence(pageContent, new RegExp(keyword,'g'),keywordPosition,link));
        alert("Attached successfully");
      }else{
        alert("Please select position of the keyword!");
      }
      
      
    }else{
      alert("There is no such a keyword exists in your Website");
    }
  }else{
    alert("Insert your link!");
  }
 
}

function klUploadToTheDB(){
  if(isAttached){
    if(confirm("Make sure you attached correctly if not press cancel")){
      for(var page in newPages){
        jQuery.post(ajaxurl, {
          'action': 'klUploadTheContent',
          'id': newPages[page].ID,
          'content': newPages[page].post_content
        },
          function (msg) { jQuery(".isUploaded").html(msg); });
      }
    }else{
      newPages = [];
      document.getElementById('klKeywordSearch').value = "";
      document.getElementById('replacerInput').value = "";
      klCreateTable();

    }
   
  }else{
    alert("You have not attached any links yet");
  }
}

function hidePageSourceCode(checkbox){
  var pageSourceCode = document.getElementsByClassName("pageSourceCode");
  if(checkbox.checked == true){
    for(var i = 0; i <pageSourceCode.length; i++){
       pageSourceCode[i].style.display = "none"; 
  }
  }else{
    for(var i = 0; i <pageSourceCode.length; i++){
      pageSourceCode[i].style.display = "block";
 }
  }
}

function hidePageContent(event) {
  event.style.display = "none";
  var pageSourceCode = document.getElementsByClassName("pageSourceCode");
  var checkbox = document.querySelector('input[type="checkbox"]');
  checkbox.checked = false;
  for(var i = 0; i <pageSourceCode.length; i++){
    pageSourceCode[i].style.display = "block";
  }
}

function showPageContent(event) {
  var pageContent = document.getElementById(`pageContent${event.value}`);
  pageContent.style.display = "block";
}

function onClickDeletePage(event) {
  newPages.splice(event.value, 1);
  klCreateTable();
}

function replaceOccurrence(string, regex, n, replace){
  var i = 0;
  return string.replace(regex, function(match){
    i++;
    if(i===n) return replace;
    return match;
  });
}