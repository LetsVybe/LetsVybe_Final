let userInfo = {
    uid: null,
    displayName: null,
    img: null,
    friendsCount: 0,
    vybeChallengesCount: 0
};
let vybeChallengesRef;
let usersRef;

function VybeQuestion(question, answers, correctAnswer) {
    this.question = question;
    this.answerSet = answers;
    this.correctAnswer = correctAnswer;
}

VybeQuestion.prototype.getObject = function () {
    return {
        question: this.question,
        answerSet: this.answerSet,
        correctAnswer: this.correctAnswer
    }
}

function VybeChallenge() {
    this.challengeID = null;
    this.user = null;               // The dispaly name and picture.

    this.description = null;        // The description of the challenge.

    this.questions = [];            // Array of questions.

    this.likes = [];                 // Likes for the vybeChallenge/
    this.liked = null;
    this.private = false;           // Privacy.
    this.answers = null;

    this.tags = [];                 // Related tags.
}

VybeChallenge.prototype.initializeFromDOM = function (question) {
    this.user = userInfo;
    this.description = question.question;
    this.questions = [question];
    this.likes = [];
}

VybeChallenge.prototype.retrieveChallenge = function (challengeID) {
    // Retrieve tha challenge first.
    vybeChallengesRef.doc(challengeID).get()
        .then(snapshot => {
            this.parseChallenge(snapshot.data());
        })
        .catch(error => {
            console.log(error.message);
        }
        );

    // Retrive the user and questions at the same time.
}

VybeChallenge.prototype.parseChallenge = async function (challenge) {
    this.user = challenge.user;
    this.description = challenge.description;
    this.questions = challenge.questions;
    this.likes = challenge.likes;
    this.liked = this.likes.includes(userInfo.uid);
    this.private = challenge.private;
    this.tags = challenge.tags;
    await this.getAnswers();
}

VybeChallenge.prototype.getAnswers = async function () {
    await vybeChallengesRef.doc(this.challengeID).collection('answers').doc(userInfo.uid)
        .get()
        .then(result => {
            if (result.exists) {
                this.answers = result.data().answers;
            } else {
                this.answers = null;
            }
        })
}

VybeChallenge.prototype.uploadChallenge = function () {
    // First check the validity of the questions.
    thisChallenge = this;
    uploadDoc = {
        user: this.user,
        description: this.description,
        questions: this.questions,
        likes: this.likes,
        private: this.private,
        tags: this.tags
    };
    console.log(uploadDoc);
    vybeChallengesRef.add(uploadDoc)
        .then((result) => {
            if (debug) console.log('Challenge successfully uploaded.');
        })
        .catch(error => {
            console.log(error.message);
        });
}

// This function is called from other function so we cannot use this keyword.
VybeChallenge.prototype.likePost = function (challengeRef) {
    // TODONOW: Add the users to the likes array.
    if (challengeRef.likes.includes(userInfo.uid)) {
        // The user has already liked the post. Now remove him.
        vybeChallengesRef.doc(challengeRef.challengeID).update({
            likes: firebase.firestore.FieldValue.arrayRemove(userInfo.uid)
        });
        console.log('unliked');
        // TODONOW: Remove the user from the array in the ofline object.
    } else {
        // Add the user to the list of liked uids.
        vybeChallengesRef.doc(challengeRef.challengeID).update({
            likes: firebase.firestore.FieldValue.arrayUnion(userInfo.uid)
        });
        console.log('liked');
        // TODONOW: Add the user to the array in the ofline object.
    }
}

// Function to submit the answers for the vybe challenge.
// This function will be called by a callback function do now use 'this'.
VybeChallenge.prototype.submitPost = async function (challengeRef, userAnswers) {
    // Upload answers under the subcollectino answer of the original challenge.
    return new Promise((resolve, reject) => {
        vybeChallengesRef.doc(challengeRef.challengeID).collection('answers').doc(userInfo.uid)
            .set({
                answers: userAnswers
            })
            .then(() => {
                if (debug) console.log('Successfully uploaded the answer');
                resolve(true);
            })
            .catch(error => {
                console.log(error.message);
            })
    })

}

