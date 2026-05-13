import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, FileText, File, ImageIcon } from 'lucide-react';
import { Node, Connection } from '../../types';
import { exportToJson, exportGraphToSvg, exportSvgAsPng } from '../../utils';

interface ExportPanelProps {
  onClose: () => void;
  nodes: Node[];
  connections: Connection[];
}

const ExportPanel: React.FC<ExportPanelProps> = ({ onClose, nodes, connections }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExportJson = () => {
    exportToJson({ nodes, connections }, 'flowforge-export');
  };

  const handleExportSvg = () => {
    const svg = exportGraphToSvg(nodes, connections);
    const element = document.createElement('a');
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    element.href = URL.createObjectURL(blob);
    element.download = 'flowforge-export.svg';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportPng = async () => {
    setIsProcessing(true);
    try {
      await exportSvgAsPng(nodes, connections, 'flowforge-export');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportPdfLayout = () => {
    const svg = exportGraphToSvg(nodes, connections, { pdfReady: true });
    const element = document.createElement('a');
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    element.href = URL.createObjectURL(blob);
    element.download = 'flowforge-pdf-layout.svg';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-strong rounded-3xl p-6 max-w-xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold">Export Workspace</h2>
            <p className="text-sm text-slate-400 mt-1">Download your visual system as JSON, SVG, PNG, or PDF-ready layouts.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-300 hover:bg-slate-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={handleExportJson}
            className="btn-primary flex items-center gap-3"
          >
            <FileText className="w-5 h-5" />
            Export JSON
          </button>

          <button
            onClick={handleExportSvg}
            className="btn-primary flex items-center gap-3"
          >
            <File className="w-5 h-5" />
            Export SVG
          </button>

          <button
            onClick={handleExportPng}
            className="btn-primary flex items-center gap-3"
            disabled={isProcessing}
          >
            <ImageIcon className="w-5 h-5" />
            {isProcessing ? 'Rendering PNG…' : 'Export PNG'}
          </button>

          <button
            onClick={handleExportPdfLayout}
            className="btn-secondary flex items-center gap-3"
          >
            <Download className="w-5 h-5" />
            PDF-ready Layout
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExportPanel;
