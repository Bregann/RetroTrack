import { useState, useEffect } from 'react';
import { type SavedFolder } from './modals/libraryModalTypes';
import AddGameModal from './modals/AddGameModal';
import AddFolderModal from './modals/AddFolderModal';
import ManageFoldersModal from './modals/ManageFoldersModal';
import ScanAllModal from './modals/ScanAllModal';
import { useInvalidateScannedGames } from '../helpers/useScannedGames';

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

interface ScanFolderRow {
  path: string;
  consoleId: number;
  consoleName: string;
  addedAt: string;
}

export default function LibraryModals({ mode, onClose }: LibraryModalsProps) {
  const [folders, setFolders] = useState<SavedFolder[]>([]);
  const invalidateScannedGames = useInvalidateScannedGames();

  const fetchFolderData = async (): Promise<SavedFolder[]> => {
    const rows: ScanFolderRow[] = await window.electron.scanner.getFolders();
    const allGames: { folderPath: string; consoleId: number }[] =
      await window.electron.scanner.getScannedGames();
    const countMap = new Map<string, number>();
    for (const g of allGames) {
      const key = `${g.folderPath}::${g.consoleId}`;
      countMap.set(key, (countMap.get(key) ?? 0) + 1);
    }
    return rows.map((r) => ({
      path: r.path,
      consoleId: r.consoleId,
      consoleName: r.consoleName,
      addedAt: new Date(r.addedAt).toLocaleDateString(),
      gameCount: countMap.get(`${r.path}::${r.consoleId}`) ?? 0,
    }));
  };

  // Used by ScanAllModal.onScanComplete — called from user interaction, not an effect
  const loadFolders = () => fetchFolderData().then(setFolders).catch(() => {});

  useEffect(() => {
    if (!mode) return;
    let cancelled = false;
    fetchFolderData()
      .then((data) => { if (!cancelled) setFolders(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [mode]);

  const handleFolderAdded = (folder: SavedFolder) => {
    setFolders((prev) => {
      const existing = prev.find(
        (f) => f.path === folder.path && f.consoleId === folder.consoleId,
      );
      if (existing) {
        return prev.map((f) =>
          f.path === folder.path && f.consoleId === folder.consoleId ? folder : f,
        );
      }
      return [...prev, folder];
    });
  };

  const handleRemoveFolder = async (path: string, consoleId: number) => {
    await window.electron.scanner.removeFolder(path, consoleId);
    setFolders((prev) => prev.filter((f) => !(f.path === path && f.consoleId === consoleId)));
    invalidateScannedGames();
  };

  const handleRescanFolder = (path: string, consoleId: number, matched: number) => {
    setFolders((prev) =>
      prev.map((f) =>
        f.path === path && f.consoleId === consoleId ? { ...f, gameCount: matched } : f,
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
          onScanComplete={loadFolders}
        />
      );
    default:
      return null;
  }
}
