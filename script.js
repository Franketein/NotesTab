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
    localStorage.setItem("num", notesNum);
    loadNotes();
    if (document.getElementsByClassName("active")[0] != null) {
        document.getElementsByClassName("active")[0].setAttribute("class", "");
    }
    document.getElementById(notesNum).setAttribute("class", "active");
    load(notesNum);
}

function erase(currNote) {
    //Don't allow for zero notes, clear text if there's only one left
    var notesNum = parseInt(localStorage.getItem("num"));
    if (notesNum == 1) {
        var area = document.getElementById("area");
        area.value = "";
        //Reacomodate index and delete erased note
        localStorage.removeItem('note'+currNote);
        save(1);
        return;
    }

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
    notesNum--;
    localStorage.setItem("num", notesNum);
    document.getElementById(currNote).remove();
    loadNotes();
    if (document.getElementById(notesNum+1) != null) {
        document.getElementById(notesNum+1).remove();
    }
    document.getElementById(1).setAttribute("class", "active");
    load(1);
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
            li.appendChild(document.createTextNode("NOTE " + name));
            li.setAttribute("id", name);
            li.onclick = function() {
                document.getElementsByClassName("active")[0].setAttribute("class", "");
                this.setAttribute('class', 'active');
                document.getElementById("erase").innerHTML = "ERASE (NOTE " + this.getAttribute('id') + ")"; 
                document.getElementById("erase").setAttribute('index', this.getAttribute('id'));
                load(this.getAttribute('id'));
            };
            ul.appendChild(li);
            i++;
        }
        if (document.getElementById("erase") != null) {
            document.getElementById("erase").remove();
        }
        var li = document.createElement("li");
        li.appendChild(document.createTextNode("ERASE (NOTE 1)"));
        li.setAttribute('id', "erase");
        li.setAttribute('index', 1);
        li.onclick = function() {
            erase(this.getAttribute('index'));
        };
        ul.appendChild(li);
    }
}


if (localStorage.getItem("num") <= 0) {
    localStorage.setItem("num", 1);
}

loadNotes();
document.getElementById("1").setAttribute("class", "active");
load(1);

var createButton = document.getElementById("create-note");
createButton.onclick = create;

var area = document.getElementById('area');
if (area.addEventListener) {
  area.addEventListener('input', function() {
    save(document.getElementsByClassName("active")[0].getAttribute('id'));
  }, false);
  // area.onkeyup = function(event) {
  //   var key = event.keyCode || event.charCode;
  //   if (key == "8" || key == "46") {
  //       save();
  //       alert("hola");
  //   }
  // };
}