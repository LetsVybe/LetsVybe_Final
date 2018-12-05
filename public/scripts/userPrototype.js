//  User prototype to store all the user information.
let userPrototype = function(domElements){
    this.domElements = domElements;

    this.uid = null;
    this.displayName = null;
    this.username = null;
    this.age = null;
    this.password = null;
    this.photoURL = null;
    this.email = null;
    this.phoneNumber = null;
    this.gender = null;
    this.currCity = null;
    this.zipCode = null;
}

userPrototype.prototype.getUserObject = function() {
    return {
        displayName: this.displayName,
        username: this.username,
        age: this.age,
        email: this.email,
        phoneNumber: this.phoneNumber
    }
}

// Retrieve the user.
userPrototype.prototype.retrieveUser = function (domElements, userRef, uid) {
    this.uid = uid;
    userRef.get()
        .then(querySnapshot => {
            if (debug) console.log('UserRef: ', querySnapshot.data());
            this.initializeUser(querySnapshot.data());
            domElements.populateFields(this.getUserObject());

        }).catch(error => {
            console.log(error.message);
        });
}

// Populate all the attributes of the prototype.
userPrototype.prototype.initializeUser = function(userDoc) {
    this.password = "**********";
    
    if (typeof userDoc.displayName !== 'undefined') {
        this.displayName = userDoc.displayName;
    } else {
        this.displayName = 'Please Edit';
    }

    if (typeof userDoc.username !== 'undefined'){
        this.username = userDoc.username;
    } else {
        this.username = 'Please Edit';
    }

    if (typeof userDoc.age !== 'undefined'){
        this.age = userDoc.age;
    }  else {
        this.age = 'Please Edit';
    }

    if (typeof userDoc.photoURL !== 'undefined'){
        this.photoURL = userDoc.photoURL;
    } else {
        this.photoURL = 'Please Edit';
    }
    
    if (typeof userDoc.phoneNumber !== 'undefined') {
        this.email = firebase.auth().currentUser.email;
    } else {
        this.email = firebase.auth().currentUser.email;
    }

    if (typeof userDoc.phoneNumber !== 'undefined') {
        this.phoneNumber = userDoc.phoneNumber;
    } else {
        this.phoneNumber = 'Please Edit';
    }
    if (typeof userDoc.gender !== 'undefined') {
        this.gender = userDoc.gender;
     } else {
         this.gender = 'Please Edit';
     }
    if (typeof userDoc.currCity !== 'undefined') {
        this.currCity = userDoc.city;
     } else {
         this.currCity = 'Please Edit';
     }
    if (typeof userDoc.zipCode !== 'undefined') {
        this.zipCode = userDoc.zipCode;
     } else {
         this.zipCode = 'Please Edit';
    }
}

// Update the displayName in the user state and the collection.
userPrototype.prototype.updateDisplayName = function (newDisplayName) {
    userRef.set({displayName: newDisplayName}, {merge: true});
    firebase.auth().currentUser.updateProfile({displayName: newDisplayName})
        .then(() => {
            if (debug) console.log('Successfully updated displayName');
            this.domElements.displayNameField.innerText = newDisplayName;
            window.location.reload();
        })
        .catch(error => {
            console.log(error.message);
        }
    );
}

// Update the username.
userPrototype.prototype.updateUsername = function (newUsername) {
    userRef.set({username: newUsername}, {merge: true})
        .then(() => {
            if (debug) console.log('Successfully updated username');
            this.username = newUsername;
            this.domElements.usernameField.innerText = newUsername;
            window.location.reload();
        })
        .catch(
    );
}

// Update the age.
userPrototype.prototype.updateAge = function (newAge) {
    userRef.set({age: newAge}, {merge: true})
        .then(() => {
            if (debug) console.log('Age successfully updated');
            this.age = newAge;
            this.domElements.ageField.innerText = newAge;
            window.location.reload();
        })
        .catch( error => {
            console.log(error.message);
        }
    );
}

// Update the password.
userPrototype.prototype.updatePassword = function (newPassword) {
    firebase.auth().currentUser.updatePassword(newPassword)
        .then(() => {
            if (debug) console.log('Password successfully updated.');
            // TODO: Close the div.
            window.location.reload();
        })
        .catch(error => {
            console.log(error.message);
            // TODO: Notify the user about the error message.
        }
    );
}

// Update the photoURL.
userPrototype.prototype.parsePhotoFileAndUpdateURL = function (newPhotoFile) {
    // Create a reference for the uploading file
    let photoRef = storageRef.child('photos/' + this.uid + '/' + newPhotoFile.name);

    // Upload the file.
    photoRef.put(newPhotoFile)
        .then(snapshot => {
            if (debug) console.log('Successfully updated image', snapshot);
            photoRef.getDownloadURL()
                .then(url => {
                    if (debug) console.log('The new url for the photo', url);
                    this.updatePhotoURL(url);
                    window.location.reload();

                }).catch(error => {
                    console.log(error.message);
                }
            );
        }).catch(error => {
            console.log(error.message);
        }
    );
}

// Update the photoURL
userPrototype.prototype.updatePhotoURL = function (newPhotoURL){
    userRef.set({photoURL: newPhotoURL}, {merge: true});
    firebase.auth().currentUser.updateProfile({photoURL: newPhotoURL})
        .then(() => {
            if (debug) console.log('Successfully updated the photoURL');
            this.photoURL = newPhotoURL;
        }).catch( error => {
            console.log(error.message);
        }
    );
}

// Update the gender.
userPrototype.prototype.updateGender = function (newGender) {
    userRef.set({gender: newGender}, {merge: true})
        .then(() => {
            if (debug) console.log('Successfully updated gender.');
            this.gender = newGender;
        })
        .catch(error => {
            console.log(error.message);
        }
    );
}

// Update the email.
userPrototype.prototype.updateEmail = function (newEmail) {
    userRef.set({email: newEmail}, {merge: true});
    firebase.auth().currentUser.updaetEmail(newEmail)
        .then(() => {
            if (debug) console.log('Successfully updated email address.');
            this.email = newEmail;
            this.domElements.emailField.innerText = newEmail;
            window.location.reload();
        })
        .catch(error => {
            console.log(error.message);
        }
    );
}

// Update the phone number.
userPrototype.prototype.updatePhone = function (newPhone) {
    userRef.set({phoneNumber: newPhone}, {merge: true})
        .then(() => {
            if (debug) console.log("Phone number updated.");
            this.phoneNumber = newPhone;
            this.domElements.phoneField.innerText = newPhone;
            window.location.reload();
        })
        .catch(error => {
            console.log(error.message);
        });
}

// Update the current city
userPrototype.prototype.updateCurrCity = function(newCity) {
    userRef.set({currCity: newCity}, {merge: true})
        .then(() => {
            if (debug) console.log('Successfully updated the currCity.');
            this.currCity = newCity;
            this.domElements.cityField.innerText = newCity;
            window.location.reload();
        })
        .catch(error => {
            console.log(error.message);
        }
    );
}

// Update the zipCode
userPrototype.prototype.updateZipCode = function(newZipCode) {
    userRef.set({zipCode: newZipCode}, {merge: true})
        .then(() => {
            if (debug) console.log('Successfully updated the zipCode.');
            this.zipCode = newZipCode;
            this.domElements.zipCodeField.innerText = newZipCode;
            window.location.reload();
        })
        .catch(error => {
            console.log(error.message);
        }
    );
}