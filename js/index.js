//firebase configuration

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyA13F2uWaQlse8uHChUC4K2arK_QDDhuM8",
    authDomain: "restaurant-website-ae91d.firebaseapp.com",
    projectId: "restaurant-website-ae91d",
    storageBucket: "restaurant-website-ae91d.appspot.com",
    messagingSenderId: "474473652162",
    appId: "1:474473652162:web:04a04fae0e0a07bad4005b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//------------------get loginpage---------------------------
var loginpage = document.getElementById('login-page');
var commenttext = document.getElementById('commenttext');

//---------------- onstate change firebase---------------------------
var loginbtn = document.getElementById('loginbtn');
var logoutbtn = document.getElementById('signoutbtn');
var username = document.getElementById('useremail');


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        var user = firebase.auth().currentUser;
        var email = user.email;
        loginbtn.style.display="none"
        logoutbtn.style.display="block";
        username.style.display="block";
        username.innerHTML=email;
        
    } else {
        loginbtn.style.display = "block"
        logoutbtn.style.display = "none";
        username.style.display = "none";
    }
});

//--------------------- regester user using email and password--------------------------

var loginbutton = document.getElementById('loginbutton');
var registerbutton = document.getElementById('registerbutton');
var signoutbutton = document.getElementById('signoutbtn');


registerbutton.addEventListener('click',()=>{
    var useremail = document.getElementById('useremailid').value;
    var userpassword = document.getElementById('userpassword').value;

    registerbutton.innerHTML="please wait...";
    firebase.auth().createUserWithEmailAndPassword(useremail, userpassword)
        .then((userCredential) => {
            // Signed in 
            var user = firebase.auth().currentUser;
            var email = user.email;
            var useruid = user.uid;
            //get user email
            username.innerHTML= email;
            // commment popup
            swal("Successfully Register", "", "success");
            // hide login page
            loginpage.style.visibility="hidden";
            showCurrentUserProfile()

            //hide login button and display signout button and useremail
            loginbtn.style.display = "none"
            logoutbtn.style.display = "block";
            username.style.display = "block";

            //reset the button value
            registerbutton.innerHTML = "Register";

            //send data to database
            firebase.database().ref("User_credentails/"+ useruid).set({
                "useremail": useremail,
                "userpassword": userpassword
            })
            
            //null the email and password value
            useremail.innerHTML = " ";
            userpassword.innerHTML = " ";

        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            registerbutton.innerHTML = "Register";
            // commment popup
            swal(errorMessage, "", "error");

            // ..
        });

})

//--------------------- login user using email and password--------------------------

loginbutton.addEventListener('click',()=>{
    var useremail = document.getElementById('useremailid').value;
    var userpassword = document.getElementById('userpassword').value;

    loginbutton.innerHTML="Please wait...";
    firebase.auth().signInWithEmailAndPassword(useremail, userpassword)
        .then((userCredential) => {
            // Signed in
            var user = firebase.auth().currentUser;
            var email = user.email;
            //get user email
            username.innerHTML = email;
            //comment area
            swal("Successfully Login", "", "success");

            // hide login page
            loginpage.style.visibility = "hidden";

            // hide login button and display signout button and useremail
            loginbtn.style.display = "none"
            logoutbtn.style.display = "block";
            username.style.display = "block";

            loginbutton.innerHTML = "Login";

            //null the email and password value
            useremail.innerHTML=" ";
            userpassword.innerHTML=" ";
            
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;

            swal(errorMessage, "", "error");

            loginbutton.innerHTML = "Login";
        });
})

//--------------------------- signout function--------------------------
signoutbutton.addEventListener('click', ()=>{
    firebase.auth().signOut()
        .then(function () {
            // Sign-out successfully
            loginbtn.style.display = "block"
            logoutbtn.style.display = "none";
            username.style.display = "none";

            commenttext.innerHTML = " ";

            //null the login page input feild
            document.getElementById('useremailid').value="";
            document.getElementById('userpassword').value="";

        }).catch(function (error) {
            // An error happened.

            alert(errorMessage);
        });
})


