class ChatUI {
    constructor(ul) {
        this.lista = ul;
    }

    set list(ul) {
        this._lista = ul;
    }
    get list() {
        return this._lista;
    }

    timeFormat(doc) {
        let date = new Date();
        let Day = date.getDate();
        let Month = date.getMonth() + 1;
        let Year = date.getFullYear();

        let day = doc.getDate();
        let month = doc.getMonth() + 1;
        let year = doc.getFullYear();
        let hour = doc.getHours();
        let minutes = doc.getMinutes();

        day = String(day).padStart(2, "0");
        month = String(month).padStart(2, "0")
        hour = String(hour).padStart(2, "0");
        minutes = String(minutes).padStart(2, "0");

        if(Day == day && Month == month && Year == year) {
            return `${hour}:${minutes}`;
        }
        else {
            return `${day}.${month}.${year} ${hour}:${minutes}`;
        }
    }

    checkUser() {
        this.lista.querySelectorAll("li").forEach(item => {
            if(item.querySelector("span").innerHTML == localStorage.getItem("novoKorisnicko")) {
                item.setAttribute('class', 'current_user');
            }
            else {
                item.setAttribute('class', 'other_user');
            }
        })
    }

    templateLI(doc) {
        let id = doc.id;
        let data = doc.data();
        let d = data.created_at.toDate();
        let lItem = 
        `
        <li id="${id}">
            <span style="font-weight: bold;">${data.username}</span> : <span>${data.message}</span>
            <br>
            <span style="color:grey;">${this.timeFormat(d)}</span>
            <img src="slike/trash.png">
        </li>
        `;

        this.lista.innerHTML += lItem;
        this.checkUser();
    }

    clear() {
        this.lista.innerHTML = "";
    }
}

export default ChatUI;