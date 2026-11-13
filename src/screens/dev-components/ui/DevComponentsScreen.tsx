import { useState, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { PackCard } from '@/entities/pack';
import { intensityText, QuestionCard } from '@/entities/question';
import { ThemeSwitch } from '@/features/theme-switch';
import {
  Avatar,
  Button,
  Card,
  Chip,
  createStyles,
  EmptyState,
  Input,
  Screen,
  SegmentedControl,
  Sheet,
  Skeleton,
  Stack,
  Text,
  Toast,
  type ButtonVariant,
  type ChipScale,
  type TextVariant,
} from '@/shared/ui';

const TEXT_VARIANTS: readonly TextVariant[] = [
  'questionS',
  'title1',
  'title2',
  'title3',
  'body',
  'bodyStrong',
  'label',
  'callout',
  'caption',
  'overline',
];
const BUTTON_VARIANTS: readonly ButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger'];
const SCALE: readonly ChipScale[] = [1, 2, 3, 4, 5];
const INTENSITY_NAMES = ['Suave', 'Tranquila', 'Media', 'Intensa', 'Muy intensa'];
const noop = () => {};

function Section({ title, children }: { title: string; children: ReactNode }) {
  const styles = useStyles();
  return (
    <View style={styles.section}>
      <Text variant="overline" tone="secondary" accessibilityRole="header">
        {title}
      </Text>
      {children}
    </View>
  );
}

/**
 * Catálogo interno de componentes (HU-1.3): todos los genéricos y los de dominio con sus
 * variantes y estados, y el conmutador de tema arriba para revisarlos de un vistazo en ambos.
 * Solo existe en desarrollo.
 */
export function DevComponentsScreen() {
  const styles = useStyles();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [chips, setChips] = useState<string[]>(['Confesión']);
  const [mode, setMode] = useState<'solo' | 'grupo'>('grupo');
  const [name, setName] = useState('');
  const toggle = (chip: string) =>
    setChips((all) => (all.includes(chip) ? all.filter((c) => c !== chip) : [...all, chip]));

  return (
    <Screen centered={false} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Section title="Tema">
          <ThemeSwitch />
        </Section>

        <Section title="Carta de pregunta">
          <QuestionCard
            category="Confesión"
            text="¿Qué secreto nunca le contaste a nadie de esta mesa?"
            intensity={{ level: 4, label: 'Intensa' }}
            tags={['Confesión', 'Todos']}
          />
          <QuestionCard category="Rápida" text="¿Café o té?" />
          <QuestionCard
            text="Si pudieras volver a vivir un solo día de los últimos diez años, sin cambiar nada de lo que pasó, ¿cuál elegirías y con quién lo pasarías?"
            intensity={{ level: 2, label: 'Tranquila' }}
          />
        </Section>

        <Section title="Tarjeta de set">
          <PackCard
            title="Viejos amigos"
            questionCount={24}
            intensityText={intensityText({ level: 4, label: 'Intensa' })}
            onPress={noop}
          />
          <PackCard title="Primera cita" questionCount={1} />
        </Section>

        <Section title="Botones">
          {BUTTON_VARIANTS.map((variant) => (
            <Stack key={variant} direction="row" gap={2} wrap>
              <Button label={variant} variant={variant} onPress={noop} />
              <Button label="Desactivado" variant={variant} disabled />
              <Button label="Cargando" variant={variant} loading />
            </Stack>
          ))}
          <Button label="Grande y a lo ancho" size="lg" fullWidth onPress={noop} />
        </Section>

        <Section title="Chips">
          <Stack direction="row" gap={2} wrap>
            {['Confesión', 'Risas', 'Recuerdos'].map((chip) => (
              <Chip
                key={chip}
                label={chip}
                selected={chips.includes(chip)}
                onPress={() => toggle(chip)}
              />
            ))}
            <Chip label="Desactivado" onPress={noop} disabled />
          </Stack>
          <Stack direction="row" gap={2} wrap>
            <Chip label="Informativo" />
            <Chip label="Destacado" highlighted />
            {SCALE.map((level) => (
              <Chip key={level} label={`${INTENSITY_NAMES[level - 1]} · ${level}`} scale={level} />
            ))}
          </Stack>
        </Section>

        <Section title="Selector">
          <SegmentedControl
            accessibilityLabel="Modo de juego"
            options={[
              { value: 'solo', label: 'Solo' },
              { value: 'grupo', label: 'En grupo' },
            ]}
            value={mode}
            onChange={setMode}
          />
        </Section>

        <Section title="Tarjetas">
          <Card>
            <Text variant="bodyStrong">Cristal</Text>
            <Text tone="secondary">Desenfoca la aurora que tiene detrás.</Text>
          </Card>
          <Card variant="outlined">
            <Text variant="bodyStrong">Con borde</Text>
            <Text tone="secondary">Sin desenfoque, para listas largas.</Text>
          </Card>
          <Card variant="filled" onPress={noop} accessibilityLabel="Tarjeta opaca y táctil">
            <Text variant="bodyStrong">Opaca y táctil</Text>
            <Text tone="secondary">Tócala: se nota al presionar.</Text>
          </Card>
        </Section>

        <Section title="Avatares">
          <Stack direction="row" gap={3} align="center">
            <Avatar name="Ana López" size="sm" />
            <Avatar name="Bruno" size="md" />
            <Avatar name="Carla María Ruiz" size="lg" />
          </Stack>
        </Section>

        <Section title="Campos">
          <Input label="Nombre" placeholder="Cómo te llaman" value={name} onChangeText={setName} />
          <Input label="Con ayuda" helper="Máximo 20 letras." />
          <Input label="Con error" error="Este nombre ya está en la mesa." />
          <Input label="Desactivado" value="No se puede cambiar" disabled />
        </Section>

        <Section title="Hoja y aviso">
          <Stack direction="row" gap={2} wrap>
            <Button label="Abrir hoja" variant="secondary" onPress={() => setSheetOpen(true)} />
            <Button label="Mostrar aviso" variant="secondary" onPress={() => setToastOpen(true)} />
          </Stack>
        </Section>

        <Section title="Cargando">
          <Skeleton width="60%" height={20} />
          <Skeleton height={56} radius="xl" />
        </Section>

        <Section title="Vacío">
          <EmptyState
            title="Aún no tienes sets"
            description="Crea uno con tu propia historia o elige uno de la tienda."
            actionLabel="Crear set"
            onAction={noop}
          />
        </Section>

        <Section title="Tipografía">
          {TEXT_VARIANTS.map((variant) => (
            <Text key={variant} variant={variant}>
              {variant}
            </Text>
          ))}
          <Text tone="secondary">Secundario</Text>
          <Text tone="muted">Apagado</Text>
          <Text tone="accent">Acento</Text>
        </Section>
      </ScrollView>

      <Sheet visible={sheetOpen} title="Opciones de la partida" onClose={() => setSheetOpen(false)}>
        <Text tone="secondary">Cristal fuerte sobre un velo; se cierra tocando fuera.</Text>
        <Button label="Entendido" fullWidth onPress={() => setSheetOpen(false)} />
      </Sheet>
      <Toast
        visible={toastOpen}
        message="Pregunta saltada"
        actionLabel="Deshacer"
        onAction={noop}
        onHide={() => setToastOpen(false)}
      />
    </Screen>
  );
}

const useStyles = createStyles((t) => ({
  screen: { padding: 0 },
  content: { padding: t.space[5], gap: t.space[8], paddingBottom: t.space[16] },
  section: { gap: t.space[3] },
}));
