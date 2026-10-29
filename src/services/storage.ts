import AsyncStorage from
  '@react-native-async-storage/async-storage';

import type {
  FormSubmission,
  FormValues,
} from '../types/form';

const STORAGE_KEY = '@formulario_dinamico/submissoes';

export async function getSubmissions():
  Promise<FormSubmission[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is FormSubmission =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        typeof item.id === 'string' &&
        'submittedAt' in item &&
        typeof item.submittedAt === 'string' &&
        'values' in item &&
        typeof item.values === 'object' &&
        item.values !== null &&
        !Array.isArray(item.values),
    );
  } catch {
    return [];
  }
}

export async function saveSubmission(
  values: FormValues,
): Promise<FormSubmission> {
  const previous = await getSubmissions();

  const submission: FormSubmission = {
    id: `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    submittedAt: new Date().toISOString(),
    values,
  };

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([submission, ...previous]),
  );

  return submission;
}

export async function clearSubmissions():
  Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}