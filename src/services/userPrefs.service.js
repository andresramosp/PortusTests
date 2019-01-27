
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

        return userPrefs;
      }
      
}

export default UserPrefs