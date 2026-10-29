# Formulário Dinâmico — React Native

## GRUPO
Alexandre Colvet  - RM560059
Enzo Luciano      - RM559557
Luigi Thiengo     - RM560755
Pedro Claudino    - RM561023
Witalon Rodrigues - RM559023

## Descrição

Aplicativo desenvolvido para o Checkpoint 3 de React Native.
O projeto cria formulários dinamicamente a partir de uma
configuração TypeScript, permitindo configurar campos,
rótulos, opções e obrigatoriedade.

A aplicação realiza validações, apresenta os dados enviados
e armazena o histórico localmente com AsyncStorage.

## Tecnologias utilizadas

- React Native
- Expo SDK 55
- TypeScript
- AsyncStorage
- React Hooks
- StyleSheet e Flexbox

## Funcionalidades

- Geração dinâmica de formulários.
- Dez tipos de campos.
- Validação de campos obrigatórios.
- Validação de e-mail, número e data.
- Exibição dos dados submetidos.
- Persistência local com AsyncStorage.
- Recuperação do histórico.
- Limpeza dos cadastros salvos.
- Compatibilidade planejada com Android, iOS e Web.

## Como executar

Instale as dependências:

    npm install

Inicie o aplicativo:

    npx expo start

Para executar na Web:

    npx expo start --web

Para executar no Android, utilize um dispositivo ou
emulador compatível com a versão do Expo utilizada.

## Estrutura de pastas

    FormularioDinamico/
    ├── App.tsx
    ├── README.md
    └── src/
        ├── components/
        │   └── DynamicField.tsx
        ├── config/
        │   └── formConfig.ts
        ├── services/
        │   └── storage.ts
        ├── types/
        │   └── form.ts
        └── utils/
            └── validation.ts

## Integrantes

- NOME COMPLETO — RM XXXXX

## Evidências

Adicione capturas de tela da aplicação em funcionamento,
incluindo o formulário, a validação e o histórico salvo.