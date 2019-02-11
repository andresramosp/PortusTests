
const UserPrefs = {

    getUserPrefs() {
        var userPrefs = {};
        if (!isMobile()) {
          var menuMinimized = localStorage.getItem('menu_minimized');
          if (menuMinimized)
            userPrefs.menu_minimized = JSON.parse(menuMinimized);
        }
        else {
          userPrefs.menu_minimized = true;
        }
        var bancoDatos = localStorage.getItem('banco_datos');
        if (bancoDatos)
          userPrefs.banco_datos = JSON.parse(bancoDatos);

        var messageIgnoreList = localStorage.getItem('messages-to-ignore');
        if (messageIgnoreList)
          userPrefs.messages_ignore_list = JSON.parse(messageIgnoreList);
        else
          userPrefs.messages_ignore_list = [];

        return userPrefs;
      },

    addMessageToIgnore(message) {
      var messageIgnoreList = JSON.parse(localStorage.getItem('messages-to-ignore'));
      if (!messageIgnoreList)
        messageIgnoreList = [];
      messageIgnoreList.push(message.id);
      localStorage.setItem('messages-to-ignore', JSON.stringify(messageIgnoreList));
    },

    refresh() {
      PC.user_preferences = this.getUserPrefs();
    }

      
}

export default UserPrefs