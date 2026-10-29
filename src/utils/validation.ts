import type {
  FormConfig,
  FormValues,
} from '../types/form';

export type ValidationErrors = Record<string, string>;

export function validateForm(
  config: FormConfig,
  values: FormValues,
): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const field of config.fields) {
    const value = values[field.id];

    if (field.required) {
      if (field.type === 'switch') {
        // Um switch desligado é uma resposta válida.
      } else if (field.type === 'checkbox') {
        if (value !== true) {
          errors[field.id] =
            'Você precisa marcar esta opção.';
        }
      } else if (
        value === undefined ||
        (typeof value === 'string' &&
          value.trim() === '')
      ) {
        errors[field.id] =
          'Este campo é obrigatório.';
      }
    }

    if (
      field.type === 'email' &&
      typeof value === 'string' &&
      value.trim() !== '' &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ) {
      errors[field.id] =
        'Digite um endereço de e-mail válido.';
    }

    if (
      field.type === 'number' &&
      typeof value === 'string' &&
      value.trim() !== '' &&
      !Number.isFinite(Number(value))
    ) {
      errors[field.id] =
        'Digite um número válido.';
    }

    if (
      field.type === 'date' &&
      typeof value === 'string' &&
      value.trim() !== '' &&
      !isValidDate(value)
    ) {
      errors[field.id] =
        'Informe uma data válida no formato AAAA-MM-DD.';
    }
  }

  return errors;
}

function isValidDate(value: string): boolean {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    Date.UTC(year, month - 1, day),
  );

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}