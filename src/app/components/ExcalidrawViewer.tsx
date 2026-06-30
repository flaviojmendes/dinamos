import { useEffect, useState, useRef, useCallback } from 'react';
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

interface ExcalidrawViewerProps {
  diagramData: {
    elements: any[];
    appState?: {
      viewBackgroundColor?: string;
      [key: string]: any;
    };
  };
  height?: string;
}

/**
 * A read-only Excalidraw viewer that automatically fits the entire drawing
 * in view and allows users to zoom in/out and pan.
 */
const ExcalidrawViewer = ({ diagramData, height = "400px" }: ExcalidrawViewerProps) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const hasScrolledToContent = useRef(false);

  useEffect(() => {
    if (excalidrawAPI && !hasScrolledToContent.current) {
      // Small delay to ensure the component is fully rendered
      const timer = setTimeout(() => {
        try {
          // Scroll to fit all content in view
          excalidrawAPI.scrollToContent(
            excalidrawAPI.getSceneElements(),
            {
              fitToContent: true,
              animate: false,
              duration: 0,
            }
          );
          hasScrolledToContent.current = true;
          // Update zoom level display
          const appState = excalidrawAPI.getAppState();
          if (appState?.zoom?.value) {
            setZoomLevel(Math.round(appState.zoom.value * 100));
          }
        } catch (error) {
          console.error('Error scrolling to content:', error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [excalidrawAPI]);

  const handleZoomIn = useCallback(() => {
    if (!excalidrawAPI) return;
    try {
      const appState = excalidrawAPI.getAppState();
      const currentZoom = appState?.zoom?.value || 1;
      const newZoom = Math.min(currentZoom * 1.25, 10); // Max 1000%
      excalidrawAPI.updateScene({
        appState: { zoom: { value: newZoom } }
      });
      setZoomLevel(Math.round(newZoom * 100));
    } catch (error) {
      console.error('Error zooming in:', error);
    }
  }, [excalidrawAPI]);

  const handleZoomOut = useCallback(() => {
    if (!excalidrawAPI) return;
    try {
      const appState = excalidrawAPI.getAppState();
      const currentZoom = appState?.zoom?.value || 1;
      const newZoom = Math.max(currentZoom * 0.8, 0.1); // Min 10%
      excalidrawAPI.updateScene({
        appState: { zoom: { value: newZoom } }
      });
      setZoomLevel(Math.round(newZoom * 100));
    } catch (error) {
      console.error('Error zooming out:', error);
    }
  }, [excalidrawAPI]);

  const handleFitToContent = useCallback(() => {
    if (!excalidrawAPI) return;
    try {
      excalidrawAPI.scrollToContent(
        excalidrawAPI.getSceneElements(),
        {
          fitToContent: true,
          animate: true,
          duration: 300,
        }
      );
      // Update zoom level after animation
      setTimeout(() => {
        const appState = excalidrawAPI.getAppState();
        if (appState?.zoom?.value) {
          setZoomLevel(Math.round(appState.zoom.value * 100));
        }
      }, 350);
    } catch (error) {
      console.error('Error fitting to content:', error);
    }
  }, [excalidrawAPI]);

  return (
    <div 
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden relative"
      style={{ height }}
    >
      <Excalidraw
        excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
        initialData={{
          elements: diagramData.elements as any,
          appState: {
            ...diagramData.appState,
            viewBackgroundColor: diagramData.appState?.viewBackgroundColor || "#ffffff",
          }
        }}
        viewModeEnabled={true}
        zenModeEnabled={true}
        gridModeEnabled={false}
        UIOptions={{
          canvasActions: {
            changeViewBackgroundColor: false,
            clearCanvas: false,
            export: false,
            loadScene: false,
            saveToActiveFile: false,
            toggleTheme: false,
            saveAsImage: false,
          },
        }}
      />
      
      {/* Custom Zoom Controls */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-1">
        <button
          onClick={handleZoomOut}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Diminuir zoom"
          aria-label="Diminuir zoom"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </button>
        
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300 min-w-[3rem] text-center">
          {zoomLevel}%
        </span>
        
        <button
          onClick={handleZoomIn}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Aumentar zoom"
          aria-label="Aumentar zoom"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1" />
        
        <button
          onClick={handleFitToContent}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Ajustar ao conteúdo"
          aria-label="Ajustar ao conteúdo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
      
      {/* Hint overlay */}
      <div className="absolute bottom-3 left-3 text-xs text-gray-400 dark:text-gray-500 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded pointer-events-none">
        Scroll para zoom • Arraste para mover
      </div>
    </div>
  );
};

export default ExcalidrawViewer;

