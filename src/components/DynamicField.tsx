import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  StyleSheet,
} from 'react-native';

import type {
  FieldType,
  FormFieldConfig,
} from '../types/form';

interface DynamicFieldProps {
  field: FormFieldConfig;
  value: string | boolean | undefined;
  error?: string;
  onChange: (id: string, value: string | boolean) => void;
}

export default function DynamicField({
  field,
  value,
  error,
  onChange,
}: DynamicFieldProps) {
  const stringValue =
    typeof value === 'string' ? value : '';

  const isSelected = value === true;

  const renderTextInput = (
    type: FieldType,
  ) => {
    const isMultiline = type === 'multiline';

    const keyboardType =
      type === 'email'
        ? 'email-address'
        : type === 'number'
          ? 'numeric'
          : 'default';

    return (
      <TextInput
        value={stringValue}
        onChangeText={(text) =>
          onChange(field.id, text)
        }
        placeholder={field.placeholder ?? 'Digite aqui'}
        placeholderTextColor="#8A94A6"
        secureTextEntry={type === 'password'}
        keyboardType={keyboardType}
        autoCapitalize={
          type === 'email' ? 'none' : 'sentences'
        }
        multiline={isMultiline}
        textAlignVertical={
          isMultiline ? 'top' : 'center'
        }
        style={[
          styles.input,
          isMultiline && styles.multiline,
        ]}
      />
    );
  };

  const renderOptions = (
    type: 'select' | 'radio',
  ) => (
    <View style={styles.options}>
      {field.options?.map((option) => {
        const selected =
          stringValue === option.value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() =>
              onChange(field.id, option.value)
            }
            style={[
              styles.option,
              selected && styles.selectedOption,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                selected && styles.selectedOptionText,
              ]}
            >
              {type === 'radio'
                ? `${selected ? '🔘' : '◯'} `
                : ''}
              {option.label}
              {type === 'select' && selected
                ? '  ✓'
                : ''}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  const renderControl = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'multiline':
      case 'date':
        return renderTextInput(field.type);

      case 'select':
        return renderOptions('select');

      case 'radio':
        return renderOptions('radio');

      case 'checkbox':
        return (
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSelected }}
            onPress={() =>
              onChange(field.id, !isSelected)
            }
            style={styles.checkRow}
          >
            <View
              style={[
                styles.checkbox,
                isSelected && styles.checked,
              ]}
            >
              {isSelected && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <Text style={styles.optionText}>
              {isSelected ? 'Selecionado' : 'Marcar'}
            </Text>
          </Pressable>
        );

      case 'switch':
        return (
          <View style={styles.switchRow}>
            <Text style={styles.optionText}>
              {isSelected ? 'Ativado' : 'Desativado'}
            </Text>
            <Switch
              value={isSelected}
              onValueChange={(nextValue) =>
                onChange(field.id, nextValue)
              }
              trackColor={{
                false: '#CBD2DE',
                true: '#2563EB',
              }}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {field.label}
        {field.required ? ' *' : ''}
      </Text>

      {renderControl()}

      {field.type === 'date' && (
        <Text style={styles.hint}>
          Informe a data no formato AAAA-MM-DD.
        </Text>
      )}

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#202B3C',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D8DEE9',
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontSize: 15,
    color: '#202B3C',
    backgroundColor: '#FFFFFF',
  },
  multiline: {
    minHeight: 100,
    paddingTop: 12,
  },
  options: {
    gap: 8,
  },
  option: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D8DEE9',
    backgroundColor: '#FFFFFF',
  },
  selectedOption: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  optionText: {
    color: '#263449',
    fontSize: 14,
  },
  selectedOptionText: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 5,
  },
  checkbox: {
    width: 23,
    height: 23,
    borderWidth: 1,
    borderColor: '#9AA6B8',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  hint: {
    fontSize: 12,
    color: '#697586',
    marginTop: 5,
  },
  error: {
    color: '#C62828',
    marginTop: 5,
    fontSize: 13,
  },
});