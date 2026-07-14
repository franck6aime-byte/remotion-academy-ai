import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Sliders, Layout, Monitor, Maximize2 } from 'lucide-react';
import { parseAndEvaluateCode, RenderedNode } from '../lib/remotionMock';

interface RemotionPreviewProps {
  code: string;
  defaultProps?: Record<string, any>;
  durationInFrames?: number;
  fps?: number;
  onFrameChange?: (frame: number) => void;
}

export function RemotionPreview({
  code,
  defaultProps = {},
  durationInFrames = 150,
  fps = 30,
  onFrameChange
}: RemotionPreviewProps) {
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const playbackRef = useRef<NodeJS.Timeout | null>(null);

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.round(1000 / fps);
      playbackRef.current = setInterval(() => {
        setFrame((prev) => {
          const next = prev + 1;
          if (next >= durationInFrames) {
            return 0; // Loops back
          }
          return next;
        });
      }, intervalMs);
    } else {
      if (playbackRef.current) {
        clearInterval(playbackRef.current);
      }
    }

    return () => {
      if (playbackRef.current) {
        clearInterval(playbackRef.current);
      }
    };
  }, [isPlaying, fps, durationInFrames]);

  // Propagate frame updates
  useEffect(() => {
    if (onFrameChange) {
      onFrameChange(frame);
    }
  }, [frame, onFrameChange]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setFrame((prev) => (prev + 1 >= durationInFrames ? 0 : prev + 1));
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    setFrame((prev) => (prev - 1 < 0 ? durationInFrames - 1 : prev - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setFrame(0);
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlaying(false);
    setFrame(parseInt(e.target.value));
  };

  // Evaluate the typed code for the active frame
  const rootNode = parseAndEvaluateCode(code, frame, defaultProps);

  // Helper to render nodes recursively
  const renderVisualNode = (node: RenderedNode, index: number): React.ReactNode => {
    const key = `${node.type}_${index}`;
    
    // Style mappings (converting custom evaluation objects into actual CSS styles)
    const style: React.CSSProperties = {};
    if (node.style) {
      if (node.style.opacity !== undefined) style.opacity = node.style.opacity;
      if (node.style.scale !== undefined) style.transform = `scale(${node.style.scale})`;
    }

    // ClassName merging
    const className = node.className || '';

    switch (node.type) {
      case 'AbsoluteFill':
        return (
          <div 
            key={key} 
            className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden select-none ${className}`}
            style={style}
          >
            {node.children?.map((child, i) => renderVisualNode(child, i))}
          </div>
        );
      case 'Sequence':
        // Sequences display their children directly since active status check is handled in parseAndEvaluateCode
        return (
          <div key={key} className="contents">
            {node.children?.map((child, i) => renderVisualNode(child, i))}
          </div>
        );
      case 'h1':
        return (
          <h1 key={key} className={className} style={style}>
            {node.text}
          </h1>
        );
      case 'div':
        return (
          <div key={key} className={className} style={style}>
            {node.text}
            {node.children?.map((child, i) => renderVisualNode(child, i))}
          </div>
        );
      case 'span':
        return (
          <span key={key} className={className} style={style}>
            {node.text}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col bg-[#050b1a] rounded-2xl border border-[#1e293b] overflow-hidden select-none shadow-xl w-full">
      {/* Player Topbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d152a] border-b border-[#1e293b]">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-bold text-slate-300">Remotion Player (Prévisualisation Directe)</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono">
            {fps} FPS
          </div>
          <div className="text-[10px] bg-blue-950/40 text-blue-400 border border-blue-500/10 px-2 py-0.5 rounded-md font-mono">
            1080x1080 (1:1)
          </div>
        </div>
      </div>

      {/* Screen Canvas Container */}
      <div 
        ref={containerRef}
        className="relative bg-slate-950/70 aspect-square flex items-center justify-center p-6 border-b border-[#1e293b] overflow-hidden"
        style={{ backgroundImage: 'radial-gradient(circle, #10162a 1px, transparent 1px)', backgroundSize: '16px 16px' }}
      >
        {/* Glow halo behind video */}
        <div className="absolute w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Video Frame */}
        <div 
          className="relative aspect-square w-full max-w-[340px] bg-black shadow-2xl rounded-lg overflow-hidden border border-[#1e293b] transition-transform duration-300"
          style={{ transform: `scale(${scale})` }}
        >
          {/* Simulated rendering output */}
          {renderVisualNode(rootNode, 0)}

          {/* Grid visual overlay if paused */}
          {!isPlaying && (
            <div className="absolute inset-0 border border-blue-500/15 pointer-events-none flex items-center justify-center text-[10px] font-mono text-blue-500/30">
              <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-blue-500/15" />
              <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-blue-500/15" />
              <span className="absolute bottom-2 right-2 bg-slate-950/70 px-1 py-0.5 rounded">F:{frame}</span>
            </div>
          )}
        </div>
      </div>

      {/* Playback Controls & Timeline */}
      <div className="p-4 bg-[#0d152a] flex flex-col gap-3">
        {/* Progress Timeline */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-400 select-none w-10">
            F: {String(frame).padStart(3, '0')}
          </span>
          
          <input
            type="range"
            min="0"
            max={durationInFrames - 1}
            value={frame}
            onChange={handleTimelineChange}
            className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
          />
          
          <span className="text-[10px] font-mono text-slate-400 select-none w-10 text-right">
            S: {(frame / fps).toFixed(2)}s
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Retour au début (F:0)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleStepBackward}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Image précédente (-1 frame)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleTogglePlay}
              className={`p-2.5 rounded-full text-white transition-all transform hover:scale-105 active:scale-95 ${
                isPlaying ? 'bg-orange-600 hover:bg-orange-500' : 'bg-blue-600 hover:bg-blue-500'
              }`}
              title={isPlaying ? 'Pause' : 'Lecture (30 FPS)'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            <button
              onClick={handleStepForward}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Image suivante (+1 frame)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Scale Control */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-[#1e293b]">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Zoom</span>
            <select
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="bg-transparent text-xs text-slate-300 font-mono focus:outline-none cursor-pointer"
            >
              <option value="0.75" className="bg-[#0d152a]">75%</option>
              <option value="1.0" className="bg-[#0d152a]">100%</option>
              <option value="1.15" className="bg-[#0d152a]">115%</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
