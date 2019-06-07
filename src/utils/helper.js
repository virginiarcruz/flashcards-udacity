import { AsyncStorage } from "react-native";
import { Notifications, Permissions } from "expo";

const NOTIFICATION_KEY = "Flashcards_Notification";

export function generateUID () {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function clearLocalNotification(){
    return AsyncStorage.removeItem(NOTIFICATION_KEY)
        .then(Notifications.cancelAllScheduledNotificationsAsync)
}

export const colors = {
    homeBackgroundColor: "#E6E6FA",
    homeCardBackgroundColor: "#9370DB",
    allScreensBackgroundColor: "#E6E6FA",
    headerColor: "#BA55D3",
    darkButtonColor: "#8B008B",
    textColor:"#FFFFFF",
    quizCardColor: "#4B0082",
    buttonColor: "#FF00FF",
}

function createNotification(){
    return {
        title: "Attempt one quiz today",
        body: "Don't forget to attemp atleast one quiz today",
        ios: {
            sound: true
        },
        android: {
            sound: true,
            priority: 'high',
            sticky: false,
            vibrate: true,
        }
    }
}

export function setLocalNotification(){
    AsyncStorage.getItem(NOTIFICATION_KEY)
        .then(JSON.parse)
        .then((data) => {
            if(data === null){
                Permissions.askAsync(Permissions.NOTIFICATIONS)
                    .then(({status})=> {
                        if(status === 'granted'){
                            Notifications.cancelAllScheduledNotificationsAsync();

                            let tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            tomorrow.setHours(11);
                            tomorrow.setMinutes(0);

                            Notifications.scheduleLocalNotificationAsync(
                                createNotification(),
                                {
                                    time:tomorrow,
                                    repeat: 'day',
                                }
                            )
                            AsyncStorage.setItem(NOTIFICATION_KEY,JSON.stringify(true));
                        }
                    })
            }
        })
}