//------------------ function for showing login page-------------------------------
function showloginpage(){
    loginpage.style.visibility="visible";
}


// ------------------function for hiding login page------------------------------
var canclebtn = document.getElementById('canclebtn');
canclebtn.addEventListener('click',()=>{
    loginpage.style.visibility = "hidden";
})


//function for getting profile panel 
var profilePane = document.getElementById('currentUserProfile');
var profileCancelButton = document.getElementById('profileCancelButton');
function showCurrentUserProfile(){
    hidenav()
    profilePane.style.visibility="visible"
}
profileCancelButton.addEventListener('click',()=>{
    profilePane.style.visibility = "hidden"
})


//function for save user profile details
var currentUserButton = document.getElementById('currentUserButton');
currentUserButton.addEventListener('click',sendUserData)

function sendUserData(){
    var user = firebase.auth().currentUser;
    var userUid = user.uid;

    var username = document.getElementById('currentUserName').value
    var usernumber = document.getElementById('currentUserNumber').value
    var useremail = user.email
    var useraddress = document.getElementById('CurrentUserAddress').value
    var userpincode = document.getElementById('currentUserPincode').value

    firebase.database().ref("UserInformation/").child(userUid).get().then((snapshot)=>{
        if (snapshot.exists()) {

            document.getElementById('currentUserName').value = snapshot.val().currentusername;
            document.getElementById('currentUserNumber').value = snapshot.val().currentusernumber;
            document.getElementById('CurrentUserEmail').value = snapshot.val().currentuseremail;
            document.getElementById('CurrentUserAddress').value = snapshot.val().currentuseraddress;
            document.getElementById('currentUserPincode').value = snapshot.val().currentuserpincode;

        } else {
            if (username != "" && usernumber != "" && useremail != "" && useraddress != "" && userpincode != "") {
                firebase.database().ref("UserInformation/" + userUid).set({
                    "currentusername": username,
                    "currentuseremail": useremail,
                    "currentusernumber": usernumber,
                    "currentuseraddress": useraddress,
                    "currentuserpincode": userpincode
                })

                swal("Good job Profile Updated!", "", "success");
            }
            else {
                swal("Fill All The Details", "", "error");
            }
            
        }
    })

}

//------------------tabs script-----------------------------------------------

