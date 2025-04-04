import React from 'react';
import { X, Minus } from 'lucide-react';
import { Button } from './ui/button';

// Electron API 타입 정의는 이미 electron.d.ts에 정의되어 있으므로 여기서는 생략
// 기존 ElectronAPI 인터페이스에 minimize와 close 메서드가 추가되었다고 가정

const TitleBar: React.FC = () => {
  // 윈도우 최소화 함수
  const handleMinimize = () => {
    if (window.electron) {
      window.electron.minimize();
    }
  };

  // 윈도우 닫기 함수
  const handleClose = () => {
    if (window.electron) {
      window.electron.close();
    }
  };

  return (
    <div className="app-drag-region flex justify-between items-center w-full h-10 bg-background/60 backdrop-blur-sm border-b border-primary/10">
      {/* 앱 제목 */}
      <div className="flex items-center ml-3">
        <span className="text-xs font-bold text-primary">STRETCH</span>
        <span className="text-xs font-bold text-muted-foreground ml-1">REMINDLY</span>
      </div>
      
      {/* 윈도우 컨트롤 버튼 */}
      <div className="flex items-center no-drag">
        <Button
          onClick={handleMinimize}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-none hover:bg-muted/20"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleClose}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-none hover:bg-destructive/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TitleBar;
