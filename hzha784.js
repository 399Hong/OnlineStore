let nameG = ""
let pwG = ""
const pageChanger = (section) => {
    const allSection = ["Home", "Products", "Location", "News", "GuestBook", "Register"]


    for (let i = 0; i < allSection.length; i++) {



        if (allSection[i] == section) {

            document.getElementById(allSection[i]).style.display = "block";
            let cur = document.getElementById(section + "Bar");
            cur.style.background = "white";

        } else {
            document.getElementById(allSection[i]).style.display = "none";
            let cur = document.getElementById(allSection[i] + "Bar");
            cur.style.background = "rgb(175, 211, 238)";

        }

    }

}

const requestLocation = (url) => {


    const fetchPromise = fetch(url);
    const streamPromise = fetchPromise.then((response) => response.text());
    //split at newline


    streamPromise.then((data) => {
        txt = data.split("\n");
        for (let i = 0; i < txt.length; i++) {
            temp = txt[i].split(":");
            // console.log(temp);
            // phone number part
            if (temp[0].split(";")[0] === "TEL") {
                const phoneSpan = document.getElementById("insertPhone");

                const phone = "&#128222 " + "<a href=" + "\"tel:" + temp[1] + "\"" + ">" + temp[1] + "</a>";



                phoneSpan.innerHTML = phone;



            } else if (temp[0].split(";")[0] === "EMAIL") {

                const ADRSpan = document.getElementById("insertEmail");

                const ADR = "&#128231 " + "<a href=" + "\"mailto:" + temp[1] + "\"" + ">" + temp[1] + "</a>";
                ADRSpan.innerHTML = ADR;


            } else if (temp[0].split(";")[0] === "ADR") {
                let str = ""


                temp[1].split(";").forEach((item) => str = str + item);

                const ADRSpan = document.getElementById("insertAdd");

                const ADR = "&#127968 " + "<span>" + str + "</span>";
                ADRSpan.innerHTML = ADR;
            }


        }









    });



}
const requestItem = (url, txt) => {
    const fetchPromise = fetch(url,
        {
            headers: {
                "Accept": "application/json"
            }

        });
    const streamPromise = fetchPromise.then((response) => response.json());
    streamPromise.then((data) => {
        const hr = "<hr style=\"width: 100%;\"></hr>";
        let str = "<h1 style= \"display:inline\">Products</h1>" +
            '<div class="searchBar"><input type="text" placeholder="' + txt + '" id = "inputBox"><button type="submit" onclick="search()">&#x1f50d</button></div>' + hr;

        
        //data[i].ItemId
       
        const products = document.getElementById("Products");
        if (data.length > 0) {
            for (i = 0; i < data.length; i++) {
                let id = data[i].ItemId;
                str = str + '<div class="item"><div class =\"image\">';
                //image
                str = str + '<img src=\"http://localhost:8188/DairyService.svc/itemimg?id=' + id + '\"width=\"70%\"></img>' + "</div>" + "<div class =\"txtBox\">";
                //txt
                str = str + "<li style=\"font-size:20px\">" + data[i].Title + "</li>" + "<br>"
                    + "<li>" + "Type:&nbsp&nbsp&nbsp" + data[i].Type + "</li>"
                    + "<li>" + "Origin:&nbsp" + data[i].Origin + "</li>"
                    + "<li>" + "Price:&nbsp&nbsp&nbsp$" + data[i].Price + "</li>"
                    //TBC
                    + "<li>" + "<button class='buyBtn' onclick='buyItem(" + id + ")' >BUY NOW</button></li>"
                    + "</div><hr></div>";





            }

        } else {
            str = str + '<p style="font-size:30px"><em>Oooooppps! You found nothing here. Try a different keyword?</em></p>'
        }
        products.innerHTML = str;


    });

}

const search = () => {
    const txt = document.getElementById("inputBox").value;
    requestItem("http://localhost:8188/DairyService.svc/search?term=" + txt, txt);
}
const submitComment = () => {

    let comment = document.getElementById("comment").value;
    let name = document.getElementById("name").value;


    fetch("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/comment?name=" + name, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
    });
    alert("Thank you, " + name + ". Hope to see you soon!");
    document.getElementById("frame").src = document.getElementById("frame").src;

}
const requestNews = (url) => {

    const news = document.getElementById("News");
    let str = "<h1>News</h1>";
    const fetchPromise = fetch(url,
        {
            headers: {
                "Accept": "application/json"
            }

        });
    const streamPromise = fetchPromise.then((response) => response.json());
    streamPromise.then((data) => {

        for (let i = 0; i < data.length; i++) {
            str = str + "<hr style=\"width: 100%;\"></hr>";//rule
            str = str + '<div class="article"><a href = \"' + data[i].linkField + '\" ><img src=\"' + data[i].enclosureField.urlField + '\" alt="Image Not Found" width="30%" height="20%" ><div class="articleItem"><span class="articleDate">' + data[i].pubDateField + '</span><h3>' + data[i].titleField + '</h3><p class = "desc">' + data[i].descriptionField + '</p></span></div></a></div > ';


        }
        news.innerHTML = str;
    }








    );


    /*
        <h1>News</h1>
        <div class="article">
            <a href="newslink">
                <img src="newsimage" alt="Dunedin Dairy" width="30%"
                    height="20%">
                <div class="articleItem">
                    <span class="date">data
                        <span>author</span>
                    </span>
                    <h3>titile</h3>
                </div>
            </a>
        </div>
    */
}

