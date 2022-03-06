class Chatroom {

    ////// konstruktor

    constructor(r, un) {
        this.room = r;
        this.username = un;
        this.chats = db.collection('chats');
        this.unsub = false; // odredili smo da je false kao signal da je stranica prvi put ucitana
    }

    ////// geteri i seteri

    set room(r) {
        this._room = r;
    }
    get room() {
        return this._room;
    }

    set username(un) {
        let name = un
        if((name.length >= 2) && (name.length <= 10) && ((name != "") && (name.trim().length != 0))) {
            this._username = name;
        }
        else {
            alert("Korisnicko ime nije validno");
        }
    }
    get username() {
        return this._username;
    }

    ////// metode

    changeUsername(un) {
        let name = un;
        if((name.length >= 2) && (name.length <= 10) && ((name != "") && (name.trim().length != 0))) {
            this.username = name;
            localStorage.setItem("novoKorisnicko", name);
            let formDiv = document.getElementById('forma');
            let par = document.createElement('p');
            par.innerHTML = name;
            formDiv.appendChild(par);

            if(par.style.display = "block") {
                setTimeout(() => {
                    formDiv.removeChild(par);
                }, 1000*3);
            }
        }
        else {
            alert("Korisnicko ime nije validno");
        }
    }

    // Updejtovanje sobe
    roomUpdate(r) {
        this.room = r;
        if(this.unsub != false) { // signal da unsub vise nije false nego je u getChats postalo funkcija
            this.unsub(); // unsub je sada funkcija i pozivam je sa zagradama
        } 
    }

    // Dodavanje nove poruke
    async addChat(msg) {

        let date = new Date();

        let chatObj = {
            message: msg,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(date)
        };

        let response = await this.chats.add(chatObj);
        return response;
    }

    // Brisanje poruke

    removeChat(id) {
        this.chats
        .doc(id)
        .delete()
        .then(() => {
            alert("Success");
        })
        .catch(() => {
            alert("Failure");
        });
    }

    getChats(callback) {
        this.unsub = this.chats
        .where("room", "==", this.room)
        .orderBy("created_at", "asc")
        .onSnapshot( snapshot => {
            snapshot.docChanges().forEach(change => {
                if(change.type == "added") {
                    callback(change.doc);
                }
            });
        });
    }
}



export default Chatroom;