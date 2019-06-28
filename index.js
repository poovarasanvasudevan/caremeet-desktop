const {app, BrowserWindow, Tray, Menu, MenuItem, Notification, protocol, ipcMain, ipcRenderer} = require('electron');

require('electron-reload')(__dirname);
let CWINDOW;
let tray = null;
let PROTOCOL_PREFIX = "caremeet";

app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
app.commandLine.appendSwitch('enable-usermedia-screen-capturing', 'true');

app.setLoginItemSettings({
    openAtLogin: true,
    path: app.getPath("exe")
});
// protocol.re(PROTOCOL_PREFIX, (req, cb) => {
//     const fullUrl = req.url;
//     console.log("Protocol");
//     win.loadFile('view/index.html');
// });


function createStartWindow() {

    const win = new BrowserWindow({
        width: 500,
        height: 350,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            experimentalFeatures: true,
            allowRunningInsecureContent: true
        },
        icon: __dirname + "/static/image/avatar.png"
    });


    win.on('ready-to-show', () => {
        win.focus();
        win.show();
    });


    win.loadFile('view/index.html');
    win.setMenu(null);
    //win.webContents.openDevTools();
    win.setResizable(false);
    win.center();


    win.on('will-resize', (e) => {
        e.preventDefault();
    });


    tray = new Tray(__dirname + "/static/image/avatar.png");
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Open Caremeet'},
        {label: 'Join Meeting'},
        {label: 'Quit'}
    ]);
    tray.setToolTip('Caremeet.');
    tray.setContextMenu(contextMenu);


    return win;
}

function createMeetingWindow() {
    let win = new BrowserWindow({
        frame: false,
        width: 1000,
        height: 750,

        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            experimentalFeatures: true,
            allowRunningInsecureContent: true
        },
        icon: __dirname + "/static/image/avatar.png"
    });
    //win.webContents.openDevTools();
    win.webContents.on('did-finish-load', () => {
        win.focus();
    });
    win.setMenu(null)
    win.loadFile('view/meeting.html');
    return win;
}

function createScreenShareWindow() {
    let win = new BrowserWindow({
        frame: false,
        width: 920,
        height: 620,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            experimentalFeatures: true,
            allowRunningInsecureContent: true
        },
        icon: __dirname + "/static/image/avatar.png"
    });
    win.webContents.openDevTools();
    win.setMenu(null)
    win.loadFile('view/screens.html');
    return win;
}


app.on('ready', () => {
    CWINDOW = createStartWindow();
    CWINDOW.show();
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});


ipcMain.on('join', function (e, data) {
    CWINDOW = createMeetingWindow();
    CWINDOW.args = {
        meetinginfo: {
            data: data
        }
    };
    CWINDOW.show();
});

ipcMain.on('sharescreen', function (e, data) {
    CWINDOW = createScreenShareWindow();
    CWINDOW.show();
});
