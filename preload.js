const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('pomodoroAPI', {
  notify(title, body) {
    new Notification(title, { body });
  },
});