function openPage(pageName, elmnt, color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.backgroundColor = color;
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();





//----------------SEND RESERVATION TABLE DETAILS TO DATABASE-------------------------------------------------------

var submitbutton = document.getElementById('submittable');
var commenttexttable = document.getElementById('commenttexttable');
submitbutton.addEventListener('click',()=>{
    var user = firebase.auth().currentUser;
    if(user!=null){
        //fetch input data from user
        var getname = document.getElementById('getname').value;
        var getemail = document.getElementById('getemail').value;
        var getnumber = document.getElementById('getnumber').value;
        var getdate = document.getElementById('getdate').value;
        var gettime = document.getElementById('gettime').value;
        var getperson = document.getElementById('getperson').value;
        

        // check all the input field are filled
        if (getname != "" && getemail != "" && getnumber != "" && getdate != "" && gettime != "" && getperson != "") {

            firebase.database().ref("Reservation_details").push().set({
                "name": getname,
                "email": getemail,
                "number": getnumber,
                "date": getdate,
                "time": gettime,
                "person": getperson
            })

            document.getElementById('getname').value = "";
            document.getElementById('getemail').value = " ";
            document.getElementById('getnumber').value = " ";
            document.getElementById('getdate').value = " ";
            document.getElementById('gettime').value = " ";
            document.getElementById('getperson').value = " ";

            swal("Table Booked ", "", "success");
        }
        else {
            swal("Enter All Details ", "", "error");
        }
    }
    else {
        commenttexttable.innerHTML = "First Login To Reserve Table";
    }

    
})


//menu hamburger 

var hamburger = document.getElementById('hamburger')
var menucrossbtn = document.getElementById('menucrossbtn');
var right_content = document.getElementById('right_content');
hamburger.addEventListener('click', () => {
    right_content.style.visibility = "visible";
})
function hidenav(){
    right_content.style.visibility = "hidden";
}

//show add to cart section
var AtcIcon = document.getElementById('atcIcon');
var Addtocart = document.getElementById('Addtocart');

AtcIcon.addEventListener('click',()=>{
    Addtocart.style.top="0"
})
function hidecartpanal(){
    Addtocart.style.top = "-100%"
}

//-------------------GET MENU DATA FROM FIREBASE SCRIPT HERE---------------------------------------------------------------------------

//-----FETCH MENU DATA FROM DATABASE-------------------------------------------

    //FETCH ALL MENU DATA FROM DATABASE-----------------
    firebase.database().ref("menuItem/all").on("child_added", function (snapshot) {
        var productImageSrc = snapshot.val().productImageSrc;
        var productName = snapshot.val().productName;
        var productPrice = snapshot.val().productPrice;

        var html = ""

        html += "<div class='menu-item'>"

        html += "<img class='itemImageSrc' src='"
        html += productImageSrc
        html += "'>"

        html += "<p class='itemNameTag'>"
        html += productName
        html += "</p>"

        html += "<p class='itemPriceTag'>"
        html += productPrice
        html += "</p>"

        html += "<a class='addToCartButton'>Add <i class='fas fa-plus'></i></a>"

        html += "</div>"

        document.getElementById('allMenuRowsContent').innerHTML += html

        var addToCartButtons = document.getElementsByClassName('addToCartButton')
        for (var i = 0; i < addToCartButtons.length; i++) {
            var button = addToCartButtons[i]
            button.addEventListener('click', addToCartClicked)
        }
    })

    //FETCH STARTER MENU DATA FROM DATABASE-----------------
    firebase.database().ref("menuItem/starter").on("child_added", function (snapshot) {
        var productImageSrc = snapshot.val().productImageSrc;
        var productName = snapshot.val().productName;
        var productPrice = snapshot.val().productPrice;

        var html = ""

        html += "<div class='menu-item'>"

        html += "<img class='itemImageSrc' src='"
        html += productImageSrc
        html += "'>"

        html += "<p class='itemNameTag'>"
        html += productName
        html += "</p>"

        html += "<p class='itemPriceTag'>"
        html += productPrice
        html += "</p>"

        html += "<a class='addToCartButton'>Add <i class='fas fa-plus'></i></a>"

        html += "</div>"

        document.getElementById('StarterRowsContent').innerHTML += html

        //ALIVE ADD TO CART BUTTON
        var addToCartButtons = document.getElementsByClassName('addToCartButton')
        for (var i = 0; i < addToCartButtons.length; i++) {
            var button = addToCartButtons[i]
            button.addEventListener('click', addToCartClicked)
        }
    });

    //FETCH MAIN COURSE MENU DATA FROM DATABASE-----------------
    firebase.database().ref("menuItem/mainCourse").on("child_added", function (snapshot) {
        var productImageSrc = snapshot.val().productImageSrc;
        var productName = snapshot.val().productName;
        var productPrice = snapshot.val().productPrice;

        var html = ""

        html += "<div class='menu-item'>"

        html += "<img class='itemImageSrc' src='"
        html += productImageSrc
        html += "'>"

        html += "<p class='itemNameTag'>"
        html += productName
        html += "</p>"

        html += "<p class='itemPriceTag'>"
        html += productPrice
        html += "</p>"

        html += "<a class='addToCartButton'>Add <i class='fas fa-plus'></i></a>"

        html += "</div>"

        document.getElementById('MainCourseRowsContent').innerHTML += html

        //ALIVE ADD TO CART BUTTON
        var addToCartButtons = document.getElementsByClassName('addToCartButton')
        for (var i = 0; i < addToCartButtons.length; i++) {
            var button = addToCartButtons[i]
            button.addEventListener('click', addToCartClicked)
        }
    });

    //FETCH DESSERTS MENU DATA FROM DATABASE-----------------
    firebase.database().ref("menuItem/desserts").on("child_added", function (snapshot) {
        var productImageSrc = snapshot.val().productImageSrc;
        var productName = snapshot.val().productName;
        var productPrice = snapshot.val().productPrice;

        var html = ""

        html += "<div class='menu-item'>"

        html += "<img class='itemImageSrc' src='"
        html += productImageSrc
        html += "'>"

        html += "<p class='itemNameTag'>"
        html += productName
        html += "</p>"

        html += "<p class='itemPriceTag'>"
        html += productPrice
        html += "</p>"

        html += "<a class='addToCartButton'>Add <i class='fas fa-plus'></i></a>"

        html += "</div>"

        document.getElementById('DessertsRowsContent').innerHTML += html

        //ALIVE ADD TO CART BUTTON
        var addToCartButtons = document.getElementsByClassName('addToCartButton')
        for (var i = 0; i < addToCartButtons.length; i++) {
            var button = addToCartButtons[i]
            button.addEventListener('click', addToCartClicked)
        }
    });


// --------------------------------REMOVE TO CART AND ADD QUANTITY SCRIPT HERE------------------------------------------------------


if(document.readyState=='loading'){
    document.addEventListener('DOMContentLoaded',ready)
}
else{
    ready()
}
function ready(){
    
    //GET THE ACTUAL REMOVE BUTTON OF THE CURRENT PARENT
    var removerCartItemButton = document.getElementsByClassName('fa-trash-alt')
    for (var i = 0; i < removerCartItemButton.length; i++) {
        var button = removerCartItemButton[i]
        button.addEventListener('click', removeCartItem)
    }

    // GET THE CURRENT INPUT VALUE OF THE CURRENT PARENT
    var quantityInput = document.getElementsByClassName('productquantity')
    for (var i = 0; i < quantityInput.length; i++){
        var input = quantityInput[i]
        input.addEventListener('change',quantitychanged)
    }

    //GET THE ACTUAL ADD BUTTON OF THE CURRENT PARENT
    var addToCartButtons = document.getElementsByClassName('addToCartButton')
    for (var i = 0; i < addToCartButtons.length; i++){
        var button = addToCartButtons[i]
        button.addEventListener('click',addToCartClicked)
    }

    //GET THE PURCHASE BUTTON CLICK EVENT
    document.getElementsByClassName('PurchaseButton')[0].addEventListener('click',purchaseClicked)
}

// REMOVER ITEM FROM CART FUNCTION--------------------
function removeCartItem(event){
    var buttonclicked = event.target;
    buttonclicked.parentElement.parentElement.remove();
    updateCartTotal()
}

// QUANTIY CHNAGE TO UPDATE THE TOTAL AMOUNT FUNCTION--------------------
function quantitychanged(event){
    var input = event.target
    if(isNaN(input.value) ||input.value <=0){
        input.value= 1;
    }
    updateCartTotal()
}

// FIRSTLY UPDATE THE TOTAL CART AMOUNT---------------
updateCartTotal()

// UPDATE CART TOTAL FUNCTION--------------------
function updateCartTotal(){
    var cartItemContainer = document.getElementsByClassName('cartTableContent')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cartRows')
    var total = 0;
    //console.log(cartRows)
    for (var i = 0; i < cartRows.length; i++){
        var cartRow = cartRows[i]
        var priceElement = document.getElementsByClassName('priceElement')[i]
        var quantityElement = document.getElementsByClassName('productquantity')[i]
        var price = priceElement.innerText.replace('₹', '');
        var quantity = quantityElement.value;
        total = total + (price * quantity);
    }
    // total = Math.round(total*100)/100;
    document.getElementsByClassName('carttotalamount')[0].innerText ='₹'+total;
}



// ADD TO CART SCRIPT ---------------------------------------------------

    //CLICK ADD BUTTON TO GET CHILD DETAILS
    function addToCartClicked(event){
        var button =event.target;
        var shopItem = button.parentElement
        var imageSrc = shopItem.getElementsByClassName('itemImageSrc')[0].src
        var title = shopItem.getElementsByClassName('itemNameTag')[0].innerText
        var price = shopItem.getElementsByClassName('itemPriceTag')[0].innerText

        shopItem.getElementsByClassName('addToCartButton')[0].innerText="Added"
        //console.log(title,price,imageSrc)
        addItemToCart(title,price,imageSrc)
        updateCartTotal()
    }

    //FUNCTION TO ADD ITEM TO CART
    function addItemToCart( title, price , imageSrc){
        var cartRow = document.createElement('tr')
        cartRow.classList.add('cartRows')
        var cartItem = document.getElementsByClassName('cartTableContent')[0]
        var cartItemName = document.getElementsByClassName('itemName');

        for (var i = 0; i < cartItemName.length ; i++){
            if (cartItemName[i].innerText == title ){
                swal("Item Already Added","", "error");
                return
            }
        }
        var cartRowContent =`
            <tr class="cartRows">
                                <td class="itemName">${title}</td>
                                <td><span class="priceElement">${price}</span></td>
                                <td class="product_quantity"><input type="number" value="1" class="productquantity"><i class="fas fa-trash-alt"></i></td>

            </tr>
        `
        cartRow.innerHTML = cartRowContent
        cartItem.append(cartRow)
        //SET REMOVE BUTTON TO WORK AGAIN FOR NEW ITEM ADDED
        cartRow.getElementsByClassName('fa-trash-alt')[0].addEventListener('click',removeCartItem)

        //SET QUANTITY INPUT TO WORK AGAIN FOR NEW ITEM ADDED
        cartRow.getElementsByClassName('productquantity')[0].addEventListener('change', quantitychanged)

    }

//PURCHASE BUTTON FUNCTION
function purchaseClicked() {
    var user = firebase.auth().currentUser
    if(user!=null){
        var uid = user.uid
        var i = 0;
        var cartItem = document.getElementsByClassName('cartTableContent')[0]
        var totalOrderPrice = document.getElementsByClassName('carttotalamount')[0].innerText;
        while (cartItem.hasChildNodes()) {
            if (i < 5) {
                cartItem.removeChild(cartItem.firstChild)
                i++;
            }
            if (i < 5) {
                cartItem.removeChild(cartItem.firstChild)
                i++;
            }
            if (i < 5) {
                cartItem.removeChild(cartItem.firstChild)
                i++;
            }
            if (i < 5) {
                cartItem.removeChild(cartItem.firstChild)
                i++;
            }
            if (i < 5) {
                cartItem.removeChild(cartItem.firstChild)
                i++;
            }

            var productName = document.getElementsByClassName('itemName')[0].innerText
            var productPrice = document.getElementsByClassName('priceElement')[0].innerText
            var productQuantity = document.getElementsByClassName('productquantity')[0].value

            console.log(productName, productPrice, productQuantity)
            insertItemToDatabase(productName, productPrice, productQuantity)

            cartItem.removeChild(cartItem.firstChild)
        }
        var user = firebase.auth().currentUser;
        var useremail = user.email;
        var uid = user.uid
        firebase.database().ref("orderDetails/" + uid + "/userdetails").set({
            "userEmail": useremail,
            "userUid": uid
        })
        // console.log(totalOrderPrice)
        swal("Order Confirmed", "Thanks For Purchasing!", "success");
        updateCartTotal()

        location.reload()
       
    }
    else{
        swal("Please Login To Order", "", "info");
    }
    
}
//insert order data to database
function insertItemToDatabase(productName, productPrice, productQuantity){
    var user = firebase.auth().currentUser;
    var uid = user.uid;
    firebase.database().ref("orderDetails/" + uid +"/orders").push().set({
        "productName": productName,
        "productPrice": productPrice,
        "productQuantity": productQuantity
    })
}

// firebase.auth().signOut()
//----------------------------REMOVE TO CART AND ADD QUANTITY SCRIPT HERE----------------------------------------------------------
//
//
//
//..


