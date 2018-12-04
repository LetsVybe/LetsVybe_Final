
window.onload = function () {

    // While firebase finished loading.
    databaseRef = firebase.firestore();
    databaseRef.settings({ timestampsInSnapshots: true });

    // Get the reference for vybeChallenge.
    vybeChallengesRef = databaseRef.collection('dummyChallenges');
    usersRef = databaseRef.collection('users');

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var navPhoto = document.getElementById("navPhoto")
            var navName = document.getElementById("nav-name")
            var postAreaPhoto = document.getElementById("postarea-photo")
            var profilePhoto = this.document.getElementById('profilePhoto');
            profilePhoto.setAttribute('src',user.photoURL);
            navPhoto.setAttribute('src', user.photoURL);
            postAreaPhoto.setAttribute('src', user.photoURL)
            
            navName.innerHTML = user.displayName
            navName.setAttribute('style', 'color: #fff;')
            console.log(navPhoto)
            // When the user is already logged in.
            userInfo = {
                uid: user.uid,
                img: user.photoURL,
                displayName: user.displayName
            }

            var stuff = document.querySelector('.friendListImg');
            var name = document.querySelector('.friendsName');
            name.innerHTML = userInfo.displayName;

            stuff.setAttribute('src',user.photoURL);
            
        } else {
            document.location.href = "index.html";
            // Otherwise direct user to the login page.

        }
    });
}