import React, { useMemo } from 'react';
import { Excalidraw, exportToSvg } from '@excalidraw/excalidraw';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types';
import type { AppState, BinaryFiles } from '@excalidraw/excalidraw/types';

interface ExcalidrawViewerProps {
  diagramData: {
    elements?: ExcalidrawElement[];
    appState?: Partial<AppState>;
    files?: BinaryFiles;
  };
}

// Static SVG Viewer - renders once and doesn't need interactivity
function ExcalidrawSvgViewer({ diagramData }: ExcalidrawViewerProps) {
  const [svgContent, setSvgContent] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const generateSvg = async () => {
      try {
        const elements = diagramData.elements || [];
        if (elements.length === 0) {
          setError('No diagram elements');
          return;
        }

        const svg = await exportToSvg({
          elements: elements as ExcalidrawElement[],
          appState: {
            exportWithDarkMode: true,
            exportBackground: false,
            ...diagramData.appState,
          },
          files: diagramData.files ?? null,
        });

        setSvgContent(svg.outerHTML);
      } catch (err) {
        console.error('Failed to render Excalidraw diagram:', err);
        setError('Failed to render diagram');
      }
    };

    generateSvg();
  }, [diagramData]);

  if (error) {
    return (
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
        <p className="text-slate-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!svgContent) {
    return (
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
        <div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div 
      className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-4 overflow-auto"
      dangerouslySetInnerHTML={{ __html: svgContent }}
      style={{
        maxHeight: '500px',
      }}
    />
  );
}

// Interactive Viewer - for cases where interactivity is needed
function ExcalidrawInteractiveViewer({ diagramData }: ExcalidrawViewerProps) {
  const initialData = useMemo(() => ({
    elements: diagramData.elements || [],
    appState: {
      viewBackgroundColor: 'transparent',
      theme: 'dark' as const,
      ...diagramData.appState,
    },
    files: diagramData.files ?? undefined,
  }), [diagramData]);

  return (
    <div className="bg-slate-900/30 border border-slate-700/50 rounded-lg overflow-hidden" style={{ height: '400px' }}>
      <Excalidraw
        initialData={initialData}
        viewModeEnabled={true}
        zenModeEnabled={true}
        gridModeEnabled={false}
        theme="dark"
        UIOptions={{
          canvasActions: {
            loadScene: false,
            export: false,
            saveAsImage: false,
            saveToActiveFile: false,
            toggleTheme: false,
          },
          tools: {
            image: false,
          },
        }}
      />
    </div>
  );
}

// Main export - uses SVG for better performance and simpler rendering
export default function ExcalidrawViewer({ diagramData }: ExcalidrawViewerProps) {
  // Validate diagram data
  if (!diagramData || !diagramData.elements || diagramData.elements.length === 0) {
    return null;
  }

  return <ExcalidrawSvgViewer diagramData={diagramData} />;
}

// Export interactive version for cases where it's needed
export { ExcalidrawInteractiveViewer };

