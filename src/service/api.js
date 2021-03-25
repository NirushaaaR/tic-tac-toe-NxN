import { db, getServerTimeStamp } from './firebase';

export const getUserStat = (user, setStat) => {
    db.collection("userstat").doc(user.uid).get()
        .then((res) => {
            if (!res.exists) {
                // create new
                db.collection("userstat").doc(user.uid).set({ win: 0, lose: 0 });
            } else {
                setStat(res.data());
            }
        })
}

export const getHistory = (user, setReplay) => {
    db.collection("history")
        .where("uid", "==", user.uid)
        .orderBy("time")
        .get()
        .then(querySnapshot => {
            const allReplay = [];
            querySnapshot.forEach(doc => {
                allReplay.push(doc.data());
            });
            setReplay(allReplay);
        })
        .catch(error => alert(error.message));
}

export const saveReplay = (history, outcome, size, uid) => {
    // save replay to db
    db.collection("history").add({
        history,
        outcome,
        size,
        uid,
        time: getServerTimeStamp(),
    });
}

export const updateUserStat = (uid, newStat) => {
    db.collection("userstat").doc(uid).set(newStat);
}