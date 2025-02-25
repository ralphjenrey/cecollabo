
export const sendMessages = async (roomName, title, body) => {
  const response = await fetch('https://fcm-cecollabo.onrender.com/send-notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      roomName: roomName, // Replace with the desired room name or "EVERYONE"
      title: title,
      body: body,
    }),
  });

  if (response.ok) {
    const result = await response.json();
    console.log('Notification sent successfully:', result);
  } else {
    console.error('Error sending notification:', response.statusText);
  }
};
