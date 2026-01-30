import { X, Minus, Square } from 'lucide-react';

const { ipcRenderer } = window.require('electron');

export default function TitleBar() {
  const handleMinimize = () => ipcRenderer.send('window-minimize');
  const handleMaximize = () => ipcRenderer.send('window-maximize');
  const handleClose = () => ipcRenderer.send('window-close');

  return (
    <div className="title-bar">
      <div className="title-bar-drag">
        <span className="title-bar-title">نظام نقاط البيع - صاج العرب</span>
      </div>
      <div className="title-bar-controls">
        <button
          className="title-bar-button minimize"
          onClick={handleMinimize}
          aria-label="تصغير"
        >
          <Minus size={16} />
        </button>
        <button
          className="title-bar-button maximize"
          onClick={handleMaximize}
          aria-label="تكبير"
        >
          <Square size={14} />
        </button>
        <button
          className="title-bar-button close"
          onClick={handleClose}
          aria-label="إغلاق"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
