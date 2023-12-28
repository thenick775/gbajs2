import { useLocalStorage } from '@uidotdev/usehooks';
import {
  createContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction
} from 'react';

import {
  emulatorKeyBindingsLocalStorageKey,
  emulatorVolumeLocalStorageKey
} from './consts.tsx';
import { fadeCanvas } from '../../components/screen/fade.ts';
import { useEmulator } from '../../hooks/use-emulator.tsx';
import { useLayouts } from '../../hooks/use-layouts.tsx';

import type {
  GBAEmulator,
  KeyBinding
} from '../../emulator/mgba/mgba-emulator.tsx';

type EmulatorContextProps = {
  emulator: GBAEmulator | null;
  canvas: HTMLCanvasElement | null;
  videoDimensions: { width: number; height: number } | null;
  setCanvas: Dispatch<SetStateAction<HTMLCanvasElement | null>>;
  isEmulatorRunning: boolean;
  areItemsDraggable: boolean;
  setAreItemsDraggable: Dispatch<SetStateAction<boolean>>;
  areItemsResizable: boolean;
  setAreItemsResizable: Dispatch<SetStateAction<boolean>>;
};

type EmulatorProviderProps = {
  children: ReactNode;
};

export const EmulatorContext = createContext<EmulatorContextProps>({
  emulator: null,
  canvas: null,
  videoDimensions: null,
  setCanvas: () => undefined,
  isEmulatorRunning: false,
  areItemsDraggable: false,
  setAreItemsDraggable: () => undefined,
  areItemsResizable: false,
  setAreItemsResizable: () => undefined
});

export const EmulatorProvider = ({ children }: EmulatorProviderProps) => {
  const [canvas, setCanvas] = useState<EmulatorContextProps['canvas']>(null);
  const [isEmulatorRunning, setIsEmulatorRunning] = useState(false);
  const [areItemsDraggable, setAreItemsDraggable] = useState(false);
  const [areItemsResizable, setAreItemsResizable] = useState(false);
  const { hasSetLayout, clearLayouts } = useLayouts();
  const [currentEmulatorVolume] = useLocalStorage(
    emulatorVolumeLocalStorageKey,
    1
  );
  const emulator = useEmulator(canvas);
  const [currentKeyBindings] = useLocalStorage<KeyBinding[] | undefined>(
    emulatorKeyBindingsLocalStorageKey
  );
  const [videoDimensions, setVideoDimensions] = useLocalStorage<{
    width: number;
    height: number;
  } | null>('videoDimensions', null);

  const emu = useMemo<GBAEmulator | null>(() => {
    if (!emulator) return null;

    const run = (romPath: string) => {
      const isSuccessfulRun = emulator.run(romPath);
      setIsEmulatorRunning(isSuccessfulRun);
      emulator.setVolume(currentEmulatorVolume);

      if (currentKeyBindings) emulator.remapKeyBindings(currentKeyBindings);

      if (canvas)
        setVideoDimensions({ width: canvas.width, height: canvas.height });

      if (isSuccessfulRun && !hasSetLayout) clearLayouts();

      return isSuccessfulRun;
    };

    const stateBasedOverrides = {
      run,
      quickReload: () => {
        if (isEmulatorRunning) {
          emulator.quickReload();
        } else if (emulator.getCurrentGameName()) {
          const isSuccessfulRun = run(
            emulator.filePaths().gamePath + '/' + emulator.getCurrentGameName()
          );
          setIsEmulatorRunning(isSuccessfulRun);
        }
      },
      quitGame: () => {
        fadeCanvas(canvas, emulator.screenShot);
        emulator.quitGame();
        setIsEmulatorRunning(false);
      },
      quitEmulator: () => {
        fadeCanvas(canvas, emulator.screenShot);
        emulator.quitEmulator();
        setIsEmulatorRunning(false);
      }
    };

    return {
      ...emulator,
      ...stateBasedOverrides
    };
  }, [
    emulator,
    isEmulatorRunning,
    canvas,
    currentEmulatorVolume,
    currentKeyBindings,
    setVideoDimensions,
    clearLayouts,
    hasSetLayout
  ]);

  return (
    <EmulatorContext.Provider
      value={{
        emulator: emu,
        canvas,
        videoDimensions,
        setCanvas,
        isEmulatorRunning,
        areItemsDraggable,
        setAreItemsDraggable,
        areItemsResizable,
        setAreItemsResizable
      }}
    >
      {children}
    </EmulatorContext.Provider>
  );
};
