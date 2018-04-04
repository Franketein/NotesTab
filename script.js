function check_web_storage_support() {
    if(typeof(Storage) !== "undefined") {
        return(true);
    }
    else {
        alert("Web storage unsupported!");
        return(false);
    }
}

function load(currNote) {
    if(check_web_storage_support() == true) {
        var name = "note" + currNote;
        // alert(name);
        var result = localStorage.getItem(name);
    }
    if(result === null) {
        // No note saved;
        document.getElementById('area').value = "";
    }
    else {
        document.getElementById('area').value = result;
    }
    var titleInput = document.getElementById("note-title");
    titleInput.value = localStorage.getItem("noteTitle" + currNote);
    var eraseInput = document.getElementById("erase");
    eraseInput.value = "Delete \"" + localStorage.getItem("noteTitle"+currNote) + "\"";
    eraseInput.setAttribute("index", currNote);
}

function save(currNote) {
    if(check_web_storage_support() == true) {
        var area = document.getElementById("area");
        var name = "note" + currNote;
        // alert(area.value);
        localStorage.setItem(name, area.value);
    }
}

function create() {
    var notesNum = parseInt(localStorage.getItem("num"))+1;
    var noteTitle = prompt("Note Title", "Note"+notesNum);
    if (noteTitle === null)
        return;
    if (noteTitle === "")
        noteTitle = "Note"+notesNum;
    localStorage.setItem("num", notesNum);
    localStorage.setItem("noteTitle"+notesNum, noteTitle);
    loadNotes();
    if (document.getElementsByClassName("active")[0] != null) {
        document.getElementsByClassName("active")[0].setAttribute("class", "");
    }
    document.getElementById(notesNum).setAttribute("class", "active");
    var titleInput = document.getElementById("note-title");
    titleInput.disabled = false;
    var eraseInput = document.getElementById("erase");
    eraseInput.value = "Delete \"" + noteTitle + "\"";
    eraseInput.setAttribute("index", notesNum);
    eraseInput.disabled = false;
    var area = document.getElementById("area");
    area.disabled = false;
    load(notesNum);
}

function erase(currNote) {
    var notesNum = parseInt(localStorage.getItem("num"));

    //Don't allow for zero notes, clear text if there's only one left
    // if (notesNum == 1) {
    //     var area = document.getElementById("area");
    //     area.value = "";
    //     //Reacomodate index and delete erased note
    //     localStorage.removeItem('note'+currNote);
    //     localStorage.removeItem('noteTitle'+currNote);
    //     var titleInput = document.getElementById("note-title");
    //     var newTitle = prompt("Note Title", "Note1");
    //     titleInput.value = newTitle;
    //     localStorage.setItem('noteTitle1', newTitle);
    //     save(1);
    //     return;
    // }

    //Reacomodate IDs if needed
    if (currNote != notesNum) {
        var i = parseInt(currNote)+1;
        while(i <= notesNum) {
            var noteText = localStorage.getItem("note"+i);
            if (noteText!==null)
                localStorage.setItem("note"+(i-1), noteText);
            else
                localStorage.setItem("note"+(i-1), "");
            i++;
        }
    }
    localStorage.removeItem("note"+notesNum);
    localStorage.removeItem("noteTitle"+notesNum);
    notesNum--;
    localStorage.setItem("num", notesNum);
    document.getElementById(currNote).remove();
    loadNotes();
    if (document.getElementById(notesNum+1) != null) {
        document.getElementById(notesNum+1).remove();
    }

    var eraseInput = document.getElementById("erase");
    //Set first note as active, if there is one
    if (document.getElementById(1) != null) {
        document.getElementById(1).setAttribute("class", "active");
        load(1);
    } else {
        var titleInput = document.getElementById("note-title");
        titleInput.disabled = true;
        eraseInput.disabled = true;
        var area = document.getElementById("area");
        area.value = "No Notes Found, Create One To Start";
        area.disabled = true;
    }
}

