let databaseRef;
let user;
let domElements;
let userRef;
let storageRef;

let debug = false;

// When the window loads.
window.onload = function () {
    // Grab a reference to the firestore.
    databaseRef = firebase.firestore();

    // Grab a reference to the cloud storage.
    storageRef = firebase.storage().ref();

    // Firebase recommended settings for the firestore.
    databaseRef.settings({ timestampsInSnapshots: true });

    // Listen for the initialization of the currentUser in firebase.
    firebase.auth().onAuthStateChanged(user => {
        // If user exists continue with the rest of the retrieval.
        if (user) {

            var navPhoto = document.getElementById("navPhoto")
            var navName = document.getElementById("nav-name")
            navPhoto.setAttribute('src', user.photoURL);

            navName.innerHTML = user.displayName
            navName.setAttribute('style', 'color: #fff;')
            if (debug) console.log('User: ', user);

            const profilePhoto = this.document.querySelectorAll('.photoField');
            profilePhoto.forEach(photo => {
                photo.setAttribute('src',user.photoURL);
            }) ;

            const userName = document.getElementById('name');
            const userGender = document.getElementById('gender');
            const userlocation = document.getElementById('location');
            const userEmail = document.getElementById('email');
            
            userName.innerHTML = user.displayName;
            console.log(user)
            // userGender.innerHTML = user.




            // Get the user from the database.
            let uid = firebase.auth().currentUser.uid;
            userRef = databaseRef.collection('users').doc(uid);

            domElements = new domElementsPrototype();
            domElements.initialize(); // Sets all the id and connections.

            // Create a user prototype to store information locally and update it's field.
            user = new userPrototype(domElements);
            user.retrieveUser(domElements, userRef);  // Also populates all the field in the document.


            domElements.setUpOnClickActions(user);



            uid = user.uid;  // This is taking up unnecessary space.  We always have user and can always reference user.uid in constant time (k).


        }
        // Otherwise redirect to the login page.
        else {
            // TODO: Find how to redirect the page. 
        }
    });


}

function updateDisplayPhoto(){
    $(".displayPhoto").click(function () {
        $(".updateDisplayPhoto").toggle();
    });
    $('#editPhoto').click(function () {
        $(".updateDisplayPhoto").toggle();
    })
} 

function updateUserName() {
    $(".userName").click(function () {
        $(".updateUserName").toggle();
    });
    $('#editName').click(function () {
        $(".updateUserName").toggle();
    })

}

function updateDisplayName() {
    $(".displayName").click(function () {
        $(".updateDisplayName").toggle();
    });
    $('#editDisplayName').click(function () {
        $(".updateDisplayName").toggle();
    });

    ;
}

function updatePassword() {
    $(".password").click(function () {
        $(".updatePassword").toggle()
    });
    $('.edit').click(function () {
        $(".updatePassword").toggle();
    });
}

function updateAge() {
    $(".age").click(function () {
        $(".updateAge").toggle()
    });
    $('#editAge').click(function () {
        $(".updateAge").toggle();
    });
}

function updatePhoneNumber() {
    $(".phoneNumber").click(function () {
        $(".updatePhoneNumber").toggle()
    });
    $('#editPhone').click(function () {
        $(".updatePhoneNumber").toggle();
    });

}

function updateEmail() {
    $(".email").click(function () {
        $(".updateEmail").toggle()
    });
    $('#editEmail').click(function () {
        $(".updateEmail").toggle();
    });
}

function updateGender() {
    $(".gender").click(function () {
        $(".updateGender").toggle()
    });
    $('.edit').click(function () {
        $(".updateGender").toggle();
    });
}

function updateAreaCode() {
    $(".areaCode").click(function () {
        $(".updateAreaCode").toggle()
    });
    $('.edit').click(function () {
        $(".updateAreaCode").toggle();
    });

}

function signOut() {
    firebase.auth().signOut()
        .then(() => {
            console.log('Successfully logged out!');
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.log(error.message);
        });
}