import { OWWindow } from "../odk-ts/ow-window";

// A base class for the app's foreground windows.
// Sets the modal and drag behaviors, which are shared accross the desktop and in-game windows.
export class AppWindow {
  protected currWindow: OWWindow;
  protected mainWindow: OWWindow;
  protected maximized: boolean = false;

  constructor(windowName) {
    this.mainWindow = new OWWindow('background');
    this.currWindow = new OWWindow(windowName);
    
    const closeButton = document.getElementById('closeButton');
    const maximizeButton = document.getElementById('maximizeButton');
    const minimizeButton = document.getElementById('minimizeButton');
    const modal = document.getElementById('exitMinimizeModal');
    const modalCloseButton = document.getElementById('exit');
    const modalMinimizeButton = document.getElementById('minimize');

    const header = document.getElementById('header');
    
    this.setDrag(header);
    
    closeButton.addEventListener('click', () => {
      modal.style.display = 'block';
    });

    modalCloseButton.addEventListener('click', () => {
      this.mainWindow.close();
    });
    
    minimizeButton.addEventListener('click', () => {
      this.currWindow.minimize();
    });

    maximizeButton.addEventListener('click', () => {
      if (!this.maximized) {
        this.currWindow.maximize();
      } else {
        this.currWindow.restore();
      }

      this.maximized = !this.maximized;
    });

    modalMinimizeButton.addEventListener('click', () => {
      this.currWindow.minimize();
      modal.style.display = 'none';
    });
  }

  public async getWindowState() {
    return await this.currWindow.getWindowState();
  }
  
  private async setDrag(elem) {
    this.currWindow.dragMove(elem);
  }
}