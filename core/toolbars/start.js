const {Titlebar, Color} = require('custom-electron-titlebar');

new Titlebar({
    backgroundColor: Color.fromHex('#0052cc'),
    icon: '../static/image/avatar.png',
    shadow: false,
    maximizable: false,
    menu: null,
    titleHorizontalAlignment: 'left'
});
