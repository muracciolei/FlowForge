# FlowForge

A premium, futuristic Progressive Web App for visual workflow and system architecture design. Build complex diagrams, flows, and system designs with an infinite canvas, powerful node system, and stunning cyberpunk UI.

## Features

### 🎨 Infinite Canvas
- Smooth pan and zoom with mouse wheel
- High-performance rendering with grid system
- Dynamic background effects
- Minimap navigation
- Smooth kinetic motion
- Magnetic snapping

### 🔧 Advanced Node System
Support for 10+ node types:
- Text nodes for documentation
- Logic and decision nodes for workflows
- API architecture nodes
- AI/ML workflow nodes
- Database connection nodes
- Code snippet nodes
- Group/container nodes
- Media nodes
- Markdown nodes
- And more!

### 🔗 Intelligent Connections
- Animated connection lines with curve algorithms
- Futuristic edge styling
- Flow animation through links
- Smart rerouting
- Dynamic edge glow effects
- Multiple connection styles

### 🎭 Visual Themes
Five immersive themes to choose from:
- **Neon Grid** - Classic cyberpunk neon aesthetic
- **Quantum Dark** - Deep space quantum computing vibes
- **Arctic Signal** - Cool blue signal processing style
- **Deep Space** - Purple void with cosmic energy
- **Industrial Hologram** - Green holographic tech aesthetic

Each theme customizes:
- Canvas background and grid
- Node colors and borders
- Connection styles and glow
- UI accent colors
- Lighting effects

### ⚡ Productivity Features
- Drag-and-drop node creation from library
- Multi-select with bounding box
- Copy/paste nodes
- Undo/redo support
- Keyboard shortcuts
- Search system
- Smart alignment guides
- Node grouping system
- Collapsible nodes
- Resizable nodes

### 📚 Built-in Templates
Pre-built templates for common use cases:
- AI agent workflows
- Cloud architecture diagrams
- Startup planning canvases
- API system design
- Software architecture
- Study mind maps
- Business process flows
- Automation pipelines

### 💾 Local-First Persistence
- IndexedDB for project storage
- Automatic autosave every 5 seconds
- Session restoration
- Template management
- No account or authentication required
- 100% data stays on your device

### 📤 Export System
Export your diagrams to:
- PNG (raster image)
- SVG (vector graphic)
- JSON (for backup/sharing)
- PDF-ready layouts

### 🌐 PWA Support
- Installable as native app
- Offline support
- Native app feeling
- Custom splash screen
- App manifest
- Service worker
- Works on all devices

## Getting Started

### Prerequisites
- Node.js 16+ (for development)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd FlowForge

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

```bash
# Start dev server (opens in browser)
npm run dev

# Type check
npm run type-check

# Format code
npm run format
```

## Project Structure

```
FlowForge/
├── public/              # PWA manifest, icons, assets
├── src/
│   ├── components/      # React components
│   │   ├── canvas/      # Canvas and rendering
│   │   ├── nodes/       # Node components
│   │   ├── panels/      # UI panels
│   │   └── ui/          # UI components
│   ├── db/              # Dexie database setup
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Zustand state management
│   ├── templates/       # Built-in templates
│   ├── themes/          # Theme definitions
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   ├── index.css        # Global styles
│   └── main.tsx         # Entry point
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS config
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies and scripts
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS
- **Zustand** - Lightweight state management
- **Framer Motion** - Animation library
- **Dexie** - IndexedDB wrapper
- **Lucide React** - Icon library
- **Vite PWA Plugin** - PWA support
- **Canvas/SVG** - Graphics rendering

## Key Concepts

### State Management
Uses Zustand for global state (nodes, connections, UI state). Persists to localStorage for offline support.

### Database
IndexedDB via Dexie for:
- Project storage
- Template library
- Session management
- Offline data

### Themes
Dynamic theme system that affects:
- Canvas appearance
- Node styling
- Connection rendering
- UI colors and glows

### Canvas Rendering
Custom infinite canvas implementation with:
- Pan and zoom
- Grid system
- SVG connections
- High-performance node rendering

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Scroll` | Zoom in/out |
| `Right-click + drag` | Pan canvas |
| `Click` | Select node |
| `Ctrl/Cmd + Click` | Multi-select |
| `Delete` | Remove selected nodes |
| `Ctrl/Cmd + D` | Duplicate selected |
| `Ctrl/Cmd + A` | Select all |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `G` | Group selected nodes |

## Customization

### Adding New Node Types
1. Add type to `NodeType` in `src/types/index.ts`
2. Add icon in `NodeComponent.tsx`
3. Add to node library in `NodeLibrary.tsx`
4. Customize styling in `NodeComponent.tsx`

### Creating Custom Themes
1. Add theme to `src/themes/index.ts` in THEMES object
2. Define colors and effects
3. Make available in theme selector

### Extending Templates
1. Add new template to `src/templates/index.ts`
2. Define nodes and connections
3. Categorize appropriately

## Performance Optimization

- Virtual canvas rendering for large diagrams
- Throttled pan/zoom events
- Debounced saves
- Lazy-loaded components
- Code splitting via Vite
- Optimized re-renders with React.memo

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14.4+, Chrome Android)

## Offline Support

FlowForge works completely offline:
- All data stored locally in IndexedDB
- Service worker caches all assets
- No server required
- No authentication needed
- Works in airplane mode

## Future Roadmap

- Real-time collaboration
- Plugin system
- Advanced export (PDF, image annotations)
- Custom node types
- Workflow execution
- Integration marketplace
- Desktop app wrapper
- Premium features

## Support

If you find FlowForge valuable, consider supporting its development:

**[Buy Me a Coffee](https://buymeacoffee.com/muracciolei)**

Your support helps keep FlowForge free, ad-free, and actively developed.

## License

MIT License - See LICENSE file for details

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## Credits

Inspired by:
- Figma's design system
- Node-RED's visual programming
- Obsidian's canvas
- Modern AI workflow builders
- Sci-fi operating systems

---

**Built with ❤️ for creators, architects, and visionaries.**

FlowForge - *Where ideas flow, systems emerge.*
