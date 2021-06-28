import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

export const getOwnerType = async(email) => {
  initFirebase();
  console.log(email)
  var snapshot = await firebase
    .firestore()
    .collection('users')
    .where('email', '==', email)
    .get()
    .catch((err) => {
      console.log(err);
      return Promise.reject(err);
    });
  return snapshot.userType
}

const initFirebase = async () => {
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (err) {

    /*
     * We skip the "already exists" message which is
     * not an actual error when we're hot-reloading.
     */
    if (!/already exists/u.test(err.message)) {
      // eslint-disable-next-line no-console
      console.error('Firebase admin initialization error', err.stack);
    }

  }
}


/*Attempts to authenticate a user with a given email and password.*/
export const signIn = async (email, password) => {
  initFirebase();

  return firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
      console.log("Signed in!");
      return true, null;
    })
    .catch((error) => {

      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Error " + errorCode + ": " + errorMessage);
      return false, error
    });
};

export const signUp = async (userType, email, password,fullName, interests) => {
  initFirebase();
  console.log(userType, email, password,fullName, interests)
  return firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    let userId = user.uid;
    // userId -> user type, interests, etc. 
    // continue with sign up process, add fields (not username and password related) to our own firestore table.
    firebase.firestore().collection("users").doc(userId).set({
          fullName: fullName,
          email: email,
          userType: userType,
          interests: interests, 
          projectsDonatedTo: {}
      })
      .then(() => {
          console.log("Document successfully written!");
          return null;
      })
      .catch((error) => {
          console.error("Error writing document: ", error);
          return error;
      });
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
    console.log("Error " + errorCode + ": " + errorMessage);
    return error;
  });

}

export const addDonation = async (userId, projectId, amount) =>{
  initFirebase();
  projectId = "7HxK8jelcsao9ZFirG1k"
  firebase.firestore()
    .collection("donations")
    .add({
      userId: firebase.firestore().doc(`/users/${userId}`),
      projectId: firebase.firestore().doc(`/projects/${projectId}`),
      amount: amount
    })
    .then(() => {
      console.log("Document successfully written!");
      return null;
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
      return error;
    });

}

export const addProject = async( project ) => {
  initFirebase();
  const db = firebase.firestore();
  const projectRef = db.collection('projects').doc();
  const id = projectRef.id;
  projectRef
  .set({
    id: id,
    published: firebase.firestore.FieldValue.serverTimestamp(),
    updated: firebase.firestore.FieldValue.serverTimestamp(),
    ...project
  })
  .then(() => {
    console.log("Project is succesfully added");
    return null;
  })
  .catch((error) => {
    console.error("Error writing document: ", error);
    return error;
  });
}

export const getUsersDonatedForAProject = async (projectId) =>{
  initFirebase();
  const projectRef = firebase.firestore()
   .collection('projects')
   .doc(projectId);

  const snapshot = await firebase
    .firestore()
    .collection('donations')
    .where('projectId', '==', projectRef)
    .get()
    .catch((err) => {
      console.log(err);
      return Promise.reject(err);
    });
  
  return snapshot.docs.map(async doc=> (await getDoc("users", doc.data().userId.id)))
}


export const getUserDonatedProjects = async(userId) => {
  initFirebase();
  const userRef = firebase.firestore()
   .collection('users')
   .doc(userId);

  var snapshot = await firebase.firestore()
    .collection('donations')
    .where('userId', '==', userRef)
    .get()
    .catch((err) => {
      console.log(err);
      return Promise.reject(err);
    });
  return snapshot.docs.map(async doc=> (await getDoc("projects", doc.data().projectId.id)))
}

export const getDoc = async (collection, Id) => {
  return firebase.firestore().collection(collection).doc(Id).get()
  .then(async (projectDoc) => {
      if (projectDoc.exists) {
        return await Promise.resolve(projectDoc).then(pro=>pro.data())
      } else {
        return Promise.reject("no such document project")
      }
  })
  .catch((err) => {
  console.log(err);
  return Promise.reject(err);
  });

  }

export const getRecommendedProjects = async () => {
  initFirebase();

  const snapshot = await firebase.firestore().collection('projects').get()
  return snapshot.docs.map(doc => doc.data())
}

async function getProjectDoc(projectId) {
  return firebase.firestore().collection('projects').doc(projectId).get()
  .then((projectDoc) => {
    if (projectDoc.exists) {
      return Promise.resolve(projectDoc)
    } else {
      return Promise.reject("no such document project")
    }
  })
  .catch((err) => {
  console.log(err);
  return Promise.reject(err);
  });

}

export const getProjectsByDonor = async (userId) => {
  initFirebase();   

  return firebase.firestore().collection('users').doc(userId).get()
  .then(async (userDoc) => {
    if(userDoc.exists) {
      const projects = userDoc.data().projectsDonatedTo;
      if(projects) {
        const promises = Object.keys(projects).map(getProjectDoc)
      return Promise.allSettled(promises).
      then((results) => {
        return results.filter(x => x.status === "fulfilled").map(x => x.value);
      });
      } else {
        return []
      }
      
    } else {
      console.log("no such user");
      return [];
    }
    
  });
};



export default firebase;