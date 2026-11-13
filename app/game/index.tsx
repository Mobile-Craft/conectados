import { useLocalSearchParams } from 'expo-router';
import { GameSetupScreen } from '@/screens/game-setup';

export default function GameSetupRoute() {
  const { pack } = useLocalSearchParams<{ pack?: string }>();
  return <GameSetupScreen pack={pack} />;
}
