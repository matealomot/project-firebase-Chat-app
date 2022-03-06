import Chatroom from "./chat.js";
import ChatUI from "./ui.js";

///// DOM elementi

let novaLista = document.querySelector('ul');
let dugmeSubmit = document.getElementById('SendBtn');
let dugmeUpdate = document.getElementById('UpdateBtn');
let dugmeColor = document.getElementById('ColorBtn');
let chatUser = document.getElementById('update');
let textMessage = document.getElementById('send');
let nav = document.querySelector('nav');
let colorPick = document.getElementById('boja');
let chatBox = document.getElementById('chat');
let boja = localStorage.getItem('promenaBoje');
let buttons = document.querySelectorAll('button');
let datumPrvi = document.getElementById('date1');
let datumDrugi = document.getElementById('date2');
let dugmeDatum = document.getElementById('DateBtn');

////// Funckije 

function changeUser() {
    if(localStorage.novoKorisnicko) {
        return localStorage.getItem('novoKorisnicko');
    }
    else {
        localStorage.setItem("novoKorisnicko", "annonymous")
        return "annonymous";
    }
}

function selectRoom() {
    if (localStorage.trenutnaSoba) {
        let trenutnaSoba = document.getElementById(localStorage.getItem("trenutnaSoba"));
        trenutnaSoba.style.backgroundColor = "rgb(26, 89, 100)";
        buttons.forEach(b => {
            if(b.id === trenutnaSoba.id) {
                b.style.backgroundColor = "rgb(26, 89, 100)";
            }
            else {
                b.style.backgroundColor = "rgb(23, 231, 186)";
            }
        });
    }
    else {
        document.getElementById("#general").style.backgroundColor = "rgb(26, 89, 100)";
    }
}

selectRoom();

///// DOM elementi - stilizacija

chatBox.style.backgroundColor = boja;

///// Objekti 

let noviChat = new ChatUI(novaLista);
let chat;

if(!localStorage.trenutnaSoba) {
    chat = new Chatroom('#general', changeUser());
}
else {
    chat = new Chatroom(localStorage.getItem("trenutnaSoba"), changeUser());
}

///// Ispsis dokumenata iz db na stranici

chat.getChats(c => {
    noviChat.templateLI(c);
    chatBox.scrollTop = chatBox.scrollHeight;
});

///// Submit dugme koje salje/ispisuje poruke 

dugmeSubmit.addEventListener('click', (e) => {
    e.preventDefault();

    let message = textMessage.value;
    textMessage.value = "";

    if(message != "") {
        chat.addChat(message)
        .then(() => {
            console.log("Uspesno poslata poruka");
            
        })
        .catch(err => {
            console.log(err);
        });
    }
    else {
        alert("Prazna poruka");
    }
});

////// Update koji menja korisnicko ime korisnika

dugmeUpdate.addEventListener('click', (e) => {
    e.preventDefault();
    
    let chatUsername = chatUser.value;
    chat.changeUsername(chatUsername);
    noviChat.checkUser();
    chatUser.value = "";
});

////// Menjanje sobe u kojoj se pise (general, js, homework ili tests)

nav.addEventListener('click', function(e) {
    if(e.target.tagName === "BUTTON") {
        localStorage.setItem("trenutnaSoba", e.target.id);
        selectRoom(e);
        noviChat.clear();
        chat.roomUpdate(e.target.id);
        chat.getChats(c => {
            noviChat.templateLI(c);
            chatBox.scrollTop = chatBox.scrollHeight;
        });
    }
});

////// Brisanje poruka klikom na ikonicu trashcan

novaLista.addEventListener('click', function(e) {
    let user = localStorage.getItem('novoKorisnicko')
    if(e.target.tagName === "IMG") {
        let ok = confirm("Da li zaista zelite da obrisete ovu poruku?");
        if(ok == true) {
            let item = e.target.parentElement;
            let id = e.target.parentElement.id;
            let userName = item.querySelector('span').innerHTML;
            if(user === userName) {
                novaLista.removeChild(item);
                chat.removeChat(id);
            }
            else {
                novaLista.removeChild(item);
            }
        }
    }
});

////// Promena boje Chat boxa

dugmeColor.addEventListener('click', function(e) {
    e.preventDefault();
    let color = colorPick.value;
    
    setTimeout(() => {
        chatBox.style.backgroundColor = color;
        chatBox.style.transition = "background 1.5s";
    }, 1000/2);

    localStorage.setItem("promenaBoje", color);
});

////// Filter poruka na osnovu odabranih datuma

dugmeDatum.addEventListener('click', function(e) {
    e.preventDefault();

    let startDate;
    let endDate;
    
    if(datumPrvi.value != 0 && datumDrugi.value != 0) {
        startDate = datumPrvi.value;
        endDate = datumDrugi.value;

        let timestamp1 = new Date(startDate);
        let timestamp2 = new Date(endDate);
        let timeStampStart = firebase.firestore.Timestamp.fromDate(timestamp1);
        let timeStampEnd = firebase.firestore.Timestamp.fromDate(timestamp2);
        
        db.collection('chats')
        .where("created_at", ">=", timeStampStart)
        .where("created_at", "<=", timeStampEnd)
        .get()
        .then(snapshot => {
            if(!snapshot.empty) {
                noviChat.clear();
                let taskDocuments = snapshot.docs;
                taskDocuments.forEach(data => {
                    noviChat.templateLI(data);
                })
            }
        })
        .catch(err => {
            console.log(err);
        });
    }
    else {
        alert("Morate uneti datum i vreme");
    }
});