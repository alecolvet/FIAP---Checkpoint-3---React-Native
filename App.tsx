import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import DynamicField from './src/components/DynamicField';
import { formConfig } from './src/config/formConfig';

import {
  clearSubmissions,
  getSubmissions,
  saveSubmission,
} from './src/services/storage';

import { validateForm } from './src/utils/validation';

import type {
  FormSubmission,
  FormValues,
} from './src/types/form';

export default function App() {
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissions, setSubmissions] =
    useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  const requiredCount = useMemo(
    () =>
      formConfig.fields.filter(
        (field) => field.required,
      ).length,
    [],
  );

  const loadSubmissions = useCallback(async () => {
    try {
      const saved = await getSubmissions();
      setSubmissions(saved);
    } catch {
      setFeedback('Não foi possível carregar o histórico.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSubmissions();
  }, [loadSubmissions]);

  const handleChange = useCallback(
    (id: string, value: string | boolean) => {
      setValues((previous) => ({
        ...previous,
        [id]: value,
      }));

      setErrors((previous) => {
        if (!(id in previous)) {
          return previous;
        }

        const next = { ...previous };
        delete next[id];
        return next;
      });

      setFeedback('');
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    const validationErrors =
      validateForm(formConfig, values);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setFeedback(
        'Revise os campos destacados antes de continuar.',
      );
      return;
    }

    setSaving(true);
    setFeedback('');

    try {
      const submission = await saveSubmission(values);

      setSubmissions((previous) => [
        submission,
        ...previous,
      ]);

      setValues({});
      setErrors({});
      setFeedback('Cadastro salvo com sucesso!');

    } catch {
      setFeedback(
        'Não foi possível salvar. Tente novamente.',
      );
    } finally {
      setSaving(false);
    }
  }, [values]);

  const handleClear = useCallback(() => {
    const performClear = async () => {
      try {
        await clearSubmissions();
        setSubmissions([]);
        setFeedback('Histórico apagado com sucesso.');
      } catch {
        setFeedback(
          'Não foi possível apagar o histórico.',
        );
      }
    };

    if (Platform.OS === 'web') {
      const confirmed =
        typeof globalThis.confirm === 'function'
          ? globalThis.confirm(
              'Deseja apagar todos os cadastros salvos?',
            )
          : true;

      if (confirmed) {
        void performClear();
      }
      return;
    }

    Alert.alert(
      'Limpar histórico',
      'Deseja apagar todos os cadastros salvos?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: () => {
            void performClear();
          },
        },
      ],
    );
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.page}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            CHECKPOINT 3 · REACT NATIVE
          </Text>

          <Text style={styles.title}>
            {formConfig.title}
          </Text>

          <Text style={styles.description}>
            {formConfig.description}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Seus dados
          </Text>

          <Text style={styles.helper}>
            Os campos com * são obrigatórios.
            {'\n'}
            Total de campos obrigatórios: {requiredCount}.
          </Text>

          {formConfig.fields.map((field) => (
            <DynamicField
              key={field.id}
              field={field}
              value={values[field.id]}
              error={errors[field.id]}
              onChange={handleChange}
            />
          ))}

          {feedback ? (
            <Text
              accessibilityRole="alert"
              style={[
                styles.feedback,
                feedback.includes('sucesso')
                  ? styles.success
                  : styles.failure,
              ]}
            >
              {feedback}
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            disabled={saving}
            onPress={() => void handleSubmit()}
            style={[
              styles.primaryButton,
              saving && styles.disabledButton,
            ]}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>
                Enviar cadastro
              </Text>
            )}
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Histórico de cadastros
          </Text>

          {loading ? (
            <ActivityIndicator color="#2563EB" />
          ) : submissions.length === 0 ? (
            <Text style={styles.empty}>
              Nenhum cadastro salvo ainda.
            </Text>
          ) : (
            submissions.map((submission) => (
              <View
                key={submission.id}
                style={styles.submission}
              >
                <Text style={styles.submissionTitle}>
                  Cadastro em{' '}
                  {new Date(
                    submission.submittedAt,
                  ).toLocaleString('pt-BR')}
                </Text>

                {formConfig.fields.map((field) => {
                  const value =
                    submission.values[field.id];

                  if (
                    value === undefined ||
                    value === ''
                  ) {
                    return null;
                  }

                  const displayValue =
                    field.type === 'password'
                      ? '••••••••'
                      : field.type === 'select' ||
                          field.type === 'radio'
                        ? field.options?.find(
                            (option) =>
                              option.value === value,
                          )?.label ?? String(value)
                        : typeof value === 'boolean'
                          ? value
                            ? 'Sim'
                            : 'Não'
                          : String(value);

                  return (
                    <Text
                      key={field.id}
                      style={styles.resultText}
                    >
                      {field.label}: {displayValue}
                    </Text>
                  );
                })}
              </View>
            ))
          )}

          <Pressable
            accessibilityRole="button"
            onPress={handleClear}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>
              Limpar histórico salvo
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          Dados armazenados localmente com AsyncStorage.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F6FB',
  },
  page: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 16,
    marginBottom: 22,
  },
  eyebrow: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  title: {
    color: '#172338',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  description: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 23,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#172338',
    marginBottom: 8,
  },
  helper: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 22,
  },
  feedback: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
    overflow: 'hidden',
  },
  success: {
    color: '#166534',
    backgroundColor: '#DCFCE7',
  },
  failure: {
    color: '#B91C1C',
    backgroundColor: '#FEE2E2',
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 13,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
  empty: {
    color: '#64748B',
    paddingVertical: 16,
  },
  submission: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 13,
    marginTop: 10,
    marginBottom: 6,
    gap: 6,
  },
  submissionTitle: {
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 5,
  },
  resultText: {
    color: '#334155',
    fontSize: 13,
    lineHeight: 19,
  },
  clearButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 10,
    padding: 13,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#DC2626',
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
});