function loadNotes() {
    if (check_web_storage_support() == true) {
        var notesNum = parseInt(localStorage.getItem("num"));
        var ul = document.getElementById("notes-list");
        var i = 1;
        while (i <= notesNum) {
            var name = i;
            if (document.getElementById(name) != null) {
                document.getElementById(name).remove();
            }
            var li = document.createElement("li");
            var title = localStorage.getItem("noteTitle"+i);
            
            if (title != null) {
                //Load custom titles
                li.appendChild(document.createTextNode(title));
            }
            else {
                //Use Note1, Note2, Note3... names
                li.appendChild(document.createTextNode("NOTE " + name));
            }

            li.setAttribute("id", name);
            li.onclick = function() {
                document.getElementsByClassName("active")[0].setAttribute("class", "");
                this.setAttribute('class', 'active');

                var eraseText = "Delete \"" + localStorage.getItem("noteTitle"+this.getAttribute('id')) + "\"";
                document.getElementById("erase").value = eraseText; 
                document.getElementById("erase").setAttribute('index', this.getAttribute('id'));
                load(this.getAttribute('id'));
            };
            ul.appendChild(li);
            i++;
        }
        // if (document.getElementById("erase") != null) {
        //     document.getElementById("erase").remove();
        // }
        if (notesNum > 0) {
        //     var li = document.createElement("li");
        //     li.appendChild(document.createTextNode("ERASE (NOTE 1)"));
        //     li.setAttribute('id', "erase");
        //     li.setAttribute('index', 1);
        //     li.onclick = function() {
        //         erase(this.getAttribute('index'));
        //     };
        //     ul.appendChild(li);
        }
        else
        {
            localStorage.setItem("num", 0);
        }
    }
}


var totalNotes = localStorage.getItem("num");
var area = document.getElementById('area');
if (totalNotes <= 0) {
    // localStorage.setItem("num", 1);
    area.value = "No Notes Found, Create One To Start";
    area.disabled = true;
}

loadNotes();
if (totalNotes>0) {
    document.getElementById("1").setAttribute("class", "active");
    document.getElementById("erase").setAttribute("index", "1");
    load(1);
}

var createButton = document.getElementById("create-note");
createButton.onclick = create;

var menuButton = document.getElementById("menu-button");
menuButton.onclick = function() {
    var menu = document.getElementById("settings");
    if (menu.getAttribute("class") == "hidden") {
        area.style.width = "80%";
        menu.setAttribute("class", "");
    } else {
        area.style.width = "100%";
        menu.setAttribute("class", "hidden");
    }
};

var fontInput = document.getElementById("font-size");
if (fontInput.addEventListener) {
    fontInput.addEventListener('input', function() {
        if (parseInt(this.value) > 100)
            this.value = 100;
        area.style.fontSize=this.value+"px";
    }, false);
}
fontInput.dispatchEvent(new Event('input'));

var titleInput = document.getElementById("note-title");
if (titleInput.addEventListener) {
    titleInput.addEventListener('input', function() {
        if (document.getElementsByClassName("active")[0] != null) {
            var index = document.getElementsByClassName("active")[0].getAttribute("id");
            var activeNote = document.getElementsByClassName("active")[0];
            if (titleInput.value !== null && titleInput.value != "") {
                localStorage.setItem("noteTitle"+index, titleInput.value);
                while (activeNote.firstChild) {
                    activeNote.removeChild(activeNote.firstChild);
                }
                activeNote.appendChild(document.createTextNode(titleInput.value));
            } else {
                localStorage.setItem("noteTitle"+index, "Note"+index);
                while (activeNote.firstChild) {
                    activeNote.removeChild(myNode.firstChild);
                }
                activeNote.appendChild(document.createTextNode("Note"+index));
            }
        } else {
            titleInput.disabled = true;
        }
    }, false);
}
titleInput.dispatchEvent(new Event('input'));

var deleteInput = document.getElementById("erase");
deleteInput.value = "Delete \"" + titleInput.value + "\"";
if (deleteInput.addEventListener) {
    deleteInput.addEventListener('click', function() {
        erase(this.getAttribute("index"));
    }, false);
}

if (totalNotes <= 0)
    deleteInput.disabled = true;
else
    deleteInput.disabled = false;

if (area.addEventListener) {
  area.addEventListener('input', function() {
    save(document.getElementsByClassName("active")[0].getAttribute('id'));
  }, false);
}