//html wasnt load but why the example works?
window.onload = function () {
    pageChanger("Home");
    requestLocation("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/vcard");
    requestItem("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/items", "Search...");
    requestNews("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/news");

}

// registration
function register() {
    //alert("lol")
    let form = document.getElementById("registration");
    let add = document.getElementById("invalid");
    let invalidInfo = ""


    let url = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/register"


    //password check
    if (form.password.value != form.password2.value) {
        invalidInfo += "<p>*Your password does not match</p>"
        add.innerHTML = invalidInfo
    } else {
        add.innerHTML = ""
        let toPost = '{"Address":"' + form.email.value + '","Name":"' + form.userName.value + '","Password":"' + form.password.value + '"}'
        //test = '{"Address":"String content","Name":"String content","Password":"String content"}'




        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: toPost,



        }).then(r => r.json()).then(v => {
            // registration check
            let v2 = v.split(" ");
            console.log(v2[v2.length - 1])
            if (v2[v2.length - 1] == "registered") {
                document.getElementById("sucessfullMessage").style.display = "block"
                let b = document.getElementById("sucessfullMessage")
                b.style.display = "block"
                b.firstElementChild.innerHTML = "Registered successfully"
                b.style.background = "#4CAF50"
                /*
                let loginB=document.getElementById("loginButton")
                loginB.innerHTML="LOGOUT"
                loginB.style.background="red"
                nameG=form.userName.value
                pwG =form.password.value
                pageChanger("Products");
                document.getElementById("Register").style.display="none"
                document.getElementById("RegisterBar").style.display="none"
                */

            } else if (v == "Username not available") {
                invalidInfo += "<p>*Username not available</p>"
                add.innerHTML = invalidInfo
                let b = document.getElementById("sucessfullMessage")
                b.style.display = "block"
                b.firstElementChild.innerHTML = "Registration Failed"
                b.style.background = "red"

            } else {

                let b = document.getElementById("sucessfullMessage")
                b.style.display = "block"
                b.firstElementChild.innerHTML = "Registration Failed"
                b.style.background = "red"


            }
        })
    }


}

function buyItem(id) {


    if (nameG != "") {
        let url = "http://localhost:8189/Service.svc/buy?id=" + id;
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true, nameG, pwG);
        xhr.withCredentials = true;

        xhr.onload = () => {

            if (xhr.status == 200) {

                alert("Your purchase was successful!!")

            } else{

                if(confirm("Purchase failed. Do you want to try again?")){
                    buyItem(id)

                }
            }

        }


        xhr.send(null);



    } else {
        //no name and pw saved
        pageChanger("Register")

        loginRegister("login")

    }
}

function loginRegister(section) {
    if (section == "registration") {
        document.getElementById("registration").style.display = "block";
        document.getElementById("login").style.display = "none";


    } else if (section == "login") {
        pageChanger("Register")
        document.getElementById("registration").style.display = "none";
        document.getElementById("login").style.display = "block";

    }

}

// login in button
function toLogin() {
    let button = document.getElementById("loginButton");

    if (button.innerHTML == "LOGOUT") {

        button.innerHTML = "LOG IN"
        button.style.background = "#4CAF50"
        document.getElementById("Register").style.display = "block"
        document.getElementById("RegisterBar").style.display = "block"
        loginRegister("login")
        nameG = ""
        pwG = ""
    } else {
        pageChanger("Register")

        loginRegister("login")

    }




}
function login() {


    let url = "http://localhost:8189/Service.svc/user"

    let form = document.getElementById("login");
    nameG = form.userNameLogin.value
    pwG = form.passwordLogin.value
    let m = document.getElementById("loginlMessage")

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true, nameG, pwG);
    xhr.withCredentials = true;
    xhr.onload = () => {

        if (xhr.status == 200) {

            let loginB = document.getElementById("loginButton")
            loginB.innerHTML = "LOGOUT"
            loginB.style.background = "red"

            pageChanger("Products");
            document.getElementById("Register").style.display = "none"
            document.getElementById("RegisterBar").style.display = "none"
            m.style.display = "none"

        } else {
            nameG = ""
            pwG = ""

            m.style.display = "block"
            m.firstElementChild.innerHTML = "Login failed"


        }

    }
    xhr.send(null);

}