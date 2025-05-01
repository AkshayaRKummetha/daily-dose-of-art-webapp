self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: '/icon.png', // Replace with your icon path
  };
  event.waitUntil(
    self.registration.showNotification('Daily Dose of Art', options)
  );
});

self.addEventListener('notificationclick', event => {
  clients.openWindow('/');
  event.notification.close();
});
