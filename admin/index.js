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


//----MANAGE USER DATA---------------------------------------------------------------

    //CREATING NEW USER WHEN ADD BUTTON CLICKED
    var addUserData = document.getElementById('addUserData')

    addUserData.addEventListener('click',()=>{
        var useremail = document.getElementById('inputemail').value
        var userpassword = document.getElementById('inputpassword').value
        var commenttext = document.getElementById('inputcommenttext');
        firebase.auth().createUserWithEmailAndPassword(useremail, userpassword)
            .then((userCredential) => {
                // Signed in 
                var user = firebase.auth().currentUser;
                var useruid = user.uid;
                // commment area
                swal("Successfully Added", "", "success");

                //send data to database
                firebase.database().ref("User_credentails/" + useruid).set({
                    "useremail": useremail,
                    "userpassword": userpassword
                })

                //reset the input value again
                document.getElementById('inputemail').value ="";
                document.getElementById('inputpassword').value="";

            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                // commment area
                swal(errorMessage, "", "error");
                // ..
            });

        
    })

    // FECTHING USER EMAIL AND PASSWORD FROM DATABASE------------------
    firebase.database().ref("User_credentails").on("child_added", function (snapshot) {
            var useremail = snapshot.val().useremail;
            var userpassword = snapshot.val().userpassword;
            
            var html =""

            html +="<tr>"

            html +="<td>"
            html+=useremail
            html +="</td>"

            html += "<td>"
            html += userpassword
            html += "</td>"

            html +="</tr>"

            document.getElementById('manageUserData').innerHTML +=html;
        });


//------MANAGE PRODUCT ITEM-------------------------------------------

    //INSERTING PRODUCT ITEM INTO DATABASE---------------
    var addProductButton = document.getElementById('addItemToMenuButton')
        addProductButton.addEventListener('click',()=>{
            var productImageSrc = document.getElementById('productImageSrc').value
            var productName = document.getElementById('productName').value
            var productPrice = document.getElementById('productPrice').value
            var prodcutCategory = document.getElementById('productCategory').value;

            var itemInputCommentText = document.getElementById('itemInputCommentText');

            if (productImageSrc !="" && productName != "" && productPrice!=""){
                firebase.database().ref("menuItem/" + prodcutCategory).push().set({
                    "productImageSrc": productImageSrc,
                    "productName": productName,
                    "productPrice": "₹" + productPrice,
                    "prodcutCategory": prodcutCategory
                })
                // commment area
                swal("Successfully Added", "", "success");
            }
            else{
                // commment area
                swal("Input The Required Value*", "", "error");
                
            }
        });

    //FETCHING PRODUCT ITEM FROM DATABASE
    function fetchMenuItem(productCategory){
        document.getElementById('productItemCategory').value = productCategory
        firebase.database().ref("menuItem/" + productCategory).on("child_added", function (snapshot) {
            var productImageSrc = snapshot.val().productImageSrc;
            var productName = snapshot.val().productName;
            var productPrice = snapshot.val().productPrice;
            var productItemCategory = snapshot.val().prodcutCategory;

            var html = ""

            html += "<tr>"

            html += "<td>"
            html += "<img src='"
            html += productImageSrc
            html += "'></td>"

            html += "<td>"
            html += productName
            html += "</td>"

            html += "<td>"
            html += productPrice
            html += "</td>"

            html += "<td>"
            html += productItemCategory
            html +="</td>"
            html += "</tr>"

            document.getElementById('menuItemProductList').innerHTML += html;

            
        })
    }

    //WHEN THE CATEGORY CHNAGED---------
    document.getElementById('productItemCategory').addEventListener('change',()=>{
        //get the category when category has been change
        const productCategoryClicked = document.getElementById('productItemCategory').value

        //clear previous data in the inner html of product list content
        document.getElementById('menuItemProductList').innerHTML = "";

        //fetch the product
        fetchMenuItem(productCategoryClicked)
    })


//------MANAGE RESERVE TABLE ---------------------------------------

    //FETCHING DATA FROM DATABASE-----------
    firebase.database().ref("Reservation_details").on("child_added", function (snapshot) {
        var html = "";

        html += "<div class='model'>"

        html += "<p>"
        html += "Name: "+snapshot.val().name;
        html += "</p>"

        html += "<p>";
        html += "Email: " +snapshot.val().email;
        html += "</p>";

        html += "<p>";
        html += "Number: " +snapshot.val().number;
        html += "</p>";

        html += "<p>";
        html += "Date: " +snapshot.val().date;
        html += "</p>";

        html += "<p>";
        html += "Time: " +snapshot.val().time;
        html += "</p>";

        html += "<p>";
        html += "Person: " +snapshot.val().person;
        html += "</p>";

        html += "</div>"

        document.getElementById("reservetable").innerHTML += html;
    });


//------MANAGE ORDER DETAILS---------------------------------------

    //FETCH ORDERS DETAILS FROM DATABASE
fetchOrderDetails()
function fetchOrderDetails() {

    firebase.database().ref("orderDetails").on('child_added',(data)=>{
        var datakey = data.key;
        //console.log(datakey)
        var html=""
        html +="<table id='manageOrderInformations'>"
        fetchuserinformation(datakey)
        html += "</table>"
        document.getElementById('orderInformations').innerHTML+=html;
        // firebase.database().ref("orderDetails/" + datakey + "/userdetails").on('value', (snapshot) => {
        //     var personEmail = snapshot.val().userEmail
        //     var personuid = snapshot.val().userUid
        //     console.log(personEmail, personuid)
        // });

        
        
    });
    
    function fetchuserinformation(datakey){
        firebase.database().ref("UserInformation/" + datakey).on('value', (snapshot) => {
            var currentuseraddress = snapshot.val().currentuseraddress
            var currentuseremail = snapshot.val().currentuseremail
            var currentusername = snapshot.val().currentusername
            var currentusernumber = snapshot.val().currentusernumber
            var currentuserpincode = snapshot.val().currentuserpincode

            //console.log(currentuseremail, currentusername, currentusernumber, currentuserpincode, currentuseraddress)
            
            var html = ""

            html += "<tbody style='background-color: #db2d01;'>"

            html += "<tr>"

            html += "<td>"
            html += currentusername
            html += "</td>"

            html += "<td>"
            html += currentuseremail
            html += "</td>"

            html += "<td>"
            html += currentuseraddress
            html += "</td>"

            html += "<td>"
            html += currentusernumber
            html += "</td>"

            html += "<td>"
            html += currentuserpincode
            html += "</td>"

            html += "</tr>"

            html += "</tbody>"

            document.getElementById('manageOrderInformations').innerHTML+=html;


            fetchuserorder(datakey);
        });
    }

    function fetchuserorder(datakey) {
        firebase.database().ref("orderDetails/" + datakey + "/orders").on('child_added', (snapshot) => {
            var orderProductName = snapshot.val().productName
            var orderProductPrice = snapshot.val().productPrice
            var orderProductQuantity = snapshot.val().productQuantity

            var totalprice = orderProductPrice;
            var html = ""

            html +="<tbody style='background-color: #e85d04;'>"

            html+="<tr>"

            html+="<td>"
            html += orderProductName
            html+="</td>"

            html += "<td>"
            html += orderProductQuantity
            html += "</td>"

            html += "<td>"
            html += orderProductPrice
            html += "</td>"

           

            html += "<td></td><td></td>"
            


            html+="</tr>"

            html+="</tbody>"
            

            document.getElementById('manageOrderInformations').innerHTML += html;
            //console.log(orderProductName, orderProductPrice, orderProductQuantity)
        });
    }
}
