import { useLocalSearchParams } from 'expo-router';
import { PackDetailScreen } from '@/screens/pack-detail';

/** Detalle de un set. También es el destino de conectados://pack/<slug>. */
export default function PackRoute() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <PackDetailScreen slug={slug} />;
}