VybeChallenge.prototype.deletePost = async function (challengeRef) {
    return new Promise((resolve, reject) => {
        vybeChallengesRef.doc(challengeRef.challengeID).delete()
            .then(() => {
                resolve(true);
            }).catch( error => {
                console.log(error.message);
            })
    })
}

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
                displayName: user.displayName,
            }

            // Complete the rest of the information about the userInfo.
            getVybeChallenges(user.uid)
                .then(challenges => {
                    let count = 0;
                    challenges.forEach(challenge => {
                        count += 1;
                        renderChallenge(challenge);
                    })
                    userInfo.vybeChallengesCount = count;
                })
                .catch(error => {
                    console.log(error.message);
                });

            getFriends(user.uid)
                .then(friends => {
                    userInfo.friendsCount = friends.length;
                    friends.forEach(uid => {
                        retriveAndRenderFriend(uid);
                    })
                })

            // TODO: Edit this.
            // var stuff = document.querySelector('.friendListImg');
            // var name = document.querySelector('.friendsName');
            // name.innerHTML = userInfo.displayName;

            // stuff.setAttribute('src',user.photoURL);
            
        } else {
            document.location.href = "index.html";
            // Otherwise direct user to the login page.

        }
    });
}


// Get all the vybeChallenges posted by the user.
async function getVybeChallenges(uid) {
    return new Promise((resolve, reject) => {
        vybeChallengesRef.where('user.uid', '==', uid).get()
            .then(snapshots => {
                resolve(snapshots);
            })
            .catch(error => {
                console.log(error.message);
            });
    });

}

// Get the friends of the user.
async function getFriends(uid){
    return new Promise((resolve, reject) => {
        resolve(['RUG3hjvdftZ0X8aX7FXcFUWfegr2', '750koGhPWgTYvadSl0TohChv7R53', 'GtZ7r9nHPWauu33l9PUta7e43wF3'])
    });
}

function renderChallenge(challenge){
    let currChallenge = new VybeChallenge();
    currChallenge.challengeID = challenge.id;
    currChallenge.parseChallenge(challenge.data())
        .then(() => {
            // Create a postCard element to push to the dom.
            let currPost = new PostCard(true);
            currPost.initialize(currChallenge);

            // Upload the postCard to the DOM.
            var ul = document.getElementById('feed-list')
            var li = document.createElement('li');
            li.appendChild(currPost.element);
            ul.insertBefore(li, ul.firstChild);
        })
        .catch(error => {
            console.log(error.message);
        });
}

function retriveAndRenderFriend(uid){
    usersRef.doc(uid).get()
        .then(snapshot => {
            renderFriend(snapshot.data());
        })
        .catch(error => {
            console.log(error.message);
        })
} 


function renderFriend(user){
                            // <li>
                            //     <div class="friendsListItem">
                            //         <img src=#>
                            //         <span>Name: </span>
                            //     </div>

                            // </li>
    // Create the image and set the url.
    let img = document.createElement('img');
    img.src = user.photoURL;
    img.setAttribute('class', 'friendListImg');
    // Create the span and update name.
    let span = document.createElement('span');
    span.innerHTML = user.displayName;
    span.setAttribute('class', 'friendsName');

    // Create div and append img and span.
    let listItem = document.createElement('div');
    listItem.setAttribute('class', 'friendsListItem');
    listItem.appendChild(img);
    listItem.appendChild(span);

    // Create a listItem
    let li = document.createElement('li');
    li.appendChild(listItem);

    // Get the reference the the list and append.
    let ul = document.querySelector('#friends-list');
    ul.appendChild(li);
}

function signOut(){
    firebase.auth().signOut()
        .then(() => {
            console.log('Successfully logged out!');
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.log(error.message);
        });
}

