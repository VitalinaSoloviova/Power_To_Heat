import { useContext } from 'react';
import { SettingsContext } from './settingsTypes';

export const useSettings = () => useContext(SettingsContext);
