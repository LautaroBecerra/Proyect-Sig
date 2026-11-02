import { NotificationRepository } from "./notifications.repository";

const repository = new NotificationRepository();

let schedulerStarted = false;

export const startNotificationScheduler = () => {

    if (schedulerStarted) {
        console.log("Notification scheduler already started");
        return;
    }

    schedulerStarted = true;

    console.log("Notification scheduler started");

    const checkNotifications = async () => {
        try {
            const created =
                await repository.createPendingConfirmations();

            if (created > 0) {
                console.log(
                    `${created} notification(s) created`
                );
            }

        } catch (error) {
            console.error(
                "Error generating notifications:",
                error
            );
        }
    };

    // Ejecutar una comprobación al iniciar el servidor.
    checkNotifications();

    // Comprobar nuevamente cada minuto.
    setInterval(checkNotifications, 60 * 1000);
};
