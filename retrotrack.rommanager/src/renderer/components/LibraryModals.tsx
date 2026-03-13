import { useState } from 'react';
import { type SavedFolder } from './modals/libraryModalTypes';
import AddGameModal from './modals/AddGameModal';
import AddFolderModal from './modals/AddFolderModal';
import ManageFoldersModal from './modals/ManageFoldersModal';
import ScanAllModal from './modals/ScanAllModal';

export type LibraryModalMode =
  | 'add-game'
  | 'add-folder'
  | 'manage-folders'
  | 'scan-all'
  | null;

interface LibraryModalsProps {
  mode: LibraryModalMode;
  onClose: () => void;
}

export default function LibraryModals({ mode, onClose }: LibraryModalsProps) {
  const [folders, setFolders] = useState<SavedFolder[]>([
    { path: 'C:\\ROMs\\SNES', addedAt: '12/01/2025', gameCount: 14 },
    { path: 'C:\\ROMs\\Genesis', addedAt: '12/01/2025', gameCount: 8 },
  ]);

  const handleFolderAdded = (folder: SavedFolder) => {
    setFolders((prev) => {
      if (prev.some((f) => f.path === folder.path)) return prev;
      return [...prev, folder];
    });
  };

  const handleRemoveFolder = (path: string) => {
    setFolders((prev) => prev.filter((f) => f.path !== path));
  };

  const handleRescanFolder = (path: string) => {
    setFolders((prev) =>
      prev.map((f) =>
        f.path === path
          ? { ...f, gameCount: f.gameCount + Math.floor(Math.random() * 3) }
          : f,
      ),
    );
  };

  if (!mode) return null;

  switch (mode) {
    case 'add-game':
      return <AddGameModal onClose={onClose} />;
    case 'add-folder':
      return <AddFolderModal onClose={onClose} onFolderAdded={handleFolderAdded} />;
    case 'manage-folders':
      return (
        <ManageFoldersModal
          onClose={onClose}
          folders={folders}
          onRemoveFolder={handleRemoveFolder}
          onRescanFolder={handleRescanFolder}
        />
      );
    case 'scan-all':
      return (
        <ScanAllModal
          onClose={onClose}
          folders={folders}
          onScanComplete={() => {}}
        />
      );
    default:
      return null;
  }
}
