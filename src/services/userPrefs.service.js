
const UserPrefs = {

    getUserPrefs() {
        var userPrefs = {};
        var menuMinimized = localStorage.getItem('menu_minimized');
        if (menuMinimized)
          userPrefs.menu_minimized = JSON.parse(menuMinimized);
      
        var bancoDatos = localStorage.getItem('banco_datos');
        if (bancoDatos)
          userPrefs.banco_datos = JSON.parse(bancoDatos);

        return userPrefs;
      }
      
}

export default UserPrefs